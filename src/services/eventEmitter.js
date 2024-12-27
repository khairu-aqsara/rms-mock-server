const EventEmitter = require('events');

class OptimizationEventEmitter extends EventEmitter {}

const optimizationEvents = new OptimizationEventEmitter();

module.exports = optimizationEvents;
