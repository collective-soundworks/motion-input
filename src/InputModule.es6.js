class InputModule {
  constructor(eventType) {
    this.eventType = eventType;
    this.isValid = false;
    this.listeners = [];
    this.event = {};
  }

  init() {
    // abstract method
  }

  start() {
    // abstract method
  }

  stop() {
    // abstract method
  }

  addListener(listener) {
    this.listeners.push(listener);

    if(this.listeners.length > 0)
      this.start();
  }

  removeListener(listener) {
    let index = this.listeners.indexOf(listener);
    this.listeners.splice(index, 1);

    if(this.listeners.length === 0)
      this.stop();
  }

  emit() {
    for(let listener of this.listeners)
      listener(this.eventType, this.event);
  }
}

module.exports = InputModule;