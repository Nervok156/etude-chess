# Руководство по установке

## «Этюд» — шахматный тренажёр

**Версия:** 1.0
**Дата:** 06.10.2026

---

## 1. Требования

### Для пользователя (через браузер)
- Браузер: Chrome 100+, Firefox 100+, Edge 100+.
- Интернет-соединение.

### Для разработки
- **Node.js:** 20.0.0 или выше (проверено на 20.20.2).
- **npm:** 10+ (идёт в комплекте с Node.js).
- **Git:** 2.30+.
- **ОС:** Windows, macOS или Linux.
- **Свободное место:** ~500 МБ для зависимостей и сборки.

Проверить версию Node.js:

    node --version   # v20.x.x или выше
    npm --version    # 10.x.x или выше

---

## 2. Установка

### 2.1. Клонирование репозитория

    git clone https://github.com/Nervok156/etude-chess.git
    cd etude-chess

### 2.2. Установка зависимостей

    npm install

При проблемах с разрешением версий (ERESOLVE):

    npm install --legacy-peer-deps

### 2.3. Запуск в режиме разработки

    npm run dev

Приложение откроется на **http://localhost:3000**.

### 2.4. Сборка для production

    npm run build
    npm start

Готовые файлы появятся в `dist/`.

---

## 3. Настройка

### 3.1. Переменные окружения

Файл `.env.local` в корне проекта (создать при необходимости):

    # Порт сервера (по умолчанию 3000)
    PORT=3000

    # Окружение
    NODE_ENV=development

**Все переменные опциональны.** Для базовой работы ничего
настраивать не нужно.

### 3.2. Конфигурационные файлы

| Файл | Назначение |
|---|---|
| `package.json` | Зависимости, скрипты (`dev`, `build`, `test`, `test:coverage`) |
| `vite.config.ts` | Настройки сборки Vite |
| `tsconfig.json` | Настройки TypeScript |
| `.nvmrc` | Требуемая версия Node.js (20) |
| `.editorconfig` | Стандарты редактора |
| `server.ts` | Express + WebSocket сервер |

### 3.3. Смена версии Node.js

Если установлен nvm (Node Version Manager):

    nvm use           # подхватит версию из .nvmrc
    nvm install 20    # если версия отсутствует

---

## 4. Развёртывание

### 4.1. Railway (рекомендуется)

Приложение развёрнуто на Railway:

- Фронтенд + API + WebSocket: https://web-production-05bd8.up.railway.app

**Как развернуть свой инстанс:**

1. Зарегистрироваться на https://railway.app.
2. **New Project** → **Deploy from GitHub repo**.
3. Выбрать репозиторий `Nervok156/etude-chess`.
4. Railway автоматически определит Node.js и запустит:
   - Build: `npm run build`;
   - Start: `npm start`.
5. Указать переменную `NODE_ENV=production` в **Settings → Variables**.
6. После сборки получить публичный URL.

### 4.2. Локальный сервер

    npm run build
    NODE_ENV=production npm start

Приложение будет доступно на `http://localhost:3000`.

### 4.3. Docker (опционально)

Dockerfile пока не входит в проект. В roadmap — контейнеризация
для упрощения развёртывания.

---

## 5. Тестирование

### 5.1. Запуск тестов

    npm test

Ожидаемый вывод: **35 tests, 35 pass, 0 fail**.

### 5.2. Покрытие тестами

    npm run test:coverage

Ожидаемый результат: покрытие строк 99.38%, ветвей 93.15%,
функций 98.77%.

### 5.3. CI (GitHub Actions)

При каждом push в `main` GitHub Actions автоматически
прогоняет тесты. Статус виден на вкладке **Actions**.

---

## 6. Решение проблем

### `npm install` падает с ERESOLVE

Конфликт версий зависимостей. Решение:

    npm install --legacy-peer-deps

Или обновить `package-lock.json`:

    rm -rf node_modules package-lock.json
    npm install

### `node: command not found` или старая версия Node.js

Проект требует Node.js 20+. Проверить:

    node --version

Если 16 или 18 — установить Node.js 20 с
https://nodejs.org или через nvm.

### `Cannot find module 'vite/client'` в VS Code

Кеш TS-сервера. Решение:

1. `Ctrl+Shift+P` → `TypeScript: Restart TS Server`.
2. Или `Developer: Reload Window`.

### `npm run dev` падает с `EADDRINUSE`

Порт 3000 занят. Найти процесс:

    lsof -i :3000

Убить:

    kill -9 <PID>

Или изменить порт: `PORT=3001 npm run dev`.

### Тесты проходят, но VS Code показывает ошибки

Кеш. `TypeScript: Restart TS Server` обычно решает.

### Мультиплеер не подключается

1. Проверить, что сервер запущен (`npm run dev`).
2. Открыть DevTools → Network → WS.
3. Убедиться, что WebSocket подключается к тому же домену.

---

## 7. Структура проекта
etude-chess/
├── docs/ # документация
├── public/ # статика (Stockfish WASM, SVG фигур)
├── src/
│ ├── components/ # React-компоненты
│ ├── data/ # каталог 117 задач
│ ├── utils/ # утилиты (storage, stockfish, exceptions)
│ ├── App.tsx # корневой компонент
│ └── main.tsx # точка входа
├── tests/ # unit-тесты (35 штук)
├── server.ts # Express + WebSocket
├── package.json
└── README.md

---

## 8. Контакты

- **Разработчик:** Копыл Илья, группа ИСП-43
- **Репозиторий:** https://github.com/Nervok156/etude-chess