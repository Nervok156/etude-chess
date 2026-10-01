# Отчёт о покрытии тестами

**Дата:** 01.10.2026
**Студент:** Копыл Илья, группа ИСП-43
**Проект:** «Этюд» — шахматный тренажёр
**Инструмент:** встроенный `--experimental-test-coverage` (Node.js)
**Команда:** `npm run test:coverage`

---

## Общая статистика

| Метрика | Значение |
|---|---|
| Всего тестов (npm test) | 35 |
| Тестов в coverage-прогоне | 32 |
| Pass | 35 / 32 |
| Fail | 0 |
| Покрытие строк | **99.38%** |
| Покрытие ветвей | **93.15%** |
| Покрытие функций | **98.77%** |

**Примечание:** performance-тесты (3 шт.) запускаются только через `npm test`, не через `npm run test:coverage` — инструментовка покрытия добавляет overhead 2–3x, что искажает время операций.

---

## Покрытые функции

| Модуль | Файл | Тестов | Статус |
|---|---|---|---|
| `evaluateBoard` | `src/utils/chessEngineFallback.ts` | 3 | ✅ |
| `searchBestMove` | `src/utils/chessEngineFallback.ts` | 3 | ✅ |
| `getStoredProgress` | `src/utils/storage.ts` | 1 | ✅ |
| `savePuzzleProgress` | `src/utils/storage.ts` | 2 | ✅ |
| `calculateProgressStats` | `src/utils/storage.ts` | 2 | ✅ |
| `resetAllProgress` | `src/utils/storage.ts` | 1 | ✅ |
| `AppError` и наследники | `src/utils/exceptions.ts` | 7 | ✅ |
| `isAppError` | `src/utils/exceptions.ts` | 2 | ✅ |
| `getErrorMessage` | `src/utils/exceptions.ts` | 3 | ✅ |
| Каталог `PUZZLES` (117 задач) | `src/data/puzzles.ts` | 7 | ✅ |
| Performance-тесты | `tests/performance.test.ts` | 3 | ✅ |
| **Итого** | | **35** | ✅ |

---

## Покрытие по файлам (инструментальный замер)

| Файл | Строк (%) | Ветвей (%) | Функций (%) |
|---|---|---|---|
| `src/data/puzzles.ts` | 99.91 | 100.00 | 100.00 |
| `src/utils/chessEngineFallback.ts` | 98.33 | 88.89 | 100.00 |
| `src/utils/exceptions.ts` | 100.00 | 100.00 | 100.00 |
| `src/utils/storage.ts` | 92.59 | 77.78 | 100.00 |
| **Итого по исходному коду** | **99.38** | **93.15** | **98.77** |

---

## Непокрытые функции

| Модуль | Причина |
|---|---|
| `Chessboard.tsx` | UI-компонент, тестируется вручную (TC-04..TC-06, TC-17) |
| `PuzzleSolver.tsx` | UI, проверяется вручную (TC-04, TC-08) |
| `BotGame.tsx` | UI + Stockfish WASM, проверяется вручную (TC-14, TC-15) |
| `MultiplayerGame.tsx` | требует 2 клиента, ручное тестирование (TC-19..TC-23) |
| `audio.ts` | Web Audio API недоступен в Node.js |
| `stockfish.ts` | требует Web Worker |

---

## Оценка покрытия

- **Критические функции:** 100% (storage, engine, exceptions, puzzles).
- **По строкам:** 99.38% (целевой показатель 70%).
- **По функциям:** 98.77%.
- **По ветвям:** 93.15%.

---

## Вывод

Все ключевые модули приложения покрыты unit-тестами: логика
прогресса, оценка позиции, fallback-движок, классы исключений,
каталог задач. UI-компоненты и интеграции с браузерными API
проверяются вручную по тест-кейсам дней 8–9.

Покрытие по строкам — 99.38%, что превышает целевой показатель 70%.
Автоматизированное тестирование настроено, все тесты зелёные.