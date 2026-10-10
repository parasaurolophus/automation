// Copyright (c) 2026 Kirk Rader

const powerviewSunrise = [

    // Morning Shades
    {
        topic: 'get/powerview/bff46430-9989-11f1-8be1-e31a95383439/scenes',
        query: '?sceneId=47761'
    },

    // Close Kitchen Shades
    {
        topic: 'put/powerview/f348cd80-9989-11f1-a63b-1f68433e5c42/scenes/17/activate',
    },
]

const powerviewMidday = [

    // Open All Shades
    {
        topic: 'get/powerview/bff46430-9989-11f1-8be1-e31a95383439/scenes',
        query: '?sceneId=55068'
    },

    // Open Kitchen Shades
    {
        topic: 'put/powerview/f348cd80-9989-11f1-a63b-1f68433e5c42/scenes/23/activate',
    },
]

const powerviewAfternoon = [

    // Afternoon Shades
    {
        topic: 'get/powerview/bff46430-9989-11f1-8be1-e31a95383439/scenes',
        query: '?sceneId=2208'
    },

    // Open Kitchen Shades
    {
        topic: 'put/powerview/f348cd80-9989-11f1-a63b-1f68433e5c42/scenes/23/activate',
    },
]

const powerviewSunset = [

    // Open All Shades
    {
        topic: 'get/powerview/bff46430-9989-11f1-8be1-e31a95383439/scenes',
        query: '?sceneId=55068'
    },

    // Open Kitchen Shades
    {
        topic: 'put/powerview/f348cd80-9989-11f1-a63b-1f68433e5c42/scenes/23/activate',
    },
]

const powerviewEvening = [

    // Close All Shades
    {
        topic: 'get/powerview/bff46430-9989-11f1-8be1-e31a95383439/scenes',
        query: '?sceneId=3227'
    },

    // Close Kitchen Shades
    {
        topic: 'put/powerview/f348cd80-9989-11f1-a63b-1f68433e5c42/scenes/17/activate',
    },
]

const powerviewAutomations = {
    standard: {
        sunrise: powerviewSunrise,
        midday: powerviewMidday,
        afternoon: powerviewAfternoon,
        sunset: powerviewSunset,
        evening: powerviewEvening,
        bedtime: powerviewEvening,
        night: powerviewEvening,
        midnight: powerviewEvening,
    },
}

export default powerviewAutomations