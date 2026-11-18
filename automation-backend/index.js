// Copyright (c) 2026 Kirk Rader

import config from './config.js'
import express from 'express'
import path from 'node:path'
import { HueBridgeClient, PowerviewHubClient } from './device-client/index.js'
import { messageBroker, messageEvents } from './messageBroker.js'
import { hueBridgeClients, onMessage, powerviewHubClients } from './onMessage.js'
import { startReadyStatePoller } from './readyStatePoller.js'

const frontendPort = config.frontendPort ?? 3000
const root = config.root ?? path.resolve(process.cwd(), '../automation-frontend/dist')
const home = path.resolve(root, 'index.html')
const app = express()

console.error(home)
app.use(express.static(root))

app.get('/', (request, response) => {

    try {

        response.sendFile(home)

    } catch (error) {

        console.error(error)
    }
})

app.listen(frontendPort, function listen() {

    try {

        messageEvents.on('clientError', (event, client) => console.error(event, client))
        messageEvents.on('close', (event, broker) => console.log(event, broker))
        messageEvents.on('connection', () => console.log(messageBroker.toString()))
        messageEvents.on('disconnection', () => console.log(messageBroker.toString()))
        messageEvents.on('error', (event, broker) => console.error(event, broker))
        messageEvents.on('message', onMessage)
        messageEvents.on('open', (event, broker) => console.log(event, broker))
        messageBroker.open(config.wssPort ?? 3001)

        for (let { bridgeId, apiKey } of config.hue) {

            const client = new HueBridgeClient(
                bridgeId,
                apiKey,
            )

            hueBridgeClients.push(client)
            client.open(
                (sender, resource) => messageEvents.emit('send', {
                    topic: `hue/${sender.bridgeId}/resource/${resource.type}/${resource.id}`,
                    payload: resource
                }),
                (sender) => console.log(`connect ${sender.toString()}`),
                (sender) => console.log(`disconnect ${sender.toString()}`),
                (sender, event) => console.log(`scheduleReconnect ${sender.toString()} ${event.delay}`),
            )
        }

        for (let { id, address, name, type } of config.powerview) {

            const client = new PowerviewHubClient(id, name, type, address)

            powerviewHubClients.push(client)

            if (type !== PowerviewHubClient.LEGACY) {

                client.open(
                    (sender, resource) => messageEvents.emit('send', {
                        topic: `powerview/${sender.id}/event`,
                        payload: resource
                    }),
                    sender => console.log(`connect ${sender.toString()}`),
                    sender => console.log(`disconnect ${sender.toString()}`),
                    (sender, event) => console.log(`scheduleReconnect ${sender.toString()} ${event.delay}`),
                )
            }
        }

        startReadyStatePoller()
        console.log(`http://localhost:${frontendPort}`)

    } catch (error) {

        console.error(error)
    }
})