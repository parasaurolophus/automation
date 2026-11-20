<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <fieldset>
        <legend>
            <input :id="resource.id" type="checkbox" switch v-model="resource.on.on" @click.stop.prevent="toggle">
            <label :for="resource.id">{{ name || resource.metadata?.name || resource.id }}</label>
        </legend>
        <div class="subtitle">
            <span @click.prevent.stop="copyMessage(message)" class="clickable">
                {{ resource.type }} {{ resource.id }}
            </span>
        </div>
    </fieldset>
</template>

<script setup>
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