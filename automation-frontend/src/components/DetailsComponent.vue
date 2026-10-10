<!-- Copyright (c) Kirk Rader 2026 -->

<template>
    <details @toggle="onToggle">
        <summary class="title">
            <slot name="summary"></slot>
        </summary>
        <div class="subtitle">
            <slot name="subtitle"></slot>
        </div>
        <slot></slot>
    </details>
</template>

<script setup>
const emit = defineEmits(['toggle'])

function closeOtherDetails(event) {

    const allDetails = document.querySelectorAll('details')

    allDetails.forEach(details => {

        if (details.open && details !== event.target) {

            if (event.newState === 'open') {

                if (!details.contains(event.target)) {

                    details.open = false
                }

            } else {

                if (event.target.contains(details)) {

                    details.open = false
                }
            }
        }
    })
}

function onToggle(event) {

    closeOtherDetails(event)
    emit('toggle', event.target.open)
}
</script>