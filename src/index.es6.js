const moduleFactory = require("./moduleFactory");

moduleFactory.register('acceleration', require("./AccelerationModule"));
//moduleFactory.register('coucou', require("./CoucouModule"));


class MotionInput {
  constructor(...eventTypes) {
    this.eventTypes = eventTypes;
  }

  init() {
    // require all this.eventTypes from factory
  }

  canProvide(eventType) {
    let module = moduleFactory.get(eventType);
    return module.isValid;    
  }

  addListener(eventType, listener) {
    let module = moduleFactory.get(eventType);
    module.addListener(listener);
  }

  removeListener(eventType, listener) {
    let module = moduleFactory.get(eventType);
    module.removeListener(listener);
  }
}

/*********************************************************
 *
 * const input = require("motion-input");
 *
 * input
 *  .init()
 *  .then((...validEvents) => {
 *
 *  }, (...invalidEvents) => {
 *
 *  });
 *
 */

module.exports.input = new MotionInput();