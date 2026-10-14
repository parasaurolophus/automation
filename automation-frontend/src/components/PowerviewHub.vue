<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <DetailsComponent :id="hub.id">
        <template #summary>
            {{ hub.name }}
        </template>
        <template #subtitle>
            <div @click.prevent.stop="copy" class="clickable">
                {{ hub.id }}
            </div>
            <div v-if="hub.type !== 'legacy'">
                <a :href="swaggerUrl" target="_blank">
                    {{ swaggerUrl }}
                </a>
            </div>
        </template>
        <template v-for="(room, index) of hub.rooms" :key="room.id">
            <PowerviewRoom v-if="!isEmpty(room)" v-model:hub="hub" v-model:room="hub.rooms[index]" />
        </template>
    </DetailsComponent>
</template>

<script setup>
import DetailsComponent from './DetailsComponent.vue'
import PowerviewRoom from './PowerviewRoom.vue'
import { inject } from 'vue'

const copyMessage = inject('copyMessage')
const hub = defineModel()
const swaggerUrl = `http://${hub.value.address}/gateway/swagger?enable=true`

function copy(event) {

    copyMessage(() => event.target.innerText)
}

function isEmpty(room) {

    return room.scenes.length === 0 && room.shades.length === 0
}
</script>