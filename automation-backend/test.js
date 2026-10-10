// Copyright (c) 2026 Kirk Rader

import { existsSync, unlinkSync } from 'node:fs'
import { Logger } from './logger.js'
import { exit, stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline'

const rl = createInterface(input, output)

const logger = new Logger({
    maxBackups: 3,
    maxSize: 1024,
    name: 'test',
})

const message = `0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789`

function clean() {

    deleteFile('test.log')

    for (let backup = 1; backup <= 3; backup++) {

        deleteFile(`test_${backup}.log`)
    }
}

function deleteFile(name) {

    const path = `${process.cwd()}/${name}`

    if (existsSync(path)) {

        unlinkSync(path)
    }
}

function logTest() {

    logger.log(Logger.INFO, message)
}

clean()
setInterval(logTest, 1000)

rl.question('press enter...\n', () => exit(0))