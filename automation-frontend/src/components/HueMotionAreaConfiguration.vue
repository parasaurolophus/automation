<!-- Copyright (c) 2026 Kirk Rader -->

<template>
    <details name="home">
        <summary>motion areas</summary>
        <fieldset>
            <dl>
                <template v-for="(bridge, index) of hueBridgeModels" :key="bridge.id">
                    <template v-if="hasMotionArea(bridge)">
                        <MotionAreaBridge v-model="hueBridgeModels[index]" />
                    </template>
                </template>
            </dl>
        </fieldset>
    </details>
</template>

<script setup>
import MotionAreaBridge from './MotionAreaBridge.vue'
import { inject } from 'vue'

const hueBridgeModels = inject('hueBridgeModels')

function hasMotionArea(bridge) {

    for (let group of bridge.groups) {

        if (group.motionArea) {

            return true
        }
    }

    return false
}
</script>