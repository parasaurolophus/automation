<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <div class="statusbar">
        <WebSocketReadyState v-model="wsReadyState" :label="wsUrl" />
        <template v-for="(hub, index) in powerviewHubModels" :key="hub.id">
            <template v-if="hub.type === 'legacy'">
                <VerticalDivider />
                <LegacyHub v-model="powerviewHubModels[index]" @click="openPanel(hub.id)" class="clickable" />
            </template>
        </template>
        <template v-for="(states, type) in clientReadyState" :key="type">
            <template v-for="(state, id) in states" :key="id">
                <VerticalDivider />
                <EventSourceReadyState v-model="states[id]" :label="label(type, id)" @click="openPanel(id)"
                    class="clickable" />
            </template>
        </template>
    </div>
</template>

<style scoped>
.statusbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--highlight);
    padding-right: 1em;
}
</style>

<script setup>
import EventSourceReadyState from '@/components/EventSourceReadyState.vue'
import LegacyHub from '@/components/LegacyHub.vue'
import VerticalDivider from '@/components/VerticalDivider.vue'
import WebSocketReadyState from '@/components/WebSocketReadyState.vue'
import { inject } from 'vue'

const clientReadyState = inject('clientReadyState')
const hueBridgeModels = inject('hueBridgeModels')
const openPanel = inject('openPanel')
const powerviewHubModels = inject('powerviewHubModels')
const wsReadyState = inject('wsReadyState')
const wsUrl = inject('wsUrl')

function label(type, id) {

    const models = type === 'hue' ? hueBridgeModels.value : powerviewHubModels.value

    for (let model of models) {

        if (model.id === id) {

            return model.name
        }
    }

    return id
}
</script>