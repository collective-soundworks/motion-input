'use strict';

const InputModule = require('./InputModule');

class DOMEventSubmodule extends InputModule {
  constructor(DOMEventModule, eventType) {
    super(eventType);

    this.DOMEventModule = DOMEventModule;

    this.event = [0, 0, 0];
  }

  start() {
    this.DOMEventModule._addListener();
  }

  stop() {
    this.DOMEventModule._removeListener();
  }

  init() {
    this.DOMEventModule.required[this.eventType] = true;

    let DOMEventPromise = this.DOMEventModule.promise;

    if (!DOMEventPromise)
      DOMEventPromise = this.DOMEventModule.init();

    return DOMEventPromise.then((module) => this);
  }
}

module.exports = DOMEventSubmodule;