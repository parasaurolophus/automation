<!-- Copyright (c) 2026 Kirk Rader -->

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

<template>
    <tr>
        <td :class="styles.end">{{ timeString }}</td>
        <td> {{ sceneName }}</td>
        <td>
            <select v-model="selectedSceneId">
                <template v-for="scene of group.scenes" :key="scene.id">
                    <option :value="scene.id">
                        {{ scene.name }}
                    </option>
                </template>
            </select>
        </td>
    </tr>
</template>

<script setup>
import { computed, inject, ref, toRaw, watch } from 'vue'

const { styles } = defineProps(['styles'])

const bridge = defineModel('bridge')
const group = defineModel('group')
const timeslot = defineModel('timeslot')
const selectedSceneId = ref(timeslot.value.on_motion.recall_single[0].action.recall.rid)
const sendWS = inject('sendWS')

const sceneName = computed(() => {

    const id = timeslot.value.on_motion.recall_single[0].action.recall.rid

    return findResource(id).metadata.name
})

const timeString = computed(() => {

    const time = timeslot.value.start_time.time

    return `${time.hour % 12}:${time.minute < 10 ? '0' : ''}${time.minute}${time.hour < 12 ? 'AM' : 'PM'}`
})

function findResource(id) {

    for (let resource of bridge.value.resources) {

        if (resource.id === id) {

            return resource
        }
    }

    throw new Error(`no resource found for id ${id}`)
}

watch(selectedSceneId, newSceneId => {

    const convenienceBehavior = group.value.motionArea.convenienceBehavior
    const topic = `put/hue/${bridge.value.id}/resource/${convenienceBehavior.type}/${convenienceBehavior.id}`

    const payload = {
        configuration: {
            motion: {
                motion_service: toRaw(convenienceBehavior.configuration.motion.motion_service),
                when: {
                    timeslots: copyTimeslots(convenienceBehavior),
                },
                where: toRaw(convenienceBehavior.configuration.motion.where),
            }
        }
    }

    const message = {
        topic: topic,
        payload: payload,
    }

    // TODO: send message
    console.log(message)
})

function copyTimeslots(behaviorInstance) {

    return behaviorInstance.configuration.motion.when.timeslots.map(ts => {

        if (ts === timeslot.value) {

            return {
                do_not_disturb: toRaw(ts.do_not_disturb),
                on_motion: {
                    recall_single: [
                        {
                            action: {
                                recall: {
                                    rid: selectedSceneId.value,
                                    rtype: 'scene',
                                },
                            },
                        }
                    ],
                },
                on_no_motion: toRaw(ts.on_no_motion),
                start_time: toRaw(ts.start_time),
            }
        }

        return toRaw(ts)
    })
}
</script>