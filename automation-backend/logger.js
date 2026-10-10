// Copyright (c) 2026 Kirk Rader

import { exit } from 'node:process'
import { closeSync, existsSync, fstatSync, openSync, renameSync, unlinkSync, writeSync } from 'node:fs'
import config from './config.js'

function Logger(options) {

    this.directory = options?.directory ?? process.cwd()
    this.maxBackups = options?.maxBackups ?? 2
    this.maxSize = options?.maxSize ?? 1047552
    this.name = options?.name ?? 'logger'
    this.extension = options?.extension ?? 'log'
}

Logger.ERROR = 'error'
Logger.INFO = 'info'
Logger.WARN = 'warn'

Logger.prototype.backup = function backup(index) {

    return `${this.directory}/${this.name}_${index}.${this.extension}`
}

Logger.prototype.error = function error(...args) {

    this.log(Logger.ERROR, ...args)
}

Logger.prototype.info = function info(...args) {

    this.log(Logger.INFO, ...args)
}

Logger.prototype.log = function log(level, ...args) {

    const time = new Date()

    const record = {
        timestamp: time.getTime(),
        iso: time.toISOString(),
        local: time.toLocaleString(),
        level: level,
        message: args,
    }

    this.rotate()
        .then(() => this.write(record))
        .catch(error => {

            // TODO: write to system logger
            console.error(error)
            exit(10)
        })
}

Logger.prototype.path = function path() {

    return `${this.directory}/${this.name}.${this.extension}`
}

Logger.prototype.rotate = function rotate() {

    return new Promise((resolve, reject) => {

        try {

            const path = this.path()
            let fd = openSync(path, 'a')

            if (fd >= 0) {

                try {

                    const stat = fstatSync(fd)

                    if (stat.size >= this.maxSize) {

                        closeSync(fd)
                        fd = -1

                        let index = this.maxBackups
                        let older = this.backup(this.maxBackups)

                        if (existsSync(older)) {

                            unlinkSync(older)
                        }

                        while (index > 1) {

                            const newer = this.backup(--index)

                            if (existsSync(newer)) {

                                renameSync(newer, older)
                            }

                            older = newer
                        }

                        renameSync(path, older)
                    }

                } finally {

                    if (fd >= 0) {

                        closeSync(fd)
                    }
                }
            }

            resolve()

        } catch (error) {

            reject(error)
        }
    })
}

Logger.prototype.warn = function warn(...args) {

    this.log(Logger.WARN, ...args)
}

Logger.prototype.write = function write(record) {

    return new Promise((resolve, reject) => {

        try {

            const json = `${JSON.stringify(record)}\n`
            const fd = openSync(this.path(), 'a')

            if (fd < 0) {

                throw new Error(`failed to open`)
            }

            try {

                writeSync(fd, Buffer.from(json))

            } finally {

                closeSync(fd)
            }

            resolve()

        } catch (error) {

            reject(error)
        }
    })
}

const logger = new Logger(config.logger)

export { Logger, logger }