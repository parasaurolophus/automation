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

<!--
{
  "id": "ffa37343-d373-4870-ae19-d3bde0ddfaf4",
  "type": "behavior_instance",
  "script_id": "67d9395b-4403-42cc-b5f0-740b699d67c6",
  "enabled": true,
  "state": null,
  "configuration": {
    "motion": {
      "motion_service": {
        "rid": "c4a47e7b-af0b-41f2-be16-622fcf9a9659",
        "rtype": "convenience_area_motion"
      },
      "when": {
        "timeslots": [
          {
            "do_not_disturb": false,
            "on_motion": {
              "recall_single": [
                {
                  "action": {
                    "recall": {
                      "rid": "40bd756d-f9be-45a5-ba47-4211854bbe69",
                      "rtype": "scene"
                    }
                  }
                }
              ]
            },
            "on_no_motion": {
              "after": {
                "minutes": 30
              },
              "recall_single": [
                {
                  "action": "all_off"
                }
              ]
            },
            "start_time": {
              "time": {
                "hour": 21,
                "minute": 0
              },
              "type": "time"
            }
          },
          {
            "do_not_disturb": false,
            "on_motion": {
              "recall_single": [
                {
                  "action": {
                    "recall": {
                      "rid": "929cd971-1f7c-4237-bab7-706314f0d087",
                      "rtype": "scene"
                    }
                  }
                }
              ]
            },
            "on_no_motion": {
              "after": {
                "minutes": 30
              },
              "recall_single": [
                {
                  "action": "all_off"
                }
              ]
            },
            "start_time": {
              "time": {
                "hour": 6,
                "minute": 0
              },
              "type": "time"
            }
          }
        ]
      },
      "where": [
        {
          "group": {
            "rid": "b24e9ff4-7919-4049-9802-b50f9dbabf95",
            "rtype": "room"
          }
        }
      ]
    },
    "source": {
      "rid": "43c25e4d-aa4f-4682-b10f-569b630e7a52",
      "rtype": "motion_area_configuration"
    }
  },
  "dependees": [
    {
      "target": {
        "rid": "43c25e4d-aa4f-4682-b10f-569b630e7a52",
        "rtype": "motion_area_configuration"
      },
      "level": "critical",
      "type": "ResourceDependee"
    },
    {
      "target": {
        "rid": "b24e9ff4-7919-4049-9802-b50f9dbabf95",
        "rtype": "room"
      },
      "level": "critical",
      "type": "ResourceDependee"
    },
    {
      "target": {
        "rid": "40bd756d-f9be-45a5-ba47-4211854bbe69",
        "rtype": "scene"
      },
      "level": "critical",
      "type": "ResourceDependee"
    },
    {
      "target": {
        "rid": "929cd971-1f7c-4237-bab7-706314f0d087",
        "rtype": "scene"
      },
      "level": "critical",
      "type": "ResourceDependee"
    },
    {
      "target": {
        "rid": "c4a47e7b-af0b-41f2-be16-622fcf9a9659",
        "rtype": "convenience_area_motion"
      },
      "level": "critical",
      "type": "ResourceDependee"
    }
  ],
  "status": "running",
  "last_error": "",
  "metadata": {
    "name": "Basement Bath Motion"
  }
}
-->