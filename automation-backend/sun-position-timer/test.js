// Copyright (c) 2026 Kirk Rader

import config from '../config.js'
import { EventEmitter } from 'node:events'
import { argv, exit } from 'node:process'
import { SunPositionEvent, SunPositionTimer } from './index.js'

export function sunPositionTimerTest(debug = false) {

    const automationEvents = new EventEmitter()
    const sunPositionTimer = new SunPositionTimer(config.location, automationEvents)
    const now = Date.now()
    const testEvent1 = new SunPositionEvent(config.location, automationEvents, 'test1', new Date(now + 2000))
    const testEvent2 = new SunPositionEvent(config.location, automationEvents, 'test2', new Date(now + 3000))

    automationEvents.on('events', events => console.log(SunPositionTimer.toString(events, debug)))
    sunPositionTimer.nextDay()

    sunPositionTimer.events.push(testEvent1)
    sunPositionTimer.events.push(testEvent2)
    console.log('----------------------------------------')
    console.log(sunPositionTimer.toString(debug))

    sunPositionTimer.events.forEach(sunPositionEvent => {

        if (sunPositionEvent.isPending) {

            automationEvents.on(sunPositionEvent.name, event => {

                console.log('----------------------------------------')
                console.log(`${event.toString(debug)} - ${SunPositionTimer.automationTheme(event.timestamp)}`)
                console.log(' ')
                console.log(sunPositionTimer.toString(debug))

                if (sunPositionEvent.name === 'test2') {

                    exit(0)
                }
            })
        }
    })

    console.log('listening for events...')
}

sunPositionTimerTest(argv.length >= 3 ? JSON.parse(argv[2]) : false)