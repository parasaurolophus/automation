<!-- Copyright (c) 2026 Kirk Rader -->

<template>
    <table>
        <caption>timeslots:</caption>
        <thead>
            <tr>
                <th>start time</th>
                <th>configured scene</th>
                <th>selected scene</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="(timeslot, index) of timeslots">
                <MotionAreaTimeSlot :styles="styles" v-model:bridge="bridge" v-model:group="group"
                    v-model:timeslot="timeslots[index]" />
            </template>
        </tbody>
    </table>
</template>

<style module>
table>caption {
    text-align: start;
}

.end {
    text-align: end;
}

td,
th {
    border-radius: 0;
    margin-left: 0.5rem;
    padding-left: 0.5rem;
}

tbody td,
tbody th {
    border-top: 1px solid var(--foreground);
}

td:not(:first-child),
th:not(:first-child) {
    border-left: 1px solid var(--foreground);
}
</style>

<script setup>
import MotionAreaTimeSlot from './MotionAreaTimeSlot.vue'
import { computed, useCssModule } from 'vue'

const bridge = defineModel('bridge')
const group = defineModel('group')
const styles = useCssModule()
const timeslots = computed(() => group.value.motionArea.convenienceBehavior.configuration.motion.when.timeslots)
</script>