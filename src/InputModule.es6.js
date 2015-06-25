class InputModule {
  constructor(eventType) {
    this.eventType = eventType;
    this.listeners = [];
    this.event = {};
    this.promise = null;
    this.required = {
      eventType: true
    };
  }

  init(promiseFun) {
    let promise = new Promise(promiseFun);

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

    if(this.listeners.length > 0)
      this.start();
  }

  removeListener(listener) {
    let index = this.listeners.indexOf(listener);
    this.listeners.splice(index, 1);

    if(this.listeners.length === 0)
      this.stop();
  }

  emit(event = this.event) {
    for(let listener of this.listeners)
      listener(this.eventType, event);
  }
}

module.exports = InputModule;