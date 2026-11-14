<!-- Copyright (c) 2026 Kirk Rader -->

<template>
    <dt>
        <div>
            <span class="name">bridge name:</span>
            {{ bridge.name }}
        </div>
        <div>
            <span class="name">bridge id:</span>
            {{ bridge.id }}
        </div>
    </dt>
    <dd>
        <template v-for="(group, index) of bridge.groups" :key="group.id">
            <template v-if="group.motionArea">
                <dl>
                    <dt class="name">group name: {{ group.name }}</dt>
                    <dd>
                        <div>
                            <span class="name">group id:</span>
                            {{ group.id }}
                        </div>
                        <div>
                            <span class="name">grouped light id:</span>
                            {{ group.groupedLight.id }}
                        </div>
                        <div>
                            <span class="name">motion:</span>
                            {{ group.motionArea.convenience.motion.motion }}
                        </div>
                        <div>
                            <span class="name">motion valid:</span>
                            {{ group.motionArea.convenience.motion.motion_valid }}
                        </div>
                        <template v-if="timeslots(group)">
                            <MotionAreaTimeSlots v-model:bridge="bridge" v-model:group="bridge.groups[index]" />
                        </template>
                        <pre v-else>{{ JSON.stringify(group.motionArea, undefined, 2) }}</pre>
                    </dd>
                </dl>
            </template>
        </template>
    </dd>
</template>

<style scoped>
.name {
    font-weight: bold;
}
</style>

<script setup>
import MotionAreaTimeSlots from './MotionAreaTimeSlots.vue'

const bridge = defineModel()

function timeslots(group) {

    return group.motionArea?.convenienceBehavior?.configuration?.motion?.when?.timeslots ?? []
}
</script>