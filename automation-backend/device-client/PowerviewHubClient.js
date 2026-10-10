// Copyright (c) 2026 Kirk Rader

import { createEventSource } from 'eventsource-client'
import DeviceClient from './DeviceClient.js'

class PowerviewHubClient extends DeviceClient {

    static GEN3 = 'gen3'
    static LEGACY = 'legacy'

    #_address
    #_id
    #_name
    #_type

    constructor(onError, id, name, type, address) {

        super(onError)
        this.#_address = address
        this.#_id = id
        this.#_name = name
        this.#_type = type
    }

    get id() {

        return this.#_id
    }

    get name() {

        return this.#_name
    }

    _open(onMessage, onConnect, onDisconnect, onScheduleReconnect) {

        try {

            if (this.type !== PowerviewHubClient.LEGACY) {

                return createEventSource({
                    url: `http://${this.#_address}/home/events?sse=true`,
                    onMessage: message => onMessage(this, message),
                    onConnect: () => onConnect(this),
                    onDisconnect: () => onDisconnect(this),
                    onScheduleReconnect: (event) => onScheduleReconnect(this, event)
                })
            }

        } catch (error) {

            this.onError(this, error)
        }
    }

    async _send(request, onResponse) {

        try {

            const options = {
                method: request.method,
            }

            if (request.body !== undefined) {

                options.headers['Content-Type'] = 'application/json'
                options.body = JSON.stringify(request.body)
            }

            const response = await fetch(
                `http://${this.#_address}/${this.type === PowerviewHubClient.LEGACY ? 'api' : 'home'}/${request.uri}${request.query ?? ''}`,
                options)

            if (!response.ok) {

                this.onError(new Error(response.statusText), response)
                return
            }

            const body = await response.json()

            if (this.type === PowerviewHubClient.LEGACY) {

                const normalized = body.roomData ?? body.sceneData ?? body.shadeData

                if (normalized !== undefined) {

                    normalized.forEach(resource => {

                        if (resource.name !== undefined) {

                            resource.ptName = Buffer.from(resource.name, 'base64').toString('utf8')
                        }
                    })

                    onResponse(this, normalized)
                    return
                }
            }

            onResponse(this, body)

        } catch (error) {

            this.onError(this, error, request)
        }
    }

    toString() {

        return `<PowerviewHubClient ${this.#_id} ${this.readyState}>`
    }

    get type() {

        return this.#_type
    }
}

export default PowerviewHubClient