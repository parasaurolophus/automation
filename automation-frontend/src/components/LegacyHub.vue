<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <div class="readystate legacycolor">
        <MdiIcon :path="mdiCircle" :scale="0.5" />
        <span>
            {{ hub.name }}
        </span>
    </div>
</template>

<style scoped>
.legacycolor {
    color: var(--primary);
}
</style>

<script setup>
import { mdiCircle } from '@mdi/js'
import MdiIcon from './MdiIcon.vue'

const hub = defineModel()
</script>