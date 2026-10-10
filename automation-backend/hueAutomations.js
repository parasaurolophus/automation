// Copyright (c) 2026 Kirk Rader

const hueSunrise = [

    // Living Room Off
    {
        topic: 'put/hue/c42996fffec424ab/resource/grouped_light/9b8b9e72-6c67-4df5-82e6-3516f3fa08b3',
        payload: { on: { on: false } },
    },

    // Hall Off
    {
        topic: 'put/hue/c42996fffec424ab/resource/grouped_light/6910ee45-23e4-46f3-a527-d10c8b3b1631',
        payload: { on: { on: false } },
    },

    // Yard Off
    {
        topic: 'put/hue/c42996fffec424ab/resource/grouped_light/bad8480b-b404-42d1-a9e7-a4a69f400971',
        payload: { on: { on: false } },
    },
]

const hueSunsetStandard = [

    // Living Room Sunset
    {
        topic: 'put/hue/c42996fffec424ab/resource/scene/32793e8f-a500-4603-ba50-51612c58306c',
        payload: { recall: { action: 'active' } }
    },

    // Yard Sunset
    {
        topic: 'put/hue/c42996fffec424ab/resource/scene/00a527dc-0b02-49c8-b720-f4e113862342',
        payload: { recall: { action: 'active' } }
    },
]

const hueSunsetTribal = [

    // Living Room Sunset
    {
        topic: 'put/hue/c42996fffec424ab/resource/scene/32793e8f-a500-4603-ba50-51612c58306c',
        payload: { recall: { action: 'active' } }
    },

    // Yard Tribal
    {
        topic: 'put/hue/c42996fffec424ab/resource/scene/9e004182-9d74-4a0b-9779-548401a8e1ce',
        payload: { recall: { action: 'active' } }
    },
]

const hueSunsetSpooky = [

    // Living Room Sunset
    {
        topic: 'put/hue/c42996fffec424ab/resource/scene/32793e8f-a500-4603-ba50-51612c58306c',
        payload: { recall: { action: 'active' } }
    },

    // Yard Spooky
    {
        topic: 'put/hue/c42996fffec424ab/resource/scene/f59297a3-aecb-40f1-856a-8bc9ed16c531',
        payload: { recall: { action: 'active' } }
    },
]

const hueSunsetJolly = [
    // Living Room Sunset
    {
        topic: 'put/hue/c42996fffec424ab/resource/scene/32793e8f-a500-4603-ba50-51612c58306c',
        payload: { recall: { action: 'active' } }
    },

    // Yard Jolly
    {
        topic: 'put/hue/c42996fffec424ab/resource/scene/4cf850af-6a8a-4c68-8462-c57bb3457f8d',
        payload: { recall: { action: 'active' } }
    },
]

const hueBedtime = [

    // Living Room Off
    {
        topic: 'put/hue/c42996fffec424ab/resource/grouped_light/9b8b9e72-6c67-4df5-82e6-3516f3fa08b3',
        payload: { on: { on: false } },
    },

    // Hall Nightlight
    {
        topic: 'put/hue/c42996fffec424ab/resource/scene/3bc45e7a-2539-45df-8d88-b4afea1c6aa2',
        payload: { recall: { action: 'active' } }
    },

    // Yard Off
    {
        topic: 'put/hue/c42996fffec424ab/resource/grouped_light/bad8480b-b404-42d1-a9e7-a4a69f400971',
        payload: { on: { on: false } },
    },
]

const hueAutomations = {
    standard: {
        sunrise: hueSunrise,
        sunset: hueSunsetStandard,
        evening: hueSunsetStandard,
        bedtime: hueBedtime,
        night: hueBedtime,
        midnight: hueBedtime,
    },
    tribal: {
        sunset: hueSunsetTribal,
        evening: hueSunsetTribal,
    },
    spooky: {
        sunset: hueSunsetSpooky,
        evening: hueSunsetSpooky,
    },
    jolly: {
        sunset: hueSunsetJolly,
        evening: hueSunsetJolly,
    },
}

export default hueAutomations