// Copyright (c) 2026 Kirk Rader

import { Agent, fetch } from 'undici'
import { createEventSource } from 'eventsource-client'
import DeviceClient from './DeviceClient.js'

class HueBridgeClient extends DeviceClient {

    static #CERTIFICATE = `-----BEGIN CERTIFICATE-----
MIICMjCCAdigAwIBAgIUO7FSLbaxikuXAljzVaurLXWmFw4wCgYIKoZIzj0EAwIw
OTELMAkGA1UEBhMCTkwxFDASBgNVBAoMC1BoaWxpcHMgSHVlMRQwEgYDVQQDDAty
b290LWJyaWRnZTAiGA8yMDE3MDEwMTAwMDAwMFoYDzIwMzgwMTE5MDMxNDA3WjA5
MQswCQYDVQQGEwJOTDEUMBIGA1UECgwLUGhpbGlwcyBIdWUxFDASBgNVBAMMC3Jv
b3QtYnJpZGdlMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEjNw2tx2AplOf9x86
aTdvEcL1FU65QDxziKvBpW9XXSIcibAeQiKxegpq8Exbr9v6LBnYbna2VcaK0G22
jOKkTqOBuTCBtjAPBgNVHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBhjAdBgNV
HQ4EFgQUZ2ONTFrDT6o8ItRnKfqWKnHFGmQwdAYDVR0jBG0wa4AUZ2ONTFrDT6o8
ItRnKfqWKnHFGmShPaQ7MDkxCzAJBgNVBAYTAk5MMRQwEgYDVQQKDAtQaGlsaXBz
IEh1ZTEUMBIGA1UEAwwLcm9vdC1icmlkZ2WCFDuxUi22sYpLlwJY81Wrqy11phcO
MAoGCCqGSM49BAMCA0gAMEUCIEBYYEOsa07TH7E5MJnGw557lVkORgit2Rm1h3B2
sFgDAiEA1Fj/C3AN5psFMjo0//mrQebo0eKd3aWRx+pQY08mk48=
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIBzDCCAXOgAwIBAgICEAAwCgYIKoZIzj0EAwIwPDELMAkGA1UEBhMCTkwxFDAS
BgNVBAoMC1NpZ25pZnkgSHVlMRcwFQYDVQQDDA5IdWUgUm9vdCBDQSAwMTAgFw0y
NTAyMjUwMDAwMDBaGA8yMDUwMTIzMTIzNTk1OVowPDELMAkGA1UEBhMCTkwxFDAS
BgNVBAoMC1NpZ25pZnkgSHVlMRcwFQYDVQQDDA5IdWUgUm9vdCBDQSAwMTBZMBMG
ByqGSM49AgEGCCqGSM49AwEHA0IABFfOO0jfSAUXGQ9kjEDzyBrcMQ3ItyA5krE+
cyvb1Y3xFti7KlAad8UOnAx0FBLn7HZrlmIwm1QnX0fK3LPM13mjYzBhMB0GA1Ud
DgQWBBTF1pSpsCASX/z0VHLigxU2CAaqoTAfBgNVHSMEGDAWgBTF1pSpsCASX/z0
VHLigxU2CAaqoTAPBgNVHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBBjAKBggq
hkjOPQQDAgNHADBEAiAk7duT+IHbOGO4UUuGLAEpyYejGZK9Z7V9oSfnvuQ5BQIg
IYSgwwxHXm73/JgcU9lAM6c8Bmu3UE3kBIUwBs1qXFw=
-----END CERTIFICATE-----`

    #_apiKey
    #_bridgeId

    constructor(onError, bridgeId, apiKey) {

        super(onError)
        this.#_bridgeId = bridgeId
        this.#_apiKey = apiKey
    }

    get bridgeId() {

        return this.#_bridgeId
    }

    _open(onMessage, onConnect, onDisconnect, onScheduleReconnect) {

        const options = {
            url: `https://${this.#_bridgeId}/eventstream/clip/v2`,
            fetch: (input, opts) => {

                const agent = new Agent({
                    connect: {
                        ca: HueBridgeClient.#CERTIFICATE,
                    }
                })

                opts.headers = opts.headers || {}
                opts.headers['hue-application-key'] = this.#_apiKey
                opts.dispatcher = agent
                return fetch(input, opts)

            },
            onMessage: message => this.onMessage(message, onMessage),
            onConnect: () => onConnect(this),
            onDisconnect: () => onDisconnect(this),
            onScheduleReconnect: event => onScheduleReconnect(this, event)
        }

        return createEventSource(options)
    }

    onMessage(message, handler) {

        try {

            if (message.data === undefined) {

                return
            }

            const data = JSON.parse(message.data)

            data.forEach((events) => {

                if (events.data === undefined) {

                    return
                }

                events.data.forEach(event => handler(this, event))
            })

        } catch (error) {

            this.onError(this, error, message)
        }
    }

    async _send(request, onResponse) {

        try {

            const agent = new Agent({
                connect: {
                    ca: HueBridgeClient.#CERTIFICATE,
                },
            })

            const options = {
                dispatcher: agent,
                method: request.method,
                headers: {
                    'Accept': 'application/json',
                    'hue-application-key': this.#_apiKey,
                },
            }

            if (request.body !== undefined) {

                options.headers['Content-Type'] = 'application/json'
                options.body = JSON.stringify(request.body)
            }

            const response = await fetch(`https://${this.#_bridgeId}/clip/v2/${request.uri}`, options)

            if (response.status < 200 || response.status >= 300) {

                this.onError(this, new Error(response.statusText), response)
                return
            }

            const body = await response.json()

            body.errors.forEach(error => this.onError(this, new Error(`response from hue bridge ${this.id} included an error`), response))
            onResponse(this, body.data)

        } catch (error) {

            this.onError(this, error, request)
        }
    }

    toString() {

        return `<HueBridgeClient ${this.#_bridgeId} ${this.readyState}>`
    }
}

export default HueBridgeClient