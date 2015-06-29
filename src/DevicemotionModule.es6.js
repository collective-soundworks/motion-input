const InputModule = require('./InputModule');

class DevicemotionSubmodule extends InputModule {
  constructor(devicemotionModule, eventType) {
    super(eventType);

    this.devicemotionModule = devicemotionModule;
    this.event[0] = 0;
    this.event[1] = 0;
    this.event[2] = 0;
  }

  start() {
    this.devicemotionModule._addListener();
  }

  stop() {
    this.devicemotionModule._removeListener();
  }

  init() {
    this.devicemotionModule.required[this.eventType] = true;

    let devicemotionPromise = this.devicemotionModule.promise;

    if (!devicemotionPromise)
      devicemotionPromise = this.devicemotionModule.init();

    return devicemotionPromise.then((module) => this);
  }
}

class DevicemotionModule extends InputModule {
  constructor() {
    super('devicemotion');

    this.event = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];

    this.accelerationIncludingGravity = new DevicemotionSubmodule(this, 'accelerationIncludingGravity');
    this.acceleration = new DevicemotionSubmodule(this, 'acceleration');
    this.rotationRate = new DevicemotionSubmodule(this, 'rotationRate');

    this.required = {
      acceleration: false,
      accelerationIncludingGravity: false,
      rotationRate: false
    };

    this.accelerationIncludingGravityEvent = [0, 0, 0];
    this.accelerationEvent = [0, 0, 0];
    this.rotationRateEvent = [0, 0, 0];

    this._devicemotionCheck = this._devicemotionCheck.bind(this);
    this._devicemotionListener = this._devicemotionListener.bind(this);

    this._promiseResolve = null;
    this._numListeners = 0;
  }

  _devicemotionCheck(e) {
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

    // TODO: get period

    window.removeEventListener('devicemotion', this._devicemotionCheck);

    this._promiseResolve(this);
  }

  _devicemotionListener(e) {
    this._emitDevicemotionEvent(e);

    if (this.required.accelerationIncludingGravity && this.accelerationIncludingGravity.isValid)
      this._emitAccelerationIncludingGravityEvent(e);

    if (this.required.acceleration)
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
    let outEvent = this.accelerationIncludingGravityEvent;

    outEvent[0] = e.accelerationIncludingGravity.x;
    outEvent[1] = e.accelerationIncludingGravity.y;
    outEvent[2] = e.accelerationIncludingGravity.z;

    // TODO: unify

    this.accelerationIncludingGravity.emit(outEvent);
  }

  _emitAccelerationEvent(e) {
    let outEvent = this.accelerationEvent;

    if (this.acceleration.isValid) {
      outEvent[0] = e.acceleration.x;
      outEvent[1] = e.acceleration.y;
      outEvent[2] = e.acceleration.z;
    } else if (this.accelerationIncludingGravity.isValid) {
      // TODO: calculate from accelerationIncludingGravity
      outEvent[0] = 77;
      outEvent[1] = 77;
      outEvent[2] = 77;
    }

    // TODO: unify

    this.acceleration.emit(outEvent);
  }

  _emitRotationRateEvent(e) {
    let outEvent = this.rotationRateEvent;

    outEvent[0] = e.rotationRate.alpha;
    outEvent[1] = e.rotationRate.beta;
    outEvent[2] = e.rotationRate.gamma;

    // TODO: unify

    this.rotationRate.emit(outEvent);
  }

  init() {
    return super.init((resolve, reject) => {
      this._promiseResolve = resolve;

      if (window.DeviceMotionEvent) {
        this.isProvided = true;
        window.addEventListener('devicemotion', this._devicemotionCheck, false);
      } else {
        resolve(this);
      }
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
}

module.exports = new DevicemotionModule();