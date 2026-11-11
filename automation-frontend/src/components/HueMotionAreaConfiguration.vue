<!-- Copyright (c) 2026 Kirk Rader -->

<template>
    <details name="home">
        <summary>motion areas</summary>
        <fieldset>
            <dl>
                <template v-for="bridge of findBridge('c42996fffec424ab')" :key="bridge.id">
                    <dt>
                        <div>{{ bridge.name }}</div>
                        <div>{{ bridge.id }}</div>
                    </dt>
                    <dd>
                        <template v-for="group of findGroup(bridge, 'b24e9ff4-7919-4049-9802-b50f9dbabf95')"
                            :key="group.id">
                            <template v-if="group.motionArea">
                                <table>
                                    <caption>
                                        <div>{{ group.name }}</div>
                                        <div>{{ group.id }}</div>
                                        <div>{{ group.groupedLight.id }}</div>
                                    </caption>
                                    <thead>
                                        <tr>
                                            <th>type</th>
                                            <th>motion</th>
                                            <th>valid</th>
                                            <th>scene name</th>
                                            <th>scene id</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>convenience</th>
                                            <td>{{ group.motionArea.convenience.motion.motion }}</td>
                                            <td>{{ group.motionArea.convenience.motion.motion_valid }}</td>
                                            <template v-for="id of [convenienceSceneId(group)]">
                                                <td>{{ sceneName(bridge, id) }}</td>
                                                <td>{{ id }}</td>
                                            </template>
                                        </tr>
                                    </tbody>
                                </table>
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

function convenienceSceneId(group) {

    if (group.motionArea.convenienceBehavior) {

        for (let index = 0; index < group.motionArea.convenienceBehavior.configuration.motion.when.timeslots.length; ++index) {

            if (group.motionArea.convenienceBehavior.configuration.motion.when.timeslots[index].start_time.time.hour !== 21) {

                return group.motionArea.convenienceBehavior.configuration.motion.when.timeslots[index].on_motion.recall_single[0].action.recall.rid
            }
        }
    }

    return 'none'
}

function findBridge(id) {

    for (let bridge of hueBridgeModels.value) {

        if (bridge.id === id) {

            return [bridge]
        }
    }

    return []
}

function findGroup(bridge, id) {

    for (let group of bridge.groups) {

        if (group.id === id) {

            return [group]
        }
    }

    return []
}

function sceneName(bridge, id) {

    for (let resource of bridge.resources) {

        if (resource.id === id) {

            return resource.metadata.name
        }
    }

    return id
}
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