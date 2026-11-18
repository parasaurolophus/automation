<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <ToggleSwitch v-model="resource.on.on" :toggle="toggle">
        <span>{{ name || resource.metadata?.name || resource.id }}</span>
        <template #subtitle>
            <span @click.prevent.stop="copyMessage(message)" class="clickable">
                {{ resource.type }} {{ resource.id }}
            </span>
        </template>
    </ToggleSwitch>
</template>

<script setup>
import ToggleSwitch from './ToggleSwitch.vue'
import { inject } from 'vue'

const { name } = defineProps({

    name: {
        type: String,
    },
})

const bridge = defineModel('bridge', { required: true })
const copyMessage = inject('copyMessage')
const resource = defineModel('resource', { required: true })
const sendWS = inject('sendWS')

function message() {

    return {
        topic: `put/hue/${bridge.value.id}/resource/${resource.value.type}/${resource.value.id}`,
        payload: { on: { on: !resource.value.on.on } }
    }
}

function toggle() {

    sendWS(message())
}
</script>