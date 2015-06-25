const InputModule = require('./InputModule');
const motionInputFactory = require('./motionInputFactory');

class DevicemotionSubModule extends InputModule {
  constructor(devicemotionModule, eventType) {
    super(eventType);

    this.devicemotionModule = devicemotionModule;
    this.event[0] = 0;
    this.event[1] = 0;
    this.event[2] = 0;
  }

  start() {
    this.devicemotionModule.addListener();
  }

  stop() {
    this.devicemotionModule.removeListener();
  }

  init() {
    this.devicemotionModule.required[this.eventType] = true;
    
    return super.init(function(resolve, reject) {
      this.devicemotionModule.promise
        .then((module) => resolve(this))
        .catch((module) => reject(this));
    });
  }
}

class DevicemotionModule extends InputModule {
  constructor() {
    this.accelerationIncludingGravity = new DevicemotionSubModule(this, 'accelerationIncludingGravity');
    this.acceleration = new DevicemotionSubModule(this, 'acceleration');
    this.rotationRate = new DevicemotionSubModule(this, 'rotationRate');

    this.numListeners = 0;

    this.required = {
      acceleraton: false,
      accelerationIncludingGravity: false,
      rotationRate: false
    }

    this.provided = {
      acceleraton: false,
      accelerationIncludingGravity: false,
      rotationRate: false
    }

    this.accelerationIncludingGravityEvent = [0, 0, 0];
    this.accelerationEvent = [0, 0, 0];
    this.rotationRateEvent = [0, 0, 0];

    this._devicemotionCheck = this._devicemotionCheck.bind(this);
    this._devicemotionListener = this._devicemotionListener.bind(this);
  }

  _devicemotionListener(e) {
    if(this.required.accelerationIncludingGravity && this.provided.accelerationIncludingGravity) {
      let outEvent = this.accelerationIncludingGravityEvent;

      outEvent[0] = e.accelerationIncludingGravity.x;
      outEvent[1] = e.accelerationIncludingGravity.y;
      outEvent[2] = e.accelerationIncludingGravity.z;

      this.accelerationIncludingGravity.emit(outEvent);
    } 

    if(this.required.acceleration) {
      let outEvent = this.accelerationEvent;

      if(this.provided.acceleration) {
        outEvent[0] = e.acceleration.x;
        outEvent[1] = e.acceleration.y;
        outEvent[2] = e.acceleration.z;
      } else if (this.provided.accelerationIncludingGravity) {
        // TODO: calculate from accelerationIncludingGravity
        outEvent[0] = 77;
        outEvent[1] = 77;
        outEvent[2] = 77;
      }

      this.emit(outEvent);
    } 

    if(this.required.rotationRate && this.provided.rotationRate) {
      let outEvent = this.rotationRateEvent;

      outEvent[0] = e.rotationRate.alpha;
      outEvent[1] = e.rotationRate.beta;
      outEvent[2] = e.rotationRate.gamma;

      this.rotationRate.emit(outEvent);
    }
  }

  _devicemotionCheck(e) {
    this.provided.accelerationIncludingGravity = (e.accelerationIncludingGravity && e.accelerationIncludingGravity.x && e.accelerationIncludingGravity.y && e.accelerationIncludingGravity.z);
    this.provided.acceleration = (e.acceleration && e.acceleration.x && e.acceleration.y && e.acceleration.z);
    this.provided.rotationRate = (e.rotationRate && e.rotationRate.alpha && e.rotationRate.beta && e.rotationRate.gamma);

    // TODO: get period

    window.removeEventListener('devicemotion', this._devicemotionCheck);

    resolve(this);
  }

  init() {
    super.init((resolve, reject) => {
      if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', this._devicemotionCheck, false);
      } else {
        reject(this);
      }
    });
  }

  addListener() {
    this.numListeners++;

    if(this.numListeners === 1)
      window.addEventListener('devicemotion', _devicemotionListener, false);
  }

  removeListener() {
    this.numListeners--;

    if(this.numListeners === 0)
      window.removeEventListener('devicemotion', _devicemotionListener, false);
  }
}

module.exports = new DevicemotionModule();
