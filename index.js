const logger = require('./lib/logger')
const cuid = require('cuid')

function doSummat () {
  return new Promise((resolve) => {
    require('./nested/dep')
    resolve()
  })
}

const express = require('express')
const app = express()

app.use((req, res, next) => {
  logger.context.requestId = cuid()
  next()
})

app.get('/', (req, res) => {
  logger.trace('ocd wow')
  logger.info('wow')
  logger.warn('uh oh wow')

  doSummat().then(() => {
    res.end('done')
    console.log('ctx', logger.context)
  })
})

app.listen(9230, () => console.log('listening'))
