const BaseModule = require('./BaseModule');
const motionInputFactory = require('./motionInputFactory');

class AccelerationModule extends BaseModule {
  constructor() {
    super('acceleration');

    this.event.x = 0;
    this.event.y = 0;
    this.event.z = 0;

    this.accelerationRaw = null;
    this.accelerationIncludingGravityRaw = null;
  }

  init() {
    motionInputFactory
      .requireEither('accelerationRaw', 'accelerationIncludingGravityRaw')
      .then(module) {
        this.isValid = true;

        switch(module.eventType) {
          case 'accelerationRaw':
            this.accelerationRaw = module;
            break;
          case 'accelerationIncludingGravityRaw':
            this.accelerationIncludingGravityRaw = module;
            //let period = module.period;
            break;
        }
      }
      .catch((error) => {
        this._tryToGetAccelerationIncludingGravityRaw
      })


    motionInputFactory
      .require('accelerationRaw')
      .then(this._useAccelerationRaw)
      .catch((error) => {
        this._tryToGetAccelerationIncludingGravityRaw
      })

// (module) => {
//         this.isValid = true;
        
//         this.accelerationRaw = module;
//         // resolve promise
//       }
//       () => {
//         motionInputFactory
//           .require('accelerationIncludingGravityRaw')
//           .then((module) => {
//             this.isValid = true;

//             this.accelerationIncludingGravityRaw = module;
//             //let period = module.period;
//             // resolve promise
//           }, (error) => {
//             // error
//           });
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
    if(this.accelerationRaw) {
      this.accelerationRaw.addListener(listener);
    } else if (this.accelerationIncludingGravityRaw) {
      this.accelerationIncludingGravityRaw.addListener(this._accelerationIncludingGravityRawListener);
    } else {
      // throw exception
    }
  }

  removeListener(listener) {
    if(this.accelerationRaw) {
      this.accelerationRaw.removeListener(listener);
    } else if (this.accelerationIncludingGravityRaw) {
      this.accelerationIncludingGravityRaw.removeListener(this._accelerationIncludingGravityRawListener);
    } else {
      // throw exception
    }
  }

}

module.exports = AccelerationModule;