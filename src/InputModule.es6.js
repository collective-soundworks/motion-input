'use strict';

class InputModule {
  constructor(eventType) {
    this.eventType = eventType;
    this.listeners = [];
    this.event = null;
    this.promise = null;

    // Indicators about whether the module can provide values or not
    this.isCalculated = false;
    this.isProvided = false;

    this.period = undefined;
  }

  get isValid() {
    return (this.isProvided || this.isCalculated);
  }

  init(promiseFun) {
    this.promise = new Promise(promiseFun);
    return this.promise;
  }

  start() {
    // abstract method
  }

  stop() {
    // abstract method
  }

  addListener(listener) {
    this.listeners.push(listener);

    if (this.listeners.length === 1)
      this.start();
  }

  removeListener(listener) {
    let index = this.listeners.indexOf(listener);
    this.listeners.splice(index, 1);

    if (this.listeners.length === 0)
      this.stop();
  }

  emit(event = this.event) {
    for (let listener of this.listeners)
      listener(event);
  }
}

module.exports = InputModule;