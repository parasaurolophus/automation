// Copyright (c) 2026 Kirk Rader

import { saveSettings, settings } from './index.js'

console.log(settings)
settings.lightingEnabled = !settings.lightingEnabled
settings.shadesEnabled = !settings.shadesEnabled
saveSettings()