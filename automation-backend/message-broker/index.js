// Copyright (c) 2026 Kirk Rader

import { EventEmitter } from 'node:events'
import { WebSocketServer } from 'ws'

function MessageBroker(emitter) {

    Object.defineProperties(this, {

        emitter: {
            value: emitter,
            configurable: true,
            enumerable: true,
            writable: false,
        },

        readyState: {
            get() {
                return this.serverWebSocket?.readyState ?? WebSocket.CLOSED
            },
            enumerable: true,
        },

        serverWebSocket: {
            value: null,
            configurable: false,
            enumerable: false,
            writable: true,
        },
    })

    emitter.on('send', (message, client) => {

        if (this.serverWebSocket === null) {

            return
        }

        const json = JSON.stringify(message)

        if (client !== undefined) {

            if (client.readyState === WebSocket.OPEN) {

                client.send(json)
            }

            return
        }

        let count = 0

        for (let client of this.serverWebSocket.clients) {

            if (client.readyState === WebSocket.OPEN) {

                client.send(json)
                count += 1
            }
        }
    })
}

MessageBroker.prototype.close = function messageBrokerClose() {

    if (this.serverWebSocket !== null) {

        this.serverWebSocket.close()
        this.serverWebSocket = null
    }
}

MessageBroker.prototype.connection = function messageBrokerConnection(client) {

    client.on('close', event => this.emitter.emit('disconnection', event, client))
    client.on('error', error => this.emitter.emit('clientError', this.error, client))
    client.on('message', message => this.message(message, client))
    this.emitter.emit('connection', client)
}

MessageBroker.prototype.message = function messageBrokerMessage(buffer, client) {

    const event = JSON.parse(buffer.toString())
    this.emitter.emit('message', event, client)
}

MessageBroker.prototype.open = function messageBrokerOpen(port) {

    this.close()

    this.serverWebSocket = new WebSocketServer({
        port: port,
        autoPong: true,
        clientTracking: true,
    })

    this.serverWebSocket.on('close', event => this.emitter.emit('close', event, this))
    this.serverWebSocket.on('connection', client => this.connection(client))
    this.serverWebSocket.on('error', error => this.emitter.emit('error', error, this))
    this.serverWebSocket.on('open', event => this.emitter.emit('open', event, this))
}

MessageBroker.prototype.toString = function messageBrokerToString() {

    let count = 0

    if (this.serverWebSocket !== null) {

        for (let client of this.serverWebSocket.clients) {

            if (client.readyState === WebSocket.OPEN) {

                count += 1
            }
        }
    }

    return `MessgeBroker with ${count} connected clients`
}

export default MessageBroker