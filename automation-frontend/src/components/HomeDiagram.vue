<!-- Copyright (c) 2026 Kirk Rader -->

<template>
    <mermaid-diagram svg-id="diagram" v-model="diagramSource" />
</template>

<script setup>
import MermaidDiagram from './MermaidDiagram.vue'
import { inject, onMounted, watch } from 'vue'

const clientReadyState = inject('clientReadyState')
const diagramBuilder = inject('diagramBuilder')
const diagramSource = inject('diagramSource')
const hueBridgeModels = inject('hueBridgeModels')
const lightingEnabled = inject('lightingEnabled')
const powerviewHubModels = inject('powerviewHubModels')
const shadesEnabled = inject('shadesEnabled')

function refreshDiagram() {

    diagramSource.value = diagramBuilder.value({
        clientReadyState: clientReadyState.value,
        hueBridgeModels: hueBridgeModels.value,
        lightingEnabled: lightingEnabled.value,
        powerviewHubModels: powerviewHubModels.value,
        shadesEnabled: shadesEnabled.value,
    })
}

onMounted(refreshDiagram)
watch(hueBridgeModels, refreshDiagram, { deep: true, })
watch(powerviewHubModels, refreshDiagram, { deep: true })
watch(clientReadyState, refreshDiagram, { deep: true })
watch(shadesEnabled, refreshDiagram)
watch(lightingEnabled, refreshDiagram)
</script>