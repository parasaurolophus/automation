// Copyright (c) 2026 Kirk Rader

function Flowchart(type = 'flowchart', direction = 'LR', curve = 'monotoneY') {

    Object.defineProperties(this, {

        addClass: {
            value: function (name, ...nodes) {

                function appendNodes(previous, current, index) {

                    return previous.concat(index > 0 ? ',' : '', current)
                }

                const line = `class ${nodes.reduce(appendNodes, '')} ${name}`

                this.addLine('classes', line)
            },
            configurable: false,
            writable: false,
            enumerable: true,
        },

        addClassDef: {
            value: function (name, definition) {

                this.addLine('classDefs', `classDef ${name} ${definition}`)
            },
            configurable: false,
            writable: false,
            enumerable: true,
        },

        addClick: {
            value: function (node, arg) {

                this.addLine('clicks', `click ${node} call mermaidCallback(${arg})`)
            },
            configurable: false,
            writable: false,
            enumerable: true,
        },

        addEdge: {
            value: function (from, arrow, to) {

                const edge = `e${this.counter++}`

                this.addLine('edges', `${from} ${edge}@${arrow} ${to}`)
                return edge
            },
            configurable: false,
            writable: false,
            enumerable: true,
        },

        addLink: {
            value: function (node, url, target) {

                if (target) {

                    this.addLine('clicks', `click ${node} href "${url}" ${target}`)

                } else {

                    this.addLine('clicks', `click ${node} href "${url}"`)
                }
            },
            configurable: false,
            writable: false,
            enumerable: true,
        },

        addNode: {
            value: function (label) {

                const node = `n${this.counter++}`

                this.addLine('lines', `${node}${label}`)
                return node
            },
            configurable: false,
            writable: false,
            enumerable: true,
        },

        addSubgraph: {
            value: function (label, body) {

                const s = `s${this.counter++}`

                this.addLine('lines', `subgraph ${s}${label}`)
                body(this)
                this.addLine('lines', 'end')
                return s
            },
            configurable: false,
            writable: false,
            enumerable: true,
        },

        classDefs: {
            value: '',
            configurable: true,
            writable: true,
            enumerable: false,
        },

        classes: {
            value: '',
            configurable: true,
            writable: true,
            enumerable: false,
        },

        clicks: {
            value: '',
            configurable: true,
            writable: true,
            enumerable: false,
        },

        counter: {
            value: 0,
            configurable: true,
            writable: true,
            enumerable: false,
        },

        edges: {
            value: '',
            configurable: true,
            writable: true,
            enumerable: false,
        },

        lines: {
            value: `---
config:
  flowchart:
    curve: ${curve ?? 'basis'}
---
${type ?? 'flowchart'} ${direction ?? 'LR'}
`,
            configurable: true,
            writable: true,
            enumerable: false,
        },

        source: {
            get: function () {
                return this.lines.concat(...
                    this.edges,
                    this.classes,
                    this.clicks,
                    this.classDefs)
            },
            enumerable: true,
        },
    })
}

Flowchart.prototype.addLine = function (key, line) {

    this[key] = this[key].concat(`${line}\n`)
}

export { Flowchart }