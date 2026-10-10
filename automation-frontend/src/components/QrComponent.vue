<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <div ref="svg" :class="`container ${size}`">
    </div>
</template>

<style scoped>
.container {
    display: inline-block;
    color: black;
    background-color: white;
    border-radius: 0;
}

.small {
    width: 32px;
}

.medium {
    width: 64px;
}

.large {
    width: 128px;
}

.x-large {
    width: 256px;
}
</style>

<script setup>
import encodeQR from 'qr'
import { onMounted, useTemplateRef, watch } from 'vue'

const { size } = defineProps({

    size: {
        type: String,
        default: 'medium',
    },
})

const svg = useTemplateRef('svg')
const text = defineModel()

function update() {

    svg.value.innerHTML = encodeQR(text.value, 'svg')
}

onMounted(update)
watch(text, update)
</script>