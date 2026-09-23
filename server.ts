import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { Chess } from 'chess.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

interface Player {
  id: string;
  name: string;
  color: 'white' | 'black';
  ws: WebSocket;
  connected: boolean;
}

interface RoomState {
  roomId: string;
  fen: string;
  history: Array<{ san: string; from: string; to: string; color: string }>;
  whitePlayer: Player | null;
  blackPlayer: Player | null;
  timeControl: number; // seconds, default 600 (10 min)
  whiteTime: number;
  blackTime: number;
  lastMoveTimestamp: number | null;
  status: 'waiting' | 'playing' | 'checkmate' | 'draw' | 'stalemate' | 'resigned' | 'timeout';
  winner: 'white' | 'black' | 'draw' | null;
  activeTurn: 'w' | 'b';
  chat: Array<{ sender: string; text: string; time: string; color?: string }>;
}

const rooms = new Map<string, RoomState>();

function broadcastRoom(room: RoomState) {
  const payload = JSON.stringify({
    type: 'ROOM_UPDATE',
    room: {
      roomId: room.roomId,
      fen: room.fen,
      history: room.history,
      timeControl: room.timeControl,
      whiteTime: room.whiteTime,
      blackTime: room.blackTime,
      status: room.status,
      winner: room.winner,
      activeTurn: room.activeTurn,
      chat: room.chat,
      whitePlayer: room.whitePlayer
        ? { id: room.whitePlayer.id, name: room.whitePlayer.name, color: 'white', connected: room.whitePlayer.connected }
        : null,
      blackPlayer: room.blackPlayer
        ? { id: room.blackPlayer.id, name: room.blackPlayer.name, color: 'black', connected: room.blackPlayer.connected }
        : null
    }
  });

  if (room.whitePlayer?.ws?.readyState === WebSocket.OPEN) {
    room.whitePlayer.ws.send(payload);
  }
  if (room.blackPlayer?.ws?.readyState === WebSocket.OPEN) {
    room.blackPlayer.ws.send(payload);
  }
}

// Timer tick for playing rooms
setInterval(() => {
  const now = Date.now();
  rooms.forEach((room) => {
    if (room.status !== 'playing' || !room.lastMoveTimestamp) return;

    const elapsed = Math.floor((now - room.lastMoveTimestamp) / 1000);
    if (elapsed <= 0) return;

    room.lastMoveTimestamp = now;

    if (room.activeTurn === 'w') {
      room.whiteTime = Math.max(0, room.whiteTime - elapsed);
      if (room.whiteTime <= 0) {
        room.status = 'timeout';
        room.winner = 'black';
        broadcastRoom(room);
      }
    } else {
      room.blackTime = Math.max(0, room.blackTime - elapsed);
      if (room.blackTime <= 0) {
        room.status = 'timeout';
        room.winner = 'white';
        broadcastRoom(room);
      }
    }
  });
}, 1000);

wss.on('connection', (ws: WebSocket) => {
  let currentRoomId: string | null = null;
  let playerId: string | null = null;

  ws.on('message', (data: string) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === 'JOIN_ROOM') {
        const { roomId, playerName, preferredColor, timeMinutes } = msg;
        const validRoomId = String(roomId || '').trim().toUpperCase() || Math.random().toString(36).substring(2, 7).toUpperCase();
        currentRoomId = validRoomId;
        const validPlayerId = String(msg.playerId || playerId || Math.random().toString(36).substring(2, 9));
        playerId = validPlayerId;

        let room = rooms.get(validRoomId);
        if (!room) {
          const time = (Number(timeMinutes) || 10) * 60;
          room = {
            roomId: validRoomId,
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            history: [],
            whitePlayer: null,
            blackPlayer: null,
            timeControl: time,
            whiteTime: time,
            blackTime: time,
            lastMoveTimestamp: null,
            status: 'waiting',
            winner: null,
            activeTurn: 'w',
            chat: []
          };
          rooms.set(validRoomId, room);
        }

        const activeRoom = room;

        // Reconnection or assignment
        const existingPlayer =
          (activeRoom.whitePlayer?.id === validPlayerId && activeRoom.whitePlayer) ||
          (activeRoom.blackPlayer?.id === validPlayerId && activeRoom.blackPlayer);

        if (existingPlayer) {
          existingPlayer.ws = ws;
          existingPlayer.connected = true;
          if (playerName) existingPlayer.name = String(playerName);
        } else {
          // Assign seat
          if (!activeRoom.whitePlayer && !activeRoom.blackPlayer) {
            const assignColor: 'white' | 'black' = preferredColor === 'black' ? 'black' : 'white';
            const player: Player = { id: validPlayerId, name: String(playerName || 'Игрок 1'), color: assignColor, ws, connected: true };
            if (assignColor === 'white') activeRoom.whitePlayer = player;
            else activeRoom.blackPlayer = player;
          } else if (!activeRoom.whitePlayer) {
            activeRoom.whitePlayer = { id: validPlayerId, name: String(playerName || 'Игрок (Белые)'), color: 'white', ws, connected: true };
          } else if (!activeRoom.blackPlayer) {
            activeRoom.blackPlayer = { id: validPlayerId, name: String(playerName || 'Игрок (Чёрные)'), color: 'black', ws, connected: true };
          } else {
            // Room is full
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Комната уже заполнена двумя игроками' }));
            return;
          }
        }

        // Check if both players joined to start
        if (activeRoom.whitePlayer && activeRoom.blackPlayer && activeRoom.status === 'waiting') {
          activeRoom.status = 'playing';
          activeRoom.lastMoveTimestamp = Date.now();
        }

        ws.send(JSON.stringify({
          type: 'JOINED',
          playerId: validPlayerId,
          assignedColor: activeRoom.whitePlayer?.id === validPlayerId ? 'white' : 'black',
          roomId: activeRoom.roomId
        }));

        broadcastRoom(activeRoom);
      }

      if (msg.type === 'MAKE_MOVE') {
        if (!currentRoomId || !playerId) return;
        const room = rooms.get(currentRoomId);
        if (!room || room.status !== 'playing') return;

        const isWhite = room.whitePlayer?.id === playerId;
        const isBlack = room.blackPlayer?.id === playerId;
        if (!isWhite && !isBlack) return;

        const currentTurnColor = room.activeTurn === 'w' ? 'white' : 'black';
        const playerColor = isWhite ? 'white' : 'black';

        if (currentTurnColor !== playerColor) {
          ws.send(JSON.stringify({ type: 'ERROR', message: 'Сейчас не ваш ход' }));
          return;
        }

        const { from, to, promotion } = msg;
        const chess = new Chess(room.fen);
        let moveRes = null;
        try {
          moveRes = chess.move({ from, to, promotion: promotion || 'q' });
        } catch {
          ws.send(JSON.stringify({ type: 'ERROR', message: 'Недопустимый ход' }));
          return;
        }

        if (moveRes) {
          room.fen = chess.fen();
          room.history.push({ san: moveRes.san, from, to, color: moveRes.color });
          room.activeTurn = chess.turn();
          room.lastMoveTimestamp = Date.now();

          // Evaluate game outcome
          if (chess.isCheckmate()) {
            room.status = 'checkmate';
            room.winner = playerColor;
          } else if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition() || chess.isInsufficientMaterial()) {
            room.status = 'draw';
            room.winner = 'draw';
          }

          broadcastRoom(room);
        }
      }

      if (msg.type === 'RESIGN') {
        if (!currentRoomId || !playerId) return;
        const room = rooms.get(currentRoomId);
        if (!room || room.status !== 'playing') return;

        const isWhite = room.whitePlayer?.id === playerId;
        room.status = 'resigned';
        room.winner = isWhite ? 'black' : 'white';
        broadcastRoom(room);
      }

      if (msg.type === 'RESTART_GAME') {
        if (!currentRoomId) return;
        const room = rooms.get(currentRoomId);
        if (!room) return;

        const time = room.timeControl;
        room.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        room.history = [];
        room.whiteTime = time;
        room.blackTime = time;
        room.lastMoveTimestamp = (room.whitePlayer && room.blackPlayer) ? Date.now() : null;
        room.status = (room.whitePlayer && room.blackPlayer) ? 'playing' : 'waiting';
        room.winner = null;
        room.activeTurn = 'w';
        broadcastRoom(room);
      }

      if (msg.type === 'SEND_CHAT') {
        if (!currentRoomId || !playerId) return;
        const room = rooms.get(currentRoomId);
        if (!room) return;

        const senderPlayer = room.whitePlayer?.id === playerId ? room.whitePlayer : room.blackPlayer;
        const senderName = senderPlayer?.name || 'Игрок';
        const color = senderPlayer?.color || 'white';
        const text = String(msg.text || '').trim();

        if (text) {
          const now = new Date();
          const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          room.chat.push({ sender: senderName, text, time, color });
          if (room.chat.length > 50) room.chat.shift();
          broadcastRoom(room);
        }
      }
    } catch (err) {
      console.error('[WS] Message error:', err);
    }
  });

  ws.on('close', () => {
    if (!currentRoomId || !playerId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    if (room.whitePlayer?.id === playerId) {
      room.whitePlayer.connected = false;
    }
    if (room.blackPlayer?.id === playerId) {
      room.blackPlayer.connected = false;
    }
    broadcastRoom(room);
  });
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(port, () => {
    console.log(`> Server & WebSockets listening on port ${port}`);
  });
}

startServer();
