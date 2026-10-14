<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <header>
        <div class="padded">
            <div id="titlebar">
                <ServerStatus />
                <h1>automation</h1>
                <QrCode v-model="qrUrl" class="right" />
            </div>
            <StatusBar />
        </div>
    </header>
    <main>
        <div class="padded">
            <HomeDiagram id="homediagram" />
            <HueBridges id="huebridges" />
            <PowerviewHubs id="powerviewhubs" />
            <AutomationsView id="automationsview" />
        </div>
    </main>
    <div id="sidePanel">
        <div class="padded">
            <AutomationControls />
            <SunPositionTimer />
            <DevControls />
        </div>
    </div>
    <footer>
        <div class="padded">
            <FooterBar />
        </div>
    </footer>
</template>

<style scoped>
.padded {
    padding: 1vh 1vw;
}

.right {
    margin-left: auto;
}

#titlebar {
    display: flex;
    align-items: center;
    justify-content: start;
}
</style>

<script setup>
import AutomationControls from './components/AutomationControls.vue'
import AutomationsView from './components/AutomationsView.vue'
import DevControls from './components/DevControls.vue'
import FooterBar from './components/FooterBar.vue'
import HomeDiagram from './components/HomeDiagram.vue'
import HueBridges from './components/HueBridges.vue'
import PowerviewHubs from './components/PowerviewHubs.vue'
import QrCode from './components/QrCode.vue'
import ServerStatus from './components/ServerStatus.vue'
import StatusBar from './components/StatusBar.vue'
import SunPositionTimer from './components/SunPositionTimer.vue'
import { buildHomeDiagram } from './buildDiagram.js'
import mermaid from 'mermaid'
import { computed, provide, ref } from 'vue'
import { HueBridgeModel } from './HueBridgeModel.js'
import { PowerviewHubModel } from './PowerviewHubModel.js'
import { merge, sortByName } from './utilities.js'

const automations = ref({})
const clientReadyState = ref({})

const defaultDiagram = `flowchart LR
uninitialize@{ shape: braces, label: "uninitialized" }`

const diagramBuilder = ref(buildHomeDiagram)
const diagramSource = ref(defaultDiagram)
const hueBridgeModels = ref([])
let idCounter = 0
const lightingEnabled = ref(false)
const powerviewHubModels = ref([])
let qrUrl = window.location.origin
const refreshDiagrams = ref(Date.now())
const shadesEnabled = ref(false)
const sunPositionTimer = ref([])

const wsUrl = computed(() => {

    try {

        return import.meta.env.VITE_SERVER_WS ?? `ws://${new URL(window.location.origin).hostname}:8081`

    } catch (error) {

        console.error(error)
        return 'ws://localhost:8081'
    }
})

const ws = new WebSocket(wsUrl.value)
const wsReadyState = ref(WebSocket.CLOSED)
const isWsOpen = computed(() => wsReadyState.value === WebSocket.OPEN)

setInterval(() => wsReadyState.value = ws.readyState, 1000)

ws.onopen = () => {

    sendWS({ topic: 'get/automations' })
    sendWS({ topic: 'get/lightingEnabled' })
    sendWS({ topic: 'get/shadesEnabled' })
    sendWS({ topic: 'get/events' })
    sendWS({ topic: 'get/hue' })
    sendWS({ topic: 'get/powerview' })
}

ws.onmessage = event => {

    const message = JSON.parse(event.data)

    if (message.topic === undefined) {

        console.error('ignoring ill-formed message', message)
        return
    }

    if (message.topic === 'automations') {

        automations.value = message.payload
        return
    }

    if (message.topic === 'event') {

        console.log(message)
        return
    }

    if (message.topic === 'events') {

        sunPositionTimer.value = message.payload
        return
    }

    if (message.topic === 'lightingEnabled') {

        lightingEnabled.value = message.payload
        return
    }

    if (message.topic === 'powerview') {

        for (let hub of message.payload) {

            let found = false

            for (let model of powerviewHubModels.value) {

                if (model.id === hub.id) {

                    merge(hub, model)
                    found = true
                    break
                }
            }

            if (!found) {

                powerviewHubModels.value.push(new PowerviewHubModel(hub.id, hub.name, hub.address, hub.type))

                sendWS({
                    topic: `get/powerview/${hub.id}/readyState`,
                })
            }

            sendWS({
                topic: `get/powerview/${hub.id}/rooms`,
            })
        }

        sortByName(powerviewHubModels.value)
        return
    }

    if (message.topic === 'shadesEnabled') {

        shadesEnabled.value = message.payload
        return
    }

    let matches = new RegExp('^hue/([^/]+)/readyState$').exec(message.topic)

    if (matches) {

        const hueReadyState = clientReadyState.value.hue ?? {}

        hueReadyState[matches[1]] = message.payload

        if (hueReadyState !== clientReadyState.value.hue) {

            clientReadyState.value.hue = hueReadyState
        }

        return
    }

    matches = new RegExp('^hue/([^/]+)/resource$').exec(message.topic)

    if (matches) {

        const bridgeId = matches[1]

        for (let model of hueBridgeModels.value) {

            if (model.id === bridgeId) {

                model.updateResources(message.payload)
                return
            }
        }

        hueBridgeModels.value.push(new HueBridgeModel(message.payload))
        sendWS({ topic: `get/hue/${bridgeId}/readyState` })
        sortByName(hueBridgeModels.value)
        return
    }

    matches = new RegExp('^hue/([^/]+)/resource/([^/]+)/([^/]+)$').exec(message.topic)

    if (matches) {

        const bridgeId = matches[1]
        const resourceType = matches[2]
        const resourceId = matches[3]

        for (let model of hueBridgeModels.value) {

            if (model.id === bridgeId) {

                for (let resource of model.resources) {

                    if (resource.id === resourceId) {

                        if (resource.type !== resourceType) {

                            console.error(`SSE message is invalid for resource type ${resource.type}`, message)
                            return
                        }

                        merge(message.payload, resource)
                        return
                    }
                }

                console.warn(`${new Date().toLocaleString()}: ignoring SSE message for unrecognized resource`, message)
                return
            }
        }

        console.warn(`${new Date().toLocaleString()}: ignoring SSE message for unrecognized bridge`, message)
        return
    }

    matches = new RegExp('^powerview/([^/]+)/readyState$').exec(message.topic)

    if (matches) {

        const powerviewReadyState = clientReadyState.value.powerview ?? {}

        powerviewReadyState[matches[1]] = message.payload

        if (powerviewReadyState !== clientReadyState.value.powerview) {

            clientReadyState.value.powerview = powerviewReadyState
        }

        return
    }

    matches = new RegExp('^powerview/([^/]+)/rooms$').exec(message.topic)

    if (matches) {

        const hubId = matches[1]

        for (let model of powerviewHubModels.value) {

            if (model.id === hubId) {

                model.addRooms(message.payload)
                sendWS({ topic: `get/powerview/${hubId}/shades` })
                return
            }
        }

        console.warn(`ignoring rooms data for unrecognized powerview hub`, message)
        return
    }

    matches = new RegExp('^powerview/([^/]+)/shades$').exec(message.topic)

    if (matches) {

        const hubId = matches[1]

        for (let model of powerviewHubModels.value) {

            if (model.id === hubId) {

                model.addShades(message.payload)
                sendWS({ topic: `get/powerview/${hubId}/scenes` })
                return
            }
        }

        console.warn(`ignoring shades data for unknown powerview hub ${hubId}`)
        return
    }

    matches = new RegExp('^powerview/([^/]+)/scenes$').exec(message.topic)

    if (matches) {

        const hubId = matches[1]

        for (let model of powerviewHubModels.value) {

            if (model.id === hubId) {

                model.addScenes(message.payload)
                return
            }
        }

        console.warn(`ignoring scenes data for unrecognized powerview hub`, message)
        return
    }

    matches = new RegExp('^powerview/([^/]+)/event$').exec(message.topic)

    if (matches) {

        const hubId = matches[1]

        for (let hub of powerviewHubModels.value) {

            if (hub.id === hubId) {

                const event = JSON.parse(message.payload.data)

                if (event.evt === 'motion-stopped') {

                    for (let room of hub.rooms) {

                        for (let shade of room.shades) {

                            if (shade.id == event.id) {

                                merge(event.currentPositions, shade.resource.positions)
                                return
                            }
                        }
                    }
                }
            }
        }

        return
    }

    console.warn('ignoring unrecognized topic', message)
}

function closeAllDetails() {

    document.querySelectorAll('details').forEach(element => element.open = false)

}

async function copyMessage(message) {

    try {

        const msg = message()

        console.log(msg)

        if (navigator.clipboard) {

            const str = typeof msg === 'string' ? msg : JSON.stringify(msg, undefined, 2)
            await navigator.clipboard.writeText(str)
        }

    } catch (error) {

        console.error(error)
    }
}

function initializeMermaid() {

    mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        htmlLabels: false,
    })

    refreshDiagrams.value = Date.now()
}

function mermaidClick(arg) {

    openPanel(arg)
}

function nextId() {

    return `id${idCounter++}`
}

// open the <details> element selected by the given id, after opening all its
// ancestor <details> elements
function openPanel(id) {

    const targetElement = document.getElementById(id)
    const queue = []

    // walk the document tree from the root down, populating a FIFO queue of
    // callbacks to open each <details> element that contains the selected one
    function enqueue(element) {

        if (element === targetElement) {

            queue.push(() => targetElement.open = true)
            return true
        }

        if (element.contains(targetElement)) {

            if (element.nodeName === 'DETAILS') {

                queue.push(() => element.open = true)
            }

            for (let index = 0; index < element.childNodes.length; ++index) {

                const child = element.childNodes.item(index)

                if (enqueue(child)) {

                    return true
                }
            }
        }

        return false
    }

    // empty the FIFO queue, invoking each callback in successive javascript
    // event handler iterations
    function dequeue() {

        if (queue.length > 0) {

            queue.shift()()
            setTimeout(dequeue, 0)
        }
    }

    enqueue(document.documentElement)
    dequeue()
}

function sendWS(message) {

    ws.send(JSON.stringify(message))
}

provide('automations', automations)
provide('clientReadyState', clientReadyState)
provide('closeAllDetails', closeAllDetails)
provide('copyMessage', copyMessage)
provide('diagramBuilder', diagramBuilder)
provide('diagramSource', diagramSource)
provide('hueBridgeModels', hueBridgeModels)
provide('isWsOpen', isWsOpen)
provide('lightingEnabled', lightingEnabled)
provide('nextId', nextId)
provide('openPanel', openPanel)
provide('powerviewHubModels', powerviewHubModels)
provide('refreshDiagrams', refreshDiagrams)
provide('shadesEnabled', shadesEnabled)
provide('sunPositionTimer', sunPositionTimer)
provide('sendWS', sendWS)
provide('wsReadyState', wsReadyState)
provide('wsUrl', wsUrl)

mermaidHandler = mermaidClick
initializeMermaid()
</script>