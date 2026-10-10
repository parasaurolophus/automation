// Copyright (c) 2026 Kirk Rader

import { EventEmitter } from 'node:events'
import { settings } from './settings/index.js'
import { SunPositionTimer } from './sun-position-timer/index.js'
import hueAutomations from './hueAutomations.js'
import powerviewAutomations from './powerviewAutomations.js'
import config from './config.js'
import { messageEvents } from './messageBroker.js'

const automationEvents = new EventEmitter()
const sunPositionTimer = new SunPositionTimer(config.location, automationEvents)

function emitAutomationMessages(eventName, automationTheme, deviceAutomations) {

    const automations = deviceAutomations[automationTheme] ?? deviceAutomations.standard
    const messages = automations[eventName] ?? deviceAutomations.standard[eventName]

    if (messages !== undefined) {

        messages.forEach(message => messageEvents.emit('message', message))
    }
}

function triggerAutomation(event) {

    const name = typeof event === 'string' ? event : event.name
    const automationTheme = SunPositionTimer.automationTheme()

    messageEvents.emit('send', {
        topic: 'event',
        payload: {
            name: name,
            theme: automationTheme,
        },
    })

    messageEvents.emit('send', {
        topic: 'events',
        payload: sunPositionTimer.events,
    })

    if (settings.lightingEnabled) {

        emitAutomationMessages(name, automationTheme, hueAutomations)
    }

    if (settings.shadesEnabled) {

        emitAutomationMessages(name, automationTheme, powerviewAutomations)
    }
}

function updateEvents(sunPositionEvents) {

    for (let sunPositionEvent of sunPositionEvents) {

        automationEvents.off(sunPositionEvent.name, triggerAutomation)
        automationEvents.on(sunPositionEvent.name, triggerAutomation)
    }

    messageEvents.emit('send', {
        topic: 'events',
        payload: sunPositionTimer.events,
    })
}

automationEvents.on('events', updateEvents)
sunPositionTimer.nextDay()

export { sunPositionTimer, triggerAutomation }