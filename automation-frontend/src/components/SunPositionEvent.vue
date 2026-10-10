<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <MdiIcon :path="icon" :scale="0.5" />
    <input type="button" :value="event.name" @click="trigger">
    <span class="date">{{ date.toLocaleDateString() }}</span>
    <span class="time">{{ date.toLocaleTimeString() }}</span>
</template>

<style scoped>
.date,
.time {
    margin-left: 1rem;
    text-align: right;
}
</style>

<script setup>
import MdiIcon from '@/components/MdiIcon.vue'
import { mdiCircle, mdiCircleOutline } from '@mdi/js'
import { computed, inject, ref, watch } from 'vue'

const event = defineModel()
const date = ref(new Date(event.value.timestamp))
const icon = computed(() => event.value.isPending ? mdiCircle : mdiCircleOutline)
const sendWS = inject('sendWS')

function trigger() {

    sendWS({
        topic: 'trigger',
        payload: event.value.name,
    })
}

watch(event, () => date.value = new Date(event.value.timestamp))
</script>