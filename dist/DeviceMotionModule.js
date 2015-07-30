/**
 * @fileoverview `DeviceMotion` module
 * @author <a href='mailto:sebastien@robaszkiewicz.com'>Sébastien Robaszkiewicz</a>, <a href='mailto:Norbert.Schnell@ircam.fr'>Norbert Schnell</a>
 */

'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var InputModule = require('./InputModule');
var DOMEventSubmodule = require('./DOMEventSubmodule');
var MotionInput = require('./MotionInput');
var platform = require('platform');

/**
 * Gets the current local time in seconds.
 * Uses `window.performance.now()` if available, and `Date.now()` otherwise.
 * 
 * @return {number}
 */
function getLocalTime() {
  if (window.performance) return window.performance.now() / 1000;
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

var DeviceMotionModule = (function (_InputModule) {
  _inherits(DeviceMotionModule, _InputModule);

  /**
   * Creates the `DeviceMotion` module instance.
   *
   * @constructor
   */

  function DeviceMotionModule() {
    _classCallCheck(this, DeviceMotionModule);

    _get(Object.getPrototypeOf(DeviceMotionModule.prototype), 'constructor', this).call(this, 'devicemotion');

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
    this._unifyMotionData = platform.os.family === 'iOS' ? -1 : 1;

    /**
     * Unifying factor of the period (`0.001` on Android, `1` on iOS).
     *
     * @this DeviceMotionModule
     * @type {number}
     */
    this._unifyPeriod = platform.os.family === 'Android' ? 0.001 : 1;

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

  _createClass(DeviceMotionModule, [{
    key: '_devicemotionCheck',

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
    value: function _devicemotionCheck(e) {
      this.isProvided = true;
      this.period = e.interval / 1000;

      // Sensor availability for the acceleration including gravity
      this.accelerationIncludingGravity.isProvided = e.accelerationIncludingGravity && typeof e.accelerationIncludingGravity.x === 'number' && typeof e.accelerationIncludingGravity.y === 'number' && typeof e.accelerationIncludingGravity.z === 'number';
      this.accelerationIncludingGravity.period = e.interval * this._unifyPeriod;

      // Sensor availability for the acceleration
      this.acceleration.isProvided = e.acceleration && typeof e.acceleration.x === 'number' && typeof e.acceleration.y === 'number' && typeof e.acceleration.z === 'number';
      this.acceleration.period = e.interval * this._unifyPeriod;

      // Sensor availability for the rotation rate
      this.rotationRate.isProvided = e.rotationRate && typeof e.rotationRate.alpha === 'number' && typeof e.rotationRate.beta === 'number' && typeof e.rotationRate.gamma === 'number';
      this.rotationRate.period = e.interval * this._unifyPeriod;

      // We only need to listen to one event (=> remove the listener)
      window.removeEventListener('devicemotion', this._devicemotionCheck, false);

      // If acceleration is not provided by raw sensors, indicate whether it
      // can be calculated with `accelerationIncludingGravity` or not
      if (!this.acceleration.isProvided) this.acceleration.isCalculated = this.accelerationIncludingGravity.isProvided;

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
  }, {
    key: '_devicemotionListener',
    value: function _devicemotionListener(e) {
      // 'devicemotion' event (raw values)
      this._emitDeviceMotionEvent(e);

      // 'acceleration' event (unified values)
      if (this.required.accelerationIncludingGravity && this.accelerationIncludingGravity.isValid) this._emitAccelerationIncludingGravityEvent(e);

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
  }, {
    key: '_emitDeviceMotionEvent',
    value: function _emitDeviceMotionEvent(e) {
      var outEvent = this.event;

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
  }, {
    key: '_emitAccelerationIncludingGravityEvent',
    value: function _emitAccelerationIncludingGravityEvent(e) {
      var outEvent = this.accelerationIncludingGravity.event;

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
  }, {
    key: '_emitAccelerationEvent',
    value: function _emitAccelerationEvent(e) {
      var outEvent = this.acceleration.event;

      if (this.acceleration.isProvided) {
        // If raw acceleration values are provided
        outEvent[0] = e.acceleration.x * this._unifyMotionData;
        outEvent[1] = e.acceleration.y * this._unifyMotionData;
        outEvent[2] = e.acceleration.z * this._unifyMotionData;
      } else if (this.accelerationIncludingGravity.isValid) {
        // Otherwise, if accelerationIncludingGravity values are provided,
        // estimate the acceleration with a high-pass filter
        var accelerationIncludingGravity = [e.accelerationIncludingGravity.x * this._unifyMotionData, e.accelerationIncludingGravity.y * this._unifyMotionData, e.accelerationIncludingGravity.z * this._unifyMotionData];
        var k = this._calculatedAccelerationDecay;

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
  }, {
    key: '_emitRotationRateEvent',
    value: function _emitRotationRateEvent(e) {
      var outEvent = this.rotationRate.event;

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
  }, {
    key: '_calculateRotationRateFromOrientation',
    value: function _calculateRotationRateFromOrientation(orientation) {
      var now = getLocalTime();
      var k = 0.8; // TODO: improve low pass filter (frames are not regular)
      var alphaIsValid = typeof orientation[0] === 'number';

      if (this._lastOrientationTimestamp) {
        var rAlpha = null;
        var rBeta = undefined;
        var rGamma = undefined;

        var alphaDiscontinuityFactor = 0;
        var betaDiscontinuityFactor = 0;
        var gammaDiscontinuityFactor = 0;

        var deltaT = now - this._lastOrientationTimestamp;

        if (alphaIsValid) {
          // alpha discontinuity (+360 -> 0 or 0 -> +360)
          if (this._lastOrientation[0] > 320 && orientation[0] < 40) alphaDiscontinuityFactor = 360;else if (this._lastOrientation[0] < 40 && orientation[0] > 320) alphaDiscontinuityFactor = -360;
        }

        // beta discontinuity (+180 -> -180 or -180 -> +180)
        if (this._lastOrientation[1] > 140 && orientation[1] < -140) betaDiscontinuityFactor = 360;else if (this._lastOrientation[1] < -140 && orientation[1] > 140) betaDiscontinuityFactor = -360;

        // gamma discontinuities (+180 -> -180 or -180 -> +180)
        if (this._lastOrientation[2] > 50 && orientation[2] < -50) gammaDiscontinuityFactor = 180;else if (this._lastOrientation[2] < -50 && orientation[2] > 50) gammaDiscontinuityFactor = -180;

        if (deltaT > 0) {
          // Low pass filter to smooth the data
          if (alphaIsValid) rAlpha = k * this._calculatedRotationRate[0] + (1 - k) * (orientation[0] - this._lastOrientation[0] + alphaDiscontinuityFactor) / deltaT;
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
  }, {
    key: '_tryOrientationFallback',
    value: function _tryOrientationFallback() {
      var _this = this;

      MotionInput.requireModule('orientation').then(function (orientation) {
        if (orientation.isValid) {
          console.log("WARNING (motion-input): The 'devicemotion' event does not exists or does not provide rotation rate values in your browser, so the rotation rate of the device is estimated from the 'orientation', calculated from the 'deviceorientation' event. Since the compass might not be available, only `beta` and `gamma` angles may be provided (`alpha` would be null).");

          _this.rotationRate.isCalculated = true;

          MotionInput.addListener('orientation', function (orientation) {
            _this._calculateRotationRateFromOrientation(orientation);
          });
        }

        _this._promiseResolve(_this);
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
  }, {
    key: '_addListener',
    value: function _addListener() {
      this._numListeners++;

      if (this._numListeners === 1) window.addEventListener('devicemotion', this._devicemotionListener, false);
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
  }, {
    key: '_removeListener',
    value: function _removeListener() {
      this._numListeners--;

      if (this._numListeners === 0) window.removeEventListener('devicemotion', this._devicemotionListener, false);
    }

    /**
     * Initializes of the module.
     *
     * @return {promise}
     */
  }, {
    key: 'init',
    value: function init() {
      var _this2 = this;

      return _get(Object.getPrototypeOf(DeviceMotionModule.prototype), 'init', this).call(this, function (resolve) {
        _this2._promiseResolve = resolve;

        if (window.DeviceMotionEvent) window.addEventListener('devicemotion', _this2._devicemotionCheck, false);

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

        else resolve(_this2);
      });
    }

    /**
     * Adds a listener to this module.
     * 
     * @param {function} listener - Listener to add.
     */
  }, {
    key: 'addListener',
    value: function addListener(listener) {
      _get(Object.getPrototypeOf(DeviceMotionModule.prototype), 'addListener', this).call(this, listener);
      this._addListener();
    }

    /**
     * Removes a listener from this module.
     *
     * @param {function} listener - Listener to remove.
     */
  }, {
    key: 'removeListener',
    value: function removeListener(listener) {
      _get(Object.getPrototypeOf(DeviceMotionModule.prototype), 'removeListener', this).call(this, listener);
      this._removeListener();
    }
  }, {
    key: '_calculatedAccelerationDecay',
    get: function get() {
      return Math.exp(-2 * Math.PI * this.accelerationIncludingGravity.period / this._calculatedAccelerationTimeConstant);
    }
  }]);

  return DeviceMotionModule;
})(InputModule);

module.exports = new DeviceMotionModule();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9EZXZpY2VNb3Rpb25Nb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7QUFFYixJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDN0MsSUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUN6RCxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDN0MsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOzs7Ozs7OztBQVFyQyxTQUFTLFlBQVksR0FBRztBQUN0QixNQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQ3BCLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDekMsU0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0NBQzFCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUJLLGtCQUFrQjtZQUFsQixrQkFBa0I7Ozs7Ozs7O0FBT1gsV0FQUCxrQkFBa0IsR0FPUjswQkFQVixrQkFBa0I7O0FBUXBCLCtCQVJFLGtCQUFrQiw2Q0FRZCxjQUFjLEVBQUU7Ozs7Ozs7OztBQVN0QixRQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzs7Ozs7Ozs7O0FBU3BFLFFBQUksQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLGlCQUFpQixDQUFDLElBQUksRUFBRSw4QkFBOEIsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7QUFZaEcsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLGlCQUFpQixDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7O0FBWWhFLFFBQUksQ0FBQyxZ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LENBQUMsYUFBYSxLQUFLLENBQUMsRUFDMUIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDakY7Ozs7Ozs7OztXQU9HLGdCQUFHOzs7QUFDTCx3Q0FyZkUsa0JBQWtCLHNDQXFmRixVQUFDLE9BQU8sRUFBSztBQUM3QixlQUFLLGVBQWUsR0FBRyxPQUFPLENBQUM7O0FBRS9CLFlBQUksTUFBTSxDQUFDLGlCQUFpQixFQUMxQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLE9BQUssa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7O2FBZXhFLE9BQU8sUUFBTSxDQUFDO09BQ2pCLEVBQUU7S0FDSjs7Ozs7Ozs7O1dBT1UscUJBQUMsUUFBUSxFQUFFO0FBQ3BCLGlDQWxoQkUsa0JBQWtCLDZDQWtoQkYsUUFBUSxFQUFFO0FBQzVCLFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztLQUNyQjs7Ozs7Ozs7O1dBT2Esd0JBQUMsUUFBUSxFQUFFO0FBQ3ZCLGlDQTVoQkUsa0JBQWtCLGdEQTRoQkMsUUFBUSxFQUFFO0FBQy9CLFVBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztLQUN4Qjs7O1NBM1crQixlQUFHO0FBQ2pDLGFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7S0FDckg7OztTQXJMRyxrQkFBa0I7R0FBUyxXQUFXOztBQWlpQjVDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDIiwiZmlsZSI6InNyYy9EZXZpY2VNb3Rpb25Nb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgYERldmljZU1vdGlvbmAgbW9kdWxlXG4gKiBAYXV0aG9yIDxhIGhyZWY9J21haWx0bzpzZWJhc3RpZW5Acm9iYXN6a2lld2ljei5jb20nPlPDqWJhc3RpZW4gUm9iYXN6a2lld2ljejwvYT4sIDxhIGhyZWY9J21haWx0bzpOb3JiZXJ0LlNjaG5lbGxAaXJjYW0uZnInPk5vcmJlcnQgU2NobmVsbDwvYT5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IElucHV0TW9kdWxlID0gcmVxdWlyZSgnLi9JbnB1dE1vZHVsZScpO1xuY29uc3QgRE9NRXZlbnRTdWJtb2R1bGUgPSByZXF1aXJlKCcuL0RPTUV2ZW50U3VibW9kdWxlJyk7XG5jb25zdCBNb3Rpb25JbnB1dCA9IHJlcXVpcmUoJy4vTW90aW9uSW5wdXQnKTtcbmNvbnN0IHBsYXRmb3JtID0gcmVxdWlyZSgncGxhdGZvcm0nKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUgaW4gc2Vjb25kcy5cbiAqIFVzZXMgYHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKWAgaWYgYXZhaWxhYmxlLCBhbmQgYERhdGUubm93KClgIG90aGVyd2lzZS5cbiAqIFxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBnZXRMb2NhbFRpbWUoKSB7XG4gIGlmICh3aW5kb3cucGVyZm9ybWFuY2UpXG4gICAgcmV0dXJuIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAvIDEwMDA7XG4gIHJldHVybiBEYXRlLm5vdygpIC8gMTAwMDtcbn1cblxuLyoqXG4gKiBgRGV2aWNlTW90aW9uYCBtb2R1bGUgc2luZ2xldG9uLlxuICogVGhlIGBEZXZpY2VNb3Rpb25Nb2R1bGVgIHNpbmdsZXRvbiBwcm92aWRlcyB0aGUgcmF3IHZhbHVlc1xuICogb2YgdGhlIGFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eSwgYWNjZWxlcmF0aW9uLCBhbmQgcm90YXRpb25cbiAqIHJhdGUgcHJvdmlkZWQgYnkgdGhlIGBEZXZpY2VNb3Rpb25gIGV2ZW50LlxuICogSXQgYWxzbyBpbnN0YW50aWF0ZSB0aGUgYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLFxuICogYEFjY2VsZXJhdGlvbmAgYW5kIGBSb3RhdGlvblJhdGVgIHN1Ym1vZHVsZXMgdGhhdCB1bmlmeSB0aG9zZSB2YWx1ZXNcbiAqIGFjcm9zcyBwbGF0Zm9ybXMgYnkgbWFraW5nIHRoZW0gY29tcGxpYW50IHdpdGgge0BsaW5rXG4gKiBodHRwOi8vd3d3LnczLm9yZy9UUi9vcmllbnRhdGlvbi1ldmVudC98dGhlIFczQyBzdGFuZGFyZH0uXG4gKiBXaGVuIHJhdyB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSB0aGUgc2Vuc29ycywgdGhpcyBtb2R1bGVzIHRyaWVzXG4gKiB0byByZWNhbGN1bGF0ZSB0aGVtIGZyb20gYXZhaWxhYmxlIHZhbHVlczpcbiAqIC0gYGFjY2VsZXJhdGlvbmAgaXMgY2FsY3VsYXRlZCBmcm9tIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YFxuICogICB3aXRoIGEgaGlnaC1wYXNzIGZpbHRlcjtcbiAqIC0gKGNvbWluZyBzb29uIOKAlCB3YWl0aW5nIGZvciBhIGJ1ZyBvbiBDaHJvbWUgdG8gYmUgcmVzb2x2ZWQpXG4gKiAgIGByb3RhdGlvblJhdGVgIGlzIGNhbGN1bGF0ZWQgZnJvbSBgb3JpZW50YXRpb25gLlxuICpcbiAqIEBjbGFzcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAqIEBleHRlbmRzIElucHV0TW9kdWxlXG4gKi9cbmNsYXNzIERldmljZU1vdGlvbk1vZHVsZSBleHRlbmRzIElucHV0TW9kdWxlIHtcblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgYERldmljZU1vdGlvbmAgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCdkZXZpY2Vtb3Rpb24nKTtcblxuICAgIC8qKlxuICAgICAqIFJhdyB2YWx1ZXMgY29taW5nIGZyb20gdGhlIGBkZXZpY2Vtb3Rpb25gIGV2ZW50IHNlbnQgYnkgdGhpcyBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgW251bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGxdXG4gICAgICovXG4gICAgdGhpcy5ldmVudCA9IFtudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgbW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIHVuaWZpZWQgdmFsdWVzIG9mIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ID0gbmV3IERPTUV2ZW50U3VibW9kdWxlKHRoaXMsICdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Jyk7XG4gICAgXG4gICAgLyoqXG4gICAgICogVGhlIGBBY2NlbGVyYXRpb25gIHN1Ym1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyB1bmlmaWVkIHZhbHVlcyBvZiB0aGUgYWNjZWxlcmF0aW9uLlxuICAgICAqIEVzdGltYXRlcyB0aGUgYWNjZWxlcmF0aW9uIHZhbHVlcyBmcm9tIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YFxuICAgICAqIHJhdyB2YWx1ZXMgaWYgdGhlIGFjY2VsZXJhdGlvbiByYXcgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlIG9uIHRoZVxuICAgICAqIGRldmljZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKi9cbiAgICB0aGlzLmFjY2VsZXJhdGlvbiA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAnYWNjZWxlcmF0aW9uJyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYFJvdGF0aW9uUmF0ZWAgc3VibW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIHVuaWZpZWQgdmFsdWVzIG9mIHRoZSByb3RhdGlvbiByYXRlLlxuICAgICAqIChjb21pbmcgc29vbiwgd2FpdGluZyBmb3IgYSBidWcgb24gQ2hyb21lIHRvIGJlIHJlc29sdmVkKVxuICAgICAqIEVzdGltYXRlcyB0aGUgcm90YXRpb24gcmF0ZSB2YWx1ZXMgZnJvbSBgb3JpZW50YXRpb25gIHZhbHVlcyBpZlxuICAgICAqIHRoZSByb3RhdGlvbiByYXRlIHJhdyB2YWx1ZXMgYXJlIG5vdCBhdmFpbGFibGUgb24gdGhlIGRldmljZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKi9cbiAgICB0aGlzLnJvdGF0aW9uUmF0ZSA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAncm90YXRpb25SYXRlJyk7XG5cbiAgICAvKipcbiAgICAgKiBSZXF1aXJlZCBzdWJtb2R1bGVzIC8gZXZlbnRzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gYWNjZWxlcmF0aW9uIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGBhY2NlbGVyYXRpb25gIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gcm90YXRpb25SYXRlIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGByb3RhdGlvblJhdGVgIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqL1xuICAgIHRoaXMucmVxdWlyZWQgPSB7XG4gICAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5OiBmYWxzZSxcbiAgICAgIGFjY2VsZXJhdGlvbjogZmFsc2UsXG4gICAgICByb3RhdGlvblJhdGU6IGZhbHNlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE51bWJlciBvZiBsaXN0ZW5lcnMgc3Vic2NyaWJlZCB0byB0aGUgYERldmljZU1vdGlvbmAgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLl9udW1MaXN0ZW5lcnMgPSAwO1xuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZSBmdW5jdGlvbiBvZiB0aGUgbW9kdWxlJ3MgcHJvbWlzZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICogQHNlZSBEZXZpY2VNb3Rpb25Nb2R1bGUjaW5pdFxuICAgICAqL1xuICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlID0gbnVsbDtcbiAgICBcbiAgICAvKipcbiAgICAgKiBVbmlmeWluZyBmYWN0b3Igb2YgdGhlIG1vdGlvbiBkYXRhIHZhbHVlcyAoYDFgIG9uIEFuZHJvaWQsIGAtMWAgb24gaU9TKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5fdW5pZnlNb3Rpb25EYXRhID0gKHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycgPyAtMSA6IDEpO1xuXG4gICAgLyoqXG4gICAgICogVW5pZnlpbmcgZmFjdG9yIG9mIHRoZSBwZXJpb2QgKGAwLjAwMWAgb24gQW5kcm9pZCwgYDFgIG9uIGlPUykuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX3VuaWZ5UGVyaW9kID0gKHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ0FuZHJvaWQnID8gMC4wMDEgOiAxKTtcblxuICAgIC8qKlxuICAgICAqIEFjY2VsZXJhdGlvbiBjYWxjdWxhdGVkIGZyb20gdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb24gPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBUaW1lIGNvbnN0YW50IChoYWxmLWxpZmUpIG9mIHRoZSBoaWdoLXBhc3MgZmlsdGVyIHVzZWQgdG8gc21vb3RoIHRoZSBhY2NlbGVyYXRpb24gdmFsdWVzIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYWNjZWxlcmF0aW9uIGluY2x1ZGluZyBncmF2aXR5IHJhdyB2YWx1ZXMgKGluIHNlY29uZHMpLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAwLjFcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uVGltZUNvbnN0YW50ID0gMC4xO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWUsIHVzZWQgaW4gdGhlIGhpZ2gtcGFzcyBmaWx0ZXIgdG8gY2FsY3VsYXRlIHRoZSBhY2NlbGVyYXRpb24gKGlmIHRoZSBgYWNjZWxlcmF0aW9uYCB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSBgJ2RldmljZW1vdGlvbidgKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSA9IFswLCAwLCAwXTtcbiAgXG4gICAgLyoqXG4gICAgICogUm90YXRpb24gcmF0ZSBjYWxjdWxhdGVkIGZyb20gdGhlIG9yaWVudGF0aW9uIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IG9yaWVudGF0aW9uIHZhbHVlLCB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgcm90YXRpb24gcmF0ZSAgKGlmIHRoZSBgcm90YXRpb25SYXRlYCB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSBgJ2RldmljZW1vdGlvbidgKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb24gPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBMYXRlc3Qgb3JpZW50YXRpb24gdGltZXN0YW1wcywgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHJvdGF0aW9uIHJhdGUgKGlmIHRoZSBgcm90YXRpb25SYXRlYCB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSBgJ2RldmljZW1vdGlvbidgKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXAgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIGJpbmRpbmcgb2YgdGhlIHNlbnNvciBjaGVjay5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgKi9cbiAgICB0aGlzLl9kZXZpY2Vtb3Rpb25DaGVjayA9IHRoaXMuX2RldmljZW1vdGlvbkNoZWNrLmJpbmQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgYmluZGluZyBvZiB0aGUgYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBjYWxsYmFjay5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgKi9cbiAgICB0aGlzLl9kZXZpY2Vtb3Rpb25MaXN0ZW5lciA9IHRoaXMuX2RldmljZW1vdGlvbkxpc3RlbmVyLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogRGVjYXkgZmFjdG9yIG9mIHRoZSBoaWdoLXBhc3MgZmlsdGVyIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBhY2NlbGVyYXRpb24gZnJvbSB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHJhdyB2YWx1ZXMuXG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IF9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uRGVjYXkoKSB7XG4gICAgcmV0dXJuIE1hdGguZXhwKC0yICogTWF0aC5QSSAqIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5wZXJpb2QgLyB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uVGltZUNvbnN0YW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5zb3IgY2hlY2sgb24gaW5pdGlhbGl6YXRpb24gb2YgdGhlIG1vZHVsZS5cbiAgICogVGhpcyBtZXRob2Q6XG4gICAqIC0gY2hlY2tzIHdoZXRoZXIgdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCwgdGhlIGBhY2NlbGVyYXRpb25gLFxuICAgKiAgIGFuZCB0aGUgYHJvdGF0aW9uUmF0ZWAgdmFsdWVzIGFyZSB2YWxpZCBvciBub3Q7XG4gICAqIC0gZ2V0cyB0aGUgcGVyaW9kIG9mIHRoZSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGFuZCBzZXRzIHRoZSBwZXJpb2Qgb2ZcbiAgICogICB0aGUgYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCBgQWNjZWxlcmF0aW9uYCwgYW5kIGBSb3RhdGlvblJhdGVgXG4gICAqICAgc3VibW9kdWxlcztcbiAgICogLSAoaW4gdGhlIGNhc2Ugd2hlcmUgYWNjZWxlcmF0aW9uIHJhdyB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZClcbiAgICogICBpbmRpY2F0ZXMgd2hldGhlciB0aGUgYWNjZWxlcmF0aW9uIGNhbiBiZSBjYWxjdWxhdGVkIGZyb20gdGhlXG4gICAqICAgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIFRoZSBmaXJzdCBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGNhdWdodC5cbiAgICovXG4gIF9kZXZpY2Vtb3Rpb25DaGVjayhlKSB7XG4gICAgdGhpcy5pc1Byb3ZpZGVkID0gdHJ1ZTtcbiAgICB0aGlzLnBlcmlvZCA9IGUuaW50ZXJ2YWwgLyAxMDAwO1xuXG4gICAgLy8gU2Vuc29yIGF2YWlsYWJpbGl0eSBmb3IgdGhlIGFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eVxuICAgIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1Byb3ZpZGVkID0gKFxuICAgICAgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54ID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnkgPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueiA9PT0gJ251bWJlcicpXG4gICAgKTtcbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkucGVyaW9kID0gZS5pbnRlcnZhbCAqIHRoaXMuX3VuaWZ5UGVyaW9kO1xuXG4gICAgLy8gU2Vuc29yIGF2YWlsYWJpbGl0eSBmb3IgdGhlIGFjY2VsZXJhdGlvblxuICAgIHRoaXMuYWNjZWxlcmF0aW9uLmlzUHJvdmlkZWQgPSAoXG4gICAgICBlLmFjY2VsZXJhdGlvbiAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbi54ID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb24ueSA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uLnogPT09ICdudW1iZXInKVxuICAgICk7XG4gICAgdGhpcy5hY2NlbGVyYXRpb24ucGVyaW9kID0gZS5pbnRlcnZhbCAqIHRoaXMuX3VuaWZ5UGVyaW9kO1xuXG4gICAgLy8gU2Vuc29yIGF2YWlsYWJpbGl0eSBmb3IgdGhlIHJvdGF0aW9uIHJhdGVcbiAgICB0aGlzLnJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkID0gKFxuICAgICAgZS5yb3RhdGlvblJhdGUgJiZcbiAgICAgICh0eXBlb2YgZS5yb3RhdGlvblJhdGUuYWxwaGEgPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLnJvdGF0aW9uUmF0ZS5iZXRhID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5yb3RhdGlvblJhdGUuZ2FtbWEgPT09ICdudW1iZXInKVxuICAgICk7XG4gICAgdGhpcy5yb3RhdGlvblJhdGUucGVyaW9kID0gZS5pbnRlcnZhbCAqIHRoaXMuX3VuaWZ5UGVyaW9kO1xuXG4gICAgLy8gV2Ugb25seSBuZWVkIHRvIGxpc3RlbiB0byBvbmUgZXZlbnQgKD0+IHJlbW92ZSB0aGUgbGlzdGVuZXIpXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZW1vdGlvbicsIHRoaXMuX2RldmljZW1vdGlvbkNoZWNrLCBmYWxzZSk7XG5cbiAgICAvLyBJZiBhY2NlbGVyYXRpb24gaXMgbm90IHByb3ZpZGVkIGJ5IHJhdyBzZW5zb3JzLCBpbmRpY2F0ZSB3aGV0aGVyIGl0XG4gICAgLy8gY2FuIGJlIGNhbGN1bGF0ZWQgd2l0aCBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgb3Igbm90XG4gICAgaWYgKCF0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkKVxuICAgICAgdGhpcy5hY2NlbGVyYXRpb24uaXNDYWxjdWxhdGVkID0gdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzUHJvdmlkZWQ7XG5cbiAgICAvLyBXQVJOSU5HXG4gICAgLy8gVGhlIGxpbmVzIG9mIGNvZGUgYmVsb3cgYXJlIGNvbW1lbnRlZCBiZWNhdXNlIG9mIGEgYnVnIG9mIENocm9tZVxuICAgIC8vIG9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzLCB3aGVyZSAnZGV2aWNlbW90aW9uJyBldmVudHMgYXJlIG5vdCBzZW50XG4gICAgLy8gb3IgY2F1Z2h0IGlmIHRoZSBsaXN0ZW5lciBpcyBzZXQgdXAgYWZ0ZXIgYSAnZGV2aWNlb3JpZW50YXRpb24nXG4gICAgLy8gbGlzdGVuZXIuIEhlcmUsIHRoZSBfdHJ5T3JpZW50YXRpb25GYWxsYmFjayBtZXRob2Qgd291bGQgYWRkIGFcbiAgICAvLyAnZGV2aWNlb3JpZW50YXRpb24nIGxpc3RlbmVyIGFuZCBibG9jayBhbGwgc3Vic2VxdWVudCAnZGV2aWNlbW90aW9uJ1xuICAgIC8vIGV2ZW50cyBvbiB0aGVzZSBkZXZpY2VzLiBDb21tZW50cyB3aWxsIGJlIHJlbW92ZWQgb25jZSB0aGUgYnVnIG9mXG4gICAgLy8gQ2hyb21lIGlzIGNvcnJlY3RlZC5cblxuICAgIC8vIGlmICh0aGlzLnJlcXVpcmVkLnJvdGF0aW9uUmF0ZSAmJiAhdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZClcbiAgICAvLyAgIHRoaXMuX3RyeU9yaWVudGF0aW9uRmFsbGJhY2soKTtcbiAgICAvLyBlbHNlXG4gICAgdGhpcy5fcHJvbWlzZVJlc29sdmUodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBjYWxsYmFjay5cbiAgICogVGhpcyBtZXRob2QgZW1pdHMgYW4gZXZlbnQgd2l0aCB0aGUgcmF3IGAnZGV2aWNlbW90aW9uJ2AgdmFsdWVzLCBhbmQgZW1pdHNcbiAgICogZXZlbnRzIHdpdGggdGhlIHVuaWZpZWQgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCBgYWNjZWxlcmF0aW9uYCwgXG4gICAqIGFuZCAvIG9yIGByb3RhdGlvblJhdGVgIHZhbHVlcyBpZiB0aGV5IGFyZSByZXF1aXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2RldmljZW1vdGlvbkxpc3RlbmVyKGUpIHtcbiAgICAvLyAnZGV2aWNlbW90aW9uJyBldmVudCAocmF3IHZhbHVlcylcbiAgICB0aGlzLl9lbWl0RGV2aWNlTW90aW9uRXZlbnQoZSk7XG5cbiAgICAvLyAnYWNjZWxlcmF0aW9uJyBldmVudCAodW5pZmllZCB2YWx1ZXMpXG4gICAgaWYgKHRoaXMucmVxdWlyZWQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAmJiB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZClcbiAgICAgIHRoaXMuX2VtaXRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RXZlbnQoZSk7XG5cbiAgICAvLyAnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIGlmICh0aGlzLnJlcXVpcmVkLmFjY2VsZXJhdGlvbiAmJiB0aGlzLmFjY2VsZXJhdGlvbi5pc1ZhbGlkKSAvLyB0aGUgZmFsbGJhY2sgY2FsY3VsYXRpb24gb2YgdGhlIGFjY2VsZXJhdGlvbiBoYXBwZW5zIGluIHRoZSBgX2VtaXRBY2NlbGVyYXRpb25gIG1ldGhvZCwgc28gd2UgY2hlY2sgaWYgdGhpcy5hY2NlbGVyYXRpb24uaXNWYWxpZFxuICAgICAgdGhpcy5fZW1pdEFjY2VsZXJhdGlvbkV2ZW50KGUpO1xuXG4gICAgLy8gJ3JvdGF0aW9uUmF0ZScgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIGlmICh0aGlzLnJlcXVpcmVkLnJvdGF0aW9uUmF0ZSAmJiB0aGlzLnJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkKSAvLyB0aGUgZmFsbGJhY2sgY2FsY3VsYXRpb24gb2YgdGhlIHJvdGF0aW9uIHJhdGUgZG9lcyBOT1QgaGFwcGVuIGluIHRoZSBgX2VtaXRSb3RhdGlvblJhdGVgIG1ldGhvZCwgc28gd2Ugb25seSBjaGVjayBpZiB0aGlzLnJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkXG4gICAgICB0aGlzLl9lbWl0Um90YXRpb25SYXRlRXZlbnQoZSk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIGAnZGV2aWNlbW90aW9uJ2AgcmF3IHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2VtaXREZXZpY2VNb3Rpb25FdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5ldmVudDtcblxuICAgIGlmIChlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpIHtcbiAgICAgIG91dEV2ZW50WzBdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lng7XG4gICAgICBvdXRFdmVudFsxXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55O1xuICAgICAgb3V0RXZlbnRbMl0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuejtcbiAgICB9XG5cbiAgICBpZiAoZS5hY2NlbGVyYXRpb24pIHtcbiAgICAgIG91dEV2ZW50WzNdID0gZS5hY2NlbGVyYXRpb24ueDtcbiAgICAgIG91dEV2ZW50WzRdID0gZS5hY2NlbGVyYXRpb24ueTtcbiAgICAgIG91dEV2ZW50WzVdID0gZS5hY2NlbGVyYXRpb24uejtcbiAgICB9XG5cbiAgICBpZiAoZS5yb3RhdGlvblJhdGUpIHtcbiAgICAgIG91dEV2ZW50WzZdID0gZS5yb3RhdGlvblJhdGUuYWxwaGE7XG4gICAgICBvdXRFdmVudFs3XSA9IGUucm90YXRpb25SYXRlLmJldGE7XG4gICAgICBvdXRFdmVudFs4XSA9IGUucm90YXRpb25SYXRlLmdhbW1hO1xuICAgIH1cblxuICAgIHRoaXMuZW1pdChvdXRFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2VtaXRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RXZlbnQoZSkge1xuICAgIGxldCBvdXRFdmVudCA9IHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5ldmVudDtcblxuICAgIG91dEV2ZW50WzBdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnggKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgb3V0RXZlbnRbMV0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueSAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICBvdXRFdmVudFsyXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuXG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmVtaXQob3V0RXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBgYWNjZWxlcmF0aW9uYCB1bmlmaWVkIHZhbHVlcy5cbiAgICogV2hlbiB0aGUgYGFjY2VsZXJhdGlvbmAgcmF3IHZhbHVlcyBhcmUgbm90IGF2YWlsYWJsZSwgdGhlIG1ldGhvZFxuICAgKiBhbHNvIGNhbGN1bGF0ZXMgdGhlIGFjY2VsZXJhdGlvbiBmcm9tIHRoZVxuICAgKiBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIFRoZSBgJ2RldmljZW1vdGlvbidgIGV2ZW50LlxuICAgKi9cbiAgX2VtaXRBY2NlbGVyYXRpb25FdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5hY2NlbGVyYXRpb24uZXZlbnQ7XG5cbiAgICBpZiAodGhpcy5hY2NlbGVyYXRpb24uaXNQcm92aWRlZCkge1xuICAgICAgLy8gSWYgcmF3IGFjY2VsZXJhdGlvbiB2YWx1ZXMgYXJlIHByb3ZpZGVkXG4gICAgICBvdXRFdmVudFswXSA9IGUuYWNjZWxlcmF0aW9uLnggKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgICBvdXRFdmVudFsxXSA9IGUuYWNjZWxlcmF0aW9uLnkgKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGUuYWNjZWxlcmF0aW9uLnogKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgfSBlbHNlIGlmICh0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZCkge1xuICAgICAgLy8gT3RoZXJ3aXNlLCBpZiBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IHZhbHVlcyBhcmUgcHJvdmlkZWQsXG4gICAgICAvLyBlc3RpbWF0ZSB0aGUgYWNjZWxlcmF0aW9uIHdpdGggYSBoaWdoLXBhc3MgZmlsdGVyXG4gICAgICBjb25zdCBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ID0gW1xuICAgICAgICBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YSxcbiAgICAgICAgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnkgKiB0aGlzLl91bmlmeU1vdGlvbkRhdGEsXG4gICAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhXG4gICAgICBdO1xuICAgICAgY29uc3QgayA9IHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25EZWNheTtcblxuICAgICAgLy8gSGlnaC1wYXNzIGZpbHRlciB0byBlc3RpbWF0ZSB0aGUgYWNjZWxlcmF0aW9uICh3aXRob3V0IHRoZSBncmF2aXR5KVxuICAgICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblswXSA9ICgxICsgaykgKiAwLjUgKiBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdIC0gKDEgKyBrKSAqIDAuNSAqIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMF07XG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzFdID0gKDEgKyBrKSAqIDAuNSAqIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV0gLSAoMSArIGspICogMC41ICogdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV0gKyBrICogdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsxXTtcbiAgICAgIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMl0gPSAoMSArIGspICogMC41ICogYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXSAtICgxICsgaykgKiAwLjUgKiB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXSArIGsgKiB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzJdO1xuXG4gICAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXSA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF07XG4gICAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXSA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV07XG4gICAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXSA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl07XG5cbiAgICAgIG91dEV2ZW50WzBdID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblswXTtcbiAgICAgIG91dEV2ZW50WzFdID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsxXTtcbiAgICAgIG91dEV2ZW50WzJdID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsyXTtcbiAgICB9XG5cbiAgICB0aGlzLmFjY2VsZXJhdGlvbi5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYHJvdGF0aW9uUmF0ZWAgdW5pZmllZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICovXG4gIF9lbWl0Um90YXRpb25SYXRlRXZlbnQoZSkge1xuICAgIGxldCBvdXRFdmVudCA9IHRoaXMucm90YXRpb25SYXRlLmV2ZW50O1xuXG4gICAgb3V0RXZlbnRbMF0gPSBlLnJvdGF0aW9uUmF0ZS5hbHBoYTtcbiAgICBvdXRFdmVudFsxXSA9IGUucm90YXRpb25SYXRlLmJldGE7XG4gICAgb3V0RXZlbnRbMl0gPSBlLnJvdGF0aW9uUmF0ZS5nYW1tYTtcblxuICAgIC8vIFRPRE8oPyk6IHVuaWZ5XG5cbiAgICB0aGlzLnJvdGF0aW9uUmF0ZS5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGFuZCBlbWl0cyB0aGUgYHJvdGF0aW9uUmF0ZWAgdW5pZmllZCB2YWx1ZXMgZnJvbSB0aGUgYG9yaWVudGF0aW9uYCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyW119IG9yaWVudGF0aW9uIC0gTGF0ZXN0IGBvcmllbnRhdGlvbmAgcmF3IHZhbHVlcy5cbiAgICovXG4gIF9jYWxjdWxhdGVSb3RhdGlvblJhdGVGcm9tT3JpZW50YXRpb24ob3JpZW50YXRpb24pIHtcbiAgICBjb25zdCBub3cgPSBnZXRMb2NhbFRpbWUoKTtcbiAgICBjb25zdCBrID0gMC44OyAvLyBUT0RPOiBpbXByb3ZlIGxvdyBwYXNzIGZpbHRlciAoZnJhbWVzIGFyZSBub3QgcmVndWxhcilcbiAgICBjb25zdCBhbHBoYUlzVmFsaWQgPSAodHlwZW9mIG9yaWVudGF0aW9uWzBdID09PSAnbnVtYmVyJyk7XG5cbiAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wKSB7XG4gICAgICBsZXQgckFscGhhID0gbnVsbDtcbiAgICAgIGxldCByQmV0YTtcbiAgICAgIGxldCByR2FtbWE7XG5cbiAgICAgIGxldCBhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAwO1xuICAgICAgbGV0IGJldGFEaXNjb250aW51aXR5RmFjdG9yID0gMDtcbiAgICAgIGxldCBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAwO1xuXG4gICAgICBjb25zdCBkZWx0YVQgPSBub3cgLSB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXA7XG5cbiAgICAgIGlmIChhbHBoYUlzVmFsaWQpIHtcbiAgICAgICAgLy8gYWxwaGEgZGlzY29udGludWl0eSAoKzM2MCAtPiAwIG9yIDAgLT4gKzM2MClcbiAgICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSA+IDMyMCAmJiBvcmllbnRhdGlvblswXSA8IDQwKVxuICAgICAgICAgIGFscGhhRGlzY29udGludWl0eUZhY3RvciA9IDM2MDtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdIDwgNDAgJiYgb3JpZW50YXRpb25bMF0gPiAzMjApXG4gICAgICAgICAgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yID0gLTM2MDtcbiAgICAgIH1cblxuICAgICAgLy8gYmV0YSBkaXNjb250aW51aXR5ICgrMTgwIC0+IC0xODAgb3IgLTE4MCAtPiArMTgwKVxuICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSA+IDE0MCAmJiBvcmllbnRhdGlvblsxXSA8IC0xNDApXG4gICAgICAgIGJldGFEaXNjb250aW51aXR5RmFjdG9yID0gMzYwO1xuICAgICAgZWxzZSBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzFdIDwgLTE0MCAmJiBvcmllbnRhdGlvblsxXSA+IDE0MClcbiAgICAgICAgYmV0YURpc2NvbnRpbnVpdHlGYWN0b3IgPSAtMzYwO1xuXG4gICAgICAvLyBnYW1tYSBkaXNjb250aW51aXRpZXMgKCsxODAgLT4gLTE4MCBvciAtMTgwIC0+ICsxODApXG4gICAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdID4gNTAgJiYgb3JpZW50YXRpb25bMl0gPCAtNTApXG4gICAgICAgIGdhbW1hRGlzY29udGludWl0eUZhY3RvciA9IDE4MDtcbiAgICAgIGVsc2UgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSA8IC01MCAmJiBvcmllbnRhdGlvblsyXSA+IDUwKVxuICAgICAgICBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAtMTgwO1xuXG4gICAgICBpZiAoZGVsdGFUID4gMCkge1xuICAgICAgICAvLyBMb3cgcGFzcyBmaWx0ZXIgdG8gc21vb3RoIHRoZSBkYXRhXG4gICAgICAgIGlmIChhbHBoYUlzVmFsaWQpXG4gICAgICAgICAgckFscGhhID0gayAqIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMF0gKyAoMSAtIGspICogKG9yaWVudGF0aW9uWzBdIC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdICsgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcbiAgICAgICAgckJldGEgPSBrICogdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVsxXSArICgxIC0gaykgKiAob3JpZW50YXRpb25bMV0gLSB0aGlzLl9sYXN0T3JpZW50YXRpb25bMV0gKyBiZXRhRGlzY29udGludWl0eUZhY3RvcikgLyBkZWx0YVQ7XG4gICAgICAgIHJHYW1tYSA9IGsgKiB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzJdICsgKDEgLSBrKSAqIChvcmllbnRhdGlvblsyXSAtIHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSArIGdhbW1hRGlzY29udGludWl0eUZhY3RvcikgLyBkZWx0YVQ7XG5cbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVswXSA9IHJBbHBoYTtcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVsxXSA9IHJCZXRhO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzJdID0gckdhbW1hO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPOiByZXNhbXBsZSB0aGUgZW1pc3Npb24gcmF0ZSB0byBtYXRjaCB0aGUgZGV2aWNlbW90aW9uIHJhdGVcbiAgICAgIHRoaXMucm90YXRpb25SYXRlLmVtaXQodGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wID0gbm93O1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSA9IG9yaWVudGF0aW9uWzBdO1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSA9IG9yaWVudGF0aW9uWzFdO1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSA9IG9yaWVudGF0aW9uWzJdO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSByb3RhdGlvbiByYXRlIGNhbiBiZSBjYWxjdWxhdGVkIGZyb20gdGhlIGBvcmllbnRhdGlvbmAgdmFsdWVzIG9yIG5vdC5cbiAgICovXG4gIF90cnlPcmllbnRhdGlvbkZhbGxiYWNrKCkge1xuICAgIE1vdGlvbklucHV0LnJlcXVpcmVNb2R1bGUoJ29yaWVudGF0aW9uJylcbiAgICAgIC50aGVuKChvcmllbnRhdGlvbikgPT4ge1xuICAgICAgICBpZiAob3JpZW50YXRpb24uaXNWYWxpZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiV0FSTklORyAobW90aW9uLWlucHV0KTogVGhlICdkZXZpY2Vtb3Rpb24nIGV2ZW50IGRvZXMgbm90IGV4aXN0cyBvciBkb2VzIG5vdCBwcm92aWRlIHJvdGF0aW9uIHJhdGUgdmFsdWVzIGluIHlvdXIgYnJvd3Nlciwgc28gdGhlIHJvdGF0aW9uIHJhdGUgb2YgdGhlIGRldmljZSBpcyBlc3RpbWF0ZWQgZnJvbSB0aGUgJ29yaWVudGF0aW9uJywgY2FsY3VsYXRlZCBmcm9tIHRoZSAnZGV2aWNlb3JpZW50YXRpb24nIGV2ZW50LiBTaW5jZSB0aGUgY29tcGFzcyBtaWdodCBub3QgYmUgYXZhaWxhYmxlLCBvbmx5IGBiZXRhYCBhbmQgYGdhbW1hYCBhbmdsZXMgbWF5IGJlIHByb3ZpZGVkIChgYWxwaGFgIHdvdWxkIGJlIG51bGwpLlwiKTtcblxuICAgICAgICAgIHRoaXMucm90YXRpb25SYXRlLmlzQ2FsY3VsYXRlZCA9IHRydWU7XG5cbiAgICAgICAgICBNb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcignb3JpZW50YXRpb24nLCAob3JpZW50YXRpb24pID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVJvdGF0aW9uUmF0ZUZyb21PcmllbnRhdGlvbihvcmllbnRhdGlvbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSh0aGlzKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEluY3JlYXNlcyB0aGUgbnVtYmVyIG9mIGxpc3RlbmVycyB0byB0aGlzIG1vZHVsZSAoZWl0aGVyIGJlY2F1c2Ugc29tZW9uZSBsaXN0ZW5zXG4gICAqIHRvIHRoaXMgbW9kdWxlLCBvciBvbmUgb2YgdGhlIHRocmVlIGBET01FdmVudFN1Ym1vZHVsZXNgXG4gICAqIChgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIGBBY2NlbGVyYXRpb25gLCBgUm90YXRpb25SYXRlYCkuXG4gICAqIFdoZW4gdGhlIG51bWJlciBvZiBsaXN0ZW5lcnMgcmVhY2hlcyBgMWAsIGFkZHMgYSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGxpc3RlbmVyLlxuICAgKlxuICAgKiBAc2VlIERldmljZU1vdGlvbk1vZHVsZSNhZGRMaXN0ZW5lclxuICAgKiBAc2VlIERPTUV2ZW50U3VibW9kdWxlI3N0YXJ0XG4gICAqL1xuICBfYWRkTGlzdGVuZXIoKSB7XG4gICAgdGhpcy5fbnVtTGlzdGVuZXJzKys7XG5cbiAgICBpZiAodGhpcy5fbnVtTGlzdGVuZXJzID09PSAxKVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW1vdGlvbicsIHRoaXMuX2RldmljZW1vdGlvbkxpc3RlbmVyLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogRGVjcmVhc2VzIHRoZSBudW1iZXIgb2YgbGlzdGVuZXJzIHRvIHRoaXMgbW9kdWxlIChlaXRoZXIgYmVjYXVzZSBzb21lb25lIHN0b3BzXG4gICAqIGxpc3RlbmluZyB0byB0aGlzIG1vZHVsZSwgb3Igb25lIG9mIHRoZSB0aHJlZSBgRE9NRXZlbnRTdWJtb2R1bGVzYFxuICAgKiAoYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCBgQWNjZWxlcmF0aW9uYCwgYFJvdGF0aW9uUmF0ZWApLlxuICAgKiBXaGVuIHRoZSBudW1iZXIgb2YgbGlzdGVuZXJzIHJlYWNoZXMgYDBgLCByZW1vdmVzIHRoZSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGxpc3RlbmVyLlxuICAgKlxuICAgKiBAc2VlIERldmljZU1vdGlvbk1vZHVsZSNyZW1vdmVMaXN0ZW5lclxuICAgKiBAc2VlIERPTUV2ZW50U3VibW9kdWxlI3N0b3BcbiAgICovXG4gIF9yZW1vdmVMaXN0ZW5lcigpIHtcbiAgICB0aGlzLl9udW1MaXN0ZW5lcnMtLTtcblxuICAgIGlmICh0aGlzLl9udW1MaXN0ZW5lcnMgPT09IDApXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgdGhpcy5fZGV2aWNlbW90aW9uTGlzdGVuZXIsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtwcm9taXNlfVxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gc3VwZXIuaW5pdCgocmVzb2x2ZSkgPT4ge1xuICAgICAgdGhpcy5fcHJvbWlzZVJlc29sdmUgPSByZXNvbHZlO1xuXG4gICAgICBpZiAod2luZG93LkRldmljZU1vdGlvbkV2ZW50KVxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2ssIGZhbHNlKTtcblxuICAgICAgLy8gV0FSTklOR1xuICAgICAgLy8gVGhlIGxpbmVzIG9mIGNvZGUgYmVsb3cgYXJlIGNvbW1lbnRlZCBiZWNhdXNlIG9mIGEgYnVnIG9mIENocm9tZVxuICAgICAgLy8gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHdoZXJlICdkZXZpY2Vtb3Rpb24nIGV2ZW50cyBhcmUgbm90IHNlbnRcbiAgICAgIC8vIG9yIGNhdWdodCBpZiB0aGUgbGlzdGVuZXIgaXMgc2V0IHVwIGFmdGVyIGEgJ2RldmljZW9yaWVudGF0aW9uJ1xuICAgICAgLy8gbGlzdGVuZXIuIEhlcmUsIHRoZSBfdHJ5T3JpZW50YXRpb25GYWxsYmFjayBtZXRob2Qgd291bGQgYWRkIGFcbiAgICAgIC8vICdkZXZpY2VvcmllbnRhdGlvbicgbGlzdGVuZXIgYW5kIGJsb2NrIGFsbCBzdWJzZXF1ZW50ICdkZXZpY2Vtb3Rpb24nXG4gICAgICAvLyBldmVudHMgb24gdGhlc2UgZGV2aWNlcy4gQ29tbWVudHMgd2lsbCBiZSByZW1vdmVkIG9uY2UgdGhlIGJ1ZyBvZlxuICAgICAgLy8gQ2hyb21lIGlzIGNvcnJlY3RlZC5cblxuICAgICAgLy8gZWxzZSBpZiAodGhpcy5yZXF1aXJlZC5yb3RhdGlvblJhdGUpXG4gICAgICAvLyB0aGlzLl90cnlPcmllbnRhdGlvbkZhbGxiYWNrKCk7XG5cbiAgICAgIGVsc2VcbiAgICAgICAgcmVzb2x2ZSh0aGlzKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdG8gdGhpcyBtb2R1bGUuXG4gICAqIFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIHRvIGFkZC5cbiAgICovXG4gIGFkZExpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgc3VwZXIuYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgIHRoaXMuX2FkZExpc3RlbmVyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZyb20gdGhpcyBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIC0gTGlzdGVuZXIgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICBzdXBlci5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEZXZpY2VNb3Rpb25Nb2R1bGUoKTsiXX0=