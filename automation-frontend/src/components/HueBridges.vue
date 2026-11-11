<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <details name="home">
        <summary>hue bridges</summary>
        <HueBridge v-for="(bridge, index) of hueBridgeModels" :key="bridge.id" v-model="hueBridgeModels[index]" />
    </details>
</template>

<script setup>
import HueBridge from './HueBridge.vue'
import { inject } from 'vue'

const hueBridgeModels = inject('hueBridgeModels')
</script>