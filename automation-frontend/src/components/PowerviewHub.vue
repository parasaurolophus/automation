<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <details :id="hub.id" name="powerview-hub">
        <summary>{{ hub.name }}</summary>
        <div class="subtitle">
            <div @click.prevent.stop="copy" class="clickable">
                {{ hub.id }}
            </div>
            <div v-if="hub.type !== 'legacy'">
                <a :href="swaggerUrl" target="_blank">
                    {{ swaggerUrl }}
                </a>
            </div>
        </div>
        <template v-for="(room, index) of hub.rooms" :key="room.id">
            <PowerviewRoom v-if="!isEmpty(room)" v-model:hub="hub" v-model:room="hub.rooms[index]" />
        </template>
    </details>
</template>

<script setup>
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