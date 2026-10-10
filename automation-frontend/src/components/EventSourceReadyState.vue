<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <div :class="`readystate ${readyState}`">
        <MdiIcon :path="readyStateIcon" :scale="0.5" />
        <span>
            {{ props.label || readyState }}
        </span>
    </div>
</template>

<script setup>
import { mdiCircle, mdiCircleOutline } from '@mdi/js'
import { computed } from 'vue'
import MdiIcon from './MdiIcon.vue'

const props = defineProps({

    label: {
        type: String,
    },
})

const readyState = defineModel()

const readyStateIcon = computed(() => {

    return readyState.value === 'open' ? mdiCircle : mdiCircleOutline
})
</script>