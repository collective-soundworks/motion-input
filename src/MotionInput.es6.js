class MotionInput {
  constructor() {
    // list of required modules (eventTypes)
    this.eventTypes = {};

    // pool of all available modules
    this.modules = {};
  }

  addModule(eventType, module) {
    this.modules[eventType] = module;
  }

  getModule(eventType) {
    return this.modules[eventType];
  }

  requireModule(eventType) {
    let module = this.getModule(eventType);

    if(module.promise)
      return module.promise;

    return module.init();
  }

  init(...eventTypes) {
    let modulePromises = eventTypes.map((value) => {
      let module = this.getModule(value);
      return module.init();
    });

    return Promise.all(modulePromises);
  }

  addListener(eventType, listener) {
    let module = this.getModule(eventType);
    module.addListener(listener);
  }

  removeListener(eventType, listener) {
    let module = this.getModule(eventType);
    module.removeListener(listener);
  }
}

/*********************************************************
 *
 * const input = require("motion-input");
 *
 * input
 *  .init(requiredEvents)
 *  .then((modules) => {
 *
 *  });
 *
 */

module.exports = new MotionInput();