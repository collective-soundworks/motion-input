const moduleFactory = require("./moduleFactory");

const devicemotionModule = require("./DevicemotionModule");
moduleFactory.register('accelerationIncludingGravity', devicemotionModule.accelerationIncludingGravity);
moduleFactory.register('acceleration', devicemotionModule.acceleration);
moduleFactory.register('rotationRate', devicemotionModule.rotationRate);
//moduleFactory.register('coucou', require("./CoucouModule"));


class MotionInput {
  constructor() {
    this.eventTypes = {};
  }

  init(...eventTypes) {
    let promise = new Promise((resolve, reject) => {
      let numSettledPromises = 0;
      let availableEventTypes = [];
      let unavailableEventTypes = [];

      for(eventType of eventTypes) {
        this.eventTypes[eventType] = false;

        let module = moduleFactory.get(eventType);
        let modulePromise = module.init();

        modulePromise
          .then((module) => {
            numSettledPromises++;

            this.eventTypes[module.eventType] = true;

            if(numSettledPromises === eventTypes.length) {
              if(availableEventTypes.length > 0)
                resolve(this.eventTypes);
              else
                reject(this.eventTypes);
            }
          })
          .catch((module) => {
            numSettledPromises++;

            if(numSettledPromises === eventTypes.length) {
              if(availableEventTypes.length > 0)
                resolve(this.eventTypes);
              else
                reject(this.eventTypes);
            }
          });
      }
    });

    return promise;
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
 *  .init(requiredEvents)
 *  .then((validEvents) => {
 *
 *  }, (invalidEvents) => {
 *
 *  });
 *
 */

module.exports.input = new MotionInput();