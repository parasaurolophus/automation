// Copyright (c) 2026 Kirk Rader

import { merge, sortByName } from './utilities.js'

function PowerviewShadeModel(shadeResource) {

    if (shadeResource.ptName === undefined) {

        shadeResource.ptName = Buffer.from(shadeResource.name, 'base64').toString('utf8')
    }

    Object.defineProperties(this, {

        batteryStatus: {
            get() {
                return this.resource.batteryStatus
            }
        },

        id: {
            get() {
                return this.resource.id
            },
            enumerable: true,
        },

        name: {
            get() {
                return this.resource.ptName
            },
            enumerable: true,
        },

        position: {
            get() {
                let position = this.resource.positions?.primary
                if (position === undefined) {
                    position = this.resource.positions?.position1
                    if (position !== undefined) {
                        position /= 65535
                    }
                }
                return position
            },
            enumerable: true,
        },

        resource: {
            value: shadeResource,
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

function PowerviewSceneModel(sceneResource) {

    if (sceneResource.ptName === undefined) {

        sceneResource.ptName = Buffer.from(sceneResource.name, 'base64').toString('utf8')
    }

    Object.defineProperties(this, {

        id: {
            get() {
                return this.resource.id
            },
            enumerable: true,
        },

        name: {
            get() {
                return this.resource.ptName
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

function PowerviewRoomModel(roomResource) {

    if (roomResource.ptName === undefined) {

        roomResource.ptName = Buffer.from(roomResource.name, 'base64').toString('utf8')
    }

    Object.defineProperties(this, {

        id: {
            get() {
                return this.resource.id
            },
            enumerable: true,
        },

        name: {
            get() {
                return this.resource.ptName
            },
            enumerable: true,
        },

        resource: {
            value: roomResource,
            configurable: true,
            enumerable: false,
            writable: false,
        },

        scenes: {
            value: [],
            configurable: true,
            enumerable: true,
            writable: false,
        },

        shades: {
            value: [],
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

function PowerviewHubModel(id, name, address, type) {

    Object.defineProperties(this, {

        address: {
            value: address,
            configurable: true,
            enumerable: true,
            writable: false,
        },

        id: {
            value: id,
            configurable: true,
            enumerable: true,
            writable: false,
        },

        name: {
            value: name,
            configurable: true,
            enumerable: true,
            writable: false,
        },

        rooms: {
            value: [],
            configurable: true,
            enumerable: true,
            writable: false,
        },

        type: {
            value: type,
            configurable: true,
            enumerable: true,
            writable: false,
        },
    })
}

PowerviewHubModel.prototype.addRooms = function addRooms(resources) {

    for (let resource of resources) {

        let found = false

        for (let room of this.rooms) {

            if (room.id == resource.id) {

                merge(resource, room.resource)
                found = true
                break
            }
        }

        if (!found) {

            this.rooms.push(new PowerviewRoomModel(resource))
        }
    }

    sortByName(this.rooms)
}

PowerviewHubModel.prototype.addShades = function addShades(resources) {

    for (let resource of resources) {

        for (let room of this.rooms) {

            if (room.id === resource.roomId) {

                let found = false

                for (let shade of room.shades) {

                    if (shade.id == resource.id) {

                        merge(resource, shade.resource)
                        found = true
                        break
                    }
                }

                if (!found) {

                    room.shades.push(new PowerviewShadeModel(resource))
                }
            }
        }
    }

    this.rooms.forEach(room => sortByName(room.shades))
}

PowerviewHubModel.prototype.addScenes = function addScenes(resources) {

    if (!Array.isArray(resources)) {

        return
    }

    for (let resource of resources) {

        for (let room of this.rooms) {

            let roomIds = resource.roomIds

            if (roomIds === undefined) {

                roomIds = [resource.roomId]
            }

            if (roomIds.includes(room.id)) {

                let found = false

                for (let scene of room.scenes) {

                    if (scene.id == resource.id) {

                        merge(resource, scene.resource)
                        found = true
                        break
                    }
                }

                if (!found) {

                    room.scenes.push(new PowerviewSceneModel(resource))
                }
            }
        }
    }

    this.rooms.forEach(room => sortByName(room.scenes))
}

export { PowerviewHubModel, PowerviewRoomModel, PowerviewSceneModel, PowerviewShadeModel }