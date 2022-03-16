delete require.cache[__filename]

const singleton = require('./singleton')
const pino = require('pino')()

module.exports = {
  info: (message) => log('info', message),
  warn: (message) => log('warn', message),
  debug: (message) => log('debug', message),
  trace: (message) => log('trace', message),
  fatal: (message) => log('fatal', message),
  error: (message) => log('error', message),
  get context () {
    return singleton.context
  }
}

const lineNumberRegex = /:([0-9]+):([0-9]+)\)?$/

function log (level, ...args) {
  const [message] = args
  const moduleName = module.parent.filename

  const lim = Error.stackTraceLimit
  Error.stackTraceLimit = 1
  const e = {}
  Error.captureStackTrace(e, module.exports[level])
  Error.stackTraceLimit = lim
  const [, lineNumber, columnNumber] = lineNumberRegex.exec(e.stack)

  pino[level]({
    ...singleton.context,
    module: moduleName,
    line: lineNumber,
    col: columnNumber,
  }, message)
}
