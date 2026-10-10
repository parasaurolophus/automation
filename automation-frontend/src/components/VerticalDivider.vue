<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <div ref="divider" class="verticalDivider">&nbsp;</div>
</template>

<style scoped>
.verticalDivider {
    display: inline-block;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    background-color: var(--foreground);
    color: var(--background);
    border-radius: initial;
    margin: 0 0.5em;
}
</style>

<script setup>
import { onMounted, useTemplateRef } from 'vue'

const props = defineProps({
    width: {
        type: String,
        default: '1px',
    },
})

const divider = useTemplateRef('divider')

onMounted(() => divider.value.style.width = props.width)
</script>