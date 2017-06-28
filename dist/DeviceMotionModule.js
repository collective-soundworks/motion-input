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
      // clear timeout (anti-Firefox bug solution, window event deviceorientation being nver called)
      // set the set timeout in init() function
      clearTimeout(this._checkTimeoutId);

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
          // set fallback timeout for Firefox (its window never calling the DeviceOrientation event, a 
          // require of the DeviceOrientation service will result in the require promise never being resolved
          // hence the Experiment start() method never called)
          _this3._checkTimeoutId = setTimeout(function () {
            return resolve(_this3);
          }, 500);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRldmljZU1vdGlvbk1vZHVsZS5qcyJdLCJuYW1lcyI6WyJnZXRMb2NhbFRpbWUiLCJ3aW5kb3ciLCJwZXJmb3JtYW5jZSIsIm5vdyIsIkRhdGUiLCJEZXZpY2VNb3Rpb25Nb2R1bGUiLCJldmVudCIsImFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkiLCJhY2NlbGVyYXRpb24iLCJyb3RhdGlvblJhdGUiLCJyZXF1aXJlZCIsIl9wcm9taXNlUmVzb2x2ZSIsIl91bmlmeU1vdGlvbkRhdGEiLCJvcyIsImZhbWlseSIsIl91bmlmeVBlcmlvZCIsIl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uIiwiX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25UaW1lQ29uc3RhbnQiLCJfbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkiLCJfY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZSIsIl9sYXN0T3JpZW50YXRpb24iLCJfbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wIiwiX3Byb2Nlc3NGdW5jdGlvbiIsIl9wcm9jZXNzIiwiYmluZCIsIl9kZXZpY2Vtb3Rpb25DaGVjayIsIl9kZXZpY2Vtb3Rpb25MaXN0ZW5lciIsImUiLCJjbGVhclRpbWVvdXQiLCJfY2hlY2tUaW1lb3V0SWQiLCJpc1Byb3ZpZGVkIiwicGVyaW9kIiwiaW50ZXJ2YWwiLCJ4IiwieSIsInoiLCJhbHBoYSIsImJldGEiLCJnYW1tYSIsImlzQ2FsY3VsYXRlZCIsImxpc3RlbmVycyIsInNpemUiLCJfZW1pdERldmljZU1vdGlvbkV2ZW50IiwiaXNWYWxpZCIsIl9lbWl0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eUV2ZW50IiwiX2VtaXRBY2NlbGVyYXRpb25FdmVudCIsIl9lbWl0Um90YXRpb25SYXRlRXZlbnQiLCJvdXRFdmVudCIsImVtaXQiLCJrIiwiX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25EZWNheSIsIm9yaWVudGF0aW9uIiwiYWxwaGFJc1ZhbGlkIiwickFscGhhIiwickJldGEiLCJyR2FtbWEiLCJhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IiLCJiZXRhRGlzY29udGludWl0eUZhY3RvciIsImdhbW1hRGlzY29udGludWl0eUZhY3RvciIsImRlbHRhVCIsInJlcXVpcmVNb2R1bGUiLCJ0aGVuIiwiY29uc29sZSIsImxvZyIsImFkZExpc3RlbmVyIiwiX2NhbGN1bGF0ZVJvdGF0aW9uUmF0ZUZyb21PcmllbnRhdGlvbiIsImRhdGEiLCJyZXNvbHZlIiwiRGV2aWNlTW90aW9uRXZlbnQiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0VGltZW91dCIsIk1hdGgiLCJleHAiLCJQSSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7O0FBTUEsU0FBU0EsWUFBVCxHQUF3QjtBQUN0QixNQUFJQyxPQUFPQyxXQUFYLEVBQ0UsT0FBT0QsT0FBT0MsV0FBUCxDQUFtQkMsR0FBbkIsS0FBMkIsSUFBbEM7QUFDRixTQUFPQyxLQUFLRCxHQUFMLEtBQWEsSUFBcEI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFtQk1FLGtCOzs7QUFFSjs7Ozs7QUFLQSxnQ0FBYztBQUFBOztBQUdaOzs7Ozs7O0FBSFksd0lBQ04sY0FETTs7QUFVWixVQUFLQyxLQUFMLEdBQWEsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0IsSUFBL0IsRUFBcUMsSUFBckMsRUFBMkMsSUFBM0MsRUFBaUQsSUFBakQsQ0FBYjs7QUFFQTs7Ozs7OztBQU9BLFVBQUtDLDRCQUFMLEdBQW9DLHVDQUE0Qiw4QkFBNUIsQ0FBcEM7O0FBRUE7Ozs7Ozs7Ozs7QUFVQSxVQUFLQyxZQUFMLEdBQW9CLHVDQUE0QixjQUE1QixDQUFwQjs7QUFFQTs7Ozs7Ozs7OztBQVVBLFVBQUtDLFlBQUwsR0FBb0IsdUNBQTRCLGNBQTVCLENBQXBCOztBQUVBOzs7Ozs7Ozs7QUFTQSxVQUFLQyxRQUFMLEdBQWdCO0FB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QUNBOztBQW5CQSxhQXNCRUE7QUFDSCxPQTFCRDtBQTJCRDs7O3dCQXZWa0M7QUFDakMsYUFBT0ksS0FBS0MsR0FBTCxDQUFTLENBQUMsQ0FBRCxHQUFLRCxLQUFLRSxFQUFWLEdBQWUsS0FBS2xFLDRCQUFMLENBQWtDd0IsTUFBakQsR0FBMEQsS0FBS2QsbUNBQXhFLENBQVA7QUFDRDs7Ozs7O2tCQXdWWSxJQUFJWixrQkFBSixFIiwiZmlsZSI6IkRldmljZU1vdGlvbk1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJbnB1dE1vZHVsZSBmcm9tICcuL0lucHV0TW9kdWxlJztcbmltcG9ydCBET01FdmVudFN1Ym1vZHVsZSBmcm9tICcuL0RPTUV2ZW50U3VibW9kdWxlJztcbmltcG9ydCBNb3Rpb25JbnB1dCBmcm9tICcuL01vdGlvbklucHV0JztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICdwbGF0Zm9ybSc7XG5cbi8qKlxuICogR2V0cyB0aGUgY3VycmVudCBsb2NhbCB0aW1lIGluIHNlY29uZHMuXG4gKiBVc2VzIGB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClgIGlmIGF2YWlsYWJsZSwgYW5kIGBEYXRlLm5vdygpYCBvdGhlcndpc2UuXG4gKlxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBnZXRMb2NhbFRpbWUoKSB7XG4gIGlmICh3aW5kb3cucGVyZm9ybWFuY2UpXG4gICAgcmV0dXJuIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAvIDEwMDA7XG4gIHJldHVybiBEYXRlLm5vdygpIC8gMTAwMDtcbn1cblxuLyoqXG4gKiBgRGV2aWNlTW90aW9uYCBtb2R1bGUgc2luZ2xldG9uLlxuICogVGhlIGBEZXZpY2VNb3Rpb25Nb2R1bGVgIHNpbmdsZXRvbiBwcm92aWRlcyB0aGUgcmF3IHZhbHVlc1xuICogb2YgdGhlIGFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eSwgYWNjZWxlcmF0aW9uLCBhbmQgcm90YXRpb25cbiAqIHJhdGUgcHJvdmlkZWQgYnkgdGhlIGBEZXZpY2VNb3Rpb25gIGV2ZW50LlxuICogSXQgYWxzbyBpbnN0YW50aWF0ZSB0aGUgYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLFxuICogYEFjY2VsZXJhdGlvbmAgYW5kIGBSb3RhdGlvblJhdGVgIHN1Ym1vZHVsZXMgdGhhdCB1bmlmeSB0aG9zZSB2YWx1ZXNcbiAqIGFjcm9zcyBwbGF0Zm9ybXMgYnkgbWFraW5nIHRoZW0gY29tcGxpYW50IHdpdGgge0BsaW5rXG4gKiBodHRwOi8vd3d3LnczLm9yZy9UUi9vcmllbnRhdGlvbi1ldmVudC98dGhlIFczQyBzdGFuZGFyZH0uXG4gKiBXaGVuIHJhdyB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSB0aGUgc2Vuc29ycywgdGhpcyBtb2R1bGVzIHRyaWVzXG4gKiB0byByZWNhbGN1bGF0ZSB0aGVtIGZyb20gYXZhaWxhYmxlIHZhbHVlczpcbiAqIC0gYGFjY2VsZXJhdGlvbmAgaXMgY2FsY3VsYXRlZCBmcm9tIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YFxuICogICB3aXRoIGEgaGlnaC1wYXNzIGZpbHRlcjtcbiAqIC0gKGNvbWluZyBzb29uIOKAlCB3YWl0aW5nIGZvciBhIGJ1ZyBvbiBDaHJvbWUgdG8gYmUgcmVzb2x2ZWQpXG4gKiAgIGByb3RhdGlvblJhdGVgIGlzIGNhbGN1bGF0ZWQgZnJvbSBgb3JpZW50YXRpb25gLlxuICpcbiAqIEBjbGFzcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAqIEBleHRlbmRzIElucHV0TW9kdWxlXG4gKi9cbmNsYXNzIERldmljZU1vdGlvbk1vZHVsZSBleHRlbmRzIElucHV0TW9kdWxlIHtcblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgYERldmljZU1vdGlvbmAgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCdkZXZpY2Vtb3Rpb24nKTtcblxuICAgIC8qKlxuICAgICAqIFJhdyB2YWx1ZXMgY29taW5nIGZyb20gdGhlIGBkZXZpY2Vtb3Rpb25gIGV2ZW50IHNlbnQgYnkgdGhpcyBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgW251bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGxdXG4gICAgICovXG4gICAgdGhpcy5ldmVudCA9IFtudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgbW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIHVuaWZpZWQgdmFsdWVzIG9mIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ID0gbmV3IERPTUV2ZW50U3VibW9kdWxlKHRoaXMsICdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Jyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYEFjY2VsZXJhdGlvbmAgc3VibW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIHVuaWZpZWQgdmFsdWVzIG9mIHRoZSBhY2NlbGVyYXRpb24uXG4gICAgICogRXN0aW1hdGVzIHRoZSBhY2NlbGVyYXRpb24gdmFsdWVzIGZyb20gYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgXG4gICAgICogcmF3IHZhbHVlcyBpZiB0aGUgYWNjZWxlcmF0aW9uIHJhdyB2YWx1ZXMgYXJlIG5vdCBhdmFpbGFibGUgb24gdGhlXG4gICAgICogZGV2aWNlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uID0gbmV3IERPTUV2ZW50U3VibW9kdWxlKHRoaXMsICdhY2NlbGVyYXRpb24nKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgUm90YXRpb25SYXRlYCBzdWJtb2R1bGUuXG4gICAgICogUHJvdmlkZXMgdW5pZmllZCB2YWx1ZXMgb2YgdGhlIHJvdGF0aW9uIHJhdGUuXG4gICAgICogKGNvbWluZyBzb29uLCB3YWl0aW5nIGZvciBhIGJ1ZyBvbiBDaHJvbWUgdG8gYmUgcmVzb2x2ZWQpXG4gICAgICogRXN0aW1hdGVzIHRoZSByb3RhdGlvbiByYXRlIHZhbHVlcyBmcm9tIGBvcmllbnRhdGlvbmAgdmFsdWVzIGlmXG4gICAgICogdGhlIHJvdGF0aW9uIHJhdGUgcmF3IHZhbHVlcyBhcmUgbm90IGF2YWlsYWJsZSBvbiB0aGUgZGV2aWNlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIHRoaXMucm90YXRpb25SYXRlID0gbmV3IERPTUV2ZW50U3VibW9kdWxlKHRoaXMsICdyb3RhdGlvblJhdGUnKTtcblxuICAgIC8qKlxuICAgICAqIFJlcXVpcmVkIHN1Ym1vZHVsZXMgLyBldmVudHMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICogQHByb3BlcnR5IHtib29sfSBhY2NlbGVyYXRpb24gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYGFjY2VsZXJhdGlvbmAgdW5pZmllZCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICogQHByb3BlcnR5IHtib29sfSByb3RhdGlvblJhdGUgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYHJvdGF0aW9uUmF0ZWAgdW5pZmllZCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICovXG4gICAgdGhpcy5yZXF1aXJlZCA9IHtcbiAgICAgIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHk6IGZhbHNlLFxuICAgICAgYWNjZWxlcmF0aW9uOiBmYWxzZSxcbiAgICAgIHJvdGF0aW9uUmF0ZTogZmFsc2VcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZSBmdW5jdGlvbiBvZiB0aGUgbW9kdWxlJ3MgcHJvbWlzZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICogQHNlZSBEZXZpY2VNb3Rpb25Nb2R1bGUjaW5pdFxuICAgICAqL1xuICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFVuaWZ5aW5nIGZhY3RvciBvZiB0aGUgbW90aW9uIGRhdGEgdmFsdWVzIChgMWAgb24gQW5kcm9pZCwgYC0xYCBvbiBpT1MpLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLl91bmlmeU1vdGlvbkRhdGEgPSAocGxhdGZvcm0ub3MuZmFtaWx5ID09PSAnaU9TJyA/IC0xIDogMSk7XG5cbiAgICAvKipcbiAgICAgKiBVbmlmeWluZyBmYWN0b3Igb2YgdGhlIHBlcmlvZCAoYDAuMDAxYCBvbiBBbmRyb2lkLCBgMWAgb24gaU9TKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5fdW5pZnlQZXJpb2QgPSAocGxhdGZvcm0ub3MuZmFtaWx5ID09PSAnQW5kcm9pZCcgPyAwLjAwMSA6IDEpO1xuXG4gICAgLyoqXG4gICAgICogQWNjZWxlcmF0aW9uIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHJhdyB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvbiA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIFRpbWUgY29uc3RhbnQgKGhhbGYtbGlmZSkgb2YgdGhlIGhpZ2gtcGFzcyBmaWx0ZXIgdXNlZCB0byBzbW9vdGggdGhlIGFjY2VsZXJhdGlvbiB2YWx1ZXMgY2FsY3VsYXRlZCBmcm9tIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHkgcmF3IHZhbHVlcyAoaW4gc2Vjb25kcykuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDAuMVxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25UaW1lQ29uc3RhbnQgPSAwLjE7XG5cbiAgICAvKipcbiAgICAgKiBMYXRlc3QgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHJhdyB2YWx1ZSwgdXNlZCBpbiB0aGUgaGlnaC1wYXNzIGZpbHRlciB0byBjYWxjdWxhdGUgdGhlIGFjY2VsZXJhdGlvbiAoaWYgdGhlIGBhY2NlbGVyYXRpb25gIHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IGAnZGV2aWNlbW90aW9uJ2ApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogUm90YXRpb24gcmF0ZSBjYWxjdWxhdGVkIGZyb20gdGhlIG9yaWVudGF0aW9uIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IG9yaWVudGF0aW9uIHZhbHVlLCB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgcm90YXRpb24gcmF0ZSAgKGlmIHRoZSBgcm90YXRpb25SYXRlYCB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSBgJ2RldmljZW1vdGlvbidgKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb24gPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBMYXRlc3Qgb3JpZW50YXRpb24gdGltZXN0YW1wcywgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHJvdGF0aW9uIHJhdGUgKGlmIHRoZSBgcm90YXRpb25SYXRlYCB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSBgJ2RldmljZW1vdGlvbidgKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXAgPSBudWxsO1xuXG4gICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uID0gbnVsbDtcbiAgICB0aGlzLl9wcm9jZXNzID0gdGhpcy5fcHJvY2Vzcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2RldmljZW1vdGlvbkNoZWNrID0gdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLl9kZXZpY2Vtb3Rpb25MaXN0ZW5lciA9IHRoaXMuX2RldmljZW1vdGlvbkxpc3RlbmVyLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogRGVjYXkgZmFjdG9yIG9mIHRoZSBoaWdoLXBhc3MgZmlsdGVyIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBhY2NlbGVyYXRpb24gZnJvbSB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHJhdyB2YWx1ZXMuXG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IF9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uRGVjYXkoKSB7XG4gICAgcmV0dXJuIE1hdGguZXhwKC0yICogTWF0aC5QSSAqIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5wZXJpb2QgLyB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uVGltZUNvbnN0YW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5zb3IgY2hlY2sgb24gaW5pdGlhbGl6YXRpb24gb2YgdGhlIG1vZHVsZS5cbiAgICogVGhpcyBtZXRob2Q6XG4gICAqIC0gY2hlY2tzIHdoZXRoZXIgdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCwgdGhlIGBhY2NlbGVyYXRpb25gLFxuICAgKiAgIGFuZCB0aGUgYHJvdGF0aW9uUmF0ZWAgdmFsdWVzIGFyZSB2YWxpZCBvciBub3Q7XG4gICAqIC0gZ2V0cyB0aGUgcGVyaW9kIG9mIHRoZSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGFuZCBzZXRzIHRoZSBwZXJpb2Qgb2ZcbiAgICogICB0aGUgYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCBgQWNjZWxlcmF0aW9uYCwgYW5kIGBSb3RhdGlvblJhdGVgXG4gICAqICAgc3VibW9kdWxlcztcbiAgICogLSAoaW4gdGhlIGNhc2Ugd2hlcmUgYWNjZWxlcmF0aW9uIHJhdyB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZClcbiAgICogICBpbmRpY2F0ZXMgd2hldGhlciB0aGUgYWNjZWxlcmF0aW9uIGNhbiBiZSBjYWxjdWxhdGVkIGZyb20gdGhlXG4gICAqICAgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIFRoZSBmaXJzdCBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGNhdWdodC5cbiAgICovXG4gIF9kZXZpY2Vtb3Rpb25DaGVjayhlKSB7XG4gICAgLy8gY2xlYXIgdGltZW91dCAoYW50aS1GaXJlZm94IGJ1ZyBzb2x1dGlvbiwgd2luZG93IGV2ZW50IGRldmljZW9yaWVudGF0aW9uIGJlaW5nIG52ZXIgY2FsbGVkKVxuICAgIC8vIHNldCB0aGUgc2V0IHRpbWVvdXQgaW4gaW5pdCgpIGZ1bmN0aW9uXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2NoZWNrVGltZW91dElkKTtcblxuICAgIHRoaXMuaXNQcm92aWRlZCA9IHRydWU7XG4gICAgdGhpcy5wZXJpb2QgPSBlLmludGVydmFsIC8gMTAwMDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHlcbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNQcm92aWRlZCA9IChcbiAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogPT09ICdudW1iZXInKVxuICAgICk7XG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSBhY2NlbGVyYXRpb25cbiAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkID0gKFxuICAgICAgZS5hY2NlbGVyYXRpb24gJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb24ueCA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uLnkgPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbi56ID09PSAnbnVtYmVyJylcbiAgICApO1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uLnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSByb3RhdGlvbiByYXRlXG4gICAgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZCA9IChcbiAgICAgIGUucm90YXRpb25SYXRlICYmXG4gICAgICAodHlwZW9mIGUucm90YXRpb25SYXRlLmFscGhhID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5yb3RhdGlvblJhdGUuYmV0YSA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUucm90YXRpb25SYXRlLmdhbW1hID09PSAnbnVtYmVyJylcbiAgICApO1xuICAgIHRoaXMucm90YXRpb25SYXRlLnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIG5vdyB0aGF0IHRoZSBzZW5zb3JzIGFyZSBjaGFja2VkIHJlcGxhY2UgdGhlIHByb2Nlc3MgZnVuY3Rpb24gd2l0aCB0aGVcbiAgICAvLyBwcm9wZXIgbGlzdGVuZXJcbiAgICB0aGlzLl9wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLl9kZXZpY2Vtb3Rpb25MaXN0ZW5lcjtcblxuICAgIC8vIElmIGFjY2VsZXJhdGlvbiBpcyBub3QgcHJvdmlkZWQgYnkgcmF3IHNlbnNvcnMsIGluZGljYXRlIHdoZXRoZXIgaXRcbiAgICAvLyBjYW4gYmUgY2FsY3VsYXRlZCB3aXRoIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCBvciBub3RcbiAgICBpZiAoIXRoaXMuYWNjZWxlcmF0aW9uLmlzUHJvdmlkZWQpXG4gICAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc0NhbGN1bGF0ZWQgPSB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNQcm92aWRlZDtcblxuICAgIC8vIFdBUk5JTkdcbiAgICAvLyBUaGUgbGluZXMgb2YgY29kZSBiZWxvdyBhcmUgY29tbWVudGVkIGJlY2F1c2Ugb2YgYSBidWcgb2YgQ2hyb21lXG4gICAgLy8gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHdoZXJlICdkZXZpY2Vtb3Rpb24nIGV2ZW50cyBhcmUgbm90IHNlbnRcbiAgICAvLyBvciBjYXVnaHQgaWYgdGhlIGxpc3RlbmVyIGlzIHNldCB1cCBhZnRlciBhICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAvLyBsaXN0ZW5lci4gSGVyZSwgdGhlIF90cnlPcmllbnRhdGlvbkZhbGxiYWNrIG1ldGhvZCB3b3VsZCBhZGQgYVxuICAgIC8vICdkZXZpY2VvcmllbnRhdGlvbicgbGlzdGVuZXIgYW5kIGJsb2NrIGFsbCBzdWJzZXF1ZW50ICdkZXZpY2Vtb3Rpb24nXG4gICAgLy8gZXZlbnRzIG9uIHRoZXNlIGRldmljZXMuIENvbW1lbnRzIHdpbGwgYmUgcmVtb3ZlZCBvbmNlIHRoZSBidWcgb2ZcbiAgICAvLyBDaHJvbWUgaXMgY29ycmVjdGVkLlxuXG4gICAgLy8gaWYgKHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlICYmICF0aGlzLnJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkKVxuICAgIC8vICAgdGhpcy5fdHJ5T3JpZW50YXRpb25GYWxsYmFjaygpO1xuICAgIC8vIGVsc2VcbiAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGNhbGxiYWNrLlxuICAgKiBUaGlzIG1ldGhvZCBlbWl0cyBhbiBldmVudCB3aXRoIHRoZSByYXcgYCdkZXZpY2Vtb3Rpb24nYCB2YWx1ZXMsIGFuZCBlbWl0c1xuICAgKiBldmVudHMgd2l0aCB0aGUgdW5pZmllZCBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIGBhY2NlbGVyYXRpb25gLFxuICAgKiBhbmQgLyBvciBgcm90YXRpb25SYXRlYCB2YWx1ZXMgaWYgdGhleSBhcmUgcmVxdWlyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICovXG4gIF9kZXZpY2Vtb3Rpb25MaXN0ZW5lcihlKSB7XG4gICAgLy8gJ2RldmljZW1vdGlvbicgZXZlbnQgKHJhdyB2YWx1ZXMpXG4gICAgaWYgKHRoaXMubGlzdGVuZXJzLnNpemUgPiAwKVxuICAgICAgdGhpcy5fZW1pdERldmljZU1vdGlvbkV2ZW50KGUpO1xuXG4gICAgLy8gJ2FjY2VsZXJhdGlvbicgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIGlmICh0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkubGlzdGVuZXJzLnNpemUgPiAwICYmXG4gICAgICAgIHRoaXMucmVxdWlyZWQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAmJlxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZFxuICAgICkge1xuICAgICAgdGhpcy5fZW1pdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlFdmVudChlKTtcbiAgICB9XG5cbiAgICAvLyAnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIC8vIHRoZSBmYWxsYmFjayBjYWxjdWxhdGlvbiBvZiB0aGUgYWNjZWxlcmF0aW9uIGhhcHBlbnMgaW4gdGhlXG4gICAgLy8gIGBfZW1pdEFjY2VsZXJhdGlvbmAgbWV0aG9kLCBzbyB3ZSBjaGVjayBpZiB0aGlzLmFjY2VsZXJhdGlvbi5pc1ZhbGlkXG4gICAgaWYgKHRoaXMuYWNjZWxlcmF0aW9uLmxpc3RlbmVycy5zaXplID4gMCAmJlxuICAgICAgICB0aGlzLnJlcXVpcmVkLmFjY2VsZXJhdGlvbiAmJlxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc1ZhbGlkXG4gICAgKSB7XG4gICAgICB0aGlzLl9lbWl0QWNjZWxlcmF0aW9uRXZlbnQoZSk7XG4gICAgfVxuXG4gICAgLy8gJ3JvdGF0aW9uUmF0ZScgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIC8vIHRoZSBmYWxsYmFjayBjYWxjdWxhdGlvbiBvZiB0aGUgcm90YXRpb24gcmF0ZSBkb2VzIE5PVCBoYXBwZW4gaW4gdGhlXG4gICAgLy8gYF9lbWl0Um90YXRpb25SYXRlYCBtZXRob2QsIHNvIHdlIG9ubHkgY2hlY2sgaWYgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZFxuICAgIGlmICh0aGlzLnJvdGF0aW9uUmF0ZS5saXN0ZW5lcnMuc2l6ZSA+IDAgJiZcbiAgICAgICAgdGhpcy5yZXF1aXJlZC5yb3RhdGlvblJhdGUgJiZcbiAgICAgICAgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZFxuICAgICkge1xuICAgICAgdGhpcy5fZW1pdFJvdGF0aW9uUmF0ZUV2ZW50KGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYCdkZXZpY2Vtb3Rpb24nYCByYXcgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZW1pdERldmljZU1vdGlvbkV2ZW50KGUpIHtcbiAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLmV2ZW50O1xuXG4gICAgaWYgKGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSkge1xuICAgICAgb3V0RXZlbnRbMF0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueDtcbiAgICAgIG91dEV2ZW50WzFdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lnk7XG4gICAgICBvdXRFdmVudFsyXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56O1xuICAgIH1cblxuICAgIGlmIChlLmFjY2VsZXJhdGlvbikge1xuICAgICAgb3V0RXZlbnRbM10gPSBlLmFjY2VsZXJhdGlvbi54O1xuICAgICAgb3V0RXZlbnRbNF0gPSBlLmFjY2VsZXJhdGlvbi55O1xuICAgICAgb3V0RXZlbnRbNV0gPSBlLmFjY2VsZXJhdGlvbi56O1xuICAgIH1cblxuICAgIGlmIChlLnJvdGF0aW9uUmF0ZSkge1xuICAgICAgb3V0RXZlbnRbNl0gPSBlLnJvdGF0aW9uUmF0ZS5hbHBoYTtcbiAgICAgIG91dEV2ZW50WzddID0gZS5yb3RhdGlvblJhdGUuYmV0YTtcbiAgICAgIG91dEV2ZW50WzhdID0gZS5yb3RhdGlvblJhdGUuZ2FtbWE7XG4gICAgfVxuXG4gICAgdGhpcy5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZW1pdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlFdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmV2ZW50O1xuXG4gICAgb3V0RXZlbnRbMF0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICBvdXRFdmVudFsxXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuICAgIG91dEV2ZW50WzJdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG5cbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuZW1pdChvdXRFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIGBhY2NlbGVyYXRpb25gIHVuaWZpZWQgdmFsdWVzLlxuICAgKiBXaGVuIHRoZSBgYWNjZWxlcmF0aW9uYCByYXcgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlLCB0aGUgbWV0aG9kXG4gICAqIGFsc28gY2FsY3VsYXRlcyB0aGUgYWNjZWxlcmF0aW9uIGZyb20gdGhlXG4gICAqIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gVGhlIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQuXG4gICAqL1xuICBfZW1pdEFjY2VsZXJhdGlvbkV2ZW50KGUpIHtcbiAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLmFjY2VsZXJhdGlvbi5ldmVudDtcblxuICAgIGlmICh0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkKSB7XG4gICAgICAvLyBJZiByYXcgYWNjZWxlcmF0aW9uIHZhbHVlcyBhcmUgcHJvdmlkZWRcbiAgICAgIG91dEV2ZW50WzBdID0gZS5hY2NlbGVyYXRpb24ueCAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICAgIG91dEV2ZW50WzFdID0gZS5hY2NlbGVyYXRpb24ueSAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICAgIG91dEV2ZW50WzJdID0gZS5hY2NlbGVyYXRpb24ueiAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1ZhbGlkKSB7XG4gICAgICAvLyBPdGhlcndpc2UsIGlmIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgdmFsdWVzIGFyZSBwcm92aWRlZCxcbiAgICAgIC8vIGVzdGltYXRlIHRoZSBhY2NlbGVyYXRpb24gd2l0aCBhIGhpZ2gtcGFzcyBmaWx0ZXJcbiAgICAgIGNvbnN0IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBbXG4gICAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhLFxuICAgICAgICBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueSAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YSxcbiAgICAgICAgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogKiB0aGlzLl91bmlmeU1vdGlvbkRhdGFcbiAgICAgIF07XG4gICAgICBjb25zdCBrID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvbkRlY2F5O1xuXG4gICAgICAvLyBIaWdoLXBhc3MgZmlsdGVyIHRvIGVzdGltYXRlIHRoZSBhY2NlbGVyYXRpb24gKHdpdGhvdXQgdGhlIGdyYXZpdHkpXG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzBdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMF07XG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzFdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMV07XG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzJdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMl07XG5cbiAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXTtcbiAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXTtcbiAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXTtcblxuICAgICAgb3V0RXZlbnRbMF0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzBdO1xuICAgICAgb3V0RXZlbnRbMV0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzFdO1xuICAgICAgb3V0RXZlbnRbMl0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzJdO1xuICAgIH1cblxuICAgIHRoaXMuYWNjZWxlcmF0aW9uLmVtaXQob3V0RXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBgcm90YXRpb25SYXRlYCB1bmlmaWVkIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2VtaXRSb3RhdGlvblJhdGVFdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5yb3RhdGlvblJhdGUuZXZlbnQ7XG5cbiAgICBvdXRFdmVudFswXSA9IGUucm90YXRpb25SYXRlLmFscGhhO1xuICAgIG91dEV2ZW50WzFdID0gZS5yb3RhdGlvblJhdGUuYmV0YTtcbiAgICBvdXRFdmVudFsyXSA9IGUucm90YXRpb25SYXRlLmdhbW1hO1xuXG4gICAgLy8gVE9ETyg/KTogdW5pZnlcblxuICAgIHRoaXMucm90YXRpb25SYXRlLmVtaXQob3V0RXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgYW5kIGVtaXRzIHRoZSBgcm90YXRpb25SYXRlYCB1bmlmaWVkIHZhbHVlcyBmcm9tIHRoZSBgb3JpZW50YXRpb25gIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJbXX0gb3JpZW50YXRpb24gLSBMYXRlc3QgYG9yaWVudGF0aW9uYCByYXcgdmFsdWVzLlxuICAgKi9cbiAgX2NhbGN1bGF0ZVJvdGF0aW9uUmF0ZUZyb21PcmllbnRhdGlvbihvcmllbnRhdGlvbikge1xuICAgIGNvbnN0IG5vdyA9IGdldExvY2FsVGltZSgpO1xuICAgIGNvbnN0IGsgPSAwLjg7IC8vIFRPRE86IGltcHJvdmUgbG93IHBhc3MgZmlsdGVyIChmcmFtZXMgYXJlIG5vdCByZWd1bGFyKVxuICAgIGNvbnN0IGFscGhhSXNWYWxpZCA9ICh0eXBlb2Ygb3JpZW50YXRpb25bMF0gPT09ICdudW1iZXInKTtcblxuICAgIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXApIHtcbiAgICAgIGxldCByQWxwaGEgPSBudWxsO1xuICAgICAgbGV0IHJCZXRhO1xuICAgICAgbGV0IHJHYW1tYTtcblxuICAgICAgbGV0IGFscGhhRGlzY29udGludWl0eUZhY3RvciA9IDA7XG4gICAgICBsZXQgYmV0YURpc2NvbnRpbnVpdHlGYWN0b3IgPSAwO1xuICAgICAgbGV0IGdhbW1hRGlzY29udGludWl0eUZhY3RvciA9IDA7XG5cbiAgICAgIGNvbnN0IGRlbHRhVCA9IG5vdyAtIHRoaXMuX2xhc3RPcmllbnRhdGlvblRpbWVzdGFtcDtcblxuICAgICAgaWYgKGFscGhhSXNWYWxpZCkge1xuICAgICAgICAvLyBhbHBoYSBkaXNjb250aW51aXR5ICgrMzYwIC0+IDAgb3IgMCAtPiArMzYwKVxuICAgICAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdID4gMzIwICYmIG9yaWVudGF0aW9uWzBdIDwgNDApXG4gICAgICAgICAgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yID0gMzYwO1xuICAgICAgICBlbHNlIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMF0gPCA0MCAmJiBvcmllbnRhdGlvblswXSA+IDMyMClcbiAgICAgICAgICBhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAtMzYwO1xuICAgICAgfVxuXG4gICAgICAvLyBiZXRhIGRpc2NvbnRpbnVpdHkgKCsxODAgLT4gLTE4MCBvciAtMTgwIC0+ICsxODApXG4gICAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzFdID4gMTQwICYmIG9yaWVudGF0aW9uWzFdIDwgLTE0MClcbiAgICAgICAgYmV0YURpc2NvbnRpbnVpdHlGYWN0b3IgPSAzNjA7XG4gICAgICBlbHNlIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMV0gPCAtMTQwICYmIG9yaWVudGF0aW9uWzFdID4gMTQwKVxuICAgICAgICBiZXRhRGlzY29udGludWl0eUZhY3RvciA9IC0zNjA7XG5cbiAgICAgIC8vIGdhbW1hIGRpc2NvbnRpbnVpdGllcyAoKzE4MCAtPiAtMTgwIG9yIC0xODAgLT4gKzE4MClcbiAgICAgIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMl0gPiA1MCAmJiBvcmllbnRhdGlvblsyXSA8IC01MClcbiAgICAgICAgZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yID0gMTgwO1xuICAgICAgZWxzZSBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdIDwgLTUwICYmIG9yaWVudGF0aW9uWzJdID4gNTApXG4gICAgICAgIGdhbW1hRGlzY29udGludWl0eUZhY3RvciA9IC0xODA7XG5cbiAgICAgIGlmIChkZWx0YVQgPiAwKSB7XG4gICAgICAgIC8vIExvdyBwYXNzIGZpbHRlciB0byBzbW9vdGggdGhlIGRhdGFcbiAgICAgICAgaWYgKGFscGhhSXNWYWxpZClcbiAgICAgICAgICByQWxwaGEgPSBrICogdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVswXSArICgxIC0gaykgKiAob3JpZW50YXRpb25bMF0gLSB0aGlzLl9sYXN0T3JpZW50YXRpb25bMF0gKyBhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IpIC8gZGVsdGFUO1xuICAgICAgICByQmV0YSA9IGsgKiB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzFdICsgKDEgLSBrKSAqIChvcmllbnRhdGlvblsxXSAtIHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSArIGJldGFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcbiAgICAgICAgckdhbW1hID0gayAqIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMl0gKyAoMSAtIGspICogKG9yaWVudGF0aW9uWzJdIC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdICsgZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcblxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzBdID0gckFscGhhO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzFdID0gckJldGE7XG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMl0gPSByR2FtbWE7XG4gICAgICB9XG5cbiAgICAgIC8vIFRPRE86IHJlc2FtcGxlIHRoZSBlbWlzc2lvbiByYXRlIHRvIG1hdGNoIHRoZSBkZXZpY2Vtb3Rpb24gcmF0ZVxuICAgICAgdGhpcy5yb3RhdGlvblJhdGUuZW1pdCh0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlKTtcbiAgICB9XG5cbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXAgPSBub3c7XG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdID0gb3JpZW50YXRpb25bMF07XG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzFdID0gb3JpZW50YXRpb25bMV07XG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdID0gb3JpZW50YXRpb25bMl07XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHJvdGF0aW9uIHJhdGUgY2FuIGJlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYG9yaWVudGF0aW9uYCB2YWx1ZXMgb3Igbm90LlxuICAgKi9cbiAgX3RyeU9yaWVudGF0aW9uRmFsbGJhY2soKSB7XG4gICAgTW90aW9uSW5wdXQucmVxdWlyZU1vZHVsZSgnb3JpZW50YXRpb24nKVxuICAgICAgLnRoZW4oKG9yaWVudGF0aW9uKSA9PiB7XG4gICAgICAgIGlmIChvcmllbnRhdGlvbi5pc1ZhbGlkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJXQVJOSU5HIChtb3Rpb24taW5wdXQpOiBUaGUgJ2RldmljZW1vdGlvbicgZXZlbnQgZG9lcyBub3QgZXhpc3RzIG9yIGRvZXMgbm90IHByb3ZpZGUgcm90YXRpb24gcmF0ZSB2YWx1ZXMgaW4geW91ciBicm93c2VyLCBzbyB0aGUgcm90YXRpb24gcmF0ZSBvZiB0aGUgZGV2aWNlIGlzIGVzdGltYXRlZCBmcm9tIHRoZSAnb3JpZW50YXRpb24nLCBjYWxjdWxhdGVkIGZyb20gdGhlICdkZXZpY2VvcmllbnRhdGlvbicgZXZlbnQuIFNpbmNlIHRoZSBjb21wYXNzIG1pZ2h0IG5vdCBiZSBhdmFpbGFibGUsIG9ubHkgYGJldGFgIGFuZCBgZ2FtbWFgIGFuZ2xlcyBtYXkgYmUgcHJvdmlkZWQgKGBhbHBoYWAgd291bGQgYmUgbnVsbCkuXCIpO1xuXG4gICAgICAgICAgdGhpcy5yb3RhdGlvblJhdGUuaXNDYWxjdWxhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgIE1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdvcmllbnRhdGlvbicsIChvcmllbnRhdGlvbikgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlUm90YXRpb25SYXRlRnJvbU9yaWVudGF0aW9uKG9yaWVudGF0aW9uKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlKHRoaXMpO1xuICAgICAgfSk7XG4gIH1cblxuICBfcHJvY2VzcyhkYXRhKSB7XG4gICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uKGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIG9mIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEByZXR1cm4ge3Byb21pc2V9XG4gICAqL1xuICBpbml0KCkge1xuICAgIHJldHVybiBzdXBlci5pbml0KChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSA9IHJlc29sdmU7XG5cbiAgICAgIGlmICh3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQpIHtcbiAgICAgICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2s7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCB0aGlzLl9wcm9jZXNzKTtcbiAgICAgICAgLy8gc2V0IGZhbGxiYWNrIHRpbWVvdXQgZm9yIEZpcmVmb3ggKGl0cyB3aW5kb3cgbmV2ZXIgY2FsbGluZyB0aGUgRGV2aWNlT3JpZW50YXRpb24gZXZlbnQsIGEgXG4gICAgICAgIC8vIHJlcXVpcmUgb2YgdGhlIERldmljZU9yaWVudGF0aW9uIHNlcnZpY2Ugd2lsbCByZXN1bHQgaW4gdGhlIHJlcXVpcmUgcHJvbWlzZSBuZXZlciBiZWluZyByZXNvbHZlZFxuICAgICAgICAvLyBoZW5jZSB0aGUgRXhwZXJpbWVudCBzdGFydCgpIG1ldGhvZCBuZXZlciBjYWxsZWQpXG4gICAgICAgIHRoaXMuX2NoZWNrVGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiByZXNvbHZlKHRoaXMpLCA1MDApOyAgICAgICAgXG4gICAgICB9XG5cbiAgICAgIC8vIFdBUk5JTkdcbiAgICAgIC8vIFRoZSBsaW5lcyBvZiBjb2RlIGJlbG93IGFyZSBjb21tZW50ZWQgYmVjYXVzZSBvZiBhIGJ1ZyBvZiBDaHJvbWVcbiAgICAgIC8vIG9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzLCB3aGVyZSAnZGV2aWNlbW90aW9uJyBldmVudHMgYXJlIG5vdCBzZW50XG4gICAgICAvLyBvciBjYXVnaHQgaWYgdGhlIGxpc3RlbmVyIGlzIHNldCB1cCBhZnRlciBhICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAgIC8vIGxpc3RlbmVyLiBIZXJlLCB0aGUgX3RyeU9yaWVudGF0aW9uRmFsbGJhY2sgbWV0aG9kIHdvdWxkIGFkZCBhXG4gICAgICAvLyAnZGV2aWNlb3JpZW50YXRpb24nIGxpc3RlbmVyIGFuZCBibG9jayBhbGwgc3Vic2VxdWVudCAnZGV2aWNlbW90aW9uJ1xuICAgICAgLy8gZXZlbnRzIG9uIHRoZXNlIGRldmljZXMuIENvbW1lbnRzIHdpbGwgYmUgcmVtb3ZlZCBvbmNlIHRoZSBidWcgb2ZcbiAgICAgIC8vIENocm9tZSBpcyBjb3JyZWN0ZWQuXG5cbiAgICAgIC8vIGVsc2UgaWYgKHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlKVxuICAgICAgLy8gdGhpcy5fdHJ5T3JpZW50YXRpb25GYWxsYmFjaygpO1xuXG4gICAgICBlbHNlXG4gICAgICAgIHJlc29sdmUodGhpcyk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IERldmljZU1vdGlvbk1vZHVsZSgpO1xuIl19