// Copyright (c) 2026 Kirk Rader

import { settings, saveSettings } from './settings/index.js'
import { messageEvents } from './messageBroker.js'

function updateLightingEnabled(newValue, persist = true) {

    if (newValue !== settings.lightingEnabled) {

        settings.lightingEnabled = newValue

        messageEvents.emit('send', {
            topic: 'lightingEnabled',
            payload: settings.lightingEnabled,
        })

        if (persist) {

            saveSettings()
        }
    }
}

function updateShadesEnabled(newValue, persist = true) {

    if (newValue !== settings.shadesEnabled) {

        settings.shadesEnabled = newValue

        messageEvents.emit('send', {
            topic: 'shadesEnabled',
            payload: settings.shadesEnabled,
        })

        if (persist) {

            saveSettings()
        }
    }
}

export { updateLightingEnabled, updateShadesEnabled }