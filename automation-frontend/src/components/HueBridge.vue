<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <details :id="bridge.id" :name="name">
        <summary>{{ bridge.name }}</summary>
        <div @click.prevent.stop="copy" class="clickable subtitle">
            {{ bridge.id }}
        </div>
        <HueGroup v-for="(group, index) of bridge.groups" :key="group.id" v-model:bridge="bridge"
            v-model:group="bridge.groups[index]" />
    </details>
</template>

<script setup>
import HueGroup from './HueGroup.vue'
import { inject } from 'vue'

const { name } = defineProps({

    name: {
        type: String,
        required: true,
    },
})

const bridge = defineModel()
const copyMessage = inject('copyMessage')

function copy(event) {

    copyMessage(() => event.target.innerText)
}
</script>