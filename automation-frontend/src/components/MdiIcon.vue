<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <svg :width="24" :height="24" :view-box="`0 0 23 23`" :transform="`scale(${props.scale})`">
        <path :d="props.path" />
    </svg>
</template>

<style scoped>
svg {
    display: inline-block;
}

path {
    fill: currentColor;
    stroke: currentColor;
}
</style>

<script setup>
const props = defineProps({

    path: {
        type: String,
        required: true,
    },

    scale: {
        type: Number,
        default: 1,
    },
})
</script>