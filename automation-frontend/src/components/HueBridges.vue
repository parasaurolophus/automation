<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <details :name="name">
        <summary>hue bridges</summary>
        <HueBridge v-for="(bridge, index) of hueBridgeModels" :key="bridge.id" v-model="hueBridgeModels[index]" name="hue-bridges" />
    </details>
</template>

<script setup>
import HueBridge from './HueBridge.vue'
import { inject } from 'vue'

const { name } = defineProps({

    name: {
        type: String,
        required: true,
    },
})

const hueBridgeModels = inject('hueBridgeModels')
</script>