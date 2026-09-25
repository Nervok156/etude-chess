import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import {
  Users,
  Copy,
  Check,
  Send,
  RotateCcw,
  Flag,
  Clock,
  MessageSquare,
  Sparkles,
  Volume2,
  VolumeX,
  Share2,
  RefreshCw,
  AlertCircle,
  Wifi,
  WifiOff,
  UserCheck
} from 'lucide-react';
import { Chessboard } from './Chessboard.tsx';
import { ChessPieceSvg } from './ChessPieceSvg.tsx';
import { soundPlayer } from '../utils/audio.ts';

interface RoomPlayer {
  id: string;
  name: string;
  color: 'white' | 'black';
  connected: boolean;
}

interface RoomData {
  roomId: string;
  fen: string;
  history: Array<{ san: string; from: string; to: string; color: string }>;
  timeControl: number;
  whiteTime: number;
  blackTime: number;
  status: 'waiting' | 'playing' | 'checkmate' | 'draw' | 'stalemate' | 'resigned' | 'timeout';
  winner: 'white' | 'black' | 'draw' | null;
  activeTurn: 'w' | 'b';
  chat: Array<{ sender: string; text: string; time: string; color?: string }>;
  whitePlayer: RoomPlayer | null;
  blackPlayer: RoomPlayer | null;
}

interface MultiplayerGameProps {
  onBackToCatalog?: () => void;
}

export const MultiplayerGame: React.FC<MultiplayerGameProps> = () => {
  // Connection & Room state
  const [roomIdInput, setRoomIdInput] = useState('');
  const [playerNameInput, setPlayerNameInput] = useState(() => {
    return localStorage.getItem('chess_player_name') || `Игрок_${Math.floor(100 + Math.random() * 900)}`;
  });
  const [preferredColor, setPreferredColor] = useState<'white' | 'black'>('white');
  const [timeMinutes, setTimeMinutes] = useState<number>(10);

  const [playerId] = useState(() => {
    let id = sessionStorage.getItem('chess_player_id');
    if (!id) {
      id = Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem('chess_player_id', id);
    }
    return id;
  });

  const [joinedRoomId, setJoinedRoomId] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [myColor, setMyColor] = useState<'white' | 'black' | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [chatMessage, setChatMessage] = useState('');

  const wsRef = useRef<WebSocket | null>(null);
  const lastMoveRef = useRef<{ from: string; to: string } | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Parse room from URL query if present (e.g. ?room=XYZ123)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get('room');
    if (urlRoom) {
      setRoomIdInput(urlRoom.trim().toUpperCase());
    }
  }, []);

  // Connect WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      // If already in a room, re-join
      if (joinedRoomId) {
        ws.send(JSON.stringify({
          type: 'JOIN_ROOM',
          roomId: joinedRoomId,
          playerId,
          playerName: playerNameInput
        }));
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.warn('[Multiplayer WS] Error:', err);
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'JOINED') {
          setJoinedRoomId(data.roomId);
          setMyColor(data.assignedColor);
          // Update URL without page refresh
          const url = new URL(window.location.href);
          url.searchParams.set('room', data.roomId);
          window.history.replaceState({}, '', url.toString());
        }

        if (data.type === 'ROOM_UPDATE') {
          const newRoom: RoomData = data.room;
          setRoom((prevRoom) => {
            // Sound triggers on move
            if (prevRoom && prevRoom.history.length < newRoom.history.length) {
              const last = newRoom.history[newRoom.history.length - 1];
              lastMoveRef.current = { from: last.from, to: last.to };
              if (soundEnabled) {
                if (last.san.includes('x')) soundPlayer.playCapture();
                else soundPlayer.playMove();
              }
            }
            return newRoom;
          });
        }
      } catch (err) {
        console.error('Failed to parse WS packet:', err);
      }
    };

    return () => {
      ws.close();
    };
  }, [joinedRoomId, playerId, playerNameInput, soundEnabled]);

  // Scroll chat to bottom
  useEffect(() => {
    const el = chatScrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [room?.chat]);

  // Create or Join Room
  const handleJoinOrCreate = (targetRoomId?: string) => {
    const rId = (targetRoomId || roomIdInput || Math.random().toString(36).substring(2, 7)).toUpperCase();
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert('Нет связи с сервером. Пожалуйста, подождите или перезагрузите страницу.');
      return;
    }

    localStorage.setItem('chess_player_name', playerNameInput);

    wsRef.current.send(JSON.stringify({
      type: 'JOIN_ROOM',
      roomId: rId,
      playerId,
      playerName: playerNameInput,
      preferredColor,
      timeMinutes
    }));
  };

  // Move submission
  const handlePlayerMove = useCallback((from: string, to: string, promotion: string = 'q'): boolean => {
    if (!room || room.status !== 'playing' || !myColor || !wsRef.current) return false;

    // Check turn
    const isWhiteTurn = room.activeTurn === 'w';
    if ((myColor === 'white' && !isWhiteTurn) || (myColor === 'black' && isWhiteTurn)) {
      return false;
    }

    // Verify move with chess.js locally before sending
    try {
      const chess = new Chess(room.fen);
      const res = chess.move({ from, to, promotion });
      if (!res) return false;

      wsRef.current.send(JSON.stringify({
        type: 'MAKE_MOVE',
        from,
        to,
        promotion
      }));
      return true;
    } catch {
      return false;
    }
  }, [room, myColor]);

  // Resign
  const handleResign = () => {
    if (!wsRef.current || !room || room.status !== 'playing') return;
    if (confirm('Вы уверены, что хотите сдаться?')) {
      wsRef.current.send(JSON.stringify({ type: 'RESIGN' }));
    }
  };

  // Restart match
  const handleRestart = () => {
    if (!wsRef.current || !room) return;
    wsRef.current.send(JSON.stringify({ type: 'RESTART_GAME' }));
  };

  // Send chat
  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim() || !wsRef.current) return;

    wsRef.current.send(JSON.stringify({
      type: 'SEND_CHAT',
      text: chatMessage.trim()
    }));
    setChatMessage('');
  };

  // Copy invitation link
  const handleCopyLink = () => {
    if (!room) return;
    const url = new URL(window.location.href);
    url.searchParams.set('room', room.roomId);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // Format time (mm:ss)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Determine opponent player
  const opponent = room
    ? myColor === 'white'
      ? room.blackPlayer
      : room.whitePlayer
    : null;

  const me = room
    ? myColor === 'white'
      ? room.whitePlayer
      : room.blackPlayer
    : null;

  const isMyTurn = room && (
    (myColor === 'white' && room.activeTurn === 'w') ||
    (myColor === 'black' && room.activeTurn === 'b')
  );

  // If not joined to any room yet, show Lobby
  if (!joinedRoomId || !room) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#779556]/20 border border-[#779556]/40 text-[#a3c97d] text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Мультиплеер в реальном времени (WebSockets)</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Шахматы онлайн для двух игроков
          </h2>
          <p className="text-sm text-[#9ca3af] mt-2 max-w-lg mx-auto">
            Создайте комнату, скопируйте ссылку и отправьте другу — играйте с разных компьютеров или телефонов без регистрации!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Create room card */}
          <div className="bg-[#18191f] border border-[#282b35] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 rounded-xl bg-[#779556] text-white">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Создать новую игру</h3>
                  <p className="text-xs text-[#8f96a3]">Создайте комнату с индивидуальными настройками</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#a5abb8] mb-1.5">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    value={playerNameInput}
                    onChange={(e) => setPlayerNameInput(e.target.value)}
                    maxLength={20}
                    className="w-full bg-[#121317] border border-[#2e313b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#779556]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a5abb8] mb-1.5">
                    Контроль времени (минут на партию)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 5, 10, 15].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setTimeMinutes(mins)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                          timeMinutes === mins
                            ? 'bg-[#779556] text-white border-[#779556]'
                            : 'bg-[#14151a] text-[#8e95a5] border-[#292c36] hover:bg-[#1e2027]'
                        }`}
                      >
                        {mins} мин
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a5abb8] mb-1.5">
                    Выбор цвета
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreferredColor('white')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-colors ${
                        preferredColor === 'white'
                          ? 'bg-[#2b2e38] text-white border-[#779556] ring-1 ring-[#779556]'
                          : 'bg-[#14151a] text-[#8e95a5] border-[#292c36] hover:bg-[#1e2027]'
                      }`}
                    >
                      <span className="text-base leading-none">♔</span>
                      <span>Белые</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredColor('black')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-colors ${
                        preferredColor === 'black'
                          ? 'bg-[#2b2e38] text-white border-[#779556] ring-1 ring-[#779556]'
                          : 'bg-[#14151a] text-[#8e95a5] border-[#292c36] hover:bg-[#1e2027]'
                      }`}
                    >
                      <span className="text-base leading-none">♚</span>
                      <span>Чёрные</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleJoinOrCreate()}
              className="mt-6 w-full py-3 rounded-xl bg-[#779556] hover:bg-[#688349] text-white font-bold text-sm shadow-lg shadow-[#779556]/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Создать комнату и начать</span>
            </button>
          </div>

          {/* Join existing room card */}
          <div className="bg-[#18191f] border border-[#282b35] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 rounded-xl bg-[#3b4050] text-white">
                  <Users className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Войти по коду комнаты</h3>
                  <p className="text-xs text-[#8f96a3]">Подключитесь к уже созданной комнате друга</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#a5abb8] mb-1.5">
                    Код комнаты (ID)
                  </label>
                  <input
                    type="text"
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                    placeholder="Например: A8B2K"
                    className="w-full bg-[#121317] border border-[#2e313b] rounded-xl px-3.5 py-2.5 text-base tracking-widest font-mono text-white placeholder:text-[#555a66] focus:outline-none focus:border-[#779556]"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-[#131418] border border-[#23252d] text-xs text-[#8e95a5] space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <UserCheck className="w-4 h-4" />
                    <span>Быстрый вход</span>
                  </div>
                  <p>
                    Если вам прислали прямую ссылку с кодом комнаты, код подставится автоматически.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={!roomIdInput.trim()}
              onClick={() => handleJoinOrCreate(roomIdInput.trim())}
              className="mt-6 w-full py-3 rounded-xl bg-[#2e313c] hover:bg-[#383c49] disabled:opacity-40 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Войти в игру</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Multiplayer Game UI
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6"
      style={{ overflowAnchor: 'none' }}
      >
      {/* Top Bar with room info & actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#24262f]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-[#779556]/20 text-[#779556]">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Онлайн партия
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#20222b] text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ID: {room.roomId}
                </span>
                {isConnected ? (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5" /> В сети
                  </span>
                ) : (
                  <span className="text-[11px] text-red-400 flex items-center gap-1">
                    <WifiOff className="w-3.5 h-3.5" /> Переподключение...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#22242c] hover:bg-[#2c303c] border border-[#333742] text-xs font-semibold text-white transition-colors"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#8f96a3]" />}
            <span>{copiedLink ? 'Ссылка скопирована!' : 'Пригласить друга'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
              soundEnabled
                ? 'bg-[#22242c] text-white border-[#333742]'
                : 'bg-[#18191d] text-[#6b7280] border-[#262833]'
            }`}
            title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2e323e] hover:bg-[#3a3f4e] text-white text-xs font-semibold transition-colors"
            title="Перезапустить игру"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Реванш</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Board & Player badges */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* Opponent Badge */}
          <div className="w-full max-w-[620px] bg-[#1a1c23] border border-[#272a33] rounded-t-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#272a34] border border-[#373b48] flex items-center justify-center text-lg shadow-inner">
                {myColor === 'white' ? '♚' : '♔'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {opponent ? opponent.name : 'Ожидание соперника...'}
                  </span>
                  <span className="text-[11px] font-semibold text-[#8e95a5] px-1.5 py-0.5 rounded bg-[#252833]">
                    {myColor === 'white' ? 'Чёрные' : 'Белые'}
                  </span>
                  {opponent && !opponent.connected && (
                    <span className="text-[11px] text-amber-400 font-medium">Отключен</span>
                  )}
                  {room.status === 'playing' && !isMyTurn && (
                    <span className="text-[11px] text-amber-400 font-medium animate-pulse">Думает...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Opponent Clock */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold tracking-wider ${
                !isMyTurn && room.status === 'playing'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-[#14151a] text-[#8e95a5] border-[#272a33]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(myColor === 'white' ? room.blackTime : room.whiteTime)}</span>
            </div>
          </div>

          {/* Chessboard */}
          <div className="relative">
            <Chessboard
              fen={room.fen}
              orientation={myColor || 'white'}
              onMove={handlePlayerMove}
              disabled={room.status !== 'playing' || !isMyTurn}
              lastMove={lastMoveRef.current}
            />

            {/* Waiting for 2nd player overlay */}
            {room.status === 'waiting' && (
              <div className="absolute inset-0 bg-[#0f1013]/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center rounded-lg z-20">
                <div className="w-12 h-12 rounded-2xl bg-[#779556]/20 border border-[#779556]/40 flex items-center justify-center text-[#779556] mb-3">
                  <Share2 className="w-6 h-6 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Ожидание второго игрока
                </h3>
                <p className="text-xs text-[#959dae] max-w-sm mb-4">
                  Скопируйте ссылку на комнату и отправьте её оппоненту, чтобы начать игру
                </p>
                <div className="flex items-center gap-2 bg-[#1b1c23] border border-[#2b2d38] p-1.5 rounded-xl max-w-md w-full">
                  <span className="text-xs font-mono text-white px-2 truncate flex-1 text-left">
                    {window.location.origin}/?room={room.roomId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-[#779556] hover:bg-[#688349] text-white text-xs font-bold flex items-center gap-1 shadow-md transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Скопировано!' : 'Копировать'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* My Player Badge */}
          <div className="w-full max-w-[620px] bg-[#1a1c23] border border-[#272a33] rounded-b-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#779556] text-white flex items-center justify-center text-lg shadow-md font-bold">
                {myColor === 'white' ? '♔' : '♚'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {me ? me.name : playerNameInput} (Вы)
                  </span>
                  <span className="text-[11px] font-semibold text-[#8e95a5] px-1.5 py-0.5 rounded bg-[#252833]">
                    {myColor === 'white' ? 'Белые' : 'Чёрные'}
                  </span>
                  {isMyTurn && room.status === 'playing' && (
                    <span className="text-[11px] text-emerald-400 font-medium">Ваш ход</span>
                  )}
                </div>
              </div>
            </div>

            {/* My Clock */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold tracking-wider ${
                isMyTurn && room.status === 'playing'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-[#14151a] text-[#8e95a5] border-[#272a33]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(myColor === 'white' ? room.whiteTime : room.blackTime)}</span>
            </div>
          </div>

          {/* Game Result Banner */}
          {room.status !== 'playing' && room.status !== 'waiting' && (
            <div className="w-full max-w-[620px] mt-4 p-4 rounded-xl bg-[#222530] border border-[#383d4e] shadow-xl flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-white">
                  {room.status === 'checkmate' && `Мат! Победили ${room.winner === 'white' ? 'Белые' : 'Чёрные'}!`}
                  {room.status === 'resigned' && `Сдача! Победили ${room.winner === 'white' ? 'Белые' : 'Чёрные'}!`}
                  {room.status === 'timeout' && `Время истекло! Победили ${room.winner === 'white' ? 'Белые' : 'Чёрные'}!`}
                  {room.status === 'draw' && 'Ничья!'}
                </div>
                <div className="text-xs text-[#959dae] mt-0.5">
                  Партия завершена. Сыграйте реванш!
                </div>
              </div>
              <button
                type="button"
                onClick={handleRestart}
                className="px-4 py-2 rounded-lg bg-[#779556] hover:bg-[#688349] text-white text-xs font-bold transition-all shadow-md"
              >
                Реванш
              </button>
            </div>
          )}
        </div>

        {/* Right column: Move History & In-game Chat */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Quick Match Actions */}
          <div className="bg-[#18191f] border border-[#282b35] rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs font-bold text-[#8e95a5]">Действия в игре</span>
            <button
              type="button"
              disabled={room.status !== 'playing'}
              onClick={handleResign}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 text-xs text-red-300 font-semibold disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Сдаться</span>
            </button>
          </div>

          {/* Move History */}
          <div className="bg-[#18191f] border border-[#282b35] rounded-xl p-4 shadow-lg flex flex-col h-48">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9aa2b1]">
                История ходов
              </span>
              <span className="text-[11px] text-[#6d7586]">
                Всего ходов: {room.history.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto pr-1 text-xs space-y-1">
              {room.history.length === 0 ? (
                <div className="text-[#606775] text-center py-6 italic">Ходов ещё не было</div>
              ) : (
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono">
                  {room.history.map((m, idx) => (
                    <div
                      key={idx}
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        idx % 2 === 0 ? 'bg-[#1e2027] text-white' : 'bg-[#15161b] text-[#a0a6b5]'
                      }`}
                    >
                      <span className="text-[#646b7a] mr-1.5">{Math.floor(idx / 2) + 1}.</span>
                      <span>{m.san}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* In-Game Live Chat */}
          <div className="bg-[#18191f] border border-[#282b35] rounded-xl p-4 shadow-lg flex flex-col h-64">
            <div className="flex items-center gap-1.5 mb-2">
              <MessageSquare className="w-4 h-4 text-[#779556]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#9aa2b1]">
                Чат партии
              </span>
            </div>

            <div ref={chatScrollRef} className="flex-1 overflow-y-auto space-y-2 pr-1 mb-2">
  {room.chat.length === 0 ? (
                <div className="text-[#606775] text-xs text-center py-8 italic">
                  Напишите сообщение оппоненту...
                </div>
              ) : (
                room.chat.map((msg, i) => (
                  <div key={i} className="text-xs">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-white">{msg.sender}</span>
                      <span className="text-[10px] text-[#555a66]">{msg.time}</span>
                    </div>
                    <p className="text-[#c7ccd6] mt-0.5 break-words">{msg.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendChat} className="flex items-center gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Сообщение..."
                maxLength={100}
                className="flex-1 bg-[#121317] border border-[#2e313b] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#779556]"
              />
              <button
                type="submit"
                disabled={!chatMessage.trim()}
                className="p-2 rounded-lg bg-[#779556] hover:bg-[#688349] disabled:opacity-40 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
