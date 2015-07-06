'use strict';

const InputModule = require('./InputModule');
const DOMEventSubmodule = require('./DOMEventSubmodule');
const MotionInput = require('./MotionInput');
const platform = require('platform');

function getLocalTime() {
  if (window.performance)
    return performance.now() / 1000;
  return Date.now() / 1000;
}

class DevicemotionModule extends InputModule {
  constructor() {
    super('devicemotion');

    this.event = [null, null, null, null, null, null, null, null, null];

    this.accelerationIncludingGravity = new DOMEventSubmodule(this, 'accelerationIncludingGravity');
    this.acceleration = new DOMEventSubmodule(this, 'acceleration');
    this.rotationRate = new DOMEventSubmodule(this, 'rotationRate');

    this.required = {
      acceleration: false,
      accelerationIncludingGravity: false,
      rotationRate: false
    };

    this._numListeners = 0;
    this._promiseResolve = null;
    
    this._unifyMotionData = (platform.os.family === 'iOS' ? -1 : 1);
    this._unifyPeriod = (platform.os.family === 'Android' ? 1000 : 1);

    this._calculatedRotationRate = [0, 0, 0];
    this._calculatedAcceleration = [0, 0, 0];
    this._calculatedAccelerationTimeConstant = 0.100;
    this._lastAccelerationIncludingGravity = [0, 0, 0];
    this._lastOrientation = [0, 0, 0];
    this._lastOrientationTimestamp = null;

    this._devicemotionCheck = this._devicemotionCheck.bind(this);
    this._devicemotionListener = this._devicemotionListener.bind(this);
  }

  get _calculatedAccelerationDecay() {
    return Math.exp(-2 * Math.PI * this.accelerationIncludingGravity.period / this._calculatedAccelerationTimeConstant);
  }

  _devicemotionCheck(e) {
    this.isProvided = true;
    this.period = e.interval / 1000;

    // Check sensors for accelerationIncludingGravity, acceleration, and rotationRate
    this.accelerationIncludingGravity.isProvided = (
      e.accelerationIncludingGravity &&
      (typeof e.accelerationIncludingGravity.x === 'number') &&
      (typeof e.accelerationIncludingGravity.y === 'number') &&
      (typeof e.accelerationIncludingGravity.z === 'number')
    );
    this.accelerationIncludingGravity.period = e.interval / this._unifyPeriod;

    this.acceleration.isProvided = (
      e.acceleration &&
      (typeof e.acceleration.x === 'number') &&
      (typeof e.acceleration.y === 'number') &&
      (typeof e.acceleration.z === 'number')
    );
    this.acceleration.period = e.interval / this._unifyPeriod;

    this.rotationRate.isProvided = (
      e.rotationRate &&
      (typeof e.rotationRate.alpha === 'number') &&
      (typeof e.rotationRate.beta === 'number') &&
      (typeof e.rotationRate.gamma === 'number')
    );
    this.rotationRate.period = e.interval / this._unifyPeriod;


    window.removeEventListener('devicemotion', this._devicemotionCheck, false);

    // If acceleration is not provided by raw sensors,
    // indicate whether it can be calculated with accelerationIncludingGravity
    if (!this.acceleration.isProvided)
      this.acceleration.isCalculated = this.accelerationIncludingGravity.isProvided;

    // WARNING
    // The lines of code below are commented because of a bug of Chrome
    // on some Android devices, where 'devicemotion' events are not sent
    // or caught if the listener is set up after a 'deviceorientation'
    // listener. Here, the _tryOrientationFallback method would add a
    // 'deviceorientation' listener and block all subsequent 'devicemotion'
    // events on these devices. Comments will be removed once the bug of
    // Chrome is corrected.

    // if (this.required.rotationRate && !this.rotationRate.isProvided)
    //   this._tryOrientationFallback();
    // else
    this._promiseResolve(this);
  }

  _devicemotionListener(e) {
    this._emitDevicemotionEvent(e);

    if (this.required.accelerationIncludingGravity && this.accelerationIncludingGravity.isValid)
      this._emitAccelerationIncludingGravityEvent(e);

    if (this.required.acceleration && this.acceleration.isValid)
      this._emitAccelerationEvent(e);

    if (this.required.rotationRate && this.rotationRate.isProvided)
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

    outEvent[0] = e.accelerationIncludingGravity.x * this._unifyMotionData;
    outEvent[1] = e.accelerationIncludingGravity.y * this._unifyMotionData;
    outEvent[2] = e.accelerationIncludingGravity.z * this._unifyMotionData;

    this.accelerationIncludingGravity.emit(outEvent);
  }

  _emitAccelerationEvent(e) {
    let outEvent = this.acceleration.event;

    if (this.acceleration.isProvided) {
      // If raw acceleration values are provided
      outEvent[0] = e.acceleration.x * this._unifyMotionData;
      outEvent[1] = e.acceleration.y * this._unifyMotionData;
      outEvent[2] = e.acceleration.z * this._unifyMotionData;
    } else if (this.accelerationIncludingGravity.isValid) {
      // Otherwise, if accelerationIncludingGravity values are provided,
      // estimate the acceleration with a high-pass filter
      const accelerationIncludingGravity = [
        e.accelerationIncludingGravity.x * this._unifyMotionData,
        e.accelerationIncludingGravity.y * this._unifyMotionData,
        e.accelerationIncludingGravity.z * this._unifyMotionData
      ];
      const k = this._calculatedAccelerationDecay;

      // High-pass filter to estimate the acceleration without the gravity
      this._calculatedAcceleration[0] = (1 + k) * 0.5 * accelerationIncludingGravity[0] - (1 + k) * 0.5 * this._lastAccelerationIncludingGravity[0] + k * this._calculatedAcceleration[0];
      this._calculatedAcceleration[1] = (1 + k) * 0.5 * accelerationIncludingGravity[1] - (1 + k) * 0.5 * this._lastAccelerationIncludingGravity[1] + k * this._calculatedAcceleration[1];
      this._calculatedAcceleration[2] = (1 + k) * 0.5 * accelerationIncludingGravity[2] - (1 + k) * 0.5 * this._lastAccelerationIncludingGravity[2] + k * this._calculatedAcceleration[2];

      this._lastAccelerationIncludingGravity[0] = accelerationIncludingGravity[0];
      this._lastAccelerationIncludingGravity[1] = accelerationIncludingGravity[1];
      this._lastAccelerationIncludingGravity[2] = accelerationIncludingGravity[2];

      outEvent[0] = this._calculatedAcceleration[0];
      outEvent[1] = this._calculatedAcceleration[1];
      outEvent[2] = this._calculatedAcceleration[2];
    }

    this.acceleration.emit(outEvent);
  }

  _emitRotationRateEvent(e) {
    let outEvent = this.rotationRate.event;

    outEvent[0] = e.rotationRate.alpha;
    outEvent[1] = e.rotationRate.beta;
    outEvent[2] = e.rotationRate.gamma;

    // TODO(?): unify

    this.rotationRate.emit(outEvent);
  }

  _calculateRotationRateFromOrientation(orientation) {
    const now = getLocalTime();
    const k = 0.8;
    const alphaIsValid = (typeof orientation[0] === 'number');

    if (this._lastOrientationTimestamp) {
      let rAlpha = null;
      let rBeta;
      let rGamma;

      let alphaDiscontinuityFactor = 0;
      let betaDiscontinuityFactor = 0;
      let gammaDiscontinuityFactor = 0;

      const deltaT = now - this._lastOrientationTimestamp;

      if (alphaIsValid) {
        // alpha discontinuity (+360 -> 0 or 0 -> +360)
        if (this._lastOrientation[0] > 320 && orientation[0] < 40)
          alphaDiscontinuityFactor = 360;
        else if (this._lastOrientation[0] < 40 && orientation[0] > 320)
          alphaDiscontinuityFactor = -360;
      }

      // beta discontinuity (+180 -> -180 or -180 -> +180)
      if (this._lastOrientation[1] > 140 && orientation[1] < -140)
        betaDiscontinuityFactor = 360;
      else if (this._lastOrientation[1] < -140 && orientation[1] > 140)
        betaDiscontinuityFactor = -360

      // gamma discontinuities (+180 -> -180 or -180 -> +180)
      if (this._lastOrientation[2] > 50 && orientation[2] < -50)
        gammaDiscontinuityFactor = 180;
      else if (this._lastOrientation[2] < -50 && orientation[2] > 50)
        gammaDiscontinuityFactor = -180;

      if (deltaT > 0) {
        // Low pass filter to smooth the data
        if (alphaIsValid)
          rAlpha = k * this._calculatedRotationRate[0] + (1 - k) * (orientation[0] - this._lastOrientation[0] + alphaDiscontinuityFactor) / deltaT;
        rBeta = k * this._calculatedRotationRate[1] + (1 - k) * (orientation[1] - this._lastOrientation[1] + betaDiscontinuityFactor) / deltaT;
        rGamma = k * this._calculatedRotationRate[2] + (1 - k) * (orientation[2] - this._lastOrientation[2] + gammaDiscontinuityFactor) / deltaT;

        this._calculatedRotationRate[0] = rAlpha;
        this._calculatedRotationRate[1] = rBeta;
        this._calculatedRotationRate[2] = rGamma;
      }

      // TODO: resample the emission rate to match the devicemotion rate
      this.rotationRate.emit(this._calculatedRotationRate);
    }

    this._lastOrientationTimestamp = now;
    this._lastOrientation[0] = orientation[0];
    this._lastOrientation[1] = orientation[1];
    this._lastOrientation[2] = orientation[2];
  }

  _tryOrientationFallback() {
    MotionInput.requireModule('orientation')
      .then((orientation) => {
        if (orientation.isValid) {
          console.log("WARNING (motion-input): The 'deviceorientation' event does not exists (or does not provide values) in your browser, so the orientation of the device is estimated from DeviceMotion's 'orientation' event. Since the compass is not available, only beta and gamma angles are provided (alpha is null).");

          this.rotationRate.isCalculated = true;

          MotionInput.addListener('orientation', (orientation) => {
            this._calculateRotationRateFromOrientation(orientation)
          });
        }

        this._promiseResolve(this);
      });
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
    return super.init((resolve) => {
      this._promiseResolve = resolve;

      if (window.DeviceMotionEvent)
        window.addEventListener('devicemotion', this._devicemotionCheck, false);

      // WARNING
      // The lines of code below are commented because of a bug of Chrome
      // on some Android devices, where 'devicemotion' events are not sent
      // or caught if the listener is set up after a 'deviceorientation'
      // listener. Here, the _tryOrientationFallback method would add a
      // 'deviceorientation' listener and block all subsequent 'devicemotion'
      // events on these devices. Comments will be removed once the bug of
      // Chrome is corrected.

      // else if (this.required.rotationRate)
      // this._tryOrientationFallback();

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