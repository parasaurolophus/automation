// Copyright (c) 2026 Kirk Rader

import { getPosition } from 'suncalc'

function SunPositionEvent(location, emitter, name, date) {

    const position = getPosition(date, location.latitude, location.longitude)

    this.altitude = position.altitude
    this.azimuth = position.azimuth
    this.emitter = emitter
    this.location = location
    this.name = name
    this.timestamp = date.getTime()

    Object.defineProperties(this, {

        isPending: {
            get() {
                return this.timeout !== null
            },
            enumerable: true,
        },

        timeout: {
            value: null,
            configurable: false,
            enumerable: false,
            writable: true,
        },
    })

    this.setTimer()
}

SunPositionEvent.prototype.setTimer = function sunPositionEventSetTimer() {

    const interval = this.timestamp - Date.now()

    if (interval > 0) {

        this.timeout = setTimeout(() => {
            const now = new Date()
            this.timeout = null
            this.emitter.emit(this.name, this)
        }, interval)
    }
}

SunPositionEvent.prototype.toString = function toString(debug = false, alignment = 0) {

    const date = new Date(this.timestamp)
    const timestring = debug ? date.toLocaleString() : date.toLocaleTimeString()
    let pad1 = ' '
    let pad2 = ''

    if (alignment > 0) {

        let count = alignment - this.name.length

        while (count-- > 0) {

            pad1 = pad1.concat(' ')
        }

        if (timestring.at(1) === ':') {

            pad2 = ' '
        }
    }

    return `${this.isPending ? '●' : '○'} ${this.name}${pad1}${pad2}${timestring} (${SunPositionEvent.toTenths(this.altitude)}°)`
}

SunPositionEvent.toTenths = function toTenths(n) {

    return Math.floor(n * 10) / 10
}

export default SunPositionEvent