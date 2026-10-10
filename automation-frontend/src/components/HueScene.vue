<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <div>
        <div class="title">
            <input type="button" :value="scene.name" @click="activate" :class="scene.resource.status.active">
        </div>
        <div class="subtitle clickable" @click.prevent.stop="copyMessage(message)">
            {{ scene.id }}
        </div>
    </div>
</template>

<style scoped>
.static {
    color: var(--background);
    background-color: var(--primary);
    border-color: var(--primary);
}

.dynamic_palette {
    color: var(--background);
    background-color: var(--secondary);
    border-color: var(--secondary);
}

.inactive {
    color: var(--background);
    background-color: var(--foreground);
    border-color: var(--foreground);
}
</style>

<script setup>
import { inject } from 'vue'

const bridge = defineModel('bridge')
const copyMessage = inject('copyMessage')
const scene = defineModel('scene')
const sendWS = inject('sendWS')

function activate() {

    sendWS(message())
}

function message() {

    return {
        topic: `put/hue/${bridge.value.id}/resource/${scene.value.type}/${scene.value.id}`,
        payload: { recall: { action: 'active' } },
    }
}
</script>