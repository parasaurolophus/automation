// Copyright (c) 2026 Kirk Rader

import { compareNames, merge, sortByName } from "./utilities"

function HueLightModel(lightResource) {

    Object.defineProperties(this, {
        id: {
            get() {
                return this.resource.id
            },
            enumerable: true,
        },
        name: {
            get() {
                return this.resource.metadata.name
            },
            enumerable: true,
        },
        on: {
            get() {
                return this.resource.on.on
            },
            enumerable: true,
        },
        resource: {
            value: lightResource,
            configurable: true,
            enumerable: false,
            writable: false,
        },
        type: {
            get() {
                return this.resource.type
            },
            enumerable: true,
        },
    })
}

function HueSceneModel(sceneResource) {

    Object.defineProperties(this, {
        id: {
            get() {
                return this.resource.id
            },
            enumerable: true,
        },
        name: {
            get() {
                return this.resource.metadata.name
            },
            enumerable: true,
        },
        status: {
            get() {
                return this.resource.status.active
            },
            enumerable: true,
        },
        resource: {
            value: sceneResource,
            configurable: true,
            enumerable: false,
            writable: false,
        },
        type: {
            get() {
                return this.resource.type
            },
            enumerable: true,
        },
    })
}

function HueGroupModel(groupResource, resources) {

    let children = null
    let groupedLight = null
    let groupedLightId = null
    let lights = []
    let scenes = []

    if (groupResource.type === 'room') {

        children = groupResource.children.reduce((result, child) => {

            if (child.rtype === 'device') {

                result.push(child.rid)
                return result
            }

            return result

        }, [])

    } else {

        children = groupResource.children.reduce((result, child) => {

            if (child.rtype === 'light') {

                result.push(child.rid)
                return result
            }

            return result

        }, [])
    }

    for (let service of groupResource.services) {

        if (service.rtype === 'grouped_light') {

            groupedLightId = service.rid
            break
        }
    }

    if (groupedLightId === null) {

        throw new Error(`no grouped_light id found for ${groupResource.metadata.name}`)
    }

    for (let resource of resources) {

        if (resource.type === 'grouped_light') {

            if (resource.id === groupedLightId) {

                groupedLight = resource
            }
        }

        if (resource.type === 'light') {

            if (groupResource.type === 'room') {

                if (children.includes(resource.owner.rid)) {

                    lights.push(new HueLightModel(resource))
                }

            } else {

                if (children.includes(resource.id)) {

                    lights.push(new HueLightModel(resource))
                }
            }
        }

        if (resource.type === 'scene') {

            if (resource.group.rid === groupResource.id) {

                scenes.push(new HueSceneModel(resource))
            }
        }
    }

    if (groupedLight === null) {

        throw new Error(`no grouped_light resource found for ${groupResource.metadata.name}`)
    }

    sortByName(lights)
    sortByName(scenes)

    Object.defineProperties(this, {
        groupedLight: {
            value: groupedLight,
            configurable: true,
            enumerable: false,
            writable: false,
        },
        id: {
            get() {
                return this.resource.id
            },
            enumerable: true,
        },
        lights: {
            value: lights,
            configurable: true,
            enumerable: true,
            writable: false,
        },
        name: {
            get() {
                return this.resource.metadata.name
            },
            enumerable: true,
        },
        on: {
            get() {
                return this.groupedLight.on.on
            },
            enumerable: true,
        },
        resource: {
            value: groupResource,
            configurable: true,
            enumerable: false,
            writable: false,
        },
        scenes: {
            value: scenes,
            configurable: true,
            enumerable: true,
            writable: false,
        },
        type: {
            get() {
                return this.resource.type
            },
            enumerable: true,
        },
    })
}

function HueBridgeModel(resources) {

    Object.defineProperties(this, {
        bridge: {
            value: {},
            configurable: true,
            enumerable: false,
            writable: false,
        },
        device: {
            value: {},
            configurable: true,
            enumerable: false,
            writable: false,
        },
        groups: {
            value: [],
            configurable: true,
            enumerable: true,
            writable: false,
        },
        id: {
            get() {
                return this.bridge.bridge_id
            },
            enumerable: true,
        },
        name: {
            get() {
                return this.device.metadata.name
            },
            enumerable: true,
        },
        resources: {
            value: resources,
            configurable: true,
            enumerable: false,
            writable: false,
        },
        type: {
            get() {
                return this.device.metadata.archetype
            },
            enumerable: true,
        },
    })

    this.updateResources(resources)
}

HueBridgeModel.findBridgeResource = function findBridgeResource(resources) {

    for (let bridge of resources) {

        if (bridge.type === 'bridge') {

            for (let device of resources) {

                if (bridge.owner.rid === device.id) {

                    return {
                        bridge: bridge,
                        device: device,
                    }
                }
            }

            throw new Error('no owner device for ${bridge}')
        }
    }

    throw new Error(`no "bridge" resource found`)
}

HueBridgeModel.prototype.updateResources = function updateResources(resources) {

    const { bridge, device } = HueBridgeModel.findBridgeResource(resources)

    merge(bridge, this.bridge)
    merge(device, this.device)
    this.groups.splice(0)

    for (let resource of resources) {

        if (['room', 'zone'].includes(resource.type)) {

            this.groups.push(new HueGroupModel(resource, resources))
        }
    }

    sortByName(this.groups)
}

export { HueBridgeModel, HueGroupModel, HueLightModel, HueSceneModel }