// Copyright (c) 2026 Kirk Rader

import { addTime, getPosition, getTimes } from 'suncalc'
import SunPositionEvent from './SunPositionEvent.js'

const MILLIS_PER_SECOND = 1000
const MILLIS_PER_MINUTE = 60 * MILLIS_PER_SECOND
const MILLIS_PER_HOUR = 60 * MILLIS_PER_MINUTE

function SunPositionTimer(location, emitter) {

    this.emitter = emitter
    this.events = []
    this.location = location
    this.nextDayTimer = null
}

SunPositionTimer.automationTheme = function automationTheme(date = new Date()) {

    if (typeof date === 'number') {

        date = new Date(date)
    }

    // inexplicably, javascript's months are zero based, dates (days) are one
    // based

    if (date.getMonth() === 6 && date.getDate() <= 4) {

        return 'tribal'
    }

    if (date.getMonth() === 9) {

        return 'spooky'
    }

    if (date.getMonth() === 11) {

        return 'jolly'
    }

    return 'standard'
}

SunPositionTimer.randomizeDate = function randomizeDate(date, range) {

    const offset = (Math.random() * range) - (range / 2)
    date.setTime(date.getTime() + offset)
}

SunPositionTimer.toString = function staticToString(events, debug = false) {

    const alignment = Math.max(...events.map(event => event.name.length))
    return events.reduce((s, event) => s.concat(`${event.toString(debug, alignment)}\n`), '')
}

SunPositionTimer.prototype.addEvent = function addEvent(location, name, date) {

    this.events.push(new SunPositionEvent(location, this.emitter, name, date))
    this.events.sort((a, b) => a.timestamp - b.timestamp)
    this.emitter.emit('events', this.events)
}

SunPositionTimer.prototype.calculateEvents = function calculateEvents() {

    while (this.events.length > 0) {

        const event = this.events.shift()

        if (event.timer !== null) {

            clearTimeout(event.timer)
        }
    }

    const today = new Date()
    const highest = this.highestAltitude(today)

    today.setHours(1)
    today.setMinutes(1)
    today.setSeconds(0)
    today.setMilliseconds(0)
    addTime(Math.min(55, Math.floor(highest.altitude)), 'midday', 'afternoon')

    const times = getTimes(today, this.location.latitude, this.location.longitude, this.location.elevation)

    if (times.alwaysDown || times.alwaysUp || !times.midday || !times.afternoon) {

        console.warn(times)
        return
    }

    const evening = new Date(times.sunset.getTime() + MILLIS_PER_HOUR)
    const bedtime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 21, 30)
    const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59)

    SunPositionTimer.randomizeDate(bedtime, MILLIS_PER_HOUR)

    this.events.push(new SunPositionEvent(this.location, this.emitter, 'sunrise', times.sunrise))

    if (times.afternoon.getTime() - times.midday.getTime() > MILLIS_PER_HOUR) {

        this.events.push(new SunPositionEvent(this.location, this.emitter, 'midday', times.midday))
        this.events.push(new SunPositionEvent(this.location, this.emitter, 'afternoon', times.afternoon))

    } else {

        this.events.push(new SunPositionEvent(this.location, this.emitter, 'afternoon', times.midday))
    }

    if (bedtime.getTime() - evening.getTime() > MILLIS_PER_HOUR) {

        this.events.push(new SunPositionEvent(this.location, this.emitter, 'sunset', times.sunset))
        this.events.push(new SunPositionEvent(this.location, this.emitter, 'evening', evening))

    } else {

        this.events.push(new SunPositionEvent(this.location, this.emitter, 'evening', times.sunset))
    }

    this.events.push(new SunPositionEvent(this.location, this.emitter, 'bedtime', bedtime))

    if (times.night.getTime() > bedtime.getTime()) {

        this.events.push(new SunPositionEvent(this.location, this.emitter, 'night', times.night))
    }

    this.events.push(new SunPositionEvent(this.location, this.emitter, 'midnight', midnight))
    this.emitter.emit('events', this.events)
}

SunPositionTimer.prototype.highestAltitude = function highestAltitude(date) {

    let altitude = 0
    let azimuth = 0
    let time = null
    const start = new Date(date.getTime())

    start.setHours(1)
    start.setMinutes(1)
    start.setSeconds(0)
    start.setMilliseconds(0)

    const end = new Date(start.getTime())

    end.setDate(end.getDate() + 1)

    while (start.getTime() < end.getTime()) {

        const position = getPosition(start, this.location.latitude, this.location.longitude)

        if (position.altitude > altitude) {

            altitude = position.altitude
            azimuth = position.azimuth
            time = start
        }

        start.setSeconds(start.getSeconds() + 1)
    }

    return { altitude, azimuth, time }
}

SunPositionTimer.prototype.nextDay = function nextDay() {

    const now = new Date()
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 1, 1)
    const interval = tomorrow.getTime() - now.getTime()

    this.calculateEvents()
    this.nextDayTimer = setTimeout(() => this.nextDay(), interval)
}

SunPositionTimer.prototype.toString = function toString(debug = false) {

    return SunPositionTimer.toString(this.events, debug)
}

export default SunPositionTimer