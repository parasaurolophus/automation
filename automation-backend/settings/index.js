// Copyright (c) 2026 Kirk Rader

import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const settingsPath = 'settings.json'

const settings = {
    lightingEnabled: false,
    shadesEnabled: false,
}

function loadSettings() {

    if (existsSync(settingsPath)) {

        const buffer = readFileSync(settingsPath)
        const contents = JSON.parse(buffer.toString())

        settings.lightingEnabled = contents.lightingEnabled
        settings.shadesEnabled = contents.shadesEnabled
    }
}

function saveSettings() {

    writeFileSync(settingsPath, JSON.stringify(settings, undefined, 2))
}

loadSettings()

export { saveSettings, settings }