<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <details name="home">
        <summary>powerview hubs</summary>
        <PowerviewHub v-for="(hub, index) of powerviewHubModels" :key="hub.id" v-model="powerviewHubModels[index]" />
    </details>
</template>

<script setup>
import PowerviewHub from './PowerviewHub.vue'
import { inject } from 'vue'

const powerviewHubModels = inject('powerviewHubModels')
</script>