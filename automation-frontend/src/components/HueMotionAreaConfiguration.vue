<!-- Copyright (c) 2026 Kirk Rader -->

<template>
    <details name="home">
        <summary>motion areas</summary>
        <fieldset>
            <dl>
                <template v-for="bridge of hueBridgeModels" :key="bridge.id">
                    <dt>{{ bridge.name }}</dt>
                    <dd>
                        <template v-for="group of bridge.groups" :key="group.id">
                            <template v-if="group.motionArea">
                                <table>
                                    <caption>{{ group.name }}</caption>
                                    <thead>
                                        <tr>
                                            <th>type</th>
                                            <th>motion</th>
                                            <th>valid</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>convenience</th>
                                            <td>{{ group.motionArea.convenience.motion.motion }}</td>
                                            <td>{{ group.motionArea.convenience.motion.motion_valid }}</td>
                                        </tr>
                                        <tr>
                                            <th>security</th>
                                            <td>{{ group.motionArea.security.motion.motion }}</td>
                                            <td>{{ group.motionArea.security.motion.motion_valid }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <template v-if="group.motionArea.convenienceBehavior">
                                    <hr>
                                    <p>convenience behavior</p>
                                    <pre>{{ JSON.stringify(group.motionArea.convenienceBehavior, undefined, 2) }}</pre>
                                </template>
                                <template v-if="group.motionArea.securityBehavior">
                                    <hr>
                                    <p>security behavior</p>
                                    <pre>{{ JSON.stringify(group.motionArea.securityBehavior, undefined, 2) }}
</pre>
                                </template>
                            </template>
                        </template>
                    </dd>
                </template>
            </dl>
        </fieldset>
    </details>
</template>

<style scoped>
table {
    margin-top: 1rem;
}

dt,
table>caption {
    font-weight: bold;
}

table>caption,
td,
th {
    text-align: start;
}

td,
th {
    border-radius: 0;
    border-top: 1px solid var(--foreground);
}

td:not(:first-child),
th:not(:first-child) {
    margin-left: 0.5rem;
    padding-left: 0.5rem;
    border-left: 1px solid var(--foreground);
}
</style>

<script setup>
import { inject } from 'vue'

const hueBridgeModels = inject('hueBridgeModels')
const sendWS = inject('sendWS')
</script>