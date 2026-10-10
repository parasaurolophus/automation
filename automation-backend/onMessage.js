// Copyright (c) 2026 Kirk Rader

import { settings } from './settings/index.js'
import config from './config.js'
import { logger } from './logger.js'
import { messageEvents } from "./messageBroker.js"
import { sunPositionTimer, triggerAutomation } from "./sunPositionTimer.js"
import { updateLightingEnabled, updateShadesEnabled } from './updateSettings.js'
import { PowerviewHubClient } from './device-client/index.js'
import hueAutomations from './hueAutomations.js'
import powerviewAutomations from './powerviewAutomations.js'

const hueBridgeClients = []
const powerviewHubClients = []

function onMessage(message, websocketClient) {

    if (message?.topic === undefined) {

        logger.error(`invalid message`, message)
        return
    }

    if (message.topic === 'get/automations') {

        messageEvents.emit('send', {
            topic: 'automations',
            payload: {
                hue: hueAutomations,
                powerview: powerviewAutomations,
            },
        })
        return
    }

    if (message.topic === 'get/events') {

        messageEvents.emit('send', {
            topic: 'events',
            payload: sunPositionTimer.events,
        })

        return
    }

    if (message.topic === 'get/hue') {

        for (let client of hueBridgeClients) {

            client.send(
                {
                    uri: 'resource',
                    method: 'GET',
                },
                (sender, response) => {
                    messageEvents.emit('send', {
                        topic: `hue/${client.bridgeId}/resource`,
                        payload: response,
                    })
                })
        }

        return
    }

    if (message.topic === 'get/lightingEnabled') {

        messageEvents.emit('send', {
            topic: 'lightingEnabled',
            payload: settings.lightingEnabled,
        })

        return
    }

    if (message.topic === 'get/powerview') {

        messageEvents.emit('send', {
            topic: 'powerview',
            payload: config.powerview,
        })

        return
    }

    if (message.topic === 'get/shadesEnabled') {

        messageEvents.emit('send', {
            topic: 'shadesEnabled',
            payload: settings.shadesEnabled,
        })

        return
    }

    if (message.topic === 'delete/event') {

        sunPositionTimer.events = sunPositionTimer.events.filter(event => event.name.localeCompare(message.payload) !== 0)

        messageEvents.emit('send', {
            topic: 'events',
            payload: sunPositionTimer.events,
        })
    }

    if (message.topic === 'put/event') {

        sunPositionTimer.addEvent(message.payload.location, message.payload.name, new Date(message.payload.timestamp))

        messageEvents.emit('send', {
            topic: 'events',
            payload: sunPositionTimer.events,
        })

        return
    }

    if (message.topic === 'put/lightingEnabled') {

        updateLightingEnabled(message.payload)
        return
    }

    if (message.topic === 'put/shadesEnabled') {

        updateShadesEnabled(message.payload)
        return
    }

    if (message.topic === 'reset/events') {

        sunPositionTimer.calculateEvents()
        return
    }

    if (message.topic === 'trigger') {

        triggerAutomation(message.payload)
        return
    }

    let matches = new RegExp('^get/hue/([^/]+)/readyState$').exec(message.topic)

    if (matches) {

        for (let hueBridgeClient of hueBridgeClients) {

            if (hueBridgeClient.bridgeId === matches[1]) {

                messageEvents.emit('send', {
                    topic: `hue/${matches[1]}/readyState`,
                    payload: hueBridgeClient.readyState,
                })

                return
            }
        }

        return
    }

    matches = new RegExp('^get/hue/([^/]+)/resource$').exec(message.topic)

    if (matches) {

        const bridgeId = matches[1]

        for (let hueBridgeClient of hueBridgeClients) {

            if (hueBridgeClient.bridgeId === bridgeId) {

                const request = {
                    uri: `resource`,
                    method: 'GET',
                }

                hueBridgeClient.send(request, (sender, response) => {

                    response.errors.forEach(logger.error)

                    messageEvents.emit(

                        'send',

                        {
                            topic: `hue/${bridgeId}/resource`,
                            payload: response.data,
                        },

                        websocketClient)
                })

                return
            }
        }

        logger.warn(`no hue bridge client found with id ${bridgeId}`, message)
        return
    }

    matches = new RegExp('^(get|put)/hue/([^/]+)/resource/([^/]+)/([^/]+)$').exec(message.topic)

    if (matches) {

        const bridgeId = matches[2]

        for (let hueBridgeClient of hueBridgeClients) {

            if (hueBridgeClient.bridgeId === bridgeId) {

                const method = matches[1].toLocaleUpperCase()
                const resourceType = matches[3]
                const resourceId = matches[4]
                const request = { uri: `resource/${resourceType}/${resourceId}`, method: method }

                if (message.payload !== undefined) {

                    request.body = message.payload
                }

                hueBridgeClient.send(request, (sender, response) => {

                    if (method === 'GET') {

                        messageEvents.emit(
                            'send',
                            {
                                topic: `resource/${resourceType}/${resourceId}`,
                                payload: response,
                            },
                            websocketClient
                        )
                    }
                })

                break
            }
        }

        return
    }

    matches = new RegExp('^get/powerview/([^/]+)/(rooms|shades|scenes)$').exec(message.topic)

    if (matches) {

        const hubId = matches[1]

        for (let powerviewHubClient of powerviewHubClients) {

            if (powerviewHubClient.id === hubId) {

                const type = matches[2]
                const request = {
                    uri: type,
                    method: 'GET',
                }

                if (message.query !== undefined) {

                    request.uri = request.uri.concat(message.query)
                }

                powerviewHubClient.send(
                    request,
                    (sender, response) => {

                        messageEvents.emit(
                            'send',
                            {
                                topic: `powerview/${hubId}/${type}`,
                                payload: response,
                            },
                            websocketClient
                        )
                    }
                )

                return
            }
        }

        logger.warn(`no powerview hub found with id ${hubId}`)
        return
    }

    matches = new RegExp('^get/powerview/([^/]+)/readyState$').exec(message.topic)

    if (matches) {

        for (let powerviewHubClient of powerviewHubClients) {

            if (powerviewHubClient.id === matches[1]) {

                if (powerviewHubClient.type !== PowerviewHubClient.LEGACY) {

                    messageEvents.emit('send', {
                        topic: `powerview/${matches[1]}/readyState`,
                        payload: powerviewHubClient.readyState,
                    })
                }

                return
            }
        }

        return
    }

    matches = new RegExp('^(get|put)/powerview/([^/]+)/(.+)').exec(message.topic)

    if (matches) {

        const hubId = matches[2]

        for (let powerviewHubClient of powerviewHubClients) {

            if (powerviewHubClient.id === hubId) {

                const method = matches[1].toLocaleUpperCase()
                const uri = matches[3]

                const request = {
                    uri: uri,
                    method: method,
                }

                if (message.payload !== undefined) {

                    request.body = message.payload
                }

                if (message.query !== undefined) {

                    request.uri = request.uri.concat(message.query)
                }

                powerviewHubClient.send(
                    request,
                    (sender, response) => {

                        if (method === 'GET') {
                            messageEvents.emit(
                                'send',
                                {
                                    topic: `powerview/${hubId}/${resourceType}/${resourceId}`,
                                    payload: response,
                                },
                                websocketClient
                            )
                        }
                    }
                )

                break
            }
        }

        return
    }
}

export { hueBridgeClients, onMessage, powerviewHubClients }