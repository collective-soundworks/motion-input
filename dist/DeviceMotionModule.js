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

var chromeRegExp = /Chrome/;
var toDeg = 180 / Math.PI;

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
     * Unifying factor of the period (`1` on Android, `1` on iOS). in sec
     * @todo - unify with e.interval specification (in ms) ?
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

    _this._checkCounter = 0;
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

      // in firefox android, accelerationIncludingGravity retrieve null values
      // on the first callback. so wait a second call to be sure.
      if (_platform2.default.os.family === 'Android' && /Firefox/.test(_platform2.default.name) && this._checkCounter < 1) {
        this._checkCounter++;
      } else {
        // now that the sensors are checked, replace the process function with
        // the final listener
        this._processFunction = this._devicemotionListener;

        // if acceleration is not provided by raw sensors, indicate whether it
        // can be calculated with `accelerationincludinggravity` or not
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

      // alert(`${this.accelerationIncludingGravity.listeners.size} -
      //     ${this.required.accelerationIncludingGravity} -
      //     ${this.accelerationIncludingGravity.isValid}
      // `);

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

      // In all platforms, rotation axes are messed up according to the spec
      // https://w3c.github.io/deviceorientation/spec-source-orientation.html
      //
      // gamma should be alpha
      // alpha should be beta
      // beta should be gamma

      outEvent[0] = e.rotationRate.gamma;
      outEvent[1] = e.rotationRate.alpha, outEvent[2] = e.rotationRate.beta;

      // Chrome Android retrieve values that are in rad/s
      // cf. https://bugs.chromium.org/p/chromium/issues/detail?id=541607
      //
      // From spec: "The rotationRate attribute must be initialized with the rate
      // of rotation of the hosting device in space. It must be expressed as the
      // rate of change of the angles defined in section 4.1 and must be expressed
      // in degrees per second (deg/s)."
      if (_platform2.default.os.name === 'Android' && chromeRegExp.test(_platform2.default.name)) {
        outEvent[0] *= toDeg;
        outEvent[1] *= toDeg, outEvent[2] *= toDeg;
      }

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
     *
     * @todo - this should be reviewed to comply with the axis order defined
     *  in the spec
     */
    // WARNING
    // The lines of code below are commented because of a bug of Chrome
    // on some Android devices, where 'devicemotion' events are not sent
    // or caught if the listener is set up after a 'deviceorientation'
    // listener. Here, the _tryOrientationFallback method would add a
    // 'deviceorientation' listener and block all subsequent 'devicemotion'
    // events on these devices. Comments will be removed once the bug of
    // Chrome is corrected.
    // _tryOrientationFallback() {
    //   MotionInput.requireModule('orientation')
    //     .then((orientation) => {
    //       if (orientation.isValid) {
    //         console.log(`
    //           WARNING (motion-input): The 'devicemotion' event does not exists or
    //           does not provide rotation rate values in your browser, so the rotation
    //           rate of the device is estimated from the 'orientation', calculated
    //           from the 'deviceorientation' event. Since the compass might not
    //           be available, only \`beta\` and \`gamma\` angles may be provided
    //           (\`alpha\` would be null).`
    //         );

    //         this.rotationRate.isCalculated = true;

    //         MotionInput.addListener('orientation', (orientation) => {
    //           this._calculateRotationRateFromOrientation(orientation);
    //         });
    //       }

    //       this._promiseResolve(this);
    //     });
    // }

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
      var _this2 = this;

      return _get(DeviceMotionModule.prototype.__proto__ || Object.getPrototypeOf(DeviceMotionModule.prototype), 'init', this).call(this, function (resolve) {
        _this2._promiseResolve = resolve;

        if (window.DeviceMotionEvent) {
          _this2._processFunction = _this2._devicemotionCheck;
          window.addEventListener('devicemotion', _this2._process);
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

        else resolve(_this2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRldmljZU1vdGlvbk1vZHVsZS5qcyJdLCJuYW1lcyI6WyJnZXRMb2NhbFRpbWUiLCJ3aW5kb3ciLCJwZXJmb3JtYW5jZSIsIm5vdyIsIkRhdGUiLCJjaHJvbWVSZWdFeHAiLCJ0b0RlZyIsIk1hdGgiLCJQSSIsIkRldmljZU1vdGlvbk1vZHVsZSIsImV2ZW50IiwiYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSIsImFjY2VsZXJhdGlvbiIsInJvdGF0aW9uUmF0ZSIsInJlcXVpcmVkIiwiX3Byb21pc2VSZXNvbHZlIiwiX3VuaWZ5TW90aW9uRGF0YSIsIm9zIiwiZmFtaWx5IiwiX3VuaWZ5UGVyaW9kIiwiX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb24iLCJfY2FsY3VsYXRlZEFjY2VsZXJhdGlvblRpbWVDb25zdGFudCIsIl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSIsIl9jYWxjdWxhdGVkUm90YXRpb25SYXRlIiwiX2xhc3RPcmllbnRhdGlvbiIsIl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXAiLCJfcHJvY2Vzc0Z1bmN0aW9uIiwiX3Byb2Nlc3MiLCJiaW5kIiwiX2RldmljZW1vdGlvbkNoZWNrIiwiX2RldmljZW1vdGlvbkxpc3RlbmVyIiwiX2NoZWNrQ291bnRlciIsImUiLCJpc1Byb3ZpZGVkIiwicGVyaW9kIiwiaW50ZXJ2YWwiLCJ4IiwieSIsInoiLCJhbHBoYSIsImJldGEiLCJnYW1tYSIsInRlc3QiLCJuYW1lIiwiaXNDYWxjdWxhdGVkIiwibGlzdGVuZXJzIiwic2l6ZSIsIl9lbWl0RGV2aWNlTW90aW9uRXZlbnQiLCJpc1ZhbGlkIiwiX2VtaXRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RXZlbnQiLCJfZW1pdEFjY2VsZXJhdGlvbkV2ZW50IiwiX2VtaXRSb3RhdGlvblJhdGVFdmVudCIsIm91dEV2ZW50IiwiZW1pdCIsImsiLCJfY2FsY3VsYXRlZEFjY2VsZXJhdGlvbkRlY2F5Iiwib3JpZW50YXRpb24iLCJhbHBoYUlzVmFsaWQiLCJyQWxwaGEiLCJyQmV0YSIsInJHYW1tYSIsImFscGhhRGlzY29udGludWl0eUZhY3RvciIsImJldGFEaXNjb250aW51aXR5RmFjdG9yIiwiZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yIiwiZGVsdGFUIiwiZGF0YSIsInJlc29sdmUiLCJEZXZpY2VNb3Rpb25FdmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJleHAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7OztBQU1BLFNBQVNBLFlBQVQsR0FBd0I7QUFDdEIsTUFBSUMsT0FBT0MsV0FBWCxFQUNFLE9BQU9ELE9BQU9DLFdBQVAsQ0FBbUJDLEdBQW5CLEtBQTJCLElBQWxDO0FBQ0YsU0FBT0MsS0FBS0QsR0FBTCxLQUFhLElBQXBCO0FBQ0Q7O0FBRUQsSUFBTUUsZUFBZSxRQUFyQjtBQUNBLElBQU1DLFFBQVEsTUFBTUMsS0FBS0MsRUFBekI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUJNQyxrQjs7O0FBRUo7Ozs7O0FBS0EsZ0NBQWM7QUFBQTs7QUFHWjs7Ozs7OztBQUhZLHdJQUNOLGNBRE07O0FBVVosVUFBS0MsS0FBTCxHQUFhLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLElBQS9CLEVBQXFDLElBQXJDLEVBQTJDLElBQTNDLEVBQWlELElBQWpELENBQWI7O0FBRUE7Ozs7Ozs7QUFPQSxVQUFLQyw0QkFBTCxHQUFvQyx1Q0FBNEIsOEJBQTVCLENBQXBDOztBQUVBOzs7Ozs7Ozs7O0FBVUEsVUFBS0MsWUFBTCxHQUFvQix1Q0FBNEIsY0FBNUIsQ0FBcEI7O0FBRUE7Ozs7Ozs7Ozs7QUFVQSxVQUFLQyxZQUFMLEdBQW9CLHVDQUE0QixjQUE1QixDQUFwQjs7QUFFQTs7Ozs7Ozs7O0FBU0EsVUFBS0MsUUFBTCxHQUFnQjtBQUNkSCxvQ0FBOEIsS0FEaEI7QUFFZEMsb0JBQWMs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O0FBQzVCLGlCQUFLekMsZ0JBQUwsR0FBd0IsT0FBS0csa0JBQTdCO0FBQ0E1QixpQkFBT21FLGdCQUFQLENBQXdCLGNBQXhCLEVBQXdDLE9BQUt6QyxRQUE3QztBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFmQSxhQWtCRXVDO0FBQ0gsT0F0QkQ7QUF1QkQ7Ozt3QkFuWWtDO0FBQ2pDLGFBQU8zRCxLQUFLOEQsR0FBTCxDQUFTLENBQUMsQ0FBRCxHQUFLOUQsS0FBS0MsRUFBVixHQUFlLEtBQUtHLDRCQUFMLENBQWtDdUIsTUFBakQsR0FBMEQsS0FBS2IsbUNBQXhFLENBQVA7QUFDRDs7Ozs7O2tCQW9ZWSxJQUFJWixrQkFBSixFIiwiZmlsZSI6IkRldmljZU1vdGlvbk1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJbnB1dE1vZHVsZSBmcm9tICcuL0lucHV0TW9kdWxlJztcbmltcG9ydCBET01FdmVudFN1Ym1vZHVsZSBmcm9tICcuL0RPTUV2ZW50U3VibW9kdWxlJztcbmltcG9ydCBNb3Rpb25JbnB1dCBmcm9tICcuL01vdGlvbklucHV0JztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICdwbGF0Zm9ybSc7XG5cbi8qKlxuICogR2V0cyB0aGUgY3VycmVudCBsb2NhbCB0aW1lIGluIHNlY29uZHMuXG4gKiBVc2VzIGB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClgIGlmIGF2YWlsYWJsZSwgYW5kIGBEYXRlLm5vdygpYCBvdGhlcndpc2UuXG4gKlxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBnZXRMb2NhbFRpbWUoKSB7XG4gIGlmICh3aW5kb3cucGVyZm9ybWFuY2UpXG4gICAgcmV0dXJuIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAvIDEwMDA7XG4gIHJldHVybiBEYXRlLm5vdygpIC8gMTAwMDtcbn1cblxuY29uc3QgY2hyb21lUmVnRXhwID0gL0Nocm9tZS87XG5jb25zdCB0b0RlZyA9IDE4MCAvIE1hdGguUEk7XG5cbi8qKlxuICogYERldmljZU1vdGlvbmAgbW9kdWxlIHNpbmdsZXRvbi5cbiAqIFRoZSBgRGV2aWNlTW90aW9uTW9kdWxlYCBzaW5nbGV0b24gcHJvdmlkZXMgdGhlIHJhdyB2YWx1ZXNcbiAqIG9mIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHksIGFjY2VsZXJhdGlvbiwgYW5kIHJvdGF0aW9uXG4gKiByYXRlIHByb3ZpZGVkIGJ5IHRoZSBgRGV2aWNlTW90aW9uYCBldmVudC5cbiAqIEl0IGFsc28gaW5zdGFudGlhdGUgdGhlIGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCxcbiAqIGBBY2NlbGVyYXRpb25gIGFuZCBgUm90YXRpb25SYXRlYCBzdWJtb2R1bGVzIHRoYXQgdW5pZnkgdGhvc2UgdmFsdWVzXG4gKiBhY3Jvc3MgcGxhdGZvcm1zIGJ5IG1ha2luZyB0aGVtIGNvbXBsaWFudCB3aXRoIHtAbGlua1xuICogaHR0cDovL3d3dy53My5vcmcvVFIvb3JpZW50YXRpb24tZXZlbnQvfHRoZSBXM0Mgc3RhbmRhcmR9LlxuICogV2hlbiByYXcgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgdGhlIHNlbnNvcnMsIHRoaXMgbW9kdWxlcyB0cmllc1xuICogdG8gcmVjYWxjdWxhdGUgdGhlbSBmcm9tIGF2YWlsYWJsZSB2YWx1ZXM6XG4gKiAtIGBhY2NlbGVyYXRpb25gIGlzIGNhbGN1bGF0ZWQgZnJvbSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWBcbiAqICAgd2l0aCBhIGhpZ2gtcGFzcyBmaWx0ZXI7XG4gKiAtIChjb21pbmcgc29vbiDigJQgd2FpdGluZyBmb3IgYSBidWcgb24gQ2hyb21lIHRvIGJlIHJlc29sdmVkKVxuICogICBgcm90YXRpb25SYXRlYCBpcyBjYWxjdWxhdGVkIGZyb20gYG9yaWVudGF0aW9uYC5cbiAqXG4gKiBAY2xhc3MgRGV2aWNlTW90aW9uTW9kdWxlXG4gKiBAZXh0ZW5kcyBJbnB1dE1vZHVsZVxuICovXG5jbGFzcyBEZXZpY2VNb3Rpb25Nb2R1bGUgZXh0ZW5kcyBJbnB1dE1vZHVsZSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGBEZXZpY2VNb3Rpb25gIG1vZHVsZSBpbnN0YW5jZS5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignZGV2aWNlbW90aW9uJyk7XG5cbiAgICAvKipcbiAgICAgKiBSYXcgdmFsdWVzIGNvbWluZyBmcm9tIHRoZSBgZGV2aWNlbW90aW9uYCBldmVudCBzZW50IGJ5IHRoaXMgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFtudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsXVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnQgPSBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIG1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyB1bmlmaWVkIHZhbHVlcyBvZiB0aGUgYWNjZWxlcmF0aW9uIGluY2x1ZGluZyBncmF2aXR5LlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBBY2NlbGVyYXRpb25gIHN1Ym1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyB1bmlmaWVkIHZhbHVlcyBvZiB0aGUgYWNjZWxlcmF0aW9uLlxuICAgICAqIEVzdGltYXRlcyB0aGUgYWNjZWxlcmF0aW9uIHZhbHVlcyBmcm9tIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YFxuICAgICAqIHJhdyB2YWx1ZXMgaWYgdGhlIGFjY2VsZXJhdGlvbiByYXcgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlIG9uIHRoZVxuICAgICAqIGRldmljZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKi9cbiAgICB0aGlzLmFjY2VsZXJhdGlvbiA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAnYWNjZWxlcmF0aW9uJyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYFJvdGF0aW9uUmF0ZWAgc3VibW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIHVuaWZpZWQgdmFsdWVzIG9mIHRoZSByb3RhdGlvbiByYXRlLlxuICAgICAqIChjb21pbmcgc29vbiwgd2FpdGluZyBmb3IgYSBidWcgb24gQ2hyb21lIHRvIGJlIHJlc29sdmVkKVxuICAgICAqIEVzdGltYXRlcyB0aGUgcm90YXRpb24gcmF0ZSB2YWx1ZXMgZnJvbSBgb3JpZW50YXRpb25gIHZhbHVlcyBpZlxuICAgICAqIHRoZSByb3RhdGlvbiByYXRlIHJhdyB2YWx1ZXMgYXJlIG5vdCBhdmFpbGFibGUgb24gdGhlIGRldmljZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKi9cbiAgICB0aGlzLnJvdGF0aW9uUmF0ZSA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAncm90YXRpb25SYXRlJyk7XG5cbiAgICAvKipcbiAgICAgKiBSZXF1aXJlZCBzdWJtb2R1bGVzIC8gZXZlbnRzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gYWNjZWxlcmF0aW9uIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGBhY2NlbGVyYXRpb25gIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gcm90YXRpb25SYXRlIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGByb3RhdGlvblJhdGVgIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqL1xuICAgIHRoaXMucmVxdWlyZWQgPSB7XG4gICAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5OiBmYWxzZSxcbiAgICAgIGFjY2VsZXJhdGlvbjogZmFsc2UsXG4gICAgICByb3RhdGlvblJhdGU6IGZhbHNlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlc29sdmUgZnVuY3Rpb24gb2YgdGhlIG1vZHVsZSdzIHByb21pc2UuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqIEBzZWUgRGV2aWNlTW90aW9uTW9kdWxlI2luaXRcbiAgICAgKi9cbiAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBVbmlmeWluZyBmYWN0b3Igb2YgdGhlIG1vdGlvbiBkYXRhIHZhbHVlcyAoYDFgIG9uIEFuZHJvaWQsIGAtMWAgb24gaU9TKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5fdW5pZnlNb3Rpb25EYXRhID0gKHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycpID8gLTEgOiAxO1xuXG4gICAgLyoqXG4gICAgICogVW5pZnlpbmcgZmFjdG9yIG9mIHRoZSBwZXJpb2QgKGAxYCBvbiBBbmRyb2lkLCBgMWAgb24gaU9TKS4gaW4gc2VjXG4gICAgICogQHRvZG8gLSB1bmlmeSB3aXRoIGUuaW50ZXJ2YWwgc3BlY2lmaWNhdGlvbiAoaW4gbXMpID9cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5fdW5pZnlQZXJpb2QgPSAocGxhdGZvcm0ub3MuZmFtaWx5ID09PSAnQW5kcm9pZCcpID8gMC4wMDEgOiAxO1xuXG4gICAgLyoqXG4gICAgICogQWNjZWxlcmF0aW9uIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHJhdyB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvbiA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIFRpbWUgY29uc3RhbnQgKGhhbGYtbGlmZSkgb2YgdGhlIGhpZ2gtcGFzcyBmaWx0ZXIgdXNlZCB0byBzbW9vdGggdGhlIGFjY2VsZXJhdGlvbiB2YWx1ZXMgY2FsY3VsYXRlZCBmcm9tIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHkgcmF3IHZhbHVlcyAoaW4gc2Vjb25kcykuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDAuMVxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25UaW1lQ29uc3RhbnQgPSAwLjE7XG5cbiAgICAvKipcbiAgICAgKiBMYXRlc3QgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHJhdyB2YWx1ZSwgdXNlZCBpbiB0aGUgaGlnaC1wYXNzIGZpbHRlciB0byBjYWxjdWxhdGUgdGhlIGFjY2VsZXJhdGlvbiAoaWYgdGhlIGBhY2NlbGVyYXRpb25gIHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IGAnZGV2aWNlbW90aW9uJ2ApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogUm90YXRpb24gcmF0ZSBjYWxjdWxhdGVkIGZyb20gdGhlIG9yaWVudGF0aW9uIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IG9yaWVudGF0aW9uIHZhbHVlLCB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgcm90YXRpb24gcmF0ZSAgKGlmIHRoZSBgcm90YXRpb25SYXRlYCB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSBgJ2RldmljZW1vdGlvbidgKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb24gPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBMYXRlc3Qgb3JpZW50YXRpb24gdGltZXN0YW1wcywgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHJvdGF0aW9uIHJhdGUgKGlmIHRoZSBgcm90YXRpb25SYXRlYCB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSBgJ2RldmljZW1vdGlvbidgKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXAgPSBudWxsO1xuXG4gICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uID0gbnVsbDtcbiAgICB0aGlzLl9wcm9jZXNzID0gdGhpcy5fcHJvY2Vzcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2RldmljZW1vdGlvbkNoZWNrID0gdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLl9kZXZpY2Vtb3Rpb25MaXN0ZW5lciA9IHRoaXMuX2RldmljZW1vdGlvbkxpc3RlbmVyLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9jaGVja0NvdW50ZXIgPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIERlY2F5IGZhY3RvciBvZiB0aGUgaGlnaC1wYXNzIGZpbHRlciB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgYWNjZWxlcmF0aW9uIGZyb20gdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWVzLlxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBfY2FsY3VsYXRlZEFjY2VsZXJhdGlvbkRlY2F5KCkge1xuICAgIHJldHVybiBNYXRoLmV4cCgtMiAqIE1hdGguUEkgKiB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkucGVyaW9kIC8gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblRpbWVDb25zdGFudCk7XG4gIH1cblxuICAvKipcbiAgICogU2Vuc29yIGNoZWNrIG9uIGluaXRpYWxpemF0aW9uIG9mIHRoZSBtb2R1bGUuXG4gICAqIFRoaXMgbWV0aG9kOlxuICAgKiAtIGNoZWNrcyB3aGV0aGVyIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIHRoZSBgYWNjZWxlcmF0aW9uYCxcbiAgICogICBhbmQgdGhlIGByb3RhdGlvblJhdGVgIHZhbHVlcyBhcmUgdmFsaWQgb3Igbm90O1xuICAgKiAtIGdldHMgdGhlIHBlcmlvZCBvZiB0aGUgYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBhbmQgc2V0cyB0aGUgcGVyaW9kIG9mXG4gICAqICAgdGhlIGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCwgYEFjY2VsZXJhdGlvbmAsIGFuZCBgUm90YXRpb25SYXRlYFxuICAgKiAgIHN1Ym1vZHVsZXM7XG4gICAqIC0gKGluIHRoZSBjYXNlIHdoZXJlIGFjY2VsZXJhdGlvbiByYXcgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQpXG4gICAqICAgaW5kaWNhdGVzIHdoZXRoZXIgdGhlIGFjY2VsZXJhdGlvbiBjYW4gYmUgY2FsY3VsYXRlZCBmcm9tIHRoZVxuICAgKiAgIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcyBvciBub3QuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBUaGUgZmlyc3QgYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBjYXVnaHQuXG4gICAqL1xuICBfZGV2aWNlbW90aW9uQ2hlY2soZSkge1xuICAgIHRoaXMuaXNQcm92aWRlZCA9IHRydWU7XG4gICAgdGhpcy5wZXJpb2QgPSBlLmludGVydmFsIC8gMTAwMDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHlcbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNQcm92aWRlZCA9IChcbiAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogPT09ICdudW1iZXInKVxuICAgICk7XG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSBhY2NlbGVyYXRpb25cbiAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkID0gKFxuICAgICAgZS5hY2NlbGVyYXRpb24gJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb24ueCA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uLnkgPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbi56ID09PSAnbnVtYmVyJylcbiAgICApO1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uLnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSByb3RhdGlvbiByYXRlXG4gICAgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZCA9IChcbiAgICAgIGUucm90YXRpb25SYXRlICYmXG4gICAgICAodHlwZW9mIGUucm90YXRpb25SYXRlLmFscGhhID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5yb3RhdGlvblJhdGUuYmV0YSAgPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLnJvdGF0aW9uUmF0ZS5nYW1tYSA9PT0gJ251bWJlcicpXG4gICAgKTtcbiAgICB0aGlzLnJvdGF0aW9uUmF0ZS5wZXJpb2QgPSBlLmludGVydmFsICogdGhpcy5fdW5pZnlQZXJpb2Q7XG5cbiAgICAvLyBpbiBmaXJlZm94IGFuZHJvaWQsIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgcmV0cmlldmUgbnVsbCB2YWx1ZXNcbiAgICAvLyBvbiB0aGUgZmlyc3QgY2FsbGJhY2suIHNvIHdhaXQgYSBzZWNvbmQgY2FsbCB0byBiZSBzdXJlLlxuICAgIGlmIChcbiAgICAgIHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ0FuZHJvaWQnICYmXG4gICAgICAvRmlyZWZveC8udGVzdChwbGF0Zm9ybS5uYW1lKSAmJlxuICAgICAgdGhpcy5fY2hlY2tDb3VudGVyIDwgMVxuICAgICkge1xuICAgICAgdGhpcy5fY2hlY2tDb3VudGVyKys7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5vdyB0aGF0IHRoZSBzZW5zb3JzIGFyZSBjaGVja2VkLCByZXBsYWNlIHRoZSBwcm9jZXNzIGZ1bmN0aW9uIHdpdGhcbiAgICAgIC8vIHRoZSBmaW5hbCBsaXN0ZW5lclxuICAgICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5fZGV2aWNlbW90aW9uTGlzdGVuZXI7XG5cbiAgICAgIC8vIGlmIGFjY2VsZXJhdGlvbiBpcyBub3QgcHJvdmlkZWQgYnkgcmF3IHNlbnNvcnMsIGluZGljYXRlIHdoZXRoZXIgaXRcbiAgICAgIC8vIGNhbiBiZSBjYWxjdWxhdGVkIHdpdGggYGFjY2VsZXJhdGlvbmluY2x1ZGluZ2dyYXZpdHlgIG9yIG5vdFxuICAgICAgaWYgKCF0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkKVxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc0NhbGN1bGF0ZWQgPSB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNQcm92aWRlZDtcblxuICAgICAgLy8gV0FSTklOR1xuICAgICAgLy8gVGhlIGxpbmVzIG9mIGNvZGUgYmVsb3cgYXJlIGNvbW1lbnRlZCBiZWNhdXNlIG9mIGEgYnVnIG9mIENocm9tZVxuICAgICAgLy8gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHdoZXJlICdkZXZpY2Vtb3Rpb24nIGV2ZW50cyBhcmUgbm90IHNlbnRcbiAgICAgIC8vIG9yIGNhdWdodCBpZiB0aGUgbGlzdGVuZXIgaXMgc2V0IHVwIGFmdGVyIGEgJ2RldmljZW9yaWVudGF0aW9uJ1xuICAgICAgLy8gbGlzdGVuZXIuIEhlcmUsIHRoZSBfdHJ5T3JpZW50YXRpb25GYWxsYmFjayBtZXRob2Qgd291bGQgYWRkIGFcbiAgICAgIC8vICdkZXZpY2VvcmllbnRhdGlvbicgbGlzdGVuZXIgYW5kIGJsb2NrIGFsbCBzdWJzZXF1ZW50ICdkZXZpY2Vtb3Rpb24nXG4gICAgICAvLyBldmVudHMgb24gdGhlc2UgZGV2aWNlcy4gQ29tbWVudHMgd2lsbCBiZSByZW1vdmVkIG9uY2UgdGhlIGJ1ZyBvZlxuICAgICAgLy8gQ2hyb21lIGlzIGNvcnJlY3RlZC5cblxuICAgICAgLy8gaWYgKHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlICYmICF0aGlzLnJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkKVxuICAgICAgLy8gICB0aGlzLl90cnlPcmllbnRhdGlvbkZhbGxiYWNrKCk7XG4gICAgICAvLyBlbHNlXG4gICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBjYWxsYmFjay5cbiAgICogVGhpcyBtZXRob2QgZW1pdHMgYW4gZXZlbnQgd2l0aCB0aGUgcmF3IGAnZGV2aWNlbW90aW9uJ2AgdmFsdWVzLCBhbmQgZW1pdHNcbiAgICogZXZlbnRzIHdpdGggdGhlIHVuaWZpZWQgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCBgYWNjZWxlcmF0aW9uYCxcbiAgICogYW5kIC8gb3IgYHJvdGF0aW9uUmF0ZWAgdmFsdWVzIGlmIHRoZXkgYXJlIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZGV2aWNlbW90aW9uTGlzdGVuZXIoZSkge1xuICAgIC8vICdkZXZpY2Vtb3Rpb24nIGV2ZW50IChyYXcgdmFsdWVzKVxuICAgIGlmICh0aGlzLmxpc3RlbmVycy5zaXplID4gMClcbiAgICAgIHRoaXMuX2VtaXREZXZpY2VNb3Rpb25FdmVudChlKTtcblxuICAgIC8vIGFsZXJ0KGAke3RoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5saXN0ZW5lcnMuc2l6ZX0gLVxuICAgIC8vICAgICAke3RoaXMucmVxdWlyZWQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eX0gLVxuICAgIC8vICAgICAke3RoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1ZhbGlkfVxuICAgIC8vIGApO1xuXG4gICAgLy8gJ2FjY2VsZXJhdGlvbicgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIGlmICh0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkubGlzdGVuZXJzLnNpemUgPiAwICYmXG4gICAgICAgIHRoaXMucmVxdWlyZWQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAmJlxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZFxuICAgICkge1xuICAgICAgdGhpcy5fZW1pdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlFdmVudChlKTtcbiAgICB9XG5cbiAgICAvLyAnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIC8vIHRoZSBmYWxsYmFjayBjYWxjdWxhdGlvbiBvZiB0aGUgYWNjZWxlcmF0aW9uIGhhcHBlbnMgaW4gdGhlXG4gICAgLy8gIGBfZW1pdEFjY2VsZXJhdGlvbmAgbWV0aG9kLCBzbyB3ZSBjaGVjayBpZiB0aGlzLmFjY2VsZXJhdGlvbi5pc1ZhbGlkXG4gICAgaWYgKHRoaXMuYWNjZWxlcmF0aW9uLmxpc3RlbmVycy5zaXplID4gMCAmJlxuICAgICAgICB0aGlzLnJlcXVpcmVkLmFjY2VsZXJhdGlvbiAmJlxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc1ZhbGlkXG4gICAgKSB7XG4gICAgICB0aGlzLl9lbWl0QWNjZWxlcmF0aW9uRXZlbnQoZSk7XG4gICAgfVxuXG4gICAgLy8gJ3JvdGF0aW9uUmF0ZScgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIC8vIHRoZSBmYWxsYmFjayBjYWxjdWxhdGlvbiBvZiB0aGUgcm90YXRpb24gcmF0ZSBkb2VzIE5PVCBoYXBwZW4gaW4gdGhlXG4gICAgLy8gYF9lbWl0Um90YXRpb25SYXRlYCBtZXRob2QsIHNvIHdlIG9ubHkgY2hlY2sgaWYgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZFxuICAgIGlmICh0aGlzLnJvdGF0aW9uUmF0ZS5saXN0ZW5lcnMuc2l6ZSA+IDAgJiZcbiAgICAgICAgdGhpcy5yZXF1aXJlZC5yb3RhdGlvblJhdGUgJiZcbiAgICAgICAgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZFxuICAgICkge1xuICAgICAgdGhpcy5fZW1pdFJvdGF0aW9uUmF0ZUV2ZW50KGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYCdkZXZpY2Vtb3Rpb24nYCByYXcgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZW1pdERldmljZU1vdGlvbkV2ZW50KGUpIHtcbiAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLmV2ZW50O1xuXG4gICAgaWYgKGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSkge1xuICAgICAgb3V0RXZlbnRbMF0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueDtcbiAgICAgIG91dEV2ZW50WzFdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lnk7XG4gICAgICBvdXRFdmVudFsyXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56O1xuICAgIH1cblxuICAgIGlmIChlLmFjY2VsZXJhdGlvbikge1xuICAgICAgb3V0RXZlbnRbM10gPSBlLmFjY2VsZXJhdGlvbi54O1xuICAgICAgb3V0RXZlbnRbNF0gPSBlLmFjY2VsZXJhdGlvbi55O1xuICAgICAgb3V0RXZlbnRbNV0gPSBlLmFjY2VsZXJhdGlvbi56O1xuICAgIH1cblxuICAgIGlmIChlLnJvdGF0aW9uUmF0ZSkge1xuICAgICAgb3V0RXZlbnRbNl0gPSBlLnJvdGF0aW9uUmF0ZS5hbHBoYTtcbiAgICAgIG91dEV2ZW50WzddID0gZS5yb3RhdGlvblJhdGUuYmV0YTtcbiAgICAgIG91dEV2ZW50WzhdID0gZS5yb3RhdGlvblJhdGUuZ2FtbWE7XG4gICAgfVxuXG4gICAgdGhpcy5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZW1pdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlFdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmV2ZW50O1xuXG4gICAgb3V0RXZlbnRbMF0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICBvdXRFdmVudFsxXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuICAgIG91dEV2ZW50WzJdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG5cbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuZW1pdChvdXRFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIGBhY2NlbGVyYXRpb25gIHVuaWZpZWQgdmFsdWVzLlxuICAgKiBXaGVuIHRoZSBgYWNjZWxlcmF0aW9uYCByYXcgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlLCB0aGUgbWV0aG9kXG4gICAqIGFsc28gY2FsY3VsYXRlcyB0aGUgYWNjZWxlcmF0aW9uIGZyb20gdGhlXG4gICAqIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gVGhlIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQuXG4gICAqL1xuICBfZW1pdEFjY2VsZXJhdGlvbkV2ZW50KGUpIHtcbiAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLmFjY2VsZXJhdGlvbi5ldmVudDtcblxuICAgIGlmICh0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkKSB7XG4gICAgICAvLyBJZiByYXcgYWNjZWxlcmF0aW9uIHZhbHVlcyBhcmUgcHJvdmlkZWRcbiAgICAgIG91dEV2ZW50WzBdID0gZS5hY2NlbGVyYXRpb24ueCAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICAgIG91dEV2ZW50WzFdID0gZS5hY2NlbGVyYXRpb24ueSAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICAgIG91dEV2ZW50WzJdID0gZS5hY2NlbGVyYXRpb24ueiAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1ZhbGlkKSB7XG4gICAgICAvLyBPdGhlcndpc2UsIGlmIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgdmFsdWVzIGFyZSBwcm92aWRlZCxcbiAgICAgIC8vIGVzdGltYXRlIHRoZSBhY2NlbGVyYXRpb24gd2l0aCBhIGhpZ2gtcGFzcyBmaWx0ZXJcbiAgICAgIGNvbnN0IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBbXG4gICAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhLFxuICAgICAgICBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueSAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YSxcbiAgICAgICAgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogKiB0aGlzLl91bmlmeU1vdGlvbkRhdGFcbiAgICAgIF07XG4gICAgICBjb25zdCBrID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvbkRlY2F5O1xuXG4gICAgICAvLyBIaWdoLXBhc3MgZmlsdGVyIHRvIGVzdGltYXRlIHRoZSBhY2NlbGVyYXRpb24gKHdpdGhvdXQgdGhlIGdyYXZpdHkpXG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzBdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMF07XG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzFdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMV07XG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzJdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMl07XG5cbiAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXTtcbiAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXTtcbiAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXTtcblxuICAgICAgb3V0RXZlbnRbMF0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzBdO1xuICAgICAgb3V0RXZlbnRbMV0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzFdO1xuICAgICAgb3V0RXZlbnRbMl0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzJdO1xuICAgIH1cblxuICAgIHRoaXMuYWNjZWxlcmF0aW9uLmVtaXQob3V0RXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBgcm90YXRpb25SYXRlYCB1bmlmaWVkIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2VtaXRSb3RhdGlvblJhdGVFdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5yb3RhdGlvblJhdGUuZXZlbnQ7XG5cbiAgICAvLyBJbiBhbGwgcGxhdGZvcm1zLCByb3RhdGlvbiBheGVzIGFyZSBtZXNzZWQgdXAgYWNjb3JkaW5nIHRvIHRoZSBzcGVjXG4gICAgLy8gaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2RldmljZW9yaWVudGF0aW9uL3NwZWMtc291cmNlLW9yaWVudGF0aW9uLmh0bWxcbiAgICAvL1xuICAgIC8vIGdhbW1hIHNob3VsZCBiZSBhbHBoYVxuICAgIC8vIGFscGhhIHNob3VsZCBiZSBiZXRhXG4gICAgLy8gYmV0YSBzaG91bGQgYmUgZ2FtbWFcblxuICAgIG91dEV2ZW50WzBdID0gZS5yb3RhdGlvblJhdGUuZ2FtbWE7XG4gICAgb3V0RXZlbnRbMV0gPSBlLnJvdGF0aW9uUmF0ZS5hbHBoYSxcbiAgICBvdXRFdmVudFsyXSA9IGUucm90YXRpb25SYXRlLmJldGE7XG5cbiAgICAvLyBDaHJvbWUgQW5kcm9pZCByZXRyaWV2ZSB2YWx1ZXMgdGhhdCBhcmUgaW4gcmFkL3NcbiAgICAvLyBjZi4gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NTQxNjA3XG4gICAgLy9cbiAgICAvLyBGcm9tIHNwZWM6IFwiVGhlIHJvdGF0aW9uUmF0ZSBhdHRyaWJ1dGUgbXVzdCBiZSBpbml0aWFsaXplZCB3aXRoIHRoZSByYXRlXG4gICAgLy8gb2Ygcm90YXRpb24gb2YgdGhlIGhvc3RpbmcgZGV2aWNlIGluIHNwYWNlLiBJdCBtdXN0IGJlIGV4cHJlc3NlZCBhcyB0aGVcbiAgICAvLyByYXRlIG9mIGNoYW5nZSBvZiB0aGUgYW5nbGVzIGRlZmluZWQgaW4gc2VjdGlvbiA0LjEgYW5kIG11c3QgYmUgZXhwcmVzc2VkXG4gICAgLy8gaW4gZGVncmVlcyBwZXIgc2Vjb25kIChkZWcvcykuXCJcbiAgICBpZiAocGxhdGZvcm0ub3MubmFtZSA9PT0gJ0FuZHJvaWQnICYmIGNocm9tZVJlZ0V4cC50ZXN0KHBsYXRmb3JtLm5hbWUpKSB7XG4gICAgICBvdXRFdmVudFswXSAqPSB0b0RlZztcbiAgICAgIG91dEV2ZW50WzFdICo9IHRvRGVnLFxuICAgICAgb3V0RXZlbnRbMl0gKj0gdG9EZWc7XG4gICAgfVxuXG4gICAgdGhpcy5yb3RhdGlvblJhdGUuZW1pdChvdXRFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBhbmQgZW1pdHMgdGhlIGByb3RhdGlvblJhdGVgIHVuaWZpZWQgdmFsdWVzIGZyb20gdGhlIGBvcmllbnRhdGlvbmAgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcltdfSBvcmllbnRhdGlvbiAtIExhdGVzdCBgb3JpZW50YXRpb25gIHJhdyB2YWx1ZXMuXG4gICAqL1xuICBfY2FsY3VsYXRlUm90YXRpb25SYXRlRnJvbU9yaWVudGF0aW9uKG9yaWVudGF0aW9uKSB7XG4gICAgY29uc3Qgbm93ID0gZ2V0TG9jYWxUaW1lKCk7XG4gICAgY29uc3QgayA9IDAuODsgLy8gVE9ETzogaW1wcm92ZSBsb3cgcGFzcyBmaWx0ZXIgKGZyYW1lcyBhcmUgbm90IHJlZ3VsYXIpXG4gICAgY29uc3QgYWxwaGFJc1ZhbGlkID0gKHR5cGVvZiBvcmllbnRhdGlvblswXSA9PT0gJ251bWJlcicpO1xuXG4gICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblRpbWVzdGFtcCkge1xuICAgICAgbGV0IHJBbHBoYSA9IG51bGw7XG4gICAgICBsZXQgckJldGE7XG4gICAgICBsZXQgckdhbW1hO1xuXG4gICAgICBsZXQgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yID0gMDtcbiAgICAgIGxldCBiZXRhRGlzY29udGludWl0eUZhY3RvciA9IDA7XG4gICAgICBsZXQgZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yID0gMDtcblxuICAgICAgY29uc3QgZGVsdGFUID0gbm93IC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wO1xuXG4gICAgICBpZiAoYWxwaGFJc1ZhbGlkKSB7XG4gICAgICAgIC8vIGFscGhhIGRpc2NvbnRpbnVpdHkgKCszNjAgLT4gMCBvciAwIC0+ICszNjApXG4gICAgICAgIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMF0gPiAzMjAgJiYgb3JpZW50YXRpb25bMF0gPCA0MClcbiAgICAgICAgICBhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAzNjA7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSA8IDQwICYmIG9yaWVudGF0aW9uWzBdID4gMzIwKVxuICAgICAgICAgIGFscGhhRGlzY29udGludWl0eUZhY3RvciA9IC0zNjA7XG4gICAgICB9XG5cbiAgICAgIC8vIGJldGEgZGlzY29udGludWl0eSAoKzE4MCAtPiAtMTgwIG9yIC0xODAgLT4gKzE4MClcbiAgICAgIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMV0gPiAxNDAgJiYgb3JpZW50YXRpb25bMV0gPCAtMTQwKVxuICAgICAgICBiZXRhRGlzY29udGludWl0eUZhY3RvciA9IDM2MDtcbiAgICAgIGVsc2UgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSA8IC0xNDAgJiYgb3JpZW50YXRpb25bMV0gPiAxNDApXG4gICAgICAgIGJldGFEaXNjb250aW51aXR5RmFjdG9yID0gLTM2MDtcblxuICAgICAgLy8gZ2FtbWEgZGlzY29udGludWl0aWVzICgrMTgwIC0+IC0xODAgb3IgLTE4MCAtPiArMTgwKVxuICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSA+IDUwICYmIG9yaWVudGF0aW9uWzJdIDwgLTUwKVxuICAgICAgICBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAxODA7XG4gICAgICBlbHNlIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMl0gPCAtNTAgJiYgb3JpZW50YXRpb25bMl0gPiA1MClcbiAgICAgICAgZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yID0gLTE4MDtcblxuICAgICAgaWYgKGRlbHRhVCA+IDApIHtcbiAgICAgICAgLy8gTG93IHBhc3MgZmlsdGVyIHRvIHNtb290aCB0aGUgZGF0YVxuICAgICAgICBpZiAoYWxwaGFJc1ZhbGlkKVxuICAgICAgICAgIHJBbHBoYSA9IGsgKiB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzBdICsgKDEgLSBrKSAqIChvcmllbnRhdGlvblswXSAtIHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSArIGFscGhhRGlzY29udGludWl0eUZhY3RvcikgLyBkZWx0YVQ7XG5cbiAgICAgICAgckJldGEgPSBrICogdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVsxXSArICgxIC0gaykgKiAob3JpZW50YXRpb25bMV0gLSB0aGlzLl9sYXN0T3JpZW50YXRpb25bMV0gKyBiZXRhRGlzY29udGludWl0eUZhY3RvcikgLyBkZWx0YVQ7XG4gICAgICAgIHJHYW1tYSA9IGsgKiB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzJdICsgKDEgLSBrKSAqIChvcmllbnRhdGlvblsyXSAtIHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSArIGdhbW1hRGlzY29udGludWl0eUZhY3RvcikgLyBkZWx0YVQ7XG5cbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVswXSA9IHJBbHBoYTtcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVsxXSA9IHJCZXRhO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzJdID0gckdhbW1hO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPOiByZXNhbXBsZSB0aGUgZW1pc3Npb24gcmF0ZSB0byBtYXRjaCB0aGUgZGV2aWNlbW90aW9uIHJhdGVcbiAgICAgIHRoaXMucm90YXRpb25SYXRlLmVtaXQodGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wID0gbm93O1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSA9IG9yaWVudGF0aW9uWzBdO1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSA9IG9yaWVudGF0aW9uWzFdO1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSA9IG9yaWVudGF0aW9uWzJdO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSByb3RhdGlvbiByYXRlIGNhbiBiZSBjYWxjdWxhdGVkIGZyb20gdGhlIGBvcmllbnRhdGlvbmAgdmFsdWVzIG9yIG5vdC5cbiAgICpcbiAgICogQHRvZG8gLSB0aGlzIHNob3VsZCBiZSByZXZpZXdlZCB0byBjb21wbHkgd2l0aCB0aGUgYXhpcyBvcmRlciBkZWZpbmVkXG4gICAqICBpbiB0aGUgc3BlY1xuICAgKi9cbiAgLy8gV0FSTklOR1xuICAvLyBUaGUgbGluZXMgb2YgY29kZSBiZWxvdyBhcmUgY29tbWVudGVkIGJlY2F1c2Ugb2YgYSBidWcgb2YgQ2hyb21lXG4gIC8vIG9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzLCB3aGVyZSAnZGV2aWNlbW90aW9uJyBldmVudHMgYXJlIG5vdCBzZW50XG4gIC8vIG9yIGNhdWdodCBpZiB0aGUgbGlzdGVuZXIgaXMgc2V0IHVwIGFmdGVyIGEgJ2RldmljZW9yaWVudGF0aW9uJ1xuICAvLyBsaXN0ZW5lci4gSGVyZSwgdGhlIF90cnlPcmllbnRhdGlvbkZhbGxiYWNrIG1ldGhvZCB3b3VsZCBhZGQgYVxuICAvLyAnZGV2aWNlb3JpZW50YXRpb24nIGxpc3RlbmVyIGFuZCBibG9jayBhbGwgc3Vic2VxdWVudCAnZGV2aWNlbW90aW9uJ1xuICAvLyBldmVudHMgb24gdGhlc2UgZGV2aWNlcy4gQ29tbWVudHMgd2lsbCBiZSByZW1vdmVkIG9uY2UgdGhlIGJ1ZyBvZlxuICAvLyBDaHJvbWUgaXMgY29ycmVjdGVkLlxuICAvLyBfdHJ5T3JpZW50YXRpb25GYWxsYmFjaygpIHtcbiAgLy8gICBNb3Rpb25JbnB1dC5yZXF1aXJlTW9kdWxlKCdvcmllbnRhdGlvbicpXG4gIC8vICAgICAudGhlbigob3JpZW50YXRpb24pID0+IHtcbiAgLy8gICAgICAgaWYgKG9yaWVudGF0aW9uLmlzVmFsaWQpIHtcbiAgLy8gICAgICAgICBjb25zb2xlLmxvZyhgXG4gIC8vICAgICAgICAgICBXQVJOSU5HIChtb3Rpb24taW5wdXQpOiBUaGUgJ2RldmljZW1vdGlvbicgZXZlbnQgZG9lcyBub3QgZXhpc3RzIG9yXG4gIC8vICAgICAgICAgICBkb2VzIG5vdCBwcm92aWRlIHJvdGF0aW9uIHJhdGUgdmFsdWVzIGluIHlvdXIgYnJvd3Nlciwgc28gdGhlIHJvdGF0aW9uXG4gIC8vICAgICAgICAgICByYXRlIG9mIHRoZSBkZXZpY2UgaXMgZXN0aW1hdGVkIGZyb20gdGhlICdvcmllbnRhdGlvbicsIGNhbGN1bGF0ZWRcbiAgLy8gICAgICAgICAgIGZyb20gdGhlICdkZXZpY2VvcmllbnRhdGlvbicgZXZlbnQuIFNpbmNlIHRoZSBjb21wYXNzIG1pZ2h0IG5vdFxuICAvLyAgICAgICAgICAgYmUgYXZhaWxhYmxlLCBvbmx5IFxcYGJldGFcXGAgYW5kIFxcYGdhbW1hXFxgIGFuZ2xlcyBtYXkgYmUgcHJvdmlkZWRcbiAgLy8gICAgICAgICAgIChcXGBhbHBoYVxcYCB3b3VsZCBiZSBudWxsKS5gXG4gIC8vICAgICAgICAgKTtcblxuICAvLyAgICAgICAgIHRoaXMucm90YXRpb25SYXRlLmlzQ2FsY3VsYXRlZCA9IHRydWU7XG5cbiAgLy8gICAgICAgICBNb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcignb3JpZW50YXRpb24nLCAob3JpZW50YXRpb24pID0+IHtcbiAgLy8gICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVJvdGF0aW9uUmF0ZUZyb21PcmllbnRhdGlvbihvcmllbnRhdGlvbik7XG4gIC8vICAgICAgICAgfSk7XG4gIC8vICAgICAgIH1cblxuICAvLyAgICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSh0aGlzKTtcbiAgLy8gICAgIH0pO1xuICAvLyB9XG5cbiAgX3Byb2Nlc3MoZGF0YSkge1xuICAgIHRoaXMuX3Byb2Nlc3NGdW5jdGlvbihkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtwcm9taXNlfVxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gc3VwZXIuaW5pdCgocmVzb2x2ZSkgPT4ge1xuICAgICAgdGhpcy5fcHJvbWlzZVJlc29sdmUgPSByZXNvbHZlO1xuXG4gICAgICBpZiAod2luZG93LkRldmljZU1vdGlvbkV2ZW50KSB7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NGdW5jdGlvbiA9IHRoaXMuX2RldmljZW1vdGlvbkNoZWNrO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgdGhpcy5fcHJvY2Vzcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIFdBUk5JTkdcbiAgICAgIC8vIFRoZSBsaW5lcyBvZiBjb2RlIGJlbG93IGFyZSBjb21tZW50ZWQgYmVjYXVzZSBvZiBhIGJ1ZyBvZiBDaHJvbWVcbiAgICAgIC8vIG9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzLCB3aGVyZSAnZGV2aWNlbW90aW9uJyBldmVudHMgYXJlIG5vdCBzZW50XG4gICAgICAvLyBvciBjYXVnaHQgaWYgdGhlIGxpc3RlbmVyIGlzIHNldCB1cCBhZnRlciBhICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAgIC8vIGxpc3RlbmVyLiBIZXJlLCB0aGUgX3RyeU9yaWVudGF0aW9uRmFsbGJhY2sgbWV0aG9kIHdvdWxkIGFkZCBhXG4gICAgICAvLyAnZGV2aWNlb3JpZW50YXRpb24nIGxpc3RlbmVyIGFuZCBibG9jayBhbGwgc3Vic2VxdWVudCAnZGV2aWNlbW90aW9uJ1xuICAgICAgLy8gZXZlbnRzIG9uIHRoZXNlIGRldmljZXMuIENvbW1lbnRzIHdpbGwgYmUgcmVtb3ZlZCBvbmNlIHRoZSBidWcgb2ZcbiAgICAgIC8vIENocm9tZSBpcyBjb3JyZWN0ZWQuXG5cbiAgICAgIC8vIGVsc2UgaWYgKHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlKVxuICAgICAgLy8gdGhpcy5fdHJ5T3JpZW50YXRpb25GYWxsYmFjaygpO1xuXG4gICAgICBlbHNlXG4gICAgICAgIHJlc29sdmUodGhpcyk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IERldmljZU1vdGlvbk1vZHVsZSgpO1xuIl19