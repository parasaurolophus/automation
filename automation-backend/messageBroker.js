// Copyright (c) 2026 Kirk Rader

import { EventEmitter } from 'node:events'
import MessageBroker from './message-broker/index.js'

const messageEvents = new EventEmitter()
const messageBroker = new MessageBroker(messageEvents)

export { messageBroker, messageEvents }