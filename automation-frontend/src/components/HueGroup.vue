<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <DetailsComponent>
        <template #summary>
            <HueLight :name="group.name" v-model:bridge="bridge" v-model:resource="group.groupedLight" />
        </template>
        <template v-if="group.scenes.length > 0">
            <fieldset>
                <legend>scenes</legend>
                <HueScene v-for="(scene, index) of group.scenes" :key="scene.id" v-model:bridge="bridge"
                    v-model:scene="group.scenes[index]" />
            </fieldset>
        </template>
        <template v-if="group.lights.length > 0">
            <fieldset>
                <legend>lights</legend>
                <HueLight v-for="light of group.lights" :key="light.id" v-model:bridge="bridge"
                    v-model:resource="light.resource" />
            </fieldset>
        </template>
    </DetailsComponent>
</template>

<style scoped>
fieldset {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

fieldset>* {
    padding: 0.5rem;
}
</style>

<script setup>
import DetailsComponent from './DetailsComponent.vue'
import HueLight from './HueLight.vue'
import HueScene from './HueScene.vue'

const bridge = defineModel('bridge')
const group = defineModel('group')
</script>