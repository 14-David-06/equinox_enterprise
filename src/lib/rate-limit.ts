/**
 * Rate limiting in-memory para proteger endpoints
 * Para producción con múltiples instancias, considerar usar Redis
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Limpiar entradas antiguas cada 5 minutos
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.requests.entries()) {
        if (now > entry.resetTime) {
          this.requests.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Verifica si una IP ha excedido el límite de requests
   * @param identifier - IP o identificador único
   * @param maxRequests - Número máximo de requests permitidos
   * @param windowMs - Ventana de tiempo en milisegundos
   * @returns true si está dentro del límite, false si excede
   */
  check(identifier: string, maxRequests: number, windowMs: number): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      // Nueva ventana o primera request
      const resetTime = now + windowMs;
      this.requests.set(identifier, {
        count: 1,
        resetTime,
      });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime,
      };
    }

    // Dentro de la ventana existente
    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    entry.count++;
    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Resetea el contador para un identificador
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Limpia todos los contadores
   */
  clear(): void {
    this.requests.clear();
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.clear();
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Obtiene el identificador de la request (IP)
 */
export function getClientIdentifier(request: Request): string {
  // Intenta obtener IP real de headers comunes (detrás de proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback
  return 'unknown';
}

/**
 * Helper para aplicar rate limiting en una route handler
 */
export function applyRateLimit(
  request: Request,
  options: {
    maxRequests: number;
    windowMs: number;
  }
): {
  success: true;
} | {
  success: false;
  status: number;
  error: string;
  retryAfter: number;
} {
  const identifier = getClientIdentifier(request);
  const result = rateLimiter.check(identifier, options.maxRequests, options.windowMs);

  if (!result.allowed) {
    const retryAfterSeconds = Math.ceil((result.resetTime - Date.now()) / 1000);
    return {
      success: false,
      status: 429,
      error: 'Too many requests, please try again later',
      retryAfter: retryAfterSeconds,
    };
  }

  return { success: true };
}
