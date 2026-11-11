<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <details :id="bridge.id" name="hue-bridge">
        <summary>{{ bridge.name }}</summary>
        <div class="subtitle">
            <span @click.prevent.stop="copy" class="clickable">
                {{ bridge.id }}
            </span>
        </div>
        <HueGroup v-for="(group, index) of bridge.groups" :key="group.id" v-model:bridge="bridge"
            v-model:group="bridge.groups[index]" />
    </details>
</template>

<script setup>
import HueGroup from './HueGroup.vue'
import { inject } from 'vue'

const bridge = defineModel()
const copyMessage = inject('copyMessage')

function copy(event) {

    copyMessage(() => event.target.innerText)
}
</script>