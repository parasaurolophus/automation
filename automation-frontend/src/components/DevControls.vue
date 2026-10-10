<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <fieldset>
        <legend>test</legend>
        <input type="button" value="add event" @click="addEvent">
        <input type="button" value="reset events" @click="resetEvents">
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

let counter = 0
const sendWS = inject('sendWS')

function addEvent() {

    sendWS({
        topic: 'put/event',
        payload: {
            location: {
                latitude: Number.parseFloat(import.meta.env['VITE_LATITUDE']),
                longitude: Number.parseFloat(import.meta.env['VITE_LONGITUDE']),
                elevation: Number.parseFloat(import.meta.env['VITE_ELEVATION']),
            },
            name: `test${++counter}`,
            timestamp: Date.now() + 5000,
        },
    })
}

function resetEvents() {

    sendWS({ topic: 'reset/events' })
}
</script>