<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <fieldset>
        <legend>sun position timer</legend>
        <div class="events">
            <SunPositionEvent v-for="(event, index) of sunPositionTimer" :key="event.name"
                v-model="sunPositionTimer[index]" />
        </div>
    </fieldset>
</template>

<style scoped>
.events {
    display: grid;
    grid-template-columns: repeat(4, max-content);
    gap: normal;
}
</style>

<script setup>
import SunPositionEvent from './SunPositionEvent.vue'
import { inject } from 'vue'

const sunPositionTimer = inject('sunPositionTimer')
</script>