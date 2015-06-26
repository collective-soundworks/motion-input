const BaseModule = require('./BaseModule');
const moduleFactory = require('./moduleFactory');

class AccelerationModule extends BaseModule {
  constructor() {
    super('acceleration');

    this.event.x = 0;
    this.event.y = 0;
    this.event.z = 0;

    this.mustCalculateAcceleration = false;
    this._accelerationIncludingGravityRawListener = this._accelerationIncludingGravityRawListener.bind(this);
  }

  init() {
    super.init(function(resolve, reject) {
      moduleFactory
        .require('devicemotion')
        .then((module) => {
          if(module.hasAcceleration || module.hasAccelerationIncludingGravity) {
            this.isValid = true;
            this.mustCalculateAcceleration = !module.hasAcceleration;
            resolve(this);
          } else {
            reject(new Error("No acceleration in device motion"));
          }
        })
        .catch((module) => {
          reject(this);
        });
    });
  }

  _accelerationIncludingGravityRawListener(inEvent) {
    // filter acc incl gravity
    let outEvent = this.event;

    outEvent.x = 1;
    outEvent.y = 2;
    outEvent.z = 3;

    this.emit();
  }

  addListener(listener) {
    if(this.mustCalculateAcceleration)
      this.accelerationIncludingGravityRaw.addListener(this._accelerationIncludingGravityRawListener);
    else
      this.accelerationRaw.addListener(listener);
  }

  removeListener(listener) {
    if(this.mustCalculateAcceleration)
      this.accelerationIncludingGravityRaw.removeListener(this._accelerationIncludingGravityRawListener);
    else
      this.accelerationRaw.removeListener(listener);
  }
}

module.exports = AccelerationModule;