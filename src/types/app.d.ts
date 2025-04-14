export type SupportedBackend = 'production' | 'test';
export type SupportedLanguage = 'en' | 'zh-CN';

export type MessageResult<T, E> = { ok: T; err?: undefined } | { ok?: undefined; err: E };
