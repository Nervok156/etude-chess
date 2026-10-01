/**
 * Классы исключений приложения «Этюд».
 * Наследуются от базового AppError, чтобы UI мог различать типы.
 */

export class AppError extends Error {
    readonly code: string;
    readonly userMessage: string;
  
    constructor(message: string, code: string, userMessage?: string) {
      super(message);
      this.name = 'AppError';
      this.code = code;
      this.userMessage = userMessage ?? message;
    }
  }
  
  /** Ошибка валидации входных данных (нелегальный ход, плохой FEN). */
  export class ValidationError extends AppError {
    constructor(message: string, userMessage?: string) {
      super(message, 'VALIDATION_ERROR', userMessage);
      this.name = 'ValidationError';
    }
  }
  
  /** Ошибка при работе с localStorage (битый JSON, переполнение). */
  export class StorageError extends AppError {
    constructor(message: string, userMessage?: string) {
      super(message, 'STORAGE_ERROR', userMessage);
      this.name = 'StorageError';
    }
  }
  
  /** Ошибка движка (Stockfish не загрузился, не отвечает). */
  export class EngineError extends AppError {
    constructor(message: string, userMessage?: string) {
      super(message, 'ENGINE_ERROR', userMessage);
      this.name = 'EngineError';
    }
  }
  
  /** Ошибка сети (WebSocket, fetch). */
  export class NetworkError extends AppError {
    constructor(message: string, userMessage?: string) {
      super(message, 'NETWORK_ERROR', userMessage);
      this.name = 'NetworkError';
    }
  }
  
  /** Задача или другой ресурс не найден. */
  export class NotFoundError extends AppError {
    constructor(message: string, userMessage?: string) {
      super(message, 'NOT_FOUND', userMessage);
      this.name = 'NotFoundError';
    }
  }
  
  /** Определяет, является ли ошибка известной (AppError) или неизвестной. */
  export function isAppError(err: unknown): err is AppError {
    return err instanceof AppError;
  }
  
  /** Безопасно извлекает человекочитаемое сообщение из ошибки. */
  export function getErrorMessage(err: unknown): string {
    if (isAppError(err)) return err.userMessage;
    if (err instanceof Error) return err.message;
    return 'Произошла неизвестная ошибка';
  }