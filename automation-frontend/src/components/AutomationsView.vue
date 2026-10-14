<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <DetailsComponent>
        <template #summary>
            automations
        </template>
        <DetailsComponent v-for="(forThemes, deviceType) in automations">
            <template #summary>
                {{ deviceType }}
            </template>
            <DetailsComponent v-for="(forEvents, theme) in forThemes">
                <template #summary>
                    {{ theme }}
                </template>
                <DetailsComponent v-for="(messages, event) in forEvents">
                    <template #summary>
                        {{ event }}
                    </template>
                    <DetailsComponent v-for="(message, index) of messages" :key="index">
                        <template #summary>
                            {{ formatMessage(deviceType, theme, event, message) }}
                        </template>
                        <pre>{{ JSON.stringify(message, undefined, 2) }}</pre>
                    </DetailsComponent>
                </DetailsComponent>
            </DetailsComponent>
        </DetailsComponent>
    </DetailsComponent>
</template>

<script setup>
import DetailsComponent from './DetailsComponent.vue'
import { inject } from 'vue'

const automations = inject('automations')
const hueBridgeModels = inject('hueBridgeModels')
const powerviewHubModels = inject('powerviewHubModels')

function formatMessage(deviceType, theme, event, message) {

    switch (deviceType) {

        case 'hue':
            return formatHueMessage(theme, event, message)

        case 'powerview':
            return formatPowerviewMessage(theme, event, message)
    }

    return `${deviceType} ${theme} ${event}`
}

function formatHueMessage(theme, event, message) {

    const matches = new RegExp('^put/hue/([^/]+)/resource/([^/]+)/([^/]+)$').exec(message.topic)

    if (!matches) {

        return message.topic
    }

    const bridgeId = matches[1]
    const resourceType = matches[2]
    const resourceId = matches[3]

    for (let bridge of hueBridgeModels.value) {

        if (bridge.id === bridgeId) {

            switch (resourceType) {

                case 'grouped_light':
                    return formatHueGroupLightMessage(bridge, resourceType, resourceId, message)

                case 'light':
                    return formatHueLightMessage(bridge, resourceType, resourceId, message)

                case 'scene':
                    return formatHueSceneMessage(bridge, resourceType, resourceId, message)
            }

            break
        }
    }

    return `hue bridge "${bridgeId}" "${resourceType}" "${resourceId}"`
}

function formatHueGroupLightMessage(bridge, resourceType, resourceId, message) {

    for (let group of bridge.groups) {

        if (group.groupedLight.id === resourceId) {

            return `turn group "${group.name}" of hue bridge "${bridge.name}" ${message.payload.on.on ? 'on' : 'off'}`
        }
    }

    return `turn "${resourceType}" "${resourceId}" of hue bridge "${bridge.name}" ${message.payload.on.on ? 'on' : 'off'}`
}

function formatHueLightMessage(bridge, resourceType, resourceId, message) {

    for (let group of bridge.groups) {

        for (let light of group.lights) {

            if (light.id === resourceId) {

                return `turn "${light.name}" in "${group.name}" of hue "${bridge.name}" ${message.payload.on.on ? 'on' : 'off'}`
            }
        }
    }

    return `turn "${resourceType}" "${resourceId}" of hue "${bridge.name}" ${message.payload.on.on ? 'on' : 'off'}`
}

function formatHueSceneMessage(bridge, resourceType, resourceId, message) {

    for (let group of bridge.groups) {

        for (let scene of group.scenes) {

            if (scene.id === resourceId) {

                return `set scene "${scene.name}" in group "${group.name}" of hue bridge "${bridge.name}" to ${message.payload.recall.action}`
            }
        }
    }

    return `set "${resourceType}" "${resourceId}" of hue "${bridge.name}" to ${message.payload.recall.action}`
}

function formatPowerviewMessage(theme, event, message) {

    const matches = new RegExp('^(put|get)/powerview/([^/]+)/.+').exec(message.topic)

    if (!matches) {

        return message.topic
    }

    for (let hub of powerviewHubModels.value) {

        if (hub.id == matches[2]) {

            if (hub.type === 'legacy') {

                return formatPowerviewLegacyMessage(hub, message)
            }

            return formatPowerviewGen3Message(hub, message)
        }
    }

    return `powerview hub "${matches[2]}" "${theme}" "${event}" ${message.topic}`
}

function formatPowerviewLegacyMessage(hub, message) {

    try {

        const sceneId = message.query.split('=')[1]

        for (let room of hub.rooms) {

            for (let scene of room.scenes) {

                if (scene.id == sceneId) {

                    return `activate scene "${scene.name}" of powerview hub "${hub.name}"`
                }
            }
        }

    } catch (error) {

        console.error(error)
    }

    return `powerview legacy hub "${hub.name}" "${message.topic}"`
}

function formatPowerviewGen3Message(hub, message) {

    const matches = new RegExp('^put/powerview/([^/]+)/scenes/([^/]+)/activate$').exec(message.topic)

    if (!matches) {

        throw new Error(`unexpected topic "${message.topic}"`)
    }

    const sceneId = matches[2]

    for (let room of hub.rooms) {

        for (let scene of room.scenes) {

            if (scene.id == sceneId) {

                return `activate scene "${scene.name}" of powerview hub "${hub.name}"`
            }
        }
    }
}
</script>