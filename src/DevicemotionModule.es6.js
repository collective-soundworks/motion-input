const InputModule = require('./InputModule');
// const motionInput = require('./motionInput');

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

    let devicemotionPromise = this.devicemotionModule.promise;

    if(!devicemotionPromise)
      devicemotionPromise = this.devicemotionModule.init();

    return devicemotionPromise.then((module) => this);
  }
}

class DevicemotionModule extends InputModule {
  constructor() {
    super('devicemotion');

    this.accelerationIncludingGravity = new DevicemotionSubModule(this, 'accelerationIncludingGravity');
    this.acceleration = new DevicemotionSubModule(this, 'acceleration');
    this.rotationRate = new DevicemotionSubModule(this, 'rotationRate');

    this.numListeners = 0;

    this.required = {
      acceleraton: false,
      accelerationIncludingGravity: false,
      rotationRate: false
    };

    this.accelerationIncludingGravityEvent = [0, 0, 0];
    this.accelerationEvent = [0, 0, 0];
    this.rotationRateEvent = [0, 0, 0];

    this._devicemotionCheck = this._devicemotionCheck.bind(this);
    this._devicemotionListener = this._devicemotionListener.bind(this);

    this.promiseResolve  = null;
  }

  _devicemotionListener(e) {
    if(this.required.accelerationIncludingGravity && this.accelerationIncludingGravity.isValid) {
      let outEvent = this.accelerationIncludingGravityEvent;

      outEvent[0] = e.accelerationIncludingGravity.x;
      outEvent[1] = e.accelerationIncludingGravity.y;
      outEvent[2] = e.accelerationIncludingGravity.z;

      this.accelerationIncludingGravity.emit(outEvent);
    } 

    if(this.required.acceleration) {
      let outEvent = this.accelerationEvent;

      if(this.acceleration.isValid) {
        outEvent[0] = e.acceleration.x;
        outEvent[1] = e.acceleration.y;
        outEvent[2] = e.acceleration.z;
      } else if (this.accelerationIncludingGravity.isValid) {
        // TODO: calculate from accelerationIncludingGravity
        outEvent[0] = 77;
        outEvent[1] = 77;
        outEvent[2] = 77;
      }

      this.emit(outEvent);
    } 

    if(this.required.rotationRate && this.rotationRate.isValid) {
      let outEvent = this.rotationRateEvent;

      outEvent[0] = e.rotationRate.alpha;
      outEvent[1] = e.rotationRate.beta;
      outEvent[2] = e.rotationRate.gamma;

      this.rotationRate.emit(outEvent);
    }
  }

  _devicemotionCheck(e) {
    this.accelerationIncludingGravity.isValid = (
      e.accelerationIncludingGravity && 
      (typeof e.accelerationIncludingGravity.x === 'number') && 
      (typeof e.accelerationIncludingGravity.y === 'number') && 
      (typeof e.accelerationIncludingGravity.z === 'number'));

    this.acceleration.isValid = (
      e.acceleration && 
      (typeof e.acceleration.x === 'number') && 
      (typeof e.acceleration.y === 'number') && 
      (typeof e.acceleration.z === 'number'));

    this.rotationRate.isValid = (
      e.rotationRate && 
      (typeof e.rotationRate.alpha === 'number') && 
      (typeof e.rotationRate.beta === 'number') && 
      (typeof e.rotationRate.gamma === 'number'));

    // TODO: get period

    window.removeEventListener('devicemotion', this._devicemotionCheck);

    this.isValid = (this.accelerationIncludingGravity.isValid || this.acceleration.isValid || this.rotationRate.isValid);
    this.promiseResolve(this);
  }

  init() {
    return super.init((resolve, reject) => {
      this.promiseResolve = resolve;

      if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', this._devicemotionCheck, false);
      } else {
        resolve(this);
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
