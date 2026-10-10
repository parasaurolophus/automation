// Copyright (c) 2026 Kirk Rader

import { hueBridgeClients, powerviewHubClients } from './onMessage.js'
import { messageEvents } from './messageBroker.js'
import { PowerviewHubClient } from './device-client/index.js'

const lastRadyState = {}
let readyStatePoller = null

function pollReadyState() {

    for (let hueBridgeClient of hueBridgeClients) {

        const current = hueBridgeClient.readyState
        const hueReadyState = lastRadyState.hue ?? {}
        const last = hueReadyState[hueBridgeClient.bridgeId] ?? ''

        if (current !== last) {

            messageEvents.emit('send', {
                topic: `hue/${hueBridgeClient.bridgeId}/readyState`,
                payload: current,
            })

            hueReadyState[hueBridgeClient.bridgeId] = current
            lastRadyState.hue = hueReadyState
        }
    }

    for (let powerviewHubClient of powerviewHubClients) {

        if (powerviewHubClient.type !== PowerviewHubClient.LEGACY) {

            const current = powerviewHubClient.readyState
            const powerviewReadyState = lastRadyState.powerview ?? {}
            const last = powerviewReadyState[powerviewHubClient.id] ?? ''

            if (current !== last) {

                messageEvents.emit('send', {
                    topic: `powerview/${powerviewHubClient.id}/readyState`,
                    payload: current,
                })

                powerviewReadyState[powerviewHubClient.id] = current
                lastRadyState.powerview = powerviewReadyState
            }
        }
    }
}

function startReadyStatePoller() {

    if (readyStatePoller === null) {

        readyStatePoller = setInterval(pollReadyState, 1000)
    }
}

function stopReadyStatePoller() {

    if (readyStatePoller === null) {

        clearInterval(readyStatePoller)
        readyStatePoller = null
    }
}

export { readyStatePoller, startReadyStatePoller, stopReadyStatePoller }