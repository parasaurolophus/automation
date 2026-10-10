// Copyright (c) 2026 Kirk Rader

import config from './config.js'
import express from 'express'
import { HueBridgeClient, PowerviewHubClient } from './device-client/index.js'
import { logger } from './logger.js'
import { messageBroker, messageEvents } from './messageBroker.js'
import { hueBridgeClients, onMessage, powerviewHubClients } from './onMessage.js'
import { startReadyStatePoller } from './readyStatePoller.js'

const frontendPort = config.frontendPort ?? 3000
const root = config.root ?? `${process.cwd()}/../automation-frontend/dist`
const app = express()

app.use(express.static(root))

app.get('/{*uri}', (request, response) => {

    try {

        response.sendFile(`${root}/index.html`)

    } catch (error) {

        console.error(error)
    }
})

app.listen(frontendPort, () => {

    try {

        messageEvents.on('clientError', (event, client) => logger.error(event, client))
        messageEvents.on('close', (event, broker) => logger.info(event, broker))
        messageEvents.on('connection', () => logger.info(messageBroker.toString()))
        messageEvents.on('disconnection', () => logger.info(messageBroker.toString()))
        messageEvents.on('error', (event, broker) => logger.error(event, broker))
        messageEvents.on('message', onMessage)
        messageEvents.on('open', (event, broker) => logger.info(event, broker))
        messageBroker.open(config.wssPort ?? 3001)

        for (let { bridgeId, apiKey } of config.hue) {

            const client = new HueBridgeClient(
                (sender, error, ...context) => logger.error(`error ${sender.toString()}`, error),
                bridgeId,
                apiKey,
            )

            hueBridgeClients.push(client)
            client.open(
                (sender, resource) => messageEvents.emit('send', {
                    topic: `hue/${sender.bridgeId}/resource/${resource.type}/${resource.id}`,
                    payload: resource
                }),
                (sender) => logger.info(`connect ${sender.toString()}`),
                (sender) => logger.info(`disconnect ${sender.toString()}`),
                (sender, event) => logger.info(`scheduledReconnect ${sender.toString()} ${event.delay}`),
            )
        }

        for (let { id, address, name, type } of config.powerview) {

            const client = new PowerviewHubClient(
                (sender, error, ...context) => logger.error(`error ${sender.toString()} ${error}`),
                id,
                name,
                type,
                address,
            )

            powerviewHubClients.push(client)

            if (type !== PowerviewHubClient.LEGACY) {

                client.open(
                    (sender, resource) => messageEvents.emit('send', {
                        topic: `powerview/${sender.id}/event`,
                        payload: resource
                    }),
                    sender => logger.info(`connect ${sender.toString()}`),
                    sender => logger.info(`disconnect ${sender.toString()}`),
                    (sender, event) => logger.info(`scheduledReconnect ${sender.toString()} ${event.delay}`),
                )
            }
        }

        startReadyStatePoller()
        console.log(`http://localhost:${frontendPort}`)

    } catch (error) {

        console.error(error)
    }
})