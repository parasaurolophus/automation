<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <span>
        <div class="toggleswitch title">
            <input :id="id" type="checkbox" switch :checked="model ? true : undefined"
                @click.prevent.stop="props.toggle">
            <label :id="id">
                <slot></slot>
            </label>
        </div>
        <div class="subtitle">
            <slot name="subtitle"></slot>
        </div>
    </span>
</template>

<style scoped>
.toggleswitch {
    display: flex;
    align-items: center;
}

label,
.subtitle {
    width: max-content;
}
</style>

<script setup>
import { inject } from 'vue'

const model = defineModel()
const nextId = inject('nextId')

const props = defineProps({

    id: {
        type: String,
    },

    toggle: {
        type: Function,
        required: true,
    }
})

const id = props.id || nextId()
</script>