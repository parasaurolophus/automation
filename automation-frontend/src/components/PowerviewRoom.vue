<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <DetailsComponent @toggle="onToggle">
        <template #summary>{{ room.name }}</template>
        <template #subtitle>
            <span @click.prevent.stop="copy" class="clickable">
                {{ room.id }}
            </span>
        </template>
        <fieldset v-if="room.scenes.length > 0">
            <legend>scenes</legend>
            <PowerviewScene v-for="(scene, index) of room.scenes" :key="scene.id" v-model:hub="hub"
                v-model:scene="room.scenes[index]" />
        </fieldset>
        <fieldset v-if="room.shades.length > 0">
            <legend>shades</legend>
            <PowerviewShade v-for="(shade, index) of room.shades" :key="shade.id" v-model="room.shades[index]" />
        </fieldset>
    </DetailsComponent>
</template>

<style scoped>
fieldset {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

fieldset>* {
    display: inline-block;
    padding: 0.5rem;
}
</style>

<script setup>
import DetailsComponent from './DetailsComponent.vue'
import PowerviewScene from './PowerviewScene.vue'
import PowerviewShade from './PowerviewShade.vue'
import { inject } from 'vue'

const copyMessage = inject('copyMessage')
const hub = defineModel('hub')
let refreshTimer = null
const room = defineModel('room')
const sendWS = inject('sendWS')

function copy(event) {

    copyMessage(() => event.target.innerText)
}

function onToggle(newState) {

    if (hub.value.type === 'legacy') {

        if (newState) {

            startRefreshTimer()

        } else {

            stopRefreshTimer()
        }
    }
}

function refreshShades() {

    sendWS({
        topic: `get/powerview/${hub.value.id}/shades`,
    })
}

function startRefreshTimer() {

    stopRefreshTimer()
    refreshTimer = setInterval(refreshShades, 5000)
}

function stopRefreshTimer() {

    if (refreshTimer !== null) {

        clearInterval(refreshTimer)
        refreshTimer = null
    }
}
</script>