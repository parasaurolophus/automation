<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <div>
        <div class="title">
            <input type="button" :value="scene.name" @click="activate" class="scene">
        </div>
        <div class="subtitle clickable" @click.prevent.stop="copyMessage(message)">
            {{ scene.id }}
        </div>
    </div>
</template>

<style scoped>
.scene {
    color: var(--background);
    background-color: var(--foreground);
    border-color: var(--foreground);
}
</style>

<script setup>
import { inject } from 'vue'

const copyMessage = inject('copyMessage')
const hub = defineModel('hub')
const scene = defineModel('scene')
const sendWS = inject('sendWS')

function activate() {

    sendWS(message())
}

function message() {

    if (hub.value.type === 'legacy') {

        return {
            topic: `get/powerview/${hub.value.id}/scenes`,
            query: `?sceneId=${scene.value.id}`,
        }
    }

    return {
        topic: `put/powerview/${hub.value.id}/scenes/${scene.value.id}/activate`,
    }
}
</script>