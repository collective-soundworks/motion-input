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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRldmljZU1vdGlvbk1vZHVsZS5qcyJdLCJuYW1lcyI6WyJnZXRMb2NhbFRpbWUiLCJ3aW5kb3ciLCJwZXJmb3JtYW5jZSIsIm5vdyIsIkRhdGUiLCJEZXZpY2VNb3Rpb25Nb2R1bGUiLCJldmVudCIsImFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkiLCJhY2NlbGVyYXRpb24iLCJyb3RhdGlvblJhdGUiLCJyZXF1aXJlZCIsIl9wcm9taXNlUmVzb2x2ZSIsIl91bmlmeU1vdGlvbkRhdGEiLCJvcyIsImZhbWlseSIsIl91bmlmeVBlcmlvZCIsIl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uIiwiX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25UaW1lQ29uc3RhbnQiLCJfbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkiLCJfY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZSIsIl9sYXN0T3JpZW50YXRpb24iLCJfbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wIiwiX3Byb2Nlc3NGdW5jdGlvbiIsIl9wcm9jZXNzIiwiYmluZCIsIl9kZXZpY2Vtb3Rpb25DaGVjayIsIl9kZXZpY2Vtb3Rpb25MaXN0ZW5lciIsImUiLCJpc1Byb3ZpZGVkIiwicGVyaW9kIiwiaW50ZXJ2YWwiLCJ4IiwieSIsInoiLCJhbHBoYSIsImJldGEiLCJnYW1tYSIsImlzQ2FsY3VsYXRlZCIsImxpc3RlbmVycyIsInNpemUiLCJfZW1pdERldmljZU1vdGlvbkV2ZW50IiwiaXNWYWxpZCIsIl9lbWl0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eUV2ZW50IiwiX2VtaXRBY2NlbGVyYXRpb25FdmVudCIsIl9lbWl0Um90YXRpb25SYXRlRXZlbnQiLCJvdXRFdmVudCIsImVtaXQiLCJrIiwiX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25EZWNheSIsIm9yaWVudGF0aW9uIiwiYWxwaGFJc1ZhbGlkIiwickFscGhhIiwickJldGEiLCJyR2FtbWEiLCJhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IiLCJiZXRhRGlzY29udGludWl0eUZhY3RvciIsImdhbW1hRGlzY29udGludWl0eUZhY3RvciIsImRlbHRhVCIsInJlcXVpcmVNb2R1bGUiLCJ0aGVuIiwiY29uc29sZSIsImxvZyIsImFkZExpc3RlbmVyIiwiX2NhbGN1bGF0ZVJvdGF0aW9uUmF0ZUZyb21PcmllbnRhdGlvbiIsImRhdGEiLCJyZXNvbHZlIiwiRGV2aWNlTW90aW9uRXZlbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiTWF0aCIsImV4cCIsIlBJIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOzs7Ozs7QUFNQSxTQUFTQSxZQUFULEdBQXdCO0FBQ3RCLE1BQUlDLE9BQU9DLFdBQVgsRUFDRSxPQUFPRCxPQUFPQyxXQUFQLENBQW1CQyxHQUFuQixLQUEyQixJQUFsQztBQUNGLFNBQU9DLEtBQUtELEdBQUwsS0FBYSxJQUFwQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW1CTUUsa0I7OztBQUVKOzs7OztBQUtBLGdDQUFjO0FBQUE7O0FBR1o7Ozs7Ozs7QUFIWSx3SUFDTixjQURNOztBQVVaLFVBQUtDLEtBQUwsR0FBYSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUErQixJQUEvQixFQUFxQyxJQUFyQyxFQUEyQyxJQUEzQyxFQUFpRCxJQUFqRCxDQUFiOztBQUVBOzs7Ozs7O0FBT0EsVUFBS0MsNEJBQUwsR0FBb0MsdUNBQTRCLDhCQUE1QixDQUFwQzs7QUFFQTs7Ozs7Ozs7OztBQVVBLFVBQUtDLFlBQUwsR0FBb0IsdUNBQTRCLGNBQTVCLENBQXBCOztBQUVBOzs7Ozs7Ozs7O0FBVUEsVUFBS0MsWUFBTCxHQUFvQix1Q0FBNEIsY0FBNUIsQ0FBcEI7O0FBRUE7Ozs7Ozs7OztBQVNBLFVBQUtDLFFBQUwsR0FBZ0I7QUFDZEgsb0NBQThCLEtBRGhCO0FBRWRDLG9CQUFjLEtBRkE7QUFHZEMsb0JBQWM7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QUlaLGtCQUFKLEUiLCJmaWxlIjoiRGV2aWNlTW90aW9uTW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IElucHV0TW9kdWxlIGZyb20gJy4vSW5wdXRNb2R1bGUnO1xuaW1wb3J0IERPTUV2ZW50U3VibW9kdWxlIGZyb20gJy4vRE9NRXZlbnRTdWJtb2R1bGUnO1xuaW1wb3J0IE1vdGlvbklucHV0IGZyb20gJy4vTW90aW9uSW5wdXQnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJ3BsYXRmb3JtJztcblxuLyoqXG4gKiBHZXRzIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUgaW4gc2Vjb25kcy5cbiAqIFVzZXMgYHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKWAgaWYgYXZhaWxhYmxlLCBhbmQgYERhdGUubm93KClgIG90aGVyd2lzZS5cbiAqXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGdldExvY2FsVGltZSgpIHtcbiAgaWYgKHdpbmRvdy5wZXJmb3JtYW5jZSlcbiAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMDtcbiAgcmV0dXJuIERhdGUubm93KCkgLyAxMDAwO1xufVxuXG4vKipcbiAqIGBEZXZpY2VNb3Rpb25gIG1vZHVsZSBzaW5nbGV0b24uXG4gKiBUaGUgYERldmljZU1vdGlvbk1vZHVsZWAgc2luZ2xldG9uIHByb3ZpZGVzIHRoZSByYXcgdmFsdWVzXG4gKiBvZiB0aGUgYWNjZWxlcmF0aW9uIGluY2x1ZGluZyBncmF2aXR5LCBhY2NlbGVyYXRpb24sIGFuZCByb3RhdGlvblxuICogcmF0ZSBwcm92aWRlZCBieSB0aGUgYERldmljZU1vdGlvbmAgZXZlbnQuXG4gKiBJdCBhbHNvIGluc3RhbnRpYXRlIHRoZSBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsXG4gKiBgQWNjZWxlcmF0aW9uYCBhbmQgYFJvdGF0aW9uUmF0ZWAgc3VibW9kdWxlcyB0aGF0IHVuaWZ5IHRob3NlIHZhbHVlc1xuICogYWNyb3NzIHBsYXRmb3JtcyBieSBtYWtpbmcgdGhlbSBjb21wbGlhbnQgd2l0aCB7QGxpbmtcbiAqIGh0dHA6Ly93d3cudzMub3JnL1RSL29yaWVudGF0aW9uLWV2ZW50L3x0aGUgVzNDIHN0YW5kYXJkfS5cbiAqIFdoZW4gcmF3IHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IHRoZSBzZW5zb3JzLCB0aGlzIG1vZHVsZXMgdHJpZXNcbiAqIHRvIHJlY2FsY3VsYXRlIHRoZW0gZnJvbSBhdmFpbGFibGUgdmFsdWVzOlxuICogLSBgYWNjZWxlcmF0aW9uYCBpcyBjYWxjdWxhdGVkIGZyb20gYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgXG4gKiAgIHdpdGggYSBoaWdoLXBhc3MgZmlsdGVyO1xuICogLSAoY29taW5nIHNvb24g4oCUIHdhaXRpbmcgZm9yIGEgYnVnIG9uIENocm9tZSB0byBiZSByZXNvbHZlZClcbiAqICAgYHJvdGF0aW9uUmF0ZWAgaXMgY2FsY3VsYXRlZCBmcm9tIGBvcmllbnRhdGlvbmAuXG4gKlxuICogQGNsYXNzIERldmljZU1vdGlvbk1vZHVsZVxuICogQGV4dGVuZHMgSW5wdXRNb2R1bGVcbiAqL1xuY2xhc3MgRGV2aWNlTW90aW9uTW9kdWxlIGV4dGVuZHMgSW5wdXRNb2R1bGUge1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBgRGV2aWNlTW90aW9uYCBtb2R1bGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJ2RldmljZW1vdGlvbicpO1xuXG4gICAgLyoqXG4gICAgICogUmF3IHZhbHVlcyBjb21pbmcgZnJvbSB0aGUgYGRldmljZW1vdGlvbmAgZXZlbnQgc2VudCBieSB0aGlzIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50ID0gW251bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGxdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCBtb2R1bGUuXG4gICAgICogUHJvdmlkZXMgdW5pZmllZCB2YWx1ZXMgb2YgdGhlIGFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKi9cbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBuZXcgRE9NRXZlbnRTdWJtb2R1bGUodGhpcywgJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgQWNjZWxlcmF0aW9uYCBzdWJtb2R1bGUuXG4gICAgICogUHJvdmlkZXMgdW5pZmllZCB2YWx1ZXMgb2YgdGhlIGFjY2VsZXJhdGlvbi5cbiAgICAgKiBFc3RpbWF0ZXMgdGhlIGFjY2VsZXJhdGlvbiB2YWx1ZXMgZnJvbSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWBcbiAgICAgKiByYXcgdmFsdWVzIGlmIHRoZSBhY2NlbGVyYXRpb24gcmF3IHZhbHVlcyBhcmUgbm90IGF2YWlsYWJsZSBvbiB0aGVcbiAgICAgKiBkZXZpY2UuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5hY2NlbGVyYXRpb24gPSBuZXcgRE9NRXZlbnRTdWJtb2R1bGUodGhpcywgJ2FjY2VsZXJhdGlvbicpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBSb3RhdGlvblJhdGVgIHN1Ym1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyB1bmlmaWVkIHZhbHVlcyBvZiB0aGUgcm90YXRpb24gcmF0ZS5cbiAgICAgKiAoY29taW5nIHNvb24sIHdhaXRpbmcgZm9yIGEgYnVnIG9uIENocm9tZSB0byBiZSByZXNvbHZlZClcbiAgICAgKiBFc3RpbWF0ZXMgdGhlIHJvdGF0aW9uIHJhdGUgdmFsdWVzIGZyb20gYG9yaWVudGF0aW9uYCB2YWx1ZXMgaWZcbiAgICAgKiB0aGUgcm90YXRpb24gcmF0ZSByYXcgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlIG9uIHRoZSBkZXZpY2UuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5yb3RhdGlvblJhdGUgPSBuZXcgRE9NRXZlbnRTdWJtb2R1bGUodGhpcywgJ3JvdGF0aW9uUmF0ZScpO1xuXG4gICAgLyoqXG4gICAgICogUmVxdWlyZWQgc3VibW9kdWxlcyAvIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtib29sfSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcyBhcmUgcmVxdWlyZWQgb3Igbm90IChkZWZhdWx0cyB0byBgZmFsc2VgKS5cbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IGFjY2VsZXJhdGlvbiAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBgYWNjZWxlcmF0aW9uYCB1bmlmaWVkIHZhbHVlcyBhcmUgcmVxdWlyZWQgb3Igbm90IChkZWZhdWx0cyB0byBgZmFsc2VgKS5cbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IHJvdGF0aW9uUmF0ZSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBgcm90YXRpb25SYXRlYCB1bmlmaWVkIHZhbHVlcyBhcmUgcmVxdWlyZWQgb3Igbm90IChkZWZhdWx0cyB0byBgZmFsc2VgKS5cbiAgICAgKi9cbiAgICB0aGlzLnJlcXVpcmVkID0ge1xuICAgICAgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eTogZmFsc2UsXG4gICAgICBhY2NlbGVyYXRpb246IGZhbHNlLFxuICAgICAgcm90YXRpb25SYXRlOiBmYWxzZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlIGZ1bmN0aW9uIG9mIHRoZSBtb2R1bGUncyBwcm9taXNlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKiBAc2VlIERldmljZU1vdGlvbk1vZHVsZSNpbml0XG4gICAgICovXG4gICAgdGhpcy5fcHJvbWlzZVJlc29sdmUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVW5pZnlpbmcgZmFjdG9yIG9mIHRoZSBtb3Rpb24gZGF0YSB2YWx1ZXMgKGAxYCBvbiBBbmRyb2lkLCBgLTFgIG9uIGlPUykuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX3VuaWZ5TW90aW9uRGF0YSA9IChwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdpT1MnID8gLTEgOiAxKTtcblxuICAgIC8qKlxuICAgICAqIFVuaWZ5aW5nIGZhY3RvciBvZiB0aGUgcGVyaW9kIChgMC4wMDFgIG9uIEFuZHJvaWQsIGAxYCBvbiBpT1MpLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLl91bmlmeVBlcmlvZCA9IChwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdBbmRyb2lkJyA/IDAuMDAxIDogMSk7XG5cbiAgICAvKipcbiAgICAgKiBBY2NlbGVyYXRpb24gY2FsY3VsYXRlZCBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogVGltZSBjb25zdGFudCAoaGFsZi1saWZlKSBvZiB0aGUgaGlnaC1wYXNzIGZpbHRlciB1c2VkIHRvIHNtb290aCB0aGUgYWNjZWxlcmF0aW9uIHZhbHVlcyBjYWxjdWxhdGVkIGZyb20gdGhlIGFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eSByYXcgdmFsdWVzIChpbiBzZWNvbmRzKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgMC4xXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblRpbWVDb25zdGFudCA9IDAuMTtcblxuICAgIC8qKlxuICAgICAqIExhdGVzdCBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlLCB1c2VkIGluIHRoZSBoaWdoLXBhc3MgZmlsdGVyIHRvIGNhbGN1bGF0ZSB0aGUgYWNjZWxlcmF0aW9uIChpZiB0aGUgYGFjY2VsZXJhdGlvbmAgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgYCdkZXZpY2Vtb3Rpb24nYCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBSb3RhdGlvbiByYXRlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgb3JpZW50YXRpb24gdmFsdWVzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGUgPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBMYXRlc3Qgb3JpZW50YXRpb24gdmFsdWUsIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSByb3RhdGlvbiByYXRlICAoaWYgdGhlIGByb3RhdGlvblJhdGVgIHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IGAnZGV2aWNlbW90aW9uJ2ApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvbiA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIExhdGVzdCBvcmllbnRhdGlvbiB0aW1lc3RhbXBzLCB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgcm90YXRpb24gcmF0ZSAoaWYgdGhlIGByb3RhdGlvblJhdGVgIHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IGAnZGV2aWNlbW90aW9uJ2ApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblRpbWVzdGFtcCA9IG51bGw7XG5cbiAgICB0aGlzLl9wcm9jZXNzRnVuY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuX3Byb2Nlc3MgPSB0aGlzLl9wcm9jZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2sgPSB0aGlzLl9kZXZpY2Vtb3Rpb25DaGVjay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2RldmljZW1vdGlvbkxpc3RlbmVyID0gdGhpcy5fZGV2aWNlbW90aW9uTGlzdGVuZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWNheSBmYWN0b3Igb2YgdGhlIGhpZ2gtcGFzcyBmaWx0ZXIgdXNlZCB0byBjYWxjdWxhdGUgdGhlIGFjY2VsZXJhdGlvbiBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlcy5cbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25EZWNheSgpIHtcbiAgICByZXR1cm4gTWF0aC5leHAoLTIgKiBNYXRoLlBJICogdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnBlcmlvZCAvIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25UaW1lQ29uc3RhbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbnNvciBjaGVjayBvbiBpbml0aWFsaXphdGlvbiBvZiB0aGUgbW9kdWxlLlxuICAgKiBUaGlzIG1ldGhvZDpcbiAgICogLSBjaGVja3Mgd2hldGhlciB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCB0aGUgYGFjY2VsZXJhdGlvbmAsXG4gICAqICAgYW5kIHRoZSBgcm90YXRpb25SYXRlYCB2YWx1ZXMgYXJlIHZhbGlkIG9yIG5vdDtcbiAgICogLSBnZXRzIHRoZSBwZXJpb2Qgb2YgdGhlIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgYW5kIHNldHMgdGhlIHBlcmlvZCBvZlxuICAgKiAgIHRoZSBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIGBBY2NlbGVyYXRpb25gLCBhbmQgYFJvdGF0aW9uUmF0ZWBcbiAgICogICBzdWJtb2R1bGVzO1xuICAgKiAtIChpbiB0aGUgY2FzZSB3aGVyZSBhY2NlbGVyYXRpb24gcmF3IHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkKVxuICAgKiAgIGluZGljYXRlcyB3aGV0aGVyIHRoZSBhY2NlbGVyYXRpb24gY2FuIGJlIGNhbGN1bGF0ZWQgZnJvbSB0aGVcbiAgICogICBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMgb3Igbm90LlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gVGhlIGZpcnN0IGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgY2F1Z2h0LlxuICAgKi9cbiAgX2RldmljZW1vdGlvbkNoZWNrKGUpIHtcbiAgICB0aGlzLmlzUHJvdmlkZWQgPSB0cnVlO1xuICAgIHRoaXMucGVyaW9kID0gZS5pbnRlcnZhbCAvIDEwMDA7XG5cbiAgICAvLyBTZW5zb3IgYXZhaWxhYmlsaXR5IGZvciB0aGUgYWNjZWxlcmF0aW9uIGluY2x1ZGluZyBncmF2aXR5XG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzUHJvdmlkZWQgPSAoXG4gICAgICBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnggPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueSA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56ID09PSAnbnVtYmVyJylcbiAgICApO1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5wZXJpb2QgPSBlLmludGVydmFsICogdGhpcy5fdW5pZnlQZXJpb2Q7XG5cbiAgICAvLyBTZW5zb3IgYXZhaWxhYmlsaXR5IGZvciB0aGUgYWNjZWxlcmF0aW9uXG4gICAgdGhpcy5hY2NlbGVyYXRpb24uaXNQcm92aWRlZCA9IChcbiAgICAgIGUuYWNjZWxlcmF0aW9uICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uLnggPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbi55ID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb24ueiA9PT0gJ251bWJlcicpXG4gICAgKTtcbiAgICB0aGlzLmFjY2VsZXJhdGlvbi5wZXJpb2QgPSBlLmludGVydmFsICogdGhpcy5fdW5pZnlQZXJpb2Q7XG5cbiAgICAvLyBTZW5zb3IgYXZhaWxhYmlsaXR5IGZvciB0aGUgcm90YXRpb24gcmF0ZVxuICAgIHRoaXMucm90YXRpb25SYXRlLmlzUHJvdmlkZWQgPSAoXG4gICAgICBlLnJvdGF0aW9uUmF0ZSAmJlxuICAgICAgKHR5cGVvZiBlLnJvdGF0aW9uUmF0ZS5hbHBoYSA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUucm90YXRpb25SYXRlLmJldGEgPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLnJvdGF0aW9uUmF0ZS5nYW1tYSA9PT0gJ251bWJlcicpXG4gICAgKTtcbiAgICB0aGlzLnJvdGF0aW9uUmF0ZS5wZXJpb2QgPSBlLmludGVydmFsICogdGhpcy5fdW5pZnlQZXJpb2Q7XG5cbiAgICAvLyBub3cgdGhhdCB0aGUgc2Vuc29ycyBhcmUgY2hhY2tlZCByZXBsYWNlIHRoZSBwcm9jZXNzIGZ1bmN0aW9uIHdpdGggdGhlXG4gICAgLy8gcHJvcGVyIGxpc3RlbmVyXG4gICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5fZGV2aWNlbW90aW9uTGlzdGVuZXI7XG5cbiAgICAvLyBJZiBhY2NlbGVyYXRpb24gaXMgbm90IHByb3ZpZGVkIGJ5IHJhdyBzZW5zb3JzLCBpbmRpY2F0ZSB3aGV0aGVyIGl0XG4gICAgLy8gY2FuIGJlIGNhbGN1bGF0ZWQgd2l0aCBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgb3Igbm90XG4gICAgaWYgKCF0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkKVxuICAgICAgdGhpcy5hY2NlbGVyYXRpb24uaXNDYWxjdWxhdGVkID0gdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzUHJvdmlkZWQ7XG5cbiAgICAvLyBXQVJOSU5HXG4gICAgLy8gVGhlIGxpbmVzIG9mIGNvZGUgYmVsb3cgYXJlIGNvbW1lbnRlZCBiZWNhdXNlIG9mIGEgYnVnIG9mIENocm9tZVxuICAgIC8vIG9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzLCB3aGVyZSAnZGV2aWNlbW90aW9uJyBldmVudHMgYXJlIG5vdCBzZW50XG4gICAgLy8gb3IgY2F1Z2h0IGlmIHRoZSBsaXN0ZW5lciBpcyBzZXQgdXAgYWZ0ZXIgYSAnZGV2aWNlb3JpZW50YXRpb24nXG4gICAgLy8gbGlzdGVuZXIuIEhlcmUsIHRoZSBfdHJ5T3JpZW50YXRpb25GYWxsYmFjayBtZXRob2Qgd291bGQgYWRkIGFcbiAgICAvLyAnZGV2aWNlb3JpZW50YXRpb24nIGxpc3RlbmVyIGFuZCBibG9jayBhbGwgc3Vic2VxdWVudCAnZGV2aWNlbW90aW9uJ1xuICAgIC8vIGV2ZW50cyBvbiB0aGVzZSBkZXZpY2VzLiBDb21tZW50cyB3aWxsIGJlIHJlbW92ZWQgb25jZSB0aGUgYnVnIG9mXG4gICAgLy8gQ2hyb21lIGlzIGNvcnJlY3RlZC5cblxuICAgIC8vIGlmICh0aGlzLnJlcXVpcmVkLnJvdGF0aW9uUmF0ZSAmJiAhdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZClcbiAgICAvLyAgIHRoaXMuX3RyeU9yaWVudGF0aW9uRmFsbGJhY2soKTtcbiAgICAvLyBlbHNlXG4gICAgdGhpcy5fcHJvbWlzZVJlc29sdmUodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBjYWxsYmFjay5cbiAgICogVGhpcyBtZXRob2QgZW1pdHMgYW4gZXZlbnQgd2l0aCB0aGUgcmF3IGAnZGV2aWNlbW90aW9uJ2AgdmFsdWVzLCBhbmQgZW1pdHNcbiAgICogZXZlbnRzIHdpdGggdGhlIHVuaWZpZWQgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCBgYWNjZWxlcmF0aW9uYCxcbiAgICogYW5kIC8gb3IgYHJvdGF0aW9uUmF0ZWAgdmFsdWVzIGlmIHRoZXkgYXJlIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZGV2aWNlbW90aW9uTGlzdGVuZXIoZSkge1xuICAgIC8vICdkZXZpY2Vtb3Rpb24nIGV2ZW50IChyYXcgdmFsdWVzKVxuICAgIGlmICh0aGlzLmxpc3RlbmVycy5zaXplID4gMClcbiAgICAgIHRoaXMuX2VtaXREZXZpY2VNb3Rpb25FdmVudChlKTtcblxuICAgIC8vICdhY2NlbGVyYXRpb24nIGV2ZW50ICh1bmlmaWVkIHZhbHVlcylcbiAgICBpZiAodGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lmxpc3RlbmVycy5zaXplID4gMCAmJlxuICAgICAgICB0aGlzLnJlcXVpcmVkLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgJiZcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzVmFsaWRcbiAgICApIHtcbiAgICAgIHRoaXMuX2VtaXRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RXZlbnQoZSk7XG4gICAgfVxuXG4gICAgLy8gJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknIGV2ZW50ICh1bmlmaWVkIHZhbHVlcylcbiAgICAvLyB0aGUgZmFsbGJhY2sgY2FsY3VsYXRpb24gb2YgdGhlIGFjY2VsZXJhdGlvbiBoYXBwZW5zIGluIHRoZVxuICAgIC8vICBgX2VtaXRBY2NlbGVyYXRpb25gIG1ldGhvZCwgc28gd2UgY2hlY2sgaWYgdGhpcy5hY2NlbGVyYXRpb24uaXNWYWxpZFxuICAgIGlmICh0aGlzLmFjY2VsZXJhdGlvbi5saXN0ZW5lcnMuc2l6ZSA+IDAgJiZcbiAgICAgICAgdGhpcy5yZXF1aXJlZC5hY2NlbGVyYXRpb24gJiZcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24uaXNWYWxpZFxuICAgICkge1xuICAgICAgdGhpcy5fZW1pdEFjY2VsZXJhdGlvbkV2ZW50KGUpO1xuICAgIH1cblxuICAgIC8vICdyb3RhdGlvblJhdGUnIGV2ZW50ICh1bmlmaWVkIHZhbHVlcylcbiAgICAvLyB0aGUgZmFsbGJhY2sgY2FsY3VsYXRpb24gb2YgdGhlIHJvdGF0aW9uIHJhdGUgZG9lcyBOT1QgaGFwcGVuIGluIHRoZVxuICAgIC8vIGBfZW1pdFJvdGF0aW9uUmF0ZWAgbWV0aG9kLCBzbyB3ZSBvbmx5IGNoZWNrIGlmIHRoaXMucm90YXRpb25SYXRlLmlzUHJvdmlkZWRcbiAgICBpZiAodGhpcy5yb3RhdGlvblJhdGUubGlzdGVuZXJzLnNpemUgPiAwICYmXG4gICAgICAgIHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlICYmXG4gICAgICAgIHRoaXMucm90YXRpb25SYXRlLmlzUHJvdmlkZWRcbiAgICApIHtcbiAgICAgIHRoaXMuX2VtaXRSb3RhdGlvblJhdGVFdmVudChlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIGAnZGV2aWNlbW90aW9uJ2AgcmF3IHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2VtaXREZXZpY2VNb3Rpb25FdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5ldmVudDtcblxuICAgIGlmIChlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpIHtcbiAgICAgIG91dEV2ZW50WzBdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lng7XG4gICAgICBvdXRFdmVudFsxXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55O1xuICAgICAgb3V0RXZlbnRbMl0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuejtcbiAgICB9XG5cbiAgICBpZiAoZS5hY2NlbGVyYXRpb24pIHtcbiAgICAgIG91dEV2ZW50WzNdID0gZS5hY2NlbGVyYXRpb24ueDtcbiAgICAgIG91dEV2ZW50WzRdID0gZS5hY2NlbGVyYXRpb24ueTtcbiAgICAgIG91dEV2ZW50WzVdID0gZS5hY2NlbGVyYXRpb24uejtcbiAgICB9XG5cbiAgICBpZiAoZS5yb3RhdGlvblJhdGUpIHtcbiAgICAgIG91dEV2ZW50WzZdID0gZS5yb3RhdGlvblJhdGUuYWxwaGE7XG4gICAgICBvdXRFdmVudFs3XSA9IGUucm90YXRpb25SYXRlLmJldGE7XG4gICAgICBvdXRFdmVudFs4XSA9IGUucm90YXRpb25SYXRlLmdhbW1hO1xuICAgIH1cblxuICAgIHRoaXMuZW1pdChvdXRFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2VtaXRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RXZlbnQoZSkge1xuICAgIGxldCBvdXRFdmVudCA9IHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5ldmVudDtcblxuICAgIG91dEV2ZW50WzBdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnggKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgb3V0RXZlbnRbMV0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueSAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICBvdXRFdmVudFsyXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuXG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmVtaXQob3V0RXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBgYWNjZWxlcmF0aW9uYCB1bmlmaWVkIHZhbHVlcy5cbiAgICogV2hlbiB0aGUgYGFjY2VsZXJhdGlvbmAgcmF3IHZhbHVlcyBhcmUgbm90IGF2YWlsYWJsZSwgdGhlIG1ldGhvZFxuICAgKiBhbHNvIGNhbGN1bGF0ZXMgdGhlIGFjY2VsZXJhdGlvbiBmcm9tIHRoZVxuICAgKiBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIFRoZSBgJ2RldmljZW1vdGlvbidgIGV2ZW50LlxuICAgKi9cbiAgX2VtaXRBY2NlbGVyYXRpb25FdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5hY2NlbGVyYXRpb24uZXZlbnQ7XG5cbiAgICBpZiAodGhpcy5hY2NlbGVyYXRpb24uaXNQcm92aWRlZCkge1xuICAgICAgLy8gSWYgcmF3IGFjY2VsZXJhdGlvbiB2YWx1ZXMgYXJlIHByb3ZpZGVkXG4gICAgICBvdXRFdmVudFswXSA9IGUuYWNjZWxlcmF0aW9uLnggKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgICBvdXRFdmVudFsxXSA9IGUuYWNjZWxlcmF0aW9uLnkgKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGUuYWNjZWxlcmF0aW9uLnogKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgfSBlbHNlIGlmICh0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZCkge1xuICAgICAgLy8gT3RoZXJ3aXNlLCBpZiBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IHZhbHVlcyBhcmUgcHJvdmlkZWQsXG4gICAgICAvLyBlc3RpbWF0ZSB0aGUgYWNjZWxlcmF0aW9uIHdpdGggYSBoaWdoLXBhc3MgZmlsdGVyXG4gICAgICBjb25zdCBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ID0gW1xuICAgICAgICBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YSxcbiAgICAgICAgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnkgKiB0aGlzLl91bmlmeU1vdGlvbkRhdGEsXG4gICAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhXG4gICAgICBdO1xuICAgICAgY29uc3QgayA9IHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25EZWNheTtcblxuICAgICAgLy8gSGlnaC1wYXNzIGZpbHRlciB0byBlc3RpbWF0ZSB0aGUgYWNjZWxlcmF0aW9uICh3aXRob3V0IHRoZSBncmF2aXR5KVxuICAgICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblswXSA9ICgxICsgaykgKiAwLjUgKiAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXSAtIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdKSArIGsgKiB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzBdO1xuICAgICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsxXSA9ICgxICsgaykgKiAwLjUgKiAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXSAtIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdKSArIGsgKiB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzFdO1xuICAgICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsyXSA9ICgxICsgaykgKiAwLjUgKiAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXSAtIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdKSArIGsgKiB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzJdO1xuXG4gICAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXSA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF07XG4gICAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXSA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV07XG4gICAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXSA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl07XG5cbiAgICAgIG91dEV2ZW50WzBdID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblswXTtcbiAgICAgIG91dEV2ZW50WzFdID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsxXTtcbiAgICAgIG91dEV2ZW50WzJdID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsyXTtcbiAgICB9XG5cbiAgICB0aGlzLmFjY2VsZXJhdGlvbi5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYHJvdGF0aW9uUmF0ZWAgdW5pZmllZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICovXG4gIF9lbWl0Um90YXRpb25SYXRlRXZlbnQoZSkge1xuICAgIGxldCBvdXRFdmVudCA9IHRoaXMucm90YXRpb25SYXRlLmV2ZW50O1xuXG4gICAgb3V0RXZlbnRbMF0gPSBlLnJvdGF0aW9uUmF0ZS5hbHBoYTtcbiAgICBvdXRFdmVudFsxXSA9IGUucm90YXRpb25SYXRlLmJldGE7XG4gICAgb3V0RXZlbnRbMl0gPSBlLnJvdGF0aW9uUmF0ZS5nYW1tYTtcblxuICAgIC8vIFRPRE8oPyk6IHVuaWZ5XG5cbiAgICB0aGlzLnJvdGF0aW9uUmF0ZS5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGFuZCBlbWl0cyB0aGUgYHJvdGF0aW9uUmF0ZWAgdW5pZmllZCB2YWx1ZXMgZnJvbSB0aGUgYG9yaWVudGF0aW9uYCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyW119IG9yaWVudGF0aW9uIC0gTGF0ZXN0IGBvcmllbnRhdGlvbmAgcmF3IHZhbHVlcy5cbiAgICovXG4gIF9jYWxjdWxhdGVSb3RhdGlvblJhdGVGcm9tT3JpZW50YXRpb24ob3JpZW50YXRpb24pIHtcbiAgICBjb25zdCBub3cgPSBnZXRMb2NhbFRpbWUoKTtcbiAgICBjb25zdCBrID0gMC44OyAvLyBUT0RPOiBpbXByb3ZlIGxvdyBwYXNzIGZpbHRlciAoZnJhbWVzIGFyZSBub3QgcmVndWxhcilcbiAgICBjb25zdCBhbHBoYUlzVmFsaWQgPSAodHlwZW9mIG9yaWVudGF0aW9uWzBdID09PSAnbnVtYmVyJyk7XG5cbiAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wKSB7XG4gICAgICBsZXQgckFscGhhID0gbnVsbDtcbiAgICAgIGxldCByQmV0YTtcbiAgICAgIGxldCByR2FtbWE7XG5cbiAgICAgIGxldCBhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAwO1xuICAgICAgbGV0IGJldGFEaXNjb250aW51aXR5RmFjdG9yID0gMDtcbiAgICAgIGxldCBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAwO1xuXG4gICAgICBjb25zdCBkZWx0YVQgPSBub3cgLSB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXA7XG5cbiAgICAgIGlmIChhbHBoYUlzVmFsaWQpIHtcbiAgICAgICAgLy8gYWxwaGEgZGlzY29udGludWl0eSAoKzM2MCAtPiAwIG9yIDAgLT4gKzM2MClcbiAgICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSA+IDMyMCAmJiBvcmllbnRhdGlvblswXSA8IDQwKVxuICAgICAgICAgIGFscGhhRGlzY29udGludWl0eUZhY3RvciA9IDM2MDtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdIDwgNDAgJiYgb3JpZW50YXRpb25bMF0gPiAzMjApXG4gICAgICAgICAgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yID0gLTM2MDtcbiAgICAgIH1cblxuICAgICAgLy8gYmV0YSBkaXNjb250aW51aXR5ICgrMTgwIC0+IC0xODAgb3IgLTE4MCAtPiArMTgwKVxuICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSA+IDE0MCAmJiBvcmllbnRhdGlvblsxXSA8IC0xNDApXG4gICAgICAgIGJldGFEaXNjb250aW51aXR5RmFjdG9yID0gMzYwO1xuICAgICAgZWxzZSBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzFdIDwgLTE0MCAmJiBvcmllbnRhdGlvblsxXSA+IDE0MClcbiAgICAgICAgYmV0YURpc2NvbnRpbnVpdHlGYWN0b3IgPSAtMzYwO1xuXG4gICAgICAvLyBnYW1tYSBkaXNjb250aW51aXRpZXMgKCsxODAgLT4gLTE4MCBvciAtMTgwIC0+ICsxODApXG4gICAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdID4gNTAgJiYgb3JpZW50YXRpb25bMl0gPCAtNTApXG4gICAgICAgIGdhbW1hRGlzY29udGludWl0eUZhY3RvciA9IDE4MDtcbiAgICAgIGVsc2UgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSA8IC01MCAmJiBvcmllbnRhdGlvblsyXSA+IDUwKVxuICAgICAgICBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAtMTgwO1xuXG4gICAgICBpZiAoZGVsdGFUID4gMCkge1xuICAgICAgICAvLyBMb3cgcGFzcyBmaWx0ZXIgdG8gc21vb3RoIHRoZSBkYXRhXG4gICAgICAgIGlmIChhbHBoYUlzVmFsaWQpXG4gICAgICAgICAgckFscGhhID0gayAqIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMF0gKyAoMSAtIGspICogKG9yaWVudGF0aW9uWzBdIC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdICsgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcbiAgICAgICAgckJldGEgPSBrICogdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVsxXSArICgxIC0gaykgKiAob3JpZW50YXRpb25bMV0gLSB0aGlzLl9sYXN0T3JpZW50YXRpb25bMV0gKyBiZXRhRGlzY29udGludWl0eUZhY3RvcikgLyBkZWx0YVQ7XG4gICAgICAgIHJHYW1tYSA9IGsgKiB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzJdICsgKDEgLSBrKSAqIChvcmllbnRhdGlvblsyXSAtIHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSArIGdhbW1hRGlzY29udGludWl0eUZhY3RvcikgLyBkZWx0YVQ7XG5cbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVswXSA9IHJBbHBoYTtcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVsxXSA9IHJCZXRhO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzJdID0gckdhbW1hO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPOiByZXNhbXBsZSB0aGUgZW1pc3Npb24gcmF0ZSB0byBtYXRjaCB0aGUgZGV2aWNlbW90aW9uIHJhdGVcbiAgICAgIHRoaXMucm90YXRpb25SYXRlLmVtaXQodGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wID0gbm93O1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSA9IG9yaWVudGF0aW9uWzBdO1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSA9IG9yaWVudGF0aW9uWzFdO1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSA9IG9yaWVudGF0aW9uWzJdO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSByb3RhdGlvbiByYXRlIGNhbiBiZSBjYWxjdWxhdGVkIGZyb20gdGhlIGBvcmllbnRhdGlvbmAgdmFsdWVzIG9yIG5vdC5cbiAgICovXG4gIF90cnlPcmllbnRhdGlvbkZhbGxiYWNrKCkge1xuICAgIE1vdGlvbklucHV0LnJlcXVpcmVNb2R1bGUoJ29yaWVudGF0aW9uJylcbiAgICAgIC50aGVuKChvcmllbnRhdGlvbikgPT4ge1xuICAgICAgICBpZiAob3JpZW50YXRpb24uaXNWYWxpZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiV0FSTklORyAobW90aW9uLWlucHV0KTogVGhlICdkZXZpY2Vtb3Rpb24nIGV2ZW50IGRvZXMgbm90IGV4aXN0cyBvciBkb2VzIG5vdCBwcm92aWRlIHJvdGF0aW9uIHJhdGUgdmFsdWVzIGluIHlvdXIgYnJvd3Nlciwgc28gdGhlIHJvdGF0aW9uIHJhdGUgb2YgdGhlIGRldmljZSBpcyBlc3RpbWF0ZWQgZnJvbSB0aGUgJ29yaWVudGF0aW9uJywgY2FsY3VsYXRlZCBmcm9tIHRoZSAnZGV2aWNlb3JpZW50YXRpb24nIGV2ZW50LiBTaW5jZSB0aGUgY29tcGFzcyBtaWdodCBub3QgYmUgYXZhaWxhYmxlLCBvbmx5IGBiZXRhYCBhbmQgYGdhbW1hYCBhbmdsZXMgbWF5IGJlIHByb3ZpZGVkIChgYWxwaGFgIHdvdWxkIGJlIG51bGwpLlwiKTtcblxuICAgICAgICAgIHRoaXMucm90YXRpb25SYXRlLmlzQ2FsY3VsYXRlZCA9IHRydWU7XG5cbiAgICAgICAgICBNb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcignb3JpZW50YXRpb24nLCAob3JpZW50YXRpb24pID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVJvdGF0aW9uUmF0ZUZyb21PcmllbnRhdGlvbihvcmllbnRhdGlvbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSh0aGlzKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgX3Byb2Nlc3MoZGF0YSkge1xuICAgIHRoaXMuX3Byb2Nlc3NGdW5jdGlvbihkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtwcm9taXNlfVxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gc3VwZXIuaW5pdCgocmVzb2x2ZSkgPT4ge1xuICAgICAgdGhpcy5fcHJvbWlzZVJlc29sdmUgPSByZXNvbHZlO1xuXG4gICAgICBpZiAod2luZG93LkRldmljZU1vdGlvbkV2ZW50KSB7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NGdW5jdGlvbiA9IHRoaXMuX2RldmljZW1vdGlvbkNoZWNrO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgdGhpcy5fcHJvY2Vzcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIFdBUk5JTkdcbiAgICAgIC8vIFRoZSBsaW5lcyBvZiBjb2RlIGJlbG93IGFyZSBjb21tZW50ZWQgYmVjYXVzZSBvZiBhIGJ1ZyBvZiBDaHJvbWVcbiAgICAgIC8vIG9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzLCB3aGVyZSAnZGV2aWNlbW90aW9uJyBldmVudHMgYXJlIG5vdCBzZW50XG4gICAgICAvLyBvciBjYXVnaHQgaWYgdGhlIGxpc3RlbmVyIGlzIHNldCB1cCBhZnRlciBhICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAgIC8vIGxpc3RlbmVyLiBIZXJlLCB0aGUgX3RyeU9yaWVudGF0aW9uRmFsbGJhY2sgbWV0aG9kIHdvdWxkIGFkZCBhXG4gICAgICAvLyAnZGV2aWNlb3JpZW50YXRpb24nIGxpc3RlbmVyIGFuZCBibG9jayBhbGwgc3Vic2VxdWVudCAnZGV2aWNlbW90aW9uJ1xuICAgICAgLy8gZXZlbnRzIG9uIHRoZXNlIGRldmljZXMuIENvbW1lbnRzIHdpbGwgYmUgcmVtb3ZlZCBvbmNlIHRoZSBidWcgb2ZcbiAgICAgIC8vIENocm9tZSBpcyBjb3JyZWN0ZWQuXG5cbiAgICAgIC8vIGVsc2UgaWYgKHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlKVxuICAgICAgLy8gdGhpcy5fdHJ5T3JpZW50YXRpb25GYWxsYmFjaygpO1xuXG4gICAgICBlbHNlXG4gICAgICAgIHJlc29sdmUodGhpcyk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IERldmljZU1vdGlvbk1vZHVsZSgpO1xuIl19