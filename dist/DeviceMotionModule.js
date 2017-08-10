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
      if (_platform2.default.os.family === 'Android' && chromeRegExp.test(_platform2.default.name)) {
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
          // set fallback timeout for Firefox (its window never calling the DeviceOrientation event, a
          // require of the DeviceOrientation service will result in the require promise never being resolved
          // hence the Experiment start() method never called)
          _this2._checkTimeoutId = setTimeout(function () {
            return resolve(_this2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRldmljZU1vdGlvbk1vZHVsZS5qcyJdLCJuYW1lcyI6WyJnZXRMb2NhbFRpbWUiLCJ3aW5kb3ciLCJwZXJmb3JtYW5jZSIsIm5vdyIsIkRhdGUiLCJjaHJvbWVSZWdFeHAiLCJ0b0RlZyIsIk1hdGgiLCJQSSIsIkRldmljZU1vdGlvbk1vZHVsZSIsImV2ZW50IiwiYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSIsImFjY2VsZXJhdGlvbiIsInJvdGF0aW9uUmF0ZSIsInJlcXVpcmVkIiwiX3Byb21pc2VSZXNvbHZlIiwiX3VuaWZ5TW90aW9uRGF0YSIsIm9zIiwiZmFtaWx5IiwiX3VuaWZ5UGVyaW9kIiwiX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb24iLCJfY2FsY3VsYXRlZEFjY2VsZXJhdGlvblRpbWVDb25zdGFudCIsIl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSIsIl9jYWxjdWxhdGVkUm90YXRpb25SYXRlIiwiX2xhc3RPcmllbnRhdGlvbiIsIl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXAiLCJfcHJvY2Vzc0Z1bmN0aW9uIiwiX3Byb2Nlc3MiLCJiaW5kIiwiX2RldmljZW1vdGlvbkNoZWNrIiwiX2RldmljZW1vdGlvbkxpc3RlbmVyIiwiX2NoZWNrQ291bnRlciIsImUiLCJjbGVhclRpbWVvdXQiLCJfY2hlY2tUaW1lb3V0SWQiLCJpc1Byb3ZpZGVkIiwicGVyaW9kIiwiaW50ZXJ2YWwiLCJ4IiwieSIsInoiLCJhbHBoYSIsImJldGEiLCJnYW1tYSIsInRlc3QiLCJuYW1lIiwiaXNDYWxjdWxhdGVkIiwibGlzdGVuZXJzIiwic2l6ZSIsIl9lbWl0RGV2aWNlTW90aW9uRXZlbnQiLCJpc1ZhbGlkIiwiX2VtaXRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RXZlbnQiLCJfZW1pdEFjY2VsZXJhdGlvbkV2ZW50IiwiX2VtaXRSb3RhdGlvblJhdGVFdmVudCIsIm91dEV2ZW50IiwiZW1pdCIsImsiLCJfY2FsY3VsYXRlZEFjY2VsZXJhdGlvbkRlY2F5Iiwib3JpZW50YXRpb24iLCJhbHBoYUlzVmFsaWQiLCJyQWxwaGEiLCJyQmV0YSIsInJHYW1tYSIsImFscGhhRGlzY29udGludWl0eUZhY3RvciIsImJldGFEaXNjb250aW51aXR5RmFjdG9yIiwiZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yIiwiZGVsdGFUIiwiZGF0YSIsInJlc29sdmUiLCJEZXZpY2VNb3Rpb25FdmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXRUaW1lb3V0IiwiZXhwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOzs7Ozs7QUFNQSxTQUFTQSxZQUFULEdBQXdCO0FBQ3RCLE1BQUlDLE9BQU9DLFdBQVgsRUFDRSxPQUFPRCxPQUFPQyxXQUFQLENBQW1CQyxHQUFuQixLQUEyQixJQUFsQztBQUNGLFNBQU9DLEtBQUtELEdBQUwsS0FBYSxJQUFwQjtBQUNEOztBQUVELElBQU1FLGVBQWUsUUFBckI7QUFDQSxJQUFNQyxRQUFRLE1BQU1DLEtBQUtDLEVBQXpCOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW1CTUMsa0I7OztBQUVKOzs7OztBQUtBLGdDQUFjO0FBQUE7O0FBR1o7Ozs7Ozs7QUFIWSx3SUFDTixjQURNOztBQVVaLFVBQUtDLEtBQUwsR0FBYSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUErQixJQUEvQixFQUFxQyxJQUFyQyxFQUEyQyxJQUEzQyxFQUFpRCxJQUFqRCxDQUFiOztBQUVBOzs7Ozs7O0FBT0EsVUFBS0MsNEJBQUwsR0FBb0MsdUNBQTRCLDhCQUE1QixDQUFwQzs7QUFFQTs7Ozs7Ozs7OztBQVVBLFVBQUtDLFlBQUwsR0FBb0IsdUNBQTRCLGNBQTVCLENBQXBCOztBQUVBOzs7Ozs7Ozs7O0FBVUEsVUFBS0MsWUFBTCxHQUFvQix1Q0FBNEIsY0FBNUIsQ0FBcEI7O0FBRUE7Ozs7Ozs7OztBQVNBLFVB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LFVBQUNDLE9BQUQsRUFBYTtBQUM3QixlQUFLckQsZUFBTCxHQUF1QnFELE9BQXZCOztBQUVBLFlBQUluRSxPQUFPb0UsaUJBQVgsRUFBOEI7QUFDNUIsaUJBQUszQyxnQkFBTCxHQUF3QixPQUFLRyxrQkFBN0I7QUFDQTVCLGlCQUFPcUUsZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsT0FBSzNDLFFBQTdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQUtPLGVBQUwsR0FBdUJxQyxXQUFXO0FBQUEsbUJBQU1ILGVBQU47QUFBQSxXQUFYLEVBQWdDLEdBQWhDLENBQXZCO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQW5CQSxhQXNCRUE7QUFDSCxPQTFCRDtBQTJCRDs7O3dCQTNZa0M7QUFDakMsYUFBTzdELEtBQUtpRSxHQUFMLENBQVMsQ0FBQyxDQUFELEdBQUtqRSxLQUFLQyxFQUFWLEdBQWUsS0FBS0csNEJBQUwsQ0FBa0N5QixNQUFqRCxHQUEwRCxLQUFLZixtQ0FBeEUsQ0FBUDtBQUNEOzs7Ozs7a0JBNFlZLElBQUlaLGtCQUFKLEUiLCJmaWxlIjoiRGV2aWNlTW90aW9uTW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IElucHV0TW9kdWxlIGZyb20gJy4vSW5wdXRNb2R1bGUnO1xuaW1wb3J0IERPTUV2ZW50U3VibW9kdWxlIGZyb20gJy4vRE9NRXZlbnRTdWJtb2R1bGUnO1xuaW1wb3J0IE1vdGlvbklucHV0IGZyb20gJy4vTW90aW9uSW5wdXQnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJ3BsYXRmb3JtJztcblxuLyoqXG4gKiBHZXRzIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUgaW4gc2Vjb25kcy5cbiAqIFVzZXMgYHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKWAgaWYgYXZhaWxhYmxlLCBhbmQgYERhdGUubm93KClgIG90aGVyd2lzZS5cbiAqXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGdldExvY2FsVGltZSgpIHtcbiAgaWYgKHdpbmRvdy5wZXJmb3JtYW5jZSlcbiAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMDtcbiAgcmV0dXJuIERhdGUubm93KCkgLyAxMDAwO1xufVxuXG5jb25zdCBjaHJvbWVSZWdFeHAgPSAvQ2hyb21lLztcbmNvbnN0IHRvRGVnID0gMTgwIC8gTWF0aC5QSTtcblxuLyoqXG4gKiBgRGV2aWNlTW90aW9uYCBtb2R1bGUgc2luZ2xldG9uLlxuICogVGhlIGBEZXZpY2VNb3Rpb25Nb2R1bGVgIHNpbmdsZXRvbiBwcm92aWRlcyB0aGUgcmF3IHZhbHVlc1xuICogb2YgdGhlIGFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eSwgYWNjZWxlcmF0aW9uLCBhbmQgcm90YXRpb25cbiAqIHJhdGUgcHJvdmlkZWQgYnkgdGhlIGBEZXZpY2VNb3Rpb25gIGV2ZW50LlxuICogSXQgYWxzbyBpbnN0YW50aWF0ZSB0aGUgYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLFxuICogYEFjY2VsZXJhdGlvbmAgYW5kIGBSb3RhdGlvblJhdGVgIHN1Ym1vZHVsZXMgdGhhdCB1bmlmeSB0aG9zZSB2YWx1ZXNcbiAqIGFjcm9zcyBwbGF0Zm9ybXMgYnkgbWFraW5nIHRoZW0gY29tcGxpYW50IHdpdGgge0BsaW5rXG4gKiBodHRwOi8vd3d3LnczLm9yZy9UUi9vcmllbnRhdGlvbi1ldmVudC98dGhlIFczQyBzdGFuZGFyZH0uXG4gKiBXaGVuIHJhdyB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSB0aGUgc2Vuc29ycywgdGhpcyBtb2R1bGVzIHRyaWVzXG4gKiB0byByZWNhbGN1bGF0ZSB0aGVtIGZyb20gYXZhaWxhYmxlIHZhbHVlczpcbiAqIC0gYGFjY2VsZXJhdGlvbmAgaXMgY2FsY3VsYXRlZCBmcm9tIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YFxuICogICB3aXRoIGEgaGlnaC1wYXNzIGZpbHRlcjtcbiAqIC0gKGNvbWluZyBzb29uIOKAlCB3YWl0aW5nIGZvciBhIGJ1ZyBvbiBDaHJvbWUgdG8gYmUgcmVzb2x2ZWQpXG4gKiAgIGByb3RhdGlvblJhdGVgIGlzIGNhbGN1bGF0ZWQgZnJvbSBgb3JpZW50YXRpb25gLlxuICpcbiAqIEBjbGFzcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAqIEBleHRlbmRzIElucHV0TW9kdWxlXG4gKi9cbmNsYXNzIERldmljZU1vdGlvbk1vZHVsZSBleHRlbmRzIElucHV0TW9kdWxlIHtcblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgYERldmljZU1vdGlvbmAgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCdkZXZpY2Vtb3Rpb24nKTtcblxuICAgIC8qKlxuICAgICAqIFJhdyB2YWx1ZXMgY29taW5nIGZyb20gdGhlIGBkZXZpY2Vtb3Rpb25gIGV2ZW50IHNlbnQgYnkgdGhpcyBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgW251bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGxdXG4gICAgICovXG4gICAgdGhpcy5ldmVudCA9IFtudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgbW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIHVuaWZpZWQgdmFsdWVzIG9mIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ID0gbmV3IERPTUV2ZW50U3VibW9kdWxlKHRoaXMsICdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Jyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYEFjY2VsZXJhdGlvbmAgc3VibW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIHVuaWZpZWQgdmFsdWVzIG9mIHRoZSBhY2NlbGVyYXRpb24uXG4gICAgICogRXN0aW1hdGVzIHRoZSBhY2NlbGVyYXRpb24gdmFsdWVzIGZyb20gYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgXG4gICAgICogcmF3IHZhbHVlcyBpZiB0aGUgYWNjZWxlcmF0aW9uIHJhdyB2YWx1ZXMgYXJlIG5vdCBhdmFpbGFibGUgb24gdGhlXG4gICAgICogZGV2aWNlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uID0gbmV3IERPTUV2ZW50U3VibW9kdWxlKHRoaXMsICdhY2NlbGVyYXRpb24nKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgUm90YXRpb25SYXRlYCBzdWJtb2R1bGUuXG4gICAgICogUHJvdmlkZXMgdW5pZmllZCB2YWx1ZXMgb2YgdGhlIHJvdGF0aW9uIHJhdGUuXG4gICAgICogKGNvbWluZyBzb29uLCB3YWl0aW5nIGZvciBhIGJ1ZyBvbiBDaHJvbWUgdG8gYmUgcmVzb2x2ZWQpXG4gICAgICogRXN0aW1hdGVzIHRoZSByb3RhdGlvbiByYXRlIHZhbHVlcyBmcm9tIGBvcmllbnRhdGlvbmAgdmFsdWVzIGlmXG4gICAgICogdGhlIHJvdGF0aW9uIHJhdGUgcmF3IHZhbHVlcyBhcmUgbm90IGF2YWlsYWJsZSBvbiB0aGUgZGV2aWNlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIHRoaXMucm90YXRpb25SYXRlID0gbmV3IERPTUV2ZW50U3VibW9kdWxlKHRoaXMsICdyb3RhdGlvblJhdGUnKTtcblxuICAgIC8qKlxuICAgICAqIFJlcXVpcmVkIHN1Ym1vZHVsZXMgLyBldmVudHMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICogQHByb3BlcnR5IHtib29sfSBhY2NlbGVyYXRpb24gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYGFjY2VsZXJhdGlvbmAgdW5pZmllZCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICogQHByb3BlcnR5IHtib29sfSByb3RhdGlvblJhdGUgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYHJvdGF0aW9uUmF0ZWAgdW5pZmllZCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICovXG4gICAgdGhpcy5yZXF1aXJlZCA9IHtcbiAgICAgIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHk6IGZhbHNlLFxuICAgICAgYWNjZWxlcmF0aW9uOiBmYWxzZSxcbiAgICAgIHJvdGF0aW9uUmF0ZTogZmFsc2VcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZSBmdW5jdGlvbiBvZiB0aGUgbW9kdWxlJ3MgcHJvbWlzZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICogQHNlZSBEZXZpY2VNb3Rpb25Nb2R1bGUjaW5pdFxuICAgICAqL1xuICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFVuaWZ5aW5nIGZhY3RvciBvZiB0aGUgbW90aW9uIGRhdGEgdmFsdWVzIChgMWAgb24gQW5kcm9pZCwgYC0xYCBvbiBpT1MpLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLl91bmlmeU1vdGlvbkRhdGEgPSAocGxhdGZvcm0ub3MuZmFtaWx5ID09PSAnaU9TJykgPyAtMSA6IDE7XG5cbiAgICAvKipcbiAgICAgKiBVbmlmeWluZyBmYWN0b3Igb2YgdGhlIHBlcmlvZCAoYDFgIG9uIEFuZHJvaWQsIGAxYCBvbiBpT1MpLiBpbiBzZWNcbiAgICAgKiBAdG9kbyAtIHVuaWZ5IHdpdGggZS5pbnRlcnZhbCBzcGVjaWZpY2F0aW9uIChpbiBtcykgP1xuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLl91bmlmeVBlcmlvZCA9IChwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdBbmRyb2lkJykgPyAwLjAwMSA6IDE7XG5cbiAgICAvKipcbiAgICAgKiBBY2NlbGVyYXRpb24gY2FsY3VsYXRlZCBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogVGltZSBjb25zdGFudCAoaGFsZi1saWZlKSBvZiB0aGUgaGlnaC1wYXNzIGZpbHRlciB1c2VkIHRvIHNtb290aCB0aGUgYWNjZWxlcmF0aW9uIHZhbHVlcyBjYWxjdWxhdGVkIGZyb20gdGhlIGFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eSByYXcgdmFsdWVzIChpbiBzZWNvbmRzKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgMC4xXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblRpbWVDb25zdGFudCA9IDAuMTtcblxuICAgIC8qKlxuICAgICAqIExhdGVzdCBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlLCB1c2VkIGluIHRoZSBoaWdoLXBhc3MgZmlsdGVyIHRvIGNhbGN1bGF0ZSB0aGUgYWNjZWxlcmF0aW9uIChpZiB0aGUgYGFjY2VsZXJhdGlvbmAgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgYCdkZXZpY2Vtb3Rpb24nYCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBSb3RhdGlvbiByYXRlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgb3JpZW50YXRpb24gdmFsdWVzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGUgPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBMYXRlc3Qgb3JpZW50YXRpb24gdmFsdWUsIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSByb3RhdGlvbiByYXRlICAoaWYgdGhlIGByb3RhdGlvblJhdGVgIHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IGAnZGV2aWNlbW90aW9uJ2ApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvbiA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIExhdGVzdCBvcmllbnRhdGlvbiB0aW1lc3RhbXBzLCB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgcm90YXRpb24gcmF0ZSAoaWYgdGhlIGByb3RhdGlvblJhdGVgIHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IGAnZGV2aWNlbW90aW9uJ2ApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblRpbWVzdGFtcCA9IG51bGw7XG5cbiAgICB0aGlzLl9wcm9jZXNzRnVuY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuX3Byb2Nlc3MgPSB0aGlzLl9wcm9jZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2sgPSB0aGlzLl9kZXZpY2Vtb3Rpb25DaGVjay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2RldmljZW1vdGlvbkxpc3RlbmVyID0gdGhpcy5fZGV2aWNlbW90aW9uTGlzdGVuZXIuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX2NoZWNrQ291bnRlciA9IDA7XG4gIH1cblxuICAvKipcbiAgICogRGVjYXkgZmFjdG9yIG9mIHRoZSBoaWdoLXBhc3MgZmlsdGVyIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBhY2NlbGVyYXRpb24gZnJvbSB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHJhdyB2YWx1ZXMuXG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IF9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uRGVjYXkoKSB7XG4gICAgcmV0dXJuIE1hdGguZXhwKC0yICogTWF0aC5QSSAqIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5wZXJpb2QgLyB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uVGltZUNvbnN0YW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5zb3IgY2hlY2sgb24gaW5pdGlhbGl6YXRpb24gb2YgdGhlIG1vZHVsZS5cbiAgICogVGhpcyBtZXRob2Q6XG4gICAqIC0gY2hlY2tzIHdoZXRoZXIgdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCwgdGhlIGBhY2NlbGVyYXRpb25gLFxuICAgKiAgIGFuZCB0aGUgYHJvdGF0aW9uUmF0ZWAgdmFsdWVzIGFyZSB2YWxpZCBvciBub3Q7XG4gICAqIC0gZ2V0cyB0aGUgcGVyaW9kIG9mIHRoZSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGFuZCBzZXRzIHRoZSBwZXJpb2Qgb2ZcbiAgICogICB0aGUgYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCBgQWNjZWxlcmF0aW9uYCwgYW5kIGBSb3RhdGlvblJhdGVgXG4gICAqICAgc3VibW9kdWxlcztcbiAgICogLSAoaW4gdGhlIGNhc2Ugd2hlcmUgYWNjZWxlcmF0aW9uIHJhdyB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZClcbiAgICogICBpbmRpY2F0ZXMgd2hldGhlciB0aGUgYWNjZWxlcmF0aW9uIGNhbiBiZSBjYWxjdWxhdGVkIGZyb20gdGhlXG4gICAqICAgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIFRoZSBmaXJzdCBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGNhdWdodC5cbiAgICovXG4gIF9kZXZpY2Vtb3Rpb25DaGVjayhlKSB7XG4gICAgLy8gY2xlYXIgdGltZW91dCAoYW50aS1GaXJlZm94IGJ1ZyBzb2x1dGlvbiwgd2luZG93IGV2ZW50IGRldmljZW9yaWVudGF0aW9uIGJlaW5nIG52ZXIgY2FsbGVkKVxuICAgIC8vIHNldCB0aGUgc2V0IHRpbWVvdXQgaW4gaW5pdCgpIGZ1bmN0aW9uXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2NoZWNrVGltZW91dElkKTtcblxuICAgIHRoaXMuaXNQcm92aWRlZCA9IHRydWU7XG4gICAgdGhpcy5wZXJpb2QgPSBlLmludGVydmFsIC8gMTAwMDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHlcbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNQcm92aWRlZCA9IChcbiAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogPT09ICdudW1iZXInKVxuICAgICk7XG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSBhY2NlbGVyYXRpb25cbiAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkID0gKFxuICAgICAgZS5hY2NlbGVyYXRpb24gJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb24ueCA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uLnkgPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbi56ID09PSAnbnVtYmVyJylcbiAgICApO1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uLnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSByb3RhdGlvbiByYXRlXG4gICAgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZCA9IChcbiAgICAgIGUucm90YXRpb25SYXRlICYmXG4gICAgICAodHlwZW9mIGUucm90YXRpb25SYXRlLmFscGhhID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5yb3RhdGlvblJhdGUuYmV0YSAgPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLnJvdGF0aW9uUmF0ZS5nYW1tYSA9PT0gJ251bWJlcicpXG4gICAgKTtcbiAgICB0aGlzLnJvdGF0aW9uUmF0ZS5wZXJpb2QgPSBlLmludGVydmFsICogdGhpcy5fdW5pZnlQZXJpb2Q7XG5cbiAgICAvLyBpbiBmaXJlZm94IGFuZHJvaWQsIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgcmV0cmlldmUgbnVsbCB2YWx1ZXNcbiAgICAvLyBvbiB0aGUgZmlyc3QgY2FsbGJhY2suIHNvIHdhaXQgYSBzZWNvbmQgY2FsbCB0byBiZSBzdXJlLlxuICAgIGlmIChcbiAgICAgIHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ0FuZHJvaWQnICYmXG4gICAgICAvRmlyZWZveC8udGVzdChwbGF0Zm9ybS5uYW1lKSAmJlxuICAgICAgdGhpcy5fY2hlY2tDb3VudGVyIDwgMVxuICAgICkge1xuICAgICAgdGhpcy5fY2hlY2tDb3VudGVyKys7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5vdyB0aGF0IHRoZSBzZW5zb3JzIGFyZSBjaGVja2VkLCByZXBsYWNlIHRoZSBwcm9jZXNzIGZ1bmN0aW9uIHdpdGhcbiAgICAgIC8vIHRoZSBmaW5hbCBsaXN0ZW5lclxuICAgICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5fZGV2aWNlbW90aW9uTGlzdGVuZXI7XG5cbiAgICAgIC8vIGlmIGFjY2VsZXJhdGlvbiBpcyBub3QgcHJvdmlkZWQgYnkgcmF3IHNlbnNvcnMsIGluZGljYXRlIHdoZXRoZXIgaXRcbiAgICAgIC8vIGNhbiBiZSBjYWxjdWxhdGVkIHdpdGggYGFjY2VsZXJhdGlvbmluY2x1ZGluZ2dyYXZpdHlgIG9yIG5vdFxuICAgICAgaWYgKCF0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkKVxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc0NhbGN1bGF0ZWQgPSB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNQcm92aWRlZDtcblxuICAgICAgLy8gV0FSTklOR1xuICAgICAgLy8gVGhlIGxpbmVzIG9mIGNvZGUgYmVsb3cgYXJlIGNvbW1lbnRlZCBiZWNhdXNlIG9mIGEgYnVnIG9mIENocm9tZVxuICAgICAgLy8gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHdoZXJlICdkZXZpY2Vtb3Rpb24nIGV2ZW50cyBhcmUgbm90IHNlbnRcbiAgICAgIC8vIG9yIGNhdWdodCBpZiB0aGUgbGlzdGVuZXIgaXMgc2V0IHVwIGFmdGVyIGEgJ2RldmljZW9yaWVudGF0aW9uJ1xuICAgICAgLy8gbGlzdGVuZXIuIEhlcmUsIHRoZSBfdHJ5T3JpZW50YXRpb25GYWxsYmFjayBtZXRob2Qgd291bGQgYWRkIGFcbiAgICAgIC8vICdkZXZpY2VvcmllbnRhdGlvbicgbGlzdGVuZXIgYW5kIGJsb2NrIGFsbCBzdWJzZXF1ZW50ICdkZXZpY2Vtb3Rpb24nXG4gICAgICAvLyBldmVudHMgb24gdGhlc2UgZGV2aWNlcy4gQ29tbWVudHMgd2lsbCBiZSByZW1vdmVkIG9uY2UgdGhlIGJ1ZyBvZlxuICAgICAgLy8gQ2hyb21lIGlzIGNvcnJlY3RlZC5cblxuICAgICAgLy8gaWYgKHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlICYmICF0aGlzLnJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkKVxuICAgICAgLy8gICB0aGlzLl90cnlPcmllbnRhdGlvbkZhbGxiYWNrKCk7XG4gICAgICAvLyBlbHNlXG4gICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBjYWxsYmFjay5cbiAgICogVGhpcyBtZXRob2QgZW1pdHMgYW4gZXZlbnQgd2l0aCB0aGUgcmF3IGAnZGV2aWNlbW90aW9uJ2AgdmFsdWVzLCBhbmQgZW1pdHNcbiAgICogZXZlbnRzIHdpdGggdGhlIHVuaWZpZWQgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCBgYWNjZWxlcmF0aW9uYCxcbiAgICogYW5kIC8gb3IgYHJvdGF0aW9uUmF0ZWAgdmFsdWVzIGlmIHRoZXkgYXJlIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZGV2aWNlbW90aW9uTGlzdGVuZXIoZSkge1xuICAgIC8vICdkZXZpY2Vtb3Rpb24nIGV2ZW50IChyYXcgdmFsdWVzKVxuICAgIGlmICh0aGlzLmxpc3RlbmVycy5zaXplID4gMClcbiAgICAgIHRoaXMuX2VtaXREZXZpY2VNb3Rpb25FdmVudChlKTtcblxuICAgIC8vIGFsZXJ0KGAke3RoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5saXN0ZW5lcnMuc2l6ZX0gLVxuICAgIC8vICAgICAke3RoaXMucmVxdWlyZWQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eX0gLVxuICAgIC8vICAgICAke3RoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1ZhbGlkfVxuICAgIC8vIGApO1xuXG4gICAgLy8gJ2FjY2VsZXJhdGlvbicgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIGlmICh0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkubGlzdGVuZXJzLnNpemUgPiAwICYmXG4gICAgICAgIHRoaXMucmVxdWlyZWQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAmJlxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZFxuICAgICkge1xuICAgICAgdGhpcy5fZW1pdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlFdmVudChlKTtcbiAgICB9XG5cbiAgICAvLyAnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIC8vIHRoZSBmYWxsYmFjayBjYWxjdWxhdGlvbiBvZiB0aGUgYWNjZWxlcmF0aW9uIGhhcHBlbnMgaW4gdGhlXG4gICAgLy8gIGBfZW1pdEFjY2VsZXJhdGlvbmAgbWV0aG9kLCBzbyB3ZSBjaGVjayBpZiB0aGlzLmFjY2VsZXJhdGlvbi5pc1ZhbGlkXG4gICAgaWYgKHRoaXMuYWNjZWxlcmF0aW9uLmxpc3RlbmVycy5zaXplID4gMCAmJlxuICAgICAgICB0aGlzLnJlcXVpcmVkLmFjY2VsZXJhdGlvbiAmJlxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc1ZhbGlkXG4gICAgKSB7XG4gICAgICB0aGlzLl9lbWl0QWNjZWxlcmF0aW9uRXZlbnQoZSk7XG4gICAgfVxuXG4gICAgLy8gJ3JvdGF0aW9uUmF0ZScgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIC8vIHRoZSBmYWxsYmFjayBjYWxjdWxhdGlvbiBvZiB0aGUgcm90YXRpb24gcmF0ZSBkb2VzIE5PVCBoYXBwZW4gaW4gdGhlXG4gICAgLy8gYF9lbWl0Um90YXRpb25SYXRlYCBtZXRob2QsIHNvIHdlIG9ubHkgY2hlY2sgaWYgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZFxuICAgIGlmICh0aGlzLnJvdGF0aW9uUmF0ZS5saXN0ZW5lcnMuc2l6ZSA+IDAgJiZcbiAgICAgICAgdGhpcy5yZXF1aXJlZC5yb3RhdGlvblJhdGUgJiZcbiAgICAgICAgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZFxuICAgICkge1xuICAgICAgdGhpcy5fZW1pdFJvdGF0aW9uUmF0ZUV2ZW50KGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYCdkZXZpY2Vtb3Rpb24nYCByYXcgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZW1pdERldmljZU1vdGlvbkV2ZW50KGUpIHtcbiAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLmV2ZW50O1xuXG4gICAgaWYgKGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSkge1xuICAgICAgb3V0RXZlbnRbMF0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueDtcbiAgICAgIG91dEV2ZW50WzFdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lnk7XG4gICAgICBvdXRFdmVudFsyXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56O1xuICAgIH1cblxuICAgIGlmIChlLmFjY2VsZXJhdGlvbikge1xuICAgICAgb3V0RXZlbnRbM10gPSBlLmFjY2VsZXJhdGlvbi54O1xuICAgICAgb3V0RXZlbnRbNF0gPSBlLmFjY2VsZXJhdGlvbi55O1xuICAgICAgb3V0RXZlbnRbNV0gPSBlLmFjY2VsZXJhdGlvbi56O1xuICAgIH1cblxuICAgIGlmIChlLnJvdGF0aW9uUmF0ZSkge1xuICAgICAgb3V0RXZlbnRbNl0gPSBlLnJvdGF0aW9uUmF0ZS5hbHBoYTtcbiAgICAgIG91dEV2ZW50WzddID0gZS5yb3RhdGlvblJhdGUuYmV0YTtcbiAgICAgIG91dEV2ZW50WzhdID0gZS5yb3RhdGlvblJhdGUuZ2FtbWE7XG4gICAgfVxuXG4gICAgdGhpcy5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZW1pdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlFdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmV2ZW50O1xuXG4gICAgb3V0RXZlbnRbMF0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICBvdXRFdmVudFsxXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuICAgIG91dEV2ZW50WzJdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG5cbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuZW1pdChvdXRFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIGBhY2NlbGVyYXRpb25gIHVuaWZpZWQgdmFsdWVzLlxuICAgKiBXaGVuIHRoZSBgYWNjZWxlcmF0aW9uYCByYXcgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlLCB0aGUgbWV0aG9kXG4gICAqIGFsc28gY2FsY3VsYXRlcyB0aGUgYWNjZWxlcmF0aW9uIGZyb20gdGhlXG4gICAqIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gVGhlIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQuXG4gICAqL1xuICBfZW1pdEFjY2VsZXJhdGlvbkV2ZW50KGUpIHtcbiAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLmFjY2VsZXJhdGlvbi5ldmVudDtcblxuICAgIGlmICh0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkKSB7XG4gICAgICAvLyBJZiByYXcgYWNjZWxlcmF0aW9uIHZhbHVlcyBhcmUgcHJvdmlkZWRcbiAgICAgIG91dEV2ZW50WzBdID0gZS5hY2NlbGVyYXRpb24ueCAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICAgIG91dEV2ZW50WzFdID0gZS5hY2NlbGVyYXRpb24ueSAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICAgIG91dEV2ZW50WzJdID0gZS5hY2NlbGVyYXRpb24ueiAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1ZhbGlkKSB7XG4gICAgICAvLyBPdGhlcndpc2UsIGlmIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgdmFsdWVzIGFyZSBwcm92aWRlZCxcbiAgICAgIC8vIGVzdGltYXRlIHRoZSBhY2NlbGVyYXRpb24gd2l0aCBhIGhpZ2gtcGFzcyBmaWx0ZXJcbiAgICAgIGNvbnN0IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBbXG4gICAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhLFxuICAgICAgICBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueSAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YSxcbiAgICAgICAgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogKiB0aGlzLl91bmlmeU1vdGlvbkRhdGFcbiAgICAgIF07XG4gICAgICBjb25zdCBrID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvbkRlY2F5O1xuXG4gICAgICAvLyBIaWdoLXBhc3MgZmlsdGVyIHRvIGVzdGltYXRlIHRoZSBhY2NlbGVyYXRpb24gKHdpdGhvdXQgdGhlIGdyYXZpdHkpXG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzBdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMF07XG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzFdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMV07XG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzJdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMl07XG5cbiAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXTtcbiAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXTtcbiAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXTtcblxuICAgICAgb3V0RXZlbnRbMF0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzBdO1xuICAgICAgb3V0RXZlbnRbMV0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzFdO1xuICAgICAgb3V0RXZlbnRbMl0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzJdO1xuICAgIH1cblxuICAgIHRoaXMuYWNjZWxlcmF0aW9uLmVtaXQob3V0RXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBgcm90YXRpb25SYXRlYCB1bmlmaWVkIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2VtaXRSb3RhdGlvblJhdGVFdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5yb3RhdGlvblJhdGUuZXZlbnQ7XG5cbiAgICAvLyBJbiBhbGwgcGxhdGZvcm1zLCByb3RhdGlvbiBheGVzIGFyZSBtZXNzZWQgdXAgYWNjb3JkaW5nIHRvIHRoZSBzcGVjXG4gICAgLy8gaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2RldmljZW9yaWVudGF0aW9uL3NwZWMtc291cmNlLW9yaWVudGF0aW9uLmh0bWxcbiAgICAvL1xuICAgIC8vIGdhbW1hIHNob3VsZCBiZSBhbHBoYVxuICAgIC8vIGFscGhhIHNob3VsZCBiZSBiZXRhXG4gICAgLy8gYmV0YSBzaG91bGQgYmUgZ2FtbWFcblxuICAgIG91dEV2ZW50WzBdID0gZS5yb3RhdGlvblJhdGUuZ2FtbWE7XG4gICAgb3V0RXZlbnRbMV0gPSBlLnJvdGF0aW9uUmF0ZS5hbHBoYSxcbiAgICBvdXRFdmVudFsyXSA9IGUucm90YXRpb25SYXRlLmJldGE7XG5cbiAgICAvLyBDaHJvbWUgQW5kcm9pZCByZXRyaWV2ZSB2YWx1ZXMgdGhhdCBhcmUgaW4gcmFkL3NcbiAgICAvLyBjZi4gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NTQxNjA3XG4gICAgLy9cbiAgICAvLyBGcm9tIHNwZWM6IFwiVGhlIHJvdGF0aW9uUmF0ZSBhdHRyaWJ1dGUgbXVzdCBiZSBpbml0aWFsaXplZCB3aXRoIHRoZSByYXRlXG4gICAgLy8gb2Ygcm90YXRpb24gb2YgdGhlIGhvc3RpbmcgZGV2aWNlIGluIHNwYWNlLiBJdCBtdXN0IGJlIGV4cHJlc3NlZCBhcyB0aGVcbiAgICAvLyByYXRlIG9mIGNoYW5nZSBvZiB0aGUgYW5nbGVzIGRlZmluZWQgaW4gc2VjdGlvbiA0LjEgYW5kIG11c3QgYmUgZXhwcmVzc2VkXG4gICAgLy8gaW4gZGVncmVlcyBwZXIgc2Vjb25kIChkZWcvcykuXCJcbiAgICBpZiAocGxhdGZvcm0ub3MuZmFtaWx5ID09PSAnQW5kcm9pZCcgJiYgY2hyb21lUmVnRXhwLnRlc3QocGxhdGZvcm0ubmFtZSkpIHtcbiAgICAgIG91dEV2ZW50WzBdICo9IHRvRGVnO1xuICAgICAgb3V0RXZlbnRbMV0gKj0gdG9EZWcsXG4gICAgICBvdXRFdmVudFsyXSAqPSB0b0RlZztcbiAgICB9XG5cbiAgICB0aGlzLnJvdGF0aW9uUmF0ZS5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGFuZCBlbWl0cyB0aGUgYHJvdGF0aW9uUmF0ZWAgdW5pZmllZCB2YWx1ZXMgZnJvbSB0aGUgYG9yaWVudGF0aW9uYCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyW119IG9yaWVudGF0aW9uIC0gTGF0ZXN0IGBvcmllbnRhdGlvbmAgcmF3IHZhbHVlcy5cbiAgICovXG4gIF9jYWxjdWxhdGVSb3RhdGlvblJhdGVGcm9tT3JpZW50YXRpb24ob3JpZW50YXRpb24pIHtcbiAgICBjb25zdCBub3cgPSBnZXRMb2NhbFRpbWUoKTtcbiAgICBjb25zdCBrID0gMC44OyAvLyBUT0RPOiBpbXByb3ZlIGxvdyBwYXNzIGZpbHRlciAoZnJhbWVzIGFyZSBub3QgcmVndWxhcilcbiAgICBjb25zdCBhbHBoYUlzVmFsaWQgPSAodHlwZW9mIG9yaWVudGF0aW9uWzBdID09PSAnbnVtYmVyJyk7XG5cbiAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wKSB7XG4gICAgICBsZXQgckFscGhhID0gbnVsbDtcbiAgICAgIGxldCByQmV0YTtcbiAgICAgIGxldCByR2FtbWE7XG5cbiAgICAgIGxldCBhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAwO1xuICAgICAgbGV0IGJldGFEaXNjb250aW51aXR5RmFjdG9yID0gMDtcbiAgICAgIGxldCBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAwO1xuXG4gICAgICBjb25zdCBkZWx0YVQgPSBub3cgLSB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXA7XG5cbiAgICAgIGlmIChhbHBoYUlzVmFsaWQpIHtcbiAgICAgICAgLy8gYWxwaGEgZGlzY29udGludWl0eSAoKzM2MCAtPiAwIG9yIDAgLT4gKzM2MClcbiAgICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSA+IDMyMCAmJiBvcmllbnRhdGlvblswXSA8IDQwKVxuICAgICAgICAgIGFscGhhRGlzY29udGludWl0eUZhY3RvciA9IDM2MDtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdIDwgNDAgJiYgb3JpZW50YXRpb25bMF0gPiAzMjApXG4gICAgICAgICAgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yID0gLTM2MDtcbiAgICAgIH1cblxuICAgICAgLy8gYmV0YSBkaXNjb250aW51aXR5ICgrMTgwIC0+IC0xODAgb3IgLTE4MCAtPiArMTgwKVxuICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSA+IDE0MCAmJiBvcmllbnRhdGlvblsxXSA8IC0xNDApXG4gICAgICAgIGJldGFEaXNjb250aW51aXR5RmFjdG9yID0gMzYwO1xuICAgICAgZWxzZSBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzFdIDwgLTE0MCAmJiBvcmllbnRhdGlvblsxXSA+IDE0MClcbiAgICAgICAgYmV0YURpc2NvbnRpbnVpdHlGYWN0b3IgPSAtMzYwO1xuXG4gICAgICAvLyBnYW1tYSBkaXNjb250aW51aXRpZXMgKCsxODAgLT4gLTE4MCBvciAtMTgwIC0+ICsxODApXG4gICAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdID4gNTAgJiYgb3JpZW50YXRpb25bMl0gPCAtNTApXG4gICAgICAgIGdhbW1hRGlzY29udGludWl0eUZhY3RvciA9IDE4MDtcbiAgICAgIGVsc2UgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSA8IC01MCAmJiBvcmllbnRhdGlvblsyXSA+IDUwKVxuICAgICAgICBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAtMTgwO1xuXG4gICAgICBpZiAoZGVsdGFUID4gMCkge1xuICAgICAgICAvLyBMb3cgcGFzcyBmaWx0ZXIgdG8gc21vb3RoIHRoZSBkYXRhXG4gICAgICAgIGlmIChhbHBoYUlzVmFsaWQpXG4gICAgICAgICAgckFscGhhID0gayAqIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMF0gKyAoMSAtIGspICogKG9yaWVudGF0aW9uWzBdIC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdICsgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcblxuICAgICAgICByQmV0YSA9IGsgKiB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzFdICsgKDEgLSBrKSAqIChvcmllbnRhdGlvblsxXSAtIHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSArIGJldGFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcbiAgICAgICAgckdhbW1hID0gayAqIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMl0gKyAoMSAtIGspICogKG9yaWVudGF0aW9uWzJdIC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdICsgZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcblxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzBdID0gckFscGhhO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzFdID0gckJldGE7XG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMl0gPSByR2FtbWE7XG4gICAgICB9XG5cbiAgICAgIC8vIFRPRE86IHJlc2FtcGxlIHRoZSBlbWlzc2lvbiByYXRlIHRvIG1hdGNoIHRoZSBkZXZpY2Vtb3Rpb24gcmF0ZVxuICAgICAgdGhpcy5yb3RhdGlvblJhdGUuZW1pdCh0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlKTtcbiAgICB9XG5cbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXAgPSBub3c7XG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdID0gb3JpZW50YXRpb25bMF07XG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzFdID0gb3JpZW50YXRpb25bMV07XG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdID0gb3JpZW50YXRpb25bMl07XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHJvdGF0aW9uIHJhdGUgY2FuIGJlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYG9yaWVudGF0aW9uYCB2YWx1ZXMgb3Igbm90LlxuICAgKlxuICAgKiBAdG9kbyAtIHRoaXMgc2hvdWxkIGJlIHJldmlld2VkIHRvIGNvbXBseSB3aXRoIHRoZSBheGlzIG9yZGVyIGRlZmluZWRcbiAgICogIGluIHRoZSBzcGVjXG4gICAqL1xuICAvLyBXQVJOSU5HXG4gIC8vIFRoZSBsaW5lcyBvZiBjb2RlIGJlbG93IGFyZSBjb21tZW50ZWQgYmVjYXVzZSBvZiBhIGJ1ZyBvZiBDaHJvbWVcbiAgLy8gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHdoZXJlICdkZXZpY2Vtb3Rpb24nIGV2ZW50cyBhcmUgbm90IHNlbnRcbiAgLy8gb3IgY2F1Z2h0IGlmIHRoZSBsaXN0ZW5lciBpcyBzZXQgdXAgYWZ0ZXIgYSAnZGV2aWNlb3JpZW50YXRpb24nXG4gIC8vIGxpc3RlbmVyLiBIZXJlLCB0aGUgX3RyeU9yaWVudGF0aW9uRmFsbGJhY2sgbWV0aG9kIHdvdWxkIGFkZCBhXG4gIC8vICdkZXZpY2VvcmllbnRhdGlvbicgbGlzdGVuZXIgYW5kIGJsb2NrIGFsbCBzdWJzZXF1ZW50ICdkZXZpY2Vtb3Rpb24nXG4gIC8vIGV2ZW50cyBvbiB0aGVzZSBkZXZpY2VzLiBDb21tZW50cyB3aWxsIGJlIHJlbW92ZWQgb25jZSB0aGUgYnVnIG9mXG4gIC8vIENocm9tZSBpcyBjb3JyZWN0ZWQuXG4gIC8vIF90cnlPcmllbnRhdGlvbkZhbGxiYWNrKCkge1xuICAvLyAgIE1vdGlvbklucHV0LnJlcXVpcmVNb2R1bGUoJ29yaWVudGF0aW9uJylcbiAgLy8gICAgIC50aGVuKChvcmllbnRhdGlvbikgPT4ge1xuICAvLyAgICAgICBpZiAob3JpZW50YXRpb24uaXNWYWxpZCkge1xuICAvLyAgICAgICAgIGNvbnNvbGUubG9nKGBcbiAgLy8gICAgICAgICAgIFdBUk5JTkcgKG1vdGlvbi1pbnB1dCk6IFRoZSAnZGV2aWNlbW90aW9uJyBldmVudCBkb2VzIG5vdCBleGlzdHMgb3JcbiAgLy8gICAgICAgICAgIGRvZXMgbm90IHByb3ZpZGUgcm90YXRpb24gcmF0ZSB2YWx1ZXMgaW4geW91ciBicm93c2VyLCBzbyB0aGUgcm90YXRpb25cbiAgLy8gICAgICAgICAgIHJhdGUgb2YgdGhlIGRldmljZSBpcyBlc3RpbWF0ZWQgZnJvbSB0aGUgJ29yaWVudGF0aW9uJywgY2FsY3VsYXRlZFxuICAvLyAgICAgICAgICAgZnJvbSB0aGUgJ2RldmljZW9yaWVudGF0aW9uJyBldmVudC4gU2luY2UgdGhlIGNvbXBhc3MgbWlnaHQgbm90XG4gIC8vICAgICAgICAgICBiZSBhdmFpbGFibGUsIG9ubHkgXFxgYmV0YVxcYCBhbmQgXFxgZ2FtbWFcXGAgYW5nbGVzIG1heSBiZSBwcm92aWRlZFxuICAvLyAgICAgICAgICAgKFxcYGFscGhhXFxgIHdvdWxkIGJlIG51bGwpLmBcbiAgLy8gICAgICAgICApO1xuXG4gIC8vICAgICAgICAgdGhpcy5yb3RhdGlvblJhdGUuaXNDYWxjdWxhdGVkID0gdHJ1ZTtcblxuICAvLyAgICAgICAgIE1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdvcmllbnRhdGlvbicsIChvcmllbnRhdGlvbikgPT4ge1xuICAvLyAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlUm90YXRpb25SYXRlRnJvbU9yaWVudGF0aW9uKG9yaWVudGF0aW9uKTtcbiAgLy8gICAgICAgICB9KTtcbiAgLy8gICAgICAgfVxuXG4gIC8vICAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlKHRoaXMpO1xuICAvLyAgICAgfSk7XG4gIC8vIH1cblxuICBfcHJvY2VzcyhkYXRhKSB7XG4gICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uKGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIG9mIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEByZXR1cm4ge3Byb21pc2V9XG4gICAqL1xuICBpbml0KCkge1xuICAgIHJldHVybiBzdXBlci5pbml0KChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSA9IHJlc29sdmU7XG5cbiAgICAgIGlmICh3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQpIHtcbiAgICAgICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2s7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCB0aGlzLl9wcm9jZXNzKTtcbiAgICAgICAgLy8gc2V0IGZhbGxiYWNrIHRpbWVvdXQgZm9yIEZpcmVmb3ggKGl0cyB3aW5kb3cgbmV2ZXIgY2FsbGluZyB0aGUgRGV2aWNlT3JpZW50YXRpb24gZXZlbnQsIGFcbiAgICAgICAgLy8gcmVxdWlyZSBvZiB0aGUgRGV2aWNlT3JpZW50YXRpb24gc2VydmljZSB3aWxsIHJlc3VsdCBpbiB0aGUgcmVxdWlyZSBwcm9taXNlIG5ldmVyIGJlaW5nIHJlc29sdmVkXG4gICAgICAgIC8vIGhlbmNlIHRoZSBFeHBlcmltZW50IHN0YXJ0KCkgbWV0aG9kIG5ldmVyIGNhbGxlZClcbiAgICAgICAgdGhpcy5fY2hlY2tUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHJlc29sdmUodGhpcyksIDUwMCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFdBUk5JTkdcbiAgICAgIC8vIFRoZSBsaW5lcyBvZiBjb2RlIGJlbG93IGFyZSBjb21tZW50ZWQgYmVjYXVzZSBvZiBhIGJ1ZyBvZiBDaHJvbWVcbiAgICAgIC8vIG9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzLCB3aGVyZSAnZGV2aWNlbW90aW9uJyBldmVudHMgYXJlIG5vdCBzZW50XG4gICAgICAvLyBvciBjYXVnaHQgaWYgdGhlIGxpc3RlbmVyIGlzIHNldCB1cCBhZnRlciBhICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAgIC8vIGxpc3RlbmVyLiBIZXJlLCB0aGUgX3RyeU9yaWVudGF0aW9uRmFsbGJhY2sgbWV0aG9kIHdvdWxkIGFkZCBhXG4gICAgICAvLyAnZGV2aWNlb3JpZW50YXRpb24nIGxpc3RlbmVyIGFuZCBibG9jayBhbGwgc3Vic2VxdWVudCAnZGV2aWNlbW90aW9uJ1xuICAgICAgLy8gZXZlbnRzIG9uIHRoZXNlIGRldmljZXMuIENvbW1lbnRzIHdpbGwgYmUgcmVtb3ZlZCBvbmNlIHRoZSBidWcgb2ZcbiAgICAgIC8vIENocm9tZSBpcyBjb3JyZWN0ZWQuXG5cbiAgICAgIC8vIGVsc2UgaWYgKHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlKVxuICAgICAgLy8gdGhpcy5fdHJ5T3JpZW50YXRpb25GYWxsYmFjaygpO1xuXG4gICAgICBlbHNlXG4gICAgICAgIHJlc29sdmUodGhpcyk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IERldmljZU1vdGlvbk1vZHVsZSgpO1xuIl19