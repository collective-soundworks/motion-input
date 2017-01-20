(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InputModule2 = require('./InputModule');

var _InputModule3 = _interopRequireDefault(_InputModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * `DOMEventSubmodule` class.
 * The `DOMEventSubmodule` class allows to instantiate modules that provide
 * unified values (such as `AccelerationIncludingGravity`, `Acceleration`,
 * `RotationRate`, `Orientation`, `OrientationAlt) from the `devicemotion`
 * or `deviceorientation` DOM events.
 *
 * @class DOMEventSubmodule
 * @extends InputModule
 */
var DOMEventSubmodule = function (_InputModule) {
  _inherits(DOMEventSubmodule, _InputModule);

  /**
   * Creates a `DOMEventSubmodule` module instance.
   *
   * @constructor
   * @param {DeviceMotionModule|DeviceOrientationModule} DOMEventModule - The parent DOM event module.
   * @param {string} eventType - The name of the submodule / event (*e.g.* 'acceleration' or 'orientationAlt').
   * @see DeviceMotionModule
   * @see DeviceOrientationModule
   */
  function DOMEventSubmodule(DOMEventModule, eventType) {
    _classCallCheck(this, DOMEventSubmodule);

    /**
     * The DOM event parent module from which this module gets the raw values.
     *
     * @this DOMEventSubmodule
     * @type {DeviceMotionModule|DeviceOrientationModule}
     * @constant
     */
    var _this = _possibleConstructorReturn(this, (DOMEventSubmodule.__proto__ || Object.getPrototypeOf(DOMEventSubmodule)).call(this, eventType));

    _this.DOMEventModule = DOMEventModule;

    /**
     * Raw values coming from the `devicemotion` event sent by this module.
     *
     * @this DOMEventSubmodule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    _this.event = [0, 0, 0];

    /**
     * Compass heading reference (iOS devices only, `Orientation` and `OrientationAlt` submodules only).
     *
     * @this DOMEventSubmodule
     * @type {number}
     * @default null
     */
    _this._webkitCompassHeadingReference = null;
    return _this;
  }

  /**
   * Initializes of the module.
   *
   * @return {Promise}
   */


  _createClass(DOMEventSubmodule, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      // Indicate to the parent module that this event is required
      this.DOMEventModule.required[this.eventType] = true;

      // If the parent event has not been initialized yet, initialize it
      var DOMEventPromise = this.DOMEventModule.promise;
      if (!DOMEventPromise) DOMEventPromise = this.DOMEventModule.init();

      return DOMEventPromise.then(function (module) {
        return _this2;
      });
    }
  }]);

  return DOMEventSubmodule;
}(_InputModule3.default);

exports.default = DOMEventSubmodule;

},{"./InputModule":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _InputModule2 = require('./InputModule');

var _InputModule3 = _interopRequireDefault(_InputModule2);

var _DOMEventSubmodule = require('./DOMEventSubmodule');

var _DOMEventSubmodule2 = _interopRequireDefault(_DOMEventSubmodule);

var _MotionInput = require('./MotionInput');

var _MotionInput2 = _interopRequireDefault(_MotionInput);

var _platform = require('platform');

var _platform2 = _interopRequireDefault(_platform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    _this.accelerationIncludingGravity = new _DOMEventSubmodule2.default(_this, 'accelerationIncludingGravity');

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
    _this.acceleration = new _DOMEventSubmodule2.default(_this, 'acceleration');

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
    _this.rotationRate = new _DOMEventSubmodule2.default(_this, 'rotationRate');

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
    _this._unifyMotionData = _platform2.default.os.family === 'iOS' ? -1 : 1;

    /**
     * Unifying factor of the period (`0.001` on Android, `1` on iOS).
     *
     * @this DeviceMotionModule
     * @type {number}
     */
    _this._unifyPeriod = _platform2.default.os.family === 'Android' ? 0.001 : 1;

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

    _this._processFunction = null;
    _this._process = _this._process.bind(_this);
    _this._devicemotionCheck = _this._devicemotionCheck.bind(_this);
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

      // now that the sensors are chacked replace the process function with the
      // proper listener
      this._processFunction = this._devicemotionListener;

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
      if (this.listeners.size > 0) this._emitDeviceMotionEvent(e);

      // 'acceleration' event (unified values)
      if (this.accelerationIncludingGravity.listeners.size > 0 && this.required.accelerationIncludingGravity && this.accelerationIncludingGravity.isValid) {
        this._emitAccelerationIncludingGravityEvent(e);
      }

      // 'accelerationIncludingGravity' event (unified values)
      // the fallback calculation of the acceleration happens in the
      //  `_emitAcceleration` method, so we check if this.acceleration.isValid
      if (this.acceleration.listeners.size > 0 && this.required.acceleration && this.acceleration.isValid) {
        this._emitAccelerationEvent(e);
      }

      // 'rotationRate' event (unified values)
      // the fallback calculation of the rotation rate does NOT happen in the
      // `_emitRotationRate` method, so we only check if this.rotationRate.isProvided
      if (this.rotationRate.listeners.size > 0 && this.required.rotationRate && this.rotationRate.isProvided) {
        this._emitRotationRateEvent(e);
      }
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

      _MotionInput2.default.requireModule('orientation').then(function (orientation) {
        if (orientation.isValid) {
          console.log("WARNING (motion-input): The 'devicemotion' event does not exists or does not provide rotation rate values in your browser, so the rotation rate of the device is estimated from the 'orientation', calculated from the 'deviceorientation' event. Since the compass might not be available, only `beta` and `gamma` angles may be provided (`alpha` would be null).");

          _this2.rotationRate.isCalculated = true;

          _MotionInput2.default.addListener('orientation', function (orientation) {
            _this2._calculateRotationRateFromOrientation(orientation);
          });
        }

        _this2._promiseResolve(_this2);
      });
    }
  }, {
    key: '_process',
    value: function _process(data) {
      this._processFunction(data);
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

        if (window.DeviceMotionEvent) {
          _this3._processFunction = _this3._devicemotionCheck;
          window.addEventListener('devicemotion', _this3._process);
        }

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
  }, {
    key: '_calculatedAccelerationDecay',
    get: function get() {
      return Math.exp(-2 * Math.PI * this.accelerationIncludingGravity.period / this._calculatedAccelerationTimeConstant);
    }
  }]);

  return DeviceMotionModule;
}(_InputModule3.default);

exports.default = new DeviceMotionModule();

},{"./DOMEventSubmodule":1,"./InputModule":5,"./MotionInput":6,"platform":9}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _DOMEventSubmodule = require('./DOMEventSubmodule');

var _DOMEventSubmodule2 = _interopRequireDefault(_DOMEventSubmodule);

var _InputModule2 = require('./InputModule');

var _InputModule3 = _interopRequireDefault(_InputModule2);

var _MotionInput = require('./MotionInput');

var _MotionInput2 = _interopRequireDefault(_MotionInput);

var _platform = require('platform');

var _platform2 = _interopRequireDefault(_platform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Converts degrees to radians.
 *
 * @param {number} deg - Angle in degrees.
 * @return {number}
 */
function degToRad(deg) {
  return deg * Math.PI / 180;
}

/**
 * Converts radians to degrees.
 *
 * @param {number} rad - Angle in radians.
 * @return {number}
 */
function radToDeg(rad) {
  return rad * 180 / Math.PI;
}

/**
 * Normalizes a 3 x 3 matrix.
 *
 * @param {number[]} m - Matrix to normalize, represented by an array of length 9.
 * @return {number[]}
 */
function normalize(m) {
  var det = m[0] * m[4] * m[8] + m[1] * m[5] * m[6] + m[2] * m[3] * m[7] - m[0] * m[5] * m[7] - m[1] * m[3] * m[8] - m[2] * m[4] * m[6];

  for (var i = 0; i < m.length; i++) {
    m[i] /= det;
  }return m;
}

/**
 * Converts a Euler angle `[alpha, beta, gamma]` to the W3C specification, where:
 * - `alpha` is in [0; +360[;
 * - `beta` is in [-180; +180[;
 * - `gamma` is in [-90; +90[.
 *
 * @param {number[]} eulerAngle - Euler angle to unify, represented by an array of length 3 (`[alpha, beta, gamma]`).
 * @see {@link http://www.w3.org/TR/orientation-event/}
 */
function unify(eulerAngle) {
  // Cf. W3C specification (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
  // and Euler angles Wikipedia page (http://en.wikipedia.org/wiki/Euler_angles).
  //
  // W3C convention: Tait–Bryan angles Z-X'-Y'', where:
  //   alpha is in [0; +360[,
  //   beta is in [-180; +180[,
  //   gamma is in [-90; +90[.

  var alphaIsValid = typeof eulerAngle[0] === 'number';

  var _alpha = alphaIsValid ? degToRad(eulerAngle[0]) : 0;
  var _beta = degToRad(eulerAngle[1]);
  var _gamma = degToRad(eulerAngle[2]);

  var cA = Math.cos(_alpha);
  var cB = Math.cos(_beta);
  var cG = Math.cos(_gamma);
  var sA = Math.sin(_alpha);
  var sB = Math.sin(_beta);
  var sG = Math.sin(_gamma);

  var alpha = void 0,
      beta = void 0,
      gamma = void 0;

  var m = [cA * cG - sA * sB * sG, -cB * sA, cA * sG + cG * sA * sB, cG * sA + cA * sB * sG, cA * cB, sA * sG - cA * cG * sB, -cB * sG, sB, cB * cG];
  normalize(m);

  // Since we want gamma in [-90; +90[, cG >= 0.
  if (m[8] > 0) {
    // Case 1: m[8] > 0 <=> cB > 0                 (and cG != 0)
    //                  <=> beta in ]-pi/2; +pi/2[ (and cG != 0)
    alpha = Math.atan2(-m[1], m[4]);
    beta = Math.asin(m[7]); // asin returns a number between -pi/2 and +pi/2 => OK
    gamma = Math.atan2(-m[6], m[8]);
  } else if (m[8] < 0) {
    // Case 2: m[8] < 0 <=> cB < 0                            (and cG != 0)
    //                  <=> beta in [-pi; -pi/2[ U ]+pi/2; +pi] (and cG != 0)

    // Since cB < 0 and cB is in m[1] and m[4], the point is flipped by 180 degrees.
    // Hence, we have to multiply both arguments of atan2 by -1 in order to revert
    // the point in its original position (=> another flip by 180 degrees).
    alpha = Math.atan2(m[1], -m[4]);
    beta = -Math.asin(m[7]);
    beta += beta >= 0 ? -Math.PI : Math.PI; // asin returns a number between -pi/2 and pi/2 => make sure beta in [-pi; -pi/2[ U ]+pi/2; +pi]
    gamma = Math.atan2(m[6], -m[8]); // same remark as for alpha, multiplication by -1
  } else {
    // Case 3: m[8] = 0 <=> cB = 0 or cG = 0
    if (m[6] > 0) {
      // Subcase 1: cG = 0 and cB > 0
      //            cG = 0 <=> sG = -1 <=> gamma = -pi/2 => m[6] = cB
      //            Hence, m[6] > 0 <=> cB > 0 <=> beta in ]-pi/2; +pi/2[
      alpha = Math.atan2(-m[1], m[4]);
      beta = Math.asin(m[7]); // asin returns a number between -pi/2 and +pi/2 => OK
      gamma = -Math.PI / 2;
    } else if (m[6] < 0) {
      // Subcase 2: cG = 0 and cB < 0
      //            cG = 0 <=> sG = -1 <=> gamma = -pi/2 => m[6] = cB
      //            Hence, m[6] < 0 <=> cB < 0 <=> beta in [-pi; -pi/2[ U ]+pi/2; +pi]
      alpha = Math.atan2(m[1], -m[4]); // same remark as for alpha in a case above
      beta = -Math.asin(m[7]);
      beta += beta >= 0 ? -Math.PI : Math.PI; // asin returns a number between -pi/2 and +pi/2 => make sure beta in [-pi; -pi/2[ U ]+pi/2; +pi]
      gamma = -Math.PI / 2;
    } else {
      // Subcase 3: cB = 0
      // In the case where cos(beta) = 0 (i.e. beta = -pi/2 or beta = pi/2),
      // we have the gimbal lock problem: in that configuration, only the angle
      // alpha + gamma (if beta = +pi/2) or alpha - gamma (if beta = -pi/2)
      // are uniquely defined: alpha and gamma can take an infinity of values.
      // For convenience, let's set gamma = 0 (and thus sin(gamma) = 0).
      // (As a consequence of the gimbal lock problem, there is a discontinuity
      // in alpha and gamma.)
      alpha = Math.atan2(m[3], m[0]);
      beta = m[7] > 0 ? Math.PI / 2 : -Math.PI / 2;
      gamma = 0;
    }
  }

  // atan2 returns a number between -pi and pi => make sure that alpha is in [0, 2*pi[.
  alpha += alpha < 0 ? 2 * Math.PI : 0;

  eulerAngle[0] = alphaIsValid ? radToDeg(alpha) : null;
  eulerAngle[1] = radToDeg(beta);
  eulerAngle[2] = radToDeg(gamma);
}

/**
 * Converts a Euler angle `[alpha, beta, gamma]` to a Euler angle where:
 * - `alpha` is in [0; +360[;
 * - `beta` is in [-90; +90[;
 * - `gamma` is in [-180; +180[.
 *
 * @param {number[]} eulerAngle - Euler angle to convert, represented by an array of length 3 (`[alpha, beta, gamma]`).
 */
function unifyAlt(eulerAngle) {
  // Convention here: Tait–Bryan angles Z-X'-Y'', where:
  //   alpha is in [0; +360[,
  //   beta is in [-90; +90[,
  //   gamma is in [-180; +180[.

  var alphaIsValid = typeof eulerAngle[0] === 'number';

  var _alpha = alphaIsValid ? degToRad(eulerAngle[0]) : 0;
  var _beta = degToRad(eulerAngle[1]);
  var _gamma = degToRad(eulerAngle[2]);

  var cA = Math.cos(_alpha);
  var cB = Math.cos(_beta);
  var cG = Math.cos(_gamma);
  var sA = Math.sin(_alpha);
  var sB = Math.sin(_beta);
  var sG = Math.sin(_gamma);

  var alpha = void 0,
      beta = void 0,
      gamma = void 0;

  var m = [cA * cG - sA * sB * sG, -cB * sA, cA * sG + cG * sA * sB, cG * sA + cA * sB * sG, cA * cB, sA * sG - cA * cG * sB, -cB * sG, sB, cB * cG];
  normalize(m);

  alpha = Math.atan2(-m[1], m[4]);
  alpha += alpha < 0 ? 2 * Math.PI : 0; // atan2 returns a number between -pi and +pi => make sure alpha is in [0, 2*pi[.
  beta = Math.asin(m[7]); // asin returns a number between -pi/2 and pi/2 => OK
  gamma = Math.atan2(-m[6], m[8]); // atan2 returns a number between -pi and +pi => OK

  eulerAngle[0] = alphaIsValid ? radToDeg(alpha) : null;
  eulerAngle[1] = radToDeg(beta);
  eulerAngle[2] = radToDeg(gamma);
}

/**
 * `DeviceOrientationModule` singleton.
 * The `DeviceOrientationModule` singleton provides the raw values
 * of the orientation provided by the `DeviceMotion` event.
 * It also instantiate the `Orientation` submodule that unifies those
 * values across platforms by making them compliant with {@link
 * http://www.w3.org/TR/orientation-event/|the W3C standard} (*i.e.*
 * the `alpha` angle between `0` and `360` degrees, the `beta` angle
 * between `-180` and `180` degrees, and `gamma` between `-90` and
 * `90` degrees), as well as the `OrientationAlt` submodules (with
 * the `alpha` angle between `0` and `360` degrees, the `beta` angle
 * between `-90` and `90` degrees, and `gamma` between `-180` and
 * `180` degrees).
 * When the `orientation` raw values are not provided by the sensors,
 * this modules tries to recalculate `beta` and `gamma` from the
 * `AccelerationIncludingGravity` module, if available (in that case,
 * the `alpha` angle is impossible to retrieve since the compass is
 * not available).
 *
 * @class DeviceMotionModule
 * @extends InputModule
 */

var DeviceOrientationModule = function (_InputModule) {
  _inherits(DeviceOrientationModule, _InputModule);

  /**
   * Creates the `DeviceOrientation` module instance.
   *
   * @constructor
   */
  function DeviceOrientationModule() {
    _classCallCheck(this, DeviceOrientationModule);

    /**
     * Raw values coming from the `deviceorientation` event sent by this module.
     *
     * @this DeviceOrientationModule
     * @type {number[]}
     * @default [null, null, null]
     */
    var _this = _possibleConstructorReturn(this, (DeviceOrientationModule.__proto__ || Object.getPrototypeOf(DeviceOrientationModule)).call(this, 'deviceorientation'));

    _this.event = [null, null, null];

    /**
     * The `Orientation` module.
     * Provides unified values of the orientation compliant with {@link
     * http://www.w3.org/TR/orientation-event/|the W3C standard}
     * (`alpha` in `[0, 360]`, beta in `[-180, +180]`, `gamma` in `[-90, +90]`).
     *
     * @this DeviceOrientationModule
     * @type {DOMEventSubmodule}
     */
    _this.orientation = new _DOMEventSubmodule2.default(_this, 'orientation');

    /**
     * The `OrientationAlt` module.
     * Provides alternative values of the orientation
     * (`alpha` in `[0, 360]`, beta in `[-90, +90]`, `gamma` in `[-180, +180]`).
     *
     * @this DeviceOrientationModule
     * @type {DOMEventSubmodule}
     */
    _this.orientationAlt = new _DOMEventSubmodule2.default(_this, 'orientationAlt');

    /**
     * Required submodules / events.
     *
     * @this DeviceOrientationModule
     * @type {object}
     * @property {bool} orientation - Indicates whether the `orientation` unified values are required or not (defaults to `false`).
     * @property {bool} orientationAlt - Indicates whether the `orientationAlt` values are required or not (defaults to `false`).
     */
    _this.required = {
      orientation: false,
      orientationAlt: false
    };

    /**
     * Resolve function of the module's promise.
     *
     * @this DeviceOrientationModule
     * @type {function}
     * @default null
     * @see DeviceOrientationModule#init
     */
    _this._promiseResolve = null;

    /**
     * Gravity vector calculated from the `accelerationIncludingGravity` unified values.
     *
     * @this DeviceOrientationModule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    _this._estimatedGravity = [0, 0, 0];

    _this._processFunction = null;
    _this._process = _this._process.bind(_this);
    _this._deviceorientationCheck = _this._deviceorientationCheck.bind(_this);
    _this._deviceorientationListener = _this._deviceorientationListener.bind(_this);
    return _this;
  }

  /**
   * Sensor check on initialization of the module.
   * This method:
   * - checks whether the `orientation` values are valid or not;
   * - (in the case where orientation raw values are not provided)
   *   tries to calculate the orientation from the
   *   `accelerationIncludingGravity` unified values.
   *
   * @param {DeviceMotionEvent} e - First `'devicemotion'` event caught, on which the check is done.
   */


  _createClass(DeviceOrientationModule, [{
    key: '_deviceorientationCheck',
    value: function _deviceorientationCheck(e) {
      this.isProvided = true;

      // Sensor availability for the orientation and alternative orientation
      var rawValuesProvided = typeof e.alpha === 'number' && typeof e.beta === 'number' && typeof e.gamma === 'number';
      this.orientation.isProvided = rawValuesProvided;
      this.orientationAlt.isProvided = rawValuesProvided;

      // TODO(?): get pseudo-period

      // swap the process function to the
      this._processFunction = this._deviceorientationListener;

      // If orientation or alternative orientation are not provided by raw sensors but required,
      // try to calculate them with `accelerationIncludingGravity` unified values
      if (this.required.orientation && !this.orientation.isProvided || this.required.orientationAlt && !this.orientationAlt.isProvided) this._tryAccelerationIncludingGravityFallback();else this._promiseResolve(this);
    }

    /**
     * `'deviceorientation'` event callback.
     * This method emits an event with the raw `'deviceorientation'` values,
     * and emits events with the unified `orientation` and / or the
     * `orientationAlt` values if they are required.
     *
     * @param {DeviceOrientationEvent} e - `'deviceorientation'` event the values are calculated from.
     */

  }, {
    key: '_deviceorientationListener',
    value: function _deviceorientationListener(e) {
      // 'deviceorientation' event (raw values)
      var outEvent = this.event;

      outEvent[0] = e.alpha;
      outEvent[1] = e.beta;
      outEvent[2] = e.gamma;

      if (this.listeners.size > 0) this.emit(outEvent);

      // 'orientation' event (unified values)
      if (this.orientation.listeners.size > 0 && this.required.orientation && this.orientation.isProvided) {
        // On iOS, the `alpha` value is initialized at `0` on the first `deviceorientation` event
        // so we keep that reference in memory to calculate the North later on
        if (!this.orientation._webkitCompassHeadingReference && e.webkitCompassHeading && _platform2.default.os.family === 'iOS') this.orientation._webkitCompassHeadingReference = e.webkitCompassHeading;

        var _outEvent = this.orientation.event;

        _outEvent[0] = e.alpha;
        _outEvent[1] = e.beta;
        _outEvent[2] = e.gamma;

        // On iOS, replace the `alpha` value by the North value and unify the angles
        // (the default representation of the angles on iOS is not compliant with the W3C specification)
        if (this.orientation._webkitCompassHeadingReference && _platform2.default.os.family === 'iOS') {
          _outEvent[0] += 360 - this.orientation._webkitCompassHeadingReference;
          unify(_outEvent);
        }

        this.orientation.emit(_outEvent);
      }

      // 'orientationAlt' event
      if (this.orientationAlt.listeners.size > 0 && this.required.orientationAlt && this.orientationAlt.isProvided) {
        // On iOS, the `alpha` value is initialized at `0` on the first `deviceorientation` event
        // so we keep that reference in memory to calculate the North later on
        if (!this.orientationAlt._webkitCompassHeadingReference && e.webkitCompassHeading && _platform2.default.os.family === 'iOS') this.orientationAlt._webkitCompassHeadingReference = e.webkitCompassHeading;

        var _outEvent2 = this.orientationAlt.event;

        _outEvent2[0] = e.alpha;
        _outEvent2[1] = e.beta;
        _outEvent2[2] = e.gamma;

        // On iOS, replace the `alpha` value by the North value but do not convert the angles
        // (the default representation of the angles on iOS is compliant with the alternative representation)
        if (this.orientationAlt._webkitCompassHeadingReference && _platform2.default.os.family === 'iOS') {
          _outEvent2[0] -= this.orientationAlt._webkitCompassHeadingReference;
          _outEvent2[0] += _outEvent2[0] < 0 ? 360 : 0; // make sure `alpha` is in [0, +360[
        }

        // On Android, transform the angles to the alternative representation
        // (the default representation of the angles on Android is compliant with the W3C specification)
        if (_platform2.default.os.family === 'Android') unifyAlt(_outEvent2);

        this.orientationAlt.emit(_outEvent2);
      }
    }

    /**
     * Checks whether `beta` and `gamma` can be calculated from the `accelerationIncludingGravity` values or not.
     */

  }, {
    key: '_tryAccelerationIncludingGravityFallback',
    value: function _tryAccelerationIncludingGravityFallback() {
      var _this2 = this;

      _MotionInput2.default.requireModule('accelerationIncludingGravity').then(function (accelerationIncludingGravity) {
        if (accelerationIncludingGravity.isValid) {
          console.log("WARNING (motion-input): The 'deviceorientation' event does not exist or does not provide values in your browser, so the orientation of the device is estimated from DeviceMotion's 'accelerationIncludingGravity' event. Since the compass is not available, only the `beta` and `gamma` angles are provided (`alpha` is null).");

          if (_this2.required.orientation) {
            _this2.orientation.isCalculated = true;
            _this2.orientation.period = accelerationIncludingGravity.period;

            _MotionInput2.default.addListener('accelerationIncludingGravity', function (accelerationIncludingGravity) {
              _this2._calculateBetaAndGammaFromAccelerationIncludingGravity(accelerationIncludingGravity);
            });
          }

          if (_this2.required.orientationAlt) {
            _this2.orientationAlt.isCalculated = true;
            _this2.orientationAlt.period = accelerationIncludingGravity.period;

            _MotionInput2.default.addListener('accelerationIncludingGravity', function (accelerationIncludingGravity) {
              _this2._calculateBetaAndGammaFromAccelerationIncludingGravity(accelerationIncludingGravity, true);
            });
          }
        }

        _this2._promiseResolve(_this2);
      });
    }

    /**
     * Calculates and emits `beta` and `gamma` values as a fallback of the `orientation` and / or `orientationAlt` events, from the `accelerationIncludingGravity` unified values.
     *
     * @param {number[]} accelerationIncludingGravity - Latest `accelerationIncludingGravity raw values.
     * @param {bool} [alt=false] - Indicates whether we need the alternate representation of the angles or not.
     */

  }, {
    key: '_calculateBetaAndGammaFromAccelerationIncludingGravity',
    value: function _calculateBetaAndGammaFromAccelerationIncludingGravity(accelerationIncludingGravity) {
      var alt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var k = 0.8;

      // Low pass filter to estimate the gravity
      this._estimatedGravity[0] = k * this._estimatedGravity[0] + (1 - k) * accelerationIncludingGravity[0];
      this._estimatedGravity[1] = k * this._estimatedGravity[1] + (1 - k) * accelerationIncludingGravity[1];
      this._estimatedGravity[2] = k * this._estimatedGravity[2] + (1 - k) * accelerationIncludingGravity[2];

      var _gX = this._estimatedGravity[0];
      var _gY = this._estimatedGravity[1];
      var _gZ = this._estimatedGravity[2];

      var norm = Math.sqrt(_gX * _gX + _gY * _gY + _gZ * _gZ);

      _gX /= norm;
      _gY /= norm;
      _gZ /= norm;

      // Adopting the following conventions:
      // - each matrix operates by pre-multiplying column vectors,
      // - each matrix represents an active rotation,
      // - each matrix represents the composition of intrinsic rotations,
      // the rotation matrix representing the composition of a rotation
      // about the x-axis by an angle beta and a rotation about the y-axis
      // by an angle gamma is:
      //
      // [ cos(gamma)               ,  0          ,  sin(gamma)              ,
      //   sin(beta) * sin(gamma)   ,  cos(beta)  ,  -cos(gamma) * sin(beta) ,
      //   -cos(beta) * sin(gamma)  ,  sin(beta)  ,  cos(beta) * cos(gamma)  ].
      //
      // Hence, the projection of the normalized gravity g = [0, 0, 1]
      // in the device's reference frame corresponds to:
      //
      // gX = -cos(beta) * sin(gamma),
      // gY = sin(beta),
      // gZ = cos(beta) * cos(gamma),
      //
      // so beta = asin(gY) and gamma = atan2(-gX, gZ).

      // Beta & gamma equations (we approximate [gX, gY, gZ] by [_gX, _gY, _gZ])
      var beta = radToDeg(Math.asin(_gY)); // beta is in [-pi/2; pi/2[
      var gamma = radToDeg(Math.atan2(-_gX, _gZ)); // gamma is in [-pi; pi[

      if (alt) {
        // In that case, there is nothing to do since the calculations above gave the angle in the right ranges
        var outEvent = this.orientationAlt.event;
        outEvent[0] = null;
        outEvent[1] = beta;
        outEvent[2] = gamma;

        this.orientationAlt.emit(outEvent);
      } else {
        // Here we have to unify the angles to get the ranges compliant with the W3C specification
        var _outEvent3 = this.orientation.event;
        _outEvent3[0] = null;
        _outEvent3[1] = beta;
        _outEvent3[2] = gamma;
        unify(_outEvent3);

        this.orientation.emit(_outEvent3);
      }
    }
  }, {
    key: '_process',
    value: function _process(data) {
      this._processFunction(data);
    }

    /**
     * Initializes of the module.
     *
     * @return {Promise}
     */

  }, {
    key: 'init',
    value: function init() {
      var _this3 = this;

      return _get(DeviceOrientationModule.prototype.__proto__ || Object.getPrototypeOf(DeviceOrientationModule.prototype), 'init', this).call(this, function (resolve) {
        _this3._promiseResolve = resolve;

        if (window.DeviceOrientationEvent) {
          _this3._processFunction = _this3._deviceorientationCheck;
          window.addEventListener('deviceorientation', _this3._process, false);
        } else if (_this3.required.orientation) {
          _this3._tryAccelerationIncludingGravityFallback();
        } else {
          resolve(_this3);
        }
      });
    }
  }]);

  return DeviceOrientationModule;
}(_InputModule3.default);

exports.default = new DeviceOrientationModule();

},{"./DOMEventSubmodule":1,"./InputModule":5,"./MotionInput":6,"platform":9}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _InputModule2 = require('./InputModule');

var _InputModule3 = _interopRequireDefault(_InputModule2);

var _MotionInput = require('./MotionInput');

var _MotionInput2 = _interopRequireDefault(_MotionInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Energy module singleton.
 * The energy module singleton provides energy values (between 0 and 1)
 * based on the acceleration and the rotation rate of the device.
 * The period of the energy values is the same as the period of the
 * acceleration and the rotation rate values.
 *
 * @class EnergyModule
 * @extends InputModule
 */
var EnergyModule = function (_InputModule) {
  _inherits(EnergyModule, _InputModule);

  /**
   * Creates the energy module instance.
   *
   * @constructor
   */
  function EnergyModule() {
    _classCallCheck(this, EnergyModule);

    /**
     * Event containing the value of the energy, sent by the energy module.
     *
     * @this EnergyModule
     * @type {number}
     * @default 0
     */
    var _this = _possibleConstructorReturn(this, (EnergyModule.__proto__ || Object.getPrototypeOf(EnergyModule)).call(this, 'energy'));

    _this.event = 0;

    /**
     * The acceleration module, used in the calculation of the energy.
     *
     * @this EnergyModule
     * @type {DOMEventSubmodule}
     * @default null
     * @see DevicemotionModule
     */
    _this._accelerationModule = null;

    /**
     * Latest acceleration value sent by the acceleration module.
     *
     * @this EnergyModule
     * @type {number[]}
     * @default null
     */
    _this._accelerationValues = null;

    /**
     * Maximum value reached by the acceleration magnitude, clipped at `this._accelerationMagnitudeThreshold`.
     *
     * @this EnergyModule
     * @type {number}
     * @default 9.81
     */
    _this._accelerationMagnitudeCurrentMax = 1 * 9.81;

    /**
     * Clipping value of the acceleration magnitude.
     *
     * @this EnergyModule
     * @type {number}
     * @default 20
     * @constant
     */
    _this._accelerationMagnitudeThreshold = 4 * 9.81;

    /**
     * The rotation rate module, used in the calculation of the energy.
     *
     * @this EnergyModule
     * @type {DOMEventSubmodule}
     * @default null
     * @see DevicemotionModule
     */
    _this._rotationRateModule = null;

    /**
     * Latest rotation rate value sent by the rotation rate module.
     *
     * @this EnergyModule
     * @type {number[]}
     * @default null
     */
    _this._rotationRateValues = null;

    /**
     * Maximum value reached by the rotation rate magnitude, clipped at `this._rotationRateMagnitudeThreshold`.
     *
     * @this EnergyModule
     * @type {number}
     * @default 400
     */
    _this._rotationRateMagnitudeCurrentMax = 400;

    /**
     * Clipping value of the rotation rate magnitude.
     *
     * @this EnergyModule
     * @type {number}
     * @default 600
     * @constant
     */
    _this._rotationRateMagnitudeThreshold = 600;

    /**
     * Time constant (half-life) of the low-pass filter used to smooth the energy values (in seconds).
     *
     * @this EnergyModule
     * @type {number}
     * @default 0.1
     * @constant
     */
    _this._energyTimeConstant = 0.1;

    _this._onAcceleration = _this._onAcceleration.bind(_this);
    _this._onRotationRate = _this._onRotationRate.bind(_this);
    return _this;
  }

  /**
   * Decay factor of the low-pass filter used to smooth the energy values.
   *
   * @type {number}
   * @readonly
   */


  _createClass(EnergyModule, [{
    key: 'init',


    /**
     * Initializes of the module.
     *
     * @return {Promise}
     */
    value: function init() {
      var _this2 = this;

      return _get(EnergyModule.prototype.__proto__ || Object.getPrototypeOf(EnergyModule.prototype), 'init', this).call(this, function (resolve) {
        // The energy module requires the acceleration and the rotation rate modules
        Promise.all([_MotionInput2.default.requireModule('acceleration'), _MotionInput2.default.requireModule('rotationRate')]).then(function (modules) {
          var _modules = _slicedToArray(modules, 2),
              acceleration = _modules[0],
              rotationRate = _modules[1];

          _this2._accelerationModule = acceleration;
          _this2._rotationRateModule = rotationRate;
          _this2.isCalculated = _this2._accelerationModule.isValid || _this2._rotationRateModule.isValid;

          if (_this2._accelerationModule.isValid) _this2.period = _this2._accelerationModule.period;else if (_this2._rotationRateModule.isValid) _this2.period = _this2._rotationRateModule.period;

          resolve(_this2);
        });
      });
    }
  }, {
    key: 'addListener',
    value: function addListener(listener) {
      if (this.listeners.size === 0) {
        if (this._accelerationModule.isValid) this._accelerationModule.addListener(this._onAcceleration);
        if (this._rotationRateModule.isValid) this._rotationRateModule.addListener(this._onRotationRate);
      }

      _get(EnergyModule.prototype.__proto__ || Object.getPrototypeOf(EnergyModule.prototype), 'addListener', this).call(this, listener);
    }
  }, {
    key: 'removeListener',
    value: function removeListener(listener) {
      _get(EnergyModule.prototype.__proto__ || Object.getPrototypeOf(EnergyModule.prototype), 'removeListener', this).call(this, listener);

      if (this.listeners.size === 0) {
        if (this._accelerationModule.isValid) this._accelerationModule.removeListener(this._onAcceleration);
        if (this._rotationRateModule.isValid) this._rotationRateModule.removeListener(this._onRotationRate);
      }
    }

    /**
     * Acceleration values handler.
     *
     * @param {number[]} acceleration - Latest acceleration value.
     */

  }, {
    key: '_onAcceleration',
    value: function _onAcceleration(acceleration) {
      this._accelerationValues = acceleration;

      // If the rotation rate values are not available, we calculate the energy right away.
      if (!this._rotationRateModule.isValid) this._calculateEnergy();
    }

    /**
     * Rotation rate values handler.
     *
     * @param {number[]} rotationRate - Latest rotation rate value.
     */

  }, {
    key: '_onRotationRate',
    value: function _onRotationRate(rotationRate) {
      this._rotationRateValues = rotationRate;

      // We know that the acceleration and rotation rate values coming from the
      // same `devicemotion` event are sent in that order (acceleration > rotation rate)
      // so when the rotation rate is provided, we calculate the energy value of the
      // latest `devicemotion` event when we receive the rotation rate values.
      this._calculateEnergy();
    }

    /**
     * Energy calculation: emits an energy value between 0 and 1.
     *
     * This method checks if the acceleration modules is valid. If that is the case,
     * it calculates an estimation of the energy (between 0 and 1) based on the ratio
     * of the current acceleration magnitude and the maximum acceleration magnitude
     * reached so far (clipped at the `this._accelerationMagnitudeThreshold` value).
     * (We use this trick to get uniform behaviors among devices. If we calculated
     * the ratio based on a fixed value independent of what the device is capable of
     * providing, we could get inconsistent behaviors. For instance, the devices
     * whose accelerometers are limited at 2g would always provide very low values
     * compared to devices with accelerometers capable of measuring 4g accelerations.)
     * The same checks and calculations are made on the rotation rate module.
     * Finally, the energy value is the maximum between the energy value estimated
     * from the acceleration, and the one estimated from the rotation rate. It is
     * smoothed through a low-pass filter.
     */

  }, {
    key: '_calculateEnergy',
    value: function _calculateEnergy() {
      var accelerationEnergy = 0;
      var rotationRateEnergy = 0;

      // Check the acceleration module and calculate an estimation of the energy value from the latest acceleration value
      if (this._accelerationModule.isValid) {
        var aX = this._accelerationValues[0];
        var aY = this._accelerationValues[1];
        var aZ = this._accelerationValues[2];
        var accelerationMagnitude = Math.sqrt(aX * aX + aY * aY + aZ * aZ);

        // Store the maximum acceleration magnitude reached so far, clipped at `this._accelerationMagnitudeThreshold`
        if (this._accelerationMagnitudeCurrentMax < accelerationMagnitude) this._accelerationMagnitudeCurrentMax = Math.min(accelerationMagnitude, this._accelerationMagnitudeThreshold);
        // TODO(?): remove ouliers --- on some Android devices, the magnitude is very high on a few isolated datapoints,
        // which make the threshold very high as well => the energy remains around 0.5, even when you shake very hard.

        accelerationEnergy = Math.min(accelerationMagnitude / this._accelerationMagnitudeCurrentMax, 1);
      }

      // Check the rotation rate module and calculate an estimation of the energy value from the latest rotation rate value
      if (this._rotationRateModule.isValid) {
        var rA = this._rotationRateValues[0];
        var rB = this._rotationRateValues[1];
        var rG = this._rotationRateValues[2];
        var rotationRateMagnitude = Math.sqrt(rA * rA + rB * rB + rG * rG);

        // Store the maximum rotation rate magnitude reached so far, clipped at `this._rotationRateMagnitudeThreshold`
        if (this._rotationRateMagnitudeCurrentMax < rotationRateMagnitude) this._rotationRateMagnitudeCurrentMax = Math.min(rotationRateMagnitude, this._rotationRateMagnitudeThreshold);

        rotationRateEnergy = Math.min(rotationRateMagnitude / this._rotationRateMagnitudeCurrentMax, 1);
      }

      var energy = Math.max(accelerationEnergy, rotationRateEnergy);

      // Low-pass filter to smooth the energy values
      var k = this._energyDecay;
      this.event = k * this.event + (1 - k) * energy;

      // Emit the energy value
      this.emit(this.event);
    }
  }, {
    key: '_energyDecay',
    get: function get() {
      return Math.exp(-2 * Math.PI * this.period / this._energyTimeConstant);
    }
  }]);

  return EnergyModule;
}(_InputModule3.default);

exports.default = new EnergyModule();

},{"./InputModule":5,"./MotionInput":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * `InputModule` class.
 * The `InputModule` class allows to instantiate modules that are part of the
 * motion input module, and that provide values (for instance, `deviceorientation`,
 * `acceleration`, `energy`).
 *
 * @class InputModule
 */
var InputModule = function () {

  /**
   * Creates an `InputModule` module instance.
   *
   * @constructor
   * @param {string} eventType - Name of the module / event (*e.g.* `deviceorientation, 'acceleration', 'energy').
   */
  function InputModule(eventType) {
    _classCallCheck(this, InputModule);

    /**
     * Event type of the module.
     *
     * @this InputModule
     * @type {string}
     * @constant
     */
    this.eventType = eventType;

    /**
     * Array of listeners attached to this module / event.
     *
     * @this InputModule
     * @type {Set<Function>}
     */
    this.listeners = new Set();

    /**
     * Event sent by this module.
     *
     * @this InputModule
     * @type {number|number[]}
     * @default null
     */
    this.event = null;

    /**
     * Module promise (resolved when the module is initialized).
     *
     * @this InputModule
     * @type {Promise}
     * @default null
     */
    this.promise = null;

    /**
     * Indicates if the module's event values are calculated from parent modules / events.
     *
     * @this InputModule
     * @type {bool}
     * @default false
     */
    this.isCalculated = false;

    /**
     * Indicates if the module's event values are provided by the device's sensors.
     * (*I.e.* indicates if the `'devicemotion'` or `'deviceorientation'` events provide the required raw values.)
     *
     * @this InputModule
     * @type {bool}
     * @default false
     */
    this.isProvided = false;

    /**
     * Period at which the module's events are sent (`undefined` if the events are not sent at regular intervals).
     *
     * @this InputModule
     * @type {number}
     * @default undefined
     */
    this.period = undefined;

    this.emit = this.emit.bind(this);
  }

  /**
   * Indicates whether the module can provide values or not.
   *
   * @type {bool}
   * @readonly
   */


  _createClass(InputModule, [{
    key: "init",


    /**
     * Initializes the module.
     *
     * @param {function} promiseFun - Promise function that takes the `resolve` and `reject` functions as arguments.
     * @return {Promise}
     */
    value: function init(promiseFun) {
      this.promise = new Promise(promiseFun);
      return this.promise;
    }

    /**
     * Adds a listener to the module.
     *
     * @param {function} listener - Listener to add.
     */

  }, {
    key: "addListener",
    value: function addListener(listener) {
      this.listeners.add(listener);
    }

    /**
     * Removes a listener from the module.
     *
     * @param {function} listener - Listener to remove.
     */

  }, {
    key: "removeListener",
    value: function removeListener(listener) {
      this.listeners.delete(listener);
    }

    /**
     * Propagates an event to all the module's listeners.
     *
     * @param {number|number[]} [event=this.event] - Event values to propagate to the module's listeners.
     */

  }, {
    key: "emit",
    value: function emit() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.event;

      this.listeners.forEach(function (listener) {
        return listener(event);
      });
    }
  }, {
    key: "isValid",
    get: function get() {
      return this.isProvided || this.isCalculated;
    }
  }]);

  return InputModule;
}();

exports.default = InputModule;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * `MotionInput` singleton.
 * The `MotionInput` singleton allows to initialize motion events
 * and to listen to them.
 *
 * @class MotionInput
 */
var MotionInput = function () {

  /**
   * Creates the `MotionInput` module instance.
   *
   * @constructor
   */
  function MotionInput() {
    _classCallCheck(this, MotionInput);

    /**
     * Pool of all available modules.
     *
     * @this MotionInput
     * @type {object}
     * @default {}
     */
    this.modules = {};
  }

  /**
   * Adds a module to the `MotionInput` module.
   *
   * @param {string} eventType - Name of the event type.
   * @param {InputModule} module - Module to add to the `MotionInput` module.
   */


  _createClass(MotionInput, [{
    key: "addModule",
    value: function addModule(eventType, module) {
      this.modules[eventType] = module;
    }

    /**
     * Gets a module.
     *
     * @param {string} eventType - Name of the event type (module) to retrieve.
     * @return {InputModule}
     */

  }, {
    key: "getModule",
    value: function getModule(eventType) {
      return this.modules[eventType];
    }

    /**
     * Requires a module.
     * If the module has been initialized already, returns its promise. Otherwise,
     * initializes the module.
     *
     * @param {string} eventType - Name of the event type (module) to require.
     * @return {Promise}
     */

  }, {
    key: "requireModule",
    value: function requireModule(eventType) {
      var module = this.getModule(eventType);

      if (module.promise) return module.promise;

      return module.init();
    }

    /**
     * Initializes the `MotionInput` module.
     *
     * @param {Array<String>} eventTypes - Array of the event types to initialize.
     * @return {Promise}
     */

  }, {
    key: "init",
    value: function init() {
      var _this = this;

      for (var _len = arguments.length, eventTypes = Array(_len), _key = 0; _key < _len; _key++) {
        eventTypes[_key] = arguments[_key];
      }

      if (Array.isArray(eventTypes[0])) eventTypes = eventTypes[0];

      var modulePromises = eventTypes.map(function (value) {
        var module = _this.getModule(value);
        return module.init();
      });

      return Promise.all(modulePromises);
    }

    /**
     * Adds a listener.
     *
     * @param {string} eventType - Name of the event type (module) to add a listener to.
     * @param {function} listener - Listener to add.
     */

  }, {
    key: "addListener",
    value: function addListener(eventType, listener) {
      var module = this.getModule(eventType);
      module.addListener(listener);
    }

    /**
     * Removes a listener.
     *
     * @param {string} eventType - Name of the event type (module) to add a listener to.
     * @param {function} listener - Listener to remove.
     */

  }, {
    key: "removeListener",
    value: function removeListener(eventType, listener) {
      var module = this.getModule(eventType);
      module.removeListener(listener);
    }
  }]);

  return MotionInput;
}();

exports.default = new MotionInput();

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MotionInput = require('./MotionInput');

var _MotionInput2 = _interopRequireDefault(_MotionInput);

var _DeviceOrientationModule = require('./DeviceOrientationModule');

var _DeviceOrientationModule2 = _interopRequireDefault(_DeviceOrientationModule);

var _DeviceMotionModule = require('./DeviceMotionModule');

var _DeviceMotionModule2 = _interopRequireDefault(_DeviceMotionModule);

var _EnergyModule = require('./EnergyModule');

var _EnergyModule2 = _interopRequireDefault(_EnergyModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The motion input module can be used as follows
 *
 * @example
 * import motionInput from 'motion-input';
 * const requiredEvents = ;
 *
 * motionInput
 *  .init(['acceleration', 'orientation', 'energy'])
 *  .then(([acceleration, orientation, energy]) => {
 *    if (acceleration.isValid) {
 *      acceleration.addListener((data) => {
 *        console.log('acceleration', data);
 *        // do something with the acceleration values
 *      });
 *    }
 *
 *    // ...
 *  });
 */
_MotionInput2.default.addModule('devicemotion', _DeviceMotionModule2.default);
_MotionInput2.default.addModule('deviceorientation', _DeviceOrientationModule2.default);
_MotionInput2.default.addModule('accelerationIncludingGravity', _DeviceMotionModule2.default.accelerationIncludingGravity);
_MotionInput2.default.addModule('acceleration', _DeviceMotionModule2.default.acceleration);
_MotionInput2.default.addModule('rotationRate', _DeviceMotionModule2.default.rotationRate);
_MotionInput2.default.addModule('orientation', _DeviceOrientationModule2.default.orientation);
_MotionInput2.default.addModule('orientationAlt', _DeviceOrientationModule2.default.orientationAlt);
_MotionInput2.default.addModule('energy', _EnergyModule2.default);

exports.default = _MotionInput2.default;

},{"./DeviceMotionModule":2,"./DeviceOrientationModule":3,"./EnergyModule":4,"./MotionInput":6}],8:[function(require,module,exports){
'use strict';

var _index = require('../../../dist/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Sensor support DOM elements
var accelerationIncludingGravityProvided = document.querySelector('#accelerationIncludingGravityProvided');
var accelerationProvided = document.querySelector('#accelerationProvided');
var rotationRateProvided = document.querySelector('#rotationRateProvided');
var orientationProvided = document.querySelector('#orientationProvided');

// Acceleration including gravity DOM elements
var accelerationIncludingGravityXRaw = document.querySelector('#accelerationIncludingGravityXRaw');
var accelerationIncludingGravityYRaw = document.querySelector('#accelerationIncludingGravityYRaw');
var accelerationIncludingGravityZRaw = document.querySelector('#accelerationIncludingGravityZRaw');

var accelerationIncludingGravityXUnified = document.querySelector('#accelerationIncludingGravityXUnified');
var accelerationIncludingGravityYUnified = document.querySelector('#accelerationIncludingGravityYUnified');
var accelerationIncludingGravityZUnified = document.querySelector('#accelerationIncludingGravityZUnified');

// Acceleration DOM elements
var accelerationXRaw = document.querySelector('#accelerationXRaw');
var accelerationYRaw = document.querySelector('#accelerationYRaw');
var accelerationZRaw = document.querySelector('#accelerationZRaw');

var accelerationXUnified = document.querySelector('#accelerationXUnified');
var accelerationYUnified = document.querySelector('#accelerationYUnified');
var accelerationZUnified = document.querySelector('#accelerationZUnified');

// Rotation rate DOM elements
var rotationRateAlphaRaw = document.querySelector('#rotationRateAlphaRaw');
var rotationRateBetaRaw = document.querySelector('#rotationRateBetaRaw');
var rotationRateGammaRaw = document.querySelector('#rotationRateGammaRaw');

var rotationRateAlphaUnified = document.querySelector('#rotationRateAlphaUnified');
var rotationRateBetaUnified = document.querySelector('#rotationRateBetaUnified');
var rotationRateGammaUnified = document.querySelector('#rotationRateGammaUnified');

// Orientation DOM elements
var orientationAlphaRaw = document.querySelector('#orientationAlphaRaw');
var orientationBetaRaw = document.querySelector('#orientationBetaRaw');
var orientationGammaRaw = document.querySelector('#orientationGammaRaw');

var orientationAlphaUnified = document.querySelector('#orientationAlphaUnified');
var orientationBetaUnified = document.querySelector('#orientationBetaUnified');
var orientationGammaUnified = document.querySelector('#orientationGammaUnified');

// Orientation (Alternative) DOM elements
var orientationAltAlpha = document.querySelector('#orientationAltAlpha');
var orientationAltBeta = document.querySelector('#orientationAltBeta');
var orientationAltGamma = document.querySelector('#orientationAltGamma');

// Energy DOM elements
var energy = document.querySelector('#energy');

function roundValue(input) {
  if (input === undefined) return 'undefined';
  if (input === null) return 'null';

  return Math.round(input * 100) / 100;
}

function displayProvidedSensors(modules) {
  var devicemotion = modules[0];
  var accelerationIncludingGravity = modules[1];
  var acceleration = modules[2];
  var rotationRate = modules[3];
  var deviceorientation = modules[4];
  var orientation = modules[5];
  var orientationAlt = modules[6];
  var energy = modules[7];

  if (accelerationIncludingGravity.isProvided) {
    accelerationIncludingGravityProvided.textContent = 'Yes';
    accelerationIncludingGravityProvided.classList.add('success');
    accelerationIncludingGravityProvided.classList.remove('danger');
  }

  if (acceleration.isProvided) {
    accelerationProvided.textContent = 'Yes';
    accelerationProvided.classList.add('success');
    accelerationProvided.classList.remove('danger');
  }

  if (rotationRate.isProvided) {
    rotationRateProvided.textContent = 'Yes';
    rotationRateProvided.classList.add('success');
    rotationRateProvided.classList.remove('danger');
  }

  if (orientation.isProvided) {
    orientationProvided.textContent = 'Yes';
    orientationProvided.classList.add('success');
    orientationProvided.classList.remove('danger');
  }
}

function displayDeviceorientationRaw(module) {
  if (module.isValid) {
    module.addListener(function (val) {
      orientationAlphaRaw.textContent = roundValue(val[0]);
      orientationBetaRaw.textContent = roundValue(val[1]);
      orientationGammaRaw.textContent = roundValue(val[2]);
    });
  }
}

function displayDevicemotionRaw(module) {
  if (module.isValid) {
    module.addListener(function (val) {
      accelerationIncludingGravityXRaw.textContent = roundValue(val[0]);
      accelerationIncludingGravityYRaw.textContent = roundValue(val[1]);
      accelerationIncludingGravityZRaw.textContent = roundValue(val[2]);

      accelerationXRaw.textContent = roundValue(val[3]);
      accelerationYRaw.textContent = roundValue(val[4]);
      accelerationZRaw.textContent = roundValue(val[5]);

      rotationRateAlphaRaw.textContent = roundValue(val[6]);
      rotationRateBetaRaw.textContent = roundValue(val[7]);
      rotationRateGammaRaw.textContent = roundValue(val[8]);
    });
  }
}

function displayAccelerationIncludingGravity(module) {
  if (module.isValid) {
    module.addListener(function (val) {
      accelerationIncludingGravityXUnified.textContent = roundValue(val[0]);
      accelerationIncludingGravityYUnified.textContent = roundValue(val[1]);
      accelerationIncludingGravityZUnified.textContent = roundValue(val[2]);
    });
  }
}

function displayAcceleration(module) {
  if (module.isValid) {
    module.addListener(function (val) {
      accelerationXUnified.textContent = roundValue(val[0]);
      accelerationYUnified.textContent = roundValue(val[1]);
      accelerationZUnified.textContent = roundValue(val[2]);
    });
  }
}

function displayRotationRate(module) {
  if (module.isValid) {
    module.addListener(function (val) {
      rotationRateAlphaUnified.textContent = roundValue(val[0]);
      rotationRateBetaUnified.textContent = roundValue(val[1]);
      rotationRateGammaUnified.textContent = roundValue(val[2]);
    });
  }
}

function displayOrientation(module) {
  if (module.isValid) {
    module.addListener(function (val) {
      orientationAlphaUnified.textContent = roundValue(val[0]);
      orientationBetaUnified.textContent = roundValue(val[1]);
      orientationGammaUnified.textContent = roundValue(val[2]);
    });
  }
}

function displayOrientationAlt(module) {
  if (module.isValid) {
    module.addListener(function (val) {
      orientationAltAlpha.textContent = roundValue(val[0]);
      orientationAltBeta.textContent = roundValue(val[1]);
      orientationAltGamma.textContent = roundValue(val[2]);
    });
  }
}

function displayEnergy(module) {
  if (module.isValid) {
    module.addListener(function (val) {
      energy.textContent = roundValue(val);
    });
  }
}

_index2.default.init(['devicemotion', 'accelerationIncludingGravity', 'acceleration', 'rotationRate', 'deviceorientation', 'orientation', 'orientationAlt', 'energy']).then(function (modules) {
  var devicemotion = modules[0];
  var accelerationIncludingGravity = modules[1];
  var acceleration = modules[2];
  var rotationRate = modules[3];
  var deviceorientation = modules[4];
  var orientation = modules[5];
  var orientationAlt = modules[6];
  var energy = modules[7];

  displayProvidedSensors(modules);
  displayDevicemotionRaw(devicemotion);
  displayAccelerationIncludingGravity(accelerationIncludingGravity);
  displayAcceleration(acceleration);
  displayRotationRate(rotationRate);
  displayDeviceorientationRaw(deviceorientation);
  displayOrientation(orientation);
  displayOrientationAlt(orientationAlt);
  displayEnergy(energy);
}).catch(function (err) {
  return console.error(err.stack);
});

},{"../../../dist/index":7}],9:[function(require,module,exports){
(function (global){
/*!
 * Platform.js <https://mths.be/platform>
 * Copyright 2014-2016 Benjamin Tan <https://demoneaux.github.io/>
 * Copyright 2011-2013 John-David Dalton <http://allyoucanleet.com/>
 * Available under MIT license <https://mths.be/mit>
 */
;(function() {
  'use strict';

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used as a reference to the global object. */
  var root = (objectTypes[typeof window] && window) || this;

  /** Backup possible global object. */
  var oldRoot = root;

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  /**
   * Used as the maximum length of an array-like object.
   * See the [ES6 spec](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
   * for more details.
   */
  var maxSafeInteger = Math.pow(2, 53) - 1;

  /** Regular expression to detect Opera. */
  var reOpera = /\bOpera/;

  /** Possible global object. */
  var thisBinding = this;

  /** Used for native method references. */
  var objectProto = Object.prototype;

  /** Used to check for own properties of an object. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /** Used to resolve the internal `[[Class]]` of values. */
  var toString = objectProto.toString;

  /*--------------------------------------------------------------------------*/

  /**
   * Capitalizes a string value.
   *
   * @private
   * @param {string} string The string to capitalize.
   * @returns {string} The capitalized string.
   */
  function capitalize(string) {
    string = String(string);
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * A utility function to clean up the OS name.
   *
   * @private
   * @param {string} os The OS name to clean up.
   * @param {string} [pattern] A `RegExp` pattern matching the OS name.
   * @param {string} [label] A label for the OS.
   */
  function cleanupOS(os, pattern, label) {
    // Platform tokens are defined at:
    // http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
    // http://web.archive.org/web/20081122053950/http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
    var data = {
      '10.0': '10',
      '6.4':  '10 Technical Preview',
      '6.3':  '8.1',
      '6.2':  '8',
      '6.1':  'Server 2008 R2 / 7',
      '6.0':  'Server 2008 / Vista',
      '5.2':  'Server 2003 / XP 64-bit',
      '5.1':  'XP',
      '5.01': '2000 SP1',
      '5.0':  '2000',
      '4.0':  'NT',
      '4.90': 'ME'
    };
    // Detect Windows version from platform tokens.
    if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) &&
        (data = data[/[\d.]+$/.exec(os)])) {
      os = 'Windows ' + data;
    }
    // Correct character case and cleanup string.
    os = String(os);

    if (pattern && label) {
      os = os.replace(RegExp(pattern, 'i'), label);
    }

    os = format(
      os.replace(/ ce$/i, ' CE')
        .replace(/\bhpw/i, 'web')
        .replace(/\bMacintosh\b/, 'Mac OS')
        .replace(/_PowerPC\b/i, ' OS')
        .replace(/\b(OS X) [^ \d]+/i, '$1')
        .replace(/\bMac (OS X)\b/, '$1')
        .replace(/\/(\d)/, ' $1')
        .replace(/_/g, '.')
        .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '')
        .replace(/\bx86\.64\b/gi, 'x86_64')
        .replace(/\b(Windows Phone) OS\b/, '$1')
        .replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1')
        .split(' on ')[0]
    );

    return os;
  }

  /**
   * An iteration utility for arrays and objects.
   *
   * @private
   * @param {Array|Object} object The object to iterate over.
   * @param {Function} callback The function called per iteration.
   */
  function each(object, callback) {
    var index = -1,
        length = object ? object.length : 0;

    if (typeof length == 'number' && length > -1 && length <= maxSafeInteger) {
      while (++index < length) {
        callback(object[index], index, object);
      }
    } else {
      forOwn(object, callback);
    }
  }

  /**
   * Trim and conditionally capitalize string values.
   *
   * @private
   * @param {string} string The string to format.
   * @returns {string} The formatted string.
   */
  function format(string) {
    string = trim(string);
    return /^(?:webOS|i(?:OS|P))/.test(string)
      ? string
      : capitalize(string);
  }

  /**
   * Iterates over an object's own properties, executing the `callback` for each.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} callback The function executed per own property.
   */
  function forOwn(object, callback) {
    for (var key in object) {
      if (hasOwnProperty.call(object, key)) {
        callback(object[key], key, object);
      }
    }
  }

  /**
   * Gets the internal `[[Class]]` of a value.
   *
   * @private
   * @param {*} value The value.
   * @returns {string} The `[[Class]]`.
   */
  function getClassOf(value) {
    return value == null
      ? capitalize(value)
      : toString.call(value).slice(8, -1);
  }

  /**
   * Host objects can return type values that are different from their actual
   * data type. The objects we are concerned with usually return non-primitive
   * types of "object", "function", or "unknown".
   *
   * @private
   * @param {*} object The owner of the property.
   * @param {string} property The property to check.
   * @returns {boolean} Returns `true` if the property value is a non-primitive, else `false`.
   */
  function isHostType(object, property) {
    var type = object != null ? typeof object[property] : 'number';
    return !/^(?:boolean|number|string|undefined)$/.test(type) &&
      (type == 'object' ? !!object[property] : true);
  }

  /**
   * Prepares a string for use in a `RegExp` by making hyphens and spaces optional.
   *
   * @private
   * @param {string} string The string to qualify.
   * @returns {string} The qualified string.
   */
  function qualify(string) {
    return String(string).replace(/([ -])(?!$)/g, '$1?');
  }

  /**
   * A bare-bones `Array#reduce` like utility function.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function called per iteration.
   * @returns {*} The accumulated result.
   */
  function reduce(array, callback) {
    var accumulator = null;
    each(array, function(value, index) {
      accumulator = callback(accumulator, value, index, array);
    });
    return accumulator;
  }

  /**
   * Removes leading and trailing whitespace from a string.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} The trimmed string.
   */
  function trim(string) {
    return String(string).replace(/^ +| +$/g, '');
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a new platform object.
   *
   * @memberOf platform
   * @param {Object|string} [ua=navigator.userAgent] The user agent string or
   *  context object.
   * @returns {Object} A platform object.
   */
  function parse(ua) {

    /** The environment context object. */
    var context = root;

    /** Used to flag when a custom context is provided. */
    var isCustomContext = ua && typeof ua == 'object' && getClassOf(ua) != 'String';

    // Juggle arguments.
    if (isCustomContext) {
      context = ua;
      ua = null;
    }

    /** Browser navigator object. */
    var nav = context.navigator || {};

    /** Browser user agent string. */
    var userAgent = nav.userAgent || '';

    ua || (ua = userAgent);

    /** Used to flag when `thisBinding` is the [ModuleScope]. */
    var isModuleScope = isCustomContext || thisBinding == oldRoot;

    /** Used to detect if browser is like Chrome. */
    var likeChrome = isCustomContext
      ? !!nav.likeChrome
      : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());

    /** Internal `[[Class]]` value shortcuts. */
    var objectClass = 'Object',
        airRuntimeClass = isCustomContext ? objectClass : 'ScriptBridgingProxyObject',
        enviroClass = isCustomContext ? objectClass : 'Environment',
        javaClass = (isCustomContext && context.java) ? 'JavaPackage' : getClassOf(context.java),
        phantomClass = isCustomContext ? objectClass : 'RuntimeObject';

    /** Detect Java environments. */
    var java = /\bJava/.test(javaClass) && context.java;

    /** Detect Rhino. */
    var rhino = java && getClassOf(context.environment) == enviroClass;

    /** A character to represent alpha. */
    var alpha = java ? 'a' : '\u03b1';

    /** A character to represent beta. */
    var beta = java ? 'b' : '\u03b2';

    /** Browser document object. */
    var doc = context.document || {};

    /**
     * Detect Opera browser (Presto-based).
     * http://www.howtocreate.co.uk/operaStuff/operaObject.html
     * http://dev.opera.com/articles/view/opera-mini-web-content-authoring-guidelines/#operamini
     */
    var opera = context.operamini || context.opera;

    /** Opera `[[Class]]`. */
    var operaClass = reOpera.test(operaClass = (isCustomContext && opera) ? opera['[[Class]]'] : getClassOf(opera))
      ? operaClass
      : (opera = null);

    /*------------------------------------------------------------------------*/

    /** Temporary variable used over the script's lifetime. */
    var data;

    /** The CPU architecture. */
    var arch = ua;

    /** Platform description array. */
    var description = [];

    /** Platform alpha/beta indicator. */
    var prerelease = null;

    /** A flag to indicate that environment features should be used to resolve the platform. */
    var useFeatures = ua == userAgent;

    /** The browser/environment version. */
    var version = useFeatures && opera && typeof opera.version == 'function' && opera.version();

    /** A flag to indicate if the OS ends with "/ Version" */
    var isSpecialCasedOS;

    /* Detectable layout engines (order is important). */
    var layout = getLayout([
      { 'label': 'EdgeHTML', 'pattern': 'Edge' },
      'Trident',
      { 'label': 'WebKit', 'pattern': 'AppleWebKit' },
      'iCab',
      'Presto',
      'NetFront',
      'Tasman',
      'KHTML',
      'Gecko'
    ]);

    /* Detectable browser names (order is important). */
    var name = getName([
      'Adobe AIR',
      'Arora',
      'Avant Browser',
      'Breach',
      'Camino',
      'Epiphany',
      'Fennec',
      'Flock',
      'Galeon',
      'GreenBrowser',
      'iCab',
      'Iceweasel',
      'K-Meleon',
      'Konqueror',
      'Lunascape',
      'Maxthon',
      { 'label': 'Microsoft Edge', 'pattern': 'Edge' },
      'Midori',
      'Nook Browser',
      'PaleMoon',
      'PhantomJS',
      'Raven',
      'Rekonq',
      'RockMelt',
      'SeaMonkey',
      { 'label': 'Silk', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
      'Sleipnir',
      'SlimBrowser',
      { 'label': 'SRWare Iron', 'pattern': 'Iron' },
      'Sunrise',
      'Swiftfox',
      'WebPositive',
      'Opera Mini',
      { 'label': 'Opera Mini', 'pattern': 'OPiOS' },
      'Opera',
      { 'label': 'Opera', 'pattern': 'OPR' },
      'Chrome',
      { 'label': 'Chrome Mobile', 'pattern': '(?:CriOS|CrMo)' },
      { 'label': 'Firefox', 'pattern': '(?:Firefox|Minefield)' },
      { 'label': 'Firefox for iOS', 'pattern': 'FxiOS' },
      { 'label': 'IE', 'pattern': 'IEMobile' },
      { 'label': 'IE', 'pattern': 'MSIE' },
      'Safari'
    ]);

    /* Detectable products (order is important). */
    var product = getProduct([
      { 'label': 'BlackBerry', 'pattern': 'BB10' },
      'BlackBerry',
      { 'label': 'Galaxy S', 'pattern': 'GT-I9000' },
      { 'label': 'Galaxy S2', 'pattern': 'GT-I9100' },
      { 'label': 'Galaxy S3', 'pattern': 'GT-I9300' },
      { 'label': 'Galaxy S4', 'pattern': 'GT-I9500' },
      'Google TV',
      'Lumia',
      'iPad',
      'iPod',
      'iPhone',
      'Kindle',
      { 'label': 'Kindle Fire', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
      'Nexus',
      'Nook',
      'PlayBook',
      'PlayStation 3',
      'PlayStation 4',
      'PlayStation Vita',
      'TouchPad',
      'Transformer',
      { 'label': 'Wii U', 'pattern': 'WiiU' },
      'Wii',
      'Xbox One',
      { 'label': 'Xbox 360', 'pattern': 'Xbox' },
      'Xoom'
    ]);

    /* Detectable manufacturers. */
    var manufacturer = getManufacturer({
      'Apple': { 'iPad': 1, 'iPhone': 1, 'iPod': 1 },
      'Archos': {},
      'Amazon': { 'Kindle': 1, 'Kindle Fire': 1 },
      'Asus': { 'Transformer': 1 },
      'Barnes & Noble': { 'Nook': 1 },
      'BlackBerry': { 'PlayBook': 1 },
      'Google': { 'Google TV': 1, 'Nexus': 1 },
      'HP': { 'TouchPad': 1 },
      'HTC': {},
      'LG': {},
      'Microsoft': { 'Xbox': 1, 'Xbox One': 1 },
      'Motorola': { 'Xoom': 1 },
      'Nintendo': { 'Wii U': 1,  'Wii': 1 },
      'Nokia': { 'Lumia': 1 },
      'Samsung': { 'Galaxy S': 1, 'Galaxy S2': 1, 'Galaxy S3': 1, 'Galaxy S4': 1 },
      'Sony': { 'PlayStation 4': 1, 'PlayStation 3': 1, 'PlayStation Vita': 1 }
    });

    /* Detectable operating systems (order is important). */
    var os = getOS([
      'Windows Phone',
      'Android',
      'CentOS',
      { 'label': 'Chrome OS', 'pattern': 'CrOS' },
      'Debian',
      'Fedora',
      'FreeBSD',
      'Gentoo',
      'Haiku',
      'Kubuntu',
      'Linux Mint',
      'OpenBSD',
      'Red Hat',
      'SuSE',
      'Ubuntu',
      'Xubuntu',
      'Cygwin',
      'Symbian OS',
      'hpwOS',
      'webOS ',
      'webOS',
      'Tablet OS',
      'Linux',
      'Mac OS X',
      'Macintosh',
      'Mac',
      'Windows 98;',
      'Windows '
    ]);

    /*------------------------------------------------------------------------*/

    /**
     * Picks the layout engine from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected layout engine.
     */
    function getLayout(guesses) {
      return reduce(guesses, function(result, guess) {
        return result || RegExp('\\b' + (
          guess.pattern || qualify(guess)
        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
      });
    }

    /**
     * Picks the manufacturer from an array of guesses.
     *
     * @private
     * @param {Array} guesses An object of guesses.
     * @returns {null|string} The detected manufacturer.
     */
    function getManufacturer(guesses) {
      return reduce(guesses, function(result, value, key) {
        // Lookup the manufacturer by product or scan the UA for the manufacturer.
        return result || (
          value[product] ||
          value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] ||
          RegExp('\\b' + qualify(key) + '(?:\\b|\\w*\\d)', 'i').exec(ua)
        ) && key;
      });
    }

    /**
     * Picks the browser name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected browser name.
     */
    function getName(guesses) {
      return reduce(guesses, function(result, guess) {
        return result || RegExp('\\b' + (
          guess.pattern || qualify(guess)
        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
      });
    }

    /**
     * Picks the OS name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected OS name.
     */
    function getOS(guesses) {
      return reduce(guesses, function(result, guess) {
        var pattern = guess.pattern || qualify(guess);
        if (!result && (result =
              RegExp('\\b' + pattern + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua)
            )) {
          result = cleanupOS(result, pattern, guess.label || guess);
        }
        return result;
      });
    }

    /**
     * Picks the product name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected product name.
     */
    function getProduct(guesses) {
      return reduce(guesses, function(result, guess) {
        var pattern = guess.pattern || qualify(guess);
        if (!result && (result =
              RegExp('\\b' + pattern + ' *\\d+[.\\w_]*', 'i').exec(ua) ||
              RegExp('\\b' + pattern + '(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').exec(ua)
            )) {
          // Split by forward slash and append product version if needed.
          if ((result = String((guess.label && !RegExp(pattern, 'i').test(guess.label)) ? guess.label : result).split('/'))[1] && !/[\d.]+/.test(result[0])) {
            result[0] += ' ' + result[1];
          }
          // Correct character case and cleanup string.
          guess = guess.label || guess;
          result = format(result[0]
            .replace(RegExp(pattern, 'i'), guess)
            .replace(RegExp('; *(?:' + guess + '[_-])?', 'i'), ' ')
            .replace(RegExp('(' + guess + ')[-_.]?(\\w)', 'i'), '$1 $2'));
        }
        return result;
      });
    }

    /**
     * Resolves the version using an array of UA patterns.
     *
     * @private
     * @param {Array} patterns An array of UA patterns.
     * @returns {null|string} The detected version.
     */
    function getVersion(patterns) {
      return reduce(patterns, function(result, pattern) {
        return result || (RegExp(pattern +
          '(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)', 'i').exec(ua) || 0)[1] || null;
      });
    }

    /**
     * Returns `platform.description` when the platform object is coerced to a string.
     *
     * @name toString
     * @memberOf platform
     * @returns {string} Returns `platform.description` if available, else an empty string.
     */
    function toStringPlatform() {
      return this.description || '';
    }

    /*------------------------------------------------------------------------*/

    // Convert layout to an array so we can add extra details.
    layout && (layout = [layout]);

    // Detect product names that contain their manufacturer's name.
    if (manufacturer && !product) {
      product = getProduct([manufacturer]);
    }
    // Clean up Google TV.
    if ((data = /\bGoogle TV\b/.exec(product))) {
      product = data[0];
    }
    // Detect simulators.
    if (/\bSimulator\b/i.test(ua)) {
      product = (product ? product + ' ' : '') + 'Simulator';
    }
    // Detect Opera Mini 8+ running in Turbo/Uncompressed mode on iOS.
    if (name == 'Opera Mini' && /\bOPiOS\b/.test(ua)) {
      description.push('running in Turbo/Uncompressed mode');
    }
    // Detect IE Mobile 11.
    if (name == 'IE' && /\blike iPhone OS\b/.test(ua)) {
      data = parse(ua.replace(/like iPhone OS/, ''));
      manufacturer = data.manufacturer;
      product = data.product;
    }
    // Detect iOS.
    else if (/^iP/.test(product)) {
      name || (name = 'Safari');
      os = 'iOS' + ((data = / OS ([\d_]+)/i.exec(ua))
        ? ' ' + data[1].replace(/_/g, '.')
        : '');
    }
    // Detect Kubuntu.
    else if (name == 'Konqueror' && !/buntu/i.test(os)) {
      os = 'Kubuntu';
    }
    // Detect Android browsers.
    else if ((manufacturer && manufacturer != 'Google' &&
        ((/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua)) || /\bVita\b/.test(product))) ||
        (/\bAndroid\b/.test(os) && /^Chrome/.test(name) && /\bVersion\//i.test(ua))) {
      name = 'Android Browser';
      os = /\bAndroid\b/.test(os) ? os : 'Android';
    }
    // Detect Silk desktop/accelerated modes.
    else if (name == 'Silk') {
      if (!/\bMobi/i.test(ua)) {
        os = 'Android';
        description.unshift('desktop mode');
      }
      if (/Accelerated *= *true/i.test(ua)) {
        description.unshift('accelerated');
      }
    }
    // Detect PaleMoon identifying as Firefox.
    else if (name == 'PaleMoon' && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
      description.push('identifying as Firefox ' + data[1]);
    }
    // Detect Firefox OS and products running Firefox.
    else if (name == 'Firefox' && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
      os || (os = 'Firefox OS');
      product || (product = data[1]);
    }
    // Detect false positives for Firefox/Safari.
    else if (!name || (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
      // Escape the `/` for Firefox 1.
      if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + '/') + 8))) {
        // Clear name of false positives.
        name = null;
      }
      // Reassign a generic name.
      if ((data = product || manufacturer || os) &&
          (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
        name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + ' Browser';
      }
    }
    // Detect non-Opera (Presto-based) versions (order is important).
    if (!version) {
      version = getVersion([
        '(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|Silk(?!/[\\d.]+$))',
        'Version',
        qualify(name),
        '(?:Firefox|Minefield|NetFront)'
      ]);
    }
    // Detect stubborn layout engines.
    if ((data =
          layout == 'iCab' && parseFloat(version) > 3 && 'WebKit' ||
          /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? 'Blink' : 'Presto') ||
          /\b(?:Midori|Nook|Safari)\b/i.test(ua) && !/^(?:Trident|EdgeHTML)$/.test(layout) && 'WebKit' ||
          !layout && /\bMSIE\b/i.test(ua) && (os == 'Mac OS' ? 'Tasman' : 'Trident') ||
          layout == 'WebKit' && /\bPlayStation\b(?! Vita\b)/i.test(name) && 'NetFront'
        )) {
      layout = [data];
    }
    // Detect Windows Phone 7 desktop mode.
    if (name == 'IE' && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
      name += ' Mobile';
      os = 'Windows Phone ' + (/\+$/.test(data) ? data : data + '.x');
      description.unshift('desktop mode');
    }
    // Detect Windows Phone 8.x desktop mode.
    else if (/\bWPDesktop\b/i.test(ua)) {
      name = 'IE Mobile';
      os = 'Windows Phone 8.x';
      description.unshift('desktop mode');
      version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
    }
    // Detect IE 11.
    else if (name != 'IE' && layout == 'Trident' && (data = /\brv:([\d.]+)/.exec(ua))) {
      if (name) {
        description.push('identifying as ' + name + (version ? ' ' + version : ''));
      }
      name = 'IE';
      version = data[1];
    }
    // Leverage environment features.
    if (useFeatures) {
      // Detect server-side environments.
      // Rhino has a global function while others have a global object.
      if (isHostType(context, 'global')) {
        if (java) {
          data = java.lang.System;
          arch = data.getProperty('os.arch');
          os = os || data.getProperty('os.name') + ' ' + data.getProperty('os.version');
        }
        if (isModuleScope && isHostType(context, 'system') && (data = [context.system])[0]) {
          os || (os = data[0].os || null);
          try {
            data[1] = context.require('ringo/engine').version;
            version = data[1].join('.');
            name = 'RingoJS';
          } catch(e) {
            if (data[0].global.system == context.system) {
              name = 'Narwhal';
            }
          }
        }
        else if (
          typeof context.process == 'object' && !context.process.browser &&
          (data = context.process)
        ) {
          name = 'Node.js';
          arch = data.arch;
          os = data.platform;
          version = /[\d.]+/.exec(data.version)[0];
        }
        else if (rhino) {
          name = 'Rhino';
        }
      }
      // Detect Adobe AIR.
      else if (getClassOf((data = context.runtime)) == airRuntimeClass) {
        name = 'Adobe AIR';
        os = data.flash.system.Capabilities.os;
      }
      // Detect PhantomJS.
      else if (getClassOf((data = context.phantom)) == phantomClass) {
        name = 'PhantomJS';
        version = (data = data.version || null) && (data.major + '.' + data.minor + '.' + data.patch);
      }
      // Detect IE compatibility modes.
      else if (typeof doc.documentMode == 'number' && (data = /\bTrident\/(\d+)/i.exec(ua))) {
        // We're in compatibility mode when the Trident version + 4 doesn't
        // equal the document mode.
        version = [version, doc.documentMode];
        if ((data = +data[1] + 4) != version[1]) {
          description.push('IE ' + version[1] + ' mode');
          layout && (layout[1] = '');
          version[1] = data;
        }
        version = name == 'IE' ? String(version[1].toFixed(1)) : version[0];
      }
      os = os && format(os);
    }
    // Detect prerelease phases.
    if (version && (data =
          /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) ||
          /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ';' + (useFeatures && nav.appMinorVersion)) ||
          /\bMinefield\b/i.test(ua) && 'a'
        )) {
      prerelease = /b/i.test(data) ? 'beta' : 'alpha';
      version = version.replace(RegExp(data + '\\+?$'), '') +
        (prerelease == 'beta' ? beta : alpha) + (/\d+\+?/.exec(data) || '');
    }
    // Detect Firefox Mobile.
    if (name == 'Fennec' || name == 'Firefox' && /\b(?:Android|Firefox OS)\b/.test(os)) {
      name = 'Firefox Mobile';
    }
    // Obscure Maxthon's unreliable version.
    else if (name == 'Maxthon' && version) {
      version = version.replace(/\.[\d.]+/, '.x');
    }
    // Detect Xbox 360 and Xbox One.
    else if (/\bXbox\b/i.test(product)) {
      os = null;
      if (product == 'Xbox 360' && /\bIEMobile\b/.test(ua)) {
        description.unshift('mobile mode');
      }
    }
    // Add mobile postfix.
    else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) &&
        (os == 'Windows CE' || /Mobi/i.test(ua))) {
      name += ' Mobile';
    }
    // Detect IE platform preview.
    else if (name == 'IE' && useFeatures && context.external === null) {
      description.unshift('platform preview');
    }
    // Detect BlackBerry OS version.
    // http://docs.blackberry.com/en/developers/deliverables/18169/HTTP_headers_sent_by_BB_Browser_1234911_11.jsp
    else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data =
          (RegExp(product.replace(/ +/g, ' *') + '/([.\\d]+)', 'i').exec(ua) || 0)[1] ||
          version
        )) {
      data = [data, /BB10/.test(ua)];
      os = (data[1] ? (product = null, manufacturer = 'BlackBerry') : 'Device Software') + ' ' + data[0];
      version = null;
    }
    // Detect Opera identifying/masking itself as another browser.
    // http://www.opera.com/support/kb/view/843/
    else if (this != forOwn && product != 'Wii' && (
          (useFeatures && opera) ||
          (/Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua)) ||
          (name == 'Firefox' && /\bOS X (?:\d+\.){2,}/.test(os)) ||
          (name == 'IE' && (
            (os && !/^Win/.test(os) && version > 5.5) ||
            /\bWindows XP\b/.test(os) && version > 8 ||
            version == 8 && !/\bTrident\b/.test(ua)
          ))
        ) && !reOpera.test((data = parse.call(forOwn, ua.replace(reOpera, '') + ';'))) && data.name) {
      // When "identifying", the UA contains both Opera and the other browser's name.
      data = 'ing as ' + data.name + ((data = data.version) ? ' ' + data : '');
      if (reOpera.test(name)) {
        if (/\bIE\b/.test(data) && os == 'Mac OS') {
          os = null;
        }
        data = 'identify' + data;
      }
      // When "masking", the UA contains only the other browser's name.
      else {
        data = 'mask' + data;
        if (operaClass) {
          name = format(operaClass.replace(/([a-z])([A-Z])/g, '$1 $2'));
        } else {
          name = 'Opera';
        }
        if (/\bIE\b/.test(data)) {
          os = null;
        }
        if (!useFeatures) {
          version = null;
        }
      }
      layout = ['Presto'];
      description.push(data);
    }
    // Detect WebKit Nightly and approximate Chrome/Safari versions.
    if ((data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
      // Correct build number for numeric comparison.
      // (e.g. "532.5" becomes "532.05")
      data = [parseFloat(data.replace(/\.(\d)$/, '.0$1')), data];
      // Nightly builds are postfixed with a "+".
      if (name == 'Safari' && data[1].slice(-1) == '+') {
        name = 'WebKit Nightly';
        prerelease = 'alpha';
        version = data[1].slice(0, -1);
      }
      // Clear incorrect browser versions.
      else if (version == data[1] ||
          version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
        version = null;
      }
      // Use the full Chrome version when available.
      data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];
      // Detect Blink layout engine.
      if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && layout == 'WebKit') {
        layout = ['Blink'];
      }
      // Detect JavaScriptCore.
      // http://stackoverflow.com/questions/6768474/how-can-i-detect-which-javascript-engine-v8-or-jsc-is-used-at-runtime-in-androi
      if (!useFeatures || (!likeChrome && !data[1])) {
        layout && (layout[1] = 'like Safari');
        data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? '4+' : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : '8');
      } else {
        layout && (layout[1] = 'like Chrome');
        data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.10 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.30 ? 11 : data < 535.01 ? 12 : data < 535.02 ? '13+' : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.10 ? 19 : data < 537.01 ? 20 : data < 537.11 ? '21+' : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != 'Blink' ? '27' : '28');
      }
      // Add the postfix of ".x" or "+" for approximate versions.
      layout && (layout[1] += ' ' + (data += typeof data == 'number' ? '.x' : /[.+]/.test(data) ? '' : '+'));
      // Obscure version for some Safari 1-2 releases.
      if (name == 'Safari' && (!version || parseInt(version) > 45)) {
        version = data;
      }
    }
    // Detect Opera desktop modes.
    if (name == 'Opera' &&  (data = /\bzbov|zvav$/.exec(os))) {
      name += ' ';
      description.unshift('desktop mode');
      if (data == 'zvav') {
        name += 'Mini';
        version = null;
      } else {
        name += 'Mobile';
      }
      os = os.replace(RegExp(' *' + data + '$'), '');
    }
    // Detect Chrome desktop mode.
    else if (name == 'Safari' && /\bChrome\b/.exec(layout && layout[1])) {
      description.unshift('desktop mode');
      name = 'Chrome Mobile';
      version = null;

      if (/\bOS X\b/.test(os)) {
        manufacturer = 'Apple';
        os = 'iOS 4.3+';
      } else {
        os = null;
      }
    }
    // Strip incorrect OS versions.
    if (version && version.indexOf((data = /[\d.]+$/.exec(os))) == 0 &&
        ua.indexOf('/' + data + '-') > -1) {
      os = trim(os.replace(data, ''));
    }
    // Add layout engine.
    if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (
        /Browser|Lunascape|Maxthon/.test(name) ||
        name != 'Safari' && /^iOS/.test(os) && /\bSafari\b/.test(layout[1]) ||
        /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Sleipnir|Web)/.test(name) && layout[1])) {
      // Don't add layout details to description if they are falsey.
      (data = layout[layout.length - 1]) && description.push(data);
    }
    // Combine contextual information.
    if (description.length) {
      description = ['(' + description.join('; ') + ')'];
    }
    // Append manufacturer to description.
    if (manufacturer && product && product.indexOf(manufacturer) < 0) {
      description.push('on ' + manufacturer);
    }
    // Append product to description.
    if (product) {
      description.push((/^on /.test(description[description.length - 1]) ? '' : 'on ') + product);
    }
    // Parse the OS into an object.
    if (os) {
      data = / ([\d.+]+)$/.exec(os);
      isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == '/';
      os = {
        'architecture': 32,
        'family': (data && !isSpecialCasedOS) ? os.replace(data[0], '') : os,
        'version': data ? data[1] : null,
        'toString': function() {
          var version = this.version;
          return this.family + ((version && !isSpecialCasedOS) ? ' ' + version : '') + (this.architecture == 64 ? ' 64-bit' : '');
        }
      };
    }
    // Add browser/OS architecture.
    if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
      if (os) {
        os.architecture = 64;
        os.family = os.family.replace(RegExp(' *' + data), '');
      }
      if (
          name && (/\bWOW64\b/i.test(ua) ||
          (useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua)))
      ) {
        description.unshift('32-bit');
      }
    }
    // Chrome 39 and above on OS X is always 64-bit.
    else if (
        os && /^OS X/.test(os.family) &&
        name == 'Chrome' && parseFloat(version) >= 39
    ) {
      os.architecture = 64;
    }

    ua || (ua = null);

    /*------------------------------------------------------------------------*/

    /**
     * The platform object.
     *
     * @name platform
     * @type Object
     */
    var platform = {};

    /**
     * The platform description.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.description = ua;

    /**
     * The name of the browser's layout engine.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.layout = layout && layout[0];

    /**
     * The name of the product's manufacturer.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.manufacturer = manufacturer;

    /**
     * The name of the browser/environment.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.name = name;

    /**
     * The alpha/beta release indicator.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.prerelease = prerelease;

    /**
     * The name of the product hosting the browser.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.product = product;

    /**
     * The browser's user agent string.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.ua = ua;

    /**
     * The browser/environment version.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.version = name && version;

    /**
     * The name of the operating system.
     *
     * @memberOf platform
     * @type Object
     */
    platform.os = os || {

      /**
       * The CPU architecture the OS is built for.
       *
       * @memberOf platform.os
       * @type number|null
       */
      'architecture': null,

      /**
       * The family of the OS.
       *
       * Common values include:
       * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
       * "Windows XP", "OS X", "Ubuntu", "Debian", "Fedora", "Red Hat", "SuSE",
       * "Android", "iOS" and "Windows Phone"
       *
       * @memberOf platform.os
       * @type string|null
       */
      'family': null,

      /**
       * The version of the OS.
       *
       * @memberOf platform.os
       * @type string|null
       */
      'version': null,

      /**
       * Returns the OS string.
       *
       * @memberOf platform.os
       * @returns {string} The OS string.
       */
      'toString': function() { return 'null'; }
    };

    platform.parse = parse;
    platform.toString = toStringPlatform;

    if (platform.version) {
      description.unshift(version);
    }
    if (platform.name) {
      description.unshift(name);
    }
    if (os && name && !(os == String(os).split(' ')[0] && (os == name.split(' ')[0] || product))) {
      description.push(product ? '(' + os + ')' : 'on ' + os);
    }
    if (description.length) {
      platform.description = description.join(' ');
    }
    return platform;
  }

  /*--------------------------------------------------------------------------*/

  // Export platform.
  var platform = parse();

  // Some AMD build optimizers, like r.js, check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose platform on the global object to prevent errors when platform is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    root.platform = platform;

    // Define as an anonymous module so platform can be aliased through path mapping.
    define(function() {
      return platform;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for CommonJS support.
    forOwn(platform, function(value, key) {
      freeExports[key] = value;
    });
  }
  else {
    // Export to the global object.
    root.platform = platform;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9kaXN0L0RPTUV2ZW50U3VibW9kdWxlLmpzIiwiLi4vLi4vZGlzdC9EZXZpY2VNb3Rpb25Nb2R1bGUuanMiLCIuLi8uLi9kaXN0L0RldmljZU9yaWVudGF0aW9uTW9kdWxlLmpzIiwiLi4vLi4vZGlzdC9FbmVyZ3lNb2R1bGUuanMiLCIuLi8uLi9kaXN0L0lucHV0TW9kdWxlLmpzIiwiLi4vLi4vZGlzdC9Nb3Rpb25JbnB1dC5qcyIsIi4uLy4uL2Rpc3QvaW5kZXguanMiLCJkaXN0L2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3BsYXRmb3JtL3BsYXRmb3JtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7SUFVTSxpQjs7O0FBRUo7Ozs7Ozs7OztBQVNBLDZCQUFZLGNBQVosRUFBNEIsU0FBNUIsRUFBdUM7QUFBQTs7QUFHckM7Ozs7Ozs7QUFIcUMsc0lBQy9CLFNBRCtCOztBQVVyQyxVQUFLLGNBQUwsR0FBc0IsY0FBdEI7O0FBRUE7Ozs7Ozs7QUFPQSxVQUFLLEtBQUwsR0FBYSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUFiOztBQUVBOzs7Ozs7O0FBT0EsVUFBSyw4QkFBTCxHQUFzQyxJQUF0QztBQTVCcUM7QUE2QnRDOztBQUVEOzs7Ozs7Ozs7MkJBS087QUFBQTs7QUFDTDtBQUNBLFdBQUssY0FBTCxDQUFvQixRQUFwQixDQUE2QixLQUFLLFNBQWxDLElBQStDLElBQS9DOztBQUVBO0FBQ0EsVUFBSSxrQkFBa0IsS0FBSyxjQUFMLENBQW9CLE9BQTFDO0FBQ0EsVUFBSSxDQUFDLGVBQUwsRUFDRSxrQkFBa0IsS0FBSyxjQUFMLENBQW9CLElBQXBCLEVBQWxCOztBQUVGLGFBQU8sZ0JBQWdCLElBQWhCLENBQXFCLFVBQUMs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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IElucHV0TW9kdWxlIGZyb20gJy4vSW5wdXRNb2R1bGUnO1xuXG4vKipcbiAqIGBET01FdmVudFN1Ym1vZHVsZWAgY2xhc3MuXG4gKiBUaGUgYERPTUV2ZW50U3VibW9kdWxlYCBjbGFzcyBhbGxvd3MgdG8gaW5zdGFudGlhdGUgbW9kdWxlcyB0aGF0IHByb3ZpZGVcbiAqIHVuaWZpZWQgdmFsdWVzIChzdWNoIGFzIGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCwgYEFjY2VsZXJhdGlvbmAsXG4gKiBgUm90YXRpb25SYXRlYCwgYE9yaWVudGF0aW9uYCwgYE9yaWVudGF0aW9uQWx0KSBmcm9tIHRoZSBgZGV2aWNlbW90aW9uYFxuICogb3IgYGRldmljZW9yaWVudGF0aW9uYCBET00gZXZlbnRzLlxuICpcbiAqIEBjbGFzcyBET01FdmVudFN1Ym1vZHVsZVxuICogQGV4dGVuZHMgSW5wdXRNb2R1bGVcbiAqL1xuY2xhc3MgRE9NRXZlbnRTdWJtb2R1bGUgZXh0ZW5kcyBJbnB1dE1vZHVsZSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBgRE9NRXZlbnRTdWJtb2R1bGVgIG1vZHVsZSBpbnN0YW5jZS5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uTW9kdWxlfERldmljZU9yaWVudGF0aW9uTW9kdWxlfSBET01FdmVudE1vZHVsZSAtIFRoZSBwYXJlbnQgRE9NIGV2ZW50IG1vZHVsZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIFRoZSBuYW1lIG9mIHRoZSBzdWJtb2R1bGUgLyBldmVudCAoKmUuZy4qICdhY2NlbGVyYXRpb24nIG9yICdvcmllbnRhdGlvbkFsdCcpLlxuICAgKiBAc2VlIERldmljZU1vdGlvbk1vZHVsZVxuICAgKiBAc2VlIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihET01FdmVudE1vZHVsZSwgZXZlbnRUeXBlKSB7XG4gICAgc3VwZXIoZXZlbnRUeXBlKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBET00gZXZlbnQgcGFyZW50IG1vZHVsZSBmcm9tIHdoaWNoIHRoaXMgbW9kdWxlIGdldHMgdGhlIHJhdyB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBET01FdmVudFN1Ym1vZHVsZVxuICAgICAqIEB0eXBlIHtEZXZpY2VNb3Rpb25Nb2R1bGV8RGV2aWNlT3JpZW50YXRpb25Nb2R1bGV9XG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgdGhpcy5ET01FdmVudE1vZHVsZSA9IERPTUV2ZW50TW9kdWxlO1xuXG4gICAgLyoqXG4gICAgICogUmF3IHZhbHVlcyBjb21pbmcgZnJvbSB0aGUgYGRldmljZW1vdGlvbmAgZXZlbnQgc2VudCBieSB0aGlzIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERPTUV2ZW50U3VibW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnQgPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBDb21wYXNzIGhlYWRpbmcgcmVmZXJlbmNlIChpT1MgZGV2aWNlcyBvbmx5LCBgT3JpZW50YXRpb25gIGFuZCBgT3JpZW50YXRpb25BbHRgIHN1Ym1vZHVsZXMgb25seSkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBET01FdmVudFN1Ym1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIHRoaXMuX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICAvLyBJbmRpY2F0ZSB0byB0aGUgcGFyZW50IG1vZHVsZSB0aGF0IHRoaXMgZXZlbnQgaXMgcmVxdWlyZWRcbiAgICB0aGlzLkRPTUV2ZW50TW9kdWxlLnJlcXVpcmVkW3RoaXMuZXZlbnRUeXBlXSA9IHRydWU7XG5cbiAgICAvLyBJZiB0aGUgcGFyZW50IGV2ZW50IGhhcyBub3QgYmVlbiBpbml0aWFsaXplZCB5ZXQsIGluaXRpYWxpemUgaXRcbiAgICBsZXQgRE9NRXZlbnRQcm9taXNlID0gdGhpcy5ET01FdmVudE1vZHVsZS5wcm9taXNlO1xuICAgIGlmICghRE9NRXZlbnRQcm9taXNlKVxuICAgICAgRE9NRXZlbnRQcm9taXNlID0gdGhpcy5ET01FdmVudE1vZHVsZS5pbml0KCk7XG5cbiAgICByZXR1cm4gRE9NRXZlbnRQcm9taXNlLnRoZW4oKG1vZHVsZSkgPT4gdGhpcyk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRE9NRXZlbnRTdWJtb2R1bGU7XG4iLCJpbXBvcnQgSW5wdXRNb2R1bGUgZnJvbSAnLi9JbnB1dE1vZHVsZSc7XG5pbXBvcnQgRE9NRXZlbnRTdWJtb2R1bGUgZnJvbSAnLi9ET01FdmVudFN1Ym1vZHVsZSc7XG5pbXBvcnQgTW90aW9uSW5wdXQgZnJvbSAnLi9Nb3Rpb25JbnB1dCc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAncGxhdGZvcm0nO1xuXG4vKipcbiAqIEdldHMgdGhlIGN1cnJlbnQgbG9jYWwgdGltZSBpbiBzZWNvbmRzLlxuICogVXNlcyBgd2luZG93LnBlcmZvcm1hbmNlLm5vdygpYCBpZiBhdmFpbGFibGUsIGFuZCBgRGF0ZS5ub3coKWAgb3RoZXJ3aXNlLlxuICpcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gZ2V0TG9jYWxUaW1lKCkge1xuICBpZiAod2luZG93LnBlcmZvcm1hbmNlKVxuICAgIHJldHVybiB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgLyAxMDAwO1xuICByZXR1cm4gRGF0ZS5ub3coKSAvIDEwMDA7XG59XG5cbi8qKlxuICogYERldmljZU1vdGlvbmAgbW9kdWxlIHNpbmdsZXRvbi5cbiAqIFRoZSBgRGV2aWNlTW90aW9uTW9kdWxlYCBzaW5nbGV0b24gcHJvdmlkZXMgdGhlIHJhdyB2YWx1ZXNcbiAqIG9mIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHksIGFjY2VsZXJhdGlvbiwgYW5kIHJvdGF0aW9uXG4gKiByYXRlIHByb3ZpZGVkIGJ5IHRoZSBgRGV2aWNlTW90aW9uYCBldmVudC5cbiAqIEl0IGFsc28gaW5zdGFudGlhdGUgdGhlIGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCxcbiAqIGBBY2NlbGVyYXRpb25gIGFuZCBgUm90YXRpb25SYXRlYCBzdWJtb2R1bGVzIHRoYXQgdW5pZnkgdGhvc2UgdmFsdWVzXG4gKiBhY3Jvc3MgcGxhdGZvcm1zIGJ5IG1ha2luZyB0aGVtIGNvbXBsaWFudCB3aXRoIHtAbGlua1xuICogaHR0cDovL3d3dy53My5vcmcvVFIvb3JpZW50YXRpb24tZXZlbnQvfHRoZSBXM0Mgc3RhbmRhcmR9LlxuICogV2hlbiByYXcgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgdGhlIHNlbnNvcnMsIHRoaXMgbW9kdWxlcyB0cmllc1xuICogdG8gcmVjYWxjdWxhdGUgdGhlbSBmcm9tIGF2YWlsYWJsZSB2YWx1ZXM6XG4gKiAtIGBhY2NlbGVyYXRpb25gIGlzIGNhbGN1bGF0ZWQgZnJvbSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWBcbiAqICAgd2l0aCBhIGhpZ2gtcGFzcyBmaWx0ZXI7XG4gKiAtIChjb21pbmcgc29vbiDigJQgd2FpdGluZyBmb3IgYSBidWcgb24gQ2hyb21lIHRvIGJlIHJlc29sdmVkKVxuICogICBgcm90YXRpb25SYXRlYCBpcyBjYWxjdWxhdGVkIGZyb20gYG9yaWVudGF0aW9uYC5cbiAqXG4gKiBAY2xhc3MgRGV2aWNlTW90aW9uTW9kdWxlXG4gKiBAZXh0ZW5kcyBJbnB1dE1vZHVsZVxuICovXG5jbGFzcyBEZXZpY2VNb3Rpb25Nb2R1bGUgZXh0ZW5kcyBJbnB1dE1vZHVsZSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGBEZXZpY2VNb3Rpb25gIG1vZHVsZSBpbnN0YW5jZS5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignZGV2aWNlbW90aW9uJyk7XG5cbiAgICAvKipcbiAgICAgKiBSYXcgdmFsdWVzIGNvbWluZyBmcm9tIHRoZSBgZGV2aWNlbW90aW9uYCBldmVudCBzZW50IGJ5IHRoaXMgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFtudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsXVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnQgPSBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIG1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyB1bmlmaWVkIHZhbHVlcyBvZiB0aGUgYWNjZWxlcmF0aW9uIGluY2x1ZGluZyBncmF2aXR5LlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBBY2NlbGVyYXRpb25gIHN1Ym1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyB1bmlmaWVkIHZhbHVlcyBvZiB0aGUgYWNjZWxlcmF0aW9uLlxuICAgICAqIEVzdGltYXRlcyB0aGUgYWNjZWxlcmF0aW9uIHZhbHVlcyBmcm9tIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YFxuICAgICAqIHJhdyB2YWx1ZXMgaWYgdGhlIGFjY2VsZXJhdGlvbiByYXcgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlIG9uIHRoZVxuICAgICAqIGRldmljZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKi9cbiAgICB0aGlzLmFjY2VsZXJhdGlvbiA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAnYWNjZWxlcmF0aW9uJyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYFJvdGF0aW9uUmF0ZWAgc3VibW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIHVuaWZpZWQgdmFsdWVzIG9mIHRoZSByb3RhdGlvbiByYXRlLlxuICAgICAqIChjb21pbmcgc29vbiwgd2FpdGluZyBmb3IgYSBidWcgb24gQ2hyb21lIHRvIGJlIHJlc29sdmVkKVxuICAgICAqIEVzdGltYXRlcyB0aGUgcm90YXRpb24gcmF0ZSB2YWx1ZXMgZnJvbSBgb3JpZW50YXRpb25gIHZhbHVlcyBpZlxuICAgICAqIHRoZSByb3RhdGlvbiByYXRlIHJhdyB2YWx1ZXMgYXJlIG5vdCBhdmFpbGFibGUgb24gdGhlIGRldmljZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKi9cbiAgICB0aGlzLnJvdGF0aW9uUmF0ZSA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAncm90YXRpb25SYXRlJyk7XG5cbiAgICAvKipcbiAgICAgKiBSZXF1aXJlZCBzdWJtb2R1bGVzIC8gZXZlbnRzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gYWNjZWxlcmF0aW9uIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGBhY2NlbGVyYXRpb25gIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gcm90YXRpb25SYXRlIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGByb3RhdGlvblJhdGVgIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqL1xuICAgIHRoaXMucmVxdWlyZWQgPSB7XG4gICAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5OiBmYWxzZSxcbiAgICAgIGFjY2VsZXJhdGlvbjogZmFsc2UsXG4gICAgICByb3RhdGlvblJhdGU6IGZhbHNlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlc29sdmUgZnVuY3Rpb24gb2YgdGhlIG1vZHVsZSdzIHByb21pc2UuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqIEBzZWUgRGV2aWNlTW90aW9uTW9kdWxlI2luaXRcbiAgICAgKi9cbiAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBVbmlmeWluZyBmYWN0b3Igb2YgdGhlIG1vdGlvbiBkYXRhIHZhbHVlcyAoYDFgIG9uIEFuZHJvaWQsIGAtMWAgb24gaU9TKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5fdW5pZnlNb3Rpb25EYXRhID0gKHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycgPyAtMSA6IDEpO1xuXG4gICAgLyoqXG4gICAgICogVW5pZnlpbmcgZmFjdG9yIG9mIHRoZSBwZXJpb2QgKGAwLjAwMWAgb24gQW5kcm9pZCwgYDFgIG9uIGlPUykuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX3VuaWZ5UGVyaW9kID0gKHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ0FuZHJvaWQnID8gMC4wMDEgOiAxKTtcblxuICAgIC8qKlxuICAgICAqIEFjY2VsZXJhdGlvbiBjYWxjdWxhdGVkIGZyb20gdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb24gPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBUaW1lIGNvbnN0YW50IChoYWxmLWxpZmUpIG9mIHRoZSBoaWdoLXBhc3MgZmlsdGVyIHVzZWQgdG8gc21vb3RoIHRoZSBhY2NlbGVyYXRpb24gdmFsdWVzIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYWNjZWxlcmF0aW9uIGluY2x1ZGluZyBncmF2aXR5IHJhdyB2YWx1ZXMgKGluIHNlY29uZHMpLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAwLjFcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uVGltZUNvbnN0YW50ID0gMC4xO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWUsIHVzZWQgaW4gdGhlIGhpZ2gtcGFzcyBmaWx0ZXIgdG8gY2FsY3VsYXRlIHRoZSBhY2NlbGVyYXRpb24gKGlmIHRoZSBgYWNjZWxlcmF0aW9uYCB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSBgJ2RldmljZW1vdGlvbidgKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIFJvdGF0aW9uIHJhdGUgY2FsY3VsYXRlZCBmcm9tIHRoZSBvcmllbnRhdGlvbiB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZSA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIExhdGVzdCBvcmllbnRhdGlvbiB2YWx1ZSwgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHJvdGF0aW9uIHJhdGUgIChpZiB0aGUgYHJvdGF0aW9uUmF0ZWAgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgYCdkZXZpY2Vtb3Rpb24nYCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IG9yaWVudGF0aW9uIHRpbWVzdGFtcHMsIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSByb3RhdGlvbiByYXRlIChpZiB0aGUgYHJvdGF0aW9uUmF0ZWAgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgYCdkZXZpY2Vtb3Rpb24nYCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wID0gbnVsbDtcblxuICAgIHRoaXMuX3Byb2Nlc3NGdW5jdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fcHJvY2VzcyA9IHRoaXMuX3Byb2Nlc3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9kZXZpY2Vtb3Rpb25DaGVjayA9IHRoaXMuX2RldmljZW1vdGlvbkNoZWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZGV2aWNlbW90aW9uTGlzdGVuZXIgPSB0aGlzLl9kZXZpY2Vtb3Rpb25MaXN0ZW5lci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlY2F5IGZhY3RvciBvZiB0aGUgaGlnaC1wYXNzIGZpbHRlciB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgYWNjZWxlcmF0aW9uIGZyb20gdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWVzLlxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBfY2FsY3VsYXRlZEFjY2VsZXJhdGlvbkRlY2F5KCkge1xuICAgIHJldHVybiBNYXRoLmV4cCgtMiAqIE1hdGguUEkgKiB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkucGVyaW9kIC8gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblRpbWVDb25zdGFudCk7XG4gIH1cblxuICAvKipcbiAgICogU2Vuc29yIGNoZWNrIG9uIGluaXRpYWxpemF0aW9uIG9mIHRoZSBtb2R1bGUuXG4gICAqIFRoaXMgbWV0aG9kOlxuICAgKiAtIGNoZWNrcyB3aGV0aGVyIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIHRoZSBgYWNjZWxlcmF0aW9uYCxcbiAgICogICBhbmQgdGhlIGByb3RhdGlvblJhdGVgIHZhbHVlcyBhcmUgdmFsaWQgb3Igbm90O1xuICAgKiAtIGdldHMgdGhlIHBlcmlvZCBvZiB0aGUgYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBhbmQgc2V0cyB0aGUgcGVyaW9kIG9mXG4gICAqICAgdGhlIGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCwgYEFjY2VsZXJhdGlvbmAsIGFuZCBgUm90YXRpb25SYXRlYFxuICAgKiAgIHN1Ym1vZHVsZXM7XG4gICAqIC0gKGluIHRoZSBjYXNlIHdoZXJlIGFjY2VsZXJhdGlvbiByYXcgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQpXG4gICAqICAgaW5kaWNhdGVzIHdoZXRoZXIgdGhlIGFjY2VsZXJhdGlvbiBjYW4gYmUgY2FsY3VsYXRlZCBmcm9tIHRoZVxuICAgKiAgIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcyBvciBub3QuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBUaGUgZmlyc3QgYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBjYXVnaHQuXG4gICAqL1xuICBfZGV2aWNlbW90aW9uQ2hlY2soZSkge1xuICAgIHRoaXMuaXNQcm92aWRlZCA9IHRydWU7XG4gICAgdGhpcy5wZXJpb2QgPSBlLmludGVydmFsIC8gMTAwMDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHlcbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNQcm92aWRlZCA9IChcbiAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogPT09ICdudW1iZXInKVxuICAgICk7XG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSBhY2NlbGVyYXRpb25cbiAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkID0gKFxuICAgICAgZS5hY2NlbGVyYXRpb24gJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb24ueCA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uLnkgPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbi56ID09PSAnbnVtYmVyJylcbiAgICApO1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uLnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSByb3RhdGlvbiByYXRlXG4gICAgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZCA9IChcbiAgICAgIGUucm90YXRpb25SYXRlICYmXG4gICAgICAodHlwZW9mIGUucm90YXRpb25SYXRlLmFscGhhID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5yb3RhdGlvblJhdGUuYmV0YSA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUucm90YXRpb25SYXRlLmdhbW1hID09PSAnbnVtYmVyJylcbiAgICApO1xuICAgIHRoaXMucm90YXRpb25SYXRlLnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIG5vdyB0aGF0IHRoZSBzZW5zb3JzIGFyZSBjaGFja2VkIHJlcGxhY2UgdGhlIHByb2Nlc3MgZnVuY3Rpb24gd2l0aCB0aGVcbiAgICAvLyBwcm9wZXIgbGlzdGVuZXJcbiAgICB0aGlzLl9wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLl9kZXZpY2Vtb3Rpb25MaXN0ZW5lcjtcblxuICAgIC8vIElmIGFjY2VsZXJhdGlvbiBpcyBub3QgcHJvdmlkZWQgYnkgcmF3IHNlbnNvcnMsIGluZGljYXRlIHdoZXRoZXIgaXRcbiAgICAvLyBjYW4gYmUgY2FsY3VsYXRlZCB3aXRoIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCBvciBub3RcbiAgICBpZiAoIXRoaXMuYWNjZWxlcmF0aW9uLmlzUHJvdmlkZWQpXG4gICAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc0NhbGN1bGF0ZWQgPSB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNQcm92aWRlZDtcblxuICAgIC8vIFdBUk5JTkdcbiAgICAvLyBUaGUgbGluZXMgb2YgY29kZSBiZWxvdyBhcmUgY29tbWVudGVkIGJlY2F1c2Ugb2YgYSBidWcgb2YgQ2hyb21lXG4gICAgLy8gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHdoZXJlICdkZXZpY2Vtb3Rpb24nIGV2ZW50cyBhcmUgbm90IHNlbnRcbiAgICAvLyBvciBjYXVnaHQgaWYgdGhlIGxpc3RlbmVyIGlzIHNldCB1cCBhZnRlciBhICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAvLyBsaXN0ZW5lci4gSGVyZSwgdGhlIF90cnlPcmllbnRhdGlvbkZhbGxiYWNrIG1ldGhvZCB3b3VsZCBhZGQgYVxuICAgIC8vICdkZXZpY2VvcmllbnRhdGlvbicgbGlzdGVuZXIgYW5kIGJsb2NrIGFsbCBzdWJzZXF1ZW50ICdkZXZpY2Vtb3Rpb24nXG4gICAgLy8gZXZlbnRzIG9uIHRoZXNlIGRldmljZXMuIENvbW1lbnRzIHdpbGwgYmUgcmVtb3ZlZCBvbmNlIHRoZSBidWcgb2ZcbiAgICAvLyBDaHJvbWUgaXMgY29ycmVjdGVkLlxuXG4gICAgLy8gaWYgKHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlICYmICF0aGlzLnJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkKVxuICAgIC8vICAgdGhpcy5fdHJ5T3JpZW50YXRpb25GYWxsYmFjaygpO1xuICAgIC8vIGVsc2VcbiAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGNhbGxiYWNrLlxuICAgKiBUaGlzIG1ldGhvZCBlbWl0cyBhbiBldmVudCB3aXRoIHRoZSByYXcgYCdkZXZpY2Vtb3Rpb24nYCB2YWx1ZXMsIGFuZCBlbWl0c1xuICAgKiBldmVudHMgd2l0aCB0aGUgdW5pZmllZCBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIGBhY2NlbGVyYXRpb25gLFxuICAgKiBhbmQgLyBvciBgcm90YXRpb25SYXRlYCB2YWx1ZXMgaWYgdGhleSBhcmUgcmVxdWlyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICovXG4gIF9kZXZpY2Vtb3Rpb25MaXN0ZW5lcihlKSB7XG4gICAgLy8gJ2RldmljZW1vdGlvbicgZXZlbnQgKHJhdyB2YWx1ZXMpXG4gICAgaWYgKHRoaXMubGlzdGVuZXJzLnNpemUgPiAwKVxuICAgICAgdGhpcy5fZW1pdERldmljZU1vdGlvbkV2ZW50KGUpO1xuXG4gICAgLy8gJ2FjY2VsZXJhdGlvbicgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIGlmICh0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkubGlzdGVuZXJzLnNpemUgPiAwICYmXG4gICAgICAgIHRoaXMucmVxdWlyZWQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAmJlxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZFxuICAgICkge1xuICAgICAgdGhpcy5fZW1pdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlFdmVudChlKTtcbiAgICB9XG5cbiAgICAvLyAnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIC8vIHRoZSBmYWxsYmFjayBjYWxjdWxhdGlvbiBvZiB0aGUgYWNjZWxlcmF0aW9uIGhhcHBlbnMgaW4gdGhlXG4gICAgLy8gIGBfZW1pdEFjY2VsZXJhdGlvbmAgbWV0aG9kLCBzbyB3ZSBjaGVjayBpZiB0aGlzLmFjY2VsZXJhdGlvbi5pc1ZhbGlkXG4gICAgaWYgKHRoaXMuYWNjZWxlcmF0aW9uLmxpc3RlbmVycy5zaXplID4gMCAmJlxuICAgICAgICB0aGlzLnJlcXVpcmVkLmFjY2VsZXJhdGlvbiAmJlxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc1ZhbGlkXG4gICAgKSB7XG4gICAgICB0aGlzLl9lbWl0QWNjZWxlcmF0aW9uRXZlbnQoZSk7XG4gICAgfVxuXG4gICAgLy8gJ3JvdGF0aW9uUmF0ZScgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIC8vIHRoZSBmYWxsYmFjayBjYWxjdWxhdGlvbiBvZiB0aGUgcm90YXRpb24gcmF0ZSBkb2VzIE5PVCBoYXBwZW4gaW4gdGhlXG4gICAgLy8gYF9lbWl0Um90YXRpb25SYXRlYCBtZXRob2QsIHNvIHdlIG9ubHkgY2hlY2sgaWYgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZFxuICAgIGlmICh0aGlzLnJvdGF0aW9uUmF0ZS5saXN0ZW5lcnMuc2l6ZSA+IDAgJiZcbiAgICAgICAgdGhpcy5yZXF1aXJlZC5yb3RhdGlvblJhdGUgJiZcbiAgICAgICAgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZFxuICAgICkge1xuICAgICAgdGhpcy5fZW1pdFJvdGF0aW9uUmF0ZUV2ZW50KGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYCdkZXZpY2Vtb3Rpb24nYCByYXcgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZW1pdERldmljZU1vdGlvbkV2ZW50KGUpIHtcbiAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLmV2ZW50O1xuXG4gICAgaWYgKGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSkge1xuICAgICAgb3V0RXZlbnRbMF0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueDtcbiAgICAgIG91dEV2ZW50WzFdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lnk7XG4gICAgICBvdXRFdmVudFsyXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56O1xuICAgIH1cblxuICAgIGlmIChlLmFjY2VsZXJhdGlvbikge1xuICAgICAgb3V0RXZlbnRbM10gPSBlLmFjY2VsZXJhdGlvbi54O1xuICAgICAgb3V0RXZlbnRbNF0gPSBlLmFjY2VsZXJhdGlvbi55O1xuICAgICAgb3V0RXZlbnRbNV0gPSBlLmFjY2VsZXJhdGlvbi56O1xuICAgIH1cblxuICAgIGlmIChlLnJvdGF0aW9uUmF0ZSkge1xuICAgICAgb3V0RXZlbnRbNl0gPSBlLnJvdGF0aW9uUmF0ZS5hbHBoYTtcbiAgICAgIG91dEV2ZW50WzddID0gZS5yb3RhdGlvblJhdGUuYmV0YTtcbiAgICAgIG91dEV2ZW50WzhdID0gZS5yb3RhdGlvblJhdGUuZ2FtbWE7XG4gICAgfVxuXG4gICAgdGhpcy5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZW1pdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlFdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmV2ZW50O1xuXG4gICAgb3V0RXZlbnRbMF0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICBvdXRFdmVudFsxXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuICAgIG91dEV2ZW50WzJdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG5cbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuZW1pdChvdXRFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIGBhY2NlbGVyYXRpb25gIHVuaWZpZWQgdmFsdWVzLlxuICAgKiBXaGVuIHRoZSBgYWNjZWxlcmF0aW9uYCByYXcgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlLCB0aGUgbWV0aG9kXG4gICAqIGFsc28gY2FsY3VsYXRlcyB0aGUgYWNjZWxlcmF0aW9uIGZyb20gdGhlXG4gICAqIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gVGhlIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQuXG4gICAqL1xuICBfZW1pdEFjY2VsZXJhdGlvbkV2ZW50KGUpIHtcbiAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLmFjY2VsZXJhdGlvbi5ldmVudDtcblxuICAgIGlmICh0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkKSB7XG4gICAgICAvLyBJZiByYXcgYWNjZWxlcmF0aW9uIHZhbHVlcyBhcmUgcHJvdmlkZWRcbiAgICAgIG91dEV2ZW50WzBdID0gZS5hY2NlbGVyYXRpb24ueCAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICAgIG91dEV2ZW50WzFdID0gZS5hY2NlbGVyYXRpb24ueSAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICAgIG91dEV2ZW50WzJdID0gZS5hY2NlbGVyYXRpb24ueiAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1ZhbGlkKSB7XG4gICAgICAvLyBPdGhlcndpc2UsIGlmIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgdmFsdWVzIGFyZSBwcm92aWRlZCxcbiAgICAgIC8vIGVzdGltYXRlIHRoZSBhY2NlbGVyYXRpb24gd2l0aCBhIGhpZ2gtcGFzcyBmaWx0ZXJcbiAgICAgIGNvbnN0IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBbXG4gICAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhLFxuICAgICAgICBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueSAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YSxcbiAgICAgICAgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogKiB0aGlzLl91bmlmeU1vdGlvbkRhdGFcbiAgICAgIF07XG4gICAgICBjb25zdCBrID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvbkRlY2F5O1xuXG4gICAgICAvLyBIaWdoLXBhc3MgZmlsdGVyIHRvIGVzdGltYXRlIHRoZSBhY2NlbGVyYXRpb24gKHdpdGhvdXQgdGhlIGdyYXZpdHkpXG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzBdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMF07XG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzFdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMV07XG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzJdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMl07XG5cbiAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXTtcbiAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXTtcbiAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXTtcblxuICAgICAgb3V0RXZlbnRbMF0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzBdO1xuICAgICAgb3V0RXZlbnRbMV0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzFdO1xuICAgICAgb3V0RXZlbnRbMl0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzJdO1xuICAgIH1cblxuICAgIHRoaXMuYWNjZWxlcmF0aW9uLmVtaXQob3V0RXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBgcm90YXRpb25SYXRlYCB1bmlmaWVkIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2VtaXRSb3RhdGlvblJhdGVFdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5yb3RhdGlvblJhdGUuZXZlbnQ7XG5cbiAgICBvdXRFdmVudFswXSA9IGUucm90YXRpb25SYXRlLmFscGhhO1xuICAgIG91dEV2ZW50WzFdID0gZS5yb3RhdGlvblJhdGUuYmV0YTtcbiAgICBvdXRFdmVudFsyXSA9IGUucm90YXRpb25SYXRlLmdhbW1hO1xuXG4gICAgLy8gVE9ETyg/KTogdW5pZnlcblxuICAgIHRoaXMucm90YXRpb25SYXRlLmVtaXQob3V0RXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgYW5kIGVtaXRzIHRoZSBgcm90YXRpb25SYXRlYCB1bmlmaWVkIHZhbHVlcyBmcm9tIHRoZSBgb3JpZW50YXRpb25gIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJbXX0gb3JpZW50YXRpb24gLSBMYXRlc3QgYG9yaWVudGF0aW9uYCByYXcgdmFsdWVzLlxuICAgKi9cbiAgX2NhbGN1bGF0ZVJvdGF0aW9uUmF0ZUZyb21PcmllbnRhdGlvbihvcmllbnRhdGlvbikge1xuICAgIGNvbnN0IG5vdyA9IGdldExvY2FsVGltZSgpO1xuICAgIGNvbnN0IGsgPSAwLjg7IC8vIFRPRE86IGltcHJvdmUgbG93IHBhc3MgZmlsdGVyIChmcmFtZXMgYXJlIG5vdCByZWd1bGFyKVxuICAgIGNvbnN0IGFscGhhSXNWYWxpZCA9ICh0eXBlb2Ygb3JpZW50YXRpb25bMF0gPT09ICdudW1iZXInKTtcblxuICAgIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXApIHtcbiAgICAgIGxldCByQWxwaGEgPSBudWxsO1xuICAgICAgbGV0IHJCZXRhO1xuICAgICAgbGV0IHJHYW1tYTtcblxuICAgICAgbGV0IGFscGhhRGlzY29udGludWl0eUZhY3RvciA9IDA7XG4gICAgICBsZXQgYmV0YURpc2NvbnRpbnVpdHlGYWN0b3IgPSAwO1xuICAgICAgbGV0IGdhbW1hRGlzY29udGludWl0eUZhY3RvciA9IDA7XG5cbiAgICAgIGNvbnN0IGRlbHRhVCA9IG5vdyAtIHRoaXMuX2xhc3RPcmllbnRhdGlvblRpbWVzdGFtcDtcblxuICAgICAgaWYgKGFscGhhSXNWYWxpZCkge1xuICAgICAgICAvLyBhbHBoYSBkaXNjb250aW51aXR5ICgrMzYwIC0+IDAgb3IgMCAtPiArMzYwKVxuICAgICAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdID4gMzIwICYmIG9yaWVudGF0aW9uWzBdIDwgNDApXG4gICAgICAgICAgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yID0gMzYwO1xuICAgICAgICBlbHNlIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMF0gPCA0MCAmJiBvcmllbnRhdGlvblswXSA+IDMyMClcbiAgICAgICAgICBhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAtMzYwO1xuICAgICAgfVxuXG4gICAgICAvLyBiZXRhIGRpc2NvbnRpbnVpdHkgKCsxODAgLT4gLTE4MCBvciAtMTgwIC0+ICsxODApXG4gICAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzFdID4gMTQwICYmIG9yaWVudGF0aW9uWzFdIDwgLTE0MClcbiAgICAgICAgYmV0YURpc2NvbnRpbnVpdHlGYWN0b3IgPSAzNjA7XG4gICAgICBlbHNlIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMV0gPCAtMTQwICYmIG9yaWVudGF0aW9uWzFdID4gMTQwKVxuICAgICAgICBiZXRhRGlzY29udGludWl0eUZhY3RvciA9IC0zNjA7XG5cbiAgICAgIC8vIGdhbW1hIGRpc2NvbnRpbnVpdGllcyAoKzE4MCAtPiAtMTgwIG9yIC0xODAgLT4gKzE4MClcbiAgICAgIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMl0gPiA1MCAmJiBvcmllbnRhdGlvblsyXSA8IC01MClcbiAgICAgICAgZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yID0gMTgwO1xuICAgICAgZWxzZSBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdIDwgLTUwICYmIG9yaWVudGF0aW9uWzJdID4gNTApXG4gICAgICAgIGdhbW1hRGlzY29udGludWl0eUZhY3RvciA9IC0xODA7XG5cbiAgICAgIGlmIChkZWx0YVQgPiAwKSB7XG4gICAgICAgIC8vIExvdyBwYXNzIGZpbHRlciB0byBzbW9vdGggdGhlIGRhdGFcbiAgICAgICAgaWYgKGFscGhhSXNWYWxpZClcbiAgICAgICAgICByQWxwaGEgPSBrICogdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVswXSArICgxIC0gaykgKiAob3JpZW50YXRpb25bMF0gLSB0aGlzLl9sYXN0T3JpZW50YXRpb25bMF0gKyBhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IpIC8gZGVsdGFUO1xuICAgICAgICByQmV0YSA9IGsgKiB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzFdICsgKDEgLSBrKSAqIChvcmllbnRhdGlvblsxXSAtIHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSArIGJldGFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcbiAgICAgICAgckdhbW1hID0gayAqIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMl0gKyAoMSAtIGspICogKG9yaWVudGF0aW9uWzJdIC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdICsgZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcblxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzBdID0gckFscGhhO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzFdID0gckJldGE7XG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMl0gPSByR2FtbWE7XG4gICAgICB9XG5cbiAgICAgIC8vIFRPRE86IHJlc2FtcGxlIHRoZSBlbWlzc2lvbiByYXRlIHRvIG1hdGNoIHRoZSBkZXZpY2Vtb3Rpb24gcmF0ZVxuICAgICAgdGhpcy5yb3RhdGlvblJhdGUuZW1pdCh0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlKTtcbiAgICB9XG5cbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXAgPSBub3c7XG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdID0gb3JpZW50YXRpb25bMF07XG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzFdID0gb3JpZW50YXRpb25bMV07XG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdID0gb3JpZW50YXRpb25bMl07XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHJvdGF0aW9uIHJhdGUgY2FuIGJlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYG9yaWVudGF0aW9uYCB2YWx1ZXMgb3Igbm90LlxuICAgKi9cbiAgX3RyeU9yaWVudGF0aW9uRmFsbGJhY2soKSB7XG4gICAgTW90aW9uSW5wdXQucmVxdWlyZU1vZHVsZSgnb3JpZW50YXRpb24nKVxuICAgICAgLnRoZW4oKG9yaWVudGF0aW9uKSA9PiB7XG4gICAgICAgIGlmIChvcmllbnRhdGlvbi5pc1ZhbGlkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJXQVJOSU5HIChtb3Rpb24taW5wdXQpOiBUaGUgJ2RldmljZW1vdGlvbicgZXZlbnQgZG9lcyBub3QgZXhpc3RzIG9yIGRvZXMgbm90IHByb3ZpZGUgcm90YXRpb24gcmF0ZSB2YWx1ZXMgaW4geW91ciBicm93c2VyLCBzbyB0aGUgcm90YXRpb24gcmF0ZSBvZiB0aGUgZGV2aWNlIGlzIGVzdGltYXRlZCBmcm9tIHRoZSAnb3JpZW50YXRpb24nLCBjYWxjdWxhdGVkIGZyb20gdGhlICdkZXZpY2VvcmllbnRhdGlvbicgZXZlbnQuIFNpbmNlIHRoZSBjb21wYXNzIG1pZ2h0IG5vdCBiZSBhdmFpbGFibGUsIG9ubHkgYGJldGFgIGFuZCBgZ2FtbWFgIGFuZ2xlcyBtYXkgYmUgcHJvdmlkZWQgKGBhbHBoYWAgd291bGQgYmUgbnVsbCkuXCIpO1xuXG4gICAgICAgICAgdGhpcy5yb3RhdGlvblJhdGUuaXNDYWxjdWxhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgIE1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdvcmllbnRhdGlvbicsIChvcmllbnRhdGlvbikgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlUm90YXRpb25SYXRlRnJvbU9yaWVudGF0aW9uKG9yaWVudGF0aW9uKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlKHRoaXMpO1xuICAgICAgfSk7XG4gIH1cblxuICBfcHJvY2VzcyhkYXRhKSB7XG4gICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uKGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIG9mIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEByZXR1cm4ge3Byb21pc2V9XG4gICAqL1xuICBpbml0KCkge1xuICAgIHJldHVybiBzdXBlci5pbml0KChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSA9IHJlc29sdmU7XG5cbiAgICAgIGlmICh3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQpIHtcbiAgICAgICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2s7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCB0aGlzLl9wcm9jZXNzKTtcbiAgICAgIH1cblxuICAgICAgLy8gV0FSTklOR1xuICAgICAgLy8gVGhlIGxpbmVzIG9mIGNvZGUgYmVsb3cgYXJlIGNvbW1lbnRlZCBiZWNhdXNlIG9mIGEgYnVnIG9mIENocm9tZVxuICAgICAgLy8gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHdoZXJlICdkZXZpY2Vtb3Rpb24nIGV2ZW50cyBhcmUgbm90IHNlbnRcbiAgICAgIC8vIG9yIGNhdWdodCBpZiB0aGUgbGlzdGVuZXIgaXMgc2V0IHVwIGFmdGVyIGEgJ2RldmljZW9yaWVudGF0aW9uJ1xuICAgICAgLy8gbGlzdGVuZXIuIEhlcmUsIHRoZSBfdHJ5T3JpZW50YXRpb25GYWxsYmFjayBtZXRob2Qgd291bGQgYWRkIGFcbiAgICAgIC8vICdkZXZpY2VvcmllbnRhdGlvbicgbGlzdGVuZXIgYW5kIGJsb2NrIGFsbCBzdWJzZXF1ZW50ICdkZXZpY2Vtb3Rpb24nXG4gICAgICAvLyBldmVudHMgb24gdGhlc2UgZGV2aWNlcy4gQ29tbWVudHMgd2lsbCBiZSByZW1vdmVkIG9uY2UgdGhlIGJ1ZyBvZlxuICAgICAgLy8gQ2hyb21lIGlzIGNvcnJlY3RlZC5cblxuICAgICAgLy8gZWxzZSBpZiAodGhpcy5yZXF1aXJlZC5yb3RhdGlvblJhdGUpXG4gICAgICAvLyB0aGlzLl90cnlPcmllbnRhdGlvbkZhbGxiYWNrKCk7XG5cbiAgICAgIGVsc2VcbiAgICAgICAgcmVzb2x2ZSh0aGlzKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRGV2aWNlTW90aW9uTW9kdWxlKCk7XG4iLCJpbXBvcnQgRE9NRXZlbnRTdWJtb2R1bGUgZnJvbSAnLi9ET01FdmVudFN1Ym1vZHVsZSc7XG5pbXBvcnQgSW5wdXRNb2R1bGUgZnJvbSAnLi9JbnB1dE1vZHVsZSc7XG5pbXBvcnQgTW90aW9uSW5wdXQgZnJvbSAnLi9Nb3Rpb25JbnB1dCc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAncGxhdGZvcm0nO1xuXG4vKipcbiAqIENvbnZlcnRzIGRlZ3JlZXMgdG8gcmFkaWFucy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gZGVnIC0gQW5nbGUgaW4gZGVncmVlcy5cbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gZGVnVG9SYWQoZGVnKSB7XG4gIHJldHVybiBkZWcgKiBNYXRoLlBJIC8gMTgwO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHJhZGlhbnMgdG8gZGVncmVlcy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gcmFkIC0gQW5nbGUgaW4gcmFkaWFucy5cbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gcmFkVG9EZWcocmFkKSB7XG4gIHJldHVybiByYWQgKiAxODAgLyBNYXRoLlBJO1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZXMgYSAzIHggMyBtYXRyaXguXG4gKlxuICogQHBhcmFtIHtudW1iZXJbXX0gbSAtIE1hdHJpeCB0byBub3JtYWxpemUsIHJlcHJlc2VudGVkIGJ5IGFuIGFycmF5IG9mIGxlbmd0aCA5LlxuICogQHJldHVybiB7bnVtYmVyW119XG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZShtKSB7XG4gIGNvbnN0IGRldCA9IG1bMF0gKiBtWzRdICogbVs4XSArIG1bMV0gKiBtWzVdICogbVs2XSArIG1bMl0gKiBtWzNdICogbVs3XSAtIG1bMF0gKiBtWzVdICogbVs3XSAtIG1bMV0gKiBtWzNdICogbVs4XSAtIG1bMl0gKiBtWzRdICogbVs2XTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG0ubGVuZ3RoOyBpKyspXG4gICAgbVtpXSAvPSBkZXQ7XG5cbiAgcmV0dXJuIG07XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBFdWxlciBhbmdsZSBgW2FscGhhLCBiZXRhLCBnYW1tYV1gIHRvIHRoZSBXM0Mgc3BlY2lmaWNhdGlvbiwgd2hlcmU6XG4gKiAtIGBhbHBoYWAgaXMgaW4gWzA7ICszNjBbO1xuICogLSBgYmV0YWAgaXMgaW4gWy0xODA7ICsxODBbO1xuICogLSBgZ2FtbWFgIGlzIGluIFstOTA7ICs5MFsuXG4gKlxuICogQHBhcmFtIHtudW1iZXJbXX0gZXVsZXJBbmdsZSAtIEV1bGVyIGFuZ2xlIHRvIHVuaWZ5LCByZXByZXNlbnRlZCBieSBhbiBhcnJheSBvZiBsZW5ndGggMyAoYFthbHBoYSwgYmV0YSwgZ2FtbWFdYCkuXG4gKiBAc2VlIHtAbGluayBodHRwOi8vd3d3LnczLm9yZy9UUi9vcmllbnRhdGlvbi1ldmVudC99XG4gKi9cbmZ1bmN0aW9uIHVuaWZ5KGV1bGVyQW5nbGUpIHtcbiAgLy8gQ2YuIFczQyBzcGVjaWZpY2F0aW9uIChodHRwOi8vdzNjLmdpdGh1Yi5pby9kZXZpY2VvcmllbnRhdGlvbi9zcGVjLXNvdXJjZS1vcmllbnRhdGlvbi5odG1sKVxuICAvLyBhbmQgRXVsZXIgYW5nbGVzIFdpa2lwZWRpYSBwYWdlIChodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0V1bGVyX2FuZ2xlcykuXG4gIC8vXG4gIC8vIFczQyBjb252ZW50aW9uOiBUYWl04oCTQnJ5YW4gYW5nbGVzIFotWCctWScnLCB3aGVyZTpcbiAgLy8gICBhbHBoYSBpcyBpbiBbMDsgKzM2MFssXG4gIC8vICAgYmV0YSBpcyBpbiBbLTE4MDsgKzE4MFssXG4gIC8vICAgZ2FtbWEgaXMgaW4gWy05MDsgKzkwWy5cblxuICBjb25zdCBhbHBoYUlzVmFsaWQgPSAodHlwZW9mIGV1bGVyQW5nbGVbMF0gPT09ICdudW1iZXInKTtcblxuICBjb25zdCBfYWxwaGEgPSAoYWxwaGFJc1ZhbGlkID8gZGVnVG9SYWQoZXVsZXJBbmdsZVswXSkgOiAwKTtcbiAgY29uc3QgX2JldGEgPSBkZWdUb1JhZChldWxlckFuZ2xlWzFdKTtcbiAgY29uc3QgX2dhbW1hID0gZGVnVG9SYWQoZXVsZXJBbmdsZVsyXSk7XG5cbiAgY29uc3QgY0EgPSBNYXRoLmNvcyhfYWxwaGEpO1xuICBjb25zdCBjQiA9IE1hdGguY29zKF9iZXRhKTtcbiAgY29uc3QgY0cgPSBNYXRoLmNvcyhfZ2FtbWEpO1xuICBjb25zdCBzQSA9IE1hdGguc2luKF9hbHBoYSk7XG4gIGNvbnN0IHNCID0gTWF0aC5zaW4oX2JldGEpO1xuICBjb25zdCBzRyA9IE1hdGguc2luKF9nYW1tYSk7XG5cbiAgbGV0IGFscGhhLCBiZXRhLCBnYW1tYTtcblxuICBsZXQgbSA9IFtcbiAgICBjQSAqIGNHIC0gc0EgKiBzQiAqIHNHLFxuICAgIC1jQiAqIHNBLFxuICAgIGNBICogc0cgKyBjRyAqIHNBICogc0IsXG4gICAgY0cgKiBzQSArIGNBICogc0IgKiBzRyxcbiAgICBjQSAqIGNCLFxuICAgIHNBICogc0cgLSBjQSAqIGNHICogc0IsXG4gICAgLWNCICogc0csXG4gICAgc0IsXG4gICAgY0IgKiBjR1xuICBdO1xuICBub3JtYWxpemUobSk7XG5cbiAgLy8gU2luY2Ugd2Ugd2FudCBnYW1tYSBpbiBbLTkwOyArOTBbLCBjRyA+PSAwLlxuICBpZiAobVs4XSA+IDApIHtcbiAgICAvLyBDYXNlIDE6IG1bOF0gPiAwIDw9PiBjQiA+IDAgICAgICAgICAgICAgICAgIChhbmQgY0cgIT0gMClcbiAgICAvLyAgICAgICAgICAgICAgICAgIDw9PiBiZXRhIGluIF0tcGkvMjsgK3BpLzJbIChhbmQgY0cgIT0gMClcbiAgICBhbHBoYSA9IE1hdGguYXRhbjIoLW1bMV0sIG1bNF0pO1xuICAgIGJldGEgPSBNYXRoLmFzaW4obVs3XSk7IC8vIGFzaW4gcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waS8yIGFuZCArcGkvMiA9PiBPS1xuICAgIGdhbW1hID0gTWF0aC5hdGFuMigtbVs2XSwgbVs4XSk7XG4gIH0gZWxzZSBpZiAobVs4XSA8IDApIHtcbiAgICAvLyBDYXNlIDI6IG1bOF0gPCAwIDw9PiBjQiA8IDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGFuZCBjRyAhPSAwKVxuICAgIC8vICAgICAgICAgICAgICAgICAgPD0+IGJldGEgaW4gWy1waTsgLXBpLzJbIFUgXStwaS8yOyArcGldIChhbmQgY0cgIT0gMClcblxuICAgIC8vIFNpbmNlIGNCIDwgMCBhbmQgY0IgaXMgaW4gbVsxXSBhbmQgbVs0XSwgdGhlIHBvaW50IGlzIGZsaXBwZWQgYnkgMTgwIGRlZ3JlZXMuXG4gICAgLy8gSGVuY2UsIHdlIGhhdmUgdG8gbXVsdGlwbHkgYm90aCBhcmd1bWVudHMgb2YgYXRhbjIgYnkgLTEgaW4gb3JkZXIgdG8gcmV2ZXJ0XG4gICAgLy8gdGhlIHBvaW50IGluIGl0cyBvcmlnaW5hbCBwb3NpdGlvbiAoPT4gYW5vdGhlciBmbGlwIGJ5IDE4MCBkZWdyZWVzKS5cbiAgICBhbHBoYSA9IE1hdGguYXRhbjIobVsxXSwgLW1bNF0pO1xuICAgIGJldGEgPSAtTWF0aC5hc2luKG1bN10pO1xuICAgIGJldGEgKz0gKGJldGEgPj0gMCkgPyAtTWF0aC5QSSA6IE1hdGguUEk7IC8vIGFzaW4gcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waS8yIGFuZCBwaS8yID0+IG1ha2Ugc3VyZSBiZXRhIGluIFstcGk7IC1waS8yWyBVIF0rcGkvMjsgK3BpXVxuICAgIGdhbW1hID0gTWF0aC5hdGFuMihtWzZdLCAtbVs4XSk7IC8vIHNhbWUgcmVtYXJrIGFzIGZvciBhbHBoYSwgbXVsdGlwbGljYXRpb24gYnkgLTFcbiAgfSBlbHNlIHtcbiAgICAvLyBDYXNlIDM6IG1bOF0gPSAwIDw9PiBjQiA9IDAgb3IgY0cgPSAwXG4gICAgaWYgKG1bNl0gPiAwKSB7XG4gICAgICAvLyBTdWJjYXNlIDE6IGNHID0gMCBhbmQgY0IgPiAwXG4gICAgICAvLyAgICAgICAgICAgIGNHID0gMCA8PT4gc0cgPSAtMSA8PT4gZ2FtbWEgPSAtcGkvMiA9PiBtWzZdID0gY0JcbiAgICAgIC8vICAgICAgICAgICAgSGVuY2UsIG1bNl0gPiAwIDw9PiBjQiA+IDAgPD0+IGJldGEgaW4gXS1waS8yOyArcGkvMltcbiAgICAgIGFscGhhID0gTWF0aC5hdGFuMigtbVsxXSwgbVs0XSk7XG4gICAgICBiZXRhID0gTWF0aC5hc2luKG1bN10pOyAvLyBhc2luIHJldHVybnMgYSBudW1iZXIgYmV0d2VlbiAtcGkvMiBhbmQgK3BpLzIgPT4gT0tcbiAgICAgIGdhbW1hID0gLU1hdGguUEkgLyAyO1xuICAgIH0gZWxzZSBpZiAobVs2XSA8IDApIHtcbiAgICAgIC8vIFN1YmNhc2UgMjogY0cgPSAwIGFuZCBjQiA8IDBcbiAgICAgIC8vICAgICAgICAgICAgY0cgPSAwIDw9PiBzRyA9IC0xIDw9PiBnYW1tYSA9IC1waS8yID0+IG1bNl0gPSBjQlxuICAgICAgLy8gICAgICAgICAgICBIZW5jZSwgbVs2XSA8IDAgPD0+IGNCIDwgMCA8PT4gYmV0YSBpbiBbLXBpOyAtcGkvMlsgVSBdK3BpLzI7ICtwaV1cbiAgICAgIGFscGhhID0gTWF0aC5hdGFuMihtWzFdLCAtbVs0XSk7IC8vIHNhbWUgcmVtYXJrIGFzIGZvciBhbHBoYSBpbiBhIGNhc2UgYWJvdmVcbiAgICAgIGJldGEgPSAtTWF0aC5hc2luKG1bN10pO1xuICAgICAgYmV0YSArPSAoYmV0YSA+PSAwKSA/IC1NYXRoLlBJIDogTWF0aC5QSTsgLy8gYXNpbiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpLzIgYW5kICtwaS8yID0+IG1ha2Ugc3VyZSBiZXRhIGluIFstcGk7IC1waS8yWyBVIF0rcGkvMjsgK3BpXVxuICAgICAgZ2FtbWEgPSAtTWF0aC5QSSAvIDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFN1YmNhc2UgMzogY0IgPSAwXG4gICAgICAvLyBJbiB0aGUgY2FzZSB3aGVyZSBjb3MoYmV0YSkgPSAwIChpLmUuIGJldGEgPSAtcGkvMiBvciBiZXRhID0gcGkvMiksXG4gICAgICAvLyB3ZSBoYXZlIHRoZSBnaW1iYWwgbG9jayBwcm9ibGVtOiBpbiB0aGF0IGNvbmZpZ3VyYXRpb24sIG9ubHkgdGhlIGFuZ2xlXG4gICAgICAvLyBhbHBoYSArIGdhbW1hIChpZiBiZXRhID0gK3BpLzIpIG9yIGFscGhhIC0gZ2FtbWEgKGlmIGJldGEgPSAtcGkvMilcbiAgICAgIC8vIGFyZSB1bmlxdWVseSBkZWZpbmVkOiBhbHBoYSBhbmQgZ2FtbWEgY2FuIHRha2UgYW4gaW5maW5pdHkgb2YgdmFsdWVzLlxuICAgICAgLy8gRm9yIGNvbnZlbmllbmNlLCBsZXQncyBzZXQgZ2FtbWEgPSAwIChhbmQgdGh1cyBzaW4oZ2FtbWEpID0gMCkuXG4gICAgICAvLyAoQXMgYSBjb25zZXF1ZW5jZSBvZiB0aGUgZ2ltYmFsIGxvY2sgcHJvYmxlbSwgdGhlcmUgaXMgYSBkaXNjb250aW51aXR5XG4gICAgICAvLyBpbiBhbHBoYSBhbmQgZ2FtbWEuKVxuICAgICAgYWxwaGEgPSBNYXRoLmF0YW4yKG1bM10sIG1bMF0pO1xuICAgICAgYmV0YSA9IChtWzddID4gMCkgPyBNYXRoLlBJIC8gMiA6IC1NYXRoLlBJIC8gMjtcbiAgICAgIGdhbW1hID0gMDtcbiAgICB9XG4gIH1cblxuICAvLyBhdGFuMiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpIGFuZCBwaSA9PiBtYWtlIHN1cmUgdGhhdCBhbHBoYSBpcyBpbiBbMCwgMipwaVsuXG4gIGFscGhhICs9IChhbHBoYSA8IDApID8gMiAqIE1hdGguUEkgOiAwO1xuXG4gIGV1bGVyQW5nbGVbMF0gPSAoYWxwaGFJc1ZhbGlkID8gcmFkVG9EZWcoYWxwaGEpIDogbnVsbCk7XG4gIGV1bGVyQW5nbGVbMV0gPSByYWRUb0RlZyhiZXRhKTtcbiAgZXVsZXJBbmdsZVsyXSA9IHJhZFRvRGVnKGdhbW1hKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhIEV1bGVyIGFuZ2xlIGBbYWxwaGEsIGJldGEsIGdhbW1hXWAgdG8gYSBFdWxlciBhbmdsZSB3aGVyZTpcbiAqIC0gYGFscGhhYCBpcyBpbiBbMDsgKzM2MFs7XG4gKiAtIGBiZXRhYCBpcyBpbiBbLTkwOyArOTBbO1xuICogLSBgZ2FtbWFgIGlzIGluIFstMTgwOyArMTgwWy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcltdfSBldWxlckFuZ2xlIC0gRXVsZXIgYW5nbGUgdG8gY29udmVydCwgcmVwcmVzZW50ZWQgYnkgYW4gYXJyYXkgb2YgbGVuZ3RoIDMgKGBbYWxwaGEsIGJldGEsIGdhbW1hXWApLlxuICovXG5mdW5jdGlvbiB1bmlmeUFsdChldWxlckFuZ2xlKSB7XG4gIC8vIENvbnZlbnRpb24gaGVyZTogVGFpdOKAk0JyeWFuIGFuZ2xlcyBaLVgnLVknJywgd2hlcmU6XG4gIC8vICAgYWxwaGEgaXMgaW4gWzA7ICszNjBbLFxuICAvLyAgIGJldGEgaXMgaW4gWy05MDsgKzkwWyxcbiAgLy8gICBnYW1tYSBpcyBpbiBbLTE4MDsgKzE4MFsuXG5cbiAgY29uc3QgYWxwaGFJc1ZhbGlkID0gKHR5cGVvZiBldWxlckFuZ2xlWzBdID09PSAnbnVtYmVyJyk7XG5cbiAgY29uc3QgX2FscGhhID0gKGFscGhhSXNWYWxpZCA/IGRlZ1RvUmFkKGV1bGVyQW5nbGVbMF0pIDogMCk7XG4gIGNvbnN0IF9iZXRhID0gZGVnVG9SYWQoZXVsZXJBbmdsZVsxXSk7XG4gIGNvbnN0IF9nYW1tYSA9IGRlZ1RvUmFkKGV1bGVyQW5nbGVbMl0pO1xuXG4gIGNvbnN0IGNBID0gTWF0aC5jb3MoX2FscGhhKTtcbiAgY29uc3QgY0IgPSBNYXRoLmNvcyhfYmV0YSk7XG4gIGNvbnN0IGNHID0gTWF0aC5jb3MoX2dhbW1hKTtcbiAgY29uc3Qgc0EgPSBNYXRoLnNpbihfYWxwaGEpO1xuICBjb25zdCBzQiA9IE1hdGguc2luKF9iZXRhKTtcbiAgY29uc3Qgc0cgPSBNYXRoLnNpbihfZ2FtbWEpO1xuXG4gIGxldCBhbHBoYSwgYmV0YSwgZ2FtbWE7XG5cbiAgbGV0IG0gPSBbXG4gICAgY0EgKiBjRyAtIHNBICogc0IgKiBzRyxcbiAgICAtY0IgKiBzQSxcbiAgICBjQSAqIHNHICsgY0cgKiBzQSAqIHNCLFxuICAgIGNHICogc0EgKyBjQSAqIHNCICogc0csXG4gICAgY0EgKiBjQixcbiAgICBzQSAqIHNHIC0gY0EgKiBjRyAqIHNCLFxuICAgIC1jQiAqIHNHLFxuICAgIHNCLFxuICAgIGNCICogY0dcbiAgXTtcbiAgbm9ybWFsaXplKG0pO1xuXG4gIGFscGhhID0gTWF0aC5hdGFuMigtbVsxXSwgbVs0XSk7XG4gIGFscGhhICs9IChhbHBoYSA8IDApID8gMiAqIE1hdGguUEkgOiAwOyAvLyBhdGFuMiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpIGFuZCArcGkgPT4gbWFrZSBzdXJlIGFscGhhIGlzIGluIFswLCAyKnBpWy5cbiAgYmV0YSA9IE1hdGguYXNpbihtWzddKTsgLy8gYXNpbiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpLzIgYW5kIHBpLzIgPT4gT0tcbiAgZ2FtbWEgPSBNYXRoLmF0YW4yKC1tWzZdLCBtWzhdKTsgLy8gYXRhbjIgcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waSBhbmQgK3BpID0+IE9LXG5cbiAgZXVsZXJBbmdsZVswXSA9IChhbHBoYUlzVmFsaWQgPyByYWRUb0RlZyhhbHBoYSkgOiBudWxsKTtcbiAgZXVsZXJBbmdsZVsxXSA9IHJhZFRvRGVnKGJldGEpO1xuICBldWxlckFuZ2xlWzJdID0gcmFkVG9EZWcoZ2FtbWEpO1xufVxuXG4vKipcbiAqIGBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZWAgc2luZ2xldG9uLlxuICogVGhlIGBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZWAgc2luZ2xldG9uIHByb3ZpZGVzIHRoZSByYXcgdmFsdWVzXG4gKiBvZiB0aGUgb3JpZW50YXRpb24gcHJvdmlkZWQgYnkgdGhlIGBEZXZpY2VNb3Rpb25gIGV2ZW50LlxuICogSXQgYWxzbyBpbnN0YW50aWF0ZSB0aGUgYE9yaWVudGF0aW9uYCBzdWJtb2R1bGUgdGhhdCB1bmlmaWVzIHRob3NlXG4gKiB2YWx1ZXMgYWNyb3NzIHBsYXRmb3JtcyBieSBtYWtpbmcgdGhlbSBjb21wbGlhbnQgd2l0aCB7QGxpbmtcbiAqIGh0dHA6Ly93d3cudzMub3JnL1RSL29yaWVudGF0aW9uLWV2ZW50L3x0aGUgVzNDIHN0YW5kYXJkfSAoKmkuZS4qXG4gKiB0aGUgYGFscGhhYCBhbmdsZSBiZXR3ZWVuIGAwYCBhbmQgYDM2MGAgZGVncmVlcywgdGhlIGBiZXRhYCBhbmdsZVxuICogYmV0d2VlbiBgLTE4MGAgYW5kIGAxODBgIGRlZ3JlZXMsIGFuZCBgZ2FtbWFgIGJldHdlZW4gYC05MGAgYW5kXG4gKiBgOTBgIGRlZ3JlZXMpLCBhcyB3ZWxsIGFzIHRoZSBgT3JpZW50YXRpb25BbHRgIHN1Ym1vZHVsZXMgKHdpdGhcbiAqIHRoZSBgYWxwaGFgIGFuZ2xlIGJldHdlZW4gYDBgIGFuZCBgMzYwYCBkZWdyZWVzLCB0aGUgYGJldGFgIGFuZ2xlXG4gKiBiZXR3ZWVuIGAtOTBgIGFuZCBgOTBgIGRlZ3JlZXMsIGFuZCBgZ2FtbWFgIGJldHdlZW4gYC0xODBgIGFuZFxuICogYDE4MGAgZGVncmVlcykuXG4gKiBXaGVuIHRoZSBgb3JpZW50YXRpb25gIHJhdyB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSB0aGUgc2Vuc29ycyxcbiAqIHRoaXMgbW9kdWxlcyB0cmllcyB0byByZWNhbGN1bGF0ZSBgYmV0YWAgYW5kIGBnYW1tYWAgZnJvbSB0aGVcbiAqIGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCBtb2R1bGUsIGlmIGF2YWlsYWJsZSAoaW4gdGhhdCBjYXNlLFxuICogdGhlIGBhbHBoYWAgYW5nbGUgaXMgaW1wb3NzaWJsZSB0byByZXRyaWV2ZSBzaW5jZSB0aGUgY29tcGFzcyBpc1xuICogbm90IGF2YWlsYWJsZSkuXG4gKlxuICogQGNsYXNzIERldmljZU1vdGlvbk1vZHVsZVxuICogQGV4dGVuZHMgSW5wdXRNb2R1bGVcbiAqL1xuY2xhc3MgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGUgZXh0ZW5kcyBJbnB1dE1vZHVsZSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGBEZXZpY2VPcmllbnRhdGlvbmAgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCdkZXZpY2VvcmllbnRhdGlvbicpO1xuXG4gICAgLyoqXG4gICAgICogUmF3IHZhbHVlcyBjb21pbmcgZnJvbSB0aGUgYGRldmljZW9yaWVudGF0aW9uYCBldmVudCBzZW50IGJ5IHRoaXMgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgW251bGwsIG51bGwsIG51bGxdXG4gICAgICovXG4gICAgdGhpcy5ldmVudCA9IFtudWxsLCBudWxsLCBudWxsXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgT3JpZW50YXRpb25gIG1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyB1bmlmaWVkIHZhbHVlcyBvZiB0aGUgb3JpZW50YXRpb24gY29tcGxpYW50IHdpdGgge0BsaW5rXG4gICAgICogaHR0cDovL3d3dy53My5vcmcvVFIvb3JpZW50YXRpb24tZXZlbnQvfHRoZSBXM0Mgc3RhbmRhcmR9XG4gICAgICogKGBhbHBoYWAgaW4gYFswLCAzNjBdYCwgYmV0YSBpbiBgWy0xODAsICsxODBdYCwgYGdhbW1hYCBpbiBgWy05MCwgKzkwXWApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAnb3JpZW50YXRpb24nKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgT3JpZW50YXRpb25BbHRgIG1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyBhbHRlcm5hdGl2ZSB2YWx1ZXMgb2YgdGhlIG9yaWVudGF0aW9uXG4gICAgICogKGBhbHBoYWAgaW4gYFswLCAzNjBdYCwgYmV0YSBpbiBgWy05MCwgKzkwXWAsIGBnYW1tYWAgaW4gYFstMTgwLCArMTgwXWApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5vcmllbnRhdGlvbkFsdCA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAnb3JpZW50YXRpb25BbHQnKTtcblxuICAgIC8qKlxuICAgICAqIFJlcXVpcmVkIHN1Ym1vZHVsZXMgLyBldmVudHMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtib29sfSBvcmllbnRhdGlvbiAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBgb3JpZW50YXRpb25gIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gb3JpZW50YXRpb25BbHQgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYG9yaWVudGF0aW9uQWx0YCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICovXG4gICAgdGhpcy5yZXF1aXJlZCA9IHtcbiAgICAgIG9yaWVudGF0aW9uOiBmYWxzZSxcbiAgICAgIG9yaWVudGF0aW9uQWx0OiBmYWxzZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlIGZ1bmN0aW9uIG9mIHRoZSBtb2R1bGUncyBwcm9taXNlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqIEBzZWUgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGUjaW5pdFxuICAgICAqL1xuICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEdyYXZpdHkgdmVjdG9yIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fZXN0aW1hdGVkR3Jhdml0eSA9IFswLCAwLCAwXTtcblxuICAgIHRoaXMuX3Byb2Nlc3NGdW5jdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fcHJvY2VzcyA9IHRoaXMuX3Byb2Nlc3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9kZXZpY2VvcmllbnRhdGlvbkNoZWNrID0gdGhpcy5fZGV2aWNlb3JpZW50YXRpb25DaGVjay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2RldmljZW9yaWVudGF0aW9uTGlzdGVuZXIgPSB0aGlzLl9kZXZpY2VvcmllbnRhdGlvbkxpc3RlbmVyLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU2Vuc29yIGNoZWNrIG9uIGluaXRpYWxpemF0aW9uIG9mIHRoZSBtb2R1bGUuXG4gICAqIFRoaXMgbWV0aG9kOlxuICAgKiAtIGNoZWNrcyB3aGV0aGVyIHRoZSBgb3JpZW50YXRpb25gIHZhbHVlcyBhcmUgdmFsaWQgb3Igbm90O1xuICAgKiAtIChpbiB0aGUgY2FzZSB3aGVyZSBvcmllbnRhdGlvbiByYXcgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQpXG4gICAqICAgdHJpZXMgdG8gY2FsY3VsYXRlIHRoZSBvcmllbnRhdGlvbiBmcm9tIHRoZVxuICAgKiAgIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIEZpcnN0IGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgY2F1Z2h0LCBvbiB3aGljaCB0aGUgY2hlY2sgaXMgZG9uZS5cbiAgICovXG4gIF9kZXZpY2VvcmllbnRhdGlvbkNoZWNrKGUpIHtcbiAgICB0aGlzLmlzUHJvdmlkZWQgPSB0cnVlO1xuXG4gICAgLy8gU2Vuc29yIGF2YWlsYWJpbGl0eSBmb3IgdGhlIG9yaWVudGF0aW9uIGFuZCBhbHRlcm5hdGl2ZSBvcmllbnRhdGlvblxuICAgIGNvbnN0IHJhd1ZhbHVlc1Byb3ZpZGVkID0gKCh0eXBlb2YgZS5hbHBoYSA9PT0gJ251bWJlcicpICYmICh0eXBlb2YgZS5iZXRhID09PSAnbnVtYmVyJykgJiYgKHR5cGVvZiBlLmdhbW1hID09PSAnbnVtYmVyJykpO1xuICAgIHRoaXMub3JpZW50YXRpb24uaXNQcm92aWRlZCA9IHJhd1ZhbHVlc1Byb3ZpZGVkO1xuICAgIHRoaXMub3JpZW50YXRpb25BbHQuaXNQcm92aWRlZCA9IHJhd1ZhbHVlc1Byb3ZpZGVkO1xuXG4gICAgLy8gVE9ETyg/KTogZ2V0IHBzZXVkby1wZXJpb2RcblxuICAgIC8vIHN3YXAgdGhlIHByb2Nlc3MgZnVuY3Rpb24gdG8gdGhlXG4gICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5fZGV2aWNlb3JpZW50YXRpb25MaXN0ZW5lcjtcblxuICAgIC8vIElmIG9yaWVudGF0aW9uIG9yIGFsdGVybmF0aXZlIG9yaWVudGF0aW9uIGFyZSBub3QgcHJvdmlkZWQgYnkgcmF3IHNlbnNvcnMgYnV0IHJlcXVpcmVkLFxuICAgIC8vIHRyeSB0byBjYWxjdWxhdGUgdGhlbSB3aXRoIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlc1xuICAgIGlmICgodGhpcy5yZXF1aXJlZC5vcmllbnRhdGlvbiAmJiAhdGhpcy5vcmllbnRhdGlvbi5pc1Byb3ZpZGVkKSB8fCAodGhpcy5yZXF1aXJlZC5vcmllbnRhdGlvbkFsdCAmJiAhdGhpcy5vcmllbnRhdGlvbkFsdC5pc1Byb3ZpZGVkKSlcbiAgICAgIHRoaXMuX3RyeUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlGYWxsYmFjaygpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIGAnZGV2aWNlb3JpZW50YXRpb24nYCBldmVudCBjYWxsYmFjay5cbiAgICogVGhpcyBtZXRob2QgZW1pdHMgYW4gZXZlbnQgd2l0aCB0aGUgcmF3IGAnZGV2aWNlb3JpZW50YXRpb24nYCB2YWx1ZXMsXG4gICAqIGFuZCBlbWl0cyBldmVudHMgd2l0aCB0aGUgdW5pZmllZCBgb3JpZW50YXRpb25gIGFuZCAvIG9yIHRoZVxuICAgKiBgb3JpZW50YXRpb25BbHRgIHZhbHVlcyBpZiB0aGV5IGFyZSByZXF1aXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VPcmllbnRhdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2VvcmllbnRhdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICovXG4gIF9kZXZpY2VvcmllbnRhdGlvbkxpc3RlbmVyKGUpIHtcbiAgICAvLyAnZGV2aWNlb3JpZW50YXRpb24nIGV2ZW50IChyYXcgdmFsdWVzKVxuICAgIGxldCBvdXRFdmVudCA9IHRoaXMuZXZlbnQ7XG5cbiAgICBvdXRFdmVudFswXSA9IGUuYWxwaGE7XG4gICAgb3V0RXZlbnRbMV0gPSBlLmJldGE7XG4gICAgb3V0RXZlbnRbMl0gPSBlLmdhbW1hO1xuXG4gICAgaWYgKHRoaXMubGlzdGVuZXJzLnNpemUgPiAwKVxuICAgICAgdGhpcy5lbWl0KG91dEV2ZW50KTtcblxuICAgIC8vICdvcmllbnRhdGlvbicgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIGlmICh0aGlzLm9yaWVudGF0aW9uLmxpc3RlbmVycy5zaXplID4gMCAmJlxuICAgICAgICB0aGlzLnJlcXVpcmVkLm9yaWVudGF0aW9uICYmXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24uaXNQcm92aWRlZFxuICAgICkge1xuICAgICAgLy8gT24gaU9TLCB0aGUgYGFscGhhYCB2YWx1ZSBpcyBpbml0aWFsaXplZCBhdCBgMGAgb24gdGhlIGZpcnN0IGBkZXZpY2VvcmllbnRhdGlvbmAgZXZlbnRcbiAgICAgIC8vIHNvIHdlIGtlZXAgdGhhdCByZWZlcmVuY2UgaW4gbWVtb3J5IHRvIGNhbGN1bGF0ZSB0aGUgTm9ydGggbGF0ZXIgb25cbiAgICAgIGlmICghdGhpcy5vcmllbnRhdGlvbi5fd2Via2l0Q29tcGFzc0hlYWRpbmdSZWZlcmVuY2UgJiYgZS53ZWJraXRDb21wYXNzSGVhZGluZyAmJiBwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdpT1MnKVxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uLl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSA9IGUud2Via2l0Q29tcGFzc0hlYWRpbmc7XG5cbiAgICAgIGxldCBvdXRFdmVudCA9IHRoaXMub3JpZW50YXRpb24uZXZlbnQ7XG5cbiAgICAgIG91dEV2ZW50WzBdID0gZS5hbHBoYTtcbiAgICAgIG91dEV2ZW50WzFdID0gZS5iZXRhO1xuICAgICAgb3V0RXZlbnRbMl0gPSBlLmdhbW1hO1xuXG4gICAgICAvLyBPbiBpT1MsIHJlcGxhY2UgdGhlIGBhbHBoYWAgdmFsdWUgYnkgdGhlIE5vcnRoIHZhbHVlIGFuZCB1bmlmeSB0aGUgYW5nbGVzXG4gICAgICAvLyAodGhlIGRlZmF1bHQgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFuZ2xlcyBvbiBpT1MgaXMgbm90IGNvbXBsaWFudCB3aXRoIHRoZSBXM0Mgc3BlY2lmaWNhdGlvbilcbiAgICAgIGlmICh0aGlzLm9yaWVudGF0aW9uLl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSAmJiBwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdpT1MnKSB7XG4gICAgICAgIG91dEV2ZW50WzBdICs9IDM2MCAtIHRoaXMub3JpZW50YXRpb24uX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlO1xuICAgICAgICB1bmlmeShvdXRFdmVudCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3JpZW50YXRpb24uZW1pdChvdXRFdmVudCk7XG4gICAgfVxuXG4gICAgLy8gJ29yaWVudGF0aW9uQWx0JyBldmVudFxuICAgIGlmICh0aGlzLm9yaWVudGF0aW9uQWx0Lmxpc3RlbmVycy5zaXplID4gMCAmJlxuICAgICAgICB0aGlzLnJlcXVpcmVkLm9yaWVudGF0aW9uQWx0ICYmXG4gICAgICAgIHRoaXMub3JpZW50YXRpb25BbHQuaXNQcm92aWRlZFxuICAgICkge1xuICAgICAgLy8gT24gaU9TLCB0aGUgYGFscGhhYCB2YWx1ZSBpcyBpbml0aWFsaXplZCBhdCBgMGAgb24gdGhlIGZpcnN0IGBkZXZpY2VvcmllbnRhdGlvbmAgZXZlbnRcbiAgICAgIC8vIHNvIHdlIGtlZXAgdGhhdCByZWZlcmVuY2UgaW4gbWVtb3J5IHRvIGNhbGN1bGF0ZSB0aGUgTm9ydGggbGF0ZXIgb25cbiAgICAgIGlmICghdGhpcy5vcmllbnRhdGlvbkFsdC5fd2Via2l0Q29tcGFzc0hlYWRpbmdSZWZlcmVuY2UgJiYgZS53ZWJraXRDb21wYXNzSGVhZGluZyAmJiBwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdpT1MnKVxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uQWx0Ll93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSA9IGUud2Via2l0Q29tcGFzc0hlYWRpbmc7XG5cbiAgICAgIGxldCBvdXRFdmVudCA9IHRoaXMub3JpZW50YXRpb25BbHQuZXZlbnQ7XG5cbiAgICAgIG91dEV2ZW50WzBdID0gZS5hbHBoYTtcbiAgICAgIG91dEV2ZW50WzFdID0gZS5iZXRhO1xuICAgICAgb3V0RXZlbnRbMl0gPSBlLmdhbW1hO1xuXG4gICAgICAvLyBPbiBpT1MsIHJlcGxhY2UgdGhlIGBhbHBoYWAgdmFsdWUgYnkgdGhlIE5vcnRoIHZhbHVlIGJ1dCBkbyBub3QgY29udmVydCB0aGUgYW5nbGVzXG4gICAgICAvLyAodGhlIGRlZmF1bHQgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFuZ2xlcyBvbiBpT1MgaXMgY29tcGxpYW50IHdpdGggdGhlIGFsdGVybmF0aXZlIHJlcHJlc2VudGF0aW9uKVxuICAgICAgaWYgKHRoaXMub3JpZW50YXRpb25BbHQuX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlICYmIHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycpe1xuICAgICAgICBvdXRFdmVudFswXSAtPSB0aGlzLm9yaWVudGF0aW9uQWx0Ll93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZTtcbiAgICAgICAgb3V0RXZlbnRbMF0gKz0gKG91dEV2ZW50WzBdIDwgMCkgPyAzNjAgOiAwOyAvLyBtYWtlIHN1cmUgYGFscGhhYCBpcyBpbiBbMCwgKzM2MFtcbiAgICAgIH1cblxuICAgICAgLy8gT24gQW5kcm9pZCwgdHJhbnNmb3JtIHRoZSBhbmdsZXMgdG8gdGhlIGFsdGVybmF0aXZlIHJlcHJlc2VudGF0aW9uXG4gICAgICAvLyAodGhlIGRlZmF1bHQgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFuZ2xlcyBvbiBBbmRyb2lkIGlzIGNvbXBsaWFudCB3aXRoIHRoZSBXM0Mgc3BlY2lmaWNhdGlvbilcbiAgICAgIGlmIChwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdBbmRyb2lkJylcbiAgICAgICAgdW5pZnlBbHQob3V0RXZlbnQpO1xuXG4gICAgICB0aGlzLm9yaWVudGF0aW9uQWx0LmVtaXQob3V0RXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciBgYmV0YWAgYW5kIGBnYW1tYWAgY2FuIGJlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHZhbHVlcyBvciBub3QuXG4gICAqL1xuICBfdHJ5QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eUZhbGxiYWNrKCkge1xuICAgIE1vdGlvbklucHV0LnJlcXVpcmVNb2R1bGUoJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknKVxuICAgICAgLnRoZW4oKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpID0+IHtcbiAgICAgICAgaWYgKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiV0FSTklORyAobW90aW9uLWlucHV0KTogVGhlICdkZXZpY2VvcmllbnRhdGlvbicgZXZlbnQgZG9lcyBub3QgZXhpc3Qgb3IgZG9lcyBub3QgcHJvdmlkZSB2YWx1ZXMgaW4geW91ciBicm93c2VyLCBzbyB0aGUgb3JpZW50YXRpb24gb2YgdGhlIGRldmljZSBpcyBlc3RpbWF0ZWQgZnJvbSBEZXZpY2VNb3Rpb24ncyAnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScgZXZlbnQuIFNpbmNlIHRoZSBjb21wYXNzIGlzIG5vdCBhdmFpbGFibGUsIG9ubHkgdGhlIGBiZXRhYCBhbmQgYGdhbW1hYCBhbmdsZXMgYXJlIHByb3ZpZGVkIChgYWxwaGFgIGlzIG51bGwpLlwiKTtcblxuICAgICAgICAgIGlmICh0aGlzLnJlcXVpcmVkLm9yaWVudGF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uLmlzQ2FsY3VsYXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uLnBlcmlvZCA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkucGVyaW9kO1xuXG4gICAgICAgICAgICBNb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcignYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScsIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZUJldGFBbmRHYW1tYUZyb21BY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMucmVxdWlyZWQub3JpZW50YXRpb25BbHQpIHtcbiAgICAgICAgICAgIHRoaXMub3JpZW50YXRpb25BbHQuaXNDYWxjdWxhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMub3JpZW50YXRpb25BbHQucGVyaW9kID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5wZXJpb2Q7XG5cbiAgICAgICAgICAgIE1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JywgKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlQmV0YUFuZEdhbW1hRnJvbUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSh0aGlzKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgYW5kIGVtaXRzIGBiZXRhYCBhbmQgYGdhbW1hYCB2YWx1ZXMgYXMgYSBmYWxsYmFjayBvZiB0aGUgYG9yaWVudGF0aW9uYCBhbmQgLyBvciBgb3JpZW50YXRpb25BbHRgIGV2ZW50cywgZnJvbSB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcltdfSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IC0gTGF0ZXN0IGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IHJhdyB2YWx1ZXMuXG4gICAqIEBwYXJhbSB7Ym9vbH0gW2FsdD1mYWxzZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB3ZSBuZWVkIHRoZSBhbHRlcm5hdGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFuZ2xlcyBvciBub3QuXG4gICAqL1xuICBfY2FsY3VsYXRlQmV0YUFuZEdhbW1hRnJvbUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSwgYWx0ID0gZmFsc2UpIHtcbiAgICBjb25zdCBrID0gMC44O1xuXG4gICAgLy8gTG93IHBhc3MgZmlsdGVyIHRvIGVzdGltYXRlIHRoZSBncmF2aXR5XG4gICAgdGhpcy5fZXN0aW1hdGVkR3Jhdml0eVswXSA9IGsgKiB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzBdICsgKDEgLSBrKSAqIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF07XG4gICAgdGhpcy5fZXN0aW1hdGVkR3Jhdml0eVsxXSA9IGsgKiB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzFdICsgKDEgLSBrKSAqIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV07XG4gICAgdGhpcy5fZXN0aW1hdGVkR3Jhdml0eVsyXSA9IGsgKiB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzJdICsgKDEgLSBrKSAqIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl07XG5cbiAgICBsZXQgX2dYID0gdGhpcy5fZXN0aW1hdGVkR3Jhdml0eVswXTtcbiAgICBsZXQgX2dZID0gdGhpcy5fZXN0aW1hdGVkR3Jhdml0eVsxXTtcbiAgICBsZXQgX2daID0gdGhpcy5fZXN0aW1hdGVkR3Jhdml0eVsyXTtcblxuICAgIGNvbnN0IG5vcm0gPSBNYXRoLnNxcnQoX2dYICogX2dYICsgX2dZICogX2dZICsgX2daICogX2daKTtcblxuICAgIF9nWCAvPSBub3JtO1xuICAgIF9nWSAvPSBub3JtO1xuICAgIF9nWiAvPSBub3JtO1xuXG4gICAgLy8gQWRvcHRpbmcgdGhlIGZvbGxvd2luZyBjb252ZW50aW9uczpcbiAgICAvLyAtIGVhY2ggbWF0cml4IG9wZXJhdGVzIGJ5IHByZS1tdWx0aXBseWluZyBjb2x1bW4gdmVjdG9ycyxcbiAgICAvLyAtIGVhY2ggbWF0cml4IHJlcHJlc2VudHMgYW4gYWN0aXZlIHJvdGF0aW9uLFxuICAgIC8vIC0gZWFjaCBtYXRyaXggcmVwcmVzZW50cyB0aGUgY29tcG9zaXRpb24gb2YgaW50cmluc2ljIHJvdGF0aW9ucyxcbiAgICAvLyB0aGUgcm90YXRpb24gbWF0cml4IHJlcHJlc2VudGluZyB0aGUgY29tcG9zaXRpb24gb2YgYSByb3RhdGlvblxuICAgIC8vIGFib3V0IHRoZSB4LWF4aXMgYnkgYW4gYW5nbGUgYmV0YSBhbmQgYSByb3RhdGlvbiBhYm91dCB0aGUgeS1heGlzXG4gICAgLy8gYnkgYW4gYW5nbGUgZ2FtbWEgaXM6XG4gICAgLy9cbiAgICAvLyBbIGNvcyhnYW1tYSkgICAgICAgICAgICAgICAsICAwICAgICAgICAgICwgIHNpbihnYW1tYSkgICAgICAgICAgICAgICxcbiAgICAvLyAgIHNpbihiZXRhKSAqIHNpbihnYW1tYSkgICAsICBjb3MoYmV0YSkgICwgIC1jb3MoZ2FtbWEpICogc2luKGJldGEpICxcbiAgICAvLyAgIC1jb3MoYmV0YSkgKiBzaW4oZ2FtbWEpICAsICBzaW4oYmV0YSkgICwgIGNvcyhiZXRhKSAqIGNvcyhnYW1tYSkgIF0uXG4gICAgLy9cbiAgICAvLyBIZW5jZSwgdGhlIHByb2plY3Rpb24gb2YgdGhlIG5vcm1hbGl6ZWQgZ3Jhdml0eSBnID0gWzAsIDAsIDFdXG4gICAgLy8gaW4gdGhlIGRldmljZSdzIHJlZmVyZW5jZSBmcmFtZSBjb3JyZXNwb25kcyB0bzpcbiAgICAvL1xuICAgIC8vIGdYID0gLWNvcyhiZXRhKSAqIHNpbihnYW1tYSksXG4gICAgLy8gZ1kgPSBzaW4oYmV0YSksXG4gICAgLy8gZ1ogPSBjb3MoYmV0YSkgKiBjb3MoZ2FtbWEpLFxuICAgIC8vXG4gICAgLy8gc28gYmV0YSA9IGFzaW4oZ1kpIGFuZCBnYW1tYSA9IGF0YW4yKC1nWCwgZ1opLlxuXG4gICAgLy8gQmV0YSAmIGdhbW1hIGVxdWF0aW9ucyAod2UgYXBwcm94aW1hdGUgW2dYLCBnWSwgZ1pdIGJ5IFtfZ1gsIF9nWSwgX2daXSlcbiAgICBsZXQgYmV0YSA9IHJhZFRvRGVnKE1hdGguYXNpbihfZ1kpKTsgLy8gYmV0YSBpcyBpbiBbLXBpLzI7IHBpLzJbXG4gICAgbGV0IGdhbW1hID0gcmFkVG9EZWcoTWF0aC5hdGFuMigtX2dYLCBfZ1opKTsgLy8gZ2FtbWEgaXMgaW4gWy1waTsgcGlbXG5cbiAgICBpZiAoYWx0KSB7XG4gICAgICAvLyBJbiB0aGF0IGNhc2UsIHRoZXJlIGlzIG5vdGhpbmcgdG8gZG8gc2luY2UgdGhlIGNhbGN1bGF0aW9ucyBhYm92ZSBnYXZlIHRoZSBhbmdsZSBpbiB0aGUgcmlnaHQgcmFuZ2VzXG4gICAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLm9yaWVudGF0aW9uQWx0LmV2ZW50O1xuICAgICAgb3V0RXZlbnRbMF0gPSBudWxsO1xuICAgICAgb3V0RXZlbnRbMV0gPSBiZXRhO1xuICAgICAgb3V0RXZlbnRbMl0gPSBnYW1tYTtcblxuICAgICAgdGhpcy5vcmllbnRhdGlvbkFsdC5lbWl0KG91dEV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSGVyZSB3ZSBoYXZlIHRvIHVuaWZ5IHRoZSBhbmdsZXMgdG8gZ2V0IHRoZSByYW5nZXMgY29tcGxpYW50IHdpdGggdGhlIFczQyBzcGVjaWZpY2F0aW9uXG4gICAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLm9yaWVudGF0aW9uLmV2ZW50O1xuICAgICAgb3V0RXZlbnRbMF0gPSBudWxsO1xuICAgICAgb3V0RXZlbnRbMV0gPSBiZXRhO1xuICAgICAgb3V0RXZlbnRbMl0gPSBnYW1tYTtcbiAgICAgIHVuaWZ5KG91dEV2ZW50KTtcblxuICAgICAgdGhpcy5vcmllbnRhdGlvbi5lbWl0KG91dEV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBfcHJvY2VzcyhkYXRhKSB7XG4gICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uKGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIG9mIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBpbml0KCkge1xuICAgIHJldHVybiBzdXBlci5pbml0KChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSA9IHJlc29sdmU7XG5cbiAgICAgIGlmICh3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudCkge1xuICAgICAgICB0aGlzLl9wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLl9kZXZpY2VvcmllbnRhdGlvbkNoZWNrO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCB0aGlzLl9wcm9jZXNzLCBmYWxzZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucmVxdWlyZWQub3JpZW50YXRpb24pIHtcbiAgICAgICAgdGhpcy5fdHJ5QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eUZhbGxiYWNrKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKHRoaXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZSgpO1xuIiwiaW1wb3J0IElucHV0TW9kdWxlIGZyb20gJy4vSW5wdXRNb2R1bGUnO1xuaW1wb3J0IG1vdGlvbklucHV0IGZyb20gJy4vTW90aW9uSW5wdXQnO1xuXG4vKipcbiAqIEVuZXJneSBtb2R1bGUgc2luZ2xldG9uLlxuICogVGhlIGVuZXJneSBtb2R1bGUgc2luZ2xldG9uIHByb3ZpZGVzIGVuZXJneSB2YWx1ZXMgKGJldHdlZW4gMCBhbmQgMSlcbiAqIGJhc2VkIG9uIHRoZSBhY2NlbGVyYXRpb24gYW5kIHRoZSByb3RhdGlvbiByYXRlIG9mIHRoZSBkZXZpY2UuXG4gKiBUaGUgcGVyaW9kIG9mIHRoZSBlbmVyZ3kgdmFsdWVzIGlzIHRoZSBzYW1lIGFzIHRoZSBwZXJpb2Qgb2YgdGhlXG4gKiBhY2NlbGVyYXRpb24gYW5kIHRoZSByb3RhdGlvbiByYXRlIHZhbHVlcy5cbiAqXG4gKiBAY2xhc3MgRW5lcmd5TW9kdWxlXG4gKiBAZXh0ZW5kcyBJbnB1dE1vZHVsZVxuICovXG5jbGFzcyBFbmVyZ3lNb2R1bGUgZXh0ZW5kcyBJbnB1dE1vZHVsZSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGVuZXJneSBtb2R1bGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJ2VuZXJneScpO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnQgY29udGFpbmluZyB0aGUgdmFsdWUgb2YgdGhlIGVuZXJneSwgc2VudCBieSB0aGUgZW5lcmd5IG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIHRoaXMuZXZlbnQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFjY2VsZXJhdGlvbiBtb2R1bGUsIHVzZWQgaW4gdGhlIGNhbGN1bGF0aW9uIG9mIHRoZSBlbmVyZ3kuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqIEBzZWUgRGV2aWNlbW90aW9uTW9kdWxlXG4gICAgICovXG4gICAgdGhpcy5fYWNjZWxlcmF0aW9uTW9kdWxlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIExhdGVzdCBhY2NlbGVyYXRpb24gdmFsdWUgc2VudCBieSB0aGUgYWNjZWxlcmF0aW9uIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICovXG4gICAgdGhpcy5fYWNjZWxlcmF0aW9uVmFsdWVzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gdmFsdWUgcmVhY2hlZCBieSB0aGUgYWNjZWxlcmF0aW9uIG1hZ25pdHVkZSwgY2xpcHBlZCBhdCBgdGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlVGhyZXNob2xkYC5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgOS44MVxuICAgICAqL1xuICAgIHRoaXMuX2FjY2VsZXJhdGlvbk1hZ25pdHVkZUN1cnJlbnRNYXggPSAxICogOS44MTtcblxuICAgIC8qKlxuICAgICAqIENsaXBwaW5nIHZhbHVlIG9mIHRoZSBhY2NlbGVyYXRpb24gbWFnbml0dWRlLlxuICAgICAqXG4gICAgICogQHRoaXMgRW5lcmd5TW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAyMFxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIHRoaXMuX2FjY2VsZXJhdGlvbk1hZ25pdHVkZVRocmVzaG9sZCA9IDQgKiA5LjgxO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJvdGF0aW9uIHJhdGUgbW9kdWxlLCB1c2VkIGluIHRoZSBjYWxjdWxhdGlvbiBvZiB0aGUgZW5lcmd5LlxuICAgICAqXG4gICAgICogQHRoaXMgRW5lcmd5TW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKiBAc2VlIERldmljZW1vdGlvbk1vZHVsZVxuICAgICAqL1xuICAgIHRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBMYXRlc3Qgcm90YXRpb24gcmF0ZSB2YWx1ZSBzZW50IGJ5IHRoZSByb3RhdGlvbiByYXRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICovXG4gICAgdGhpcy5fcm90YXRpb25SYXRlVmFsdWVzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gdmFsdWUgcmVhY2hlZCBieSB0aGUgcm90YXRpb24gcmF0ZSBtYWduaXR1ZGUsIGNsaXBwZWQgYXQgYHRoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZVRocmVzaG9sZGAuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDQwMFxuICAgICAqL1xuICAgIHRoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZUN1cnJlbnRNYXggPSA0MDA7XG5cbiAgICAvKipcbiAgICAgKiBDbGlwcGluZyB2YWx1ZSBvZiB0aGUgcm90YXRpb24gcmF0ZSBtYWduaXR1ZGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDYwMFxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIHRoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZVRocmVzaG9sZCA9IDYwMDtcblxuICAgIC8qKlxuICAgICAqIFRpbWUgY29uc3RhbnQgKGhhbGYtbGlmZSkgb2YgdGhlIGxvdy1wYXNzIGZpbHRlciB1c2VkIHRvIHNtb290aCB0aGUgZW5lcmd5IHZhbHVlcyAoaW4gc2Vjb25kcykuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDAuMVxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIHRoaXMuX2VuZXJneVRpbWVDb25zdGFudCA9IDAuMTtcblxuICAgIHRoaXMuX29uQWNjZWxlcmF0aW9uID0gdGhpcy5fb25BY2NlbGVyYXRpb24uYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblJvdGF0aW9uUmF0ZSA9IHRoaXMuX29uUm90YXRpb25SYXRlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogRGVjYXkgZmFjdG9yIG9mIHRoZSBsb3ctcGFzcyBmaWx0ZXIgdXNlZCB0byBzbW9vdGggdGhlIGVuZXJneSB2YWx1ZXMuXG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IF9lbmVyZ3lEZWNheSgpIHtcbiAgICByZXR1cm4gTWF0aC5leHAoLTIgKiBNYXRoLlBJICogdGhpcy5wZXJpb2QgLyB0aGlzLl9lbmVyZ3lUaW1lQ29uc3RhbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIG9mIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBpbml0KCkge1xuICAgIHJldHVybiBzdXBlci5pbml0KChyZXNvbHZlKSA9PiB7XG4gICAgICAvLyBUaGUgZW5lcmd5IG1vZHVsZSByZXF1aXJlcyB0aGUgYWNjZWxlcmF0aW9uIGFuZCB0aGUgcm90YXRpb24gcmF0ZSBtb2R1bGVzXG4gICAgICBQcm9taXNlLmFsbChbbW90aW9uSW5wdXQucmVxdWlyZU1vZHVsZSgnYWNjZWxlcmF0aW9uJyksIG1vdGlvbklucHV0LnJlcXVpcmVNb2R1bGUoJ3JvdGF0aW9uUmF0ZScpXSlcbiAgICAgICAgLnRoZW4oKG1vZHVsZXMpID0+IHtcbiAgICAgICAgICBjb25zdCBbYWNjZWxlcmF0aW9uLCByb3RhdGlvblJhdGVdID0gbW9kdWxlcztcblxuICAgICAgICAgIHRoaXMuX2FjY2VsZXJhdGlvbk1vZHVsZSA9IGFjY2VsZXJhdGlvbjtcbiAgICAgICAgICB0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUgPSByb3RhdGlvblJhdGU7XG4gICAgICAgICAgdGhpcy5pc0NhbGN1bGF0ZWQgPSB0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUuaXNWYWxpZCB8fCB0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUuaXNWYWxpZDtcblxuICAgICAgICAgIGlmICh0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUuaXNWYWxpZClcbiAgICAgICAgICAgIHRoaXMucGVyaW9kID0gdGhpcy5fYWNjZWxlcmF0aW9uTW9kdWxlLnBlcmlvZDtcbiAgICAgICAgICBlbHNlIGlmICh0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUuaXNWYWxpZClcbiAgICAgICAgICAgIHRoaXMucGVyaW9kID0gdGhpcy5fcm90YXRpb25SYXRlTW9kdWxlLnBlcmlvZDtcblxuICAgICAgICAgIHJlc29sdmUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICBpZiAodGhpcy5saXN0ZW5lcnMuc2l6ZSA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMuX2FjY2VsZXJhdGlvbk1vZHVsZS5pc1ZhbGlkKVxuICAgICAgICB0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUuYWRkTGlzdGVuZXIodGhpcy5fb25BY2NlbGVyYXRpb24pO1xuICAgICAgaWYgKHRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZS5pc1ZhbGlkKVxuICAgICAgICB0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUuYWRkTGlzdGVuZXIodGhpcy5fb25Sb3RhdGlvblJhdGUpO1xuICAgIH1cblxuICAgIHN1cGVyLmFkZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgc3VwZXIucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgaWYgKHRoaXMubGlzdGVuZXJzLnNpemUgPT09IDApIHtcbiAgICAgIGlmICh0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUuaXNWYWxpZClcbiAgICAgICAgdGhpcy5fYWNjZWxlcmF0aW9uTW9kdWxlLnJlbW92ZUxpc3RlbmVyKHRoaXMuX29uQWNjZWxlcmF0aW9uKTtcbiAgICAgIGlmICh0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUuaXNWYWxpZClcbiAgICAgICAgdGhpcy5fcm90YXRpb25SYXRlTW9kdWxlLnJlbW92ZUxpc3RlbmVyKHRoaXMuX29uUm90YXRpb25SYXRlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWNjZWxlcmF0aW9uIHZhbHVlcyBoYW5kbGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcltdfSBhY2NlbGVyYXRpb24gLSBMYXRlc3QgYWNjZWxlcmF0aW9uIHZhbHVlLlxuICAgKi9cbiAgX29uQWNjZWxlcmF0aW9uKGFjY2VsZXJhdGlvbikge1xuICAgIHRoaXMuX2FjY2VsZXJhdGlvblZhbHVlcyA9IGFjY2VsZXJhdGlvbjtcblxuICAgIC8vIElmIHRoZSByb3RhdGlvbiByYXRlIHZhbHVlcyBhcmUgbm90IGF2YWlsYWJsZSwgd2UgY2FsY3VsYXRlIHRoZSBlbmVyZ3kgcmlnaHQgYXdheS5cbiAgICBpZiAoIXRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZS5pc1ZhbGlkKVxuICAgICAgdGhpcy5fY2FsY3VsYXRlRW5lcmd5KCk7XG4gIH1cblxuICAvKipcbiAgICogUm90YXRpb24gcmF0ZSB2YWx1ZXMgaGFuZGxlci5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJbXX0gcm90YXRpb25SYXRlIC0gTGF0ZXN0IHJvdGF0aW9uIHJhdGUgdmFsdWUuXG4gICAqL1xuICBfb25Sb3RhdGlvblJhdGUocm90YXRpb25SYXRlKSB7XG4gICAgdGhpcy5fcm90YXRpb25SYXRlVmFsdWVzID0gcm90YXRpb25SYXRlO1xuXG4gICAgLy8gV2Uga25vdyB0aGF0IHRoZSBhY2NlbGVyYXRpb24gYW5kIHJvdGF0aW9uIHJhdGUgdmFsdWVzIGNvbWluZyBmcm9tIHRoZVxuICAgIC8vIHNhbWUgYGRldmljZW1vdGlvbmAgZXZlbnQgYXJlIHNlbnQgaW4gdGhhdCBvcmRlciAoYWNjZWxlcmF0aW9uID4gcm90YXRpb24gcmF0ZSlcbiAgICAvLyBzbyB3aGVuIHRoZSByb3RhdGlvbiByYXRlIGlzIHByb3ZpZGVkLCB3ZSBjYWxjdWxhdGUgdGhlIGVuZXJneSB2YWx1ZSBvZiB0aGVcbiAgICAvLyBsYXRlc3QgYGRldmljZW1vdGlvbmAgZXZlbnQgd2hlbiB3ZSByZWNlaXZlIHRoZSByb3RhdGlvbiByYXRlIHZhbHVlcy5cbiAgICB0aGlzLl9jYWxjdWxhdGVFbmVyZ3koKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbmVyZ3kgY2FsY3VsYXRpb246IGVtaXRzIGFuIGVuZXJneSB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNoZWNrcyBpZiB0aGUgYWNjZWxlcmF0aW9uIG1vZHVsZXMgaXMgdmFsaWQuIElmIHRoYXQgaXMgdGhlIGNhc2UsXG4gICAqIGl0IGNhbGN1bGF0ZXMgYW4gZXN0aW1hdGlvbiBvZiB0aGUgZW5lcmd5IChiZXR3ZWVuIDAgYW5kIDEpIGJhc2VkIG9uIHRoZSByYXRpb1xuICAgKiBvZiB0aGUgY3VycmVudCBhY2NlbGVyYXRpb24gbWFnbml0dWRlIGFuZCB0aGUgbWF4aW11bSBhY2NlbGVyYXRpb24gbWFnbml0dWRlXG4gICAqIHJlYWNoZWQgc28gZmFyIChjbGlwcGVkIGF0IHRoZSBgdGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlVGhyZXNob2xkYCB2YWx1ZSkuXG4gICAqIChXZSB1c2UgdGhpcyB0cmljayB0byBnZXQgdW5pZm9ybSBiZWhhdmlvcnMgYW1vbmcgZGV2aWNlcy4gSWYgd2UgY2FsY3VsYXRlZFxuICAgKiB0aGUgcmF0aW8gYmFzZWQgb24gYSBmaXhlZCB2YWx1ZSBpbmRlcGVuZGVudCBvZiB3aGF0IHRoZSBkZXZpY2UgaXMgY2FwYWJsZSBvZlxuICAgKiBwcm92aWRpbmcsIHdlIGNvdWxkIGdldCBpbmNvbnNpc3RlbnQgYmVoYXZpb3JzLiBGb3IgaW5zdGFuY2UsIHRoZSBkZXZpY2VzXG4gICAqIHdob3NlIGFjY2VsZXJvbWV0ZXJzIGFyZSBsaW1pdGVkIGF0IDJnIHdvdWxkIGFsd2F5cyBwcm92aWRlIHZlcnkgbG93IHZhbHVlc1xuICAgKiBjb21wYXJlZCB0byBkZXZpY2VzIHdpdGggYWNjZWxlcm9tZXRlcnMgY2FwYWJsZSBvZiBtZWFzdXJpbmcgNGcgYWNjZWxlcmF0aW9ucy4pXG4gICAqIFRoZSBzYW1lIGNoZWNrcyBhbmQgY2FsY3VsYXRpb25zIGFyZSBtYWRlIG9uIHRoZSByb3RhdGlvbiByYXRlIG1vZHVsZS5cbiAgICogRmluYWxseSwgdGhlIGVuZXJneSB2YWx1ZSBpcyB0aGUgbWF4aW11bSBiZXR3ZWVuIHRoZSBlbmVyZ3kgdmFsdWUgZXN0aW1hdGVkXG4gICAqIGZyb20gdGhlIGFjY2VsZXJhdGlvbiwgYW5kIHRoZSBvbmUgZXN0aW1hdGVkIGZyb20gdGhlIHJvdGF0aW9uIHJhdGUuIEl0IGlzXG4gICAqIHNtb290aGVkIHRocm91Z2ggYSBsb3ctcGFzcyBmaWx0ZXIuXG4gICAqL1xuICBfY2FsY3VsYXRlRW5lcmd5KCkge1xuICAgIGxldCBhY2NlbGVyYXRpb25FbmVyZ3kgPSAwO1xuICAgIGxldCByb3RhdGlvblJhdGVFbmVyZ3kgPSAwO1xuXG4gICAgLy8gQ2hlY2sgdGhlIGFjY2VsZXJhdGlvbiBtb2R1bGUgYW5kIGNhbGN1bGF0ZSBhbiBlc3RpbWF0aW9uIG9mIHRoZSBlbmVyZ3kgdmFsdWUgZnJvbSB0aGUgbGF0ZXN0IGFjY2VsZXJhdGlvbiB2YWx1ZVxuICAgIGlmICh0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUuaXNWYWxpZCkge1xuICAgICAgbGV0IGFYID0gdGhpcy5fYWNjZWxlcmF0aW9uVmFsdWVzWzBdO1xuICAgICAgbGV0IGFZID0gdGhpcy5fYWNjZWxlcmF0aW9uVmFsdWVzWzFdO1xuICAgICAgbGV0IGFaID0gdGhpcy5fYWNjZWxlcmF0aW9uVmFsdWVzWzJdO1xuICAgICAgbGV0IGFjY2VsZXJhdGlvbk1hZ25pdHVkZSA9IE1hdGguc3FydChhWCAqIGFYICsgYVkgKiBhWSArIGFaICogYVopO1xuXG4gICAgICAvLyBTdG9yZSB0aGUgbWF4aW11bSBhY2NlbGVyYXRpb24gbWFnbml0dWRlIHJlYWNoZWQgc28gZmFyLCBjbGlwcGVkIGF0IGB0aGlzLl9hY2NlbGVyYXRpb25NYWduaXR1ZGVUaHJlc2hvbGRgXG4gICAgICBpZiAodGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlQ3VycmVudE1heCA8IGFjY2VsZXJhdGlvbk1hZ25pdHVkZSlcbiAgICAgICAgdGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlQ3VycmVudE1heCA9IE1hdGgubWluKGFjY2VsZXJhdGlvbk1hZ25pdHVkZSwgdGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlVGhyZXNob2xkKTtcbiAgICAgIC8vIFRPRE8oPyk6IHJlbW92ZSBvdWxpZXJzIC0tLSBvbiBzb21lIEFuZHJvaWQgZGV2aWNlcywgdGhlIG1hZ25pdHVkZSBpcyB2ZXJ5IGhpZ2ggb24gYSBmZXcgaXNvbGF0ZWQgZGF0YXBvaW50cyxcbiAgICAgIC8vIHdoaWNoIG1ha2UgdGhlIHRocmVzaG9sZCB2ZXJ5IGhpZ2ggYXMgd2VsbCA9PiB0aGUgZW5lcmd5IHJlbWFpbnMgYXJvdW5kIDAuNSwgZXZlbiB3aGVuIHlvdSBzaGFrZSB2ZXJ5IGhhcmQuXG5cbiAgICAgIGFjY2VsZXJhdGlvbkVuZXJneSA9IE1hdGgubWluKGFjY2VsZXJhdGlvbk1hZ25pdHVkZSAvIHRoaXMuX2FjY2VsZXJhdGlvbk1hZ25pdHVkZUN1cnJlbnRNYXgsIDEpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIHRoZSByb3RhdGlvbiByYXRlIG1vZHVsZSBhbmQgY2FsY3VsYXRlIGFuIGVzdGltYXRpb24gb2YgdGhlIGVuZXJneSB2YWx1ZSBmcm9tIHRoZSBsYXRlc3Qgcm90YXRpb24gcmF0ZSB2YWx1ZVxuICAgIGlmICh0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUuaXNWYWxpZCkge1xuICAgICAgbGV0IHJBID0gdGhpcy5fcm90YXRpb25SYXRlVmFsdWVzWzBdO1xuICAgICAgbGV0IHJCID0gdGhpcy5fcm90YXRpb25SYXRlVmFsdWVzWzFdO1xuICAgICAgbGV0IHJHID0gdGhpcy5fcm90YXRpb25SYXRlVmFsdWVzWzJdO1xuICAgICAgbGV0IHJvdGF0aW9uUmF0ZU1hZ25pdHVkZSA9IE1hdGguc3FydChyQSAqIHJBICsgckIgKiByQiArIHJHICogckcpO1xuXG4gICAgICAvLyBTdG9yZSB0aGUgbWF4aW11bSByb3RhdGlvbiByYXRlIG1hZ25pdHVkZSByZWFjaGVkIHNvIGZhciwgY2xpcHBlZCBhdCBgdGhpcy5fcm90YXRpb25SYXRlTWFnbml0dWRlVGhyZXNob2xkYFxuICAgICAgaWYgKHRoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZUN1cnJlbnRNYXggPCByb3RhdGlvblJhdGVNYWduaXR1ZGUpXG4gICAgICAgIHRoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZUN1cnJlbnRNYXggPSBNYXRoLm1pbihyb3RhdGlvblJhdGVNYWduaXR1ZGUsIHRoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZVRocmVzaG9sZCk7XG5cbiAgICAgIHJvdGF0aW9uUmF0ZUVuZXJneSA9IE1hdGgubWluKHJvdGF0aW9uUmF0ZU1hZ25pdHVkZSAvIHRoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZUN1cnJlbnRNYXgsIDEpO1xuICAgIH1cblxuICAgIGxldCBlbmVyZ3kgPSBNYXRoLm1heChhY2NlbGVyYXRpb25FbmVyZ3ksIHJvdGF0aW9uUmF0ZUVuZXJneSk7XG5cbiAgICAvLyBMb3ctcGFzcyBmaWx0ZXIgdG8gc21vb3RoIHRoZSBlbmVyZ3kgdmFsdWVzXG4gICAgY29uc3QgayA9IHRoaXMuX2VuZXJneURlY2F5O1xuICAgIHRoaXMuZXZlbnQgPSBrICogdGhpcy5ldmVudCArICgxIC0gaykgKiBlbmVyZ3k7XG5cbiAgICAvLyBFbWl0IHRoZSBlbmVyZ3kgdmFsdWVcbiAgICB0aGlzLmVtaXQodGhpcy5ldmVudCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEVuZXJneU1vZHVsZSgpO1xuIiwiLyoqXG4gKiBgSW5wdXRNb2R1bGVgIGNsYXNzLlxuICogVGhlIGBJbnB1dE1vZHVsZWAgY2xhc3MgYWxsb3dzIHRvIGluc3RhbnRpYXRlIG1vZHVsZXMgdGhhdCBhcmUgcGFydCBvZiB0aGVcbiAqIG1vdGlvbiBpbnB1dCBtb2R1bGUsIGFuZCB0aGF0IHByb3ZpZGUgdmFsdWVzIChmb3IgaW5zdGFuY2UsIGBkZXZpY2VvcmllbnRhdGlvbmAsXG4gKiBgYWNjZWxlcmF0aW9uYCwgYGVuZXJneWApLlxuICpcbiAqIEBjbGFzcyBJbnB1dE1vZHVsZVxuICovXG5jbGFzcyBJbnB1dE1vZHVsZSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYElucHV0TW9kdWxlYCBtb2R1bGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gTmFtZSBvZiB0aGUgbW9kdWxlIC8gZXZlbnQgKCplLmcuKiBgZGV2aWNlb3JpZW50YXRpb24sICdhY2NlbGVyYXRpb24nLCAnZW5lcmd5JykuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihldmVudFR5cGUpIHtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IHR5cGUgb2YgdGhlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIElucHV0TW9kdWxlXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50VHlwZSA9IGV2ZW50VHlwZTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIGxpc3RlbmVycyBhdHRhY2hlZCB0byB0aGlzIG1vZHVsZSAvIGV2ZW50LlxuICAgICAqXG4gICAgICogQHRoaXMgSW5wdXRNb2R1bGVcbiAgICAgKiBAdHlwZSB7U2V0PEZ1bmN0aW9uPn1cbiAgICAgKi9cbiAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBTZXQoKTtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IHNlbnQgYnkgdGhpcyBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ8bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIHRoaXMuZXZlbnQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIHByb21pc2UgKHJlc29sdmVkIHdoZW4gdGhlIG1vZHVsZSBpcyBpbml0aWFsaXplZCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtQcm9taXNlfVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICB0aGlzLnByb21pc2UgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIGlmIHRoZSBtb2R1bGUncyBldmVudCB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbSBwYXJlbnQgbW9kdWxlcyAvIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIEB0aGlzIElucHV0TW9kdWxlXG4gICAgICogQHR5cGUge2Jvb2x9XG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICB0aGlzLmlzQ2FsY3VsYXRlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIGlmIHRoZSBtb2R1bGUncyBldmVudCB2YWx1ZXMgYXJlIHByb3ZpZGVkIGJ5IHRoZSBkZXZpY2UncyBzZW5zb3JzLlxuICAgICAqICgqSS5lLiogaW5kaWNhdGVzIGlmIHRoZSBgJ2RldmljZW1vdGlvbidgIG9yIGAnZGV2aWNlb3JpZW50YXRpb24nYCBldmVudHMgcHJvdmlkZSB0aGUgcmVxdWlyZWQgcmF3IHZhbHVlcy4pXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtib29sfVxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgdGhpcy5pc1Byb3ZpZGVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBQZXJpb2QgYXQgd2hpY2ggdGhlIG1vZHVsZSdzIGV2ZW50cyBhcmUgc2VudCAoYHVuZGVmaW5lZGAgaWYgdGhlIGV2ZW50cyBhcmUgbm90IHNlbnQgYXQgcmVndWxhciBpbnRlcnZhbHMpLlxuICAgICAqXG4gICAgICogQHRoaXMgSW5wdXRNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IHVuZGVmaW5lZFxuICAgICAqL1xuICAgIHRoaXMucGVyaW9kID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5lbWl0ID0gdGhpcy5lbWl0LmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZSBjYW4gcHJvdmlkZSB2YWx1ZXMgb3Igbm90LlxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbH1cbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgaXNWYWxpZCgpIHtcbiAgICByZXR1cm4gKHRoaXMuaXNQcm92aWRlZCB8fCB0aGlzLmlzQ2FsY3VsYXRlZCk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvbWlzZUZ1biAtIFByb21pc2UgZnVuY3Rpb24gdGhhdCB0YWtlcyB0aGUgYHJlc29sdmVgIGFuZCBgcmVqZWN0YCBmdW5jdGlvbnMgYXMgYXJndW1lbnRzLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgaW5pdChwcm9taXNlRnVuKSB7XG4gICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UocHJvbWlzZUZ1bik7XG4gICAgcmV0dXJuIHRoaXMucHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdG8gdGhlIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgLSBMaXN0ZW5lciB0byBhZGQuXG4gICAqL1xuICBhZGRMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIHRoaXMubGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZyb20gdGhlIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgLSBMaXN0ZW5lciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gIH1cblxuICAvKipcbiAgICogUHJvcGFnYXRlcyBhbiBldmVudCB0byBhbGwgdGhlIG1vZHVsZSdzIGxpc3RlbmVycy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ8bnVtYmVyW119IFtldmVudD10aGlzLmV2ZW50XSAtIEV2ZW50IHZhbHVlcyB0byBwcm9wYWdhdGUgdG8gdGhlIG1vZHVsZSdzIGxpc3RlbmVycy5cbiAgICovXG4gIGVtaXQoZXZlbnQgPSB0aGlzLmV2ZW50KSB7XG4gICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiBsaXN0ZW5lcihldmVudCkpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IElucHV0TW9kdWxlO1xuIiwiLyoqXG4gKiBgTW90aW9uSW5wdXRgIHNpbmdsZXRvbi5cbiAqIFRoZSBgTW90aW9uSW5wdXRgIHNpbmdsZXRvbiBhbGxvd3MgdG8gaW5pdGlhbGl6ZSBtb3Rpb24gZXZlbnRzXG4gKiBhbmQgdG8gbGlzdGVuIHRvIHRoZW0uXG4gKlxuICogQGNsYXNzIE1vdGlvbklucHV0XG4gKi9cbmNsYXNzIE1vdGlvbklucHV0IHtcblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgYE1vdGlvbklucHV0YCBtb2R1bGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAvKipcbiAgICAgKiBQb29sIG9mIGFsbCBhdmFpbGFibGUgbW9kdWxlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIE1vdGlvbklucHV0XG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAZGVmYXVsdCB7fVxuICAgICAqL1xuICAgIHRoaXMubW9kdWxlcyA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBtb2R1bGUgdG8gdGhlIGBNb3Rpb25JbnB1dGAgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gTmFtZSBvZiB0aGUgZXZlbnQgdHlwZS5cbiAgICogQHBhcmFtIHtJbnB1dE1vZHVsZX0gbW9kdWxlIC0gTW9kdWxlIHRvIGFkZCB0byB0aGUgYE1vdGlvbklucHV0YCBtb2R1bGUuXG4gICAqL1xuICBhZGRNb2R1bGUoZXZlbnRUeXBlLCBtb2R1bGUpIHtcbiAgICB0aGlzLm1vZHVsZXNbZXZlbnRUeXBlXSA9IG1vZHVsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gTmFtZSBvZiB0aGUgZXZlbnQgdHlwZSAobW9kdWxlKSB0byByZXRyaWV2ZS5cbiAgICogQHJldHVybiB7SW5wdXRNb2R1bGV9XG4gICAqL1xuICBnZXRNb2R1bGUoZXZlbnRUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kdWxlc1tldmVudFR5cGVdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVpcmVzIGEgbW9kdWxlLlxuICAgKiBJZiB0aGUgbW9kdWxlIGhhcyBiZWVuIGluaXRpYWxpemVkIGFscmVhZHksIHJldHVybnMgaXRzIHByb21pc2UuIE90aGVyd2lzZSxcbiAgICogaW5pdGlhbGl6ZXMgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIE5hbWUgb2YgdGhlIGV2ZW50IHR5cGUgKG1vZHVsZSkgdG8gcmVxdWlyZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIHJlcXVpcmVNb2R1bGUoZXZlbnRUeXBlKSB7XG4gICAgY29uc3QgbW9kdWxlID0gdGhpcy5nZXRNb2R1bGUoZXZlbnRUeXBlKTtcblxuICAgIGlmIChtb2R1bGUucHJvbWlzZSlcbiAgICAgIHJldHVybiBtb2R1bGUucHJvbWlzZTtcblxuICAgIHJldHVybiBtb2R1bGUuaW5pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBgTW90aW9uSW5wdXRgIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBldmVudFR5cGVzIC0gQXJyYXkgb2YgdGhlIGV2ZW50IHR5cGVzIHRvIGluaXRpYWxpemUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBpbml0KC4uLmV2ZW50VHlwZXMpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudFR5cGVzWzBdKSlcbiAgICAgIGV2ZW50VHlwZXMgPSBldmVudFR5cGVzWzBdXG5cbiAgICBjb25zdCBtb2R1bGVQcm9taXNlcyA9IGV2ZW50VHlwZXMubWFwKCh2YWx1ZSkgPT4ge1xuICAgICAgY29uc3QgbW9kdWxlID0gdGhpcy5nZXRNb2R1bGUodmFsdWUpO1xuICAgICAgcmV0dXJuIG1vZHVsZS5pbml0KCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwobW9kdWxlUHJvbWlzZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBsaXN0ZW5lci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIE5hbWUgb2YgdGhlIGV2ZW50IHR5cGUgKG1vZHVsZSkgdG8gYWRkIGEgbGlzdGVuZXIgdG8uXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIC0gTGlzdGVuZXIgdG8gYWRkLlxuICAgKi9cbiAgYWRkTGlzdGVuZXIoZXZlbnRUeXBlLCBsaXN0ZW5lcikge1xuICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMuZ2V0TW9kdWxlKGV2ZW50VHlwZSk7XG4gICAgbW9kdWxlLmFkZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBOYW1lIG9mIHRoZSBldmVudCB0eXBlIChtb2R1bGUpIHRvIGFkZCBhIGxpc3RlbmVyIHRvLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBtb2R1bGUgPSB0aGlzLmdldE1vZHVsZShldmVudFR5cGUpO1xuICAgIG1vZHVsZS5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IE1vdGlvbklucHV0KCk7XG4iLCIvKipcbiAqIFRoZSBtb3Rpb24gaW5wdXQgbW9kdWxlIGNhbiBiZSB1c2VkIGFzIGZvbGxvd3NcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IG1vdGlvbklucHV0IGZyb20gJ21vdGlvbi1pbnB1dCc7XG4gKiBjb25zdCByZXF1aXJlZEV2ZW50cyA9IDtcbiAqXG4gKiBtb3Rpb25JbnB1dFxuICogIC5pbml0KFsnYWNjZWxlcmF0aW9uJywgJ29yaWVudGF0aW9uJywgJ2VuZXJneSddKVxuICogIC50aGVuKChbYWNjZWxlcmF0aW9uLCBvcmllbnRhdGlvbiwgZW5lcmd5XSkgPT4ge1xuICogICAgaWYgKGFjY2VsZXJhdGlvbi5pc1ZhbGlkKSB7XG4gKiAgICAgIGFjY2VsZXJhdGlvbi5hZGRMaXN0ZW5lcigoZGF0YSkgPT4ge1xuICogICAgICAgIGNvbnNvbGUubG9nKCdhY2NlbGVyYXRpb24nLCBkYXRhKTtcbiAqICAgICAgICAvLyBkbyBzb21ldGhpbmcgd2l0aCB0aGUgYWNjZWxlcmF0aW9uIHZhbHVlc1xuICogICAgICB9KTtcbiAqICAgIH1cbiAqXG4gKiAgICAvLyAuLi5cbiAqICB9KTtcbiAqL1xuaW1wb3J0IG1vdGlvbklucHV0IGZyb20gJy4vTW90aW9uSW5wdXQnO1xuaW1wb3J0IGRldmljZW9yaWVudGF0aW9uTW9kdWxlIGZyb20gJy4vRGV2aWNlT3JpZW50YXRpb25Nb2R1bGUnO1xuaW1wb3J0IGRldmljZW1vdGlvbk1vZHVsZSBmcm9tICcuL0RldmljZU1vdGlvbk1vZHVsZSc7XG5pbXBvcnQgZW5lcmd5IGZyb20gJy4vRW5lcmd5TW9kdWxlJztcblxubW90aW9uSW5wdXQuYWRkTW9kdWxlKCdkZXZpY2Vtb3Rpb24nLCBkZXZpY2Vtb3Rpb25Nb2R1bGUpO1xubW90aW9uSW5wdXQuYWRkTW9kdWxlKCdkZXZpY2VvcmllbnRhdGlvbicsIGRldmljZW9yaWVudGF0aW9uTW9kdWxlKTtcbm1vdGlvbklucHV0LmFkZE1vZHVsZSgnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScsIGRldmljZW1vdGlvbk1vZHVsZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KTtcbm1vdGlvbklucHV0LmFkZE1vZHVsZSgnYWNjZWxlcmF0aW9uJywgZGV2aWNlbW90aW9uTW9kdWxlLmFjY2VsZXJhdGlvbik7XG5tb3Rpb25JbnB1dC5hZGRNb2R1bGUoJ3JvdGF0aW9uUmF0ZScsIGRldmljZW1vdGlvbk1vZHVsZS5yb3RhdGlvblJhdGUpO1xubW90aW9uSW5wdXQuYWRkTW9kdWxlKCdvcmllbnRhdGlvbicsIGRldmljZW9yaWVudGF0aW9uTW9kdWxlLm9yaWVudGF0aW9uKTtcbm1vdGlvbklucHV0LmFkZE1vZHVsZSgnb3JpZW50YXRpb25BbHQnLCBkZXZpY2VvcmllbnRhdGlvbk1vZHVsZS5vcmllbnRhdGlvbkFsdCk7XG5tb3Rpb25JbnB1dC5hZGRNb2R1bGUoJ2VuZXJneScsIGVuZXJneSk7XG5cbmV4cG9ydCBkZWZhdWx0IG1vdGlvbklucHV0O1xuIiwiaW1wb3J0IG1vdGlvbklucHV0IGZyb20gJy4uLy4uLy4uL2Rpc3QvaW5kZXgnO1xuXG4vLyBTZW5zb3Igc3VwcG9ydCBET00gZWxlbWVudHNcbmNvbnN0IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlQcm92aWRlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5UHJvdmlkZWQnKTtcbmNvbnN0IGFjY2VsZXJhdGlvblByb3ZpZGVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FjY2VsZXJhdGlvblByb3ZpZGVkJyk7XG5jb25zdCByb3RhdGlvblJhdGVQcm92aWRlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyb3RhdGlvblJhdGVQcm92aWRlZCcpO1xuY29uc3Qgb3JpZW50YXRpb25Qcm92aWRlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcmllbnRhdGlvblByb3ZpZGVkJyk7XG5cbi8vIEFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eSBET00gZWxlbWVudHNcbmNvbnN0IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlYUmF3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlYUmF3Jyk7XG5jb25zdCBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WVJhdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WVJhdycpO1xuY29uc3QgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVpSYXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVpSYXcnKTtcblxuY29uc3QgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVhVbmlmaWVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlYVW5pZmllZCcpO1xuY29uc3QgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVlVbmlmaWVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlZVW5pZmllZCcpO1xuY29uc3QgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVpVbmlmaWVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlaVW5pZmllZCcpO1xuXG4vLyBBY2NlbGVyYXRpb24gRE9NIGVsZW1lbnRzXG5jb25zdCBhY2NlbGVyYXRpb25YUmF3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FjY2VsZXJhdGlvblhSYXcnKTtcbmNvbnN0IGFjY2VsZXJhdGlvbllSYXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWNjZWxlcmF0aW9uWVJhdycpO1xuY29uc3QgYWNjZWxlcmF0aW9uWlJhdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhY2NlbGVyYXRpb25aUmF3Jyk7XG5cbmNvbnN0IGFjY2VsZXJhdGlvblhVbmlmaWVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FjY2VsZXJhdGlvblhVbmlmaWVkJyk7XG5jb25zdCBhY2NlbGVyYXRpb25ZVW5pZmllZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhY2NlbGVyYXRpb25ZVW5pZmllZCcpO1xuY29uc3QgYWNjZWxlcmF0aW9uWlVuaWZpZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWNjZWxlcmF0aW9uWlVuaWZpZWQnKTtcblxuLy8gUm90YXRpb24gcmF0ZSBET00gZWxlbWVudHNcbmNvbnN0IHJvdGF0aW9uUmF0ZUFscGhhUmF3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvdGF0aW9uUmF0ZUFscGhhUmF3Jyk7XG5jb25zdCByb3RhdGlvblJhdGVCZXRhUmF3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvdGF0aW9uUmF0ZUJldGFSYXcnKTtcbmNvbnN0IHJvdGF0aW9uUmF0ZUdhbW1hUmF3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvdGF0aW9uUmF0ZUdhbW1hUmF3Jyk7XG5cbmNvbnN0IHJvdGF0aW9uUmF0ZUFscGhhVW5pZmllZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyb3RhdGlvblJhdGVBbHBoYVVuaWZpZWQnKTtcbmNvbnN0IHJvdGF0aW9uUmF0ZUJldGFVbmlmaWVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvdGF0aW9uUmF0ZUJldGFVbmlmaWVkJyk7XG5jb25zdCByb3RhdGlvblJhdGVHYW1tYVVuaWZpZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcm90YXRpb25SYXRlR2FtbWFVbmlmaWVkJyk7XG5cbi8vIE9yaWVudGF0aW9uIERPTSBlbGVtZW50c1xuY29uc3Qgb3JpZW50YXRpb25BbHBoYVJhdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcmllbnRhdGlvbkFscGhhUmF3Jyk7XG5jb25zdCBvcmllbnRhdGlvbkJldGFSYXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3JpZW50YXRpb25CZXRhUmF3Jyk7XG5jb25zdCBvcmllbnRhdGlvbkdhbW1hUmF3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI29yaWVudGF0aW9uR2FtbWFSYXcnKTtcblxuY29uc3Qgb3JpZW50YXRpb25BbHBoYVVuaWZpZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3JpZW50YXRpb25BbHBoYVVuaWZpZWQnKTtcbmNvbnN0IG9yaWVudGF0aW9uQmV0YVVuaWZpZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3JpZW50YXRpb25CZXRhVW5pZmllZCcpO1xuY29uc3Qgb3JpZW50YXRpb25HYW1tYVVuaWZpZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3JpZW50YXRpb25HYW1tYVVuaWZpZWQnKTtcblxuLy8gT3JpZW50YXRpb24gKEFsdGVybmF0aXZlKSBET00gZWxlbWVudHNcbmNvbnN0IG9yaWVudGF0aW9uQWx0QWxwaGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3JpZW50YXRpb25BbHRBbHBoYScpO1xuY29uc3Qgb3JpZW50YXRpb25BbHRCZXRhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI29yaWVudGF0aW9uQWx0QmV0YScpO1xuY29uc3Qgb3JpZW50YXRpb25BbHRHYW1tYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcmllbnRhdGlvbkFsdEdhbW1hJyk7XG5cbi8vIEVuZXJneSBET00gZWxlbWVudHNcbmNvbnN0IGVuZXJneSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlbmVyZ3knKTtcblxuZnVuY3Rpb24gcm91bmRWYWx1ZShpbnB1dCkge1xuICBpZiAoaW5wdXQgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIGlmIChpbnB1dCA9PT0gbnVsbClcbiAgICByZXR1cm4gJ251bGwnO1xuXG4gIHJldHVybiBNYXRoLnJvdW5kKGlucHV0ICogMTAwKSAvIDEwMDtcbn1cblxuZnVuY3Rpb24gZGlzcGxheVByb3ZpZGVkU2Vuc29ycyhtb2R1bGVzKSB7XG4gIGNvbnN0IGRldmljZW1vdGlvbiA9IG1vZHVsZXNbMF07XG4gIGNvbnN0IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBtb2R1bGVzWzFdO1xuICBjb25zdCBhY2NlbGVyYXRpb24gPSBtb2R1bGVzWzJdO1xuICBjb25zdCByb3RhdGlvblJhdGUgPSBtb2R1bGVzWzNdO1xuICBjb25zdCBkZXZpY2VvcmllbnRhdGlvbiA9IG1vZHVsZXNbNF07XG4gIGNvbnN0IG9yaWVudGF0aW9uID0gbW9kdWxlc1s1XTtcbiAgY29uc3Qgb3JpZW50YXRpb25BbHQgPSBtb2R1bGVzWzZdO1xuICBjb25zdCBlbmVyZ3kgPSBtb2R1bGVzWzddO1xuXG4gIGlmIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzUHJvdmlkZWQpIHtcbiAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5UHJvdmlkZWQudGV4dENvbnRlbnQgPSAnWWVzJztcbiAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5UHJvdmlkZWQuY2xhc3NMaXN0LmFkZCgnc3VjY2VzcycpO1xuICAgIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlQcm92aWRlZC5jbGFzc0xpc3QucmVtb3ZlKCdkYW5nZXInKTtcbiAgfVxuXG4gIGlmIChhY2NlbGVyYXRpb24uaXNQcm92aWRlZCkge1xuICAgIGFjY2VsZXJhdGlvblByb3ZpZGVkLnRleHRDb250ZW50ID0gJ1llcyc7XG4gICAgYWNjZWxlcmF0aW9uUHJvdmlkZWQuY2xhc3NMaXN0LmFkZCgnc3VjY2VzcycpO1xuICAgIGFjY2VsZXJhdGlvblByb3ZpZGVkLmNsYXNzTGlzdC5yZW1vdmUoJ2RhbmdlcicpO1xuICB9XG5cbiAgaWYgKHJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkKSB7XG4gICAgcm90YXRpb25SYXRlUHJvdmlkZWQudGV4dENvbnRlbnQgPSAnWWVzJztcbiAgICByb3RhdGlvblJhdGVQcm92aWRlZC5jbGFzc0xpc3QuYWRkKCdzdWNjZXNzJyk7XG4gICAgcm90YXRpb25SYXRlUHJvdmlkZWQuY2xhc3NMaXN0LnJlbW92ZSgnZGFuZ2VyJyk7XG4gIH1cblxuICBpZiAob3JpZW50YXRpb24uaXNQcm92aWRlZCkge1xuICAgIG9yaWVudGF0aW9uUHJvdmlkZWQudGV4dENvbnRlbnQgPSAnWWVzJztcbiAgICBvcmllbnRhdGlvblByb3ZpZGVkLmNsYXNzTGlzdC5hZGQoJ3N1Y2Nlc3MnKTtcbiAgICBvcmllbnRhdGlvblByb3ZpZGVkLmNsYXNzTGlzdC5yZW1vdmUoJ2RhbmdlcicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlEZXZpY2VvcmllbnRhdGlvblJhdyhtb2R1bGUpIHtcbiAgaWYgKG1vZHVsZS5pc1ZhbGlkKSB7XG4gICAgbW9kdWxlLmFkZExpc3RlbmVyKCh2YWwpID0+IHtcbiAgICAgIG9yaWVudGF0aW9uQWxwaGFSYXcudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFswXSk7XG4gICAgICBvcmllbnRhdGlvbkJldGFSYXcudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsxXSk7XG4gICAgICBvcmllbnRhdGlvbkdhbW1hUmF3LnRleHRDb250ZW50ID0gcm91bmRWYWx1ZSh2YWxbMl0pO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlEZXZpY2Vtb3Rpb25SYXcobW9kdWxlKSB7XG4gIGlmIChtb2R1bGUuaXNWYWxpZCkge1xuICAgIG1vZHVsZS5hZGRMaXN0ZW5lcigodmFsKSA9PiB7XG4gICAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WFJhdy50ZXh0Q29udGVudCA9IHJvdW5kVmFsdWUodmFsWzBdKTtcbiAgICAgIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlZUmF3LnRleHRDb250ZW50ID0gcm91bmRWYWx1ZSh2YWxbMV0pO1xuICAgICAgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVpSYXcudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsyXSk7XG5cbiAgICAgIGFjY2VsZXJhdGlvblhSYXcudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFszXSk7XG4gICAgICBhY2NlbGVyYXRpb25ZUmF3LnRleHRDb250ZW50ID0gcm91bmRWYWx1ZSh2YWxbNF0pO1xuICAgICAgYWNjZWxlcmF0aW9uWlJhdy50ZXh0Q29udGVudCA9IHJvdW5kVmFsdWUodmFsWzVdKTtcblxuICAgICAgcm90YXRpb25SYXRlQWxwaGFSYXcudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFs2XSk7XG4gICAgICByb3RhdGlvblJhdGVCZXRhUmF3LnRleHRDb250ZW50ID0gcm91bmRWYWx1ZSh2YWxbN10pO1xuICAgICAgcm90YXRpb25SYXRlR2FtbWFSYXcudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFs4XSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGxheUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkobW9kdWxlKSB7XG4gIGlmIChtb2R1bGUuaXNWYWxpZCkge1xuICAgIG1vZHVsZS5hZGRMaXN0ZW5lcigodmFsKSA9PiB7XG4gICAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WFVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFswXSk7XG4gICAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WVVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsxXSk7XG4gICAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WlVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsyXSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGxheUFjY2VsZXJhdGlvbihtb2R1bGUpIHtcbiAgaWYgKG1vZHVsZS5pc1ZhbGlkKSB7XG4gICAgbW9kdWxlLmFkZExpc3RlbmVyKCh2YWwpID0+IHtcbiAgICAgIGFjY2VsZXJhdGlvblhVbmlmaWVkLnRleHRDb250ZW50ID0gcm91bmRWYWx1ZSh2YWxbMF0pO1xuICAgICAgYWNjZWxlcmF0aW9uWVVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsxXSk7XG4gICAgICBhY2NlbGVyYXRpb25aVW5pZmllZC50ZXh0Q29udGVudCA9IHJvdW5kVmFsdWUodmFsWzJdKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkaXNwbGF5Um90YXRpb25SYXRlKG1vZHVsZSkge1xuICBpZiAobW9kdWxlLmlzVmFsaWQpIHtcbiAgICBtb2R1bGUuYWRkTGlzdGVuZXIoKHZhbCkgPT4ge1xuICAgICAgcm90YXRpb25SYXRlQWxwaGFVbmlmaWVkLnRleHRDb250ZW50ID0gcm91bmRWYWx1ZSh2YWxbMF0pO1xuICAgICAgcm90YXRpb25SYXRlQmV0YVVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsxXSk7XG4gICAgICByb3RhdGlvblJhdGVHYW1tYVVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsyXSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGxheU9yaWVudGF0aW9uKG1vZHVsZSkge1xuICBpZiAobW9kdWxlLmlzVmFsaWQpIHtcbiAgICBtb2R1bGUuYWRkTGlzdGVuZXIoKHZhbCkgPT4ge1xuICAgICAgb3JpZW50YXRpb25BbHBoYVVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFswXSk7XG4gICAgICBvcmllbnRhdGlvbkJldGFVbmlmaWVkLnRleHRDb250ZW50ID0gcm91bmRWYWx1ZSh2YWxbMV0pO1xuICAgICAgb3JpZW50YXRpb25HYW1tYVVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsyXSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGxheU9yaWVudGF0aW9uQWx0KG1vZHVsZSkge1xuICBpZiAobW9kdWxlLmlzVmFsaWQpIHtcbiAgICBtb2R1bGUuYWRkTGlzdGVuZXIoKHZhbCkgPT4ge1xuICAgICAgb3JpZW50YXRpb25BbHRBbHBoYS50ZXh0Q29udGVudCA9IHJvdW5kVmFsdWUodmFsWzBdKTtcbiAgICAgIG9yaWVudGF0aW9uQWx0QmV0YS50ZXh0Q29udGVudCA9IHJvdW5kVmFsdWUodmFsWzFdKTtcbiAgICAgIG9yaWVudGF0aW9uQWx0R2FtbWEudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsyXSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGxheUVuZXJneShtb2R1bGUpIHtcbiAgaWYgKG1vZHVsZS5pc1ZhbGlkKSB7XG4gICAgbW9kdWxlLmFkZExpc3RlbmVyKCh2YWwpID0+IHtcbiAgICAgIGVuZXJneS50ZXh0Q29udGVudCA9IHJvdW5kVmFsdWUodmFsKTtcbiAgICB9KTtcbiAgfVxufVxuXG5tb3Rpb25JbnB1dC5pbml0KFtcbiAgJ2RldmljZW1vdGlvbicsXG4gICdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JyxcbiAgJ2FjY2VsZXJhdGlvbicsXG4gICdyb3RhdGlvblJhdGUnLFxuICAnZGV2aWNlb3JpZW50YXRpb24nLFxuICAnb3JpZW50YXRpb24nLFxuICAnb3JpZW50YXRpb25BbHQnLFxuICAnZW5lcmd5J1xuXSkudGhlbihmdW5jdGlvbihtb2R1bGVzKSB7XG4gIGNvbnN0IGRldmljZW1vdGlvbiA9IG1vZHVsZXNbMF07XG4gIGNvbnN0IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBtb2R1bGVzWzFdO1xuICBjb25zdCBhY2NlbGVyYXRpb24gPSBtb2R1bGVzWzJdO1xuICBjb25zdCByb3RhdGlvblJhdGUgPSBtb2R1bGVzWzNdO1xuICBjb25zdCBkZXZpY2VvcmllbnRhdGlvbiA9IG1vZHVsZXNbNF07XG4gIGNvbnN0IG9yaWVudGF0aW9uID0gbW9kdWxlc1s1XTtcbiAgY29uc3Qgb3JpZW50YXRpb25BbHQgPSBtb2R1bGVzWzZdO1xuICBjb25zdCBlbmVyZ3kgPSBtb2R1bGVzWzddO1xuXG4gIGRpc3BsYXlQcm92aWRlZFNlbnNvcnMobW9kdWxlcyk7XG4gIGRpc3BsYXlEZXZpY2Vtb3Rpb25SYXcoZGV2aWNlbW90aW9uKTtcbiAgZGlzcGxheUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSk7XG4gIGRpc3BsYXlBY2NlbGVyYXRpb24oYWNjZWxlcmF0aW9uKTtcbiAgZGlzcGxheVJvdGF0aW9uUmF0ZShyb3RhdGlvblJhdGUpO1xuICBkaXNwbGF5RGV2aWNlb3JpZW50YXRpb25SYXcoZGV2aWNlb3JpZW50YXRpb24pO1xuICBkaXNwbGF5T3JpZW50YXRpb24ob3JpZW50YXRpb24pO1xuICBkaXNwbGF5T3JpZW50YXRpb25BbHQob3JpZW50YXRpb25BbHQpO1xuICBkaXNwbGF5RW5lcmd5KGVuZXJneSk7XG5cbn0pLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG5cbiIsIi8qIVxyXG4gKiBQbGF0Zm9ybS5qcyA8aHR0cHM6Ly9tdGhzLmJlL3BsYXRmb3JtPlxyXG4gKiBDb3B5cmlnaHQgMjAxNC0yMDE2IEJlbmphbWluIFRhbiA8aHR0cHM6Ly9kZW1vbmVhdXguZ2l0aHViLmlvLz5cclxuICogQ29weXJpZ2h0IDIwMTEtMjAxMyBKb2huLURhdmlkIERhbHRvbiA8aHR0cDovL2FsbHlvdWNhbmxlZXQuY29tLz5cclxuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL210aHMuYmUvbWl0PlxyXG4gKi9cclxuOyhmdW5jdGlvbigpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIC8qKiBVc2VkIHRvIGRldGVybWluZSBpZiB2YWx1ZXMgYXJlIG9mIHRoZSBsYW5ndWFnZSB0eXBlIGBPYmplY3RgLiAqL1xyXG4gIHZhciBvYmplY3RUeXBlcyA9IHtcclxuICAgICdmdW5jdGlvbic6IHRydWUsXHJcbiAgICAnb2JqZWN0JzogdHJ1ZVxyXG4gIH07XHJcblxyXG4gIC8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xyXG4gIHZhciByb290ID0gKG9iamVjdFR5cGVzW3R5cGVvZiB3aW5kb3ddICYmIHdpbmRvdykgfHwgdGhpcztcclxuXHJcbiAgLyoqIEJhY2t1cCBwb3NzaWJsZSBnbG9iYWwgb2JqZWN0LiAqL1xyXG4gIHZhciBvbGRSb290ID0gcm9vdDtcclxuXHJcbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cclxuICB2YXIgZnJlZUV4cG9ydHMgPSBvYmplY3RUeXBlc1t0eXBlb2YgZXhwb3J0c10gJiYgZXhwb3J0cztcclxuXHJcbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xyXG4gIHZhciBmcmVlTW9kdWxlID0gb2JqZWN0VHlwZXNbdHlwZW9mIG1vZHVsZV0gJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xyXG5cclxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzIG9yIEJyb3dzZXJpZmllZCBjb2RlIGFuZCB1c2UgaXQgYXMgYHJvb3RgLiAqL1xyXG4gIHZhciBmcmVlR2xvYmFsID0gZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSAmJiB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbDtcclxuICBpZiAoZnJlZUdsb2JhbCAmJiAoZnJlZUdsb2JhbC5nbG9iYWwgPT09IGZyZWVHbG9iYWwgfHwgZnJlZUdsb2JhbC53aW5kb3cgPT09IGZyZWVHbG9iYWwgfHwgZnJlZUdsb2JhbC5zZWxmID09PSBmcmVlR2xvYmFsKSkge1xyXG4gICAgcm9vdCA9IGZyZWVHbG9iYWw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVc2VkIGFzIHRoZSBtYXhpbXVtIGxlbmd0aCBvZiBhbiBhcnJheS1saWtlIG9iamVjdC5cclxuICAgKiBTZWUgdGhlIFtFUzYgc3BlY10oaHR0cDovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpXHJcbiAgICogZm9yIG1vcmUgZGV0YWlscy5cclxuICAgKi9cclxuICB2YXIgbWF4U2FmZUludGVnZXIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xyXG5cclxuICAvKiogUmVndWxhciBleHByZXNzaW9uIHRvIGRldGVjdCBPcGVyYS4gKi9cclxuICB2YXIgcmVPcGVyYSA9IC9cXGJPcGVyYS87XHJcblxyXG4gIC8qKiBQb3NzaWJsZSBnbG9iYWwgb2JqZWN0LiAqL1xyXG4gIHZhciB0aGlzQmluZGluZyA9IHRoaXM7XHJcblxyXG4gIC8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXHJcbiAgdmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcclxuXHJcbiAgLyoqIFVzZWQgdG8gY2hlY2sgZm9yIG93biBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdC4gKi9cclxuICB2YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcclxuXHJcbiAgLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgaW50ZXJuYWwgYFtbQ2xhc3NdXWAgb2YgdmFsdWVzLiAqL1xyXG4gIHZhciB0b1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xyXG5cclxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FwaXRhbGl6ZXMgYSBzdHJpbmcgdmFsdWUuXHJcbiAgICpcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjYXBpdGFsaXplLlxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjYXBpdGFsaXplZCBzdHJpbmcuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHJpbmcpIHtcclxuICAgIHN0cmluZyA9IFN0cmluZyhzdHJpbmcpO1xyXG4gICAgcmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEEgdXRpbGl0eSBmdW5jdGlvbiB0byBjbGVhbiB1cCB0aGUgT1MgbmFtZS5cclxuICAgKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9zIFRoZSBPUyBuYW1lIHRvIGNsZWFuIHVwLlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbcGF0dGVybl0gQSBgUmVnRXhwYCBwYXR0ZXJuIG1hdGNoaW5nIHRoZSBPUyBuYW1lLlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbbGFiZWxdIEEgbGFiZWwgZm9yIHRoZSBPUy5cclxuICAgKi9cclxuICBmdW5jdGlvbiBjbGVhbnVwT1Mob3MsIHBhdHRlcm4sIGxhYmVsKSB7XHJcbiAgICAvLyBQbGF0Zm9ybSB0b2tlbnMgYXJlIGRlZmluZWQgYXQ6XHJcbiAgICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvbXM1Mzc1MDMoVlMuODUpLmFzcHhcclxuICAgIC8vIGh0dHA6Ly93ZWIuYXJjaGl2ZS5vcmcvd2ViLzIwMDgxMTIyMDUzOTUwL2h0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9tczUzNzUwMyhWUy44NSkuYXNweFxyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICcxMC4wJzogJzEwJyxcclxuICAgICAgJzYuNCc6ICAnMTAgVGVjaG5pY2FsIFByZXZpZXcnLFxyXG4gICAgICAnNi4zJzogICc4LjEnLFxyXG4gICAgICAnNi4yJzogICc4JyxcclxuICAgICAgJzYuMSc6ICAnU2VydmVyIDIwMDggUjIgLyA3JyxcclxuICAgICAgJzYuMCc6ICAnU2VydmVyIDIwMDggLyBWaXN0YScsXHJcbiAgICAgICc1LjInOiAgJ1NlcnZlciAyMDAzIC8gWFAgNjQtYml0JyxcclxuICAgICAgJzUuMSc6ICAnWFAnLFxyXG4gICAgICAnNS4wMSc6ICcyMDAwIFNQMScsXHJcbiAgICAgICc1LjAnOiAgJzIwMDAnLFxyXG4gICAgICAnNC4wJzogICdOVCcsXHJcbiAgICAgICc0LjkwJzogJ01FJ1xyXG4gICAgfTtcclxuICAgIC8vIERldGVjdCBXaW5kb3dzIHZlcnNpb24gZnJvbSBwbGF0Zm9ybSB0b2tlbnMuXHJcbiAgICBpZiAocGF0dGVybiAmJiBsYWJlbCAmJiAvXldpbi9pLnRlc3Qob3MpICYmICEvXldpbmRvd3MgUGhvbmUgL2kudGVzdChvcykgJiZcclxuICAgICAgICAoZGF0YSA9IGRhdGFbL1tcXGQuXSskLy5leGVjKG9zKV0pKSB7XHJcbiAgICAgIG9zID0gJ1dpbmRvd3MgJyArIGRhdGE7XHJcbiAgICB9XHJcbiAgICAvLyBDb3JyZWN0IGNoYXJhY3RlciBjYXNlIGFuZCBjbGVhbnVwIHN0cmluZy5cclxuICAgIG9zID0gU3RyaW5nKG9zKTtcclxuXHJcbiAgICBpZiAocGF0dGVybiAmJiBsYWJlbCkge1xyXG4gICAgICBvcyA9IG9zLnJlcGxhY2UoUmVnRXhwKHBhdHRlcm4sICdpJyksIGxhYmVsKTtcclxuICAgIH1cclxuXHJcbiAgICBvcyA9IGZvcm1hdChcclxuICAgICAgb3MucmVwbGFjZSgvIGNlJC9pLCAnIENFJylcclxuICAgICAgICAucmVwbGFjZSgvXFxiaHB3L2ksICd3ZWInKVxyXG4gICAgICAgIC5yZXBsYWNlKC9cXGJNYWNpbnRvc2hcXGIvLCAnTWFjIE9TJylcclxuICAgICAgICAucmVwbGFjZSgvX1Bvd2VyUENcXGIvaSwgJyBPUycpXHJcbiAgICAgICAgLnJlcGxhY2UoL1xcYihPUyBYKSBbXiBcXGRdKy9pLCAnJDEnKVxyXG4gICAgICAgIC5yZXBsYWNlKC9cXGJNYWMgKE9TIFgpXFxiLywgJyQxJylcclxuICAgICAgICAucmVwbGFjZSgvXFwvKFxcZCkvLCAnICQxJylcclxuICAgICAgICAucmVwbGFjZSgvXy9nLCAnLicpXHJcbiAgICAgICAgLnJlcGxhY2UoLyg/OiBCZVBDfFsgLl0qZmNbIFxcZC5dKykkL2ksICcnKVxyXG4gICAgICAgIC5yZXBsYWNlKC9cXGJ4ODZcXC42NFxcYi9naSwgJ3g4Nl82NCcpXHJcbiAgICAgICAgLnJlcGxhY2UoL1xcYihXaW5kb3dzIFBob25lKSBPU1xcYi8sICckMScpXHJcbiAgICAgICAgLnJlcGxhY2UoL1xcYihDaHJvbWUgT1MgXFx3KykgW1xcZC5dK1xcYi8sICckMScpXHJcbiAgICAgICAgLnNwbGl0KCcgb24gJylbMF1cclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIG9zO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQW4gaXRlcmF0aW9uIHV0aWxpdHkgZm9yIGFycmF5cyBhbmQgb2JqZWN0cy5cclxuICAgKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZWFjaChvYmplY3QsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgaW5kZXggPSAtMSxcclxuICAgICAgICBsZW5ndGggPSBvYmplY3QgPyBvYmplY3QubGVuZ3RoIDogMDtcclxuXHJcbiAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiBsZW5ndGggPiAtMSAmJiBsZW5ndGggPD0gbWF4U2FmZUludGVnZXIpIHtcclxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcclxuICAgICAgICBjYWxsYmFjayhvYmplY3RbaW5kZXhdLCBpbmRleCwgb2JqZWN0KTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yT3duKG9iamVjdCwgY2FsbGJhY2spO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVHJpbSBhbmQgY29uZGl0aW9uYWxseSBjYXBpdGFsaXplIHN0cmluZyB2YWx1ZXMuXHJcbiAgICpcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBmb3JtYXQuXHJcbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCBzdHJpbmcuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZm9ybWF0KHN0cmluZykge1xyXG4gICAgc3RyaW5nID0gdHJpbShzdHJpbmcpO1xyXG4gICAgcmV0dXJuIC9eKD86d2ViT1N8aSg/Ok9TfFApKS8udGVzdChzdHJpbmcpXHJcbiAgICAgID8gc3RyaW5nXHJcbiAgICAgIDogY2FwaXRhbGl6ZShzdHJpbmcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSXRlcmF0ZXMgb3ZlciBhbiBvYmplY3QncyBvd24gcHJvcGVydGllcywgZXhlY3V0aW5nIHRoZSBgY2FsbGJhY2tgIGZvciBlYWNoLlxyXG4gICAqXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiBleGVjdXRlZCBwZXIgb3duIHByb3BlcnR5LlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGZvck93bihvYmplY3QsIGNhbGxiYWNrKSB7XHJcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XHJcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xyXG4gICAgICAgIGNhbGxiYWNrKG9iamVjdFtrZXldLCBrZXksIG9iamVjdCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGludGVybmFsIGBbW0NsYXNzXV1gIG9mIGEgdmFsdWUuXHJcbiAgICpcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlLlxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBgW1tDbGFzc11dYC5cclxuICAgKi9cclxuICBmdW5jdGlvbiBnZXRDbGFzc09mKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbFxyXG4gICAgICA/IGNhcGl0YWxpemUodmFsdWUpXHJcbiAgICAgIDogdG9TdHJpbmcuY2FsbCh2YWx1ZSkuc2xpY2UoOCwgLTEpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSG9zdCBvYmplY3RzIGNhbiByZXR1cm4gdHlwZSB2YWx1ZXMgdGhhdCBhcmUgZGlmZmVyZW50IGZyb20gdGhlaXIgYWN0dWFsXHJcbiAgICogZGF0YSB0eXBlLiBUaGUgb2JqZWN0cyB3ZSBhcmUgY29uY2VybmVkIHdpdGggdXN1YWxseSByZXR1cm4gbm9uLXByaW1pdGl2ZVxyXG4gICAqIHR5cGVzIG9mIFwib2JqZWN0XCIsIFwiZnVuY3Rpb25cIiwgb3IgXCJ1bmtub3duXCIuXHJcbiAgICpcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBvd25lciBvZiB0aGUgcHJvcGVydHkuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IFRoZSBwcm9wZXJ0eSB0byBjaGVjay5cclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHByb3BlcnR5IHZhbHVlIGlzIGEgbm9uLXByaW1pdGl2ZSwgZWxzZSBgZmFsc2VgLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGlzSG9zdFR5cGUob2JqZWN0LCBwcm9wZXJ0eSkge1xyXG4gICAgdmFyIHR5cGUgPSBvYmplY3QgIT0gbnVsbCA/IHR5cGVvZiBvYmplY3RbcHJvcGVydHldIDogJ251bWJlcic7XHJcbiAgICByZXR1cm4gIS9eKD86Ym9vbGVhbnxudW1iZXJ8c3RyaW5nfHVuZGVmaW5lZCkkLy50ZXN0KHR5cGUpICYmXHJcbiAgICAgICh0eXBlID09ICdvYmplY3QnID8gISFvYmplY3RbcHJvcGVydHldIDogdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQcmVwYXJlcyBhIHN0cmluZyBmb3IgdXNlIGluIGEgYFJlZ0V4cGAgYnkgbWFraW5nIGh5cGhlbnMgYW5kIHNwYWNlcyBvcHRpb25hbC5cclxuICAgKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIHF1YWxpZnkuXHJcbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIHF1YWxpZmllZCBzdHJpbmcuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcXVhbGlmeShzdHJpbmcpIHtcclxuICAgIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKC8oWyAtXSkoPyEkKS9nLCAnJDE/Jyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBIGJhcmUtYm9uZXMgYEFycmF5I3JlZHVjZWAgbGlrZSB1dGlsaXR5IGZ1bmN0aW9uLlxyXG4gICAqXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cclxuICAgKiBAcmV0dXJucyB7Kn0gVGhlIGFjY3VtdWxhdGVkIHJlc3VsdC5cclxuICAgKi9cclxuICBmdW5jdGlvbiByZWR1Y2UoYXJyYXksIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgYWNjdW11bGF0b3IgPSBudWxsO1xyXG4gICAgZWFjaChhcnJheSwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgYXJyYXkpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UgZnJvbSBhIHN0cmluZy5cclxuICAgKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIHRyaW0uXHJcbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIHRyaW1tZWQgc3RyaW5nLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHRyaW0oc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZSgvXiArfCArJC9nLCAnJyk7XHJcbiAgfVxyXG5cclxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBwbGF0Zm9ybSBvYmplY3QuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cclxuICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IFt1YT1uYXZpZ2F0b3IudXNlckFnZW50XSBUaGUgdXNlciBhZ2VudCBzdHJpbmcgb3JcclxuICAgKiAgY29udGV4dCBvYmplY3QuXHJcbiAgICogQHJldHVybnMge09iamVjdH0gQSBwbGF0Zm9ybSBvYmplY3QuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcGFyc2UodWEpIHtcclxuXHJcbiAgICAvKiogVGhlIGVudmlyb25tZW50IGNvbnRleHQgb2JqZWN0LiAqL1xyXG4gICAgdmFyIGNvbnRleHQgPSByb290O1xyXG5cclxuICAgIC8qKiBVc2VkIHRvIGZsYWcgd2hlbiBhIGN1c3RvbSBjb250ZXh0IGlzIHByb3ZpZGVkLiAqL1xyXG4gICAgdmFyIGlzQ3VzdG9tQ29udGV4dCA9IHVhICYmIHR5cGVvZiB1YSA9PSAnb2JqZWN0JyAmJiBnZXRDbGFzc09mKHVhKSAhPSAnU3RyaW5nJztcclxuXHJcbiAgICAvLyBKdWdnbGUgYXJndW1lbnRzLlxyXG4gICAgaWYgKGlzQ3VzdG9tQ29udGV4dCkge1xyXG4gICAgICBjb250ZXh0ID0gdWE7XHJcbiAgICAgIHVhID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQnJvd3NlciBuYXZpZ2F0b3Igb2JqZWN0LiAqL1xyXG4gICAgdmFyIG5hdiA9IGNvbnRleHQubmF2aWdhdG9yIHx8IHt9O1xyXG5cclxuICAgIC8qKiBCcm93c2VyIHVzZXIgYWdlbnQgc3RyaW5nLiAqL1xyXG4gICAgdmFyIHVzZXJBZ2VudCA9IG5hdi51c2VyQWdlbnQgfHwgJyc7XHJcblxyXG4gICAgdWEgfHwgKHVhID0gdXNlckFnZW50KTtcclxuXHJcbiAgICAvKiogVXNlZCB0byBmbGFnIHdoZW4gYHRoaXNCaW5kaW5nYCBpcyB0aGUgW01vZHVsZVNjb3BlXS4gKi9cclxuICAgIHZhciBpc01vZHVsZVNjb3BlID0gaXNDdXN0b21Db250ZXh0IHx8IHRoaXNCaW5kaW5nID09IG9sZFJvb3Q7XHJcblxyXG4gICAgLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGJyb3dzZXIgaXMgbGlrZSBDaHJvbWUuICovXHJcbiAgICB2YXIgbGlrZUNocm9tZSA9IGlzQ3VzdG9tQ29udGV4dFxyXG4gICAgICA/ICEhbmF2Lmxpa2VDaHJvbWVcclxuICAgICAgOiAvXFxiQ2hyb21lXFxiLy50ZXN0KHVhKSAmJiAhL2ludGVybmFsfFxcbi9pLnRlc3QodG9TdHJpbmcudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgLyoqIEludGVybmFsIGBbW0NsYXNzXV1gIHZhbHVlIHNob3J0Y3V0cy4gKi9cclxuICAgIHZhciBvYmplY3RDbGFzcyA9ICdPYmplY3QnLFxyXG4gICAgICAgIGFpclJ1bnRpbWVDbGFzcyA9IGlzQ3VzdG9tQ29udGV4dCA/IG9iamVjdENsYXNzIDogJ1NjcmlwdEJyaWRnaW5nUHJveHlPYmplY3QnLFxyXG4gICAgICAgIGVudmlyb0NsYXNzID0gaXNDdXN0b21Db250ZXh0ID8gb2JqZWN0Q2xhc3MgOiAnRW52aXJvbm1lbnQnLFxyXG4gICAgICAgIGphdmFDbGFzcyA9IChpc0N1c3RvbUNvbnRleHQgJiYgY29udGV4dC5qYXZhKSA/ICdKYXZhUGFja2FnZScgOiBnZXRDbGFzc09mKGNvbnRleHQuamF2YSksXHJcbiAgICAgICAgcGhhbnRvbUNsYXNzID0gaXNDdXN0b21Db250ZXh0ID8gb2JqZWN0Q2xhc3MgOiAnUnVudGltZU9iamVjdCc7XHJcblxyXG4gICAgLyoqIERldGVjdCBKYXZhIGVudmlyb25tZW50cy4gKi9cclxuICAgIHZhciBqYXZhID0gL1xcYkphdmEvLnRlc3QoamF2YUNsYXNzKSAmJiBjb250ZXh0LmphdmE7XHJcblxyXG4gICAgLyoqIERldGVjdCBSaGluby4gKi9cclxuICAgIHZhciByaGlubyA9IGphdmEgJiYgZ2V0Q2xhc3NPZihjb250ZXh0LmVudmlyb25tZW50KSA9PSBlbnZpcm9DbGFzcztcclxuXHJcbiAgICAvKiogQSBjaGFyYWN0ZXIgdG8gcmVwcmVzZW50IGFscGhhLiAqL1xyXG4gICAgdmFyIGFscGhhID0gamF2YSA/ICdhJyA6ICdcXHUwM2IxJztcclxuXHJcbiAgICAvKiogQSBjaGFyYWN0ZXIgdG8gcmVwcmVzZW50IGJldGEuICovXHJcbiAgICB2YXIgYmV0YSA9IGphdmEgPyAnYicgOiAnXFx1MDNiMic7XHJcblxyXG4gICAgLyoqIEJyb3dzZXIgZG9jdW1lbnQgb2JqZWN0LiAqL1xyXG4gICAgdmFyIGRvYyA9IGNvbnRleHQuZG9jdW1lbnQgfHwge307XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZXRlY3QgT3BlcmEgYnJvd3NlciAoUHJlc3RvLWJhc2VkKS5cclxuICAgICAqIGh0dHA6Ly93d3cuaG93dG9jcmVhdGUuY28udWsvb3BlcmFTdHVmZi9vcGVyYU9iamVjdC5odG1sXHJcbiAgICAgKiBodHRwOi8vZGV2Lm9wZXJhLmNvbS9hcnRpY2xlcy92aWV3L29wZXJhLW1pbmktd2ViLWNvbnRlbnQtYXV0aG9yaW5nLWd1aWRlbGluZXMvI29wZXJhbWluaVxyXG4gICAgICovXHJcbiAgICB2YXIgb3BlcmEgPSBjb250ZXh0Lm9wZXJhbWluaSB8fCBjb250ZXh0Lm9wZXJhO1xyXG5cclxuICAgIC8qKiBPcGVyYSBgW1tDbGFzc11dYC4gKi9cclxuICAgIHZhciBvcGVyYUNsYXNzID0gcmVPcGVyYS50ZXN0KG9wZXJhQ2xhc3MgPSAoaXNDdXN0b21Db250ZXh0ICYmIG9wZXJhKSA/IG9wZXJhWydbW0NsYXNzXV0nXSA6IGdldENsYXNzT2Yob3BlcmEpKVxyXG4gICAgICA/IG9wZXJhQ2xhc3NcclxuICAgICAgOiAob3BlcmEgPSBudWxsKTtcclxuXHJcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG4gICAgLyoqIFRlbXBvcmFyeSB2YXJpYWJsZSB1c2VkIG92ZXIgdGhlIHNjcmlwdCdzIGxpZmV0aW1lLiAqL1xyXG4gICAgdmFyIGRhdGE7XHJcblxyXG4gICAgLyoqIFRoZSBDUFUgYXJjaGl0ZWN0dXJlLiAqL1xyXG4gICAgdmFyIGFyY2ggPSB1YTtcclxuXHJcbiAgICAvKiogUGxhdGZvcm0gZGVzY3JpcHRpb24gYXJyYXkuICovXHJcbiAgICB2YXIgZGVzY3JpcHRpb24gPSBbXTtcclxuXHJcbiAgICAvKiogUGxhdGZvcm0gYWxwaGEvYmV0YSBpbmRpY2F0b3IuICovXHJcbiAgICB2YXIgcHJlcmVsZWFzZSA9IG51bGw7XHJcblxyXG4gICAgLyoqIEEgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IGVudmlyb25tZW50IGZlYXR1cmVzIHNob3VsZCBiZSB1c2VkIHRvIHJlc29sdmUgdGhlIHBsYXRmb3JtLiAqL1xyXG4gICAgdmFyIHVzZUZlYXR1cmVzID0gdWEgPT0gdXNlckFnZW50O1xyXG5cclxuICAgIC8qKiBUaGUgYnJvd3Nlci9lbnZpcm9ubWVudCB2ZXJzaW9uLiAqL1xyXG4gICAgdmFyIHZlcnNpb24gPSB1c2VGZWF0dXJlcyAmJiBvcGVyYSAmJiB0eXBlb2Ygb3BlcmEudmVyc2lvbiA9PSAnZnVuY3Rpb24nICYmIG9wZXJhLnZlcnNpb24oKTtcclxuXHJcbiAgICAvKiogQSBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBPUyBlbmRzIHdpdGggXCIvIFZlcnNpb25cIiAqL1xyXG4gICAgdmFyIGlzU3BlY2lhbENhc2VkT1M7XHJcblxyXG4gICAgLyogRGV0ZWN0YWJsZSBsYXlvdXQgZW5naW5lcyAob3JkZXIgaXMgaW1wb3J0YW50KS4gKi9cclxuICAgIHZhciBsYXlvdXQgPSBnZXRMYXlvdXQoW1xyXG4gICAgICB7ICdsYWJlbCc6ICdFZGdlSFRNTCcsICdwYXR0ZXJuJzogJ0VkZ2UnIH0sXHJcbiAgICAgICdUcmlkZW50JyxcclxuICAgICAgeyAnbGFiZWwnOiAnV2ViS2l0JywgJ3BhdHRlcm4nOiAnQXBwbGVXZWJLaXQnIH0sXHJcbiAgICAgICdpQ2FiJyxcclxuICAgICAgJ1ByZXN0bycsXHJcbiAgICAgICdOZXRGcm9udCcsXHJcbiAgICAgICdUYXNtYW4nLFxyXG4gICAgICAnS0hUTUwnLFxyXG4gICAgICAnR2Vja28nXHJcbiAgICBdKTtcclxuXHJcbiAgICAvKiBEZXRlY3RhYmxlIGJyb3dzZXIgbmFtZXMgKG9yZGVyIGlzIGltcG9ydGFudCkuICovXHJcbiAgICB2YXIgbmFtZSA9IGdldE5hbWUoW1xyXG4gICAgICAnQWRvYmUgQUlSJyxcclxuICAgICAgJ0Fyb3JhJyxcclxuICAgICAgJ0F2YW50IEJyb3dzZXInLFxyXG4gICAgICAnQnJlYWNoJyxcclxuICAgICAgJ0NhbWlubycsXHJcbiAgICAgICdFcGlwaGFueScsXHJcbiAgICAgICdGZW5uZWMnLFxyXG4gICAgICAnRmxvY2snLFxyXG4gICAgICAnR2FsZW9uJyxcclxuICAgICAgJ0dyZWVuQnJvd3NlcicsXHJcbiAgICAgICdpQ2FiJyxcclxuICAgICAgJ0ljZXdlYXNlbCcsXHJcbiAgICAgICdLLU1lbGVvbicsXHJcbiAgICAgICdLb25xdWVyb3InLFxyXG4gICAgICAnTHVuYXNjYXBlJyxcclxuICAgICAgJ01heHRob24nLFxyXG4gICAgICB7ICdsYWJlbCc6ICdNaWNyb3NvZnQgRWRnZScsICdwYXR0ZXJuJzogJ0VkZ2UnIH0sXHJcbiAgICAgICdNaWRvcmknLFxyXG4gICAgICAnTm9vayBCcm93c2VyJyxcclxuICAgICAgJ1BhbGVNb29uJyxcclxuICAgICAgJ1BoYW50b21KUycsXHJcbiAgICAgICdSYXZlbicsXHJcbiAgICAgICdSZWtvbnEnLFxyXG4gICAgICAnUm9ja01lbHQnLFxyXG4gICAgICAnU2VhTW9ua2V5JyxcclxuICAgICAgeyAnbGFiZWwnOiAnU2lsaycsICdwYXR0ZXJuJzogJyg/OkNsb3VkOXxTaWxrLUFjY2VsZXJhdGVkKScgfSxcclxuICAgICAgJ1NsZWlwbmlyJyxcclxuICAgICAgJ1NsaW1Ccm93c2VyJyxcclxuICAgICAgeyAnbGFiZWwnOiAnU1JXYXJlIElyb24nLCAncGF0dGVybic6ICdJcm9uJyB9LFxyXG4gICAgICAnU3VucmlzZScsXHJcbiAgICAgICdTd2lmdGZveCcsXHJcbiAgICAgICdXZWJQb3NpdGl2ZScsXHJcbiAgICAgICdPcGVyYSBNaW5pJyxcclxuICAgICAgeyAnbGFiZWwnOiAnT3BlcmEgTWluaScsICdwYXR0ZXJuJzogJ09QaU9TJyB9LFxyXG4gICAgICAnT3BlcmEnLFxyXG4gICAgICB7ICdsYWJlbCc6ICdPcGVyYScsICdwYXR0ZXJuJzogJ09QUicgfSxcclxuICAgICAgJ0Nocm9tZScsXHJcbiAgICAgIHsgJ2xhYmVsJzogJ0Nocm9tZSBNb2JpbGUnLCAncGF0dGVybic6ICcoPzpDcmlPU3xDck1vKScgfSxcclxuICAgICAgeyAnbGFiZWwnOiAnRmlyZWZveCcsICdwYXR0ZXJuJzogJyg/OkZpcmVmb3h8TWluZWZpZWxkKScgfSxcclxuICAgICAgeyAnbGFiZWwnOiAnRmlyZWZveCBmb3IgaU9TJywgJ3BhdHRlcm4nOiAnRnhpT1MnIH0sXHJcbiAgICAgIHsgJ2xhYmVsJzogJ0lFJywgJ3BhdHRlcm4nOiAnSUVNb2JpbGUnIH0sXHJcbiAgICAgIHsgJ2xhYmVsJzogJ0lFJywgJ3BhdHRlcm4nOiAnTVNJRScgfSxcclxuICAgICAgJ1NhZmFyaSdcclxuICAgIF0pO1xyXG5cclxuICAgIC8qIERldGVjdGFibGUgcHJvZHVjdHMgKG9yZGVyIGlzIGltcG9ydGFudCkuICovXHJcbiAgICB2YXIgcHJvZHVjdCA9IGdldFByb2R1Y3QoW1xyXG4gICAgICB7ICdsYWJlbCc6ICdCbGFja0JlcnJ5JywgJ3BhdHRlcm4nOiAnQkIxMCcgfSxcclxuICAgICAgJ0JsYWNrQmVycnknLFxyXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUycsICdwYXR0ZXJuJzogJ0dULUk5MDAwJyB9LFxyXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzInLCAncGF0dGVybic6ICdHVC1JOTEwMCcgfSxcclxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFMzJywgJ3BhdHRlcm4nOiAnR1QtSTkzMDAnIH0sXHJcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTNCcsICdwYXR0ZXJuJzogJ0dULUk5NTAwJyB9LFxyXG4gICAgICAnR29vZ2xlIFRWJyxcclxuICAgICAgJ0x1bWlhJyxcclxuICAgICAgJ2lQYWQnLFxyXG4gICAgICAnaVBvZCcsXHJcbiAgICAgICdpUGhvbmUnLFxyXG4gICAgICAnS2luZGxlJyxcclxuICAgICAgeyAnbGFiZWwnOiAnS2luZGxlIEZpcmUnLCAncGF0dGVybic6ICcoPzpDbG91ZDl8U2lsay1BY2NlbGVyYXRlZCknIH0sXHJcbiAgICAgICdOZXh1cycsXHJcbiAgICAgICdOb29rJyxcclxuICAgICAgJ1BsYXlCb29rJyxcclxuICAgICAgJ1BsYXlTdGF0aW9uIDMnLFxyXG4gICAgICAnUGxheVN0YXRpb24gNCcsXHJcbiAgICAgICdQbGF5U3RhdGlvbiBWaXRhJyxcclxuICAgICAgJ1RvdWNoUGFkJyxcclxuICAgICAgJ1RyYW5zZm9ybWVyJyxcclxuICAgICAgeyAnbGFiZWwnOiAnV2lpIFUnLCAncGF0dGVybic6ICdXaWlVJyB9LFxyXG4gICAgICAnV2lpJyxcclxuICAgICAgJ1hib3ggT25lJyxcclxuICAgICAgeyAnbGFiZWwnOiAnWGJveCAzNjAnLCAncGF0dGVybic6ICdYYm94JyB9LFxyXG4gICAgICAnWG9vbSdcclxuICAgIF0pO1xyXG5cclxuICAgIC8qIERldGVjdGFibGUgbWFudWZhY3R1cmVycy4gKi9cclxuICAgIHZhciBtYW51ZmFjdHVyZXIgPSBnZXRNYW51ZmFjdHVyZXIoe1xyXG4gICAgICAnQXBwbGUnOiB7ICdpUGFkJzogMSwgJ2lQaG9uZSc6IDEsICdpUG9kJzogMSB9LFxyXG4gICAgICAnQXJjaG9zJzoge30sXHJcbiAgICAgICdBbWF6b24nOiB7ICdLaW5kbGUnOiAxLCAnS2luZGxlIEZpcmUnOiAxIH0sXHJcbiAgICAgICdBc3VzJzogeyAnVHJhbnNmb3JtZXInOiAxIH0sXHJcbiAgICAgICdCYXJuZXMgJiBOb2JsZSc6IHsgJ05vb2snOiAxIH0sXHJcbiAgICAgICdCbGFja0JlcnJ5JzogeyAnUGxheUJvb2snOiAxIH0sXHJcbiAgICAgICdHb29nbGUnOiB7ICdHb29nbGUgVFYnOiAxLCAnTmV4dXMnOiAxIH0sXHJcbiAgICAgICdIUCc6IHsgJ1RvdWNoUGFkJzogMSB9LFxyXG4gICAgICAnSFRDJzoge30sXHJcbiAgICAgICdMRyc6IHt9LFxyXG4gICAgICAnTWljcm9zb2Z0JzogeyAnWGJveCc6IDEsICdYYm94IE9uZSc6IDEgfSxcclxuICAgICAgJ01vdG9yb2xhJzogeyAnWG9vbSc6IDEgfSxcclxuICAgICAgJ05pbnRlbmRvJzogeyAnV2lpIFUnOiAxLCAgJ1dpaSc6IDEgfSxcclxuICAgICAgJ05va2lhJzogeyAnTHVtaWEnOiAxIH0sXHJcbiAgICAgICdTYW1zdW5nJzogeyAnR2FsYXh5IFMnOiAxLCAnR2FsYXh5IFMyJzogMSwgJ0dhbGF4eSBTMyc6IDEsICdHYWxheHkgUzQnOiAxIH0sXHJcbiAgICAgICdTb255JzogeyAnUGxheVN0YXRpb24gNCc6IDEsICdQbGF5U3RhdGlvbiAzJzogMSwgJ1BsYXlTdGF0aW9uIFZpdGEnOiAxIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8qIERldGVjdGFibGUgb3BlcmF0aW5nIHN5c3RlbXMgKG9yZGVyIGlzIGltcG9ydGFudCkuICovXHJcbiAgICB2YXIgb3MgPSBnZXRPUyhbXHJcbiAgICAgICdXaW5kb3dzIFBob25lJyxcclxuICAgICAgJ0FuZHJvaWQnLFxyXG4gICAgICAnQ2VudE9TJyxcclxuICAgICAgeyAnbGFiZWwnOiAnQ2hyb21lIE9TJywgJ3BhdHRlcm4nOiAnQ3JPUycgfSxcclxuICAgICAgJ0RlYmlhbicsXHJcbiAgICAgICdGZWRvcmEnLFxyXG4gICAgICAnRnJlZUJTRCcsXHJcbiAgICAgICdHZW50b28nLFxyXG4gICAgICAnSGFpa3UnLFxyXG4gICAgICAnS3VidW50dScsXHJcbiAgICAgICdMaW51eCBNaW50JyxcclxuICAgICAgJ09wZW5CU0QnLFxyXG4gICAgICAnUmVkIEhhdCcsXHJcbiAgICAgICdTdVNFJyxcclxuICAgICAgJ1VidW50dScsXHJcbiAgICAgICdYdWJ1bnR1JyxcclxuICAgICAgJ0N5Z3dpbicsXHJcbiAgICAgICdTeW1iaWFuIE9TJyxcclxuICAgICAgJ2hwd09TJyxcclxuICAgICAgJ3dlYk9TICcsXHJcbiAgICAgICd3ZWJPUycsXHJcbiAgICAgICdUYWJsZXQgT1MnLFxyXG4gICAgICAnTGludXgnLFxyXG4gICAgICAnTWFjIE9TIFgnLFxyXG4gICAgICAnTWFjaW50b3NoJyxcclxuICAgICAgJ01hYycsXHJcbiAgICAgICdXaW5kb3dzIDk4OycsXHJcbiAgICAgICdXaW5kb3dzICdcclxuICAgIF0pO1xyXG5cclxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBpY2tzIHRoZSBsYXlvdXQgZW5naW5lIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBhcnJheSBvZiBndWVzc2VzLlxyXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgbGF5b3V0IGVuZ2luZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0TGF5b3V0KGd1ZXNzZXMpIHtcclxuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCBSZWdFeHAoJ1xcXFxiJyArIChcclxuICAgICAgICAgIGd1ZXNzLnBhdHRlcm4gfHwgcXVhbGlmeShndWVzcylcclxuICAgICAgICApICsgJ1xcXFxiJywgJ2knKS5leGVjKHVhKSAmJiAoZ3Vlc3MubGFiZWwgfHwgZ3Vlc3MpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBpY2tzIHRoZSBtYW51ZmFjdHVyZXIgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxyXG4gICAgICpcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIG9iamVjdCBvZiBndWVzc2VzLlxyXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgbWFudWZhY3R1cmVyLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXRNYW51ZmFjdHVyZXIoZ3Vlc3Nlcykge1xyXG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xyXG4gICAgICAgIC8vIExvb2t1cCB0aGUgbWFudWZhY3R1cmVyIGJ5IHByb2R1Y3Qgb3Igc2NhbiB0aGUgVUEgZm9yIHRoZSBtYW51ZmFjdHVyZXIuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCAoXHJcbiAgICAgICAgICB2YWx1ZVtwcm9kdWN0XSB8fFxyXG4gICAgICAgICAgdmFsdWVbL15bYS16XSsoPzogK1thLXpdK1xcYikqL2kuZXhlYyhwcm9kdWN0KV0gfHxcclxuICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcXVhbGlmeShrZXkpICsgJyg/OlxcXFxifFxcXFx3KlxcXFxkKScsICdpJykuZXhlYyh1YSlcclxuICAgICAgICApICYmIGtleTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQaWNrcyB0aGUgYnJvd3NlciBuYW1lIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBhcnJheSBvZiBndWVzc2VzLlxyXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgYnJvd3NlciBuYW1lLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXROYW1lKGd1ZXNzZXMpIHtcclxuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCBSZWdFeHAoJ1xcXFxiJyArIChcclxuICAgICAgICAgIGd1ZXNzLnBhdHRlcm4gfHwgcXVhbGlmeShndWVzcylcclxuICAgICAgICApICsgJ1xcXFxiJywgJ2knKS5leGVjKHVhKSAmJiAoZ3Vlc3MubGFiZWwgfHwgZ3Vlc3MpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBpY2tzIHRoZSBPUyBuYW1lIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBhcnJheSBvZiBndWVzc2VzLlxyXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgT1MgbmFtZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0T1MoZ3Vlc3Nlcykge1xyXG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgZ3Vlc3MpIHtcclxuICAgICAgICB2YXIgcGF0dGVybiA9IGd1ZXNzLnBhdHRlcm4gfHwgcXVhbGlmeShndWVzcyk7XHJcbiAgICAgICAgaWYgKCFyZXN1bHQgJiYgKHJlc3VsdCA9XHJcbiAgICAgICAgICAgICAgUmVnRXhwKCdcXFxcYicgKyBwYXR0ZXJuICsgJyg/Oi9bXFxcXGQuXSt8WyBcXFxcdy5dKiknLCAnaScpLmV4ZWModWEpXHJcbiAgICAgICAgICAgICkpIHtcclxuICAgICAgICAgIHJlc3VsdCA9IGNsZWFudXBPUyhyZXN1bHQsIHBhdHRlcm4sIGd1ZXNzLmxhYmVsIHx8IGd1ZXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQaWNrcyB0aGUgcHJvZHVjdCBuYW1lIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBhcnJheSBvZiBndWVzc2VzLlxyXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgcHJvZHVjdCBuYW1lLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXRQcm9kdWN0KGd1ZXNzZXMpIHtcclxuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XHJcbiAgICAgICAgdmFyIHBhdHRlcm4gPSBndWVzcy5wYXR0ZXJuIHx8IHF1YWxpZnkoZ3Vlc3MpO1xyXG4gICAgICAgIGlmICghcmVzdWx0ICYmIChyZXN1bHQgPVxyXG4gICAgICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcGF0dGVybiArICcgKlxcXFxkK1suXFxcXHdfXSonLCAnaScpLmV4ZWModWEpIHx8XHJcbiAgICAgICAgICAgICAgUmVnRXhwKCdcXFxcYicgKyBwYXR0ZXJuICsgJyg/OjsgKig/OlthLXpdK1tfLV0pP1thLXpdK1xcXFxkK3xbXiAoKTstXSopJywgJ2knKS5leGVjKHVhKVxyXG4gICAgICAgICAgICApKSB7XHJcbiAgICAgICAgICAvLyBTcGxpdCBieSBmb3J3YXJkIHNsYXNoIGFuZCBhcHBlbmQgcHJvZHVjdCB2ZXJzaW9uIGlmIG5lZWRlZC5cclxuICAgICAgICAgIGlmICgocmVzdWx0ID0gU3RyaW5nKChndWVzcy5sYWJlbCAmJiAhUmVnRXhwKHBhdHRlcm4sICdpJykudGVzdChndWVzcy5sYWJlbCkpID8gZ3Vlc3MubGFiZWwgOiByZXN1bHQpLnNwbGl0KCcvJykpWzFdICYmICEvW1xcZC5dKy8udGVzdChyZXN1bHRbMF0pKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFswXSArPSAnICcgKyByZXN1bHRbMV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBDb3JyZWN0IGNoYXJhY3RlciBjYXNlIGFuZCBjbGVhbnVwIHN0cmluZy5cclxuICAgICAgICAgIGd1ZXNzID0gZ3Vlc3MubGFiZWwgfHwgZ3Vlc3M7XHJcbiAgICAgICAgICByZXN1bHQgPSBmb3JtYXQocmVzdWx0WzBdXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKFJlZ0V4cChwYXR0ZXJuLCAnaScpLCBndWVzcylcclxuICAgICAgICAgICAgLnJlcGxhY2UoUmVnRXhwKCc7ICooPzonICsgZ3Vlc3MgKyAnW18tXSk/JywgJ2knKSwgJyAnKVxyXG4gICAgICAgICAgICAucmVwbGFjZShSZWdFeHAoJygnICsgZ3Vlc3MgKyAnKVstXy5dPyhcXFxcdyknLCAnaScpLCAnJDEgJDInKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzb2x2ZXMgdGhlIHZlcnNpb24gdXNpbmcgYW4gYXJyYXkgb2YgVUEgcGF0dGVybnMuXHJcbiAgICAgKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHBhdHRlcm5zIEFuIGFycmF5IG9mIFVBIHBhdHRlcm5zLlxyXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgdmVyc2lvbi5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0VmVyc2lvbihwYXR0ZXJucykge1xyXG4gICAgICByZXR1cm4gcmVkdWNlKHBhdHRlcm5zLCBmdW5jdGlvbihyZXN1bHQsIHBhdHRlcm4pIHtcclxuICAgICAgICByZXR1cm4gcmVzdWx0IHx8IChSZWdFeHAocGF0dGVybiArXHJcbiAgICAgICAgICAnKD86LVtcXFxcZC5dKy98KD86IGZvciBbXFxcXHctXSspP1sgLy1dKShbXFxcXGQuXStbXiAoKTsvXy1dKiknLCAnaScpLmV4ZWModWEpIHx8IDApWzFdIHx8IG51bGw7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBgcGxhdGZvcm0uZGVzY3JpcHRpb25gIHdoZW4gdGhlIHBsYXRmb3JtIG9iamVjdCBpcyBjb2VyY2VkIHRvIGEgc3RyaW5nLlxyXG4gICAgICpcclxuICAgICAqIEBuYW1lIHRvU3RyaW5nXHJcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgYHBsYXRmb3JtLmRlc2NyaXB0aW9uYCBpZiBhdmFpbGFibGUsIGVsc2UgYW4gZW1wdHkgc3RyaW5nLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB0b1N0cmluZ1BsYXRmb3JtKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbiB8fCAnJztcclxuICAgIH1cclxuXHJcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG4gICAgLy8gQ29udmVydCBsYXlvdXQgdG8gYW4gYXJyYXkgc28gd2UgY2FuIGFkZCBleHRyYSBkZXRhaWxzLlxyXG4gICAgbGF5b3V0ICYmIChsYXlvdXQgPSBbbGF5b3V0XSk7XHJcblxyXG4gICAgLy8gRGV0ZWN0IHByb2R1Y3QgbmFtZXMgdGhhdCBjb250YWluIHRoZWlyIG1hbnVmYWN0dXJlcidzIG5hbWUuXHJcbiAgICBpZiAobWFudWZhY3R1cmVyICYmICFwcm9kdWN0KSB7XHJcbiAgICAgIHByb2R1Y3QgPSBnZXRQcm9kdWN0KFttYW51ZmFjdHVyZXJdKTtcclxuICAgIH1cclxuICAgIC8vIENsZWFuIHVwIEdvb2dsZSBUVi5cclxuICAgIGlmICgoZGF0YSA9IC9cXGJHb29nbGUgVFZcXGIvLmV4ZWMocHJvZHVjdCkpKSB7XHJcbiAgICAgIHByb2R1Y3QgPSBkYXRhWzBdO1xyXG4gICAgfVxyXG4gICAgLy8gRGV0ZWN0IHNpbXVsYXRvcnMuXHJcbiAgICBpZiAoL1xcYlNpbXVsYXRvclxcYi9pLnRlc3QodWEpKSB7XHJcbiAgICAgIHByb2R1Y3QgPSAocHJvZHVjdCA/IHByb2R1Y3QgKyAnICcgOiAnJykgKyAnU2ltdWxhdG9yJztcclxuICAgIH1cclxuICAgIC8vIERldGVjdCBPcGVyYSBNaW5pIDgrIHJ1bm5pbmcgaW4gVHVyYm8vVW5jb21wcmVzc2VkIG1vZGUgb24gaU9TLlxyXG4gICAgaWYgKG5hbWUgPT0gJ09wZXJhIE1pbmknICYmIC9cXGJPUGlPU1xcYi8udGVzdCh1YSkpIHtcclxuICAgICAgZGVzY3JpcHRpb24ucHVzaCgncnVubmluZyBpbiBUdXJiby9VbmNvbXByZXNzZWQgbW9kZScpO1xyXG4gICAgfVxyXG4gICAgLy8gRGV0ZWN0IElFIE1vYmlsZSAxMS5cclxuICAgIGlmIChuYW1lID09ICdJRScgJiYgL1xcYmxpa2UgaVBob25lIE9TXFxiLy50ZXN0KHVhKSkge1xyXG4gICAgICBkYXRhID0gcGFyc2UodWEucmVwbGFjZSgvbGlrZSBpUGhvbmUgT1MvLCAnJykpO1xyXG4gICAgICBtYW51ZmFjdHVyZXIgPSBkYXRhLm1hbnVmYWN0dXJlcjtcclxuICAgICAgcHJvZHVjdCA9IGRhdGEucHJvZHVjdDtcclxuICAgIH1cclxuICAgIC8vIERldGVjdCBpT1MuXHJcbiAgICBlbHNlIGlmICgvXmlQLy50ZXN0KHByb2R1Y3QpKSB7XHJcbiAgICAgIG5hbWUgfHwgKG5hbWUgPSAnU2FmYXJpJyk7XHJcbiAgICAgIG9zID0gJ2lPUycgKyAoKGRhdGEgPSAvIE9TIChbXFxkX10rKS9pLmV4ZWModWEpKVxyXG4gICAgICAgID8gJyAnICsgZGF0YVsxXS5yZXBsYWNlKC9fL2csICcuJylcclxuICAgICAgICA6ICcnKTtcclxuICAgIH1cclxuICAgIC8vIERldGVjdCBLdWJ1bnR1LlxyXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnS29ucXVlcm9yJyAmJiAhL2J1bnR1L2kudGVzdChvcykpIHtcclxuICAgICAgb3MgPSAnS3VidW50dSc7XHJcbiAgICB9XHJcbiAgICAvLyBEZXRlY3QgQW5kcm9pZCBicm93c2Vycy5cclxuICAgIGVsc2UgaWYgKChtYW51ZmFjdHVyZXIgJiYgbWFudWZhY3R1cmVyICE9ICdHb29nbGUnICYmXHJcbiAgICAgICAgKCgvQ2hyb21lLy50ZXN0KG5hbWUpICYmICEvXFxiTW9iaWxlIFNhZmFyaVxcYi9pLnRlc3QodWEpKSB8fCAvXFxiVml0YVxcYi8udGVzdChwcm9kdWN0KSkpIHx8XHJcbiAgICAgICAgKC9cXGJBbmRyb2lkXFxiLy50ZXN0KG9zKSAmJiAvXkNocm9tZS8udGVzdChuYW1lKSAmJiAvXFxiVmVyc2lvblxcLy9pLnRlc3QodWEpKSkge1xyXG4gICAgICBuYW1lID0gJ0FuZHJvaWQgQnJvd3Nlcic7XHJcbiAgICAgIG9zID0gL1xcYkFuZHJvaWRcXGIvLnRlc3Qob3MpID8gb3MgOiAnQW5kcm9pZCc7XHJcbiAgICB9XHJcbiAgICAvLyBEZXRlY3QgU2lsayBkZXNrdG9wL2FjY2VsZXJhdGVkIG1vZGVzLlxyXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnU2lsaycpIHtcclxuICAgICAgaWYgKCEvXFxiTW9iaS9pLnRlc3QodWEpKSB7XHJcbiAgICAgICAgb3MgPSAnQW5kcm9pZCc7XHJcbiAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKC9BY2NlbGVyYXRlZCAqPSAqdHJ1ZS9pLnRlc3QodWEpKSB7XHJcbiAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnYWNjZWxlcmF0ZWQnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gRGV0ZWN0IFBhbGVNb29uIGlkZW50aWZ5aW5nIGFzIEZpcmVmb3guXHJcbiAgICBlbHNlIGlmIChuYW1lID09ICdQYWxlTW9vbicgJiYgKGRhdGEgPSAvXFxiRmlyZWZveFxcLyhbXFxkLl0rKVxcYi8uZXhlYyh1YSkpKSB7XHJcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ2lkZW50aWZ5aW5nIGFzIEZpcmVmb3ggJyArIGRhdGFbMV0pO1xyXG4gICAgfVxyXG4gICAgLy8gRGV0ZWN0IEZpcmVmb3ggT1MgYW5kIHByb2R1Y3RzIHJ1bm5pbmcgRmlyZWZveC5cclxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ0ZpcmVmb3gnICYmIChkYXRhID0gL1xcYihNb2JpbGV8VGFibGV0fFRWKVxcYi9pLmV4ZWModWEpKSkge1xyXG4gICAgICBvcyB8fCAob3MgPSAnRmlyZWZveCBPUycpO1xyXG4gICAgICBwcm9kdWN0IHx8IChwcm9kdWN0ID0gZGF0YVsxXSk7XHJcbiAgICB9XHJcbiAgICAvLyBEZXRlY3QgZmFsc2UgcG9zaXRpdmVzIGZvciBGaXJlZm94L1NhZmFyaS5cclxuICAgIGVsc2UgaWYgKCFuYW1lIHx8IChkYXRhID0gIS9cXGJNaW5lZmllbGRcXGIvaS50ZXN0KHVhKSAmJiAvXFxiKD86RmlyZWZveHxTYWZhcmkpXFxiLy5leGVjKG5hbWUpKSkge1xyXG4gICAgICAvLyBFc2NhcGUgdGhlIGAvYCBmb3IgRmlyZWZveCAxLlxyXG4gICAgICBpZiAobmFtZSAmJiAhcHJvZHVjdCAmJiAvW1xcLyxdfF5bXihdKz9cXCkvLnRlc3QodWEuc2xpY2UodWEuaW5kZXhPZihkYXRhICsgJy8nKSArIDgpKSkge1xyXG4gICAgICAgIC8vIENsZWFyIG5hbWUgb2YgZmFsc2UgcG9zaXRpdmVzLlxyXG4gICAgICAgIG5hbWUgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFJlYXNzaWduIGEgZ2VuZXJpYyBuYW1lLlxyXG4gICAgICBpZiAoKGRhdGEgPSBwcm9kdWN0IHx8IG1hbnVmYWN0dXJlciB8fCBvcykgJiZcclxuICAgICAgICAgIChwcm9kdWN0IHx8IG1hbnVmYWN0dXJlciB8fCAvXFxiKD86QW5kcm9pZHxTeW1iaWFuIE9TfFRhYmxldCBPU3x3ZWJPUylcXGIvLnRlc3Qob3MpKSkge1xyXG4gICAgICAgIG5hbWUgPSAvW2Etel0rKD86IEhhdCk/L2kuZXhlYygvXFxiQW5kcm9pZFxcYi8udGVzdChvcykgPyBvcyA6IGRhdGEpICsgJyBCcm93c2VyJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gRGV0ZWN0IG5vbi1PcGVyYSAoUHJlc3RvLWJhc2VkKSB2ZXJzaW9ucyAob3JkZXIgaXMgaW1wb3J0YW50KS5cclxuICAgIGlmICghdmVyc2lvbikge1xyXG4gICAgICB2ZXJzaW9uID0gZ2V0VmVyc2lvbihbXHJcbiAgICAgICAgJyg/OkNsb3VkOXxDcmlPU3xDck1vfEVkZ2V8RnhpT1N8SUVNb2JpbGV8SXJvbnxPcGVyYSA/TWluaXxPUGlPU3xPUFJ8UmF2ZW58U2lsayg/IS9bXFxcXGQuXSskKSknLFxyXG4gICAgICAgICdWZXJzaW9uJyxcclxuICAgICAgICBxdWFsaWZ5KG5hbWUpLFxyXG4gICAgICAgICcoPzpGaXJlZm94fE1pbmVmaWVsZHxOZXRGcm9udCknXHJcbiAgICAgIF0pO1xyXG4gICAgfVxyXG4gICAgLy8gRGV0ZWN0IHN0dWJib3JuIGxheW91dCBlbmdpbmVzLlxyXG4gICAgaWYgKChkYXRhID1cclxuICAgICAgICAgIGxheW91dCA9PSAnaUNhYicgJiYgcGFyc2VGbG9hdCh2ZXJzaW9uKSA+IDMgJiYgJ1dlYktpdCcgfHxcclxuICAgICAgICAgIC9cXGJPcGVyYVxcYi8udGVzdChuYW1lKSAmJiAoL1xcYk9QUlxcYi8udGVzdCh1YSkgPyAnQmxpbmsnIDogJ1ByZXN0bycpIHx8XHJcbiAgICAgICAgICAvXFxiKD86TWlkb3JpfE5vb2t8U2FmYXJpKVxcYi9pLnRlc3QodWEpICYmICEvXig/OlRyaWRlbnR8RWRnZUhUTUwpJC8udGVzdChsYXlvdXQpICYmICdXZWJLaXQnIHx8XHJcbiAgICAgICAgICAhbGF5b3V0ICYmIC9cXGJNU0lFXFxiL2kudGVzdCh1YSkgJiYgKG9zID09ICdNYWMgT1MnID8gJ1Rhc21hbicgOiAnVHJpZGVudCcpIHx8XHJcbiAgICAgICAgICBsYXlvdXQgPT0gJ1dlYktpdCcgJiYgL1xcYlBsYXlTdGF0aW9uXFxiKD8hIFZpdGFcXGIpL2kudGVzdChuYW1lKSAmJiAnTmV0RnJvbnQnXHJcbiAgICAgICAgKSkge1xyXG4gICAgICBsYXlvdXQgPSBbZGF0YV07XHJcbiAgICB9XHJcbiAgICAvLyBEZXRlY3QgV2luZG93cyBQaG9uZSA3IGRlc2t0b3AgbW9kZS5cclxuICAgIGlmIChuYW1lID09ICdJRScgJiYgKGRhdGEgPSAoLzsgKig/OlhCTFdQfFp1bmVXUCkoXFxkKykvaS5leGVjKHVhKSB8fCAwKVsxXSkpIHtcclxuICAgICAgbmFtZSArPSAnIE1vYmlsZSc7XHJcbiAgICAgIG9zID0gJ1dpbmRvd3MgUGhvbmUgJyArICgvXFwrJC8udGVzdChkYXRhKSA/IGRhdGEgOiBkYXRhICsgJy54Jyk7XHJcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xyXG4gICAgfVxyXG4gICAgLy8gRGV0ZWN0IFdpbmRvd3MgUGhvbmUgOC54IGRlc2t0b3AgbW9kZS5cclxuICAgIGVsc2UgaWYgKC9cXGJXUERlc2t0b3BcXGIvaS50ZXN0KHVhKSkge1xyXG4gICAgICBuYW1lID0gJ0lFIE1vYmlsZSc7XHJcbiAgICAgIG9zID0gJ1dpbmRvd3MgUGhvbmUgOC54JztcclxuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XHJcbiAgICAgIHZlcnNpb24gfHwgKHZlcnNpb24gPSAoL1xcYnJ2OihbXFxkLl0rKS8uZXhlYyh1YSkgfHwgMClbMV0pO1xyXG4gICAgfVxyXG4gICAgLy8gRGV0ZWN0IElFIDExLlxyXG4gICAgZWxzZSBpZiAobmFtZSAhPSAnSUUnICYmIGxheW91dCA9PSAnVHJpZGVudCcgJiYgKGRhdGEgPSAvXFxicnY6KFtcXGQuXSspLy5leGVjKHVhKSkpIHtcclxuICAgICAgaWYgKG5hbWUpIHtcclxuICAgICAgICBkZXNjcmlwdGlvbi5wdXNoKCdpZGVudGlmeWluZyBhcyAnICsgbmFtZSArICh2ZXJzaW9uID8gJyAnICsgdmVyc2lvbiA6ICcnKSk7XHJcbiAgICAgIH1cclxuICAgICAgbmFtZSA9ICdJRSc7XHJcbiAgICAgIHZlcnNpb24gPSBkYXRhWzFdO1xyXG4gICAgfVxyXG4gICAgLy8gTGV2ZXJhZ2UgZW52aXJvbm1lbnQgZmVhdHVyZXMuXHJcbiAgICBpZiAodXNlRmVhdHVyZXMpIHtcclxuICAgICAgLy8gRGV0ZWN0IHNlcnZlci1zaWRlIGVudmlyb25tZW50cy5cclxuICAgICAgLy8gUmhpbm8gaGFzIGEgZ2xvYmFsIGZ1bmN0aW9uIHdoaWxlIG90aGVycyBoYXZlIGEgZ2xvYmFsIG9iamVjdC5cclxuICAgICAgaWYgKGlzSG9zdFR5cGUoY29udGV4dCwgJ2dsb2JhbCcpKSB7XHJcbiAgICAgICAgaWYgKGphdmEpIHtcclxuICAgICAgICAgIGRhdGEgPSBqYXZhLmxhbmcuU3lzdGVtO1xyXG4gICAgICAgICAgYXJjaCA9IGRhdGEuZ2V0UHJvcGVydHkoJ29zLmFyY2gnKTtcclxuICAgICAgICAgIG9zID0gb3MgfHwgZGF0YS5nZXRQcm9wZXJ0eSgnb3MubmFtZScpICsgJyAnICsgZGF0YS5nZXRQcm9wZXJ0eSgnb3MudmVyc2lvbicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNNb2R1bGVTY29wZSAmJiBpc0hvc3RUeXBlKGNvbnRleHQsICdzeXN0ZW0nKSAmJiAoZGF0YSA9IFtjb250ZXh0LnN5c3RlbV0pWzBdKSB7XHJcbiAgICAgICAgICBvcyB8fCAob3MgPSBkYXRhWzBdLm9zIHx8IG51bGwpO1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgZGF0YVsxXSA9IGNvbnRleHQucmVxdWlyZSgncmluZ28vZW5naW5lJykudmVyc2lvbjtcclxuICAgICAgICAgICAgdmVyc2lvbiA9IGRhdGFbMV0uam9pbignLicpO1xyXG4gICAgICAgICAgICBuYW1lID0gJ1JpbmdvSlMnO1xyXG4gICAgICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhWzBdLmdsb2JhbC5zeXN0ZW0gPT0gY29udGV4dC5zeXN0ZW0pIHtcclxuICAgICAgICAgICAgICBuYW1lID0gJ05hcndoYWwnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKFxyXG4gICAgICAgICAgdHlwZW9mIGNvbnRleHQucHJvY2VzcyA9PSAnb2JqZWN0JyAmJiAhY29udGV4dC5wcm9jZXNzLmJyb3dzZXIgJiZcclxuICAgICAgICAgIChkYXRhID0gY29udGV4dC5wcm9jZXNzKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgbmFtZSA9ICdOb2RlLmpzJztcclxuICAgICAgICAgIGFyY2ggPSBkYXRhLmFyY2g7XHJcbiAgICAgICAgICBvcyA9IGRhdGEucGxhdGZvcm07XHJcbiAgICAgICAgICB2ZXJzaW9uID0gL1tcXGQuXSsvLmV4ZWMoZGF0YS52ZXJzaW9uKVswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocmhpbm8pIHtcclxuICAgICAgICAgIG5hbWUgPSAnUmhpbm8nO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvLyBEZXRlY3QgQWRvYmUgQUlSLlxyXG4gICAgICBlbHNlIGlmIChnZXRDbGFzc09mKChkYXRhID0gY29udGV4dC5ydW50aW1lKSkgPT0gYWlyUnVudGltZUNsYXNzKSB7XHJcbiAgICAgICAgbmFtZSA9ICdBZG9iZSBBSVInO1xyXG4gICAgICAgIG9zID0gZGF0YS5mbGFzaC5zeXN0ZW0uQ2FwYWJpbGl0aWVzLm9zO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIERldGVjdCBQaGFudG9tSlMuXHJcbiAgICAgIGVsc2UgaWYgKGdldENsYXNzT2YoKGRhdGEgPSBjb250ZXh0LnBoYW50b20pKSA9PSBwaGFudG9tQ2xhc3MpIHtcclxuICAgICAgICBuYW1lID0gJ1BoYW50b21KUyc7XHJcbiAgICAgICAgdmVyc2lvbiA9IChkYXRhID0gZGF0YS52ZXJzaW9uIHx8IG51bGwpICYmIChkYXRhLm1ham9yICsgJy4nICsgZGF0YS5taW5vciArICcuJyArIGRhdGEucGF0Y2gpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIERldGVjdCBJRSBjb21wYXRpYmlsaXR5IG1vZGVzLlxyXG4gICAgICBlbHNlIGlmICh0eXBlb2YgZG9jLmRvY3VtZW50TW9kZSA9PSAnbnVtYmVyJyAmJiAoZGF0YSA9IC9cXGJUcmlkZW50XFwvKFxcZCspL2kuZXhlYyh1YSkpKSB7XHJcbiAgICAgICAgLy8gV2UncmUgaW4gY29tcGF0aWJpbGl0eSBtb2RlIHdoZW4gdGhlIFRyaWRlbnQgdmVyc2lvbiArIDQgZG9lc24ndFxyXG4gICAgICAgIC8vIGVxdWFsIHRoZSBkb2N1bWVudCBtb2RlLlxyXG4gICAgICAgIHZlcnNpb24gPSBbdmVyc2lvbiwgZG9jLmRvY3VtZW50TW9kZV07XHJcbiAgICAgICAgaWYgKChkYXRhID0gK2RhdGFbMV0gKyA0KSAhPSB2ZXJzaW9uWzFdKSB7XHJcbiAgICAgICAgICBkZXNjcmlwdGlvbi5wdXNoKCdJRSAnICsgdmVyc2lvblsxXSArICcgbW9kZScpO1xyXG4gICAgICAgICAgbGF5b3V0ICYmIChsYXlvdXRbMV0gPSAnJyk7XHJcbiAgICAgICAgICB2ZXJzaW9uWzFdID0gZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmVyc2lvbiA9IG5hbWUgPT0gJ0lFJyA/IFN0cmluZyh2ZXJzaW9uWzFdLnRvRml4ZWQoMSkpIDogdmVyc2lvblswXTtcclxuICAgICAgfVxyXG4gICAgICBvcyA9IG9zICYmIGZvcm1hdChvcyk7XHJcbiAgICB9XHJcbiAgICAvLyBEZXRlY3QgcHJlcmVsZWFzZSBwaGFzZXMuXHJcbiAgICBpZiAodmVyc2lvbiAmJiAoZGF0YSA9XHJcbiAgICAgICAgICAvKD86W2FiXXxkcHxwcmV8W2FiXVxcZCtwcmUpKD86XFxkK1xcKz8pPyQvaS5leGVjKHZlcnNpb24pIHx8XHJcbiAgICAgICAgICAvKD86YWxwaGF8YmV0YSkoPzogP1xcZCk/L2kuZXhlYyh1YSArICc7JyArICh1c2VGZWF0dXJlcyAmJiBuYXYuYXBwTWlub3JWZXJzaW9uKSkgfHxcclxuICAgICAgICAgIC9cXGJNaW5lZmllbGRcXGIvaS50ZXN0KHVhKSAmJiAnYSdcclxuICAgICAgICApKSB7XHJcbiAgICAgIHByZXJlbGVhc2UgPSAvYi9pLnRlc3QoZGF0YSkgPyAnYmV0YScgOiAnYWxwaGEnO1xyXG4gICAgICB2ZXJzaW9uID0gdmVyc2lvbi5yZXBsYWNlKFJlZ0V4cChkYXRhICsgJ1xcXFwrPyQnKSwgJycpICtcclxuICAgICAgICAocHJlcmVsZWFzZSA9PSAnYmV0YScgPyBiZXRhIDogYWxwaGEpICsgKC9cXGQrXFwrPy8uZXhlYyhkYXRhKSB8fCAnJyk7XHJcbiAgICB9XHJcbiAgICAvLyBEZXRlY3QgRmlyZWZveCBNb2JpbGUuXHJcbiAgICBpZiAobmFtZSA9PSAnRmVubmVjJyB8fCBuYW1lID09ICdGaXJlZm94JyAmJiAvXFxiKD86QW5kcm9pZHxGaXJlZm94IE9TKVxcYi8udGVzdChvcykpIHtcclxuICAgICAgbmFtZSA9ICdGaXJlZm94IE1vYmlsZSc7XHJcbiAgICB9XHJcbiAgICAvLyBPYnNjdXJlIE1heHRob24ncyB1bnJlbGlhYmxlIHZlcnNpb24uXHJcbiAgICBlbHNlIGlmIChuYW1lID09ICdNYXh0aG9uJyAmJiB2ZXJzaW9uKSB7XHJcbiAgICAgIHZlcnNpb24gPSB2ZXJzaW9uLnJlcGxhY2UoL1xcLltcXGQuXSsvLCAnLngnKTtcclxuICAgIH1cclxuICAgIC8vIERldGVjdCBYYm94IDM2MCBhbmQgWGJveCBPbmUuXHJcbiAgICBlbHNlIGlmICgvXFxiWGJveFxcYi9pLnRlc3QocHJvZHVjdCkpIHtcclxuICAgICAgb3MgPSBudWxsO1xyXG4gICAgICBpZiAocHJvZHVjdCA9PSAnWGJveCAzNjAnICYmIC9cXGJJRU1vYmlsZVxcYi8udGVzdCh1YSkpIHtcclxuICAgICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdtb2JpbGUgbW9kZScpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBBZGQgbW9iaWxlIHBvc3RmaXguXHJcbiAgICBlbHNlIGlmICgoL14oPzpDaHJvbWV8SUV8T3BlcmEpJC8udGVzdChuYW1lKSB8fCBuYW1lICYmICFwcm9kdWN0ICYmICEvQnJvd3NlcnxNb2JpLy50ZXN0KG5hbWUpKSAmJlxyXG4gICAgICAgIChvcyA9PSAnV2luZG93cyBDRScgfHwgL01vYmkvaS50ZXN0KHVhKSkpIHtcclxuICAgICAgbmFtZSArPSAnIE1vYmlsZSc7XHJcbiAgICB9XHJcbiAgICAvLyBEZXRlY3QgSUUgcGxhdGZvcm0gcHJldmlldy5cclxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ0lFJyAmJiB1c2VGZWF0dXJlcyAmJiBjb250ZXh0LmV4dGVybmFsID09PSBudWxsKSB7XHJcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ3BsYXRmb3JtIHByZXZpZXcnKTtcclxuICAgIH1cclxuICAgIC8vIERldGVjdCBCbGFja0JlcnJ5IE9TIHZlcnNpb24uXHJcbiAgICAvLyBodHRwOi8vZG9jcy5ibGFja2JlcnJ5LmNvbS9lbi9kZXZlbG9wZXJzL2RlbGl2ZXJhYmxlcy8xODE2OS9IVFRQX2hlYWRlcnNfc2VudF9ieV9CQl9Ccm93c2VyXzEyMzQ5MTFfMTEuanNwXHJcbiAgICBlbHNlIGlmICgoL1xcYkJsYWNrQmVycnlcXGIvLnRlc3QocHJvZHVjdCkgfHwgL1xcYkJCMTBcXGIvLnRlc3QodWEpKSAmJiAoZGF0YSA9XHJcbiAgICAgICAgICAoUmVnRXhwKHByb2R1Y3QucmVwbGFjZSgvICsvZywgJyAqJykgKyAnLyhbLlxcXFxkXSspJywgJ2knKS5leGVjKHVhKSB8fCAwKVsxXSB8fFxyXG4gICAgICAgICAgdmVyc2lvblxyXG4gICAgICAgICkpIHtcclxuICAgICAgZGF0YSA9IFtkYXRhLCAvQkIxMC8udGVzdCh1YSldO1xyXG4gICAgICBvcyA9IChkYXRhWzFdID8gKHByb2R1Y3QgPSBudWxsLCBtYW51ZmFjdHVyZXIgPSAnQmxhY2tCZXJyeScpIDogJ0RldmljZSBTb2Z0d2FyZScpICsgJyAnICsgZGF0YVswXTtcclxuICAgICAgdmVyc2lvbiA9IG51bGw7XHJcbiAgICB9XHJcbiAgICAvLyBEZXRlY3QgT3BlcmEgaWRlbnRpZnlpbmcvbWFza2luZyBpdHNlbGYgYXMgYW5vdGhlciBicm93c2VyLlxyXG4gICAgLy8gaHR0cDovL3d3dy5vcGVyYS5jb20vc3VwcG9ydC9rYi92aWV3Lzg0My9cclxuICAgIGVsc2UgaWYgKHRoaXMgIT0gZm9yT3duICYmIHByb2R1Y3QgIT0gJ1dpaScgJiYgKFxyXG4gICAgICAgICAgKHVzZUZlYXR1cmVzICYmIG9wZXJhKSB8fFxyXG4gICAgICAgICAgKC9PcGVyYS8udGVzdChuYW1lKSAmJiAvXFxiKD86TVNJRXxGaXJlZm94KVxcYi9pLnRlc3QodWEpKSB8fFxyXG4gICAgICAgICAgKG5hbWUgPT0gJ0ZpcmVmb3gnICYmIC9cXGJPUyBYICg/OlxcZCtcXC4pezIsfS8udGVzdChvcykpIHx8XHJcbiAgICAgICAgICAobmFtZSA9PSAnSUUnICYmIChcclxuICAgICAgICAgICAgKG9zICYmICEvXldpbi8udGVzdChvcykgJiYgdmVyc2lvbiA+IDUuNSkgfHxcclxuICAgICAgICAgICAgL1xcYldpbmRvd3MgWFBcXGIvLnRlc3Qob3MpICYmIHZlcnNpb24gPiA4IHx8XHJcbiAgICAgICAgICAgIHZlcnNpb24gPT0gOCAmJiAhL1xcYlRyaWRlbnRcXGIvLnRlc3QodWEpXHJcbiAgICAgICAgICApKVxyXG4gICAgICAgICkgJiYgIXJlT3BlcmEudGVzdCgoZGF0YSA9IHBhcnNlLmNhbGwoZm9yT3duLCB1YS5yZXBsYWNlKHJlT3BlcmEsICcnKSArICc7JykpKSAmJiBkYXRhLm5hbWUpIHtcclxuICAgICAgLy8gV2hlbiBcImlkZW50aWZ5aW5nXCIsIHRoZSBVQSBjb250YWlucyBib3RoIE9wZXJhIGFuZCB0aGUgb3RoZXIgYnJvd3NlcidzIG5hbWUuXHJcbiAgICAgIGRhdGEgPSAnaW5nIGFzICcgKyBkYXRhLm5hbWUgKyAoKGRhdGEgPSBkYXRhLnZlcnNpb24pID8gJyAnICsgZGF0YSA6ICcnKTtcclxuICAgICAgaWYgKHJlT3BlcmEudGVzdChuYW1lKSkge1xyXG4gICAgICAgIGlmICgvXFxiSUVcXGIvLnRlc3QoZGF0YSkgJiYgb3MgPT0gJ01hYyBPUycpIHtcclxuICAgICAgICAgIG9zID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGF0YSA9ICdpZGVudGlmeScgKyBkYXRhO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFdoZW4gXCJtYXNraW5nXCIsIHRoZSBVQSBjb250YWlucyBvbmx5IHRoZSBvdGhlciBicm93c2VyJ3MgbmFtZS5cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgZGF0YSA9ICdtYXNrJyArIGRhdGE7XHJcbiAgICAgICAgaWYgKG9wZXJhQ2xhc3MpIHtcclxuICAgICAgICAgIG5hbWUgPSBmb3JtYXQob3BlcmFDbGFzcy5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5hbWUgPSAnT3BlcmEnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoL1xcYklFXFxiLy50ZXN0KGRhdGEpKSB7XHJcbiAgICAgICAgICBvcyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdXNlRmVhdHVyZXMpIHtcclxuICAgICAgICAgIHZlcnNpb24gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBsYXlvdXQgPSBbJ1ByZXN0byddO1xyXG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKGRhdGEpO1xyXG4gICAgfVxyXG4gICAgLy8gRGV0ZWN0IFdlYktpdCBOaWdodGx5IGFuZCBhcHByb3hpbWF0ZSBDaHJvbWUvU2FmYXJpIHZlcnNpb25zLlxyXG4gICAgaWYgKChkYXRhID0gKC9cXGJBcHBsZVdlYktpdFxcLyhbXFxkLl0rXFwrPykvaS5leGVjKHVhKSB8fCAwKVsxXSkpIHtcclxuICAgICAgLy8gQ29ycmVjdCBidWlsZCBudW1iZXIgZm9yIG51bWVyaWMgY29tcGFyaXNvbi5cclxuICAgICAgLy8gKGUuZy4gXCI1MzIuNVwiIGJlY29tZXMgXCI1MzIuMDVcIilcclxuICAgICAgZGF0YSA9IFtwYXJzZUZsb2F0KGRhdGEucmVwbGFjZSgvXFwuKFxcZCkkLywgJy4wJDEnKSksIGRhdGFdO1xyXG4gICAgICAvLyBOaWdodGx5IGJ1aWxkcyBhcmUgcG9zdGZpeGVkIHdpdGggYSBcIitcIi5cclxuICAgICAgaWYgKG5hbWUgPT0gJ1NhZmFyaScgJiYgZGF0YVsxXS5zbGljZSgtMSkgPT0gJysnKSB7XHJcbiAgICAgICAgbmFtZSA9ICdXZWJLaXQgTmlnaHRseSc7XHJcbiAgICAgICAgcHJlcmVsZWFzZSA9ICdhbHBoYSc7XHJcbiAgICAgICAgdmVyc2lvbiA9IGRhdGFbMV0uc2xpY2UoMCwgLTEpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIENsZWFyIGluY29ycmVjdCBicm93c2VyIHZlcnNpb25zLlxyXG4gICAgICBlbHNlIGlmICh2ZXJzaW9uID09IGRhdGFbMV0gfHxcclxuICAgICAgICAgIHZlcnNpb24gPT0gKGRhdGFbMl0gPSAoL1xcYlNhZmFyaVxcLyhbXFxkLl0rXFwrPykvaS5leGVjKHVhKSB8fCAwKVsxXSkpIHtcclxuICAgICAgICB2ZXJzaW9uID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgICAvLyBVc2UgdGhlIGZ1bGwgQ2hyb21lIHZlcnNpb24gd2hlbiBhdmFpbGFibGUuXHJcbiAgICAgIGRhdGFbMV0gPSAoL1xcYkNocm9tZVxcLyhbXFxkLl0rKS9pLmV4ZWModWEpIHx8IDApWzFdO1xyXG4gICAgICAvLyBEZXRlY3QgQmxpbmsgbGF5b3V0IGVuZ2luZS5cclxuICAgICAgaWYgKGRhdGFbMF0gPT0gNTM3LjM2ICYmIGRhdGFbMl0gPT0gNTM3LjM2ICYmIHBhcnNlRmxvYXQoZGF0YVsxXSkgPj0gMjggJiYgbGF5b3V0ID09ICdXZWJLaXQnKSB7XHJcbiAgICAgICAgbGF5b3V0ID0gWydCbGluayddO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIERldGVjdCBKYXZhU2NyaXB0Q29yZS5cclxuICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82NzY4NDc0L2hvdy1jYW4taS1kZXRlY3Qtd2hpY2gtamF2YXNjcmlwdC1lbmdpbmUtdjgtb3ItanNjLWlzLXVzZWQtYXQtcnVudGltZS1pbi1hbmRyb2lcclxuICAgICAgaWYgKCF1c2VGZWF0dXJlcyB8fCAoIWxpa2VDaHJvbWUgJiYgIWRhdGFbMV0pKSB7XHJcbiAgICAgICAgbGF5b3V0ICYmIChsYXlvdXRbMV0gPSAnbGlrZSBTYWZhcmknKTtcclxuICAgICAgICBkYXRhID0gKGRhdGEgPSBkYXRhWzBdLCBkYXRhIDwgNDAwID8gMSA6IGRhdGEgPCA1MDAgPyAyIDogZGF0YSA8IDUyNiA/IDMgOiBkYXRhIDwgNTMzID8gNCA6IGRhdGEgPCA1MzQgPyAnNCsnIDogZGF0YSA8IDUzNSA/IDUgOiBkYXRhIDwgNTM3ID8gNiA6IGRhdGEgPCA1MzggPyA3IDogZGF0YSA8IDYwMSA/IDggOiAnOCcpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxheW91dCAmJiAobGF5b3V0WzFdID0gJ2xpa2UgQ2hyb21lJyk7XHJcbiAgICAgICAgZGF0YSA9IGRhdGFbMV0gfHwgKGRhdGEgPSBkYXRhWzBdLCBkYXRhIDwgNTMwID8gMSA6IGRhdGEgPCA1MzIgPyAyIDogZGF0YSA8IDUzMi4wNSA/IDMgOiBkYXRhIDwgNTMzID8gNCA6IGRhdGEgPCA1MzQuMDMgPyA1IDogZGF0YSA8IDUzNC4wNyA/IDYgOiBkYXRhIDwgNTM0LjEwID8gNyA6IGRhdGEgPCA1MzQuMTMgPyA4IDogZGF0YSA8IDUzNC4xNiA/IDkgOiBkYXRhIDwgNTM0LjI0ID8gMTAgOiBkYXRhIDwgNTM0LjMwID8gMTEgOiBkYXRhIDwgNTM1LjAxID8gMTIgOiBkYXRhIDwgNTM1LjAyID8gJzEzKycgOiBkYXRhIDwgNTM1LjA3ID8gMTUgOiBkYXRhIDwgNTM1LjExID8gMTYgOiBkYXRhIDwgNTM1LjE5ID8gMTcgOiBkYXRhIDwgNTM2LjA1ID8gMTggOiBkYXRhIDwgNTM2LjEwID8gMTkgOiBkYXRhIDwgNTM3LjAxID8gMjAgOiBkYXRhIDwgNTM3LjExID8gJzIxKycgOiBkYXRhIDwgNTM3LjEzID8gMjMgOiBkYXRhIDwgNTM3LjE4ID8gMjQgOiBkYXRhIDwgNTM3LjI0ID8gMjUgOiBkYXRhIDwgNTM3LjM2ID8gMjYgOiBsYXlvdXQgIT0gJ0JsaW5rJyA/ICcyNycgOiAnMjgnKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBBZGQgdGhlIHBvc3RmaXggb2YgXCIueFwiIG9yIFwiK1wiIGZvciBhcHByb3hpbWF0ZSB2ZXJzaW9ucy5cclxuICAgICAgbGF5b3V0ICYmIChsYXlvdXRbMV0gKz0gJyAnICsgKGRhdGEgKz0gdHlwZW9mIGRhdGEgPT0gJ251bWJlcicgPyAnLngnIDogL1suK10vLnRlc3QoZGF0YSkgPyAnJyA6ICcrJykpO1xyXG4gICAgICAvLyBPYnNjdXJlIHZlcnNpb24gZm9yIHNvbWUgU2FmYXJpIDEtMiByZWxlYXNlcy5cclxuICAgICAgaWYgKG5hbWUgPT0gJ1NhZmFyaScgJiYgKCF2ZXJzaW9uIHx8IHBhcnNlSW50KHZlcnNpb24pID4gNDUpKSB7XHJcbiAgICAgICAgdmVyc2lvbiA9IGRhdGE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIERldGVjdCBPcGVyYSBkZXNrdG9wIG1vZGVzLlxyXG4gICAgaWYgKG5hbWUgPT0gJ09wZXJhJyAmJiAgKGRhdGEgPSAvXFxiemJvdnx6dmF2JC8uZXhlYyhvcykpKSB7XHJcbiAgICAgIG5hbWUgKz0gJyAnO1xyXG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdkZXNrdG9wIG1vZGUnKTtcclxuICAgICAgaWYgKGRhdGEgPT0gJ3p2YXYnKSB7XHJcbiAgICAgICAgbmFtZSArPSAnTWluaSc7XHJcbiAgICAgICAgdmVyc2lvbiA9IG51bGw7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbmFtZSArPSAnTW9iaWxlJztcclxuICAgICAgfVxyXG4gICAgICBvcyA9IG9zLnJlcGxhY2UoUmVnRXhwKCcgKicgKyBkYXRhICsgJyQnKSwgJycpO1xyXG4gICAgfVxyXG4gICAgLy8gRGV0ZWN0IENocm9tZSBkZXNrdG9wIG1vZGUuXHJcbiAgICBlbHNlIGlmIChuYW1lID09ICdTYWZhcmknICYmIC9cXGJDaHJvbWVcXGIvLmV4ZWMobGF5b3V0ICYmIGxheW91dFsxXSkpIHtcclxuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XHJcbiAgICAgIG5hbWUgPSAnQ2hyb21lIE1vYmlsZSc7XHJcbiAgICAgIHZlcnNpb24gPSBudWxsO1xyXG5cclxuICAgICAgaWYgKC9cXGJPUyBYXFxiLy50ZXN0KG9zKSkge1xyXG4gICAgICAgIG1hbnVmYWN0dXJlciA9ICdBcHBsZSc7XHJcbiAgICAgICAgb3MgPSAnaU9TIDQuMysnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9zID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gU3RyaXAgaW5jb3JyZWN0IE9TIHZlcnNpb25zLlxyXG4gICAgaWYgKHZlcnNpb24gJiYgdmVyc2lvbi5pbmRleE9mKChkYXRhID0gL1tcXGQuXSskLy5leGVjKG9zKSkpID09IDAgJiZcclxuICAgICAgICB1YS5pbmRleE9mKCcvJyArIGRhdGEgKyAnLScpID4gLTEpIHtcclxuICAgICAgb3MgPSB0cmltKG9zLnJlcGxhY2UoZGF0YSwgJycpKTtcclxuICAgIH1cclxuICAgIC8vIEFkZCBsYXlvdXQgZW5naW5lLlxyXG4gICAgaWYgKGxheW91dCAmJiAhL1xcYig/OkF2YW50fE5vb2spXFxiLy50ZXN0KG5hbWUpICYmIChcclxuICAgICAgICAvQnJvd3NlcnxMdW5hc2NhcGV8TWF4dGhvbi8udGVzdChuYW1lKSB8fFxyXG4gICAgICAgIG5hbWUgIT0gJ1NhZmFyaScgJiYgL15pT1MvLnRlc3Qob3MpICYmIC9cXGJTYWZhcmlcXGIvLnRlc3QobGF5b3V0WzFdKSB8fFxyXG4gICAgICAgIC9eKD86QWRvYmV8QXJvcmF8QnJlYWNofE1pZG9yaXxPcGVyYXxQaGFudG9tfFJla29ucXxSb2NrfFNsZWlwbmlyfFdlYikvLnRlc3QobmFtZSkgJiYgbGF5b3V0WzFdKSkge1xyXG4gICAgICAvLyBEb24ndCBhZGQgbGF5b3V0IGRldGFpbHMgdG8gZGVzY3JpcHRpb24gaWYgdGhleSBhcmUgZmFsc2V5LlxyXG4gICAgICAoZGF0YSA9IGxheW91dFtsYXlvdXQubGVuZ3RoIC0gMV0pICYmIGRlc2NyaXB0aW9uLnB1c2goZGF0YSk7XHJcbiAgICB9XHJcbiAgICAvLyBDb21iaW5lIGNvbnRleHR1YWwgaW5mb3JtYXRpb24uXHJcbiAgICBpZiAoZGVzY3JpcHRpb24ubGVuZ3RoKSB7XHJcbiAgICAgIGRlc2NyaXB0aW9uID0gWycoJyArIGRlc2NyaXB0aW9uLmpvaW4oJzsgJykgKyAnKSddO1xyXG4gICAgfVxyXG4gICAgLy8gQXBwZW5kIG1hbnVmYWN0dXJlciB0byBkZXNjcmlwdGlvbi5cclxuICAgIGlmIChtYW51ZmFjdHVyZXIgJiYgcHJvZHVjdCAmJiBwcm9kdWN0LmluZGV4T2YobWFudWZhY3R1cmVyKSA8IDApIHtcclxuICAgICAgZGVzY3JpcHRpb24ucHVzaCgnb24gJyArIG1hbnVmYWN0dXJlcik7XHJcbiAgICB9XHJcbiAgICAvLyBBcHBlbmQgcHJvZHVjdCB0byBkZXNjcmlwdGlvbi5cclxuICAgIGlmIChwcm9kdWN0KSB7XHJcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goKC9eb24gLy50ZXN0KGRlc2NyaXB0aW9uW2Rlc2NyaXB0aW9uLmxlbmd0aCAtIDFdKSA/ICcnIDogJ29uICcpICsgcHJvZHVjdCk7XHJcbiAgICB9XHJcbiAgICAvLyBQYXJzZSB0aGUgT1MgaW50byBhbiBvYmplY3QuXHJcbiAgICBpZiAob3MpIHtcclxuICAgICAgZGF0YSA9IC8gKFtcXGQuK10rKSQvLmV4ZWMob3MpO1xyXG4gICAgICBpc1NwZWNpYWxDYXNlZE9TID0gZGF0YSAmJiBvcy5jaGFyQXQob3MubGVuZ3RoIC0gZGF0YVswXS5sZW5ndGggLSAxKSA9PSAnLyc7XHJcbiAgICAgIG9zID0ge1xyXG4gICAgICAgICdhcmNoaXRlY3R1cmUnOiAzMixcclxuICAgICAgICAnZmFtaWx5JzogKGRhdGEgJiYgIWlzU3BlY2lhbENhc2VkT1MpID8gb3MucmVwbGFjZShkYXRhWzBdLCAnJykgOiBvcyxcclxuICAgICAgICAndmVyc2lvbic6IGRhdGEgPyBkYXRhWzFdIDogbnVsbCxcclxuICAgICAgICAndG9TdHJpbmcnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHZhciB2ZXJzaW9uID0gdGhpcy52ZXJzaW9uO1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmFtaWx5ICsgKCh2ZXJzaW9uICYmICFpc1NwZWNpYWxDYXNlZE9TKSA/ICcgJyArIHZlcnNpb24gOiAnJykgKyAodGhpcy5hcmNoaXRlY3R1cmUgPT0gNjQgPyAnIDY0LWJpdCcgOiAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgLy8gQWRkIGJyb3dzZXIvT1MgYXJjaGl0ZWN0dXJlLlxyXG4gICAgaWYgKChkYXRhID0gL1xcYig/OkFNRHxJQXxXaW58V09XfHg4Nl98eCk2NFxcYi9pLmV4ZWMoYXJjaCkpICYmICEvXFxiaTY4NlxcYi9pLnRlc3QoYXJjaCkpIHtcclxuICAgICAgaWYgKG9zKSB7XHJcbiAgICAgICAgb3MuYXJjaGl0ZWN0dXJlID0gNjQ7XHJcbiAgICAgICAgb3MuZmFtaWx5ID0gb3MuZmFtaWx5LnJlcGxhY2UoUmVnRXhwKCcgKicgKyBkYXRhKSwgJycpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChcclxuICAgICAgICAgIG5hbWUgJiYgKC9cXGJXT1c2NFxcYi9pLnRlc3QodWEpIHx8XHJcbiAgICAgICAgICAodXNlRmVhdHVyZXMgJiYgL1xcdyg/Ojg2fDMyKSQvLnRlc3QobmF2LmNwdUNsYXNzIHx8IG5hdi5wbGF0Zm9ybSkgJiYgIS9cXGJXaW42NDsgeDY0XFxiL2kudGVzdCh1YSkpKVxyXG4gICAgICApIHtcclxuICAgICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCczMi1iaXQnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gQ2hyb21lIDM5IGFuZCBhYm92ZSBvbiBPUyBYIGlzIGFsd2F5cyA2NC1iaXQuXHJcbiAgICBlbHNlIGlmIChcclxuICAgICAgICBvcyAmJiAvXk9TIFgvLnRlc3Qob3MuZmFtaWx5KSAmJlxyXG4gICAgICAgIG5hbWUgPT0gJ0Nocm9tZScgJiYgcGFyc2VGbG9hdCh2ZXJzaW9uKSA+PSAzOVxyXG4gICAgKSB7XHJcbiAgICAgIG9zLmFyY2hpdGVjdHVyZSA9IDY0O1xyXG4gICAgfVxyXG5cclxuICAgIHVhIHx8ICh1YSA9IG51bGwpO1xyXG5cclxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBwbGF0Zm9ybSBvYmplY3QuXHJcbiAgICAgKlxyXG4gICAgICogQG5hbWUgcGxhdGZvcm1cclxuICAgICAqIEB0eXBlIE9iamVjdFxyXG4gICAgICovXHJcbiAgICB2YXIgcGxhdGZvcm0gPSB7fTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBwbGF0Zm9ybSBkZXNjcmlwdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cclxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXHJcbiAgICAgKi9cclxuICAgIHBsYXRmb3JtLmRlc2NyaXB0aW9uID0gdWE7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYnJvd3NlcidzIGxheW91dCBlbmdpbmUuXHJcbiAgICAgKlxyXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXHJcbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxyXG4gICAgICovXHJcbiAgICBwbGF0Zm9ybS5sYXlvdXQgPSBsYXlvdXQgJiYgbGF5b3V0WzBdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHByb2R1Y3QncyBtYW51ZmFjdHVyZXIuXHJcbiAgICAgKlxyXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXHJcbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxyXG4gICAgICovXHJcbiAgICBwbGF0Zm9ybS5tYW51ZmFjdHVyZXIgPSBtYW51ZmFjdHVyZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYnJvd3Nlci9lbnZpcm9ubWVudC5cclxuICAgICAqXHJcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cclxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXHJcbiAgICAgKi9cclxuICAgIHBsYXRmb3JtLm5hbWUgPSBuYW1lO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGFscGhhL2JldGEgcmVsZWFzZSBpbmRpY2F0b3IuXHJcbiAgICAgKlxyXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXHJcbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxyXG4gICAgICovXHJcbiAgICBwbGF0Zm9ybS5wcmVyZWxlYXNlID0gcHJlcmVsZWFzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBwcm9kdWN0IGhvc3RpbmcgdGhlIGJyb3dzZXIuXHJcbiAgICAgKlxyXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXHJcbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxyXG4gICAgICovXHJcbiAgICBwbGF0Zm9ybS5wcm9kdWN0ID0gcHJvZHVjdDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBicm93c2VyJ3MgdXNlciBhZ2VudCBzdHJpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXHJcbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxyXG4gICAgICovXHJcbiAgICBwbGF0Zm9ybS51YSA9IHVhO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGJyb3dzZXIvZW52aXJvbm1lbnQgdmVyc2lvbi5cclxuICAgICAqXHJcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cclxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXHJcbiAgICAgKi9cclxuICAgIHBsYXRmb3JtLnZlcnNpb24gPSBuYW1lICYmIHZlcnNpb247XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgb3BlcmF0aW5nIHN5c3RlbS5cclxuICAgICAqXHJcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cclxuICAgICAqIEB0eXBlIE9iamVjdFxyXG4gICAgICovXHJcbiAgICBwbGF0Zm9ybS5vcyA9IG9zIHx8IHtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBUaGUgQ1BVIGFyY2hpdGVjdHVyZSB0aGUgT1MgaXMgYnVpbHQgZm9yLlxyXG4gICAgICAgKlxyXG4gICAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm0ub3NcclxuICAgICAgICogQHR5cGUgbnVtYmVyfG51bGxcclxuICAgICAgICovXHJcbiAgICAgICdhcmNoaXRlY3R1cmUnOiBudWxsLFxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIFRoZSBmYW1pbHkgb2YgdGhlIE9TLlxyXG4gICAgICAgKlxyXG4gICAgICAgKiBDb21tb24gdmFsdWVzIGluY2x1ZGU6XHJcbiAgICAgICAqIFwiV2luZG93c1wiLCBcIldpbmRvd3MgU2VydmVyIDIwMDggUjIgLyA3XCIsIFwiV2luZG93cyBTZXJ2ZXIgMjAwOCAvIFZpc3RhXCIsXHJcbiAgICAgICAqIFwiV2luZG93cyBYUFwiLCBcIk9TIFhcIiwgXCJVYnVudHVcIiwgXCJEZWJpYW5cIiwgXCJGZWRvcmFcIiwgXCJSZWQgSGF0XCIsIFwiU3VTRVwiLFxyXG4gICAgICAgKiBcIkFuZHJvaWRcIiwgXCJpT1NcIiBhbmQgXCJXaW5kb3dzIFBob25lXCJcclxuICAgICAgICpcclxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXHJcbiAgICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXHJcbiAgICAgICAqL1xyXG4gICAgICAnZmFtaWx5JzogbnVsbCxcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBUaGUgdmVyc2lvbiBvZiB0aGUgT1MuXHJcbiAgICAgICAqXHJcbiAgICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybS5vc1xyXG4gICAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxyXG4gICAgICAgKi9cclxuICAgICAgJ3ZlcnNpb24nOiBudWxsLFxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIFJldHVybnMgdGhlIE9TIHN0cmluZy5cclxuICAgICAgICpcclxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXHJcbiAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBPUyBzdHJpbmcuXHJcbiAgICAgICAqL1xyXG4gICAgICAndG9TdHJpbmcnOiBmdW5jdGlvbigpIHsgcmV0dXJuICdudWxsJzsgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwbGF0Zm9ybS5wYXJzZSA9IHBhcnNlO1xyXG4gICAgcGxhdGZvcm0udG9TdHJpbmcgPSB0b1N0cmluZ1BsYXRmb3JtO1xyXG5cclxuICAgIGlmIChwbGF0Zm9ybS52ZXJzaW9uKSB7XHJcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQodmVyc2lvbik7XHJcbiAgICB9XHJcbiAgICBpZiAocGxhdGZvcm0ubmFtZSkge1xyXG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KG5hbWUpO1xyXG4gICAgfVxyXG4gICAgaWYgKG9zICYmIG5hbWUgJiYgIShvcyA9PSBTdHJpbmcob3MpLnNwbGl0KCcgJylbMF0gJiYgKG9zID09IG5hbWUuc3BsaXQoJyAnKVswXSB8fCBwcm9kdWN0KSkpIHtcclxuICAgICAgZGVzY3JpcHRpb24ucHVzaChwcm9kdWN0ID8gJygnICsgb3MgKyAnKScgOiAnb24gJyArIG9zKTtcclxuICAgIH1cclxuICAgIGlmIChkZXNjcmlwdGlvbi5sZW5ndGgpIHtcclxuICAgICAgcGxhdGZvcm0uZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbi5qb2luKCcgJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGxhdGZvcm07XHJcbiAgfVxyXG5cclxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbiAgLy8gRXhwb3J0IHBsYXRmb3JtLlxyXG4gIHZhciBwbGF0Zm9ybSA9IHBhcnNlKCk7XHJcblxyXG4gIC8vIFNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMsIGxpa2Ugci5qcywgY2hlY2sgZm9yIGNvbmRpdGlvbiBwYXR0ZXJucyBsaWtlIHRoZSBmb2xsb3dpbmc6XHJcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICAvLyBFeHBvc2UgcGxhdGZvcm0gb24gdGhlIGdsb2JhbCBvYmplY3QgdG8gcHJldmVudCBlcnJvcnMgd2hlbiBwbGF0Zm9ybSBpc1xyXG4gICAgLy8gbG9hZGVkIGJ5IGEgc2NyaXB0IHRhZyBpbiB0aGUgcHJlc2VuY2Ugb2YgYW4gQU1EIGxvYWRlci5cclxuICAgIC8vIFNlZSBodHRwOi8vcmVxdWlyZWpzLm9yZy9kb2NzL2Vycm9ycy5odG1sI21pc21hdGNoIGZvciBtb3JlIGRldGFpbHMuXHJcbiAgICByb290LnBsYXRmb3JtID0gcGxhdGZvcm07XHJcblxyXG4gICAgLy8gRGVmaW5lIGFzIGFuIGFub255bW91cyBtb2R1bGUgc28gcGxhdGZvcm0gY2FuIGJlIGFsaWFzZWQgdGhyb3VnaCBwYXRoIG1hcHBpbmcuXHJcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBwbGF0Zm9ybTtcclxuICAgIH0pO1xyXG4gIH1cclxuICAvLyBDaGVjayBmb3IgYGV4cG9ydHNgIGFmdGVyIGBkZWZpbmVgIGluIGNhc2UgYSBidWlsZCBvcHRpbWl6ZXIgYWRkcyBhbiBgZXhwb3J0c2Agb2JqZWN0LlxyXG4gIGVsc2UgaWYgKGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUpIHtcclxuICAgIC8vIEV4cG9ydCBmb3IgQ29tbW9uSlMgc3VwcG9ydC5cclxuICAgIGZvck93bihwbGF0Zm9ybSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xyXG4gICAgICBmcmVlRXhwb3J0c1trZXldID0gdmFsdWU7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICAvLyBFeHBvcnQgdG8gdGhlIGdsb2JhbCBvYmplY3QuXHJcbiAgICByb290LnBsYXRmb3JtID0gcGxhdGZvcm07XHJcbiAgfVxyXG59LmNhbGwodGhpcykpO1xyXG4iXX0=
