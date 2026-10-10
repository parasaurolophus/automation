<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <video v-if="isWsOpen" muted autoplay loop>
        <source src="/running.webm">
    </video>
    <img v-else src="/stopped.png">
</template>

<script setup>
import { inject } from 'vue'

const isWsOpen = inject('isWsOpen')
</script>