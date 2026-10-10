// Copyright(c) 2026 Kirk Rader

import { Flowchart } from './mermaidUtilities.js'

function buildHomeDiagram({ clientReadyState, hueBridgeModels, lightingEnabled, powerviewHubModels, shadesEnabled }) {

    const flowchart = new Flowchart('flowchart', 'LR', 'monotoneX')
    let events = null
    let spa = null
    let lighting = null
    let bridgeClients = []
    let shades = null
    let hubClients = []

    function buildTimer() {

        events = flowchart.addNode('@{ shape: processes, label: "SunPositionEvent" }')
    }

    const hueReadyState = clientReadyState.hue ?? {}

    function buildLighting() {

        if (hueBridgeModels.length > 0) {

            lighting = flowchart.addNode('(( ))')

            for (let client of hueBridgeModels) {

                const node = flowchart.addNode(`["${client.name}<br>HueBridgeClient"]`)
                const readyState = hueReadyState[client.id]

                bridgeClients.push({
                    name: client.name,
                    node: node,
                    id: client.id,
                    readyState: readyState,
                })
            }
        }
    }

    const powerviewReadyState = clientReadyState.powerview ?? {}

    function buildShades() {

        if (powerviewHubModels.length > 0) {

            shades = flowchart.addNode('(( ))')

            for (let client of powerviewHubModels) {

                const node = flowchart.addNode(`["${client.name}<br>PowerviewHubClient"]`)
                const readyState = powerviewReadyState[client.id]

                hubClients.push({
                    name: client.name,
                    node: node,
                    id: client.id,
                    type: client.type,
                    readyState: readyState,
                })
            }
        }
    }

    function buildExpress() {

        flowchart.addSubgraph('[SunPositionTimer]', buildTimer)

        buildLighting()
        buildShades()
    }

    const browser = flowchart.addSubgraph('["browser"]', () => spa = flowchart.addNode('([frontend<br>SPA])'))
    const express = flowchart.addSubgraph('["express"]', buildExpress)

    flowchart.addEdge(spa, '<-- WebSocket -->', express)
    flowchart.addEdge(browser, '-- HTTP -->', express)

    for (let client of bridgeClients) {

        const bridge = flowchart.addSubgraph(`["${client.name}<br>Hue Bridge"]`, () => {

            const groups = flowchart.addNode('@{ shape: processes, label: "rooms & zones" }')

            flowchart.addClick(groups, client.id)
        })

        const devices = flowchart.addNode('@{ shape: processes, label: "Hue Lights" }')
        const a = flowchart.addEdge(lighting, '-->', client.node)
        const e = flowchart.addEdge(client.node, '<-- "HTTPS →<br>← EventSource" -->', bridge)

        flowchart.addClass(lightingEnabled ? 'automation-enabled' : 'automation-disabled', a)
        flowchart.addEdge(bridge, '<-- Zigbee -->', devices)
        flowchart.addClick(client.node, client.id)

        if (client.readyState !== undefined) {

            flowchart.addClass(client.readyState, client.node, bridge, e)
        }
    }

    for (let client of hubClients) {

        const hub = flowchart.addSubgraph(`["${client.name}<br>Powerview Hub"]`, () => {

            const rooms = flowchart.addNode('@{ shape: processes, label: "rooms" }')

            flowchart.addClick(rooms, client.id)
        })

        const devices = flowchart.addNode('@{ shape: processes, label: "Powerview Shades" }')
        const a = flowchart.addEdge(shades, '-->', client.node)

        flowchart.addClass(shadesEnabled ? 'automation-enabled' : 'automation-disabled', a)

        if (client.type === 'legacy') {

            const e = flowchart.addEdge(client.node, '-- HTTP -->', hub)
            flowchart.addEdge(hub, '<-- undocumented<br>protocol -->', devices)
            flowchart.addClass('http', client.node, hub, e)

        } else {

            const e = flowchart.addEdge(client.node, '<-- HTTP →<br>← EventSource -->', hub)

            flowchart.addEdge(hub, '<-- "Bluetooth" -->', devices)

            if (client.readyState !== undefined) {

                flowchart.addClass(client.readyState, client.node, hub, e)
            }
        }

        flowchart.addClick(client.node, client.id)
    }

    const lightingAutomation = flowchart.addEdge(events, '---', lighting)
    const shadesAutomation = flowchart.addEdge(events, '---', shades)

    flowchart.addClick(spa, 'home')
    flowchart.addClick(lighting, 'huebridges')
    flowchart.addClick(shades, 'powerviewhubs')
    flowchart.addClick(events, 'sunpositiontimer')

    if (lightingEnabled) {

        flowchart.addClass('automation-enabled', lighting, lightingAutomation)

    } else {

        flowchart.addClass('automation-disabled', lighting, lightingAutomation)
    }

    if (shadesEnabled) {

        flowchart.addClass('automation-enabled', shades, shadesAutomation)

    } else {

        flowchart.addClass('automation-disabled', shades, shadesAutomation)
    }

    flowchart.addClassDef('http', 'stroke: blue')
    flowchart.addClassDef('open', 'stroke: green')
    flowchart.addClassDef('connecting', 'stroke: yellow')
    flowchart.addClassDef('closed', 'stroke: red')
    flowchart.addClassDef('automation-enabled', 'stroke-dasharray: 9,5, stroke-dashoffset: 900, animation: dash 25s linear infinite, fill: transparent')
    flowchart.addClassDef('automation-disabled', 'stroke-dasharray: 9,5, stroke-dashoffset: 900, fill: transparent')
    return flowchart.source
}

export { buildHomeDiagram }