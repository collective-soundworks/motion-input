/**
 * @fileoverview `DeviceMotion` module
 * @author <a href='mailto:sebastien@robaszkiewicz.com'>Sébastien Robaszkiewicz</a>, <a href='mailto:Norbert.Schnell@ircam.fr'>Norbert Schnell</a>
 */

'use strict';

const InputModule = require('./InputModule');
const DOMEventSubmodule = require('./DOMEventSubmodule');
const MotionInput = require('./MotionInput');
const platform = require('platform');

/**
 * Gets the current local time in seconds.
 * Uses `window.performance.now()` if available, and `Date.now()` otherwise.
 * 
 * @return {number}
 */
function getLocalTime() {
  if (window.performance)
    return performance.now() / 1000;
  return Date.now() / 1000;
}

/**
 * `DeviceMotion` module singleton.
 * The `DeviceMotionModule` singleton provides the raw values
 * of the acceleration including gravity, acceleration, and rotation
 * rate provided by the `DeviceMotion` event.
 * It also instantiate the `AccelerationIncludingGravity`,
 * `Acceleration` and `RotationRate` submodules that unify those values
 * across platforms by making them compliant with {@link
 * http://www.w3.org/TR/orientation-event/|the W3C standard}.
 * When raw values are not provided by the sensors, this modules tries
 * to recalculate them from available values:
 * - `acceleration` is calculated from `accelerationIncludingGravity`
 *   with a high-pass filter;
 * - (coming soon — waiting for a bug on Chrome to be resolved)
 *   `rotationRate` is calculated from `orientation`.
 *
 * @class DeviceMotionModule
 * @extends InputModule
 */
class DeviceMotionModule extends InputModule {

  /**
   * Creates the `DeviceMotion` module instance.
   *
   * @constructor
   */
  constructor() {
    super('devicemotion');

    /**
     * Raw values coming from the `devicemotion` event sent by this module.
     *
     * @this DeviceMotionModule
     * @type {number[]}
     * @default [null, null, null, null, null, null, null, null, null]
     */
    this.event = [null, null, null, null, null, null, null, null, null];

    /**
     * The `AccelerationIncludingGravity` module.
     * Provides unified values of the acceleration including gravity.
     *
     * @this DeviceMotionModule
     * @type {DOMEventSubmodule}
     */
    this.accelerationIncludingGravity = new DOMEventSubmodule(this, 'accelerationIncludingGravity');
    
    /**
     * The `Acceleration` submodule.
     * Provides unified values of the acceleration.
     * Estimates the acceleration values from `accelerationIncludingGravity`
     * raw values if the acceleration raw values are not available on the
     * device.
     *
     * @this DeviceMotionModule
     * @type {DOMEventSubmodule}
     */
    this.acceleration = new DOMEventSubmodule(this, 'acceleration');

    /**
     * The `RotationRate` submodule.
     * Provides unified values of the rotation rate.
     * (coming soon, waiting for a bug on Chrome to be resolved)
     * Estimates the rotation rate values from `orientation` values if
     * the rotation rate raw values are not available on the device.
     *
     * @this DeviceMotionModule
     * @type {DOMEventSubmodule}
     */
    this.rotationRate = new DOMEventSubmodule(this, 'rotationRate');

    /**
     * Required submodules / events.
     *
     * @this DeviceMotionModule
     * @type {object}
     * @property {bool} accelerationIncludingGravity - Indicates whether the `accelerationIncludingGravity` unified values are required or not (defaults to `false`).
     * @property {bool} acceleration - Indicates whether the `acceleration` unified values are required or not (defaults to `false`).
     * @property {bool} rotationRate - Indicates whether the `rotationRate` unified values are required or not (defaults to `false`).
     */
    this.required = {
      accelerationIncludingGravity: false,
      acceleration: false,
      rotationRate: false
    };

    /**
     * Number of listeners subscribed to the `DeviceMotion` module.
     *
     * @this DeviceMotionModule
     * @type {number}
     */
    this._numListeners = 0;

    /**
     * Resolve function of the module's promise.
     *
     * @this DeviceMotionModule
     * @type {function}
     * @default null
     * @see DeviceMotionModule#init
     */
    this._promiseResolve = null;
    
    /**
     * Unifying factor of the motion data values (`1` on Android, `-1` on iOS).
     *
     * @this DeviceMotionModule
     * @type {number}
     */
    this._unifyMotionData = (platform.os.family === 'iOS' ? -1 : 1);

    /**
     * Unifying factor of the period (`0.001` on Android, `1` on iOS).
     *
     * @this DeviceMotionModule
     * @type {number}
     */
    this._unifyPeriod = (platform.os.family === 'Android' ? 0.001 : 1);

    /**
     * Acceleration calculated from the `accelerationIncludingGravity` raw values.
     *
     * @this DeviceMotionModule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    this._calculatedAcceleration = [0, 0, 0];

    /**
     * Time constant (half-life) of the high-pass filter used to smooth the acceleration values calculated from the acceleration including gravity raw values (in seconds).
     *
     * @this DeviceMotionModule
     * @type {number}
     * @default 0.1
     * @constant
     */
    this._calculatedAccelerationTimeConstant = 0.1;

    /**
     * Latest `accelerationIncludingGravity` raw value, used in the high-pass filter to calculate the acceleration (if the `acceleration` values are not provided by `'devicemotion'`).
     *
     * @this DeviceMotionModule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    this._lastAccelerationIncludingGravity = [0, 0, 0];
  
    /**
     * Rotation rate calculated from the orientation values.
     *
     * @this DeviceMotionModule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    this._calculatedRotationRate = [0, 0, 0];

    /**
     * Latest orientation value, used to calculate the rotation rate  (if the `rotationRate` values are not provided by `'devicemotion'`).
     *
     * @this DeviceMotionModule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    this._lastOrientation = [0, 0, 0];

    /**
     * Latest orientation timestamps, used to calculate the rotation rate (if the `rotationRate` values are not provided by `'devicemotion'`).
     *
     * @this DeviceMotionModule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    this._lastOrientationTimestamp = null;

    /**
     * Method binding of the sensor check.
     *
     * @this DeviceMotionModule
     * @type {function}
     */
    this._devicemotionCheck = this._devicemotionCheck.bind(this);

    /**
     * Method binding of the `'devicemotion'` event callback.
     *
     * @this DeviceMotionModule
     * @type {function}
     */
    this._devicemotionListener = this._devicemotionListener.bind(this);
  }

  /**
   * Decay factor of the high-pass filter used to calculate the acceleration from the `accelerationIncludingGravity` raw values.
   *
   * @type {number}
   * @readonly
   */
  get _calculatedAccelerationDecay() {
    return Math.exp(-2 * Math.PI * this.accelerationIncludingGravity.period / this._calculatedAccelerationTimeConstant);
  }

  /**
   * Sensor check on initialization of the module.
   * This method:
   * - checks whether the `accelerationIncludingGravity`, the `acceleration`,
   *   and the `rotationRate` values are valid or not;
   * - gets the period of the `'devicemotion'` event and sets the period of
   *   the `AccelerationIncludingGravity`, `Acceleration`, and `RotationRate`
   *   submodules;
   * - (in the case where acceleration raw values are not provided)
   *   indicates whether the acceleration can be calculated from the
   *   `accelerationIncludingGravity` unified values or not.
   *
   * @param {DeviceMotionEvent} e - The first `'devicemotion'` event caught.
   */
  _devicemotionCheck(e) {
    this.isProvided = true;
    this.period = e.interval / 1000;

    // Sensor availability for the acceleration including gravity
    this.accelerationIncludingGravity.isProvided = (
      e.accelerationIncludingGravity &&
      (typeof e.accelerationIncludingGravity.x === 'number') &&
      (typeof e.accelerationIncludingGravity.y === 'number') &&
      (typeof e.accelerationIncludingGravity.z === 'number')
    );
    this.accelerationIncludingGravity.period = e.interval * this._unifyPeriod;

    // Sensor availability for the acceleration
    this.acceleration.isProvided = (
      e.acceleration &&
      (typeof e.acceleration.x === 'number') &&
      (typeof e.acceleration.y === 'number') &&
      (typeof e.acceleration.z === 'number')
    );
    this.acceleration.period = e.interval * this._unifyPeriod;

    // Sensor availability for the rotation rate
    this.rotationRate.isProvided = (
      e.rotationRate &&
      (typeof e.rotationRate.alpha === 'number') &&
      (typeof e.rotationRate.beta === 'number') &&
      (typeof e.rotationRate.gamma === 'number')
    );
    this.rotationRate.period = e.interval * this._unifyPeriod;

    // We only need to listen to one event (=> remove the listener)
    window.removeEventListener('devicemotion', this._devicemotionCheck, false);

    // If acceleration is not provided by raw sensors, indicate whether it
    // can be calculated with `accelerationIncludingGravity` or not
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

  /**
   * `'devicemotion'` event callback.
   * This method emits an event with the raw `'devicemotion'` values, and emits
   * events with the unified `accelerationIncludingGravity`, `acceleration`, 
   * and / or `rotationRate` values if they are required.
   *
   * @param {DeviceMotionEvent} e - `'devicemotion'` event the values are calculated from.
   */
  _devicemotionListener(e) {
    // 'devicemotion' event (raw values)
    this._emitDeviceMotionEvent(e);

    // 'acceleration' event (unified values)
    if (this.required.accelerationIncludingGravity && this.accelerationIncludingGravity.isValid)
      this._emitAccelerationIncludingGravityEvent(e);

    // 'accelerationIncludingGravity' event (unified values)
    if (this.required.acceleration && this.acceleration.isValid) // the fallback calculation of the acceleration happens in the `_emitAcceleration` method, so we check if this.acceleration.isValid
      this._emitAccelerationEvent(e);

    // 'rotationRate' event (unified values)
    if (this.required.rotationRate && this.rotationRate.isProvided) // the fallback calculation of the rotation rate does NOT happen in the `_emitRotationRate` method, so we only check if this.rotationRate.isProvided
      this._emitRotationRateEvent(e);
  }

  /**
   * Emits the `'devicemotion'` raw values.
   *
   * @param {DeviceMotionEvent} e - `'devicemotion'` event the values are calculated from.
   */
  _emitDeviceMotionEvent(e) {
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

  /**
   * Emits the `accelerationIncludingGravity` unified values.
   *
   * @param {DeviceMotionEvent} e - `'devicemotion'` event the values are calculated from.
   */
  _emitAccelerationIncludingGravityEvent(e) {
    let outEvent = this.accelerationIncludingGravity.event;

    outEvent[0] = e.accelerationIncludingGravity.x * this._unifyMotionData;
    outEvent[1] = e.accelerationIncludingGravity.y * this._unifyMotionData;
    outEvent[2] = e.accelerationIncludingGravity.z * this._unifyMotionData;

    this.accelerationIncludingGravity.emit(outEvent);
  }

  /**
   * Emits the `acceleration` unified values.
   * When the `acceleration` raw values are not available, the method
   * also calculates the acceleration from the
   * `accelerationIncludingGravity` raw values.
   *
   * @param {DeviceMotionEvent} e - The `'devicemotion'` event.
   */
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

      // High-pass filter to estimate the acceleration (without the gravity)
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

  /**
   * Emits the `rotationRate` unified values.
   *
   * @param {DeviceMotionEvent} e - `'devicemotion'` event the values are calculated from.
   */
  _emitRotationRateEvent(e) {
    let outEvent = this.rotationRate.event;

    outEvent[0] = e.rotationRate.alpha;
    outEvent[1] = e.rotationRate.beta;
    outEvent[2] = e.rotationRate.gamma;

    // TODO(?): unify

    this.rotationRate.emit(outEvent);
  }

  /**
   * Calculates and emits the `rotationRate` unified values from the `orientation` values.
   *
   * @param {number[]} orientation - Latest `orientation` raw values.
   */
  _calculateRotationRateFromOrientation(orientation) {
    const now = getLocalTime();
    const k = 0.8; // TODO: improve low pass filter (frames are not regular)
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

  /**
   * Checks whether the rotation rate can be calculated from the `orientation` values or not.
   */
  _tryOrientationFallback() {
    MotionInput.requireModule('orientation')
      .then((orientation) => {
        if (orientation.isValid) {
          console.log("WARNING (motion-input): The 'devicemotion' event does not exists or does not provide rotation rate values in your browser, so the rotation rate of the device is estimated from the 'orientation', calculated from the 'deviceorientation' event. Since the compass might not be available, only `beta` and `gamma` angles may be provided (`alpha` would be null).");

          this.rotationRate.isCalculated = true;

          MotionInput.addListener('orientation', (orientation) => {
            this._calculateRotationRateFromOrientation(orientation)
          });
        }

        this._promiseResolve(this);
      });
  }

  /**
   * Increases the number of listeners to this module (either because someone listens
   * to this module, or one of the three `DOMEventSubmodules`
   * (`AccelerationIncludingGravity`, `Acceleration`, `RotationRate`).
   * When the number of listeners reaches `1`, adds a `'devicemotion'` event listener.
   *
   * @see DeviceMotionModule#addListener
   * @see DOMEventSubmodule#start
   */
  _addListener() {
    this._numListeners++;

    if (this._numListeners === 1)
      window.addEventListener('devicemotion', this._devicemotionListener, false);
  }

  /**
   * Decreases the number of listeners to this module (either because someone stops
   * listening to this module, or one of the three `DOMEventSubmodules`
   * (`AccelerationIncludingGravity`, `Acceleration`, `RotationRate`).
   * When the number of listeners reaches `0`, removes the `'devicemotion'` event listener.
   *
   * @see DeviceMotionModule#removeListener
   * @see DOMEventSubmodule#stop
   */
  _removeListener() {
    this._numListeners--;

    if (this._numListeners === 0)
      window.removeEventListener('devicemotion', this._devicemotionListener, false);
  }

  /**
   * Initializes of the module.
   *
   * @return {promise}
   */
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

  /**
   * Adds a listener to this module.
   * 
   * @param {function} listener - Listener to add.
   */
  addListener(listener) {
    super.addListener(listener);
    this._addListener();
  }

  /**
   * Removes a listener from this module.
   *
   * @param {function} listener - Listener to remove.
   */
  removeListener(listener) {
    super.removeListener(listener);
    this._removeListener();
  }
}

module.exports = new DeviceMotionModule();