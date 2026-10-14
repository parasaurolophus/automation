<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <DetailsComponent>
        <template #summary>
            powerview hubs
        </template>
        <PowerviewHub v-for="(hub, index) of powerviewHubModels" :key="hub.id" v-model="powerviewHubModels[index]" />
    </DetailsComponent>
</template>

<script setup>
import DetailsComponent from './DetailsComponent.vue'
import PowerviewHub from './PowerviewHub.vue'
import { inject } from 'vue'

const powerviewHubModels = inject('powerviewHubModels')
</script>