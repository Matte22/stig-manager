'use strict'
const startTime = process.hrtime.bigint()
const express = require('express')
const logger = require('./utils/logger')
const { serializeError } = require('./utils/serializeError')
const configureMiddleware  = require('./bootstrap/middlewares.js')
const { logAppConfig } = require('./bootstrap/bootstrapUtils.js')
const { serveClient } = require('./bootstrap/client.js')
const { serveDocs, serveApiDocs } = require('./bootstrap/docs.js')
const startServer = require('./bootstrap/server')

const config = logAppConfig()

//Catch unhandled errors. 
process.on('uncaughtException', (err, origin) => {
  logger.writeError('app','uncaught', serializeError(err))
})
process.on('unhandledRejection', (reason, promise) => {
  logger.writeError('app','unhandled', {reason, promise})
})

const app = express()
configureMiddleware(app, config)
run()

function run() {
  try {
    serveClient(app)
    serveDocs(app)
    serveApiDocs(app)
    startServer(app, startTime)
  }
  catch (err) {
    logger.writeError(err.message)
    process.exit(1)
  }
}

