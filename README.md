# Automation

Monitor and control Philips Hue lights and Hunter-Douglas (PowerView)
window shades using Node-RED.

> **Note:** these flows use features introduced in Node-RED version 3.0,
> including wire junctions and dynamic links. They will not load
> correctly into earlier versions of Node-RED.

## About

These flows implement more sophisticated time-based automation than is
supported directly by popular home automation platforms or the native
apps supplied by Philips and Hunter-Douglas. For example, they activate
different seasonal-themed lighting scenes automatically based on the
date. They also drive window shade automation based on the sun's
position over the course of a day based on the geographic location
of the home and the day of the year.

## Dependencies

The following node packages must be installed before loading these
flows into your environment:

- [node-red-dashboard](https://flows.nodered.org/node/node-red-dashboard)
- [@parasaurolophus/node-red-eventsource](https://flows.nodered.org/node/@parasaurolophus/node-red-eventsource)

In addition, some `function` nodes in these flows load the
[suncalc](https://www.npmjs.com/package/suncalc) package dynamically,
which must be enabled in _settings.js_ (true by default).

> **Note:** The Hue and PowerView API's are accessed directly using
> `http request` nodes rather than through specialized node packages
> from the Node-RED library. Similarly, _suncalc_ is accessed directly
> from JavaScript code in `function` nodes rather than through a
> wrapper node. The only non-standard node used,
> _@parasaurolophus/node-red-eventsource_, is developed and maintained
> by the same author as these flows for their specific needs when
> interoperating with Hue bridges.

## Configuration

These flow assume a certain amount of configuration, both in
_settings.js_ and via environment variables
(e.g. _~/.node-red/environment_ or globally in the host operating
system's shell).

### Settings

The default contents of _settings.js_ for `externalModules` allow
`function` nodes to load any module at runtime. If you have changed
the `externalModules` options in your _settings.js_, ensure that the
_suncalc_ module is enabled, at minimum.

> **Note:** you only need to change the `externalModules` settings if
> they have been altered from the default in a way that would prevent
> `function` nodes from loading _suncalc_.

### Environment

These flows rely on some sensitive configuration data provided via
environment variables, e.g. by adding them to
`~/.node-red/environment`:

| Environment Variable       | Description                                                              |
|----------------------------|--------------------------------------------------------------------------|
| `LATITUDE`                 | Coordinate for use with [suncalc](https://www.npmjs.com/package/suncalc) |
| `LONGITUDE`                | Coordinate for use with [suncalc](https://www.npmjs.com/package/suncalc) |
| `GROUND_FLOOR_HUE_ADDRESS` | IP address of the Hue Bridge controlling devices on the ground floor     |
| `GROUND_FLOOR_HUE_KEY`     | API access token for the ground floor Hue Bridge                         |
| `BASEMENT_HUE_ADDRESS`     | IP address of the Hue Bridge controlling devices in the basement         |
| `BASEMENT_HUE_KEY`         | API access token for the basement Hue Bridge                             |
| `POWERVIEW_ADDRESS`        | IP address of the PowerView hub                                          |

> **Note:** These flows assume that the `LATITUDE` and `LONGITUDE`
> environment variables are set to a location consistent with the time
> zone configuration of the host operating system running Node-RED
> and that time zone is correct for the location of the home. In
> particular, the _Timer_ flow makes extensive use of built-in
> JavaScript functions such as `Date().getHour()` and the like.
> These flows assume that the values returned by those functions are
> appropriate to drive lighting and window covering automation which
> is only true of the host OS is configured correctly for the local
> time zone.

There are two configuraton properties per Hue bridge: its address and
access token for use by Node-RED. See
<https://github.com/parasaurolophus/create-hue-application-key> for
a Node-RED flow that can be used to create such access tokens.

## Features

- Local control of Philips Hue lighting and Hunter-Douglas (PowerView)
  window coverings using the API's published by their respective
  hubs

- Dynamically created dashboard controls for individual device groups
  and scenes created by querying the Hue and PowerView hubs

- Home automation driven by date, time and the position of the sun
  over the course of each day of the year

- Support multiple Hue hubs concurrently

The implementation of these  features provides practical demonstrations
of a number of basic software-engineering concepts such as event-driven
programming and data-driven user interfaces. It also serves as a
repository of examples of a number of techniques specific to Node-RED as
a home automation platform and how it interoperates with underlying
technologies such as MQTT, HTTP based API's, AngularJS and NPM-based
JavaScript packages.

## Requirements

The goals for these flows include:

1. More sophisticated automation rules than supported directly by
   the native apps and off-the-shelf "smart home" platforms supplied
   by companies like Philips, Hunter-Douglas, Apple, Google, Amazon,
   Samsung etc.

2. Support a consolidated user interface easily accessible by anyone
   in the home, including guests, without having to own a specific
   make of mobile device, install specific apps, be granted explicit
   network access or create accounts with any so-called "cloud services"

3. Eliminate the use of third-party "clouds" to the greatest degree
   possible due to performance, reliability, security and privacy
   concerns

The home in question has a number of "smart" devices from multiple
manufacturers, none of which come with any ability to interoperate
directly. Home automation platforms from companies like Apple, Google
and Amazon are woefully inadequate in many respects, and each requires
anyone attempting to do things as simple as turning on and off lights to
have a specific app, with a properly configured account, with that
account given pretty much _carte blanche_ authority to do anything it
likes to every aspect of the "smart" home, mediated by "cloud services"
owned and operated by third-parties with their own agendas that trump
any consideration of their customers' seucirty or privacy.

Using Node-RED allows for a fairly intuitive user interface that can be
accessed with no more specialized an app than a web browser. Further,
Node-RED can be programmed to do anything that can be accomplished in a
general-purpose programming language, JavaScript, rather than being
constrained by the features made available at the whim of companies
more interested in extending their surveillance and control over their
"walled gardens" than in providing useful products and services.

## User interface

A few of the dashboard controls are "hard coded" using specific
`ui_switch`, `ui_button` and `ui_dropdown` nodes from
[node-red-dashboard](https://flows.nodered.org/node/node-red-dashboard).
These represent settings not associated with particular devices.

Most of the controls are implemented using `ui_template` nodes that
render data retrieved by querying various device API's or received
as asynchronous events. The HTML sent to these `ui_template` nodes
includes AngularJS `md-switch` and `md-button` elements that correspond
to lighting devices, window coverings and scenes that are discovered
while these flows are running.

The result is that these flows display a consolidated user interface
for controlling diverse devices from multiple vendows without having
to be changed whenever those devices' configuration is changed in
their respective apps.