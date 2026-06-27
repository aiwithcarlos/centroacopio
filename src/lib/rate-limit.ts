/**
 * Rate limiter en memoria.
 * Sin dependencias externas. Se limpia automáticamente cada 60s.
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // ventana de tiempo en milisegundos
}

interface RequestLog {
  timestamps: number[];
}

const store = new Map<string, RequestLog>();

// Limpieza periódica cada 60 segundos
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, log] of store.entries()) {
      log.timestamps = log.timestamps.filter((t) => now - t < 3600000); // 1h max
      if (log.timestamps.length === 0) store.delete(key);
    }
  }, 60_000);
}

export function rateLimit(
  ip: string,
  endpoint: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetIn: number } {
  const key = `${endpoint}:${ip}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  let log = store.get(key);
  if (!log) {
    log = { timestamps: [] };
    store.set(key, log);
  }

  // Filtrar timestamps fuera de la ventana
  log.timestamps = log.timestamps.filter((t) => t > windowStart);

  if (log.timestamps.length >= config.maxRequests) {
    const oldestInWindow = log.timestamps[0];
    const resetIn = Math.ceil((oldestInWindow + config.windowMs - now) / 1000);
    return { allowed: false, remaining: 0, resetIn };
  }

  log.timestamps.push(now);
  return {
    allowed: true,
    remaining: config.maxRequests - log.timestamps.length,
    resetIn: Math.ceil(config.windowMs / 1000),
  };
}

// Configuraciones predefinidas
export const RATE_LIMITS = {
  GET_CENTERS: { maxRequests: 30, windowMs: 60_000 },       // 30 req/min
  POST_CENTER: { maxRequests: 30, windowMs: 3_600_000 },     // 5 req/hora
  POST_UPLOAD: { maxRequests: 30, windowMs: 3_600_000 },    // 10 req/hora
  POST_REPORT: { maxRequests: 3, windowMs: 3_600_000 },     // 3 req/hora (además del rate limit existente)
} as const;
