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
}(_InputModule3.default);

exports.default = new DeviceMotionModule();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRldmljZU1vdGlvbk1vZHVsZS5qcyJdLCJuYW1lcyI6WyJnZXRMb2NhbFRpbWUiLCJ3aW5kb3ciLCJwZXJmb3JtYW5jZSIsIm5vdyIsIkRhdGUiLCJEZXZpY2VNb3Rpb25Nb2R1bGUiLCJldmVudCIsImFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkiLCJhY2NlbGVyYXRpb24iLCJyb3RhdGlvblJhdGUiLCJyZXF1aXJlZCIsIl9udW1MaXN0ZW5lcnMiLCJfcHJvbWlzZVJlc29sdmUiLCJfdW5pZnlNb3Rpb25EYXRhIiwib3MiLCJmYW1pbHkiLCJfdW5pZnlQZXJpb2QiLCJfY2FsY3VsYXRlZEFjY2VsZXJhdGlvbiIsIl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uVGltZUNvbnN0YW50IiwiX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IiwiX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGUiLCJfbGFzdE9yaWVudGF0aW9uIiwiX2xhc3RPcmllbnRhdGlvblRpbWVzdGFtcCIsIl9kZXZpY2Vtb3Rpb25DaGVjayIsImJpbmQiLCJfZGV2aWNlbW90aW9uTGlzdGVuZXIiLCJlIiwiaXNQcm92aWRlZCIsInBlcmlvZCIsImludGVydmFsIiwieCIsInkiLCJ6IiwiYWxwaGEiLCJiZXRhIiwiZ2FtbWEiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiaXNDYWxjdWxhdGVkIiwiX2VtaXREZXZpY2VNb3Rpb25FdmVudCIsImlzVmFsaWQiLCJfZW1pdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlFdmVudCIsIl9lbWl0QWNjZWxlcmF0aW9uRXZlbnQiLCJfZW1pdFJvdGF0aW9uUmF0ZUV2ZW50Iiwib3V0RXZlbnQiLCJlbWl0IiwiayIsIl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uRGVjYXkiLCJvcmllbnRhdGlvbiIsImFscGhhSXNWYWxpZCIsInJBbHBoYSIsInJCZXRhIiwickdhbW1hIiwiYWxwaGFEaXNjb250aW51aXR5RmFjdG9yIiwiYmV0YURpc2NvbnRpbnVpdHlGYWN0b3IiLCJnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IiLCJkZWx0YVQiLCJyZXF1aXJlTW9kdWxlIiwidGhlbiIsImNvbnNvbGUiLCJsb2ciLCJhZGRMaXN0ZW5lciIsIl9jYWxjdWxhdGVSb3RhdGlvblJhdGVGcm9tT3JpZW50YXRpb24iLCJhZGRFdmVudExpc3RlbmVyIiwicmVzb2x2ZSIsIkRldmljZU1vdGlvbkV2ZW50IiwibGlzdGVuZXIiLCJfYWRkTGlzdGVuZXIiLCJfcmVtb3ZlTGlzdGVuZXIiLCJNYXRoIiwiZXhwIiwiUEkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7OztBQU1BLFNBQVNBLFlBQVQsR0FBd0I7QUFDdEIsTUFBSUMsT0FBT0MsV0FBWCxFQUNFLE9BQU9ELE9BQU9DLFdBQVAsQ0FBbUJDLEdBQW5CLEtBQTJCLElBQWxDO0FBQ0YsU0FBT0MsS0FBS0QsR0FBTCxLQUFhLElBQXBCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUJNRSxrQjs7O0FBRUo7Ozs7O0FBS0EsZ0NBQWM7QUFBQTs7QUFHWjs7Ozs7OztBQUhZLHdJQUNOLGNBRE07O0FBVVosVUFBS0MsS0FBTCxHQUFhLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLElBQS9CLEVBQXFDLElBQXJDLEVBQTJDLElBQTNDLEVBQWlELElBQWpELENBQWI7O0FBRUE7Ozs7Ozs7QUFPQSxVQUFLQyw0QkFBTCxHQUFvQyx1Q0FBNEIsOEJBQTVCLENBQXBDOztBQUVBOzs7Ozs7Ozs7O0FBVUEsVUFBS0MsWUFBTCxHQUFvQix1Q0FBNEIsY0FBNUIsQ0FBcEI7O0FBRUE7Ozs7Ozs7Ozs7QUFVQSxVQUFLQyxZQUFMLEdBQW9CLHVDQUE0QixjQUE1QixDQUFwQjs7QUFFQTs7Ozs7Ozs7O0FBU0EsVUFBS0MsUUFBTCxHQUFnQjtBQUNkSCxvQ0FBOEIsS0FEaEI7QUFF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QVMsQ0FBQyxDQUFELEdBQUtELEtBQUtFLEVBQVYsR0FBZSxLQUFLL0QsNEJBQUwsQ0FBa0NxQixNQUFqRCxHQUEwRCxLQUFLVixtQ0FBeEUsQ0FBUDtBQUNEOzs7Ozs7a0JBNFdZLElBQUliLGtCQUFKLEUiLCJmaWxlIjoiRGV2aWNlTW90aW9uTW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IElucHV0TW9kdWxlIGZyb20gJy4vSW5wdXRNb2R1bGUnO1xuaW1wb3J0IERPTUV2ZW50U3VibW9kdWxlIGZyb20gJy4vRE9NRXZlbnRTdWJtb2R1bGUnO1xuaW1wb3J0IE1vdGlvbklucHV0IGZyb20gJy4vTW90aW9uSW5wdXQnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJ3BsYXRmb3JtJztcblxuLyoqXG4gKiBHZXRzIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUgaW4gc2Vjb25kcy5cbiAqIFVzZXMgYHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKWAgaWYgYXZhaWxhYmxlLCBhbmQgYERhdGUubm93KClgIG90aGVyd2lzZS5cbiAqXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGdldExvY2FsVGltZSgpIHtcbiAgaWYgKHdpbmRvdy5wZXJmb3JtYW5jZSlcbiAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMDtcbiAgcmV0dXJuIERhdGUubm93KCkgLyAxMDAwO1xufVxuXG4vKipcbiAqIGBEZXZpY2VNb3Rpb25gIG1vZHVsZSBzaW5nbGV0b24uXG4gKiBUaGUgYERldmljZU1vdGlvbk1vZHVsZWAgc2luZ2xldG9uIHByb3ZpZGVzIHRoZSByYXcgdmFsdWVzXG4gKiBvZiB0aGUgYWNjZWxlcmF0aW9uIGluY2x1ZGluZyBncmF2aXR5LCBhY2NlbGVyYXRpb24sIGFuZCByb3RhdGlvblxuICogcmF0ZSBwcm92aWRlZCBieSB0aGUgYERldmljZU1vdGlvbmAgZXZlbnQuXG4gKiBJdCBhbHNvIGluc3RhbnRpYXRlIHRoZSBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsXG4gKiBgQWNjZWxlcmF0aW9uYCBhbmQgYFJvdGF0aW9uUmF0ZWAgc3VibW9kdWxlcyB0aGF0IHVuaWZ5IHRob3NlIHZhbHVlc1xuICogYWNyb3NzIHBsYXRmb3JtcyBieSBtYWtpbmcgdGhlbSBjb21wbGlhbnQgd2l0aCB7QGxpbmtcbiAqIGh0dHA6Ly93d3cudzMub3JnL1RSL29yaWVudGF0aW9uLWV2ZW50L3x0aGUgVzNDIHN0YW5kYXJkfS5cbiAqIFdoZW4gcmF3IHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IHRoZSBzZW5zb3JzLCB0aGlzIG1vZHVsZXMgdHJpZXNcbiAqIHRvIHJlY2FsY3VsYXRlIHRoZW0gZnJvbSBhdmFpbGFibGUgdmFsdWVzOlxuICogLSBgYWNjZWxlcmF0aW9uYCBpcyBjYWxjdWxhdGVkIGZyb20gYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgXG4gKiAgIHdpdGggYSBoaWdoLXBhc3MgZmlsdGVyO1xuICogLSAoY29taW5nIHNvb24g4oCUIHdhaXRpbmcgZm9yIGEgYnVnIG9uIENocm9tZSB0byBiZSByZXNvbHZlZClcbiAqICAgYHJvdGF0aW9uUmF0ZWAgaXMgY2FsY3VsYXRlZCBmcm9tIGBvcmllbnRhdGlvbmAuXG4gKlxuICogQGNsYXNzIERldmljZU1vdGlvbk1vZHVsZVxuICogQGV4dGVuZHMgSW5wdXRNb2R1bGVcbiAqL1xuY2xhc3MgRGV2aWNlTW90aW9uTW9kdWxlIGV4dGVuZHMgSW5wdXRNb2R1bGUge1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBgRGV2aWNlTW90aW9uYCBtb2R1bGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJ2RldmljZW1vdGlvbicpO1xuXG4gICAgLyoqXG4gICAgICogUmF3IHZhbHVlcyBjb21pbmcgZnJvbSB0aGUgYGRldmljZW1vdGlvbmAgZXZlbnQgc2VudCBieSB0aGlzIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50ID0gW251bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGxdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCBtb2R1bGUuXG4gICAgICogUHJvdmlkZXMgdW5pZmllZCB2YWx1ZXMgb2YgdGhlIGFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKi9cbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBuZXcgRE9NRXZlbnRTdWJtb2R1bGUodGhpcywgJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgQWNjZWxlcmF0aW9uYCBzdWJtb2R1bGUuXG4gICAgICogUHJvdmlkZXMgdW5pZmllZCB2YWx1ZXMgb2YgdGhlIGFjY2VsZXJhdGlvbi5cbiAgICAgKiBFc3RpbWF0ZXMgdGhlIGFjY2VsZXJhdGlvbiB2YWx1ZXMgZnJvbSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWBcbiAgICAgKiByYXcgdmFsdWVzIGlmIHRoZSBhY2NlbGVyYXRpb24gcmF3IHZhbHVlcyBhcmUgbm90IGF2YWlsYWJsZSBvbiB0aGVcbiAgICAgKiBkZXZpY2UuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5hY2NlbGVyYXRpb24gPSBuZXcgRE9NRXZlbnRTdWJtb2R1bGUodGhpcywgJ2FjY2VsZXJhdGlvbicpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBSb3RhdGlvblJhdGVgIHN1Ym1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyB1bmlmaWVkIHZhbHVlcyBvZiB0aGUgcm90YXRpb24gcmF0ZS5cbiAgICAgKiAoY29taW5nIHNvb24sIHdhaXRpbmcgZm9yIGEgYnVnIG9uIENocm9tZSB0byBiZSByZXNvbHZlZClcbiAgICAgKiBFc3RpbWF0ZXMgdGhlIHJvdGF0aW9uIHJhdGUgdmFsdWVzIGZyb20gYG9yaWVudGF0aW9uYCB2YWx1ZXMgaWZcbiAgICAgKiB0aGUgcm90YXRpb24gcmF0ZSByYXcgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlIG9uIHRoZSBkZXZpY2UuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5yb3RhdGlvblJhdGUgPSBuZXcgRE9NRXZlbnRTdWJtb2R1bGUodGhpcywgJ3JvdGF0aW9uUmF0ZScpO1xuXG4gICAgLyoqXG4gICAgICogUmVxdWlyZWQgc3VibW9kdWxlcyAvIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtib29sfSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcyBhcmUgcmVxdWlyZWQgb3Igbm90IChkZWZhdWx0cyB0byBgZmFsc2VgKS5cbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IGFjY2VsZXJhdGlvbiAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBgYWNjZWxlcmF0aW9uYCB1bmlmaWVkIHZhbHVlcyBhcmUgcmVxdWlyZWQgb3Igbm90IChkZWZhdWx0cyB0byBgZmFsc2VgKS5cbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IHJvdGF0aW9uUmF0ZSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBgcm90YXRpb25SYXRlYCB1bmlmaWVkIHZhbHVlcyBhcmUgcmVxdWlyZWQgb3Igbm90IChkZWZhdWx0cyB0byBgZmFsc2VgKS5cbiAgICAgKi9cbiAgICB0aGlzLnJlcXVpcmVkID0ge1xuICAgICAgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eTogZmFsc2UsXG4gICAgICBhY2NlbGVyYXRpb246IGZhbHNlLFxuICAgICAgcm90YXRpb25SYXRlOiBmYWxzZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBOdW1iZXIgb2YgbGlzdGVuZXJzIHN1YnNjcmliZWQgdG8gdGhlIGBEZXZpY2VNb3Rpb25gIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5fbnVtTGlzdGVuZXJzID0gMDtcblxuICAgIC8qKlxuICAgICAqIFJlc29sdmUgZnVuY3Rpb24gb2YgdGhlIG1vZHVsZSdzIHByb21pc2UuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqIEBzZWUgRGV2aWNlTW90aW9uTW9kdWxlI2luaXRcbiAgICAgKi9cbiAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBVbmlmeWluZyBmYWN0b3Igb2YgdGhlIG1vdGlvbiBkYXRhIHZhbHVlcyAoYDFgIG9uIEFuZHJvaWQsIGAtMWAgb24gaU9TKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5fdW5pZnlNb3Rpb25EYXRhID0gKHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycgPyAtMSA6IDEpO1xuXG4gICAgLyoqXG4gICAgICogVW5pZnlpbmcgZmFjdG9yIG9mIHRoZSBwZXJpb2QgKGAwLjAwMWAgb24gQW5kcm9pZCwgYDFgIG9uIGlPUykuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX3VuaWZ5UGVyaW9kID0gKHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ0FuZHJvaWQnID8gMC4wMDEgOiAxKTtcblxuICAgIC8qKlxuICAgICAqIEFjY2VsZXJhdGlvbiBjYWxjdWxhdGVkIGZyb20gdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb24gPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBUaW1lIGNvbnN0YW50IChoYWxmLWxpZmUpIG9mIHRoZSBoaWdoLXBhc3MgZmlsdGVyIHVzZWQgdG8gc21vb3RoIHRoZSBhY2NlbGVyYXRpb24gdmFsdWVzIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYWNjZWxlcmF0aW9uIGluY2x1ZGluZyBncmF2aXR5IHJhdyB2YWx1ZXMgKGluIHNlY29uZHMpLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAwLjFcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uVGltZUNvbnN0YW50ID0gMC4xO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWUsIHVzZWQgaW4gdGhlIGhpZ2gtcGFzcyBmaWx0ZXIgdG8gY2FsY3VsYXRlIHRoZSBhY2NlbGVyYXRpb24gKGlmIHRoZSBgYWNjZWxlcmF0aW9uYCB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSBgJ2RldmljZW1vdGlvbidgKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIFJvdGF0aW9uIHJhdGUgY2FsY3VsYXRlZCBmcm9tIHRoZSBvcmllbnRhdGlvbiB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZSA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIExhdGVzdCBvcmllbnRhdGlvbiB2YWx1ZSwgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHJvdGF0aW9uIHJhdGUgIChpZiB0aGUgYHJvdGF0aW9uUmF0ZWAgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgYCdkZXZpY2Vtb3Rpb24nYCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IG9yaWVudGF0aW9uIHRpbWVzdGFtcHMsIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSByb3RhdGlvbiByYXRlIChpZiB0aGUgYHJvdGF0aW9uUmF0ZWAgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgYCdkZXZpY2Vtb3Rpb24nYCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCBiaW5kaW5nIG9mIHRoZSBzZW5zb3IgY2hlY2suXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICovXG4gICAgdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2sgPSB0aGlzLl9kZXZpY2Vtb3Rpb25DaGVjay5iaW5kKHRoaXMpO1xuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIGJpbmRpbmcgb2YgdGhlIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgY2FsbGJhY2suXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICovXG4gICAgdGhpcy5fZGV2aWNlbW90aW9uTGlzdGVuZXIgPSB0aGlzLl9kZXZpY2Vtb3Rpb25MaXN0ZW5lci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlY2F5IGZhY3RvciBvZiB0aGUgaGlnaC1wYXNzIGZpbHRlciB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgYWNjZWxlcmF0aW9uIGZyb20gdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWVzLlxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBfY2FsY3VsYXRlZEFjY2VsZXJhdGlvbkRlY2F5KCkge1xuICAgIHJldHVybiBNYXRoLmV4cCgtMiAqIE1hdGguUEkgKiB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkucGVyaW9kIC8gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblRpbWVDb25zdGFudCk7XG4gIH1cblxuICAvKipcbiAgICogU2Vuc29yIGNoZWNrIG9uIGluaXRpYWxpemF0aW9uIG9mIHRoZSBtb2R1bGUuXG4gICAqIFRoaXMgbWV0aG9kOlxuICAgKiAtIGNoZWNrcyB3aGV0aGVyIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIHRoZSBgYWNjZWxlcmF0aW9uYCxcbiAgICogICBhbmQgdGhlIGByb3RhdGlvblJhdGVgIHZhbHVlcyBhcmUgdmFsaWQgb3Igbm90O1xuICAgKiAtIGdldHMgdGhlIHBlcmlvZCBvZiB0aGUgYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBhbmQgc2V0cyB0aGUgcGVyaW9kIG9mXG4gICAqICAgdGhlIGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCwgYEFjY2VsZXJhdGlvbmAsIGFuZCBgUm90YXRpb25SYXRlYFxuICAgKiAgIHN1Ym1vZHVsZXM7XG4gICAqIC0gKGluIHRoZSBjYXNlIHdoZXJlIGFjY2VsZXJhdGlvbiByYXcgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQpXG4gICAqICAgaW5kaWNhdGVzIHdoZXRoZXIgdGhlIGFjY2VsZXJhdGlvbiBjYW4gYmUgY2FsY3VsYXRlZCBmcm9tIHRoZVxuICAgKiAgIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcyBvciBub3QuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBUaGUgZmlyc3QgYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBjYXVnaHQuXG4gICAqL1xuICBfZGV2aWNlbW90aW9uQ2hlY2soZSkge1xuICAgIHRoaXMuaXNQcm92aWRlZCA9IHRydWU7XG4gICAgdGhpcy5wZXJpb2QgPSBlLmludGVydmFsIC8gMTAwMDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHlcbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNQcm92aWRlZCA9IChcbiAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogPT09ICdudW1iZXInKVxuICAgICk7XG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSBhY2NlbGVyYXRpb25cbiAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkID0gKFxuICAgICAgZS5hY2NlbGVyYXRpb24gJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb24ueCA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uLnkgPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbi56ID09PSAnbnVtYmVyJylcbiAgICApO1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uLnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSByb3RhdGlvbiByYXRlXG4gICAgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZCA9IChcbiAgICAgIGUucm90YXRpb25SYXRlICYmXG4gICAgICAodHlwZW9mIGUucm90YXRpb25SYXRlLmFscGhhID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5yb3RhdGlvblJhdGUuYmV0YSA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUucm90YXRpb25SYXRlLmdhbW1hID09PSAnbnVtYmVyJylcbiAgICApO1xuICAgIHRoaXMucm90YXRpb25SYXRlLnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIFdlIG9ubHkgbmVlZCB0byBsaXN0ZW4gdG8gb25lIGV2ZW50ICg9PiByZW1vdmUgdGhlIGxpc3RlbmVyKVxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCB0aGlzLl9kZXZpY2Vtb3Rpb25DaGVjaywgZmFsc2UpO1xuXG4gICAgLy8gSWYgYWNjZWxlcmF0aW9uIGlzIG5vdCBwcm92aWRlZCBieSByYXcgc2Vuc29ycywgaW5kaWNhdGUgd2hldGhlciBpdFxuICAgIC8vIGNhbiBiZSBjYWxjdWxhdGVkIHdpdGggYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIG9yIG5vdFxuICAgIGlmICghdGhpcy5hY2NlbGVyYXRpb24uaXNQcm92aWRlZClcbiAgICAgIHRoaXMuYWNjZWxlcmF0aW9uLmlzQ2FsY3VsYXRlZCA9IHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1Byb3ZpZGVkO1xuXG4gICAgLy8gV0FSTklOR1xuICAgIC8vIFRoZSBsaW5lcyBvZiBjb2RlIGJlbG93IGFyZSBjb21tZW50ZWQgYmVjYXVzZSBvZiBhIGJ1ZyBvZiBDaHJvbWVcbiAgICAvLyBvbiBzb21lIEFuZHJvaWQgZGV2aWNlcywgd2hlcmUgJ2RldmljZW1vdGlvbicgZXZlbnRzIGFyZSBub3Qgc2VudFxuICAgIC8vIG9yIGNhdWdodCBpZiB0aGUgbGlzdGVuZXIgaXMgc2V0IHVwIGFmdGVyIGEgJ2RldmljZW9yaWVudGF0aW9uJ1xuICAgIC8vIGxpc3RlbmVyLiBIZXJlLCB0aGUgX3RyeU9yaWVudGF0aW9uRmFsbGJhY2sgbWV0aG9kIHdvdWxkIGFkZCBhXG4gICAgLy8gJ2RldmljZW9yaWVudGF0aW9uJyBsaXN0ZW5lciBhbmQgYmxvY2sgYWxsIHN1YnNlcXVlbnQgJ2RldmljZW1vdGlvbidcbiAgICAvLyBldmVudHMgb24gdGhlc2UgZGV2aWNlcy4gQ29tbWVudHMgd2lsbCBiZSByZW1vdmVkIG9uY2UgdGhlIGJ1ZyBvZlxuICAgIC8vIENocm9tZSBpcyBjb3JyZWN0ZWQuXG5cbiAgICAvLyBpZiAodGhpcy5yZXF1aXJlZC5yb3RhdGlvblJhdGUgJiYgIXRoaXMucm90YXRpb25SYXRlLmlzUHJvdmlkZWQpXG4gICAgLy8gICB0aGlzLl90cnlPcmllbnRhdGlvbkZhbGxiYWNrKCk7XG4gICAgLy8gZWxzZVxuICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgY2FsbGJhY2suXG4gICAqIFRoaXMgbWV0aG9kIGVtaXRzIGFuIGV2ZW50IHdpdGggdGhlIHJhdyBgJ2RldmljZW1vdGlvbidgIHZhbHVlcywgYW5kIGVtaXRzXG4gICAqIGV2ZW50cyB3aXRoIHRoZSB1bmlmaWVkIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCwgYGFjY2VsZXJhdGlvbmAsXG4gICAqIGFuZCAvIG9yIGByb3RhdGlvblJhdGVgIHZhbHVlcyBpZiB0aGV5IGFyZSByZXF1aXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2RldmljZW1vdGlvbkxpc3RlbmVyKGUpIHtcbiAgICAvLyAnZGV2aWNlbW90aW9uJyBldmVudCAocmF3IHZhbHVlcylcbiAgICB0aGlzLl9lbWl0RGV2aWNlTW90aW9uRXZlbnQoZSk7XG5cbiAgICAvLyAnYWNjZWxlcmF0aW9uJyBldmVudCAodW5pZmllZCB2YWx1ZXMpXG4gICAgaWYgKHRoaXMucmVxdWlyZWQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAmJiB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZClcbiAgICAgIHRoaXMuX2VtaXRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RXZlbnQoZSk7XG5cbiAgICAvLyAnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIGlmICh0aGlzLnJlcXVpcmVkLmFjY2VsZXJhdGlvbiAmJiB0aGlzLmFjY2VsZXJhdGlvbi5pc1ZhbGlkKSAvLyB0aGUgZmFsbGJhY2sgY2FsY3VsYXRpb24gb2YgdGhlIGFjY2VsZXJhdGlvbiBoYXBwZW5zIGluIHRoZSBgX2VtaXRBY2NlbGVyYXRpb25gIG1ldGhvZCwgc28gd2UgY2hlY2sgaWYgdGhpcy5hY2NlbGVyYXRpb24uaXNWYWxpZFxuICAgICAgdGhpcy5fZW1pdEFjY2VsZXJhdGlvbkV2ZW50KGUpO1xuXG4gICAgLy8gJ3JvdGF0aW9uUmF0ZScgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIGlmICh0aGlzLnJlcXVpcmVkLnJvdGF0aW9uUmF0ZSAmJiB0aGlzLnJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkKSAvLyB0aGUgZmFsbGJhY2sgY2FsY3VsYXRpb24gb2YgdGhlIHJvdGF0aW9uIHJhdGUgZG9lcyBOT1QgaGFwcGVuIGluIHRoZSBgX2VtaXRSb3RhdGlvblJhdGVgIG1ldGhvZCwgc28gd2Ugb25seSBjaGVjayBpZiB0aGlzLnJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkXG4gICAgICB0aGlzLl9lbWl0Um90YXRpb25SYXRlRXZlbnQoZSk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIGAnZGV2aWNlbW90aW9uJ2AgcmF3IHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2VtaXREZXZpY2VNb3Rpb25FdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5ldmVudDtcblxuICAgIGlmIChlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpIHtcbiAgICAgIG91dEV2ZW50WzBdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lng7XG4gICAgICBvdXRFdmVudFsxXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55O1xuICAgICAgb3V0RXZlbnRbMl0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuejtcbiAgICB9XG5cbiAgICBpZiAoZS5hY2NlbGVyYXRpb24pIHtcbiAgICAgIG91dEV2ZW50WzNdID0gZS5hY2NlbGVyYXRpb24ueDtcbiAgICAgIG91dEV2ZW50WzRdID0gZS5hY2NlbGVyYXRpb24ueTtcbiAgICAgIG91dEV2ZW50WzVdID0gZS5hY2NlbGVyYXRpb24uejtcbiAgICB9XG5cbiAgICBpZiAoZS5yb3RhdGlvblJhdGUpIHtcbiAgICAgIG91dEV2ZW50WzZdID0gZS5yb3RhdGlvblJhdGUuYWxwaGE7XG4gICAgICBvdXRFdmVudFs3XSA9IGUucm90YXRpb25SYXRlLmJldGE7XG4gICAgICBvdXRFdmVudFs4XSA9IGUucm90YXRpb25SYXRlLmdhbW1hO1xuICAgIH1cblxuICAgIHRoaXMuZW1pdChvdXRFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2VtaXRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RXZlbnQoZSkge1xuICAgIGxldCBvdXRFdmVudCA9IHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5ldmVudDtcblxuICAgIG91dEV2ZW50WzBdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnggKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgb3V0RXZlbnRbMV0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueSAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICBvdXRFdmVudFsyXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuXG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmVtaXQob3V0RXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBgYWNjZWxlcmF0aW9uYCB1bmlmaWVkIHZhbHVlcy5cbiAgICogV2hlbiB0aGUgYGFjY2VsZXJhdGlvbmAgcmF3IHZhbHVlcyBhcmUgbm90IGF2YWlsYWJsZSwgdGhlIG1ldGhvZFxuICAgKiBhbHNvIGNhbGN1bGF0ZXMgdGhlIGFjY2VsZXJhdGlvbiBmcm9tIHRoZVxuICAgKiBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIFRoZSBgJ2RldmljZW1vdGlvbidgIGV2ZW50LlxuICAgKi9cbiAgX2VtaXRBY2NlbGVyYXRpb25FdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5hY2NlbGVyYXRpb24uZXZlbnQ7XG5cbiAgICBpZiAodGhpcy5hY2NlbGVyYXRpb24uaXNQcm92aWRlZCkge1xuICAgICAgLy8gSWYgcmF3IGFjY2VsZXJhdGlvbiB2YWx1ZXMgYXJlIHByb3ZpZGVkXG4gICAgICBvdXRFdmVudFswXSA9IGUuYWNjZWxlcmF0aW9uLnggKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgICBvdXRFdmVudFsxXSA9IGUuYWNjZWxlcmF0aW9uLnkgKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGUuYWNjZWxlcmF0aW9uLnogKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgfSBlbHNlIGlmICh0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZCkge1xuICAgICAgLy8gT3RoZXJ3aXNlLCBpZiBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IHZhbHVlcyBhcmUgcHJvdmlkZWQsXG4gICAgICAvLyBlc3RpbWF0ZSB0aGUgYWNjZWxlcmF0aW9uIHdpdGggYSBoaWdoLXBhc3MgZmlsdGVyXG4gICAgICBjb25zdCBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ID0gW1xuICAgICAgICBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YSxcbiAgICAgICAgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnkgKiB0aGlzLl91bmlmeU1vdGlvbkRhdGEsXG4gICAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhXG4gICAgICBdO1xuICAgICAgY29uc3QgayA9IHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25EZWNheTtcblxuICAgICAgLy8gSGlnaC1wYXNzIGZpbHRlciB0byBlc3RpbWF0ZSB0aGUgYWNjZWxlcmF0aW9uICh3aXRob3V0IHRoZSBncmF2aXR5KVxuICAgICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblswXSA9ICgxICsgaykgKiAwLjUgKiAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXSAtIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdKSArIGsgKiB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzBdO1xuICAgICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsxXSA9ICgxICsgaykgKiAwLjUgKiAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXSAtIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdKSArIGsgKiB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzFdO1xuICAgICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsyXSA9ICgxICsgaykgKiAwLjUgKiAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXSAtIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdKSArIGsgKiB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzJdO1xuXG4gICAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXSA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF07XG4gICAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXSA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV07XG4gICAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXSA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl07XG5cbiAgICAgIG91dEV2ZW50WzBdID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblswXTtcbiAgICAgIG91dEV2ZW50WzFdID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsxXTtcbiAgICAgIG91dEV2ZW50WzJdID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsyXTtcbiAgICB9XG5cbiAgICB0aGlzLmFjY2VsZXJhdGlvbi5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYHJvdGF0aW9uUmF0ZWAgdW5pZmllZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICovXG4gIF9lbWl0Um90YXRpb25SYXRlRXZlbnQoZSkge1xuICAgIGxldCBvdXRFdmVudCA9IHRoaXMucm90YXRpb25SYXRlLmV2ZW50O1xuXG4gICAgb3V0RXZlbnRbMF0gPSBlLnJvdGF0aW9uUmF0ZS5hbHBoYTtcbiAgICBvdXRFdmVudFsxXSA9IGUucm90YXRpb25SYXRlLmJldGE7XG4gICAgb3V0RXZlbnRbMl0gPSBlLnJvdGF0aW9uUmF0ZS5nYW1tYTtcblxuICAgIC8vIFRPRE8oPyk6IHVuaWZ5XG5cbiAgICB0aGlzLnJvdGF0aW9uUmF0ZS5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGFuZCBlbWl0cyB0aGUgYHJvdGF0aW9uUmF0ZWAgdW5pZmllZCB2YWx1ZXMgZnJvbSB0aGUgYG9yaWVudGF0aW9uYCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyW119IG9yaWVudGF0aW9uIC0gTGF0ZXN0IGBvcmllbnRhdGlvbmAgcmF3IHZhbHVlcy5cbiAgICovXG4gIF9jYWxjdWxhdGVSb3RhdGlvblJhdGVGcm9tT3JpZW50YXRpb24ob3JpZW50YXRpb24pIHtcbiAgICBjb25zdCBub3cgPSBnZXRMb2NhbFRpbWUoKTtcbiAgICBjb25zdCBrID0gMC44OyAvLyBUT0RPOiBpbXByb3ZlIGxvdyBwYXNzIGZpbHRlciAoZnJhbWVzIGFyZSBub3QgcmVndWxhcilcbiAgICBjb25zdCBhbHBoYUlzVmFsaWQgPSAodHlwZW9mIG9yaWVudGF0aW9uWzBdID09PSAnbnVtYmVyJyk7XG5cbiAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wKSB7XG4gICAgICBsZXQgckFscGhhID0gbnVsbDtcbiAgICAgIGxldCByQmV0YTtcbiAgICAgIGxldCByR2FtbWE7XG5cbiAgICAgIGxldCBhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAwO1xuICAgICAgbGV0IGJldGFEaXNjb250aW51aXR5RmFjdG9yID0gMDtcbiAgICAgIGxldCBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAwO1xuXG4gICAgICBjb25zdCBkZWx0YVQgPSBub3cgLSB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXA7XG5cbiAgICAgIGlmIChhbHBoYUlzVmFsaWQpIHtcbiAgICAgICAgLy8gYWxwaGEgZGlzY29udGludWl0eSAoKzM2MCAtPiAwIG9yIDAgLT4gKzM2MClcbiAgICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSA+IDMyMCAmJiBvcmllbnRhdGlvblswXSA8IDQwKVxuICAgICAgICAgIGFscGhhRGlzY29udGludWl0eUZhY3RvciA9IDM2MDtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdIDwgNDAgJiYgb3JpZW50YXRpb25bMF0gPiAzMjApXG4gICAgICAgICAgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yID0gLTM2MDtcbiAgICAgIH1cblxuICAgICAgLy8gYmV0YSBkaXNjb250aW51aXR5ICgrMTgwIC0+IC0xODAgb3IgLTE4MCAtPiArMTgwKVxuICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSA+IDE0MCAmJiBvcmllbnRhdGlvblsxXSA8IC0xNDApXG4gICAgICAgIGJldGFEaXNjb250aW51aXR5RmFjdG9yID0gMzYwO1xuICAgICAgZWxzZSBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzFdIDwgLTE0MCAmJiBvcmllbnRhdGlvblsxXSA+IDE0MClcbiAgICAgICAgYmV0YURpc2NvbnRpbnVpdHlGYWN0b3IgPSAtMzYwO1xuXG4gICAgICAvLyBnYW1tYSBkaXNjb250aW51aXRpZXMgKCsxODAgLT4gLTE4MCBvciAtMTgwIC0+ICsxODApXG4gICAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdID4gNTAgJiYgb3JpZW50YXRpb25bMl0gPCAtNTApXG4gICAgICAgIGdhbW1hRGlzY29udGludWl0eUZhY3RvciA9IDE4MDtcbiAgICAgIGVsc2UgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSA8IC01MCAmJiBvcmllbnRhdGlvblsyXSA+IDUwKVxuICAgICAgICBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAtMTgwO1xuXG4gICAgICBpZiAoZGVsdGFUID4gMCkge1xuICAgICAgICAvLyBMb3cgcGFzcyBmaWx0ZXIgdG8gc21vb3RoIHRoZSBkYXRhXG4gICAgICAgIGlmIChhbHBoYUlzVmFsaWQpXG4gICAgICAgICAgckFscGhhID0gayAqIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMF0gKyAoMSAtIGspICogKG9yaWVudGF0aW9uWzBdIC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdICsgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcbiAgICAgICAgckJldGEgPSBrICogdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVsxXSArICgxIC0gaykgKiAob3JpZW50YXRpb25bMV0gLSB0aGlzLl9sYXN0T3JpZW50YXRpb25bMV0gKyBiZXRhRGlzY29udGludWl0eUZhY3RvcikgLyBkZWx0YVQ7XG4gICAgICAgIHJHYW1tYSA9IGsgKiB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzJdICsgKDEgLSBrKSAqIChvcmllbnRhdGlvblsyXSAtIHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSArIGdhbW1hRGlzY29udGludWl0eUZhY3RvcikgLyBkZWx0YVQ7XG5cbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVswXSA9IHJBbHBoYTtcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVsxXSA9IHJCZXRhO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzJdID0gckdhbW1hO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPOiByZXNhbXBsZSB0aGUgZW1pc3Npb24gcmF0ZSB0byBtYXRjaCB0aGUgZGV2aWNlbW90aW9uIHJhdGVcbiAgICAgIHRoaXMucm90YXRpb25SYXRlLmVtaXQodGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wID0gbm93O1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSA9IG9yaWVudGF0aW9uWzBdO1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSA9IG9yaWVudGF0aW9uWzFdO1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSA9IG9yaWVudGF0aW9uWzJdO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSByb3RhdGlvbiByYXRlIGNhbiBiZSBjYWxjdWxhdGVkIGZyb20gdGhlIGBvcmllbnRhdGlvbmAgdmFsdWVzIG9yIG5vdC5cbiAgICovXG4gIF90cnlPcmllbnRhdGlvbkZhbGxiYWNrKCkge1xuICAgIE1vdGlvbklucHV0LnJlcXVpcmVNb2R1bGUoJ29yaWVudGF0aW9uJylcbiAgICAgIC50aGVuKChvcmllbnRhdGlvbikgPT4ge1xuICAgICAgICBpZiAob3JpZW50YXRpb24uaXNWYWxpZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiV0FSTklORyAobW90aW9uLWlucHV0KTogVGhlICdkZXZpY2Vtb3Rpb24nIGV2ZW50IGRvZXMgbm90IGV4aXN0cyBvciBkb2VzIG5vdCBwcm92aWRlIHJvdGF0aW9uIHJhdGUgdmFsdWVzIGluIHlvdXIgYnJvd3Nlciwgc28gdGhlIHJvdGF0aW9uIHJhdGUgb2YgdGhlIGRldmljZSBpcyBlc3RpbWF0ZWQgZnJvbSB0aGUgJ29yaWVudGF0aW9uJywgY2FsY3VsYXRlZCBmcm9tIHRoZSAnZGV2aWNlb3JpZW50YXRpb24nIGV2ZW50LiBTaW5jZSB0aGUgY29tcGFzcyBtaWdodCBub3QgYmUgYXZhaWxhYmxlLCBvbmx5IGBiZXRhYCBhbmQgYGdhbW1hYCBhbmdsZXMgbWF5IGJlIHByb3ZpZGVkIChgYWxwaGFgIHdvdWxkIGJlIG51bGwpLlwiKTtcblxuICAgICAgICAgIHRoaXMucm90YXRpb25SYXRlLmlzQ2FsY3VsYXRlZCA9IHRydWU7XG5cbiAgICAgICAgICBNb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcignb3JpZW50YXRpb24nLCAob3JpZW50YXRpb24pID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVJvdGF0aW9uUmF0ZUZyb21PcmllbnRhdGlvbihvcmllbnRhdGlvbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSh0aGlzKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEluY3JlYXNlcyB0aGUgbnVtYmVyIG9mIGxpc3RlbmVycyB0byB0aGlzIG1vZHVsZSAoZWl0aGVyIGJlY2F1c2Ugc29tZW9uZSBsaXN0ZW5zXG4gICAqIHRvIHRoaXMgbW9kdWxlLCBvciBvbmUgb2YgdGhlIHRocmVlIGBET01FdmVudFN1Ym1vZHVsZXNgXG4gICAqIChgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIGBBY2NlbGVyYXRpb25gLCBgUm90YXRpb25SYXRlYCkuXG4gICAqIFdoZW4gdGhlIG51bWJlciBvZiBsaXN0ZW5lcnMgcmVhY2hlcyBgMWAsIGFkZHMgYSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGxpc3RlbmVyLlxuICAgKlxuICAgKiBAc2VlIERldmljZU1vdGlvbk1vZHVsZSNhZGRMaXN0ZW5lclxuICAgKiBAc2VlIERPTUV2ZW50U3VibW9kdWxlI3N0YXJ0XG4gICAqL1xuICBfYWRkTGlzdGVuZXIoKSB7XG4gICAgdGhpcy5fbnVtTGlzdGVuZXJzKys7XG5cbiAgICBpZiAodGhpcy5fbnVtTGlzdGVuZXJzID09PSAxKVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW1vdGlvbicsIHRoaXMuX2RldmljZW1vdGlvbkxpc3RlbmVyLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogRGVjcmVhc2VzIHRoZSBudW1iZXIgb2YgbGlzdGVuZXJzIHRvIHRoaXMgbW9kdWxlIChlaXRoZXIgYmVjYXVzZSBzb21lb25lIHN0b3BzXG4gICAqIGxpc3RlbmluZyB0byB0aGlzIG1vZHVsZSwgb3Igb25lIG9mIHRoZSB0aHJlZSBgRE9NRXZlbnRTdWJtb2R1bGVzYFxuICAgKiAoYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCBgQWNjZWxlcmF0aW9uYCwgYFJvdGF0aW9uUmF0ZWApLlxuICAgKiBXaGVuIHRoZSBudW1iZXIgb2YgbGlzdGVuZXJzIHJlYWNoZXMgYDBgLCByZW1vdmVzIHRoZSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGxpc3RlbmVyLlxuICAgKlxuICAgKiBAc2VlIERldmljZU1vdGlvbk1vZHVsZSNyZW1vdmVMaXN0ZW5lclxuICAgKiBAc2VlIERPTUV2ZW50U3VibW9kdWxlI3N0b3BcbiAgICovXG4gIF9yZW1vdmVMaXN0ZW5lcigpIHtcbiAgICB0aGlzLl9udW1MaXN0ZW5lcnMtLTtcblxuICAgIGlmICh0aGlzLl9udW1MaXN0ZW5lcnMgPT09IDApXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgdGhpcy5fZGV2aWNlbW90aW9uTGlzdGVuZXIsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtwcm9taXNlfVxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gc3VwZXIuaW5pdCgocmVzb2x2ZSkgPT4ge1xuICAgICAgdGhpcy5fcHJvbWlzZVJlc29sdmUgPSByZXNvbHZlO1xuXG4gICAgICBpZiAod2luZG93LkRldmljZU1vdGlvbkV2ZW50KVxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2ssIGZhbHNlKTtcblxuICAgICAgLy8gV0FSTklOR1xuICAgICAgLy8gVGhlIGxpbmVzIG9mIGNvZGUgYmVsb3cgYXJlIGNvbW1lbnRlZCBiZWNhdXNlIG9mIGEgYnVnIG9mIENocm9tZVxuICAgICAgLy8gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHdoZXJlICdkZXZpY2Vtb3Rpb24nIGV2ZW50cyBhcmUgbm90IHNlbnRcbiAgICAgIC8vIG9yIGNhdWdodCBpZiB0aGUgbGlzdGVuZXIgaXMgc2V0IHVwIGFmdGVyIGEgJ2RldmljZW9yaWVudGF0aW9uJ1xuICAgICAgLy8gbGlzdGVuZXIuIEhlcmUsIHRoZSBfdHJ5T3JpZW50YXRpb25GYWxsYmFjayBtZXRob2Qgd291bGQgYWRkIGFcbiAgICAgIC8vICdkZXZpY2VvcmllbnRhdGlvbicgbGlzdGVuZXIgYW5kIGJsb2NrIGFsbCBzdWJzZXF1ZW50ICdkZXZpY2Vtb3Rpb24nXG4gICAgICAvLyBldmVudHMgb24gdGhlc2UgZGV2aWNlcy4gQ29tbWVudHMgd2lsbCBiZSByZW1vdmVkIG9uY2UgdGhlIGJ1ZyBvZlxuICAgICAgLy8gQ2hyb21lIGlzIGNvcnJlY3RlZC5cblxuICAgICAgLy8gZWxzZSBpZiAodGhpcy5yZXF1aXJlZC5yb3RhdGlvblJhdGUpXG4gICAgICAvLyB0aGlzLl90cnlPcmllbnRhdGlvbkZhbGxiYWNrKCk7XG5cbiAgICAgIGVsc2VcbiAgICAgICAgcmVzb2x2ZSh0aGlzKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdG8gdGhpcyBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIC0gTGlzdGVuZXIgdG8gYWRkLlxuICAgKi9cbiAgYWRkTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICBzdXBlci5hZGRMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgdGhpcy5fYWRkTGlzdGVuZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSB0aGlzIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgLSBMaXN0ZW5lciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIHN1cGVyLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBEZXZpY2VNb3Rpb25Nb2R1bGUoKTtcbiJdfQ==