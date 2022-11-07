# Automation

Monitor and control Philips Hue lights and Hunter-Douglas (PowerView)
window shades using Node-RED.

> **Note:** these flows use features introduced in Node-RED version 3.0,
> including wire junctions and dynamic links. They will not load
> correctly into earlier versions of Node-RED.

## About

These flows implement more sophisticated time-based automation than is
supported directly by popular home automation platforms or the native
apps supplied by Philips and Hunter-Douglas.

For example, these flows activate different holiday-themed scenes
automatically based on the date. They also drive window shade
automation based on the sun's position over the course of a day.

> See the documentation within the Node-RED editor for the various flow
> tabs, subflows and node groups for more detailed information.

## Dependencies

The following node packages must be installed before loading these
flows into your environment:

- [node-red-dashboard](https://flows.nodered.org/node/node-red-dashboard)
- [@parasaurolophus/node-red-eventsource](https://flows.nodered.org/node/@parasaurolophus/node-red-eventsource)

In addition, some `function` nodes in these flows load the
[suncalc](https://www.npmjs.com/package/suncalc) package dynamically,
which must be enabled in _settings.js_ (true by default, but see below).

## Configuration

These flow assume a certain amount of configuration, both in
_settings.js_ and via environment variables
(e.g. _~/.node-red/environment_ or globally in the host operating
system's shell).

### Settings

These flows make certain assumptions regarding the contents of
_settings.js_.

#### Filesystem-backed Context Store Named `file`

```
contextStorage: {
    default: "memoryOnly",
    memoryOnly: { module: 'memory' },
    file: { module: 'localfilesystem' }
},
```

> **Note:** the default setting for `contextStorage` does not define any
> filesystem-backed context store.

#### Function Nodes Load _suncalc_

The default settings for `externalModules` allow `function` nodes to
load any module at runtime. If you have changed the `externalModules`
options in your _settings.js_, ensure that the _suncalc_ module is
enabled, at minimum:

```
externalModules: {
    modules: {
        allowInstall: true,
        allowList: [suncalc],
        denyList: []
    }
},
```

> **Note:** you only need to change the `externalModules` settings if
> they have been altered from the default in a way that would prevent
> `function` nodes from loading _suncalc_.

### Environment

These flows rely on some sensitive configuration data provided via
environment variables, e.g. by adding them to
`~/.node-red/environment`:

| Environment Variable     | Description                                                              |
|--------------------------|--------------------------------------------------------------------------|
| LATITUDE                 | Coordinate for use with [suncalc](https://www.npmjs.com/package/suncalc) |
| LONGITUDE                | Coordinate for use with [suncalc](https://www.npmjs.com/package/suncalc) |
| GROUND_FLOOR_HUE_ADDRESS | IP address of the Hue Bridge controlling devices on the ground floor     |
| GROUND_FLOOR_HUE_KEY     | API access token for the ground floor Hue Bridge                         |
| BASEMENT_HUE_ADDRESS     | IP address of the Hue Bridge controlling devices in the basement         |
| BASEMENT_HUE_KEY         | API access token for the basement Hue Bridge                             |
| POWERVIEW_ADDRESS        | IP address of the PowerView hub                                          |

> **Note:** these flows assume that the `LATITUDE` and `LONGITUDE`
> environment variables are set to a location consistent with the time
> zone configuration of the host operating system running Node-RED.

There are two configuraton properties per Hue bridge: its address and
access token for use by Node-RED. See
<https://github.com/parasaurolophus/create-hue-application-key> for
a Node-RED flow that can be used to create such access tokens.