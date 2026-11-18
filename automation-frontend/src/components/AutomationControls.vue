<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <fieldset>
        <legend>enable automation</legend>
        <div>
            <input id="lighting-enabled" type="checkbox" switch v-model="lightingEnabled"
                @click.stop.prevent="toggleLightingEnabled">
            <label for="lighting-enabled">lighting</label>
        </div>
        <div>
            <input id="shades-enabled" type="checkbox" switch v-model="shadesEnabled"
                @click.stop.prevent="toggleShadesEnabled">
            <label for="lighting-enabled">shades</label>
        </div>
    </fieldset>
</template>

<style scoped>
fieldset {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
}
</style>

<script setup>
import { inject } from 'vue'

const lightingEnabled = inject('lightingEnabled')
const sendWS = inject('sendWS')
const shadesEnabled = inject('shadesEnabled')

function toggleLightingEnabled() {

    sendWS({
        topic: 'put/lightingEnabled',
        payload: !lightingEnabled.value,
    })
}

function toggleShadesEnabled() {

    sendWS({
        topic: 'put/shadesEnabled',
        payload: !shadesEnabled.value,
    })
}
</script>