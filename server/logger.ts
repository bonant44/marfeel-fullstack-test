export const LogLevel = {
  OFF: 0,
  ERROR: 1,
  WARNING: 2,
  INFO: 3,
  DEBUG: 4,
} as const

export function createLogger({level}: { level: keyof typeof LogLevel }) {
  return {
    error(...args: any) {
      if (LogLevel[level] < LogLevel.ERROR) return
      console.error(...args)
    },

    warn(...args: any) {
      if (LogLevel[level] < LogLevel.WARNING) return
      console.warn(...args)
    },

    info(...args: any) {
      if (LogLevel[level] < LogLevel.INFO) return
      console.info(...args)
    },

    debug(...args: any) {
      if (LogLevel[level] < LogLevel.DEBUG) return
      console.debug(...args)
    },
  }
}
