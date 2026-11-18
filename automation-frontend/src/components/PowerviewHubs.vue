<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <details :name="name">
        <summary>powerview hubs</summary>
        <PowerviewHub v-for="(hub, index) of powerviewHubModels" :key="hub.id" v-model="powerviewHubModels[index]" />
    </details>
</template>

<script setup>
import PowerviewHub from './PowerviewHub.vue'
import { inject } from 'vue'

const { name } = defineProps({

    name: {
        type: String,
        required: true,
    },
})

const powerviewHubModels = inject('powerviewHubModels')
</script>