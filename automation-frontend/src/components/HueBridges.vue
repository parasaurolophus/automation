<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <DetailsComponent>
        <template #summary>
            hue bridges
        </template>
        <HueBridge v-for="(bridge, index) of hueBridgeModels" :key="bridge.id" v-model="hueBridgeModels[index]" />
    </DetailsComponent>
</template>

<script setup>
import DetailsComponent from './DetailsComponent.vue'
import HueBridge from './HueBridge.vue'
import { inject } from 'vue'

const hueBridgeModels = inject('hueBridgeModels')
</script>