<!-- Copyright (c) 2026 Kirk Rader -->

<template>
    <DetailsComponent>
        <template #summary>
            home diagram
        </template>
        <pre ref="diagramElement" class="mermaid"></pre>
    </DetailsComponent>
</template>

<script setup>
import DetailsComponent from '@/components/DetailsComponent.vue'
import { inject, onMounted, useTemplateRef, watch } from 'vue'
import mermaid from 'mermaid'

const diagramElement = useTemplateRef('diagramElement')
const diagramSource = defineModel()

const props = defineProps({

    svgId: {
        type: String,
        required: true,
    },
})

const refreshDiagrams = inject('refreshDiagrams')

// "mutex" that isn't actually thread-safe, but good enough for single-threaded
// javascript
let renderLocked = false
const renderQueue = []

async function renderDiagram(source) {

    // check "mutex"
    if (renderLocked) {

        // defer this invocation until after all previous invocations have
        // completed
        renderQueue.push(() => renderDiagram(source))
        return
    }

    try {

        // await mermaid.render() with the critical section locked
        renderLocked = true
        const { svg, bindFunctions } = await mermaid.render(props.svgId, source)
        diagramElement.value.innerHTML = svg
        bindFunctions?.(diagramElement.value)

    } finally {

        // unlock the "mutex" when exiting the critical section
        renderLocked = false
    }

    // invoke the next deferred invocation, if any
    if (renderQueue.length > 0) {

        renderQueue.shift()()
    }
}

function renderModel() {

    renderDiagram(diagramSource.value)
}

onMounted(renderModel)
watch(refreshDiagrams, renderModel)
watch(diagramSource, renderModel)
</script>