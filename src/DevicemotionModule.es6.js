const InputModule = require('./InputModule');
const DOMEventSubmodule = require('./DOMEventSubmodule');
const platform = require('platform');

class DevicemotionModule extends InputModule {
  constructor() {
    super('devicemotion');

    this.event[0] = undefined;
    this.event[1] = undefined;
    this.event[2] = undefined;
    this.event[3] = undefined;
    this.event[4] = undefined;
    this.event[5] = undefined;
    this.event[6] = undefined;
    this.event[7] = undefined;
    this.event[8] = undefined;

    this.accelerationIncludingGravity = new DOMEventSubmodule(this, 'accelerationIncludingGravity');
    this.acceleration = new DOMEventSubmodule(this, 'acceleration');
    this.rotationRate = new DOMEventSubmodule(this, 'rotationRate');

    this.required = {
      acceleration: false,
      accelerationIncludingGravity: false,
      rotationRate: false
    };

    this._devicemotionCheck = this._devicemotionCheck.bind(this);
    this._devicemotionListener = this._devicemotionListener.bind(this);

    this._numListeners = 0;
    this._promiseResolve = null;
    this._unify = (platform.os.family === 'iOS' ? -1 : 1);

    this._estimatedGravity = [0, 0, 0];
  }

  _devicemotionCheck(e) {
    this.isProvided = true;

    // Check sensors for accelerationIncludingGravity, acceleration, and rotationRate
    this.accelerationIncludingGravity.isProvided = (
      e.accelerationIncludingGravity &&
      (typeof e.accelerationIncludingGravity.x === 'number') &&
      (typeof e.accelerationIncludingGravity.y === 'number') &&
      (typeof e.accelerationIncludingGravity.z === 'number')
    );

    this.acceleration.isProvided = (
      e.acceleration &&
      (typeof e.acceleration.x === 'number') &&
      (typeof e.acceleration.y === 'number') &&
      (typeof e.acceleration.z === 'number')
    );

    this.rotationRate.isProvided = (
      e.rotationRate &&
      (typeof e.rotationRate.alpha === 'number') &&
      (typeof e.rotationRate.beta === 'number') &&
      (typeof e.rotationRate.gamma === 'number')
    );

    // If acceleration is not provided by raw sensors,
    // indicate whether it can be calculated with accelerationIncludingGravity
    if (!this.acceleration.isProvided)
      this.acceleration.isCalculated = this.accelerationIncludingGravity.isProvided;

    // TODO: get period

    window.removeEventListener('devicemotion', this._devicemotionCheck);
    this._promiseResolve(this);
  }

  _devicemotionListener(e) {
    this._emitDevicemotionEvent(e);

    if (this.required.accelerationIncludingGravity && this.accelerationIncludingGravity.isValid)
      this._emitAccelerationIncludingGravityEvent(e);

    if (this.required.acceleration && this.acceleration.isValid)
      this._emitAccelerationEvent(e);

    if (this.required.rotationRate && this.rotationRate.isValid)
      this._emitRotationRateEvent(e);
  }

  _emitDevicemotionEvent(e) {
    let outEvent = this.event;

    if (e.accelerationIncludingGravity) {
      outEvent[0] = e.accelerationIncludingGravity.x;
      outEvent[1] = e.accelerationIncludingGravity.y;
      outEvent[2] = e.accelerationIncludingGravity.z;
    }

    if (e.acceleration) {
      outEvent[3] = e.acceleration.x;
      outEvent[4] = e.acceleration.y;
      outEvent[5] = e.acceleration.z;
    }

    if (e.rotationRate) {
      outEvent[6] = e.rotationRate.alpha;
      outEvent[7] = e.rotationRate.beta;
      outEvent[8] = e.rotationRate.gamma;
    }

    this.emit(outEvent);
  }

  _emitAccelerationIncludingGravityEvent(e) {
    let outEvent = this.accelerationIncludingGravity.event;

    outEvent[0] = e.accelerationIncludingGravity.x * this._unify;
    outEvent[1] = e.accelerationIncludingGravity.y * this._unify;
    outEvent[2] = e.accelerationIncludingGravity.z * this._unify;

    this.accelerationIncludingGravity.emit(outEvent);
  }

  _emitAccelerationEvent(e) {
    let outEvent = this.acceleration.event;

    if (this.acceleration.isProvided) {
      // If raw acceleration values are provided
      outEvent[0] = e.acceleration.x * this._unify;
      outEvent[1] = e.acceleration.y * this._unify;
      outEvent[2] = e.acceleration.z * this._unify;
    } else if (this.accelerationIncludingGravity.isValid) {
      // Otherwise, if accelerationIncludingGravity values are provided,
      // estimate the acceleration with a low pass filter
      const accelerationIncludingGravity = [
        e.accelerationIncludingGravity.x * this._unify,
        e.accelerationIncludingGravity.y * this._unify,
        e.accelerationIncludingGravity.z * this._unify
      ];
      const k = 0.8;

      // Low pass filter to estimate the gravity
      this._estimatedGravity[0] = k * this._estimatedGravity[0] + (1 - k) * accelerationIncludingGravity[0];
      this._estimatedGravity[1] = k * this._estimatedGravity[1] + (1 - k) * accelerationIncludingGravity[1];
      this._estimatedGravity[2] = k * this._estimatedGravity[2] + (1 - k) * accelerationIncludingGravity[2];

      // Substract estimated gravity from the accelerationIncludingGravity values
      outEvent[0] = accelerationIncludingGravity[0] - this._estimatedGravity[0];
      outEvent[1] = accelerationIncludingGravity[1] - this._estimatedGravity[1];
      outEvent[2] = accelerationIncludingGravity[2] - this._estimatedGravity[2];
    } else {
      // TODO: throw error?
    }

    this.acceleration.emit(outEvent);
  }

  _emitRotationRateEvent(e) {
    let outEvent = this.rotationRate.event;

    outEvent[0] = e.rotationRate.alpha;
    outEvent[1] = e.rotationRate.beta;
    outEvent[2] = e.rotationRate.gamma;

    // TODO: unify

    this.rotationRate.emit(outEvent);
  }

  _addListener() {
    this._numListeners++;

    if (this._numListeners === 1)
      window.addEventListener('devicemotion', this._devicemotionListener, false);
  }

  _removeListener() {
    this._numListeners--;

    if (this._numListeners === 0)
      window.removeEventListener('devicemotion', this._devicemotionListener, false);
  }

  init() {
    return super.init((resolve, reject) => {
      this._promiseResolve = resolve;

      if (window.DeviceMotionEvent)
        window.addEventListener('devicemotion', this._devicemotionCheck, false);
      else
        resolve(this);
    });
  }

  addListener(listener) {
    super.addListener(listener);
    this._addListener();
  }

  removeListener(listener) {
    super.removeListener(listener);
    this._removeListener();
  }
}

module.exports = new DevicemotionModule();