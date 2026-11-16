// Copyright (c) 2026 Kirk Rader

class DeviceClient {

    static CLOSED = 'closed'
    static CONNECTING = 'connecting'
    static OPEN = 'open'

    logger

    #client
    #lastSentTimestamp
    #sendQueue

    constructor(logger) {

        this.#client = null
        this.#lastSentTimestamp = 0
        this.logger = logger
        this.#sendQueue = []
    }

    close() {

        if (this.#client !== null) {

            this.#client.close()
            this.#client = null
        }
    }

    open(onMessage, onConnect, onDisconnect, onScheduleReconnect) {

        try {

            this.close()
            this.#client = this._open(
                onMessage,
                onConnect,
                onDisconnect,
                onScheduleReconnect)

        } catch (error) {

            this.logger.error(this, error)
        }
    }

    get readyState() {

        return this.#client?.readyState ?? DeviceClient.CLOSED
    }

    send(request, onResponse) {

        const delay = Date.now() - this.#lastSentTimestamp

        if (delay < 1000) {

            this.#sendQueue.push(() => this.send(request, onResponse))

            setTimeout(() => {

                const queue = this.sendQueue.splice(0)
                queue.forEach(deferred => deferred())

            }, delay + 1)

            return
        }

        this._send(request, onResponse)
        this.lastSentTimestamp = Date.now()
    }
}

export default DeviceClient