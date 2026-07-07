type LogLevel = 'debug' | 'info' | 'warn' | 'error'

class Logger {
  private readonly namespace = 'DataScreen'

  debug(message: string, ...args: unknown[]) {
    this.write('debug', message, args)
  }

  info(message: string, ...args: unknown[]) {
    this.write('info', message, args)
  }

  warn(message: string, ...args: unknown[]) {
    this.write('warn', message, args)
  }

  error(message: string, ...args: unknown[]) {
    this.write('error', message, args)
  }

  private write(level: LogLevel, message: string, args: unknown[]) {
    if (!import.meta.env.DEV && level === 'debug') return

    const payload = [`[${this.namespace}][${level}] ${message}`, ...args]

    if (level === 'error') console.error(...payload)
    else if (level === 'warn') console.warn(...payload)
    else if (level === 'debug') console.debug(...payload)
    else console.info(...payload)
  }
}

export const logger = new Logger()
