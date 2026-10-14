<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <fieldset>
        <legend>enable automation</legend>
        <ToggleSwitch v-model="lightingEnabled" :toggle="toggleLightingEnabled">
            lighting
        </ToggleSwitch>
        <ToggleSwitch v-model="shadesEnabled" :toggle="toggleShadesEnabled">
            shades
        </ToggleSwitch>
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
import ToggleSwitch from './ToggleSwitch.vue'
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