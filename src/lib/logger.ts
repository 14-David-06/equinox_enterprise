/**
 * Simple structured logger for production
 * En producción, considera usar Winston o Pino para logging más robusto
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDev = process.env.NODE_ENV !== 'production';

  private log(level: LogLevel, message: string, context?: LogContext) {
    if (this.isDev && level === 'debug') {
      console.log(`[${level.toUpperCase()}]`, message, context || '');
      return;
    }

    if (level === 'error') {
      console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message,
        ...context,
      }));
    } else if (level === 'warn') {
      console.warn(JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message,
        ...context,
      }));
    } else if (this.isDev) {
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message,
        ...context,
      }));
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    this.log('error', message, {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: this.isDev ? error.stack : undefined,
        name: error.name,
      } : String(error),
    });
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }
}

export const logger = new Logger();
