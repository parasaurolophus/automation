<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <div class="shade">
        <div class="title">
            {{ shade.name }}
        </div>
        <div class="subtitle clickable" @click.prevent.stop="copy">
            {{ shade.id }}
        </div>
        <div class="status">
            <div :class="`status ${positionClass}`">
                <div>
                    <MdiIcon :path="mdiRollerShade" />
                    {{ positionValue }}% open
                </div>
                <div>
                    <meter :value="shade.position"></meter>
                </div>
            </div>
            <div :class="`status ${batteryStatus}`">
                <div>
                    <MdiIcon :path="batteryIcon" :class="batteryStatus" />
                    <span :class="batteryStatus">{{ batteryStatus }}</span>
                </div>
                <div>
                    <meter low="1" hight="2" max="3" optimum="3" :value="shade.batteryStatus"></meter>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.open {
    color: var(--primary);
}

.closed {
    color: inherit;
}

.high {
    color: var(--success);
}

.medium {
    color: var(--warning);
}

.low,
.critical {
    color: var(--failure);
}
</style>

<script setup>
import MdiIcon from './MdiIcon.vue'
import { mdiBatteryAlertVariantOutline, mdiBattery20, mdiBattery50, mdiBattery90, mdiRollerShade } from '@mdi/js'
import { inject, ref, watch } from 'vue'

const copyMessage = inject('copyMessage')
const batteryIcon = ref(mdiBatteryAlertVariantOutline)
const batteryStatus = ref(0)
const positionValue = ref(0)
const positionClass = ref('closed')
const shade = defineModel()

function copy(event) {

    copyMessage(() => event.target.innerText)
}

watch(
    shade,
    () => {
        positionValue.value = Math.round(shade.value.position * 100)
        positionClass.value = positionValue.value > 0 ? 'open' : 'closed'

        switch (shade.value.batteryStatus) {

            case 0:
                batteryIcon.value = mdiBatteryAlertVariantOutline
                break

            case 1:
                batteryIcon.value = mdiBattery20
                break

            case 2:
                batteryIcon.value = mdiBattery50
                break

            case 3:
                batteryIcon.value = mdiBattery90
                break

            default:
                throw new Error(`unrecognized batteryStatus ${shade.value.batteryStatus}`)
        }

        switch (shade.value.batteryStatus) {

            case 0:
                batteryStatus.value = 'critical'
                break

            case 1:
                batteryStatus.value = 'low'
                break

            case 2:
                batteryStatus.value = 'medium'
                break

            case 3:
                batteryStatus.value = 'high'
                break

            default:
                throw new Error(`unrecognized batteryStatus ${shade.value.batteryStatus}`)
        }
    },
    {
        deep: true,
        immediate: true
    }
)
</script>