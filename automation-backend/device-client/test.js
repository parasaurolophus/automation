// Copyright (c) 2026 Kirk Rader

import config from '../config.js'
import { HueBridgeClient, PowerviewHubClient } from './index.js'
import { exit, stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline'

function format(value) {

    if (value === undefined) {

        return 'undefined'

    } else if (value === null) {

        return 'null'

    } else if (Array.isArray(value)) {

        return `<Array ${value.length}>`

    } else if (typeof value === 'object') {

        return `<object ${Object.keys(value)}>`
    }

    return typeof value
}

function onConnect(sender) {

    console.log(`connect: ${sender.toString()}`)
}

function onDisconnect(sender) {

    console.log(`disconnect: ${sender.toString()}`)
}

function onError(sender, error, ...context) {

    console.error(`error: ${sender.toString()} ${error} ${format(context)}`)
}

function onMessage(sender, message) {

    console.log(`message: ${sender.toString()} ${format(message)}`)
}

function onResponse(sender, response) {

    console.log(`response: ${sender.toString()} ${format(response)}`)
}

function onScheduleReconnect(sender, event) {

    console.log(`scheduledReconnect: ${sender.toString()} ${JSON.stringify(event)}`)
}

const hueBridgeClients = config.hue.map(hue => {

    return new HueBridgeClient(onError, hue.bridgeId, hue.apiKey)
})

const powerviewHubClients = config.powerview.map(powerview => {

    return new PowerviewHubClient(
        onError,
        powerview.id,
        powerview.name,
        powerview.type,
        powerview.address)
})

function requestHueResources(client) {

    client.send({ uri: 'resource', method: 'GET' }, onResponse)
}

function requestPowerviewResources(client) {

    client.send({ uri: 'rooms', method: 'GET', }, onResponse)
}

hueBridgeClients.forEach(client => {

    client.open(
        onMessage,
        onConnect,
        onDisconnect,
        onScheduleReconnect)

    requestHueResources(client)
})

powerviewHubClients.forEach(client => {

    if (client.type === PowerviewHubClient.LEGACY) {

        client.send({ uri: 'shades', method: 'GET' }, onResponse)

    } else {

        client.open(
            onMessage,
            onConnect,
            onDisconnect,
            onScheduleReconnect)

        requestPowerviewResources(client)
    }
})

const rl = createInterface({ input, output })

rl.question('press enter...\n', () => exit(0))