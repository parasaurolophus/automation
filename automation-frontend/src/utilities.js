// Copyright (c) 2026 Kirk Rader

function compareNames(a, b) {

    return a.name.localeCompare(b.name)
}

function merge(from, to) {

    if (from === undefined || from === null) {

        return from
    }

    if (to === undefined || to === null) {

        return from
    }

    if (Array.isArray(from)) {

        if (Array.isArray(to)) {

            let index

            for (index = 0; index < from.length; index++) {

                let newValue = from[index]

                if (index >= to.length) {

                    to.push(newValue)

                } else {

                    newValue = merge(newValue, to[index])

                    if (newValue !== to[index]) {

                        to[index] = newValue
                    }
                }
            }

            if (index < to.length) {

                to.splice(index)
            }

            return to
        }

        return from
    }

    if (typeof from === 'object') {

        if (typeof to === 'object') {

            for (let key in from) {

                const newValue = merge(from[key], to[key])

                if (to[key] !== newValue) {

                    to[key] = newValue
                }
            }

            return to
        }

        return from
    }

    return from
}

function sortByName(a) {

    a.sort(compareNames)
    return a
}

export { compareNames, merge, sortByName }