import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  AppError,
  ValidationError,
  StorageError,
  EngineError,
  NetworkError,
  NotFoundError,
  isAppError,
  getErrorMessage,
} from '../src/utils/exceptions.ts';
describe('exceptions: AppError', () => {
  it('создаётся с code и userMessage', () => {
    const err = new AppError('technical', 'TEST_CODE', 'Понятное сообщение');
    assert.equal(err.message, 'technical');
    assert.equal(err.code, 'TEST_CODE');
    assert.equal(err.userMessage, 'Понятное сообщение');
    assert.equal(err.name, 'AppError');
    assert.ok(err instanceof Error);
  });

  it('userMessage по умолчанию равен message', () => {
    const err = new AppError('technical', 'TEST_CODE');
    assert.equal(err.userMessage, 'technical');
  });
});

describe('exceptions: наследники', () => {
  it('ValidationError имеет правильный code и name', () => {
    const err = new ValidationError('нелегальный ход');
    assert.equal(err.code, 'VALIDATION_ERROR');
    assert.equal(err.name, 'ValidationError');
    assert.ok(err instanceof AppError);
  });

  it('StorageError имеет правильный code и name', () => {
    const err = new StorageError('битый JSON', 'Не удалось прочитать');
    assert.equal(err.code, 'STORAGE_ERROR');
    assert.equal(err.userMessage, 'Не удалось прочитать');
    assert.ok(err instanceof AppError);
  });

  it('EngineError имеет правильный code', () => {
    const err = new EngineError('Stockfish timeout');
    assert.equal(err.code, 'ENGINE_ERROR');
    assert.equal(err.name, 'EngineError');
  });

  it('NetworkError имеет правильный code', () => {
    const err = new NetworkError('WS closed');
    assert.equal(err.code, 'NETWORK_ERROR');
    assert.equal(err.name, 'NetworkError');
  });

  it('NotFoundError имеет правильный code', () => {
    const err = new NotFoundError('puzzle #999');
    assert.equal(err.code, 'NOT_FOUND');
    assert.equal(err.name, 'NotFoundError');
  });
});

describe('exceptions: isAppError', () => {
  it('возвращает true для AppError и наследников', () => {
    assert.equal(isAppError(new AppError('x', 'Y')), true);
    assert.equal(isAppError(new ValidationError('x')), true);
    assert.equal(isAppError(new StorageError('x')), true);
  });

  it('возвращает false для обычных Error и не-Error', () => {
    assert.equal(isAppError(new Error('x')), false);
    assert.equal(isAppError('string'), false);
    assert.equal(isAppError(null), false);
    assert.equal(isAppError(undefined), false);
    assert.equal(isAppError({ code: 'X' }), false);
  });
});

describe('exceptions: getErrorMessage', () => {
  it('извлекает userMessage из AppError', () => {
    const err = new ValidationError('technical', 'Пользовательское сообщение');
    assert.equal(getErrorMessage(err), 'Пользовательское сообщение');
  });

  it('извлекает message из обычной Error', () => {
    assert.equal(getErrorMessage(new Error('plain error')), 'plain error');
  });

  it('возвращает fallback для неизвестных значений', () => {
    assert.equal(getErrorMessage('строка'), 'Произошла неизвестная ошибка');
    assert.equal(getErrorMessage(null), 'Произошла неизвестная ошибка');
    assert.equal(getErrorMessage(42), 'Произошла неизвестная ошибка');
  });
});