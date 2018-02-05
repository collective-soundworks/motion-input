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
      this.interval = e.interval;

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

          // set fallback timeout for Firefox desktop (its window never calling the DeviceOrientation event, a
          // require of the DeviceOrientation service will result in the require promise never being resolved
          // hence the Experiment start() method never called)
          // > note 02/02/2018: this seems to create problems with ipods that
          // don't have enough time to start (sometimes), hence creating false
          // negative. So we only apply to Firefox desktop and put a really
          // large value (4sec) just in case.
          if (_platform2.default.name === 'Firefox' && _platform2.default.os.family !== 'Android' && _platform2.default.os.family !== 'iOS') {
            console.warn('[motion-input] register timer for Firefox desktop');
            _this2._checkTimeoutId = setTimeout(function () {
              return resolve(_this2);
            }, 4 * 1000);
          }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRldmljZU1vdGlvbk1vZHVsZS5qcyJdLCJuYW1lcyI6WyJnZXRMb2NhbFRpbWUiLCJ3aW5kb3ciLCJwZXJmb3JtYW5jZSIsIm5vdyIsIkRhdGUiLCJjaHJvbWVSZWdFeHAiLCJ0b0RlZyIsIk1hdGgiLCJQSSIsIkRldmljZU1vdGlvbk1vZHVsZSIsImV2ZW50IiwiYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSIsImFjY2VsZXJhdGlvbiIsInJvdGF0aW9uUmF0ZSIsInJlcXVpcmVkIiwiX3Byb21pc2VSZXNvbHZlIiwiX3VuaWZ5TW90aW9uRGF0YSIsIm9zIiwiZmFtaWx5IiwiX3VuaWZ5UGVyaW9kIiwiX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb24iLCJfY2FsY3VsYXRlZEFjY2VsZXJhdGlvblRpbWVDb25zdGFudCIsIl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSIsIl9jYWxjdWxhdGVkUm90YXRpb25SYXRlIiwiX2xhc3RPcmllbnRhdGlvbiIsIl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXAiLCJfcHJvY2Vzc0Z1bmN0aW9uIiwiX3Byb2Nlc3MiLCJiaW5kIiwiX2RldmljZW1vdGlvbkNoZWNrIiwiX2RldmljZW1vdGlvbkxpc3RlbmVyIiwiX2NoZWNrQ291bnRlciIsImUiLCJjbGVhclRpbWVvdXQiLCJfY2hlY2tUaW1lb3V0SWQiLCJpc1Byb3ZpZGVkIiwicGVyaW9kIiwiaW50ZXJ2YWwiLCJ4IiwieSIsInoiLCJhbHBoYSIsImJldGEiLCJnYW1tYSIsInRlc3QiLCJuYW1lIiwiaXNDYWxjdWxhdGVkIiwibGlzdGVuZXJzIiwic2l6ZSIsIl9lbWl0RGV2aWNlTW90aW9uRXZlbnQiLCJpc1ZhbGlkIiwiX2VtaXRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RXZlbnQiLCJfZW1pdEFjY2VsZXJhdGlvbkV2ZW50IiwiX2VtaXRSb3RhdGlvblJhdGVFdmVudCIsIm91dEV2ZW50IiwiZW1pdCIsImsiLCJfY2FsY3VsYXRlZEFjY2VsZXJhdGlvbkRlY2F5Iiwib3JpZW50YXRpb24iLCJhbHBoYUlzVmFsaWQiLCJyQWxwaGEiLCJyQmV0YSIsInJHYW1tYSIsImFscGhhRGlzY29udGludWl0eUZhY3RvciIsImJldGFEaXNjb250aW51aXR5RmFjdG9yIiwiZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yIiwiZGVsdGFUIiwiZGF0YSIsInJlc29sdmUiLCJEZXZpY2VNb3Rpb25FdmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb25zb2xlIiwid2FybiIsInNldFRpbWVvdXQiLCJleHAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7OztBQU1BLFNBQVNBLFlBQVQsR0FBd0I7QUFDdEIsTUFBSUMsT0FBT0MsV0FBWCxFQUNFLE9BQU9ELE9BQU9DLFdBQVAsQ0FBbUJDLEdBQW5CLEtBQTJCLElBQWxDO0FBQ0YsU0FBT0MsS0FBS0QsR0FBTCxLQUFhLElBQXBCO0FBQ0Q7O0FBRUQsSUFBTUUsZUFBZSxRQUFyQjtBQUNBLElBQU1DLFFBQVEsTUFBTUMsS0FBS0MsRUFBekI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUJNQyxrQjs7O0FBRUo7Ozs7O0FBS0EsZ0NBQWM7QUFBQTs7QUFHWjs7Ozs7OztBQUhZLHdJQUNOLGNBRE07O0FBVVosVUFBS0MsS0FBTCxHQUFhLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLElBQS9CLEVBQXFDLElBQXJDLEVBQTJDLElBQTNDLEVBQWlELElBQWpELENBQWI7O0FBRUE7Ozs7Ozs7QUFPQSxVQUFLQyw0QkFBTCxHQUFvQyx1Q0FBNEIsOEJBQTVCLENBQXBDOztBQUVBOzs7Ozs7Ozs7O0FBVUEsVUFBS0MsWUFBTCxHQUFvQix1Q0FBNEIsY0FBNUIsQ0FBcEI7O0FBRUE7Ozs7Ozs7Ozs7QUFVQSxVQUFLQyxZQUFMLEdBQW9CLHVDQUE0QixjQUE1QixDQUFwQjs7QUFF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c0J5QyxJQUF0QjtBQUNEOztBQUVEOzs7Ozs7OzsyQkFLTztBQUFBOztBQUNMLDBJQUFrQixVQUFDQyxPQUFELEVBQWE7QUFDN0IsZUFBS3JELGVBQUwsR0FBdUJxRCxPQUF2Qjs7QUFFQSxZQUFJbkUsT0FBT29FLGlCQUFYLEVBQThCO0FBQzVCLGlCQUFLM0MsZ0JBQUwsR0FBd0IsT0FBS0csa0JBQTdCO0FBQ0E1QixpQkFBT3FFLGdCQUFQLENBQXdCLGNBQXhCLEVBQXdDLE9BQUszQyxRQUE3Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQUksbUJBQVNrQixJQUFULEtBQWtCLFNBQWxCLElBQ0YsbUJBQVM1QixFQUFULENBQVlDLE1BQVosS0FBdUIsU0FEckIsSUFFRixtQkFBU0QsRUFBVCxDQUFZQyxNQUFaLEtBQXVCLEtBRnpCLEVBR0U7QUFDQXFELG9CQUFRQyxJQUFSLENBQWEsbURBQWI7QUFDQSxtQkFBS3RDLGVBQUwsR0FBdUJ1QyxXQUFXO0FBQUEscUJBQU1MLGVBQU47QUFBQSxhQUFYLEVBQWdDLElBQUksSUFBcEMsQ0FBdkI7QUFDRDtBQUNGOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUE5QkEsYUFpQ0VBO0FBQ0gsT0FyQ0Q7QUFzQ0Q7Ozt3QkF2WmtDO0FBQ2pDLGFBQU83RCxLQUFLbUUsR0FBTCxDQUFTLENBQUMsQ0FBRCxHQUFLbkUsS0FBS0MsRUFBVixHQUFlLEtBQUtHLDRCQUFMLENBQWtDeUIsTUFBakQsR0FBMEQsS0FBS2YsbUNBQXhFLENBQVA7QUFDRDs7Ozs7O2tCQXdaWSxJQUFJWixrQkFBSixFIiwiZmlsZSI6IkRldmljZU1vdGlvbk1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJbnB1dE1vZHVsZSBmcm9tICcuL0lucHV0TW9kdWxlJztcbmltcG9ydCBET01FdmVudFN1Ym1vZHVsZSBmcm9tICcuL0RPTUV2ZW50U3VibW9kdWxlJztcbmltcG9ydCBNb3Rpb25JbnB1dCBmcm9tICcuL01vdGlvbklucHV0JztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICdwbGF0Zm9ybSc7XG5cbi8qKlxuICogR2V0cyB0aGUgY3VycmVudCBsb2NhbCB0aW1lIGluIHNlY29uZHMuXG4gKiBVc2VzIGB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClgIGlmIGF2YWlsYWJsZSwgYW5kIGBEYXRlLm5vdygpYCBvdGhlcndpc2UuXG4gKlxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBnZXRMb2NhbFRpbWUoKSB7XG4gIGlmICh3aW5kb3cucGVyZm9ybWFuY2UpXG4gICAgcmV0dXJuIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAvIDEwMDA7XG4gIHJldHVybiBEYXRlLm5vdygpIC8gMTAwMDtcbn1cblxuY29uc3QgY2hyb21lUmVnRXhwID0gL0Nocm9tZS87XG5jb25zdCB0b0RlZyA9IDE4MCAvIE1hdGguUEk7XG5cbi8qKlxuICogYERldmljZU1vdGlvbmAgbW9kdWxlIHNpbmdsZXRvbi5cbiAqIFRoZSBgRGV2aWNlTW90aW9uTW9kdWxlYCBzaW5nbGV0b24gcHJvdmlkZXMgdGhlIHJhdyB2YWx1ZXNcbiAqIG9mIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHksIGFjY2VsZXJhdGlvbiwgYW5kIHJvdGF0aW9uXG4gKiByYXRlIHByb3ZpZGVkIGJ5IHRoZSBgRGV2aWNlTW90aW9uYCBldmVudC5cbiAqIEl0IGFsc28gaW5zdGFudGlhdGUgdGhlIGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCxcbiAqIGBBY2NlbGVyYXRpb25gIGFuZCBgUm90YXRpb25SYXRlYCBzdWJtb2R1bGVzIHRoYXQgdW5pZnkgdGhvc2UgdmFsdWVzXG4gKiBhY3Jvc3MgcGxhdGZvcm1zIGJ5IG1ha2luZyB0aGVtIGNvbXBsaWFudCB3aXRoIHtAbGlua1xuICogaHR0cDovL3d3dy53My5vcmcvVFIvb3JpZW50YXRpb24tZXZlbnQvfHRoZSBXM0Mgc3RhbmRhcmR9LlxuICogV2hlbiByYXcgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgdGhlIHNlbnNvcnMsIHRoaXMgbW9kdWxlcyB0cmllc1xuICogdG8gcmVjYWxjdWxhdGUgdGhlbSBmcm9tIGF2YWlsYWJsZSB2YWx1ZXM6XG4gKiAtIGBhY2NlbGVyYXRpb25gIGlzIGNhbGN1bGF0ZWQgZnJvbSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWBcbiAqICAgd2l0aCBhIGhpZ2gtcGFzcyBmaWx0ZXI7XG4gKiAtIChjb21pbmcgc29vbiDigJQgd2FpdGluZyBmb3IgYSBidWcgb24gQ2hyb21lIHRvIGJlIHJlc29sdmVkKVxuICogICBgcm90YXRpb25SYXRlYCBpcyBjYWxjdWxhdGVkIGZyb20gYG9yaWVudGF0aW9uYC5cbiAqXG4gKiBAY2xhc3MgRGV2aWNlTW90aW9uTW9kdWxlXG4gKiBAZXh0ZW5kcyBJbnB1dE1vZHVsZVxuICovXG5jbGFzcyBEZXZpY2VNb3Rpb25Nb2R1bGUgZXh0ZW5kcyBJbnB1dE1vZHVsZSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGBEZXZpY2VNb3Rpb25gIG1vZHVsZSBpbnN0YW5jZS5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignZGV2aWNlbW90aW9uJyk7XG5cbiAgICAvKipcbiAgICAgKiBSYXcgdmFsdWVzIGNvbWluZyBmcm9tIHRoZSBgZGV2aWNlbW90aW9uYCBldmVudCBzZW50IGJ5IHRoaXMgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFtudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsXVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnQgPSBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIG1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyB1bmlmaWVkIHZhbHVlcyBvZiB0aGUgYWNjZWxlcmF0aW9uIGluY2x1ZGluZyBncmF2aXR5LlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBBY2NlbGVyYXRpb25gIHN1Ym1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyB1bmlmaWVkIHZhbHVlcyBvZiB0aGUgYWNjZWxlcmF0aW9uLlxuICAgICAqIEVzdGltYXRlcyB0aGUgYWNjZWxlcmF0aW9uIHZhbHVlcyBmcm9tIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YFxuICAgICAqIHJhdyB2YWx1ZXMgaWYgdGhlIGFjY2VsZXJhdGlvbiByYXcgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlIG9uIHRoZVxuICAgICAqIGRldmljZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKi9cbiAgICB0aGlzLmFjY2VsZXJhdGlvbiA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAnYWNjZWxlcmF0aW9uJyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYFJvdGF0aW9uUmF0ZWAgc3VibW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIHVuaWZpZWQgdmFsdWVzIG9mIHRoZSByb3RhdGlvbiByYXRlLlxuICAgICAqIChjb21pbmcgc29vbiwgd2FpdGluZyBmb3IgYSBidWcgb24gQ2hyb21lIHRvIGJlIHJlc29sdmVkKVxuICAgICAqIEVzdGltYXRlcyB0aGUgcm90YXRpb24gcmF0ZSB2YWx1ZXMgZnJvbSBgb3JpZW50YXRpb25gIHZhbHVlcyBpZlxuICAgICAqIHRoZSByb3RhdGlvbiByYXRlIHJhdyB2YWx1ZXMgYXJlIG5vdCBhdmFpbGFibGUgb24gdGhlIGRldmljZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKi9cbiAgICB0aGlzLnJvdGF0aW9uUmF0ZSA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAncm90YXRpb25SYXRlJyk7XG5cbiAgICAvKipcbiAgICAgKiBSZXF1aXJlZCBzdWJtb2R1bGVzIC8gZXZlbnRzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gYWNjZWxlcmF0aW9uIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGBhY2NlbGVyYXRpb25gIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gcm90YXRpb25SYXRlIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGByb3RhdGlvblJhdGVgIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqL1xuICAgIHRoaXMucmVxdWlyZWQgPSB7XG4gICAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5OiBmYWxzZSxcbiAgICAgIGFjY2VsZXJhdGlvbjogZmFsc2UsXG4gICAgICByb3RhdGlvblJhdGU6IGZhbHNlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlc29sdmUgZnVuY3Rpb24gb2YgdGhlIG1vZHVsZSdzIHByb21pc2UuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqIEBzZWUgRGV2aWNlTW90aW9uTW9kdWxlI2luaXRcbiAgICAgKi9cbiAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBVbmlmeWluZyBmYWN0b3Igb2YgdGhlIG1vdGlvbiBkYXRhIHZhbHVlcyAoYDFgIG9uIEFuZHJvaWQsIGAtMWAgb24gaU9TKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5fdW5pZnlNb3Rpb25EYXRhID0gKHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycpID8gLTEgOiAxO1xuXG4gICAgLyoqXG4gICAgICogVW5pZnlpbmcgZmFjdG9yIG9mIHRoZSBwZXJpb2QgKGAxYCBvbiBBbmRyb2lkLCBgMWAgb24gaU9TKS4gaW4gc2VjXG4gICAgICogQHRvZG8gLSB1bmlmeSB3aXRoIGUuaW50ZXJ2YWwgc3BlY2lmaWNhdGlvbiAoaW4gbXMpID9cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5fdW5pZnlQZXJpb2QgPSAocGxhdGZvcm0ub3MuZmFtaWx5ID09PSAnQW5kcm9pZCcpID8gMC4wMDEgOiAxO1xuXG4gICAgLyoqXG4gICAgICogQWNjZWxlcmF0aW9uIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHJhdyB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvbiA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIFRpbWUgY29uc3RhbnQgKGhhbGYtbGlmZSkgb2YgdGhlIGhpZ2gtcGFzcyBmaWx0ZXIgdXNlZCB0byBzbW9vdGggdGhlIGFjY2VsZXJhdGlvbiB2YWx1ZXMgY2FsY3VsYXRlZCBmcm9tIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHkgcmF3IHZhbHVlcyAoaW4gc2Vjb25kcykuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDAuMVxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25UaW1lQ29uc3RhbnQgPSAwLjE7XG5cbiAgICAvKipcbiAgICAgKiBMYXRlc3QgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHJhdyB2YWx1ZSwgdXNlZCBpbiB0aGUgaGlnaC1wYXNzIGZpbHRlciB0byBjYWxjdWxhdGUgdGhlIGFjY2VsZXJhdGlvbiAoaWYgdGhlIGBhY2NlbGVyYXRpb25gIHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IGAnZGV2aWNlbW90aW9uJ2ApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogUm90YXRpb24gcmF0ZSBjYWxjdWxhdGVkIGZyb20gdGhlIG9yaWVudGF0aW9uIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IG9yaWVudGF0aW9uIHZhbHVlLCB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgcm90YXRpb24gcmF0ZSAgKGlmIHRoZSBgcm90YXRpb25SYXRlYCB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSBgJ2RldmljZW1vdGlvbidgKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb24gPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBMYXRlc3Qgb3JpZW50YXRpb24gdGltZXN0YW1wcywgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHJvdGF0aW9uIHJhdGUgKGlmIHRoZSBgcm90YXRpb25SYXRlYCB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSBgJ2RldmljZW1vdGlvbidgKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXAgPSBudWxsO1xuXG4gICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uID0gbnVsbDtcbiAgICB0aGlzLl9wcm9jZXNzID0gdGhpcy5fcHJvY2Vzcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2RldmljZW1vdGlvbkNoZWNrID0gdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLl9kZXZpY2Vtb3Rpb25MaXN0ZW5lciA9IHRoaXMuX2RldmljZW1vdGlvbkxpc3RlbmVyLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9jaGVja0NvdW50ZXIgPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIERlY2F5IGZhY3RvciBvZiB0aGUgaGlnaC1wYXNzIGZpbHRlciB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgYWNjZWxlcmF0aW9uIGZyb20gdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWVzLlxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBfY2FsY3VsYXRlZEFjY2VsZXJhdGlvbkRlY2F5KCkge1xuICAgIHJldHVybiBNYXRoLmV4cCgtMiAqIE1hdGguUEkgKiB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkucGVyaW9kIC8gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblRpbWVDb25zdGFudCk7XG4gIH1cblxuICAvKipcbiAgICogU2Vuc29yIGNoZWNrIG9uIGluaXRpYWxpemF0aW9uIG9mIHRoZSBtb2R1bGUuXG4gICAqIFRoaXMgbWV0aG9kOlxuICAgKiAtIGNoZWNrcyB3aGV0aGVyIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIHRoZSBgYWNjZWxlcmF0aW9uYCxcbiAgICogICBhbmQgdGhlIGByb3RhdGlvblJhdGVgIHZhbHVlcyBhcmUgdmFsaWQgb3Igbm90O1xuICAgKiAtIGdldHMgdGhlIHBlcmlvZCBvZiB0aGUgYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBhbmQgc2V0cyB0aGUgcGVyaW9kIG9mXG4gICAqICAgdGhlIGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCwgYEFjY2VsZXJhdGlvbmAsIGFuZCBgUm90YXRpb25SYXRlYFxuICAgKiAgIHN1Ym1vZHVsZXM7XG4gICAqIC0gKGluIHRoZSBjYXNlIHdoZXJlIGFjY2VsZXJhdGlvbiByYXcgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQpXG4gICAqICAgaW5kaWNhdGVzIHdoZXRoZXIgdGhlIGFjY2VsZXJhdGlvbiBjYW4gYmUgY2FsY3VsYXRlZCBmcm9tIHRoZVxuICAgKiAgIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcyBvciBub3QuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBUaGUgZmlyc3QgYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBjYXVnaHQuXG4gICAqL1xuICBfZGV2aWNlbW90aW9uQ2hlY2soZSkge1xuICAgIC8vIGNsZWFyIHRpbWVvdXQgKGFudGktRmlyZWZveCBidWcgc29sdXRpb24sIHdpbmRvdyBldmVudCBkZXZpY2VvcmllbnRhdGlvbiBiZWluZyBudmVyIGNhbGxlZClcbiAgICAvLyBzZXQgdGhlIHNldCB0aW1lb3V0IGluIGluaXQoKSBmdW5jdGlvblxuICAgIGNsZWFyVGltZW91dCh0aGlzLl9jaGVja1RpbWVvdXRJZCk7XG5cbiAgICB0aGlzLmlzUHJvdmlkZWQgPSB0cnVlO1xuICAgIHRoaXMucGVyaW9kID0gZS5pbnRlcnZhbCAvIDEwMDA7XG4gICAgdGhpcy5pbnRlcnZhbCA9IGUuaW50ZXJ2YWw7XG5cbiAgICAvLyBTZW5zb3IgYXZhaWxhYmlsaXR5IGZvciB0aGUgYWNjZWxlcmF0aW9uIGluY2x1ZGluZyBncmF2aXR5XG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzUHJvdmlkZWQgPSAoXG4gICAgICBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnggPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueSA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56ID09PSAnbnVtYmVyJylcbiAgICApO1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5wZXJpb2QgPSBlLmludGVydmFsICogdGhpcy5fdW5pZnlQZXJpb2Q7XG5cbiAgICAvLyBTZW5zb3IgYXZhaWxhYmlsaXR5IGZvciB0aGUgYWNjZWxlcmF0aW9uXG4gICAgdGhpcy5hY2NlbGVyYXRpb24uaXNQcm92aWRlZCA9IChcbiAgICAgIGUuYWNjZWxlcmF0aW9uICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uLnggPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbi55ID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb24ueiA9PT0gJ251bWJlcicpXG4gICAgKTtcbiAgICB0aGlzLmFjY2VsZXJhdGlvbi5wZXJpb2QgPSBlLmludGVydmFsICogdGhpcy5fdW5pZnlQZXJpb2Q7XG5cbiAgICAvLyBTZW5zb3IgYXZhaWxhYmlsaXR5IGZvciB0aGUgcm90YXRpb24gcmF0ZVxuICAgIHRoaXMucm90YXRpb25SYXRlLmlzUHJvdmlkZWQgPSAoXG4gICAgICBlLnJvdGF0aW9uUmF0ZSAmJlxuICAgICAgKHR5cGVvZiBlLnJvdGF0aW9uUmF0ZS5hbHBoYSA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUucm90YXRpb25SYXRlLmJldGEgID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5yb3RhdGlvblJhdGUuZ2FtbWEgPT09ICdudW1iZXInKVxuICAgICk7XG4gICAgdGhpcy5yb3RhdGlvblJhdGUucGVyaW9kID0gZS5pbnRlcnZhbCAqIHRoaXMuX3VuaWZ5UGVyaW9kO1xuXG4gICAgLy8gaW4gZmlyZWZveCBhbmRyb2lkLCBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IHJldHJpZXZlIG51bGwgdmFsdWVzXG4gICAgLy8gb24gdGhlIGZpcnN0IGNhbGxiYWNrLiBzbyB3YWl0IGEgc2Vjb25kIGNhbGwgdG8gYmUgc3VyZS5cbiAgICBpZiAoXG4gICAgICBwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdBbmRyb2lkJyAmJlxuICAgICAgL0ZpcmVmb3gvLnRlc3QocGxhdGZvcm0ubmFtZSkgJiZcbiAgICAgIHRoaXMuX2NoZWNrQ291bnRlciA8IDFcbiAgICApIHtcbiAgICAgIHRoaXMuX2NoZWNrQ291bnRlcisrO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBub3cgdGhhdCB0aGUgc2Vuc29ycyBhcmUgY2hlY2tlZCwgcmVwbGFjZSB0aGUgcHJvY2VzcyBmdW5jdGlvbiB3aXRoXG4gICAgICAvLyB0aGUgZmluYWwgbGlzdGVuZXJcbiAgICAgIHRoaXMuX3Byb2Nlc3NGdW5jdGlvbiA9IHRoaXMuX2RldmljZW1vdGlvbkxpc3RlbmVyO1xuXG4gICAgICAvLyBpZiBhY2NlbGVyYXRpb24gaXMgbm90IHByb3ZpZGVkIGJ5IHJhdyBzZW5zb3JzLCBpbmRpY2F0ZSB3aGV0aGVyIGl0XG4gICAgICAvLyBjYW4gYmUgY2FsY3VsYXRlZCB3aXRoIGBhY2NlbGVyYXRpb25pbmNsdWRpbmdncmF2aXR5YCBvciBub3RcbiAgICAgIGlmICghdGhpcy5hY2NlbGVyYXRpb24uaXNQcm92aWRlZClcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24uaXNDYWxjdWxhdGVkID0gdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzUHJvdmlkZWQ7XG5cbiAgICAgIC8vIFdBUk5JTkdcbiAgICAgIC8vIFRoZSBsaW5lcyBvZiBjb2RlIGJlbG93IGFyZSBjb21tZW50ZWQgYmVjYXVzZSBvZiBhIGJ1ZyBvZiBDaHJvbWVcbiAgICAgIC8vIG9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzLCB3aGVyZSAnZGV2aWNlbW90aW9uJyBldmVudHMgYXJlIG5vdCBzZW50XG4gICAgICAvLyBvciBjYXVnaHQgaWYgdGhlIGxpc3RlbmVyIGlzIHNldCB1cCBhZnRlciBhICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAgIC8vIGxpc3RlbmVyLiBIZXJlLCB0aGUgX3RyeU9yaWVudGF0aW9uRmFsbGJhY2sgbWV0aG9kIHdvdWxkIGFkZCBhXG4gICAgICAvLyAnZGV2aWNlb3JpZW50YXRpb24nIGxpc3RlbmVyIGFuZCBibG9jayBhbGwgc3Vic2VxdWVudCAnZGV2aWNlbW90aW9uJ1xuICAgICAgLy8gZXZlbnRzIG9uIHRoZXNlIGRldmljZXMuIENvbW1lbnRzIHdpbGwgYmUgcmVtb3ZlZCBvbmNlIHRoZSBidWcgb2ZcbiAgICAgIC8vIENocm9tZSBpcyBjb3JyZWN0ZWQuXG5cbiAgICAgIC8vIGlmICh0aGlzLnJlcXVpcmVkLnJvdGF0aW9uUmF0ZSAmJiAhdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZClcbiAgICAgIC8vICAgdGhpcy5fdHJ5T3JpZW50YXRpb25GYWxsYmFjaygpO1xuICAgICAgLy8gZWxzZVxuICAgICAgdGhpcy5fcHJvbWlzZVJlc29sdmUodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgY2FsbGJhY2suXG4gICAqIFRoaXMgbWV0aG9kIGVtaXRzIGFuIGV2ZW50IHdpdGggdGhlIHJhdyBgJ2RldmljZW1vdGlvbidgIHZhbHVlcywgYW5kIGVtaXRzXG4gICAqIGV2ZW50cyB3aXRoIHRoZSB1bmlmaWVkIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCwgYGFjY2VsZXJhdGlvbmAsXG4gICAqIGFuZCAvIG9yIGByb3RhdGlvblJhdGVgIHZhbHVlcyBpZiB0aGV5IGFyZSByZXF1aXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2RldmljZW1vdGlvbkxpc3RlbmVyKGUpIHtcbiAgICAvLyAnZGV2aWNlbW90aW9uJyBldmVudCAocmF3IHZhbHVlcylcbiAgICBpZiAodGhpcy5saXN0ZW5lcnMuc2l6ZSA+IDApXG4gICAgICB0aGlzLl9lbWl0RGV2aWNlTW90aW9uRXZlbnQoZSk7XG5cbiAgICAvLyBhbGVydChgJHt0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkubGlzdGVuZXJzLnNpemV9IC1cbiAgICAvLyAgICAgJHt0aGlzLnJlcXVpcmVkLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHl9IC1cbiAgICAvLyAgICAgJHt0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZH1cbiAgICAvLyBgKTtcblxuICAgIC8vICdhY2NlbGVyYXRpb24nIGV2ZW50ICh1bmlmaWVkIHZhbHVlcylcbiAgICBpZiAodGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lmxpc3RlbmVycy5zaXplID4gMCAmJlxuICAgICAgICB0aGlzLnJlcXVpcmVkLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgJiZcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzVmFsaWRcbiAgICApIHtcbiAgICAgIHRoaXMuX2VtaXRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RXZlbnQoZSk7XG4gICAgfVxuXG4gICAgLy8gJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknIGV2ZW50ICh1bmlmaWVkIHZhbHVlcylcbiAgICAvLyB0aGUgZmFsbGJhY2sgY2FsY3VsYXRpb24gb2YgdGhlIGFjY2VsZXJhdGlvbiBoYXBwZW5zIGluIHRoZVxuICAgIC8vICBgX2VtaXRBY2NlbGVyYXRpb25gIG1ldGhvZCwgc28gd2UgY2hlY2sgaWYgdGhpcy5hY2NlbGVyYXRpb24uaXNWYWxpZFxuICAgIGlmICh0aGlzLmFjY2VsZXJhdGlvbi5saXN0ZW5lcnMuc2l6ZSA+IDAgJiZcbiAgICAgICAgdGhpcy5yZXF1aXJlZC5hY2NlbGVyYXRpb24gJiZcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24uaXNWYWxpZFxuICAgICkge1xuICAgICAgdGhpcy5fZW1pdEFjY2VsZXJhdGlvbkV2ZW50KGUpO1xuICAgIH1cblxuICAgIC8vICdyb3RhdGlvblJhdGUnIGV2ZW50ICh1bmlmaWVkIHZhbHVlcylcbiAgICAvLyB0aGUgZmFsbGJhY2sgY2FsY3VsYXRpb24gb2YgdGhlIHJvdGF0aW9uIHJhdGUgZG9lcyBOT1QgaGFwcGVuIGluIHRoZVxuICAgIC8vIGBfZW1pdFJvdGF0aW9uUmF0ZWAgbWV0aG9kLCBzbyB3ZSBvbmx5IGNoZWNrIGlmIHRoaXMucm90YXRpb25SYXRlLmlzUHJvdmlkZWRcbiAgICBpZiAodGhpcy5yb3RhdGlvblJhdGUubGlzdGVuZXJzLnNpemUgPiAwICYmXG4gICAgICAgIHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlICYmXG4gICAgICAgIHRoaXMucm90YXRpb25SYXRlLmlzUHJvdmlkZWRcbiAgICApIHtcbiAgICAgIHRoaXMuX2VtaXRSb3RhdGlvblJhdGVFdmVudChlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIGAnZGV2aWNlbW90aW9uJ2AgcmF3IHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2VtaXREZXZpY2VNb3Rpb25FdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5ldmVudDtcblxuICAgIGlmIChlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpIHtcbiAgICAgIG91dEV2ZW50WzBdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lng7XG4gICAgICBvdXRFdmVudFsxXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55O1xuICAgICAgb3V0RXZlbnRbMl0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuejtcbiAgICB9XG5cbiAgICBpZiAoZS5hY2NlbGVyYXRpb24pIHtcbiAgICAgIG91dEV2ZW50WzNdID0gZS5hY2NlbGVyYXRpb24ueDtcbiAgICAgIG91dEV2ZW50WzRdID0gZS5hY2NlbGVyYXRpb24ueTtcbiAgICAgIG91dEV2ZW50WzVdID0gZS5hY2NlbGVyYXRpb24uejtcbiAgICB9XG5cbiAgICBpZiAoZS5yb3RhdGlvblJhdGUpIHtcbiAgICAgIG91dEV2ZW50WzZdID0gZS5yb3RhdGlvblJhdGUuYWxwaGE7XG4gICAgICBvdXRFdmVudFs3XSA9IGUucm90YXRpb25SYXRlLmJldGE7XG4gICAgICBvdXRFdmVudFs4XSA9IGUucm90YXRpb25SYXRlLmdhbW1hO1xuICAgIH1cblxuICAgIHRoaXMuZW1pdChvdXRFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2VtaXRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RXZlbnQoZSkge1xuICAgIGxldCBvdXRFdmVudCA9IHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5ldmVudDtcblxuICAgIG91dEV2ZW50WzBdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnggKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgb3V0RXZlbnRbMV0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueSAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICBvdXRFdmVudFsyXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuXG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmVtaXQob3V0RXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBgYWNjZWxlcmF0aW9uYCB1bmlmaWVkIHZhbHVlcy5cbiAgICogV2hlbiB0aGUgYGFjY2VsZXJhdGlvbmAgcmF3IHZhbHVlcyBhcmUgbm90IGF2YWlsYWJsZSwgdGhlIG1ldGhvZFxuICAgKiBhbHNvIGNhbGN1bGF0ZXMgdGhlIGFjY2VsZXJhdGlvbiBmcm9tIHRoZVxuICAgKiBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIFRoZSBgJ2RldmljZW1vdGlvbidgIGV2ZW50LlxuICAgKi9cbiAgX2VtaXRBY2NlbGVyYXRpb25FdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5hY2NlbGVyYXRpb24uZXZlbnQ7XG5cbiAgICBpZiAodGhpcy5hY2NlbGVyYXRpb24uaXNQcm92aWRlZCkge1xuICAgICAgLy8gSWYgcmF3IGFjY2VsZXJhdGlvbiB2YWx1ZXMgYXJlIHByb3ZpZGVkXG4gICAgICBvdXRFdmVudFswXSA9IGUuYWNjZWxlcmF0aW9uLnggKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgICBvdXRFdmVudFsxXSA9IGUuYWNjZWxlcmF0aW9uLnkgKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGUuYWNjZWxlcmF0aW9uLnogKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgfSBlbHNlIGlmICh0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZCkge1xuICAgICAgLy8gT3RoZXJ3aXNlLCBpZiBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IHZhbHVlcyBhcmUgcHJvdmlkZWQsXG4gICAgICAvLyBlc3RpbWF0ZSB0aGUgYWNjZWxlcmF0aW9uIHdpdGggYSBoaWdoLXBhc3MgZmlsdGVyXG4gICAgICBjb25zdCBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ID0gW1xuICAgICAgICBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YSxcbiAgICAgICAgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnkgKiB0aGlzLl91bmlmeU1vdGlvbkRhdGEsXG4gICAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhXG4gICAgICBdO1xuICAgICAgY29uc3QgayA9IHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25EZWNheTtcblxuICAgICAgLy8gSGlnaC1wYXNzIGZpbHRlciB0byBlc3RpbWF0ZSB0aGUgYWNjZWxlcmF0aW9uICh3aXRob3V0IHRoZSBncmF2aXR5KVxuICAgICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblswXSA9ICgxICsgaykgKiAwLjUgKiAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXSAtIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdKSArIGsgKiB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzBdO1xuICAgICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsxXSA9ICgxICsgaykgKiAwLjUgKiAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXSAtIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdKSArIGsgKiB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzFdO1xuICAgICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsyXSA9ICgxICsgaykgKiAwLjUgKiAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXSAtIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdKSArIGsgKiB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzJdO1xuXG4gICAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXSA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF07XG4gICAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXSA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV07XG4gICAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXSA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl07XG5cbiAgICAgIG91dEV2ZW50WzBdID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblswXTtcbiAgICAgIG91dEV2ZW50WzFdID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsxXTtcbiAgICAgIG91dEV2ZW50WzJdID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsyXTtcbiAgICB9XG5cbiAgICB0aGlzLmFjY2VsZXJhdGlvbi5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYHJvdGF0aW9uUmF0ZWAgdW5pZmllZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICovXG4gIF9lbWl0Um90YXRpb25SYXRlRXZlbnQoZSkge1xuICAgIGxldCBvdXRFdmVudCA9IHRoaXMucm90YXRpb25SYXRlLmV2ZW50O1xuXG4gICAgLy8gSW4gYWxsIHBsYXRmb3Jtcywgcm90YXRpb24gYXhlcyBhcmUgbWVzc2VkIHVwIGFjY29yZGluZyB0byB0aGUgc3BlY1xuICAgIC8vIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9kZXZpY2VvcmllbnRhdGlvbi9zcGVjLXNvdXJjZS1vcmllbnRhdGlvbi5odG1sXG4gICAgLy9cbiAgICAvLyBnYW1tYSBzaG91bGQgYmUgYWxwaGFcbiAgICAvLyBhbHBoYSBzaG91bGQgYmUgYmV0YVxuICAgIC8vIGJldGEgc2hvdWxkIGJlIGdhbW1hXG5cbiAgICBvdXRFdmVudFswXSA9IGUucm90YXRpb25SYXRlLmdhbW1hO1xuICAgIG91dEV2ZW50WzFdID0gZS5yb3RhdGlvblJhdGUuYWxwaGEsXG4gICAgb3V0RXZlbnRbMl0gPSBlLnJvdGF0aW9uUmF0ZS5iZXRhO1xuXG4gICAgLy8gQ2hyb21lIEFuZHJvaWQgcmV0cmlldmUgdmFsdWVzIHRoYXQgYXJlIGluIHJhZC9zXG4gICAgLy8gY2YuIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTU0MTYwN1xuICAgIC8vXG4gICAgLy8gRnJvbSBzcGVjOiBcIlRoZSByb3RhdGlvblJhdGUgYXR0cmlidXRlIG11c3QgYmUgaW5pdGlhbGl6ZWQgd2l0aCB0aGUgcmF0ZVxuICAgIC8vIG9mIHJvdGF0aW9uIG9mIHRoZSBob3N0aW5nIGRldmljZSBpbiBzcGFjZS4gSXQgbXVzdCBiZSBleHByZXNzZWQgYXMgdGhlXG4gICAgLy8gcmF0ZSBvZiBjaGFuZ2Ugb2YgdGhlIGFuZ2xlcyBkZWZpbmVkIGluIHNlY3Rpb24gNC4xIGFuZCBtdXN0IGJlIGV4cHJlc3NlZFxuICAgIC8vIGluIGRlZ3JlZXMgcGVyIHNlY29uZCAoZGVnL3MpLlwiXG4gICAgaWYgKHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ0FuZHJvaWQnICYmIGNocm9tZVJlZ0V4cC50ZXN0KHBsYXRmb3JtLm5hbWUpKSB7XG4gICAgICBvdXRFdmVudFswXSAqPSB0b0RlZztcbiAgICAgIG91dEV2ZW50WzFdICo9IHRvRGVnLFxuICAgICAgb3V0RXZlbnRbMl0gKj0gdG9EZWc7XG4gICAgfVxuXG4gICAgdGhpcy5yb3RhdGlvblJhdGUuZW1pdChvdXRFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBhbmQgZW1pdHMgdGhlIGByb3RhdGlvblJhdGVgIHVuaWZpZWQgdmFsdWVzIGZyb20gdGhlIGBvcmllbnRhdGlvbmAgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcltdfSBvcmllbnRhdGlvbiAtIExhdGVzdCBgb3JpZW50YXRpb25gIHJhdyB2YWx1ZXMuXG4gICAqL1xuICBfY2FsY3VsYXRlUm90YXRpb25SYXRlRnJvbU9yaWVudGF0aW9uKG9yaWVudGF0aW9uKSB7XG4gICAgY29uc3Qgbm93ID0gZ2V0TG9jYWxUaW1lKCk7XG4gICAgY29uc3QgayA9IDAuODsgLy8gVE9ETzogaW1wcm92ZSBsb3cgcGFzcyBmaWx0ZXIgKGZyYW1lcyBhcmUgbm90IHJlZ3VsYXIpXG4gICAgY29uc3QgYWxwaGFJc1ZhbGlkID0gKHR5cGVvZiBvcmllbnRhdGlvblswXSA9PT0gJ251bWJlcicpO1xuXG4gICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblRpbWVzdGFtcCkge1xuICAgICAgbGV0IHJBbHBoYSA9IG51bGw7XG4gICAgICBsZXQgckJldGE7XG4gICAgICBsZXQgckdhbW1hO1xuXG4gICAgICBsZXQgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yID0gMDtcbiAgICAgIGxldCBiZXRhRGlzY29udGludWl0eUZhY3RvciA9IDA7XG4gICAgICBsZXQgZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yID0gMDtcblxuICAgICAgY29uc3QgZGVsdGFUID0gbm93IC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wO1xuXG4gICAgICBpZiAoYWxwaGFJc1ZhbGlkKSB7XG4gICAgICAgIC8vIGFscGhhIGRpc2NvbnRpbnVpdHkgKCszNjAgLT4gMCBvciAwIC0+ICszNjApXG4gICAgICAgIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMF0gPiAzMjAgJiYgb3JpZW50YXRpb25bMF0gPCA0MClcbiAgICAgICAgICBhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAzNjA7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSA8IDQwICYmIG9yaWVudGF0aW9uWzBdID4gMzIwKVxuICAgICAgICAgIGFscGhhRGlzY29udGludWl0eUZhY3RvciA9IC0zNjA7XG4gICAgICB9XG5cbiAgICAgIC8vIGJldGEgZGlzY29udGludWl0eSAoKzE4MCAtPiAtMTgwIG9yIC0xODAgLT4gKzE4MClcbiAgICAgIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMV0gPiAxNDAgJiYgb3JpZW50YXRpb25bMV0gPCAtMTQwKVxuICAgICAgICBiZXRhRGlzY29udGludWl0eUZhY3RvciA9IDM2MDtcbiAgICAgIGVsc2UgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSA8IC0xNDAgJiYgb3JpZW50YXRpb25bMV0gPiAxNDApXG4gICAgICAgIGJldGFEaXNjb250aW51aXR5RmFjdG9yID0gLTM2MDtcblxuICAgICAgLy8gZ2FtbWEgZGlzY29udGludWl0aWVzICgrMTgwIC0+IC0xODAgb3IgLTE4MCAtPiArMTgwKVxuICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSA+IDUwICYmIG9yaWVudGF0aW9uWzJdIDwgLTUwKVxuICAgICAgICBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAxODA7XG4gICAgICBlbHNlIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMl0gPCAtNTAgJiYgb3JpZW50YXRpb25bMl0gPiA1MClcbiAgICAgICAgZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yID0gLTE4MDtcblxuICAgICAgaWYgKGRlbHRhVCA+IDApIHtcbiAgICAgICAgLy8gTG93IHBhc3MgZmlsdGVyIHRvIHNtb290aCB0aGUgZGF0YVxuICAgICAgICBpZiAoYWxwaGFJc1ZhbGlkKVxuICAgICAgICAgIHJBbHBoYSA9IGsgKiB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzBdICsgKDEgLSBrKSAqIChvcmllbnRhdGlvblswXSAtIHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSArIGFscGhhRGlzY29udGludWl0eUZhY3RvcikgLyBkZWx0YVQ7XG5cbiAgICAgICAgckJldGEgPSBrICogdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVsxXSArICgxIC0gaykgKiAob3JpZW50YXRpb25bMV0gLSB0aGlzLl9sYXN0T3JpZW50YXRpb25bMV0gKyBiZXRhRGlzY29udGludWl0eUZhY3RvcikgLyBkZWx0YVQ7XG4gICAgICAgIHJHYW1tYSA9IGsgKiB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzJdICsgKDEgLSBrKSAqIChvcmllbnRhdGlvblsyXSAtIHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSArIGdhbW1hRGlzY29udGludWl0eUZhY3RvcikgLyBkZWx0YVQ7XG5cbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVswXSA9IHJBbHBoYTtcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVsxXSA9IHJCZXRhO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzJdID0gckdhbW1hO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPOiByZXNhbXBsZSB0aGUgZW1pc3Npb24gcmF0ZSB0byBtYXRjaCB0aGUgZGV2aWNlbW90aW9uIHJhdGVcbiAgICAgIHRoaXMucm90YXRpb25SYXRlLmVtaXQodGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wID0gbm93O1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSA9IG9yaWVudGF0aW9uWzBdO1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSA9IG9yaWVudGF0aW9uWzFdO1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSA9IG9yaWVudGF0aW9uWzJdO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSByb3RhdGlvbiByYXRlIGNhbiBiZSBjYWxjdWxhdGVkIGZyb20gdGhlIGBvcmllbnRhdGlvbmAgdmFsdWVzIG9yIG5vdC5cbiAgICpcbiAgICogQHRvZG8gLSB0aGlzIHNob3VsZCBiZSByZXZpZXdlZCB0byBjb21wbHkgd2l0aCB0aGUgYXhpcyBvcmRlciBkZWZpbmVkXG4gICAqICBpbiB0aGUgc3BlY1xuICAgKi9cbiAgLy8gV0FSTklOR1xuICAvLyBUaGUgbGluZXMgb2YgY29kZSBiZWxvdyBhcmUgY29tbWVudGVkIGJlY2F1c2Ugb2YgYSBidWcgb2YgQ2hyb21lXG4gIC8vIG9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzLCB3aGVyZSAnZGV2aWNlbW90aW9uJyBldmVudHMgYXJlIG5vdCBzZW50XG4gIC8vIG9yIGNhdWdodCBpZiB0aGUgbGlzdGVuZXIgaXMgc2V0IHVwIGFmdGVyIGEgJ2RldmljZW9yaWVudGF0aW9uJ1xuICAvLyBsaXN0ZW5lci4gSGVyZSwgdGhlIF90cnlPcmllbnRhdGlvbkZhbGxiYWNrIG1ldGhvZCB3b3VsZCBhZGQgYVxuICAvLyAnZGV2aWNlb3JpZW50YXRpb24nIGxpc3RlbmVyIGFuZCBibG9jayBhbGwgc3Vic2VxdWVudCAnZGV2aWNlbW90aW9uJ1xuICAvLyBldmVudHMgb24gdGhlc2UgZGV2aWNlcy4gQ29tbWVudHMgd2lsbCBiZSByZW1vdmVkIG9uY2UgdGhlIGJ1ZyBvZlxuICAvLyBDaHJvbWUgaXMgY29ycmVjdGVkLlxuICAvLyBfdHJ5T3JpZW50YXRpb25GYWxsYmFjaygpIHtcbiAgLy8gICBNb3Rpb25JbnB1dC5yZXF1aXJlTW9kdWxlKCdvcmllbnRhdGlvbicpXG4gIC8vICAgICAudGhlbigob3JpZW50YXRpb24pID0+IHtcbiAgLy8gICAgICAgaWYgKG9yaWVudGF0aW9uLmlzVmFsaWQpIHtcbiAgLy8gICAgICAgICBjb25zb2xlLmxvZyhgXG4gIC8vICAgICAgICAgICBXQVJOSU5HIChtb3Rpb24taW5wdXQpOiBUaGUgJ2RldmljZW1vdGlvbicgZXZlbnQgZG9lcyBub3QgZXhpc3RzIG9yXG4gIC8vICAgICAgICAgICBkb2VzIG5vdCBwcm92aWRlIHJvdGF0aW9uIHJhdGUgdmFsdWVzIGluIHlvdXIgYnJvd3Nlciwgc28gdGhlIHJvdGF0aW9uXG4gIC8vICAgICAgICAgICByYXRlIG9mIHRoZSBkZXZpY2UgaXMgZXN0aW1hdGVkIGZyb20gdGhlICdvcmllbnRhdGlvbicsIGNhbGN1bGF0ZWRcbiAgLy8gICAgICAgICAgIGZyb20gdGhlICdkZXZpY2VvcmllbnRhdGlvbicgZXZlbnQuIFNpbmNlIHRoZSBjb21wYXNzIG1pZ2h0IG5vdFxuICAvLyAgICAgICAgICAgYmUgYXZhaWxhYmxlLCBvbmx5IFxcYGJldGFcXGAgYW5kIFxcYGdhbW1hXFxgIGFuZ2xlcyBtYXkgYmUgcHJvdmlkZWRcbiAgLy8gICAgICAgICAgIChcXGBhbHBoYVxcYCB3b3VsZCBiZSBudWxsKS5gXG4gIC8vICAgICAgICAgKTtcblxuICAvLyAgICAgICAgIHRoaXMucm90YXRpb25SYXRlLmlzQ2FsY3VsYXRlZCA9IHRydWU7XG5cbiAgLy8gICAgICAgICBNb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcignb3JpZW50YXRpb24nLCAob3JpZW50YXRpb24pID0+IHtcbiAgLy8gICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVJvdGF0aW9uUmF0ZUZyb21PcmllbnRhdGlvbihvcmllbnRhdGlvbik7XG4gIC8vICAgICAgICAgfSk7XG4gIC8vICAgICAgIH1cblxuICAvLyAgICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSh0aGlzKTtcbiAgLy8gICAgIH0pO1xuICAvLyB9XG5cbiAgX3Byb2Nlc3MoZGF0YSkge1xuICAgIHRoaXMuX3Byb2Nlc3NGdW5jdGlvbihkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtwcm9taXNlfVxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gc3VwZXIuaW5pdCgocmVzb2x2ZSkgPT4ge1xuICAgICAgdGhpcy5fcHJvbWlzZVJlc29sdmUgPSByZXNvbHZlO1xuXG4gICAgICBpZiAod2luZG93LkRldmljZU1vdGlvbkV2ZW50KSB7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NGdW5jdGlvbiA9IHRoaXMuX2RldmljZW1vdGlvbkNoZWNrO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgdGhpcy5fcHJvY2Vzcyk7XG5cbiAgICAgICAgLy8gc2V0IGZhbGxiYWNrIHRpbWVvdXQgZm9yIEZpcmVmb3ggZGVza3RvcCAoaXRzIHdpbmRvdyBuZXZlciBjYWxsaW5nIHRoZSBEZXZpY2VPcmllbnRhdGlvbiBldmVudCwgYVxuICAgICAgICAvLyByZXF1aXJlIG9mIHRoZSBEZXZpY2VPcmllbnRhdGlvbiBzZXJ2aWNlIHdpbGwgcmVzdWx0IGluIHRoZSByZXF1aXJlIHByb21pc2UgbmV2ZXIgYmVpbmcgcmVzb2x2ZWRcbiAgICAgICAgLy8gaGVuY2UgdGhlIEV4cGVyaW1lbnQgc3RhcnQoKSBtZXRob2QgbmV2ZXIgY2FsbGVkKVxuICAgICAgICAvLyA+IG5vdGUgMDIvMDIvMjAxODogdGhpcyBzZWVtcyB0byBjcmVhdGUgcHJvYmxlbXMgd2l0aCBpcG9kcyB0aGF0XG4gICAgICAgIC8vIGRvbid0IGhhdmUgZW5vdWdoIHRpbWUgdG8gc3RhcnQgKHNvbWV0aW1lcyksIGhlbmNlIGNyZWF0aW5nIGZhbHNlXG4gICAgICAgIC8vIG5lZ2F0aXZlLiBTbyB3ZSBvbmx5IGFwcGx5IHRvIEZpcmVmb3ggZGVza3RvcCBhbmQgcHV0IGEgcmVhbGx5XG4gICAgICAgIC8vIGxhcmdlIHZhbHVlICg0c2VjKSBqdXN0IGluIGNhc2UuXG4gICAgICAgIGlmIChwbGF0Zm9ybS5uYW1lID09PSAnRmlyZWZveCcgJiZcbiAgICAgICAgICBwbGF0Zm9ybS5vcy5mYW1pbHkgIT09ICdBbmRyb2lkJyAmJlxuICAgICAgICAgIHBsYXRmb3JtLm9zLmZhbWlseSAhPT0gJ2lPUydcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdbbW90aW9uLWlucHV0XSByZWdpc3RlciB0aW1lciBmb3IgRmlyZWZveCBkZXNrdG9wJyk7XG4gICAgICAgICAgdGhpcy5fY2hlY2tUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHJlc29sdmUodGhpcyksIDQgKiAxMDAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBXQVJOSU5HXG4gICAgICAvLyBUaGUgbGluZXMgb2YgY29kZSBiZWxvdyBhcmUgY29tbWVudGVkIGJlY2F1c2Ugb2YgYSBidWcgb2YgQ2hyb21lXG4gICAgICAvLyBvbiBzb21lIEFuZHJvaWQgZGV2aWNlcywgd2hlcmUgJ2RldmljZW1vdGlvbicgZXZlbnRzIGFyZSBub3Qgc2VudFxuICAgICAgLy8gb3IgY2F1Z2h0IGlmIHRoZSBsaXN0ZW5lciBpcyBzZXQgdXAgYWZ0ZXIgYSAnZGV2aWNlb3JpZW50YXRpb24nXG4gICAgICAvLyBsaXN0ZW5lci4gSGVyZSwgdGhlIF90cnlPcmllbnRhdGlvbkZhbGxiYWNrIG1ldGhvZCB3b3VsZCBhZGQgYVxuICAgICAgLy8gJ2RldmljZW9yaWVudGF0aW9uJyBsaXN0ZW5lciBhbmQgYmxvY2sgYWxsIHN1YnNlcXVlbnQgJ2RldmljZW1vdGlvbidcbiAgICAgIC8vIGV2ZW50cyBvbiB0aGVzZSBkZXZpY2VzLiBDb21tZW50cyB3aWxsIGJlIHJlbW92ZWQgb25jZSB0aGUgYnVnIG9mXG4gICAgICAvLyBDaHJvbWUgaXMgY29ycmVjdGVkLlxuXG4gICAgICAvLyBlbHNlIGlmICh0aGlzLnJlcXVpcmVkLnJvdGF0aW9uUmF0ZSlcbiAgICAgIC8vIHRoaXMuX3RyeU9yaWVudGF0aW9uRmFsbGJhY2soKTtcblxuICAgICAgZWxzZVxuICAgICAgICByZXNvbHZlKHRoaXMpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBEZXZpY2VNb3Rpb25Nb2R1bGUoKTtcbiJdfQ==