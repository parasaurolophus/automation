// Copyright (c) 2026 Kirk Rader

import config from '../config.js'
import { EventEmitter } from 'node:events'
import { exit, stdin } from 'node:process'
import MessageBroker from './index.js'

export function messageBrokerServer() {

    const emitter = new EventEmitter()
    const messageBroker = new MessageBroker(emitter)

    emitter.on('close', (event, broker) => {

        console.log(`server close: ${broker.toString()}`)
        exit(0)
    })

    emitter.on('connection', client => console.log(`server connection ${client.readyState}: ${messageBroker.toString()}`))

    emitter.on('disconnection', (event, client) => {

        console.log(`server disconnection ${client.readyState}: ${messageBroker.toString()}`)
        messageBroker.close()
    })

    emitter.on('error', error => {

        console.error('server error', error)
        exit(1)
    })

    emitter.on('message', message => {

        console.log('server received', message)
        emitter.emit('send', { baz: 'waka' })
    })

    emitter.on('open', (event, broker) => console.log(`server open: ${broker.toString()}`))
    messageBroker.open(config.wssPort)
}

export function messageBrokerClient() {

    const webSocket = new WebSocket(`ws://localhost:${config.wssPort}`)

    webSocket.onerror = event => {

        console.error('client error', webSocket.readyState, event)
        webSocket.close()
    }

    webSocket.onmessage = event => {

        console.log('client received', JSON.parse(event.data))
        webSocket.close()
    }

    webSocket.onopen = event => {

        webSocket.send(Buffer.from(JSON.stringify({ foo: 'bar' })))
    }
}

messageBrokerServer()
messageBrokerClient()