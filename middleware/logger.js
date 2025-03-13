const path = require('path')
const { format } = require('date-fns')
const fs = require('fs')
const fsPromises = require('fs').promises

const logEvent = async (message, filename) => {
    const dateTime = format(new Date(), 'yyyy-MM-dd\t\tHH:mm:ss')
    const logItem = `${dateTime}\t${message}\n`
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', filename), logItem)
    }
    catch (error) {
        console.log("Logger error : ", error)
    }
}


const logger = (req, res, next) => {
    logEvent(`${req.url}\t\t${req.method}`, 'reqLogs.log')
    next()
}

module.exports = { logger, logEvent }