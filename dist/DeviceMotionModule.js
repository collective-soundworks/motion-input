'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileoverview `DeviceMotion` module
 * @author <a href='mailto:sebastien@robaszkiewicz.com'>Sébastien Robaszkiewicz</a>, <a href='mailto:Norbert.Schnell@ircam.fr'>Norbert Schnell</a>
 */

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

var DeviceMotionModule = function (_InputModule) {
  _inherits(DeviceMotionModule, _InputModule);

  /**
   * Creates the `DeviceMotion` module instance.
   *
   * @constructor
   */
  function DeviceMotionModule() {
    _classCallCheck(this, DeviceMotionModule);

    /**
     * Raw values coming from the `devicemotion` event sent by this module.
     *
     * @this DeviceMotionModule
     * @type {number[]}
     * @default [null, null, null, null, null, null, null, null, null]
     */
    var _this = _possibleConstructorReturn(this, (DeviceMotionModule.__proto__ || Object.getPrototypeOf(DeviceMotionModule)).call(this, 'devicemotion'));

    _this.event = [null, null, null, null, null, null, null, null, null];

    /**
     * The `AccelerationIncludingGravity` module.
     * Provides unified values of the acceleration including gravity.
     *
     * @this DeviceMotionModule
     * @type {DOMEventSubmodule}
     */
    _this.accelerationIncludingGravity = new DOMEventSubmodule(_this, 'accelerationIncludingGravity');

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
    _this.acceleration = new DOMEventSubmodule(_this, 'acceleration');

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
    _this.rotationRate = new DOMEventSubmodule(_this, 'rotationRate');

    /**
     * Required submodules / events.
     *
     * @this DeviceMotionModule
     * @type {object}
     * @property {bool} accelerationIncludingGravity - Indicates whether the `accelerationIncludingGravity` unified values are required or not (defaults to `false`).
     * @property {bool} acceleration - Indicates whether the `acceleration` unified values are required or not (defaults to `false`).
     * @property {bool} rotationRate - Indicates whether the `rotationRate` unified values are required or not (defaults to `false`).
     */
    _this.required = {
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
    _this._numListeners = 0;

    /**
     * Resolve function of the module's promise.
     *
     * @this DeviceMotionModule
     * @type {function}
     * @default null
     * @see DeviceMotionModule#init
     */
    _this._promiseResolve = null;

    /**
     * Unifying factor of the motion data values (`1` on Android, `-1` on iOS).
     *
     * @this DeviceMotionModule
     * @type {number}
     */
    _this._unifyMotionData = platform.os.family === 'iOS' ? -1 : 1;

    /**
     * Unifying factor of the period (`0.001` on Android, `1` on iOS).
     *
     * @this DeviceMotionModule
     * @type {number}
     */
    _this._unifyPeriod = platform.os.family === 'Android' ? 0.001 : 1;

    /**
     * Acceleration calculated from the `accelerationIncludingGravity` raw values.
     *
     * @this DeviceMotionModule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    _this._calculatedAcceleration = [0, 0, 0];

    /**
     * Time constant (half-life) of the high-pass filter used to smooth the acceleration values calculated from the acceleration including gravity raw values (in seconds).
     *
     * @this DeviceMotionModule
     * @type {number}
     * @default 0.1
     * @constant
     */
    _this._calculatedAccelerationTimeConstant = 0.1;

    /**
     * Latest `accelerationIncludingGravity` raw value, used in the high-pass filter to calculate the acceleration (if the `acceleration` values are not provided by `'devicemotion'`).
     *
     * @this DeviceMotionModule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    _this._lastAccelerationIncludingGravity = [0, 0, 0];

    /**
     * Rotation rate calculated from the orientation values.
     *
     * @this DeviceMotionModule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    _this._calculatedRotationRate = [0, 0, 0];

    /**
     * Latest orientation value, used to calculate the rotation rate  (if the `rotationRate` values are not provided by `'devicemotion'`).
     *
     * @this DeviceMotionModule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    _this._lastOrientation = [0, 0, 0];

    /**
     * Latest orientation timestamps, used to calculate the rotation rate (if the `rotationRate` values are not provided by `'devicemotion'`).
     *
     * @this DeviceMotionModule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    _this._lastOrientationTimestamp = null;

    /**
     * Method binding of the sensor check.
     *
     * @this DeviceMotionModule
     * @type {function}
     */
    _this._devicemotionCheck = _this._devicemotionCheck.bind(_this);

    /**
     * Method binding of the `'devicemotion'` event callback.
     *
     * @this DeviceMotionModule
     * @type {function}
     */
    _this._devicemotionListener = _this._devicemotionListener.bind(_this);
    return _this;
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
        this._calculatedAcceleration[0] = (1 + k) * 0.5 * (accelerationIncludingGravity[0] - this._lastAccelerationIncludingGravity[0]) + k * this._calculatedAcceleration[0];
        this._calculatedAcceleration[1] = (1 + k) * 0.5 * (accelerationIncludingGravity[1] - this._lastAccelerationIncludingGravity[1]) + k * this._calculatedAcceleration[1];
        this._calculatedAcceleration[2] = (1 + k) * 0.5 * (accelerationIncludingGravity[2] - this._lastAccelerationIncludingGravity[2]) + k * this._calculatedAcceleration[2];

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
        var rBeta = void 0;
        var rGamma = void 0;

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
      var _this2 = this;

      MotionInput.requireModule('orientation').then(function (orientation) {
        if (orientation.isValid) {
          console.log("WARNING (motion-input): The 'devicemotion' event does not exists or does not provide rotation rate values in your browser, so the rotation rate of the device is estimated from the 'orientation', calculated from the 'deviceorientation' event. Since the compass might not be available, only `beta` and `gamma` angles may be provided (`alpha` would be null).");

          _this2.rotationRate.isCalculated = true;

          MotionInput.addListener('orientation', function (orientation) {
            _this2._calculateRotationRateFromOrientation(orientation);
          });
        }

        _this2._promiseResolve(_this2);
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
      var _this3 = this;

      return _get(DeviceMotionModule.prototype.__proto__ || Object.getPrototypeOf(DeviceMotionModule.prototype), 'init', this).call(this, function (resolve) {
        _this3._promiseResolve = resolve;

        if (window.DeviceMotionEvent) window.addEventListener('devicemotion', _this3._devicemotionCheck, false);

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

        else resolve(_this3);
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
      _get(DeviceMotionModule.prototype.__proto__ || Object.getPrototypeOf(DeviceMotionModule.prototype), 'addListener', this).call(this, listener);
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
      _get(DeviceMotionModule.prototype.__proto__ || Object.getPrototypeOf(DeviceMotionModule.prototype), 'removeListener', this).call(this, listener);
      this._removeListener();
    }
  }, {
    key: '_calculatedAccelerationDecay',
    get: function get() {
      return Math.exp(-2 * Math.PI * this.accelerationIncludingGravity.period / this._calculatedAccelerationTimeConstant);
    }
  }]);

  return DeviceMotionModule;
}(InputModule);

module.exports = new DeviceMotionModule();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRldmljZU1vdGlvbk1vZHVsZS5qcyJdLCJuYW1lcyI6WyJJbnB1dE1vZHVsZSIsInJlcXVpcmUiLCJET01FdmVudFN1Ym1vZHVsZSIsIk1vdGlvbklucHV0IiwicGxhdGZvcm0iLCJnZXRMb2NhbFRpbWUiLCJ3aW5kb3ciLCJwZXJmb3JtYW5jZSIsIm5vdyIsIkRhdGUiLCJEZXZpY2VNb3Rpb25Nb2R1bGUiLCJldmVudCIsImFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkiLCJhY2NlbGVyYXRpb24iLCJyb3RhdGlvblJhdGUiLCJyZXF1aXJlZCIsIl9udW1MaXN0ZW5lcnMiLCJfcHJvbWlzZVJlc29sdmUiLCJfdW5pZnlNb3Rpb25EYXRhIiwib3MiLCJmYW1pbHkiLCJfdW5pZnlQZXJpb2QiLCJfY2FsY3VsYXRlZEFjY2VsZXJhdGlvbiIsIl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uVGltZUNvbnN0YW50IiwiX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IiwiX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGUiLCJfbGFzdE9yaWVudGF0aW9uIiwiX2xhc3RPcmllbnRhdGlvblRpbWVzdGFtcCIsIl9kZXZpY2Vtb3Rpb25DaGVjayIsImJpbmQiLCJfZGV2aWNlbW90aW9uTGlzdGVuZXIiLCJlIiwiaXNQcm92aWRlZCIsInBlcmlvZCIsImludGVydmFsIiwieCIsInkiLCJ6IiwiYWxwaGEiLCJiZXRhIiwiZ2FtbWEiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiaXNDYWxjdWxhdGVkIiwiX2VtaXREZXZpY2VNb3Rpb25FdmVudCIsImlzVmFsaWQiLCJfZW1pdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlFdmVudCIsIl9lbWl0QWNjZWxlcmF0aW9uRXZlbnQiLCJfZW1pdFJvdGF0aW9uUmF0ZUV2ZW50Iiwib3V0RXZlbnQiLCJlbWl0IiwiayIsIl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uRGVjYXkiLCJvcmllbnRhdGlvbiIsImFscGhhSXNWYWxpZCIsInJBbHBoYSIsInJCZXRhIiwickdhbW1hIiwiYWxwaGFEaXNjb250aW51aXR5RmFjdG9yIiwiYmV0YURpc2NvbnRpbnVpdHlGYWN0b3IiLCJnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IiLCJkZWx0YVQiLCJyZXF1aXJlTW9kdWxlIiwidGhlbiIsImNvbnNvbGUiLCJsb2ciLCJhZGRMaXN0ZW5lciIsIl9jYWxjdWxhdGVSb3RhdGlvblJhdGVGcm9tT3JpZW50YXRpb24iLCJhZGRFdmVudExpc3RlbmVyIiwicmVzb2x2ZSIsIkRldmljZU1vdGlvbkV2ZW50IiwibGlzdGVuZXIiLCJfYWRkTGlzdGVuZXIiLCJfcmVtb3ZlTGlzdGVuZXIiLCJNYXRoIiwiZXhwIiwiUEkiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7QUFLQSxJQUFNQSxjQUFjQyxRQUFRLGVBQVIsQ0FBcEI7QUFDQSxJQUFNQyxvQkFBb0JELFFBQVEscUJBQVIsQ0FBMUI7QUFDQSxJQUFNRSxjQUFjRixRQUFRLGVBQVIsQ0FBcEI7QUFDQSxJQUFNRyxXQUFXSCxRQUFRLFVBQVIsQ0FBakI7O0FBRUE7Ozs7OztBQU1BLFNBQVNJLFlBQVQsR0FBd0I7QUFDdEIsTUFBSUMsT0FBT0MsV0FBWCxFQUNFLE9BQU9ELE9BQU9DLFdBQVAsQ0FBbUJDLEdBQW5CLEtBQTJCLElBQWxDO0FBQ0YsU0FBT0MsS0FBS0QsR0FBTCxLQUFhLElBQXBCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUJNRSxrQjs7O0FBRUo7Ozs7O0FBS0EsZ0NBQWM7QUFBQTs7QUFHWjs7Ozs7OztBQUhZLHdJQUNOLGNBRE07O0FBVVosVUFBS0MsS0FBTCxHQUFhLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLElBQS9CLEVBQXFDLElBQXJDLEVBQTJDLElBQTNDLEVBQWlELElBQWpELENBQWI7O0FBRUE7Ozs7Ozs7QUFPQSxVQUFLQyw0QkFBTCxH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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFiQSxhQWdCRXdDO0FBQ0gsT0FwQkQ7QUFxQkQ7O0FBRUQ7Ozs7Ozs7O2dDQUtZRSxRLEVBQVU7QUFDcEIsMElBQWtCQSxRQUFsQjtBQUNBLFdBQUtDLFlBQUw7QUFDRDs7QUFFRDs7Ozs7Ozs7bUNBS2VELFEsRUFBVTtBQUN2Qiw2SUFBcUJBLFFBQXJCO0FBQ0EsV0FBS0UsZUFBTDtBQUNEOzs7d0JBM1drQztBQUNqQyxhQUFPQyxLQUFLQyxHQUFMLENBQVMsQ0FBQyxDQUFELEdBQUtELEtBQUtFLEVBQVYsR0FBZSxLQUFLL0QsNEJBQUwsQ0FBa0NxQixNQUFqRCxHQUEwRCxLQUFLVixtQ0FBeEUsQ0FBUDtBQUNEOzs7O0VBckw4QnZCLFc7O0FBaWlCakM0RSxPQUFPQyxPQUFQLEdBQWlCLElBQUluRSxrQkFBSixFQUFqQiIsImZpbGUiOiJEZXZpY2VNb3Rpb25Nb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgYERldmljZU1vdGlvbmAgbW9kdWxlXG4gKiBAYXV0aG9yIDxhIGhyZWY9J21haWx0bzpzZWJhc3RpZW5Acm9iYXN6a2lld2ljei5jb20nPlPDqWJhc3RpZW4gUm9iYXN6a2lld2ljejwvYT4sIDxhIGhyZWY9J21haWx0bzpOb3JiZXJ0LlNjaG5lbGxAaXJjYW0uZnInPk5vcmJlcnQgU2NobmVsbDwvYT5cbiAqL1xuXG5jb25zdCBJbnB1dE1vZHVsZSA9IHJlcXVpcmUoJy4vSW5wdXRNb2R1bGUnKTtcbmNvbnN0IERPTUV2ZW50U3VibW9kdWxlID0gcmVxdWlyZSgnLi9ET01FdmVudFN1Ym1vZHVsZScpO1xuY29uc3QgTW90aW9uSW5wdXQgPSByZXF1aXJlKCcuL01vdGlvbklucHV0Jyk7XG5jb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoJ3BsYXRmb3JtJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgY3VycmVudCBsb2NhbCB0aW1lIGluIHNlY29uZHMuXG4gKiBVc2VzIGB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClgIGlmIGF2YWlsYWJsZSwgYW5kIGBEYXRlLm5vdygpYCBvdGhlcndpc2UuXG4gKlxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBnZXRMb2NhbFRpbWUoKSB7XG4gIGlmICh3aW5kb3cucGVyZm9ybWFuY2UpXG4gICAgcmV0dXJuIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAvIDEwMDA7XG4gIHJldHVybiBEYXRlLm5vdygpIC8gMTAwMDtcbn1cblxuLyoqXG4gKiBgRGV2aWNlTW90aW9uYCBtb2R1bGUgc2luZ2xldG9uLlxuICogVGhlIGBEZXZpY2VNb3Rpb25Nb2R1bGVgIHNpbmdsZXRvbiBwcm92aWRlcyB0aGUgcmF3IHZhbHVlc1xuICogb2YgdGhlIGFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eSwgYWNjZWxlcmF0aW9uLCBhbmQgcm90YXRpb25cbiAqIHJhdGUgcHJvdmlkZWQgYnkgdGhlIGBEZXZpY2VNb3Rpb25gIGV2ZW50LlxuICogSXQgYWxzbyBpbnN0YW50aWF0ZSB0aGUgYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLFxuICogYEFjY2VsZXJhdGlvbmAgYW5kIGBSb3RhdGlvblJhdGVgIHN1Ym1vZHVsZXMgdGhhdCB1bmlmeSB0aG9zZSB2YWx1ZXNcbiAqIGFjcm9zcyBwbGF0Zm9ybXMgYnkgbWFraW5nIHRoZW0gY29tcGxpYW50IHdpdGgge0BsaW5rXG4gKiBodHRwOi8vd3d3LnczLm9yZy9UUi9vcmllbnRhdGlvbi1ldmVudC98dGhlIFczQyBzdGFuZGFyZH0uXG4gKiBXaGVuIHJhdyB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSB0aGUgc2Vuc29ycywgdGhpcyBtb2R1bGVzIHRyaWVzXG4gKiB0byByZWNhbGN1bGF0ZSB0aGVtIGZyb20gYXZhaWxhYmxlIHZhbHVlczpcbiAqIC0gYGFjY2VsZXJhdGlvbmAgaXMgY2FsY3VsYXRlZCBmcm9tIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YFxuICogICB3aXRoIGEgaGlnaC1wYXNzIGZpbHRlcjtcbiAqIC0gKGNvbWluZyBzb29uIOKAlCB3YWl0aW5nIGZvciBhIGJ1ZyBvbiBDaHJvbWUgdG8gYmUgcmVzb2x2ZWQpXG4gKiAgIGByb3RhdGlvblJhdGVgIGlzIGNhbGN1bGF0ZWQgZnJvbSBgb3JpZW50YXRpb25gLlxuICpcbiAqIEBjbGFzcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAqIEBleHRlbmRzIElucHV0TW9kdWxlXG4gKi9cbmNsYXNzIERldmljZU1vdGlvbk1vZHVsZSBleHRlbmRzIElucHV0TW9kdWxlIHtcblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgYERldmljZU1vdGlvbmAgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCdkZXZpY2Vtb3Rpb24nKTtcblxuICAgIC8qKlxuICAgICAqIFJhdyB2YWx1ZXMgY29taW5nIGZyb20gdGhlIGBkZXZpY2Vtb3Rpb25gIGV2ZW50IHNlbnQgYnkgdGhpcyBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgW251bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGxdXG4gICAgICovXG4gICAgdGhpcy5ldmVudCA9IFtudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgbW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIHVuaWZpZWQgdmFsdWVzIG9mIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ID0gbmV3IERPTUV2ZW50U3VibW9kdWxlKHRoaXMsICdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Jyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYEFjY2VsZXJhdGlvbmAgc3VibW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIHVuaWZpZWQgdmFsdWVzIG9mIHRoZSBhY2NlbGVyYXRpb24uXG4gICAgICogRXN0aW1hdGVzIHRoZSBhY2NlbGVyYXRpb24gdmFsdWVzIGZyb20gYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgXG4gICAgICogcmF3IHZhbHVlcyBpZiB0aGUgYWNjZWxlcmF0aW9uIHJhdyB2YWx1ZXMgYXJlIG5vdCBhdmFpbGFibGUgb24gdGhlXG4gICAgICogZGV2aWNlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uID0gbmV3IERPTUV2ZW50U3VibW9kdWxlKHRoaXMsICdhY2NlbGVyYXRpb24nKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgUm90YXRpb25SYXRlYCBzdWJtb2R1bGUuXG4gICAgICogUHJvdmlkZXMgdW5pZmllZCB2YWx1ZXMgb2YgdGhlIHJvdGF0aW9uIHJhdGUuXG4gICAgICogKGNvbWluZyBzb29uLCB3YWl0aW5nIGZvciBhIGJ1ZyBvbiBDaHJvbWUgdG8gYmUgcmVzb2x2ZWQpXG4gICAgICogRXN0aW1hdGVzIHRoZSByb3RhdGlvbiByYXRlIHZhbHVlcyBmcm9tIGBvcmllbnRhdGlvbmAgdmFsdWVzIGlmXG4gICAgICogdGhlIHJvdGF0aW9uIHJhdGUgcmF3IHZhbHVlcyBhcmUgbm90IGF2YWlsYWJsZSBvbiB0aGUgZGV2aWNlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIHRoaXMucm90YXRpb25SYXRlID0gbmV3IERPTUV2ZW50U3VibW9kdWxlKHRoaXMsICdyb3RhdGlvblJhdGUnKTtcblxuICAgIC8qKlxuICAgICAqIFJlcXVpcmVkIHN1Ym1vZHVsZXMgLyBldmVudHMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICogQHByb3BlcnR5IHtib29sfSBhY2NlbGVyYXRpb24gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYGFjY2VsZXJhdGlvbmAgdW5pZmllZCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICogQHByb3BlcnR5IHtib29sfSByb3RhdGlvblJhdGUgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYHJvdGF0aW9uUmF0ZWAgdW5pZmllZCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICovXG4gICAgdGhpcy5yZXF1aXJlZCA9IHtcbiAgICAgIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHk6IGZhbHNlLFxuICAgICAgYWNjZWxlcmF0aW9uOiBmYWxzZSxcbiAgICAgIHJvdGF0aW9uUmF0ZTogZmFsc2VcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTnVtYmVyIG9mIGxpc3RlbmVycyBzdWJzY3JpYmVkIHRvIHRoZSBgRGV2aWNlTW90aW9uYCBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX251bUxpc3RlbmVycyA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlIGZ1bmN0aW9uIG9mIHRoZSBtb2R1bGUncyBwcm9taXNlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKiBAc2VlIERldmljZU1vdGlvbk1vZHVsZSNpbml0XG4gICAgICovXG4gICAgdGhpcy5fcHJvbWlzZVJlc29sdmUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVW5pZnlpbmcgZmFjdG9yIG9mIHRoZSBtb3Rpb24gZGF0YSB2YWx1ZXMgKGAxYCBvbiBBbmRyb2lkLCBgLTFgIG9uIGlPUykuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX3VuaWZ5TW90aW9uRGF0YSA9IChwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdpT1MnID8gLTEgOiAxKTtcblxuICAgIC8qKlxuICAgICAqIFVuaWZ5aW5nIGZhY3RvciBvZiB0aGUgcGVyaW9kIChgMC4wMDFgIG9uIEFuZHJvaWQsIGAxYCBvbiBpT1MpLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLl91bmlmeVBlcmlvZCA9IChwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdBbmRyb2lkJyA/IDAuMDAxIDogMSk7XG5cbiAgICAvKipcbiAgICAgKiBBY2NlbGVyYXRpb24gY2FsY3VsYXRlZCBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogVGltZSBjb25zdGFudCAoaGFsZi1saWZlKSBvZiB0aGUgaGlnaC1wYXNzIGZpbHRlciB1c2VkIHRvIHNtb290aCB0aGUgYWNjZWxlcmF0aW9uIHZhbHVlcyBjYWxjdWxhdGVkIGZyb20gdGhlIGFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eSByYXcgdmFsdWVzIChpbiBzZWNvbmRzKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgMC4xXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblRpbWVDb25zdGFudCA9IDAuMTtcblxuICAgIC8qKlxuICAgICAqIExhdGVzdCBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlLCB1c2VkIGluIHRoZSBoaWdoLXBhc3MgZmlsdGVyIHRvIGNhbGN1bGF0ZSB0aGUgYWNjZWxlcmF0aW9uIChpZiB0aGUgYGFjY2VsZXJhdGlvbmAgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgYCdkZXZpY2Vtb3Rpb24nYCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBSb3RhdGlvbiByYXRlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgb3JpZW50YXRpb24gdmFsdWVzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGUgPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBMYXRlc3Qgb3JpZW50YXRpb24gdmFsdWUsIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSByb3RhdGlvbiByYXRlICAoaWYgdGhlIGByb3RhdGlvblJhdGVgIHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IGAnZGV2aWNlbW90aW9uJ2ApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvbiA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIExhdGVzdCBvcmllbnRhdGlvbiB0aW1lc3RhbXBzLCB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgcm90YXRpb24gcmF0ZSAoaWYgdGhlIGByb3RhdGlvblJhdGVgIHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IGAnZGV2aWNlbW90aW9uJ2ApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblRpbWVzdGFtcCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgYmluZGluZyBvZiB0aGUgc2Vuc29yIGNoZWNrLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgICAqL1xuICAgIHRoaXMuX2RldmljZW1vdGlvbkNoZWNrID0gdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2suYmluZCh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCBiaW5kaW5nIG9mIHRoZSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGNhbGxiYWNrLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgICAqL1xuICAgIHRoaXMuX2RldmljZW1vdGlvbkxpc3RlbmVyID0gdGhpcy5fZGV2aWNlbW90aW9uTGlzdGVuZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWNheSBmYWN0b3Igb2YgdGhlIGhpZ2gtcGFzcyBmaWx0ZXIgdXNlZCB0byBjYWxjdWxhdGUgdGhlIGFjY2VsZXJhdGlvbiBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlcy5cbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25EZWNheSgpIHtcbiAgICByZXR1cm4gTWF0aC5leHAoLTIgKiBNYXRoLlBJICogdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnBlcmlvZCAvIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25UaW1lQ29uc3RhbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbnNvciBjaGVjayBvbiBpbml0aWFsaXphdGlvbiBvZiB0aGUgbW9kdWxlLlxuICAgKiBUaGlzIG1ldGhvZDpcbiAgICogLSBjaGVja3Mgd2hldGhlciB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCB0aGUgYGFjY2VsZXJhdGlvbmAsXG4gICAqICAgYW5kIHRoZSBgcm90YXRpb25SYXRlYCB2YWx1ZXMgYXJlIHZhbGlkIG9yIG5vdDtcbiAgICogLSBnZXRzIHRoZSBwZXJpb2Qgb2YgdGhlIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgYW5kIHNldHMgdGhlIHBlcmlvZCBvZlxuICAgKiAgIHRoZSBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIGBBY2NlbGVyYXRpb25gLCBhbmQgYFJvdGF0aW9uUmF0ZWBcbiAgICogICBzdWJtb2R1bGVzO1xuICAgKiAtIChpbiB0aGUgY2FzZSB3aGVyZSBhY2NlbGVyYXRpb24gcmF3IHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkKVxuICAgKiAgIGluZGljYXRlcyB3aGV0aGVyIHRoZSBhY2NlbGVyYXRpb24gY2FuIGJlIGNhbGN1bGF0ZWQgZnJvbSB0aGVcbiAgICogICBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMgb3Igbm90LlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gVGhlIGZpcnN0IGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgY2F1Z2h0LlxuICAgKi9cbiAgX2RldmljZW1vdGlvbkNoZWNrKGUpIHtcbiAgICB0aGlzLmlzUHJvdmlkZWQgPSB0cnVlO1xuICAgIHRoaXMucGVyaW9kID0gZS5pbnRlcnZhbCAvIDEwMDA7XG5cbiAgICAvLyBTZW5zb3IgYXZhaWxhYmlsaXR5IGZvciB0aGUgYWNjZWxlcmF0aW9uIGluY2x1ZGluZyBncmF2aXR5XG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzUHJvdmlkZWQgPSAoXG4gICAgICBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnggPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueSA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56ID09PSAnbnVtYmVyJylcbiAgICApO1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5wZXJpb2QgPSBlLmludGVydmFsICogdGhpcy5fdW5pZnlQZXJpb2Q7XG5cbiAgICAvLyBTZW5zb3IgYXZhaWxhYmlsaXR5IGZvciB0aGUgYWNjZWxlcmF0aW9uXG4gICAgdGhpcy5hY2NlbGVyYXRpb24uaXNQcm92aWRlZCA9IChcbiAgICAgIGUuYWNjZWxlcmF0aW9uICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uLnggPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbi55ID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb24ueiA9PT0gJ251bWJlcicpXG4gICAgKTtcbiAgICB0aGlzLmFjY2VsZXJhdGlvbi5wZXJpb2QgPSBlLmludGVydmFsICogdGhpcy5fdW5pZnlQZXJpb2Q7XG5cbiAgICAvLyBTZW5zb3IgYXZhaWxhYmlsaXR5IGZvciB0aGUgcm90YXRpb24gcmF0ZVxuICAgIHRoaXMucm90YXRpb25SYXRlLmlzUHJvdmlkZWQgPSAoXG4gICAgICBlLnJvdGF0aW9uUmF0ZSAmJlxuICAgICAgKHR5cGVvZiBlLnJvdGF0aW9uUmF0ZS5hbHBoYSA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUucm90YXRpb25SYXRlLmJldGEgPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLnJvdGF0aW9uUmF0ZS5nYW1tYSA9PT0gJ251bWJlcicpXG4gICAgKTtcbiAgICB0aGlzLnJvdGF0aW9uUmF0ZS5wZXJpb2QgPSBlLmludGVydmFsICogdGhpcy5fdW5pZnlQZXJpb2Q7XG5cbiAgICAvLyBXZSBvbmx5IG5lZWQgdG8gbGlzdGVuIHRvIG9uZSBldmVudCAoPT4gcmVtb3ZlIHRoZSBsaXN0ZW5lcilcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2ssIGZhbHNlKTtcblxuICAgIC8vIElmIGFjY2VsZXJhdGlvbiBpcyBub3QgcHJvdmlkZWQgYnkgcmF3IHNlbnNvcnMsIGluZGljYXRlIHdoZXRoZXIgaXRcbiAgICAvLyBjYW4gYmUgY2FsY3VsYXRlZCB3aXRoIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCBvciBub3RcbiAgICBpZiAoIXRoaXMuYWNjZWxlcmF0aW9uLmlzUHJvdmlkZWQpXG4gICAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc0NhbGN1bGF0ZWQgPSB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNQcm92aWRlZDtcblxuICAgIC8vIFdBUk5JTkdcbiAgICAvLyBUaGUgbGluZXMgb2YgY29kZSBiZWxvdyBhcmUgY29tbWVudGVkIGJlY2F1c2Ugb2YgYSBidWcgb2YgQ2hyb21lXG4gICAgLy8gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHdoZXJlICdkZXZpY2Vtb3Rpb24nIGV2ZW50cyBhcmUgbm90IHNlbnRcbiAgICAvLyBvciBjYXVnaHQgaWYgdGhlIGxpc3RlbmVyIGlzIHNldCB1cCBhZnRlciBhICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAvLyBsaXN0ZW5lci4gSGVyZSwgdGhlIF90cnlPcmllbnRhdGlvbkZhbGxiYWNrIG1ldGhvZCB3b3VsZCBhZGQgYVxuICAgIC8vICdkZXZpY2VvcmllbnRhdGlvbicgbGlzdGVuZXIgYW5kIGJsb2NrIGFsbCBzdWJzZXF1ZW50ICdkZXZpY2Vtb3Rpb24nXG4gICAgLy8gZXZlbnRzIG9uIHRoZXNlIGRldmljZXMuIENvbW1lbnRzIHdpbGwgYmUgcmVtb3ZlZCBvbmNlIHRoZSBidWcgb2ZcbiAgICAvLyBDaHJvbWUgaXMgY29ycmVjdGVkLlxuXG4gICAgLy8gaWYgKHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlICYmICF0aGlzLnJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkKVxuICAgIC8vICAgdGhpcy5fdHJ5T3JpZW50YXRpb25GYWxsYmFjaygpO1xuICAgIC8vIGVsc2VcbiAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGNhbGxiYWNrLlxuICAgKiBUaGlzIG1ldGhvZCBlbWl0cyBhbiBldmVudCB3aXRoIHRoZSByYXcgYCdkZXZpY2Vtb3Rpb24nYCB2YWx1ZXMsIGFuZCBlbWl0c1xuICAgKiBldmVudHMgd2l0aCB0aGUgdW5pZmllZCBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIGBhY2NlbGVyYXRpb25gLFxuICAgKiBhbmQgLyBvciBgcm90YXRpb25SYXRlYCB2YWx1ZXMgaWYgdGhleSBhcmUgcmVxdWlyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICovXG4gIF9kZXZpY2Vtb3Rpb25MaXN0ZW5lcihlKSB7XG4gICAgLy8gJ2RldmljZW1vdGlvbicgZXZlbnQgKHJhdyB2YWx1ZXMpXG4gICAgdGhpcy5fZW1pdERldmljZU1vdGlvbkV2ZW50KGUpO1xuXG4gICAgLy8gJ2FjY2VsZXJhdGlvbicgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIGlmICh0aGlzLnJlcXVpcmVkLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgJiYgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzVmFsaWQpXG4gICAgICB0aGlzLl9lbWl0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eUV2ZW50KGUpO1xuXG4gICAgLy8gJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknIGV2ZW50ICh1bmlmaWVkIHZhbHVlcylcbiAgICBpZiAodGhpcy5yZXF1aXJlZC5hY2NlbGVyYXRpb24gJiYgdGhpcy5hY2NlbGVyYXRpb24uaXNWYWxpZCkgLy8gdGhlIGZhbGxiYWNrIGNhbGN1bGF0aW9uIG9mIHRoZSBhY2NlbGVyYXRpb24gaGFwcGVucyBpbiB0aGUgYF9lbWl0QWNjZWxlcmF0aW9uYCBtZXRob2QsIHNvIHdlIGNoZWNrIGlmIHRoaXMuYWNjZWxlcmF0aW9uLmlzVmFsaWRcbiAgICAgIHRoaXMuX2VtaXRBY2NlbGVyYXRpb25FdmVudChlKTtcblxuICAgIC8vICdyb3RhdGlvblJhdGUnIGV2ZW50ICh1bmlmaWVkIHZhbHVlcylcbiAgICBpZiAodGhpcy5yZXF1aXJlZC5yb3RhdGlvblJhdGUgJiYgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZCkgLy8gdGhlIGZhbGxiYWNrIGNhbGN1bGF0aW9uIG9mIHRoZSByb3RhdGlvbiByYXRlIGRvZXMgTk9UIGhhcHBlbiBpbiB0aGUgYF9lbWl0Um90YXRpb25SYXRlYCBtZXRob2QsIHNvIHdlIG9ubHkgY2hlY2sgaWYgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZFxuICAgICAgdGhpcy5fZW1pdFJvdGF0aW9uUmF0ZUV2ZW50KGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBgJ2RldmljZW1vdGlvbidgIHJhdyB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICovXG4gIF9lbWl0RGV2aWNlTW90aW9uRXZlbnQoZSkge1xuICAgIGxldCBvdXRFdmVudCA9IHRoaXMuZXZlbnQ7XG5cbiAgICBpZiAoZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KSB7XG4gICAgICBvdXRFdmVudFswXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54O1xuICAgICAgb3V0RXZlbnRbMV0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueTtcbiAgICAgIG91dEV2ZW50WzJdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lno7XG4gICAgfVxuXG4gICAgaWYgKGUuYWNjZWxlcmF0aW9uKSB7XG4gICAgICBvdXRFdmVudFszXSA9IGUuYWNjZWxlcmF0aW9uLng7XG4gICAgICBvdXRFdmVudFs0XSA9IGUuYWNjZWxlcmF0aW9uLnk7XG4gICAgICBvdXRFdmVudFs1XSA9IGUuYWNjZWxlcmF0aW9uLno7XG4gICAgfVxuXG4gICAgaWYgKGUucm90YXRpb25SYXRlKSB7XG4gICAgICBvdXRFdmVudFs2XSA9IGUucm90YXRpb25SYXRlLmFscGhhO1xuICAgICAgb3V0RXZlbnRbN10gPSBlLnJvdGF0aW9uUmF0ZS5iZXRhO1xuICAgICAgb3V0RXZlbnRbOF0gPSBlLnJvdGF0aW9uUmF0ZS5nYW1tYTtcbiAgICB9XG5cbiAgICB0aGlzLmVtaXQob3V0RXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICovXG4gIF9lbWl0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eUV2ZW50KGUpIHtcbiAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuZXZlbnQ7XG5cbiAgICBvdXRFdmVudFswXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuICAgIG91dEV2ZW50WzFdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnkgKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgb3V0RXZlbnRbMl0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueiAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcblxuICAgIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYGFjY2VsZXJhdGlvbmAgdW5pZmllZCB2YWx1ZXMuXG4gICAqIFdoZW4gdGhlIGBhY2NlbGVyYXRpb25gIHJhdyB2YWx1ZXMgYXJlIG5vdCBhdmFpbGFibGUsIHRoZSBtZXRob2RcbiAgICogYWxzbyBjYWxjdWxhdGVzIHRoZSBhY2NlbGVyYXRpb24gZnJvbSB0aGVcbiAgICogYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHJhdyB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBUaGUgYCdkZXZpY2Vtb3Rpb24nYCBldmVudC5cbiAgICovXG4gIF9lbWl0QWNjZWxlcmF0aW9uRXZlbnQoZSkge1xuICAgIGxldCBvdXRFdmVudCA9IHRoaXMuYWNjZWxlcmF0aW9uLmV2ZW50O1xuXG4gICAgaWYgKHRoaXMuYWNjZWxlcmF0aW9uLmlzUHJvdmlkZWQpIHtcbiAgICAgIC8vIElmIHJhdyBhY2NlbGVyYXRpb24gdmFsdWVzIGFyZSBwcm92aWRlZFxuICAgICAgb3V0RXZlbnRbMF0gPSBlLmFjY2VsZXJhdGlvbi54ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuICAgICAgb3V0RXZlbnRbMV0gPSBlLmFjY2VsZXJhdGlvbi55ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuICAgICAgb3V0RXZlbnRbMl0gPSBlLmFjY2VsZXJhdGlvbi56ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzVmFsaWQpIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgaWYgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSB2YWx1ZXMgYXJlIHByb3ZpZGVkLFxuICAgICAgLy8gZXN0aW1hdGUgdGhlIGFjY2VsZXJhdGlvbiB3aXRoIGEgaGlnaC1wYXNzIGZpbHRlclxuICAgICAgY29uc3QgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSA9IFtcbiAgICAgICAgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnggKiB0aGlzLl91bmlmeU1vdGlvbkRhdGEsXG4gICAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhLFxuICAgICAgICBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueiAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YVxuICAgICAgXTtcbiAgICAgIGNvbnN0IGsgPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uRGVjYXk7XG5cbiAgICAgIC8vIEhpZ2gtcGFzcyBmaWx0ZXIgdG8gZXN0aW1hdGUgdGhlIGFjY2VsZXJhdGlvbiAod2l0aG91dCB0aGUgZ3Jhdml0eSlcbiAgICAgIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMF0gPSAoMSArIGspICogMC41ICogKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF0gLSB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXSkgKyBrICogdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblswXTtcbiAgICAgIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMV0gPSAoMSArIGspICogMC41ICogKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV0gLSB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXSkgKyBrICogdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsxXTtcbiAgICAgIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMl0gPSAoMSArIGspICogMC41ICogKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl0gLSB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXSkgKyBrICogdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsyXTtcblxuICAgICAgdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF0gPSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdO1xuICAgICAgdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV0gPSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdO1xuICAgICAgdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl0gPSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdO1xuXG4gICAgICBvdXRFdmVudFswXSA9IHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMF07XG4gICAgICBvdXRFdmVudFsxXSA9IHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMV07XG4gICAgICBvdXRFdmVudFsyXSA9IHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMl07XG4gICAgfVxuXG4gICAgdGhpcy5hY2NlbGVyYXRpb24uZW1pdChvdXRFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIGByb3RhdGlvblJhdGVgIHVuaWZpZWQgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZW1pdFJvdGF0aW9uUmF0ZUV2ZW50KGUpIHtcbiAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLnJvdGF0aW9uUmF0ZS5ldmVudDtcblxuICAgIG91dEV2ZW50WzBdID0gZS5yb3RhdGlvblJhdGUuYWxwaGE7XG4gICAgb3V0RXZlbnRbMV0gPSBlLnJvdGF0aW9uUmF0ZS5iZXRhO1xuICAgIG91dEV2ZW50WzJdID0gZS5yb3RhdGlvblJhdGUuZ2FtbWE7XG5cbiAgICAvLyBUT0RPKD8pOiB1bmlmeVxuXG4gICAgdGhpcy5yb3RhdGlvblJhdGUuZW1pdChvdXRFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBhbmQgZW1pdHMgdGhlIGByb3RhdGlvblJhdGVgIHVuaWZpZWQgdmFsdWVzIGZyb20gdGhlIGBvcmllbnRhdGlvbmAgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcltdfSBvcmllbnRhdGlvbiAtIExhdGVzdCBgb3JpZW50YXRpb25gIHJhdyB2YWx1ZXMuXG4gICAqL1xuICBfY2FsY3VsYXRlUm90YXRpb25SYXRlRnJvbU9yaWVudGF0aW9uKG9yaWVudGF0aW9uKSB7XG4gICAgY29uc3Qgbm93ID0gZ2V0TG9jYWxUaW1lKCk7XG4gICAgY29uc3QgayA9IDAuODsgLy8gVE9ETzogaW1wcm92ZSBsb3cgcGFzcyBmaWx0ZXIgKGZyYW1lcyBhcmUgbm90IHJlZ3VsYXIpXG4gICAgY29uc3QgYWxwaGFJc1ZhbGlkID0gKHR5cGVvZiBvcmllbnRhdGlvblswXSA9PT0gJ251bWJlcicpO1xuXG4gICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblRpbWVzdGFtcCkge1xuICAgICAgbGV0IHJBbHBoYSA9IG51bGw7XG4gICAgICBsZXQgckJldGE7XG4gICAgICBsZXQgckdhbW1hO1xuXG4gICAgICBsZXQgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yID0gMDtcbiAgICAgIGxldCBiZXRhRGlzY29udGludWl0eUZhY3RvciA9IDA7XG4gICAgICBsZXQgZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yID0gMDtcblxuICAgICAgY29uc3QgZGVsdGFUID0gbm93IC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wO1xuXG4gICAgICBpZiAoYWxwaGFJc1ZhbGlkKSB7XG4gICAgICAgIC8vIGFscGhhIGRpc2NvbnRpbnVpdHkgKCszNjAgLT4gMCBvciAwIC0+ICszNjApXG4gICAgICAgIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMF0gPiAzMjAgJiYgb3JpZW50YXRpb25bMF0gPCA0MClcbiAgICAgICAgICBhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAzNjA7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSA8IDQwICYmIG9yaWVudGF0aW9uWzBdID4gMzIwKVxuICAgICAgICAgIGFscGhhRGlzY29udGludWl0eUZhY3RvciA9IC0zNjA7XG4gICAgICB9XG5cbiAgICAgIC8vIGJldGEgZGlzY29udGludWl0eSAoKzE4MCAtPiAtMTgwIG9yIC0xODAgLT4gKzE4MClcbiAgICAgIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMV0gPiAxNDAgJiYgb3JpZW50YXRpb25bMV0gPCAtMTQwKVxuICAgICAgICBiZXRhRGlzY29udGludWl0eUZhY3RvciA9IDM2MDtcbiAgICAgIGVsc2UgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSA8IC0xNDAgJiYgb3JpZW50YXRpb25bMV0gPiAxNDApXG4gICAgICAgIGJldGFEaXNjb250aW51aXR5RmFjdG9yID0gLTM2MDtcblxuICAgICAgLy8gZ2FtbWEgZGlzY29udGludWl0aWVzICgrMTgwIC0+IC0xODAgb3IgLTE4MCAtPiArMTgwKVxuICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSA+IDUwICYmIG9yaWVudGF0aW9uWzJdIDwgLTUwKVxuICAgICAgICBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAxODA7XG4gICAgICBlbHNlIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMl0gPCAtNTAgJiYgb3JpZW50YXRpb25bMl0gPiA1MClcbiAgICAgICAgZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yID0gLTE4MDtcblxuICAgICAgaWYgKGRlbHRhVCA+IDApIHtcbiAgICAgICAgLy8gTG93IHBhc3MgZmlsdGVyIHRvIHNtb290aCB0aGUgZGF0YVxuICAgICAgICBpZiAoYWxwaGFJc1ZhbGlkKVxuICAgICAgICAgIHJBbHBoYSA9IGsgKiB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzBdICsgKDEgLSBrKSAqIChvcmllbnRhdGlvblswXSAtIHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSArIGFscGhhRGlzY29udGludWl0eUZhY3RvcikgLyBkZWx0YVQ7XG4gICAgICAgIHJCZXRhID0gayAqIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMV0gKyAoMSAtIGspICogKG9yaWVudGF0aW9uWzFdIC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uWzFdICsgYmV0YURpc2NvbnRpbnVpdHlGYWN0b3IpIC8gZGVsdGFUO1xuICAgICAgICByR2FtbWEgPSBrICogdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVsyXSArICgxIC0gaykgKiAob3JpZW50YXRpb25bMl0gLSB0aGlzLl9sYXN0T3JpZW50YXRpb25bMl0gKyBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IpIC8gZGVsdGFUO1xuXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMF0gPSByQWxwaGE7XG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMV0gPSByQmV0YTtcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVsyXSA9IHJHYW1tYTtcbiAgICAgIH1cblxuICAgICAgLy8gVE9ETzogcmVzYW1wbGUgdGhlIGVtaXNzaW9uIHJhdGUgdG8gbWF0Y2ggdGhlIGRldmljZW1vdGlvbiByYXRlXG4gICAgICB0aGlzLnJvdGF0aW9uUmF0ZS5lbWl0KHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGUpO1xuICAgIH1cblxuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblRpbWVzdGFtcCA9IG5vdztcbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb25bMF0gPSBvcmllbnRhdGlvblswXTtcbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb25bMV0gPSBvcmllbnRhdGlvblsxXTtcbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb25bMl0gPSBvcmllbnRhdGlvblsyXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgcm90YXRpb24gcmF0ZSBjYW4gYmUgY2FsY3VsYXRlZCBmcm9tIHRoZSBgb3JpZW50YXRpb25gIHZhbHVlcyBvciBub3QuXG4gICAqL1xuICBfdHJ5T3JpZW50YXRpb25GYWxsYmFjaygpIHtcbiAgICBNb3Rpb25JbnB1dC5yZXF1aXJlTW9kdWxlKCdvcmllbnRhdGlvbicpXG4gICAgICAudGhlbigob3JpZW50YXRpb24pID0+IHtcbiAgICAgICAgaWYgKG9yaWVudGF0aW9uLmlzVmFsaWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIldBUk5JTkcgKG1vdGlvbi1pbnB1dCk6IFRoZSAnZGV2aWNlbW90aW9uJyBldmVudCBkb2VzIG5vdCBleGlzdHMgb3IgZG9lcyBub3QgcHJvdmlkZSByb3RhdGlvbiByYXRlIHZhbHVlcyBpbiB5b3VyIGJyb3dzZXIsIHNvIHRoZSByb3RhdGlvbiByYXRlIG9mIHRoZSBkZXZpY2UgaXMgZXN0aW1hdGVkIGZyb20gdGhlICdvcmllbnRhdGlvbicsIGNhbGN1bGF0ZWQgZnJvbSB0aGUgJ2RldmljZW9yaWVudGF0aW9uJyBldmVudC4gU2luY2UgdGhlIGNvbXBhc3MgbWlnaHQgbm90IGJlIGF2YWlsYWJsZSwgb25seSBgYmV0YWAgYW5kIGBnYW1tYWAgYW5nbGVzIG1heSBiZSBwcm92aWRlZCAoYGFscGhhYCB3b3VsZCBiZSBudWxsKS5cIik7XG5cbiAgICAgICAgICB0aGlzLnJvdGF0aW9uUmF0ZS5pc0NhbGN1bGF0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgTW90aW9uSW5wdXQuYWRkTGlzdGVuZXIoJ29yaWVudGF0aW9uJywgKG9yaWVudGF0aW9uKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVSb3RhdGlvblJhdGVGcm9tT3JpZW50YXRpb24ob3JpZW50YXRpb24pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcHJvbWlzZVJlc29sdmUodGhpcyk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmNyZWFzZXMgdGhlIG51bWJlciBvZiBsaXN0ZW5lcnMgdG8gdGhpcyBtb2R1bGUgKGVpdGhlciBiZWNhdXNlIHNvbWVvbmUgbGlzdGVuc1xuICAgKiB0byB0aGlzIG1vZHVsZSwgb3Igb25lIG9mIHRoZSB0aHJlZSBgRE9NRXZlbnRTdWJtb2R1bGVzYFxuICAgKiAoYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCBgQWNjZWxlcmF0aW9uYCwgYFJvdGF0aW9uUmF0ZWApLlxuICAgKiBXaGVuIHRoZSBudW1iZXIgb2YgbGlzdGVuZXJzIHJlYWNoZXMgYDFgLCBhZGRzIGEgYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBsaXN0ZW5lci5cbiAgICpcbiAgICogQHNlZSBEZXZpY2VNb3Rpb25Nb2R1bGUjYWRkTGlzdGVuZXJcbiAgICogQHNlZSBET01FdmVudFN1Ym1vZHVsZSNzdGFydFxuICAgKi9cbiAgX2FkZExpc3RlbmVyKCkge1xuICAgIHRoaXMuX251bUxpc3RlbmVycysrO1xuXG4gICAgaWYgKHRoaXMuX251bUxpc3RlbmVycyA9PT0gMSlcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCB0aGlzLl9kZXZpY2Vtb3Rpb25MaXN0ZW5lciwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlY3JlYXNlcyB0aGUgbnVtYmVyIG9mIGxpc3RlbmVycyB0byB0aGlzIG1vZHVsZSAoZWl0aGVyIGJlY2F1c2Ugc29tZW9uZSBzdG9wc1xuICAgKiBsaXN0ZW5pbmcgdG8gdGhpcyBtb2R1bGUsIG9yIG9uZSBvZiB0aGUgdGhyZWUgYERPTUV2ZW50U3VibW9kdWxlc2BcbiAgICogKGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCwgYEFjY2VsZXJhdGlvbmAsIGBSb3RhdGlvblJhdGVgKS5cbiAgICogV2hlbiB0aGUgbnVtYmVyIG9mIGxpc3RlbmVycyByZWFjaGVzIGAwYCwgcmVtb3ZlcyB0aGUgYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBsaXN0ZW5lci5cbiAgICpcbiAgICogQHNlZSBEZXZpY2VNb3Rpb25Nb2R1bGUjcmVtb3ZlTGlzdGVuZXJcbiAgICogQHNlZSBET01FdmVudFN1Ym1vZHVsZSNzdG9wXG4gICAqL1xuICBfcmVtb3ZlTGlzdGVuZXIoKSB7XG4gICAgdGhpcy5fbnVtTGlzdGVuZXJzLS07XG5cbiAgICBpZiAodGhpcy5fbnVtTGlzdGVuZXJzID09PSAwKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZW1vdGlvbicsIHRoaXMuX2RldmljZW1vdGlvbkxpc3RlbmVyLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgb2YgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogQHJldHVybiB7cHJvbWlzZX1cbiAgICovXG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIHN1cGVyLmluaXQoKHJlc29sdmUpID0+IHtcbiAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlID0gcmVzb2x2ZTtcblxuICAgICAgaWYgKHdpbmRvdy5EZXZpY2VNb3Rpb25FdmVudClcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW1vdGlvbicsIHRoaXMuX2RldmljZW1vdGlvbkNoZWNrLCBmYWxzZSk7XG5cbiAgICAgIC8vIFdBUk5JTkdcbiAgICAgIC8vIFRoZSBsaW5lcyBvZiBjb2RlIGJlbG93IGFyZSBjb21tZW50ZWQgYmVjYXVzZSBvZiBhIGJ1ZyBvZiBDaHJvbWVcbiAgICAgIC8vIG9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzLCB3aGVyZSAnZGV2aWNlbW90aW9uJyBldmVudHMgYXJlIG5vdCBzZW50XG4gICAgICAvLyBvciBjYXVnaHQgaWYgdGhlIGxpc3RlbmVyIGlzIHNldCB1cCBhZnRlciBhICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAgIC8vIGxpc3RlbmVyLiBIZXJlLCB0aGUgX3RyeU9yaWVudGF0aW9uRmFsbGJhY2sgbWV0aG9kIHdvdWxkIGFkZCBhXG4gICAgICAvLyAnZGV2aWNlb3JpZW50YXRpb24nIGxpc3RlbmVyIGFuZCBibG9jayBhbGwgc3Vic2VxdWVudCAnZGV2aWNlbW90aW9uJ1xuICAgICAgLy8gZXZlbnRzIG9uIHRoZXNlIGRldmljZXMuIENvbW1lbnRzIHdpbGwgYmUgcmVtb3ZlZCBvbmNlIHRoZSBidWcgb2ZcbiAgICAgIC8vIENocm9tZSBpcyBjb3JyZWN0ZWQuXG5cbiAgICAgIC8vIGVsc2UgaWYgKHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlKVxuICAgICAgLy8gdGhpcy5fdHJ5T3JpZW50YXRpb25GYWxsYmFjaygpO1xuXG4gICAgICBlbHNlXG4gICAgICAgIHJlc29sdmUodGhpcyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxpc3RlbmVyIHRvIHRoaXMgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIHRvIGFkZC5cbiAgICovXG4gIGFkZExpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgc3VwZXIuYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgIHRoaXMuX2FkZExpc3RlbmVyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZyb20gdGhpcyBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIC0gTGlzdGVuZXIgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICBzdXBlci5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEZXZpY2VNb3Rpb25Nb2R1bGUoKTtcbiJdfQ==