const BaseModule = require('./BaseModule');
const motionInputFactory = require('./motionInputFactory');

class AccelerationModule extends BaseModule {
  constructor() {
    super('acceleration');

    this.event.x = 0;
    this.event.y = 0;
    this.event.z = 0;

    this.sourceModule = null;
    this.sourceEventType = '';

    this._accelerationIncludingGravityRawListener = this._accelerationIncludingGravityRawListener.bind(this);
  }

  init() {
    super.init(function(resolve, reject) {
      motionInputFactory
        .requireEither('accelerationRaw', 'accelerationIncludingGravityRaw')
        .then(module) {
          this.isValid = true;
          this.sourceModule = module;
          this.sourceEventType = module.eventType;

          resolve(this);
        }
        .catch((error) => {
          reject(error);
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
    switch(this.sourceEventType) {
      case 'accelerationRaw':
        this.accelerationRaw.addListener(listener);
        break;
      case 'accelerationIncludingGravityRaw':
        this.accelerationIncludingGravityRaw.addListener(this._accelerationIncludingGravityRawListener);
        break;
    }
  }

  removeListener(listener) {
    switch(this.sourceEventType) {
      case 'accelerationRaw':
        this.accelerationRaw.removeListener(listener);
        break;
      case 'accelerationIncludingGravityRaw':
        this.accelerationIncludingGravityRaw.removeListener(this._accelerationIncludingGravityRawListener);
        break;
    }
  }
}

module.exports = AccelerationModule;