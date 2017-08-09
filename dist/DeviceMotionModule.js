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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRldmljZU1vdGlvbk1vZHVsZS5qcyJdLCJuYW1lcyI6WyJnZXRMb2NhbFRpbWUiLCJ3aW5kb3ciLCJwZXJmb3JtYW5jZSIsIm5vdyIsIkRhdGUiLCJjaHJvbWVSZWdFeHAiLCJ0b0RlZyIsIk1hdGgiLCJQSSIsIkRldmljZU1vdGlvbk1vZHVsZSIsImV2ZW50IiwiYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSIsImFjY2VsZXJhdGlvbiIsInJvdGF0aW9uUmF0ZSIsInJlcXVpcmVkIiwiX3Byb21pc2VSZXNvbHZlIiwiX3VuaWZ5TW90aW9uRGF0YSIsIm9zIiwiZmFtaWx5IiwiX3VuaWZ5UGVyaW9kIiwiX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb24iLCJfY2FsY3VsYXRlZEFjY2VsZXJhdGlvblRpbWVDb25zdGFudCIsIl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSIsIl9jYWxjdWxhdGVkUm90YXRpb25SYXRlIiwiX2xhc3RPcmllbnRhdGlvbiIsIl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXAiLCJfcHJvY2Vzc0Z1bmN0aW9uIiwiX3Byb2Nlc3MiLCJiaW5kIiwiX2RldmljZW1vdGlvbkNoZWNrIiwiX2RldmljZW1vdGlvbkxpc3RlbmVyIiwiX2NoZWNrQ291bnRlciIsImUiLCJjbGVhclRpbWVvdXQiLCJfY2hlY2tUaW1lb3V0SWQiLCJpc1Byb3ZpZGVkIiwicGVyaW9kIiwiaW50ZXJ2YWwiLCJ4IiwieSIsInoiLCJhbHBoYSIsImJldGEiLCJnYW1tYSIsInRlc3QiLCJuYW1lIiwiaXNDYWxjdWxhdGVkIiwibGlzdGVuZXJzIiwic2l6ZSIsIl9lbWl0RGV2aWNlTW90aW9uRXZlbnQiLCJpc1ZhbGlkIiwiX2VtaXRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RXZlbnQiLCJfZW1pdEFjY2VsZXJhdGlvbkV2ZW50IiwiX2VtaXRSb3RhdGlvblJhdGVFdmVudCIsIm91dEV2ZW50IiwiZW1pdCIsImsiLCJfY2FsY3VsYXRlZEFjY2VsZXJhdGlvbkRlY2F5Iiwib3JpZW50YXRpb24iLCJhbHBoYUlzVmFsaWQiLCJyQWxwaGEiLCJyQmV0YSIsInJHYW1tYSIsImFscGhhRGlzY29udGludWl0eUZhY3RvciIsImJldGFEaXNjb250aW51aXR5RmFjdG9yIiwiZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yIiwiZGVsdGFUIiwiZGF0YSIsInJlc29sdmUiLCJEZXZpY2VNb3Rpb25FdmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXRUaW1lb3V0IiwiZXhwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOzs7Ozs7QUFNQSxTQUFTQSxZQUFULEdBQXdCO0FBQ3RCLE1BQUlDLE9BQU9DLFdBQVgsRUFDRSxPQUFPRCxPQUFPQyxXQUFQLENBQW1CQyxHQUFuQixLQUEyQixJQUFsQztBQUNGLFNBQU9DLEtBQUtELEdBQUwsS0FBYSxJQUFwQjtBQUNEOztBQUVELElBQU1FLGVBQWUsUUFBckI7QUFDQSxJQUFNQyxRQUFRLE1BQU1DLEtBQUtDLEVBQXpCOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW1CTUMsa0I7OztBQUVKOzs7OztBQUtBLGdDQUFjO0FBQUE7O0FBR1o7Ozs7Ozs7QUFIWSx3SUFDTixjQURNOztBQVVaLFVBQUtDLEtBQUwsR0FBYSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUErQixJQUEvQixFQUFxQyxJQUFyQyxFQUEyQyxJQUEzQyxFQUFpRCxJQUFqRCxDQUFiOztBQUVBOzs7Ozs7O0FBT0EsVUFBS0MsNEJBQUwsR0FBb0MsdUNBQTRCLDhCQUE1QixDQUFwQzs7QUFFQTs7Ozs7Ozs7OztBQVVBLFVBQUtDLFlBQUwsR0FBb0IsdUNBQTRCLGNBQTVCLENBQXBCOztBQUVBOzs7Ozs7Ozs7O0FBVUEsVUFBS0MsWUFBTCxHQUFvQix1Q0FBNEIsY0FBNUIsQ0FBcEI7O0FBRUE7Ozs7Ozs7OztBQVNBLFVB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a0IsVUFBQ0MsT0FBRCxFQUFhO0FBQzdCLGVBQUtyRCxlQUFMLEdBQXVCcUQsT0FBdkI7O0FBRUEsWUFBSW5FLE9BQU9vRSxpQkFBWCxFQUE4QjtBQUM1QixpQkFBSzNDLGdCQUFMLEdBQXdCLE9BQUtHLGtCQUE3QjtBQUNBNUIsaUJBQU9xRSxnQkFBUCxDQUF3QixjQUF4QixFQUF3QyxPQUFLM0MsUUFBN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBS08sZUFBTCxHQUF1QnFDLFdBQVc7QUFBQSxtQkFBTUgsZUFBTjtBQUFBLFdBQVgsRUFBZ0MsR0FBaEMsQ0FBdkI7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBbkJBLGFBc0JFQTtBQUNILE9BMUJEO0FBMkJEOzs7d0JBM1lrQztBQUNqQyxhQUFPN0QsS0FBS2lFLEdBQUwsQ0FBUyxDQUFDLENBQUQsR0FBS2pFLEtBQUtDLEVBQVYsR0FBZSxLQUFLRyw0QkFBTCxDQUFrQ3lCLE1BQWpELEdBQTBELEtBQUtmLG1DQUF4RSxDQUFQO0FBQ0Q7Ozs7OztrQkE0WVksSUFBSVosa0JBQUosRSIsImZpbGUiOiJEZXZpY2VNb3Rpb25Nb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSW5wdXRNb2R1bGUgZnJvbSAnLi9JbnB1dE1vZHVsZSc7XG5pbXBvcnQgRE9NRXZlbnRTdWJtb2R1bGUgZnJvbSAnLi9ET01FdmVudFN1Ym1vZHVsZSc7XG5pbXBvcnQgTW90aW9uSW5wdXQgZnJvbSAnLi9Nb3Rpb25JbnB1dCc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAncGxhdGZvcm0nO1xuXG4vKipcbiAqIEdldHMgdGhlIGN1cnJlbnQgbG9jYWwgdGltZSBpbiBzZWNvbmRzLlxuICogVXNlcyBgd2luZG93LnBlcmZvcm1hbmNlLm5vdygpYCBpZiBhdmFpbGFibGUsIGFuZCBgRGF0ZS5ub3coKWAgb3RoZXJ3aXNlLlxuICpcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gZ2V0TG9jYWxUaW1lKCkge1xuICBpZiAod2luZG93LnBlcmZvcm1hbmNlKVxuICAgIHJldHVybiB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgLyAxMDAwO1xuICByZXR1cm4gRGF0ZS5ub3coKSAvIDEwMDA7XG59XG5cbmNvbnN0IGNocm9tZVJlZ0V4cCA9IC9DaHJvbWUvO1xuY29uc3QgdG9EZWcgPSAxODAgLyBNYXRoLlBJO1xuXG4vKipcbiAqIGBEZXZpY2VNb3Rpb25gIG1vZHVsZSBzaW5nbGV0b24uXG4gKiBUaGUgYERldmljZU1vdGlvbk1vZHVsZWAgc2luZ2xldG9uIHByb3ZpZGVzIHRoZSByYXcgdmFsdWVzXG4gKiBvZiB0aGUgYWNjZWxlcmF0aW9uIGluY2x1ZGluZyBncmF2aXR5LCBhY2NlbGVyYXRpb24sIGFuZCByb3RhdGlvblxuICogcmF0ZSBwcm92aWRlZCBieSB0aGUgYERldmljZU1vdGlvbmAgZXZlbnQuXG4gKiBJdCBhbHNvIGluc3RhbnRpYXRlIHRoZSBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsXG4gKiBgQWNjZWxlcmF0aW9uYCBhbmQgYFJvdGF0aW9uUmF0ZWAgc3VibW9kdWxlcyB0aGF0IHVuaWZ5IHRob3NlIHZhbHVlc1xuICogYWNyb3NzIHBsYXRmb3JtcyBieSBtYWtpbmcgdGhlbSBjb21wbGlhbnQgd2l0aCB7QGxpbmtcbiAqIGh0dHA6Ly93d3cudzMub3JnL1RSL29yaWVudGF0aW9uLWV2ZW50L3x0aGUgVzNDIHN0YW5kYXJkfS5cbiAqIFdoZW4gcmF3IHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IHRoZSBzZW5zb3JzLCB0aGlzIG1vZHVsZXMgdHJpZXNcbiAqIHRvIHJlY2FsY3VsYXRlIHRoZW0gZnJvbSBhdmFpbGFibGUgdmFsdWVzOlxuICogLSBgYWNjZWxlcmF0aW9uYCBpcyBjYWxjdWxhdGVkIGZyb20gYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgXG4gKiAgIHdpdGggYSBoaWdoLXBhc3MgZmlsdGVyO1xuICogLSAoY29taW5nIHNvb24g4oCUIHdhaXRpbmcgZm9yIGEgYnVnIG9uIENocm9tZSB0byBiZSByZXNvbHZlZClcbiAqICAgYHJvdGF0aW9uUmF0ZWAgaXMgY2FsY3VsYXRlZCBmcm9tIGBvcmllbnRhdGlvbmAuXG4gKlxuICogQGNsYXNzIERldmljZU1vdGlvbk1vZHVsZVxuICogQGV4dGVuZHMgSW5wdXRNb2R1bGVcbiAqL1xuY2xhc3MgRGV2aWNlTW90aW9uTW9kdWxlIGV4dGVuZHMgSW5wdXRNb2R1bGUge1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBgRGV2aWNlTW90aW9uYCBtb2R1bGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJ2RldmljZW1vdGlvbicpO1xuXG4gICAgLyoqXG4gICAgICogUmF3IHZhbHVlcyBjb21pbmcgZnJvbSB0aGUgYGRldmljZW1vdGlvbmAgZXZlbnQgc2VudCBieSB0aGlzIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50ID0gW251bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGxdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCBtb2R1bGUuXG4gICAgICogUHJvdmlkZXMgdW5pZmllZCB2YWx1ZXMgb2YgdGhlIGFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKi9cbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBuZXcgRE9NRXZlbnRTdWJtb2R1bGUodGhpcywgJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgQWNjZWxlcmF0aW9uYCBzdWJtb2R1bGUuXG4gICAgICogUHJvdmlkZXMgdW5pZmllZCB2YWx1ZXMgb2YgdGhlIGFjY2VsZXJhdGlvbi5cbiAgICAgKiBFc3RpbWF0ZXMgdGhlIGFjY2VsZXJhdGlvbiB2YWx1ZXMgZnJvbSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWBcbiAgICAgKiByYXcgdmFsdWVzIGlmIHRoZSBhY2NlbGVyYXRpb24gcmF3IHZhbHVlcyBhcmUgbm90IGF2YWlsYWJsZSBvbiB0aGVcbiAgICAgKiBkZXZpY2UuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5hY2NlbGVyYXRpb24gPSBuZXcgRE9NRXZlbnRTdWJtb2R1bGUodGhpcywgJ2FjY2VsZXJhdGlvbicpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBSb3RhdGlvblJhdGVgIHN1Ym1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyB1bmlmaWVkIHZhbHVlcyBvZiB0aGUgcm90YXRpb24gcmF0ZS5cbiAgICAgKiAoY29taW5nIHNvb24sIHdhaXRpbmcgZm9yIGEgYnVnIG9uIENocm9tZSB0byBiZSByZXNvbHZlZClcbiAgICAgKiBFc3RpbWF0ZXMgdGhlIHJvdGF0aW9uIHJhdGUgdmFsdWVzIGZyb20gYG9yaWVudGF0aW9uYCB2YWx1ZXMgaWZcbiAgICAgKiB0aGUgcm90YXRpb24gcmF0ZSByYXcgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlIG9uIHRoZSBkZXZpY2UuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5yb3RhdGlvblJhdGUgPSBuZXcgRE9NRXZlbnRTdWJtb2R1bGUodGhpcywgJ3JvdGF0aW9uUmF0ZScpO1xuXG4gICAgLyoqXG4gICAgICogUmVxdWlyZWQgc3VibW9kdWxlcyAvIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtib29sfSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcyBhcmUgcmVxdWlyZWQgb3Igbm90IChkZWZhdWx0cyB0byBgZmFsc2VgKS5cbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IGFjY2VsZXJhdGlvbiAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBgYWNjZWxlcmF0aW9uYCB1bmlmaWVkIHZhbHVlcyBhcmUgcmVxdWlyZWQgb3Igbm90IChkZWZhdWx0cyB0byBgZmFsc2VgKS5cbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IHJvdGF0aW9uUmF0ZSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBgcm90YXRpb25SYXRlYCB1bmlmaWVkIHZhbHVlcyBhcmUgcmVxdWlyZWQgb3Igbm90IChkZWZhdWx0cyB0byBgZmFsc2VgKS5cbiAgICAgKi9cbiAgICB0aGlzLnJlcXVpcmVkID0ge1xuICAgICAgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eTogZmFsc2UsXG4gICAgICBhY2NlbGVyYXRpb246IGZhbHNlLFxuICAgICAgcm90YXRpb25SYXRlOiBmYWxzZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlIGZ1bmN0aW9uIG9mIHRoZSBtb2R1bGUncyBwcm9taXNlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKiBAc2VlIERldmljZU1vdGlvbk1vZHVsZSNpbml0XG4gICAgICovXG4gICAgdGhpcy5fcHJvbWlzZVJlc29sdmUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVW5pZnlpbmcgZmFjdG9yIG9mIHRoZSBtb3Rpb24gZGF0YSB2YWx1ZXMgKGAxYCBvbiBBbmRyb2lkLCBgLTFgIG9uIGlPUykuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX3VuaWZ5TW90aW9uRGF0YSA9IChwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdpT1MnKSA/IC0xIDogMTtcblxuICAgIC8qKlxuICAgICAqIFVuaWZ5aW5nIGZhY3RvciBvZiB0aGUgcGVyaW9kIChgMWAgb24gQW5kcm9pZCwgYDFgIG9uIGlPUykuIGluIHNlY1xuICAgICAqIEB0b2RvIC0gdW5pZnkgd2l0aCBlLmludGVydmFsIHNwZWNpZmljYXRpb24gKGluIG1zKSA/XG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX3VuaWZ5UGVyaW9kID0gKHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ0FuZHJvaWQnKSA/IDAuMDAxIDogMTtcblxuICAgIC8qKlxuICAgICAqIEFjY2VsZXJhdGlvbiBjYWxjdWxhdGVkIGZyb20gdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb24gPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBUaW1lIGNvbnN0YW50IChoYWxmLWxpZmUpIG9mIHRoZSBoaWdoLXBhc3MgZmlsdGVyIHVzZWQgdG8gc21vb3RoIHRoZSBhY2NlbGVyYXRpb24gdmFsdWVzIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYWNjZWxlcmF0aW9uIGluY2x1ZGluZyBncmF2aXR5IHJhdyB2YWx1ZXMgKGluIHNlY29uZHMpLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAwLjFcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uVGltZUNvbnN0YW50ID0gMC4xO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWUsIHVzZWQgaW4gdGhlIGhpZ2gtcGFzcyBmaWx0ZXIgdG8gY2FsY3VsYXRlIHRoZSBhY2NlbGVyYXRpb24gKGlmIHRoZSBgYWNjZWxlcmF0aW9uYCB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSBgJ2RldmljZW1vdGlvbidgKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIFJvdGF0aW9uIHJhdGUgY2FsY3VsYXRlZCBmcm9tIHRoZSBvcmllbnRhdGlvbiB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZSA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIExhdGVzdCBvcmllbnRhdGlvbiB2YWx1ZSwgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHJvdGF0aW9uIHJhdGUgIChpZiB0aGUgYHJvdGF0aW9uUmF0ZWAgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgYCdkZXZpY2Vtb3Rpb24nYCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IG9yaWVudGF0aW9uIHRpbWVzdGFtcHMsIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSByb3RhdGlvbiByYXRlIChpZiB0aGUgYHJvdGF0aW9uUmF0ZWAgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgYCdkZXZpY2Vtb3Rpb24nYCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wID0gbnVsbDtcblxuICAgIHRoaXMuX3Byb2Nlc3NGdW5jdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fcHJvY2VzcyA9IHRoaXMuX3Byb2Nlc3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9kZXZpY2Vtb3Rpb25DaGVjayA9IHRoaXMuX2RldmljZW1vdGlvbkNoZWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZGV2aWNlbW90aW9uTGlzdGVuZXIgPSB0aGlzLl9kZXZpY2Vtb3Rpb25MaXN0ZW5lci5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fY2hlY2tDb3VudGVyID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWNheSBmYWN0b3Igb2YgdGhlIGhpZ2gtcGFzcyBmaWx0ZXIgdXNlZCB0byBjYWxjdWxhdGUgdGhlIGFjY2VsZXJhdGlvbiBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlcy5cbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25EZWNheSgpIHtcbiAgICByZXR1cm4gTWF0aC5leHAoLTIgKiBNYXRoLlBJICogdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnBlcmlvZCAvIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25UaW1lQ29uc3RhbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbnNvciBjaGVjayBvbiBpbml0aWFsaXphdGlvbiBvZiB0aGUgbW9kdWxlLlxuICAgKiBUaGlzIG1ldGhvZDpcbiAgICogLSBjaGVja3Mgd2hldGhlciB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCB0aGUgYGFjY2VsZXJhdGlvbmAsXG4gICAqICAgYW5kIHRoZSBgcm90YXRpb25SYXRlYCB2YWx1ZXMgYXJlIHZhbGlkIG9yIG5vdDtcbiAgICogLSBnZXRzIHRoZSBwZXJpb2Qgb2YgdGhlIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgYW5kIHNldHMgdGhlIHBlcmlvZCBvZlxuICAgKiAgIHRoZSBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIGBBY2NlbGVyYXRpb25gLCBhbmQgYFJvdGF0aW9uUmF0ZWBcbiAgICogICBzdWJtb2R1bGVzO1xuICAgKiAtIChpbiB0aGUgY2FzZSB3aGVyZSBhY2NlbGVyYXRpb24gcmF3IHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkKVxuICAgKiAgIGluZGljYXRlcyB3aGV0aGVyIHRoZSBhY2NlbGVyYXRpb24gY2FuIGJlIGNhbGN1bGF0ZWQgZnJvbSB0aGVcbiAgICogICBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMgb3Igbm90LlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gVGhlIGZpcnN0IGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgY2F1Z2h0LlxuICAgKi9cbiAgX2RldmljZW1vdGlvbkNoZWNrKGUpIHtcbiAgICAvLyBjbGVhciB0aW1lb3V0IChhbnRpLUZpcmVmb3ggYnVnIHNvbHV0aW9uLCB3aW5kb3cgZXZlbnQgZGV2aWNlb3JpZW50YXRpb24gYmVpbmcgbnZlciBjYWxsZWQpXG4gICAgLy8gc2V0IHRoZSBzZXQgdGltZW91dCBpbiBpbml0KCkgZnVuY3Rpb25cbiAgICBjbGVhclRpbWVvdXQodGhpcy5fY2hlY2tUaW1lb3V0SWQpO1xuXG4gICAgdGhpcy5pc1Byb3ZpZGVkID0gdHJ1ZTtcbiAgICB0aGlzLnBlcmlvZCA9IGUuaW50ZXJ2YWwgLyAxMDAwO1xuXG4gICAgLy8gU2Vuc29yIGF2YWlsYWJpbGl0eSBmb3IgdGhlIGFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eVxuICAgIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1Byb3ZpZGVkID0gKFxuICAgICAgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54ID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnkgPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueiA9PT0gJ251bWJlcicpXG4gICAgKTtcbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkucGVyaW9kID0gZS5pbnRlcnZhbCAqIHRoaXMuX3VuaWZ5UGVyaW9kO1xuXG4gICAgLy8gU2Vuc29yIGF2YWlsYWJpbGl0eSBmb3IgdGhlIGFjY2VsZXJhdGlvblxuICAgIHRoaXMuYWNjZWxlcmF0aW9uLmlzUHJvdmlkZWQgPSAoXG4gICAgICBlLmFjY2VsZXJhdGlvbiAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbi54ID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb24ueSA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uLnogPT09ICdudW1iZXInKVxuICAgICk7XG4gICAgdGhpcy5hY2NlbGVyYXRpb24ucGVyaW9kID0gZS5pbnRlcnZhbCAqIHRoaXMuX3VuaWZ5UGVyaW9kO1xuXG4gICAgLy8gU2Vuc29yIGF2YWlsYWJpbGl0eSBmb3IgdGhlIHJvdGF0aW9uIHJhdGVcbiAgICB0aGlzLnJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkID0gKFxuICAgICAgZS5yb3RhdGlvblJhdGUgJiZcbiAgICAgICh0eXBlb2YgZS5yb3RhdGlvblJhdGUuYWxwaGEgPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLnJvdGF0aW9uUmF0ZS5iZXRhICA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUucm90YXRpb25SYXRlLmdhbW1hID09PSAnbnVtYmVyJylcbiAgICApO1xuICAgIHRoaXMucm90YXRpb25SYXRlLnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIGluIGZpcmVmb3ggYW5kcm9pZCwgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSByZXRyaWV2ZSBudWxsIHZhbHVlc1xuICAgIC8vIG9uIHRoZSBmaXJzdCBjYWxsYmFjay4gc28gd2FpdCBhIHNlY29uZCBjYWxsIHRvIGJlIHN1cmUuXG4gICAgaWYgKFxuICAgICAgcGxhdGZvcm0ub3MuZmFtaWx5ID09PSAnQW5kcm9pZCcgJiZcbiAgICAgIC9GaXJlZm94Ly50ZXN0KHBsYXRmb3JtLm5hbWUpICYmXG4gICAgICB0aGlzLl9jaGVja0NvdW50ZXIgPCAxXG4gICAgKSB7XG4gICAgICB0aGlzLl9jaGVja0NvdW50ZXIrKztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbm93IHRoYXQgdGhlIHNlbnNvcnMgYXJlIGNoZWNrZWQsIHJlcGxhY2UgdGhlIHByb2Nlc3MgZnVuY3Rpb24gd2l0aFxuICAgICAgLy8gdGhlIGZpbmFsIGxpc3RlbmVyXG4gICAgICB0aGlzLl9wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLl9kZXZpY2Vtb3Rpb25MaXN0ZW5lcjtcblxuICAgICAgLy8gaWYgYWNjZWxlcmF0aW9uIGlzIG5vdCBwcm92aWRlZCBieSByYXcgc2Vuc29ycywgaW5kaWNhdGUgd2hldGhlciBpdFxuICAgICAgLy8gY2FuIGJlIGNhbGN1bGF0ZWQgd2l0aCBgYWNjZWxlcmF0aW9uaW5jbHVkaW5nZ3Jhdml0eWAgb3Igbm90XG4gICAgICBpZiAoIXRoaXMuYWNjZWxlcmF0aW9uLmlzUHJvdmlkZWQpXG4gICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uLmlzQ2FsY3VsYXRlZCA9IHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1Byb3ZpZGVkO1xuXG4gICAgICAvLyBXQVJOSU5HXG4gICAgICAvLyBUaGUgbGluZXMgb2YgY29kZSBiZWxvdyBhcmUgY29tbWVudGVkIGJlY2F1c2Ugb2YgYSBidWcgb2YgQ2hyb21lXG4gICAgICAvLyBvbiBzb21lIEFuZHJvaWQgZGV2aWNlcywgd2hlcmUgJ2RldmljZW1vdGlvbicgZXZlbnRzIGFyZSBub3Qgc2VudFxuICAgICAgLy8gb3IgY2F1Z2h0IGlmIHRoZSBsaXN0ZW5lciBpcyBzZXQgdXAgYWZ0ZXIgYSAnZGV2aWNlb3JpZW50YXRpb24nXG4gICAgICAvLyBsaXN0ZW5lci4gSGVyZSwgdGhlIF90cnlPcmllbnRhdGlvbkZhbGxiYWNrIG1ldGhvZCB3b3VsZCBhZGQgYVxuICAgICAgLy8gJ2RldmljZW9yaWVudGF0aW9uJyBsaXN0ZW5lciBhbmQgYmxvY2sgYWxsIHN1YnNlcXVlbnQgJ2RldmljZW1vdGlvbidcbiAgICAgIC8vIGV2ZW50cyBvbiB0aGVzZSBkZXZpY2VzLiBDb21tZW50cyB3aWxsIGJlIHJlbW92ZWQgb25jZSB0aGUgYnVnIG9mXG4gICAgICAvLyBDaHJvbWUgaXMgY29ycmVjdGVkLlxuXG4gICAgICAvLyBpZiAodGhpcy5yZXF1aXJlZC5yb3RhdGlvblJhdGUgJiYgIXRoaXMucm90YXRpb25SYXRlLmlzUHJvdmlkZWQpXG4gICAgICAvLyAgIHRoaXMuX3RyeU9yaWVudGF0aW9uRmFsbGJhY2soKTtcbiAgICAgIC8vIGVsc2VcbiAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGNhbGxiYWNrLlxuICAgKiBUaGlzIG1ldGhvZCBlbWl0cyBhbiBldmVudCB3aXRoIHRoZSByYXcgYCdkZXZpY2Vtb3Rpb24nYCB2YWx1ZXMsIGFuZCBlbWl0c1xuICAgKiBldmVudHMgd2l0aCB0aGUgdW5pZmllZCBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIGBhY2NlbGVyYXRpb25gLFxuICAgKiBhbmQgLyBvciBgcm90YXRpb25SYXRlYCB2YWx1ZXMgaWYgdGhleSBhcmUgcmVxdWlyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICovXG4gIF9kZXZpY2Vtb3Rpb25MaXN0ZW5lcihlKSB7XG4gICAgLy8gJ2RldmljZW1vdGlvbicgZXZlbnQgKHJhdyB2YWx1ZXMpXG4gICAgaWYgKHRoaXMubGlzdGVuZXJzLnNpemUgPiAwKVxuICAgICAgdGhpcy5fZW1pdERldmljZU1vdGlvbkV2ZW50KGUpO1xuXG4gICAgLy8gYWxlcnQoYCR7dGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lmxpc3RlbmVycy5zaXplfSAtXG4gICAgLy8gICAgICR7dGhpcy5yZXF1aXJlZC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5fSAtXG4gICAgLy8gICAgICR7dGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzVmFsaWR9XG4gICAgLy8gYCk7XG5cbiAgICAvLyAnYWNjZWxlcmF0aW9uJyBldmVudCAodW5pZmllZCB2YWx1ZXMpXG4gICAgaWYgKHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5saXN0ZW5lcnMuc2l6ZSA+IDAgJiZcbiAgICAgICAgdGhpcy5yZXF1aXJlZC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ICYmXG4gICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1ZhbGlkXG4gICAgKSB7XG4gICAgICB0aGlzLl9lbWl0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eUV2ZW50KGUpO1xuICAgIH1cblxuICAgIC8vICdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JyBldmVudCAodW5pZmllZCB2YWx1ZXMpXG4gICAgLy8gdGhlIGZhbGxiYWNrIGNhbGN1bGF0aW9uIG9mIHRoZSBhY2NlbGVyYXRpb24gaGFwcGVucyBpbiB0aGVcbiAgICAvLyAgYF9lbWl0QWNjZWxlcmF0aW9uYCBtZXRob2QsIHNvIHdlIGNoZWNrIGlmIHRoaXMuYWNjZWxlcmF0aW9uLmlzVmFsaWRcbiAgICBpZiAodGhpcy5hY2NlbGVyYXRpb24ubGlzdGVuZXJzLnNpemUgPiAwICYmXG4gICAgICAgIHRoaXMucmVxdWlyZWQuYWNjZWxlcmF0aW9uICYmXG4gICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uLmlzVmFsaWRcbiAgICApIHtcbiAgICAgIHRoaXMuX2VtaXRBY2NlbGVyYXRpb25FdmVudChlKTtcbiAgICB9XG5cbiAgICAvLyAncm90YXRpb25SYXRlJyBldmVudCAodW5pZmllZCB2YWx1ZXMpXG4gICAgLy8gdGhlIGZhbGxiYWNrIGNhbGN1bGF0aW9uIG9mIHRoZSByb3RhdGlvbiByYXRlIGRvZXMgTk9UIGhhcHBlbiBpbiB0aGVcbiAgICAvLyBgX2VtaXRSb3RhdGlvblJhdGVgIG1ldGhvZCwgc28gd2Ugb25seSBjaGVjayBpZiB0aGlzLnJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkXG4gICAgaWYgKHRoaXMucm90YXRpb25SYXRlLmxpc3RlbmVycy5zaXplID4gMCAmJlxuICAgICAgICB0aGlzLnJlcXVpcmVkLnJvdGF0aW9uUmF0ZSAmJlxuICAgICAgICB0aGlzLnJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkXG4gICAgKSB7XG4gICAgICB0aGlzLl9lbWl0Um90YXRpb25SYXRlRXZlbnQoZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBgJ2RldmljZW1vdGlvbidgIHJhdyB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICovXG4gIF9lbWl0RGV2aWNlTW90aW9uRXZlbnQoZSkge1xuICAgIGxldCBvdXRFdmVudCA9IHRoaXMuZXZlbnQ7XG5cbiAgICBpZiAoZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KSB7XG4gICAgICBvdXRFdmVudFswXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54O1xuICAgICAgb3V0RXZlbnRbMV0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueTtcbiAgICAgIG91dEV2ZW50WzJdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lno7XG4gICAgfVxuXG4gICAgaWYgKGUuYWNjZWxlcmF0aW9uKSB7XG4gICAgICBvdXRFdmVudFszXSA9IGUuYWNjZWxlcmF0aW9uLng7XG4gICAgICBvdXRFdmVudFs0XSA9IGUuYWNjZWxlcmF0aW9uLnk7XG4gICAgICBvdXRFdmVudFs1XSA9IGUuYWNjZWxlcmF0aW9uLno7XG4gICAgfVxuXG4gICAgaWYgKGUucm90YXRpb25SYXRlKSB7XG4gICAgICBvdXRFdmVudFs2XSA9IGUucm90YXRpb25SYXRlLmFscGhhO1xuICAgICAgb3V0RXZlbnRbN10gPSBlLnJvdGF0aW9uUmF0ZS5iZXRhO1xuICAgICAgb3V0RXZlbnRbOF0gPSBlLnJvdGF0aW9uUmF0ZS5nYW1tYTtcbiAgICB9XG5cbiAgICB0aGlzLmVtaXQob3V0RXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICovXG4gIF9lbWl0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eUV2ZW50KGUpIHtcbiAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuZXZlbnQ7XG5cbiAgICBvdXRFdmVudFswXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuICAgIG91dEV2ZW50WzFdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnkgKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgb3V0RXZlbnRbMl0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueiAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcblxuICAgIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYGFjY2VsZXJhdGlvbmAgdW5pZmllZCB2YWx1ZXMuXG4gICAqIFdoZW4gdGhlIGBhY2NlbGVyYXRpb25gIHJhdyB2YWx1ZXMgYXJlIG5vdCBhdmFpbGFibGUsIHRoZSBtZXRob2RcbiAgICogYWxzbyBjYWxjdWxhdGVzIHRoZSBhY2NlbGVyYXRpb24gZnJvbSB0aGVcbiAgICogYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHJhdyB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBUaGUgYCdkZXZpY2Vtb3Rpb24nYCBldmVudC5cbiAgICovXG4gIF9lbWl0QWNjZWxlcmF0aW9uRXZlbnQoZSkge1xuICAgIGxldCBvdXRFdmVudCA9IHRoaXMuYWNjZWxlcmF0aW9uLmV2ZW50O1xuXG4gICAgaWYgKHRoaXMuYWNjZWxlcmF0aW9uLmlzUHJvdmlkZWQpIHtcbiAgICAgIC8vIElmIHJhdyBhY2NlbGVyYXRpb24gdmFsdWVzIGFyZSBwcm92aWRlZFxuICAgICAgb3V0RXZlbnRbMF0gPSBlLmFjY2VsZXJhdGlvbi54ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuICAgICAgb3V0RXZlbnRbMV0gPSBlLmFjY2VsZXJhdGlvbi55ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuICAgICAgb3V0RXZlbnRbMl0gPSBlLmFjY2VsZXJhdGlvbi56ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzVmFsaWQpIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgaWYgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSB2YWx1ZXMgYXJlIHByb3ZpZGVkLFxuICAgICAgLy8gZXN0aW1hdGUgdGhlIGFjY2VsZXJhdGlvbiB3aXRoIGEgaGlnaC1wYXNzIGZpbHRlclxuICAgICAgY29uc3QgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSA9IFtcbiAgICAgICAgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnggKiB0aGlzLl91bmlmeU1vdGlvbkRhdGEsXG4gICAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhLFxuICAgICAgICBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueiAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YVxuICAgICAgXTtcbiAgICAgIGNvbnN0IGsgPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uRGVjYXk7XG5cbiAgICAgIC8vIEhpZ2gtcGFzcyBmaWx0ZXIgdG8gZXN0aW1hdGUgdGhlIGFjY2VsZXJhdGlvbiAod2l0aG91dCB0aGUgZ3Jhdml0eSlcbiAgICAgIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMF0gPSAoMSArIGspICogMC41ICogKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF0gLSB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXSkgKyBrICogdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblswXTtcbiAgICAgIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMV0gPSAoMSArIGspICogMC41ICogKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV0gLSB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXSkgKyBrICogdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsxXTtcbiAgICAgIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMl0gPSAoMSArIGspICogMC41ICogKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl0gLSB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXSkgKyBrICogdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsyXTtcblxuICAgICAgdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF0gPSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdO1xuICAgICAgdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV0gPSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdO1xuICAgICAgdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl0gPSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdO1xuXG4gICAgICBvdXRFdmVudFswXSA9IHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMF07XG4gICAgICBvdXRFdmVudFsxXSA9IHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMV07XG4gICAgICBvdXRFdmVudFsyXSA9IHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMl07XG4gICAgfVxuXG4gICAgdGhpcy5hY2NlbGVyYXRpb24uZW1pdChvdXRFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIGByb3RhdGlvblJhdGVgIHVuaWZpZWQgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZW1pdFJvdGF0aW9uUmF0ZUV2ZW50KGUpIHtcbiAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLnJvdGF0aW9uUmF0ZS5ldmVudDtcblxuICAgIC8vIEluIGFsbCBwbGF0Zm9ybXMsIHJvdGF0aW9uIGF4ZXMgYXJlIG1lc3NlZCB1cCBhY2NvcmRpbmcgdG8gdGhlIHNwZWNcbiAgICAvLyBodHRwczovL3czYy5naXRodWIuaW8vZGV2aWNlb3JpZW50YXRpb24vc3BlYy1zb3VyY2Utb3JpZW50YXRpb24uaHRtbFxuICAgIC8vXG4gICAgLy8gZ2FtbWEgc2hvdWxkIGJlIGFscGhhXG4gICAgLy8gYWxwaGEgc2hvdWxkIGJlIGJldGFcbiAgICAvLyBiZXRhIHNob3VsZCBiZSBnYW1tYVxuXG4gICAgb3V0RXZlbnRbMF0gPSBlLnJvdGF0aW9uUmF0ZS5nYW1tYTtcbiAgICBvdXRFdmVudFsxXSA9IGUucm90YXRpb25SYXRlLmFscGhhLFxuICAgIG91dEV2ZW50WzJdID0gZS5yb3RhdGlvblJhdGUuYmV0YTtcblxuICAgIC8vIENocm9tZSBBbmRyb2lkIHJldHJpZXZlIHZhbHVlcyB0aGF0IGFyZSBpbiByYWQvc1xuICAgIC8vIGNmLiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD01NDE2MDdcbiAgICAvL1xuICAgIC8vIEZyb20gc3BlYzogXCJUaGUgcm90YXRpb25SYXRlIGF0dHJpYnV0ZSBtdXN0IGJlIGluaXRpYWxpemVkIHdpdGggdGhlIHJhdGVcbiAgICAvLyBvZiByb3RhdGlvbiBvZiB0aGUgaG9zdGluZyBkZXZpY2UgaW4gc3BhY2UuIEl0IG11c3QgYmUgZXhwcmVzc2VkIGFzIHRoZVxuICAgIC8vIHJhdGUgb2YgY2hhbmdlIG9mIHRoZSBhbmdsZXMgZGVmaW5lZCBpbiBzZWN0aW9uIDQuMSBhbmQgbXVzdCBiZSBleHByZXNzZWRcbiAgICAvLyBpbiBkZWdyZWVzIHBlciBzZWNvbmQgKGRlZy9zKS5cIlxuICAgIGlmIChwbGF0Zm9ybS5vcy5uYW1lID09PSAnQW5kcm9pZCcgJiYgY2hyb21lUmVnRXhwLnRlc3QocGxhdGZvcm0ubmFtZSkpIHtcbiAgICAgIG91dEV2ZW50WzBdICo9IHRvRGVnO1xuICAgICAgb3V0RXZlbnRbMV0gKj0gdG9EZWcsXG4gICAgICBvdXRFdmVudFsyXSAqPSB0b0RlZztcbiAgICB9XG5cbiAgICB0aGlzLnJvdGF0aW9uUmF0ZS5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGFuZCBlbWl0cyB0aGUgYHJvdGF0aW9uUmF0ZWAgdW5pZmllZCB2YWx1ZXMgZnJvbSB0aGUgYG9yaWVudGF0aW9uYCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyW119IG9yaWVudGF0aW9uIC0gTGF0ZXN0IGBvcmllbnRhdGlvbmAgcmF3IHZhbHVlcy5cbiAgICovXG4gIF9jYWxjdWxhdGVSb3RhdGlvblJhdGVGcm9tT3JpZW50YXRpb24ob3JpZW50YXRpb24pIHtcbiAgICBjb25zdCBub3cgPSBnZXRMb2NhbFRpbWUoKTtcbiAgICBjb25zdCBrID0gMC44OyAvLyBUT0RPOiBpbXByb3ZlIGxvdyBwYXNzIGZpbHRlciAoZnJhbWVzIGFyZSBub3QgcmVndWxhcilcbiAgICBjb25zdCBhbHBoYUlzVmFsaWQgPSAodHlwZW9mIG9yaWVudGF0aW9uWzBdID09PSAnbnVtYmVyJyk7XG5cbiAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wKSB7XG4gICAgICBsZXQgckFscGhhID0gbnVsbDtcbiAgICAgIGxldCByQmV0YTtcbiAgICAgIGxldCByR2FtbWE7XG5cbiAgICAgIGxldCBhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAwO1xuICAgICAgbGV0IGJldGFEaXNjb250aW51aXR5RmFjdG9yID0gMDtcbiAgICAgIGxldCBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAwO1xuXG4gICAgICBjb25zdCBkZWx0YVQgPSBub3cgLSB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXA7XG5cbiAgICAgIGlmIChhbHBoYUlzVmFsaWQpIHtcbiAgICAgICAgLy8gYWxwaGEgZGlzY29udGludWl0eSAoKzM2MCAtPiAwIG9yIDAgLT4gKzM2MClcbiAgICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSA+IDMyMCAmJiBvcmllbnRhdGlvblswXSA8IDQwKVxuICAgICAgICAgIGFscGhhRGlzY29udGludWl0eUZhY3RvciA9IDM2MDtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdIDwgNDAgJiYgb3JpZW50YXRpb25bMF0gPiAzMjApXG4gICAgICAgICAgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yID0gLTM2MDtcbiAgICAgIH1cblxuICAgICAgLy8gYmV0YSBkaXNjb250aW51aXR5ICgrMTgwIC0+IC0xODAgb3IgLTE4MCAtPiArMTgwKVxuICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSA+IDE0MCAmJiBvcmllbnRhdGlvblsxXSA8IC0xNDApXG4gICAgICAgIGJldGFEaXNjb250aW51aXR5RmFjdG9yID0gMzYwO1xuICAgICAgZWxzZSBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzFdIDwgLTE0MCAmJiBvcmllbnRhdGlvblsxXSA+IDE0MClcbiAgICAgICAgYmV0YURpc2NvbnRpbnVpdHlGYWN0b3IgPSAtMzYwO1xuXG4gICAgICAvLyBnYW1tYSBkaXNjb250aW51aXRpZXMgKCsxODAgLT4gLTE4MCBvciAtMTgwIC0+ICsxODApXG4gICAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdID4gNTAgJiYgb3JpZW50YXRpb25bMl0gPCAtNTApXG4gICAgICAgIGdhbW1hRGlzY29udGludWl0eUZhY3RvciA9IDE4MDtcbiAgICAgIGVsc2UgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSA8IC01MCAmJiBvcmllbnRhdGlvblsyXSA+IDUwKVxuICAgICAgICBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAtMTgwO1xuXG4gICAgICBpZiAoZGVsdGFUID4gMCkge1xuICAgICAgICAvLyBMb3cgcGFzcyBmaWx0ZXIgdG8gc21vb3RoIHRoZSBkYXRhXG4gICAgICAgIGlmIChhbHBoYUlzVmFsaWQpXG4gICAgICAgICAgckFscGhhID0gayAqIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMF0gKyAoMSAtIGspICogKG9yaWVudGF0aW9uWzBdIC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdICsgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcblxuICAgICAgICByQmV0YSA9IGsgKiB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzFdICsgKDEgLSBrKSAqIChvcmllbnRhdGlvblsxXSAtIHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSArIGJldGFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcbiAgICAgICAgckdhbW1hID0gayAqIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMl0gKyAoMSAtIGspICogKG9yaWVudGF0aW9uWzJdIC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdICsgZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcblxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzBdID0gckFscGhhO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzFdID0gckJldGE7XG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMl0gPSByR2FtbWE7XG4gICAgICB9XG5cbiAgICAgIC8vIFRPRE86IHJlc2FtcGxlIHRoZSBlbWlzc2lvbiByYXRlIHRvIG1hdGNoIHRoZSBkZXZpY2Vtb3Rpb24gcmF0ZVxuICAgICAgdGhpcy5yb3RhdGlvblJhdGUuZW1pdCh0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlKTtcbiAgICB9XG5cbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXAgPSBub3c7XG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdID0gb3JpZW50YXRpb25bMF07XG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzFdID0gb3JpZW50YXRpb25bMV07XG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdID0gb3JpZW50YXRpb25bMl07XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHJvdGF0aW9uIHJhdGUgY2FuIGJlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYG9yaWVudGF0aW9uYCB2YWx1ZXMgb3Igbm90LlxuICAgKlxuICAgKiBAdG9kbyAtIHRoaXMgc2hvdWxkIGJlIHJldmlld2VkIHRvIGNvbXBseSB3aXRoIHRoZSBheGlzIG9yZGVyIGRlZmluZWRcbiAgICogIGluIHRoZSBzcGVjXG4gICAqL1xuICAvLyBXQVJOSU5HXG4gIC8vIFRoZSBsaW5lcyBvZiBjb2RlIGJlbG93IGFyZSBjb21tZW50ZWQgYmVjYXVzZSBvZiBhIGJ1ZyBvZiBDaHJvbWVcbiAgLy8gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHdoZXJlICdkZXZpY2Vtb3Rpb24nIGV2ZW50cyBhcmUgbm90IHNlbnRcbiAgLy8gb3IgY2F1Z2h0IGlmIHRoZSBsaXN0ZW5lciBpcyBzZXQgdXAgYWZ0ZXIgYSAnZGV2aWNlb3JpZW50YXRpb24nXG4gIC8vIGxpc3RlbmVyLiBIZXJlLCB0aGUgX3RyeU9yaWVudGF0aW9uRmFsbGJhY2sgbWV0aG9kIHdvdWxkIGFkZCBhXG4gIC8vICdkZXZpY2VvcmllbnRhdGlvbicgbGlzdGVuZXIgYW5kIGJsb2NrIGFsbCBzdWJzZXF1ZW50ICdkZXZpY2Vtb3Rpb24nXG4gIC8vIGV2ZW50cyBvbiB0aGVzZSBkZXZpY2VzLiBDb21tZW50cyB3aWxsIGJlIHJlbW92ZWQgb25jZSB0aGUgYnVnIG9mXG4gIC8vIENocm9tZSBpcyBjb3JyZWN0ZWQuXG4gIC8vIF90cnlPcmllbnRhdGlvbkZhbGxiYWNrKCkge1xuICAvLyAgIE1vdGlvbklucHV0LnJlcXVpcmVNb2R1bGUoJ29yaWVudGF0aW9uJylcbiAgLy8gICAgIC50aGVuKChvcmllbnRhdGlvbikgPT4ge1xuICAvLyAgICAgICBpZiAob3JpZW50YXRpb24uaXNWYWxpZCkge1xuICAvLyAgICAgICAgIGNvbnNvbGUubG9nKGBcbiAgLy8gICAgICAgICAgIFdBUk5JTkcgKG1vdGlvbi1pbnB1dCk6IFRoZSAnZGV2aWNlbW90aW9uJyBldmVudCBkb2VzIG5vdCBleGlzdHMgb3JcbiAgLy8gICAgICAgICAgIGRvZXMgbm90IHByb3ZpZGUgcm90YXRpb24gcmF0ZSB2YWx1ZXMgaW4geW91ciBicm93c2VyLCBzbyB0aGUgcm90YXRpb25cbiAgLy8gICAgICAgICAgIHJhdGUgb2YgdGhlIGRldmljZSBpcyBlc3RpbWF0ZWQgZnJvbSB0aGUgJ29yaWVudGF0aW9uJywgY2FsY3VsYXRlZFxuICAvLyAgICAgICAgICAgZnJvbSB0aGUgJ2RldmljZW9yaWVudGF0aW9uJyBldmVudC4gU2luY2UgdGhlIGNvbXBhc3MgbWlnaHQgbm90XG4gIC8vICAgICAgICAgICBiZSBhdmFpbGFibGUsIG9ubHkgXFxgYmV0YVxcYCBhbmQgXFxgZ2FtbWFcXGAgYW5nbGVzIG1heSBiZSBwcm92aWRlZFxuICAvLyAgICAgICAgICAgKFxcYGFscGhhXFxgIHdvdWxkIGJlIG51bGwpLmBcbiAgLy8gICAgICAgICApO1xuXG4gIC8vICAgICAgICAgdGhpcy5yb3RhdGlvblJhdGUuaXNDYWxjdWxhdGVkID0gdHJ1ZTtcblxuICAvLyAgICAgICAgIE1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdvcmllbnRhdGlvbicsIChvcmllbnRhdGlvbikgPT4ge1xuICAvLyAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlUm90YXRpb25SYXRlRnJvbU9yaWVudGF0aW9uKG9yaWVudGF0aW9uKTtcbiAgLy8gICAgICAgICB9KTtcbiAgLy8gICAgICAgfVxuXG4gIC8vICAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlKHRoaXMpO1xuICAvLyAgICAgfSk7XG4gIC8vIH1cblxuICBfcHJvY2VzcyhkYXRhKSB7XG4gICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uKGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIG9mIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEByZXR1cm4ge3Byb21pc2V9XG4gICAqL1xuICBpbml0KCkge1xuICAgIHJldHVybiBzdXBlci5pbml0KChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSA9IHJlc29sdmU7XG5cbiAgICAgIGlmICh3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQpIHtcbiAgICAgICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2s7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCB0aGlzLl9wcm9jZXNzKTtcbiAgICAgICAgLy8gc2V0IGZhbGxiYWNrIHRpbWVvdXQgZm9yIEZpcmVmb3ggKGl0cyB3aW5kb3cgbmV2ZXIgY2FsbGluZyB0aGUgRGV2aWNlT3JpZW50YXRpb24gZXZlbnQsIGEgXG4gICAgICAgIC8vIHJlcXVpcmUgb2YgdGhlIERldmljZU9yaWVudGF0aW9uIHNlcnZpY2Ugd2lsbCByZXN1bHQgaW4gdGhlIHJlcXVpcmUgcHJvbWlzZSBuZXZlciBiZWluZyByZXNvbHZlZFxuICAgICAgICAvLyBoZW5jZSB0aGUgRXhwZXJpbWVudCBzdGFydCgpIG1ldGhvZCBuZXZlciBjYWxsZWQpXG4gICAgICAgIHRoaXMuX2NoZWNrVGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiByZXNvbHZlKHRoaXMpLCA1MDApOyAgICAgICAgXG4gICAgICB9XG5cbiAgICAgIC8vIFdBUk5JTkdcbiAgICAgIC8vIFRoZSBsaW5lcyBvZiBjb2RlIGJlbG93IGFyZSBjb21tZW50ZWQgYmVjYXVzZSBvZiBhIGJ1ZyBvZiBDaHJvbWVcbiAgICAgIC8vIG9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzLCB3aGVyZSAnZGV2aWNlbW90aW9uJyBldmVudHMgYXJlIG5vdCBzZW50XG4gICAgICAvLyBvciBjYXVnaHQgaWYgdGhlIGxpc3RlbmVyIGlzIHNldCB1cCBhZnRlciBhICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAgIC8vIGxpc3RlbmVyLiBIZXJlLCB0aGUgX3RyeU9yaWVudGF0aW9uRmFsbGJhY2sgbWV0aG9kIHdvdWxkIGFkZCBhXG4gICAgICAvLyAnZGV2aWNlb3JpZW50YXRpb24nIGxpc3RlbmVyIGFuZCBibG9jayBhbGwgc3Vic2VxdWVudCAnZGV2aWNlbW90aW9uJ1xuICAgICAgLy8gZXZlbnRzIG9uIHRoZXNlIGRldmljZXMuIENvbW1lbnRzIHdpbGwgYmUgcmVtb3ZlZCBvbmNlIHRoZSBidWcgb2ZcbiAgICAgIC8vIENocm9tZSBpcyBjb3JyZWN0ZWQuXG5cbiAgICAgIC8vIGVsc2UgaWYgKHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlKVxuICAgICAgLy8gdGhpcy5fdHJ5T3JpZW50YXRpb25GYWxsYmFjaygpO1xuXG4gICAgICBlbHNlXG4gICAgICAgIHJlc29sdmUodGhpcyk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IERldmljZU1vdGlvbk1vZHVsZSgpO1xuIl19