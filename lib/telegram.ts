import crypto from 'node:crypto';

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

/**
 * Проверяет подпись initData от Telegram Mini App.
 * Возвращает данные пользователя, если подпись настоящая и свежая, иначе null.
 * Алгоритм — официальная схема Telegram (HMAC-SHA256 с ключом из токена бота).
 */
export function validateInitData(
  initData: string,
  botToken: string,
  maxAgeSec = 86400
): TelegramUser | null {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');

  // data_check_string: пары key=value, отсортированные по ключу, через \n
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  const calcHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // Сравнение, устойчивое к атакам по времени
  const a = Buffer.from(calcHash, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  // Свежесть: не принимаем старые initData
  const authDate = Number(params.get('auth_date') || '0');
  if (!authDate || Date.now() / 1000 - authDate > maxAgeSec) return null;

  const userRaw = params.get('user');
  if (!userRaw) return null;
  try {
    return JSON.parse(userRaw) as TelegramUser;
  } catch {
    return null;
  }
}
