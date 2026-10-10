<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <DetailsComponent :id="bridge.id">
        <template #summary>
            {{ bridge.name }}
        </template>
        <template #subtitle>
            <span @click.prevent.stop="copy" class="clickable">
                {{ bridge.id }}
            </span>
        </template>
        <HueGroup v-for="(group, index) of bridge.groups" :key="group.id" v-model:bridge="bridge"
            v-model:group="bridge.groups[index]" />
    </DetailsComponent>
</template>

<script setup>
import DetailsComponent from '@/components/DetailsComponent.vue'
import HueGroup from '@/components/HueGroup.vue'
import { inject } from 'vue'

const bridge = defineModel()
const copyMessage = inject('copyMessage')

function copy(event) {

    copyMessage(() => event.target.innerText)
}
</script>