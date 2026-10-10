<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <div :class="`readystate clickable ${readyStateText}`" @click="closeAllDetails">
        <MdiIcon :path="readyStateIcon" :scale="0.5" />
        <span>
            {{ props.label || readyStateText }}
        </span>
    </div>
</template>

<script setup>
import { mdiCircle, mdiCircleOutline } from '@mdi/js'
import { computed, inject } from 'vue'
import MdiIcon from './MdiIcon.vue'

const closeAllDetails = inject('closeAllDetails')

const props = defineProps({

    label: {
        type: String,
    },
})

const readyState = defineModel()

const readyStateText = computed(() => {

    switch (readyState.value) {

        case WebSocket.CLOSED:
            return 'closed'

        case WebSocket.CLOSING:
            return 'closing'

        case WebSocket.CONNECTING:
            return 'connecting'

        case WebSocket.OPEN:
            return 'open'

        default:
            return 'unknown'
    }
})

const readyStateIcon = computed(() => {

    return readyState.value === WebSocket.OPEN ? mdiCircle : mdiCircleOutline
})
</script>