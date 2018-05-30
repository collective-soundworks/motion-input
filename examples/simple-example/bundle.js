(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _motionInput = require('@ircam/motion-input');

var _motionInput2 = _interopRequireDefault(_motionInput);

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

_motionInput2.default.init(['devicemotion', 'accelerationIncludingGravity', 'acceleration', 'rotationRate', 'deviceorientation', 'orientation', 'orientationAlt', 'energy']).then(function (modules) {
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

},{"@ircam/motion-input":8}],2:[function(require,module,exports){
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

},{"./InputModule":6}],3:[function(require,module,exports){
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
      //
      // fixed since Chrome 65
      // cf. https://github.com/immersive-web/webvr-polyfill/issues/307
      if (_platform2.default.os.family === 'Android' && chromeRegExp.test(_platform2.default.name) && parseInt(_platform2.default.version.split('.')[0]) < 65) {
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

},{"./DOMEventSubmodule":2,"./InputModule":6,"./MotionInput":7,"platform":9}],4:[function(require,module,exports){
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
      // clear timeout (anti-Firefox bug solution, window event deviceorientation being nver called)
      // set the set timeout in init() function
      clearTimeout(this._checkTimeoutId);

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
          // set fallback timeout for Firefox (its window never calling the DeviceOrientation event, a 
          // require of the DeviceOrientation service will result in the require promise never being resolved
          // hence the Experiment start() method never called)
          _this3._checkTimeoutId = setTimeout(function () {
            return resolve(_this3);
          }, 500);
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

},{"./DOMEventSubmodule":2,"./InputModule":6,"./MotionInput":7,"platform":9}],5:[function(require,module,exports){
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

},{"./InputModule":6,"./MotionInput":7}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"./DeviceMotionModule":3,"./DeviceOrientationModule":4,"./EnergyModule":5,"./MotionInput":7}],9:[function(require,module,exports){
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
      'Electron',
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
      { 'label': 'Samsung Internet', 'pattern': 'SamsungBrowser' },
      'SeaMonkey',
      { 'label': 'Silk', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
      'Sleipnir',
      'SlimBrowser',
      { 'label': 'SRWare Iron', 'pattern': 'Iron' },
      'Sunrise',
      'Swiftfox',
      'Waterfox',
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
      { 'label': 'Galaxy S5', 'pattern': 'SM-G900' },
      { 'label': 'Galaxy S6', 'pattern': 'SM-G920' },
      { 'label': 'Galaxy S6 Edge', 'pattern': 'SM-G925' },
      { 'label': 'Galaxy S7', 'pattern': 'SM-G930' },
      { 'label': 'Galaxy S7 Edge', 'pattern': 'SM-G935' },
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
      'PlayStation Vita',
      'PlayStation',
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
      'Sony': { 'PlayStation': 1, 'PlayStation Vita': 1 }
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
      'Tizen',
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
              RegExp('\\b' + pattern + ' *\\w+-[\\w]*', 'i').exec(ua) ||
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
    // Add Chrome version to description for Electron.
    else if (name == 'Electron' && (data = (/\bChrome\/([\d.]+)\b/.exec(ua) || 0)[1])) {
      description.push('Chromium ' + data);
    }
    // Detect non-Opera (Presto-based) versions (order is important).
    if (!version) {
      version = getVersion([
        '(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))',
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
    // Detect IE 11 identifying as other browsers.
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
          if (typeof data.versions == 'object') {
            if (typeof data.versions.electron == 'string') {
              description.push('Node ' + data.versions.node);
              name = 'Electron';
              version = data.versions.electron;
            } else if (typeof data.versions.nw == 'string') {
              description.push('Chromium ' + version, 'Node ' + data.versions.node);
              name = 'NW.js';
              version = data.versions.nw;
            }
          } else {
            name = 'Node.js';
            arch = data.arch;
            os = data.platform;
            version = /[\d.]+/.exec(data.version)
            version = version ? version[0] : 'unknown';
          }
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
      // Detect IE 11 masking as other browsers.
      else if (typeof doc.documentMode == 'number' && /^(?:Chrome|Firefox)\b/.test(name)) {
        description.push('masking as ' + name + ' ' + version);
        name = 'IE';
        version = '11.0';
        layout = ['Trident'];
        os = 'Windows';
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
      if (product == 'Xbox 360') {
        os = null;
      }
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
    else if (name == 'IE' && useFeatures) {
      try {
        if (context.external === null) {
          description.unshift('platform preview');
        }
      } catch(e) {
        description.unshift('embedded');
      }
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
        /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(name) && layout[1])) {
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
     * The list of common layout engines include:
     * "Blink", "EdgeHTML", "Gecko", "Trident" and "WebKit"
     *
     * @memberOf platform
     * @type string|null
     */
    platform.layout = layout && layout[0];

    /**
     * The name of the product's manufacturer.
     *
     * The list of manufacturers include:
     * "Apple", "Archos", "Amazon", "Asus", "Barnes & Noble", "BlackBerry",
     * "Google", "HP", "HTC", "LG", "Microsoft", "Motorola", "Nintendo",
     * "Nokia", "Samsung" and "Sony"
     *
     * @memberOf platform
     * @type string|null
     */
    platform.manufacturer = manufacturer;

    /**
     * The name of the browser/environment.
     *
     * The list of common browser names include:
     * "Chrome", "Electron", "Firefox", "Firefox for iOS", "IE",
     * "Microsoft Edge", "PhantomJS", "Safari", "SeaMonkey", "Silk",
     * "Opera Mini" and "Opera"
     *
     * Mobile versions of some browsers have "Mobile" appended to their name:
     * eg. "Chrome Mobile", "Firefox Mobile", "IE Mobile" and "Opera Mobile"
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
     * The list of common products include:
     *
     * "BlackBerry", "Galaxy S4", "Lumia", "iPad", "iPod", "iPhone", "Kindle",
     * "Kindle Fire", "Nexus", "Nook", "PlayBook", "TouchPad" and "Transformer"
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL0BpcmNhbS9tb3Rpb24taW5wdXQvZGlzdC9ET01FdmVudFN1Ym1vZHVsZS5qcyIsIm5vZGVfbW9kdWxlcy9AaXJjYW0vbW90aW9uLWlucHV0L2Rpc3QvRGV2aWNlTW90aW9uTW9kdWxlLmpzIiwibm9kZV9tb2R1bGVzL0BpcmNhbS9tb3Rpb24taW5wdXQvZGlzdC9EZXZpY2VPcmllbnRhdGlvbk1vZHVsZS5qcyIsIm5vZGVfbW9kdWxlcy9AaXJjYW0vbW90aW9uLWlucHV0L2Rpc3QvRW5lcmd5TW9kdWxlLmpzIiwibm9kZV9tb2R1bGVzL0BpcmNhbS9tb3Rpb24taW5wdXQvZGlzdC9JbnB1dE1vZHVsZS5qcyIsIm5vZGVfbW9kdWxlcy9AaXJjYW0vbW90aW9uLWlucHV0L2Rpc3QvTW90aW9uSW5wdXQuanMiLCJub2RlX21vZHVsZXMvQGlyY2FtL21vdGlvbi1pbnB1dC9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BsYXRmb3JtL3BsYXRmb3JtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBRUE7QUFDQSxJQUFNLHVDQUF1QyxTQUFTLGFBQVQsQ0FBdUIsdUNBQXZCLENBQTdDO0FBQ0EsSUFBTSx1QkFBdUIsU0FBUyxhQUFULENBQXVCLHVCQUF2QixDQUE3QjtBQUNBLElBQU0sdUJBQXVCLFNBQVMsYUFBVCxDQUF1Qix1QkFBdkIsQ0FBN0I7QUFDQSxJQUFNLHNCQUFzQixTQUFTLGFBQVQsQ0FBdUIsc0JBQXZCLENBQTVCOztBQUVBO0FBQ0EsSUFBTSxtQ0FBbUMsU0FBUyxhQUFULENBQXVCLG1DQUF2QixDQUF6QztBQUNBLElBQU0sbUNBQW1DLFNBQVMsYUFBVCxDQUF1QixtQ0FBdkIsQ0FBekM7QUFDQSxJQUFNLG1DQUFtQyxTQUFTLGFBQVQs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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IG1vdGlvbklucHV0IGZyb20gJ0BpcmNhbS9tb3Rpb24taW5wdXQnO1xuXG4vLyBTZW5zb3Igc3VwcG9ydCBET00gZWxlbWVudHNcbmNvbnN0IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlQcm92aWRlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5UHJvdmlkZWQnKTtcbmNvbnN0IGFjY2VsZXJhdGlvblByb3ZpZGVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FjY2VsZXJhdGlvblByb3ZpZGVkJyk7XG5jb25zdCByb3RhdGlvblJhdGVQcm92aWRlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyb3RhdGlvblJhdGVQcm92aWRlZCcpO1xuY29uc3Qgb3JpZW50YXRpb25Qcm92aWRlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcmllbnRhdGlvblByb3ZpZGVkJyk7XG5cbi8vIEFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eSBET00gZWxlbWVudHNcbmNvbnN0IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlYUmF3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlYUmF3Jyk7XG5jb25zdCBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WVJhdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WVJhdycpO1xuY29uc3QgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVpSYXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVpSYXcnKTtcblxuY29uc3QgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVhVbmlmaWVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlYVW5pZmllZCcpO1xuY29uc3QgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVlVbmlmaWVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlZVW5pZmllZCcpO1xuY29uc3QgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVpVbmlmaWVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlaVW5pZmllZCcpO1xuXG4vLyBBY2NlbGVyYXRpb24gRE9NIGVsZW1lbnRzXG5jb25zdCBhY2NlbGVyYXRpb25YUmF3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FjY2VsZXJhdGlvblhSYXcnKTtcbmNvbnN0IGFjY2VsZXJhdGlvbllSYXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWNjZWxlcmF0aW9uWVJhdycpO1xuY29uc3QgYWNjZWxlcmF0aW9uWlJhdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhY2NlbGVyYXRpb25aUmF3Jyk7XG5cbmNvbnN0IGFjY2VsZXJhdGlvblhVbmlmaWVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FjY2VsZXJhdGlvblhVbmlmaWVkJyk7XG5jb25zdCBhY2NlbGVyYXRpb25ZVW5pZmllZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhY2NlbGVyYXRpb25ZVW5pZmllZCcpO1xuY29uc3QgYWNjZWxlcmF0aW9uWlVuaWZpZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWNjZWxlcmF0aW9uWlVuaWZpZWQnKTtcblxuLy8gUm90YXRpb24gcmF0ZSBET00gZWxlbWVudHNcbmNvbnN0IHJvdGF0aW9uUmF0ZUFscGhhUmF3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvdGF0aW9uUmF0ZUFscGhhUmF3Jyk7XG5jb25zdCByb3RhdGlvblJhdGVCZXRhUmF3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvdGF0aW9uUmF0ZUJldGFSYXcnKTtcbmNvbnN0IHJvdGF0aW9uUmF0ZUdhbW1hUmF3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvdGF0aW9uUmF0ZUdhbW1hUmF3Jyk7XG5cbmNvbnN0IHJvdGF0aW9uUmF0ZUFscGhhVW5pZmllZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyb3RhdGlvblJhdGVBbHBoYVVuaWZpZWQnKTtcbmNvbnN0IHJvdGF0aW9uUmF0ZUJldGFVbmlmaWVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvdGF0aW9uUmF0ZUJldGFVbmlmaWVkJyk7XG5jb25zdCByb3RhdGlvblJhdGVHYW1tYVVuaWZpZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcm90YXRpb25SYXRlR2FtbWFVbmlmaWVkJyk7XG5cbi8vIE9yaWVudGF0aW9uIERPTSBlbGVtZW50c1xuY29uc3Qgb3JpZW50YXRpb25BbHBoYVJhdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcmllbnRhdGlvbkFscGhhUmF3Jyk7XG5jb25zdCBvcmllbnRhdGlvbkJldGFSYXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3JpZW50YXRpb25CZXRhUmF3Jyk7XG5jb25zdCBvcmllbnRhdGlvbkdhbW1hUmF3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI29yaWVudGF0aW9uR2FtbWFSYXcnKTtcblxuY29uc3Qgb3JpZW50YXRpb25BbHBoYVVuaWZpZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3JpZW50YXRpb25BbHBoYVVuaWZpZWQnKTtcbmNvbnN0IG9yaWVudGF0aW9uQmV0YVVuaWZpZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3JpZW50YXRpb25CZXRhVW5pZmllZCcpO1xuY29uc3Qgb3JpZW50YXRpb25HYW1tYVVuaWZpZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3JpZW50YXRpb25HYW1tYVVuaWZpZWQnKTtcblxuLy8gT3JpZW50YXRpb24gKEFsdGVybmF0aXZlKSBET00gZWxlbWVudHNcbmNvbnN0IG9yaWVudGF0aW9uQWx0QWxwaGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3JpZW50YXRpb25BbHRBbHBoYScpO1xuY29uc3Qgb3JpZW50YXRpb25BbHRCZXRhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI29yaWVudGF0aW9uQWx0QmV0YScpO1xuY29uc3Qgb3JpZW50YXRpb25BbHRHYW1tYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcmllbnRhdGlvbkFsdEdhbW1hJyk7XG5cbi8vIEVuZXJneSBET00gZWxlbWVudHNcbmNvbnN0IGVuZXJneSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlbmVyZ3knKTtcblxuZnVuY3Rpb24gcm91bmRWYWx1ZShpbnB1dCkge1xuICBpZiAoaW5wdXQgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIGlmIChpbnB1dCA9PT0gbnVsbClcbiAgICByZXR1cm4gJ251bGwnO1xuXG4gIHJldHVybiBNYXRoLnJvdW5kKGlucHV0ICogMTAwKSAvIDEwMDtcbn1cblxuZnVuY3Rpb24gZGlzcGxheVByb3ZpZGVkU2Vuc29ycyhtb2R1bGVzKSB7XG4gIGNvbnN0IGRldmljZW1vdGlvbiA9IG1vZHVsZXNbMF07XG4gIGNvbnN0IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBtb2R1bGVzWzFdO1xuICBjb25zdCBhY2NlbGVyYXRpb24gPSBtb2R1bGVzWzJdO1xuICBjb25zdCByb3RhdGlvblJhdGUgPSBtb2R1bGVzWzNdO1xuICBjb25zdCBkZXZpY2VvcmllbnRhdGlvbiA9IG1vZHVsZXNbNF07XG4gIGNvbnN0IG9yaWVudGF0aW9uID0gbW9kdWxlc1s1XTtcbiAgY29uc3Qgb3JpZW50YXRpb25BbHQgPSBtb2R1bGVzWzZdO1xuICBjb25zdCBlbmVyZ3kgPSBtb2R1bGVzWzddO1xuXG4gIGlmIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzUHJvdmlkZWQpIHtcbiAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5UHJvdmlkZWQudGV4dENvbnRlbnQgPSAnWWVzJztcbiAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5UHJvdmlkZWQuY2xhc3NMaXN0LmFkZCgnc3VjY2VzcycpO1xuICAgIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlQcm92aWRlZC5jbGFzc0xpc3QucmVtb3ZlKCdkYW5nZXInKTtcbiAgfVxuXG4gIGlmIChhY2NlbGVyYXRpb24uaXNQcm92aWRlZCkge1xuICAgIGFjY2VsZXJhdGlvblByb3ZpZGVkLnRleHRDb250ZW50ID0gJ1llcyc7XG4gICAgYWNjZWxlcmF0aW9uUHJvdmlkZWQuY2xhc3NMaXN0LmFkZCgnc3VjY2VzcycpO1xuICAgIGFjY2VsZXJhdGlvblByb3ZpZGVkLmNsYXNzTGlzdC5yZW1vdmUoJ2RhbmdlcicpO1xuICB9XG5cbiAgaWYgKHJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkKSB7XG4gICAgcm90YXRpb25SYXRlUHJvdmlkZWQudGV4dENvbnRlbnQgPSAnWWVzJztcbiAgICByb3RhdGlvblJhdGVQcm92aWRlZC5jbGFzc0xpc3QuYWRkKCdzdWNjZXNzJyk7XG4gICAgcm90YXRpb25SYXRlUHJvdmlkZWQuY2xhc3NMaXN0LnJlbW92ZSgnZGFuZ2VyJyk7XG4gIH1cblxuICBpZiAob3JpZW50YXRpb24uaXNQcm92aWRlZCkge1xuICAgIG9yaWVudGF0aW9uUHJvdmlkZWQudGV4dENvbnRlbnQgPSAnWWVzJztcbiAgICBvcmllbnRhdGlvblByb3ZpZGVkLmNsYXNzTGlzdC5hZGQoJ3N1Y2Nlc3MnKTtcbiAgICBvcmllbnRhdGlvblByb3ZpZGVkLmNsYXNzTGlzdC5yZW1vdmUoJ2RhbmdlcicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlEZXZpY2VvcmllbnRhdGlvblJhdyhtb2R1bGUpIHtcbiAgaWYgKG1vZHVsZS5pc1ZhbGlkKSB7XG4gICAgbW9kdWxlLmFkZExpc3RlbmVyKCh2YWwpID0+IHtcbiAgICAgIG9yaWVudGF0aW9uQWxwaGFSYXcudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFswXSk7XG4gICAgICBvcmllbnRhdGlvbkJldGFSYXcudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsxXSk7XG4gICAgICBvcmllbnRhdGlvbkdhbW1hUmF3LnRleHRDb250ZW50ID0gcm91bmRWYWx1ZSh2YWxbMl0pO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlEZXZpY2Vtb3Rpb25SYXcobW9kdWxlKSB7XG4gIGlmIChtb2R1bGUuaXNWYWxpZCkge1xuICAgIG1vZHVsZS5hZGRMaXN0ZW5lcigodmFsKSA9PiB7XG4gICAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WFJhdy50ZXh0Q29udGVudCA9IHJvdW5kVmFsdWUodmFsWzBdKTtcbiAgICAgIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlZUmF3LnRleHRDb250ZW50ID0gcm91bmRWYWx1ZSh2YWxbMV0pO1xuICAgICAgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVpSYXcudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsyXSk7XG5cbiAgICAgIGFjY2VsZXJhdGlvblhSYXcudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFszXSk7XG4gICAgICBhY2NlbGVyYXRpb25ZUmF3LnRleHRDb250ZW50ID0gcm91bmRWYWx1ZSh2YWxbNF0pO1xuICAgICAgYWNjZWxlcmF0aW9uWlJhdy50ZXh0Q29udGVudCA9IHJvdW5kVmFsdWUodmFsWzVdKTtcblxuICAgICAgcm90YXRpb25SYXRlQWxwaGFSYXcudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFs2XSk7XG4gICAgICByb3RhdGlvblJhdGVCZXRhUmF3LnRleHRDb250ZW50ID0gcm91bmRWYWx1ZSh2YWxbN10pO1xuICAgICAgcm90YXRpb25SYXRlR2FtbWFSYXcudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFs4XSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGxheUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkobW9kdWxlKSB7XG4gIGlmIChtb2R1bGUuaXNWYWxpZCkge1xuICAgIG1vZHVsZS5hZGRMaXN0ZW5lcigodmFsKSA9PiB7XG4gICAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WFVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFswXSk7XG4gICAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WVVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsxXSk7XG4gICAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WlVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsyXSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGxheUFjY2VsZXJhdGlvbihtb2R1bGUpIHtcbiAgaWYgKG1vZHVsZS5pc1ZhbGlkKSB7XG4gICAgbW9kdWxlLmFkZExpc3RlbmVyKCh2YWwpID0+IHtcbiAgICAgIGFjY2VsZXJhdGlvblhVbmlmaWVkLnRleHRDb250ZW50ID0gcm91bmRWYWx1ZSh2YWxbMF0pO1xuICAgICAgYWNjZWxlcmF0aW9uWVVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsxXSk7XG4gICAgICBhY2NlbGVyYXRpb25aVW5pZmllZC50ZXh0Q29udGVudCA9IHJvdW5kVmFsdWUodmFsWzJdKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkaXNwbGF5Um90YXRpb25SYXRlKG1vZHVsZSkge1xuICBpZiAobW9kdWxlLmlzVmFsaWQpIHtcbiAgICBtb2R1bGUuYWRkTGlzdGVuZXIoKHZhbCkgPT4ge1xuICAgICAgcm90YXRpb25SYXRlQWxwaGFVbmlmaWVkLnRleHRDb250ZW50ID0gcm91bmRWYWx1ZSh2YWxbMF0pO1xuICAgICAgcm90YXRpb25SYXRlQmV0YVVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsxXSk7XG4gICAgICByb3RhdGlvblJhdGVHYW1tYVVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsyXSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGxheU9yaWVudGF0aW9uKG1vZHVsZSkge1xuICBpZiAobW9kdWxlLmlzVmFsaWQpIHtcbiAgICBtb2R1bGUuYWRkTGlzdGVuZXIoKHZhbCkgPT4ge1xuICAgICAgb3JpZW50YXRpb25BbHBoYVVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFswXSk7XG4gICAgICBvcmllbnRhdGlvbkJldGFVbmlmaWVkLnRleHRDb250ZW50ID0gcm91bmRWYWx1ZSh2YWxbMV0pO1xuICAgICAgb3JpZW50YXRpb25HYW1tYVVuaWZpZWQudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsyXSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGxheU9yaWVudGF0aW9uQWx0KG1vZHVsZSkge1xuICBpZiAobW9kdWxlLmlzVmFsaWQpIHtcbiAgICBtb2R1bGUuYWRkTGlzdGVuZXIoKHZhbCkgPT4ge1xuICAgICAgb3JpZW50YXRpb25BbHRBbHBoYS50ZXh0Q29udGVudCA9IHJvdW5kVmFsdWUodmFsWzBdKTtcbiAgICAgIG9yaWVudGF0aW9uQWx0QmV0YS50ZXh0Q29udGVudCA9IHJvdW5kVmFsdWUodmFsWzFdKTtcbiAgICAgIG9yaWVudGF0aW9uQWx0R2FtbWEudGV4dENvbnRlbnQgPSByb3VuZFZhbHVlKHZhbFsyXSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGxheUVuZXJneShtb2R1bGUpIHtcbiAgaWYgKG1vZHVsZS5pc1ZhbGlkKSB7XG4gICAgbW9kdWxlLmFkZExpc3RlbmVyKCh2YWwpID0+IHtcbiAgICAgIGVuZXJneS50ZXh0Q29udGVudCA9IHJvdW5kVmFsdWUodmFsKTtcbiAgICB9KTtcbiAgfVxufVxuXG5tb3Rpb25JbnB1dC5pbml0KFtcbiAgJ2RldmljZW1vdGlvbicsXG4gICdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JyxcbiAgJ2FjY2VsZXJhdGlvbicsXG4gICdyb3RhdGlvblJhdGUnLFxuICAnZGV2aWNlb3JpZW50YXRpb24nLFxuICAnb3JpZW50YXRpb24nLFxuICAnb3JpZW50YXRpb25BbHQnLFxuICAnZW5lcmd5J1xuXSkudGhlbihmdW5jdGlvbihtb2R1bGVzKSB7XG4gIGNvbnN0IGRldmljZW1vdGlvbiA9IG1vZHVsZXNbMF07XG4gIGNvbnN0IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBtb2R1bGVzWzFdO1xuICBjb25zdCBhY2NlbGVyYXRpb24gPSBtb2R1bGVzWzJdO1xuICBjb25zdCByb3RhdGlvblJhdGUgPSBtb2R1bGVzWzNdO1xuICBjb25zdCBkZXZpY2VvcmllbnRhdGlvbiA9IG1vZHVsZXNbNF07XG4gIGNvbnN0IG9yaWVudGF0aW9uID0gbW9kdWxlc1s1XTtcbiAgY29uc3Qgb3JpZW50YXRpb25BbHQgPSBtb2R1bGVzWzZdO1xuICBjb25zdCBlbmVyZ3kgPSBtb2R1bGVzWzddO1xuXG4gIGRpc3BsYXlQcm92aWRlZFNlbnNvcnMobW9kdWxlcyk7XG4gIGRpc3BsYXlEZXZpY2Vtb3Rpb25SYXcoZGV2aWNlbW90aW9uKTtcbiAgZGlzcGxheUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSk7XG4gIGRpc3BsYXlBY2NlbGVyYXRpb24oYWNjZWxlcmF0aW9uKTtcbiAgZGlzcGxheVJvdGF0aW9uUmF0ZShyb3RhdGlvblJhdGUpO1xuICBkaXNwbGF5RGV2aWNlb3JpZW50YXRpb25SYXcoZGV2aWNlb3JpZW50YXRpb24pO1xuICBkaXNwbGF5T3JpZW50YXRpb24ob3JpZW50YXRpb24pO1xuICBkaXNwbGF5T3JpZW50YXRpb25BbHQob3JpZW50YXRpb25BbHQpO1xuICBkaXNwbGF5RW5lcmd5KGVuZXJneSk7XG5cbn0pLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG5cbiIsImltcG9ydCBJbnB1dE1vZHVsZSBmcm9tICcuL0lucHV0TW9kdWxlJztcblxuLyoqXG4gKiBgRE9NRXZlbnRTdWJtb2R1bGVgIGNsYXNzLlxuICogVGhlIGBET01FdmVudFN1Ym1vZHVsZWAgY2xhc3MgYWxsb3dzIHRvIGluc3RhbnRpYXRlIG1vZHVsZXMgdGhhdCBwcm92aWRlXG4gKiB1bmlmaWVkIHZhbHVlcyAoc3VjaCBhcyBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIGBBY2NlbGVyYXRpb25gLFxuICogYFJvdGF0aW9uUmF0ZWAsIGBPcmllbnRhdGlvbmAsIGBPcmllbnRhdGlvbkFsdCkgZnJvbSB0aGUgYGRldmljZW1vdGlvbmBcbiAqIG9yIGBkZXZpY2VvcmllbnRhdGlvbmAgRE9NIGV2ZW50cy5cbiAqXG4gKiBAY2xhc3MgRE9NRXZlbnRTdWJtb2R1bGVcbiAqIEBleHRlbmRzIElucHV0TW9kdWxlXG4gKi9cbmNsYXNzIERPTUV2ZW50U3VibW9kdWxlIGV4dGVuZHMgSW5wdXRNb2R1bGUge1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgYERPTUV2ZW50U3VibW9kdWxlYCBtb2R1bGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbk1vZHVsZXxEZXZpY2VPcmllbnRhdGlvbk1vZHVsZX0gRE9NRXZlbnRNb2R1bGUgLSBUaGUgcGFyZW50IERPTSBldmVudCBtb2R1bGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBUaGUgbmFtZSBvZiB0aGUgc3VibW9kdWxlIC8gZXZlbnQgKCplLmcuKiAnYWNjZWxlcmF0aW9uJyBvciAnb3JpZW50YXRpb25BbHQnKS5cbiAgICogQHNlZSBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICogQHNlZSBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZVxuICAgKi9cbiAgY29uc3RydWN0b3IoRE9NRXZlbnRNb2R1bGUsIGV2ZW50VHlwZSkge1xuICAgIHN1cGVyKGV2ZW50VHlwZSk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgRE9NIGV2ZW50IHBhcmVudCBtb2R1bGUgZnJvbSB3aGljaCB0aGlzIG1vZHVsZSBnZXRzIHRoZSByYXcgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHRoaXMgRE9NRXZlbnRTdWJtb2R1bGVcbiAgICAgKiBAdHlwZSB7RGV2aWNlTW90aW9uTW9kdWxlfERldmljZU9yaWVudGF0aW9uTW9kdWxlfVxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIHRoaXMuRE9NRXZlbnRNb2R1bGUgPSBET01FdmVudE1vZHVsZTtcblxuICAgIC8qKlxuICAgICAqIFJhdyB2YWx1ZXMgY29taW5nIGZyb20gdGhlIGBkZXZpY2Vtb3Rpb25gIGV2ZW50IHNlbnQgYnkgdGhpcyBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBET01FdmVudFN1Ym1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50ID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogQ29tcGFzcyBoZWFkaW5nIHJlZmVyZW5jZSAoaU9TIGRldmljZXMgb25seSwgYE9yaWVudGF0aW9uYCBhbmQgYE9yaWVudGF0aW9uQWx0YCBzdWJtb2R1bGVzIG9ubHkpLlxuICAgICAqXG4gICAgICogQHRoaXMgRE9NRXZlbnRTdWJtb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICB0aGlzLl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgb2YgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGluaXQoKSB7XG4gICAgLy8gSW5kaWNhdGUgdG8gdGhlIHBhcmVudCBtb2R1bGUgdGhhdCB0aGlzIGV2ZW50IGlzIHJlcXVpcmVkXG4gICAgdGhpcy5ET01FdmVudE1vZHVsZS5yZXF1aXJlZFt0aGlzLmV2ZW50VHlwZV0gPSB0cnVlO1xuXG4gICAgLy8gSWYgdGhlIHBhcmVudCBldmVudCBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQgeWV0LCBpbml0aWFsaXplIGl0XG4gICAgbGV0IERPTUV2ZW50UHJvbWlzZSA9IHRoaXMuRE9NRXZlbnRNb2R1bGUucHJvbWlzZTtcbiAgICBpZiAoIURPTUV2ZW50UHJvbWlzZSlcbiAgICAgIERPTUV2ZW50UHJvbWlzZSA9IHRoaXMuRE9NRXZlbnRNb2R1bGUuaW5pdCgpO1xuXG4gICAgcmV0dXJuIERPTUV2ZW50UHJvbWlzZS50aGVuKChtb2R1bGUpID0+IHRoaXMpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERPTUV2ZW50U3VibW9kdWxlO1xuIiwiaW1wb3J0IElucHV0TW9kdWxlIGZyb20gJy4vSW5wdXRNb2R1bGUnO1xuaW1wb3J0IERPTUV2ZW50U3VibW9kdWxlIGZyb20gJy4vRE9NRXZlbnRTdWJtb2R1bGUnO1xuaW1wb3J0IE1vdGlvbklucHV0IGZyb20gJy4vTW90aW9uSW5wdXQnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJ3BsYXRmb3JtJztcblxuLyoqXG4gKiBHZXRzIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUgaW4gc2Vjb25kcy5cbiAqIFVzZXMgYHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKWAgaWYgYXZhaWxhYmxlLCBhbmQgYERhdGUubm93KClgIG90aGVyd2lzZS5cbiAqXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGdldExvY2FsVGltZSgpIHtcbiAgaWYgKHdpbmRvdy5wZXJmb3JtYW5jZSlcbiAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMDtcbiAgcmV0dXJuIERhdGUubm93KCkgLyAxMDAwO1xufVxuXG5jb25zdCBjaHJvbWVSZWdFeHAgPSAvQ2hyb21lLztcbmNvbnN0IHRvRGVnID0gMTgwIC8gTWF0aC5QSTtcblxuLyoqXG4gKiBgRGV2aWNlTW90aW9uYCBtb2R1bGUgc2luZ2xldG9uLlxuICogVGhlIGBEZXZpY2VNb3Rpb25Nb2R1bGVgIHNpbmdsZXRvbiBwcm92aWRlcyB0aGUgcmF3IHZhbHVlc1xuICogb2YgdGhlIGFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eSwgYWNjZWxlcmF0aW9uLCBhbmQgcm90YXRpb25cbiAqIHJhdGUgcHJvdmlkZWQgYnkgdGhlIGBEZXZpY2VNb3Rpb25gIGV2ZW50LlxuICogSXQgYWxzbyBpbnN0YW50aWF0ZSB0aGUgYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLFxuICogYEFjY2VsZXJhdGlvbmAgYW5kIGBSb3RhdGlvblJhdGVgIHN1Ym1vZHVsZXMgdGhhdCB1bmlmeSB0aG9zZSB2YWx1ZXNcbiAqIGFjcm9zcyBwbGF0Zm9ybXMgYnkgbWFraW5nIHRoZW0gY29tcGxpYW50IHdpdGgge0BsaW5rXG4gKiBodHRwOi8vd3d3LnczLm9yZy9UUi9vcmllbnRhdGlvbi1ldmVudC98dGhlIFczQyBzdGFuZGFyZH0uXG4gKiBXaGVuIHJhdyB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSB0aGUgc2Vuc29ycywgdGhpcyBtb2R1bGVzIHRyaWVzXG4gKiB0byByZWNhbGN1bGF0ZSB0aGVtIGZyb20gYXZhaWxhYmxlIHZhbHVlczpcbiAqIC0gYGFjY2VsZXJhdGlvbmAgaXMgY2FsY3VsYXRlZCBmcm9tIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YFxuICogICB3aXRoIGEgaGlnaC1wYXNzIGZpbHRlcjtcbiAqIC0gKGNvbWluZyBzb29uIOKAlCB3YWl0aW5nIGZvciBhIGJ1ZyBvbiBDaHJvbWUgdG8gYmUgcmVzb2x2ZWQpXG4gKiAgIGByb3RhdGlvblJhdGVgIGlzIGNhbGN1bGF0ZWQgZnJvbSBgb3JpZW50YXRpb25gLlxuICpcbiAqIEBjbGFzcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAqIEBleHRlbmRzIElucHV0TW9kdWxlXG4gKi9cbmNsYXNzIERldmljZU1vdGlvbk1vZHVsZSBleHRlbmRzIElucHV0TW9kdWxlIHtcblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgYERldmljZU1vdGlvbmAgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCdkZXZpY2Vtb3Rpb24nKTtcblxuICAgIC8qKlxuICAgICAqIFJhdyB2YWx1ZXMgY29taW5nIGZyb20gdGhlIGBkZXZpY2Vtb3Rpb25gIGV2ZW50IHNlbnQgYnkgdGhpcyBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgW251bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGxdXG4gICAgICovXG4gICAgdGhpcy5ldmVudCA9IFtudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgbW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIHVuaWZpZWQgdmFsdWVzIG9mIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ID0gbmV3IERPTUV2ZW50U3VibW9kdWxlKHRoaXMsICdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Jyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYEFjY2VsZXJhdGlvbmAgc3VibW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIHVuaWZpZWQgdmFsdWVzIG9mIHRoZSBhY2NlbGVyYXRpb24uXG4gICAgICogRXN0aW1hdGVzIHRoZSBhY2NlbGVyYXRpb24gdmFsdWVzIGZyb20gYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgXG4gICAgICogcmF3IHZhbHVlcyBpZiB0aGUgYWNjZWxlcmF0aW9uIHJhdyB2YWx1ZXMgYXJlIG5vdCBhdmFpbGFibGUgb24gdGhlXG4gICAgICogZGV2aWNlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uID0gbmV3IERPTUV2ZW50U3VibW9kdWxlKHRoaXMsICdhY2NlbGVyYXRpb24nKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgUm90YXRpb25SYXRlYCBzdWJtb2R1bGUuXG4gICAgICogUHJvdmlkZXMgdW5pZmllZCB2YWx1ZXMgb2YgdGhlIHJvdGF0aW9uIHJhdGUuXG4gICAgICogKGNvbWluZyBzb29uLCB3YWl0aW5nIGZvciBhIGJ1ZyBvbiBDaHJvbWUgdG8gYmUgcmVzb2x2ZWQpXG4gICAgICogRXN0aW1hdGVzIHRoZSByb3RhdGlvbiByYXRlIHZhbHVlcyBmcm9tIGBvcmllbnRhdGlvbmAgdmFsdWVzIGlmXG4gICAgICogdGhlIHJvdGF0aW9uIHJhdGUgcmF3IHZhbHVlcyBhcmUgbm90IGF2YWlsYWJsZSBvbiB0aGUgZGV2aWNlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIHRoaXMucm90YXRpb25SYXRlID0gbmV3IERPTUV2ZW50U3VibW9kdWxlKHRoaXMsICdyb3RhdGlvblJhdGUnKTtcblxuICAgIC8qKlxuICAgICAqIFJlcXVpcmVkIHN1Ym1vZHVsZXMgLyBldmVudHMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICogQHByb3BlcnR5IHtib29sfSBhY2NlbGVyYXRpb24gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYGFjY2VsZXJhdGlvbmAgdW5pZmllZCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICogQHByb3BlcnR5IHtib29sfSByb3RhdGlvblJhdGUgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYHJvdGF0aW9uUmF0ZWAgdW5pZmllZCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICovXG4gICAgdGhpcy5yZXF1aXJlZCA9IHtcbiAgICAgIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHk6IGZhbHNlLFxuICAgICAgYWNjZWxlcmF0aW9uOiBmYWxzZSxcbiAgICAgIHJvdGF0aW9uUmF0ZTogZmFsc2VcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZSBmdW5jdGlvbiBvZiB0aGUgbW9kdWxlJ3MgcHJvbWlzZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICogQHNlZSBEZXZpY2VNb3Rpb25Nb2R1bGUjaW5pdFxuICAgICAqL1xuICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFVuaWZ5aW5nIGZhY3RvciBvZiB0aGUgbW90aW9uIGRhdGEgdmFsdWVzIChgMWAgb24gQW5kcm9pZCwgYC0xYCBvbiBpT1MpLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLl91bmlmeU1vdGlvbkRhdGEgPSAocGxhdGZvcm0ub3MuZmFtaWx5ID09PSAnaU9TJykgPyAtMSA6IDE7XG5cbiAgICAvKipcbiAgICAgKiBVbmlmeWluZyBmYWN0b3Igb2YgdGhlIHBlcmlvZCAoYDFgIG9uIEFuZHJvaWQsIGAxYCBvbiBpT1MpLiBpbiBzZWNcbiAgICAgKiBAdG9kbyAtIHVuaWZ5IHdpdGggZS5pbnRlcnZhbCBzcGVjaWZpY2F0aW9uIChpbiBtcykgP1xuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLl91bmlmeVBlcmlvZCA9IChwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdBbmRyb2lkJykgPyAwLjAwMSA6IDE7XG5cbiAgICAvKipcbiAgICAgKiBBY2NlbGVyYXRpb24gY2FsY3VsYXRlZCBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogVGltZSBjb25zdGFudCAoaGFsZi1saWZlKSBvZiB0aGUgaGlnaC1wYXNzIGZpbHRlciB1c2VkIHRvIHNtb290aCB0aGUgYWNjZWxlcmF0aW9uIHZhbHVlcyBjYWxjdWxhdGVkIGZyb20gdGhlIGFjY2VsZXJhdGlvbiBpbmNsdWRpbmcgZ3Jhdml0eSByYXcgdmFsdWVzIChpbiBzZWNvbmRzKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgMC4xXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblRpbWVDb25zdGFudCA9IDAuMTtcblxuICAgIC8qKlxuICAgICAqIExhdGVzdCBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlLCB1c2VkIGluIHRoZSBoaWdoLXBhc3MgZmlsdGVyIHRvIGNhbGN1bGF0ZSB0aGUgYWNjZWxlcmF0aW9uIChpZiB0aGUgYGFjY2VsZXJhdGlvbmAgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgYCdkZXZpY2Vtb3Rpb24nYCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBSb3RhdGlvbiByYXRlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgb3JpZW50YXRpb24gdmFsdWVzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGUgPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBMYXRlc3Qgb3JpZW50YXRpb24gdmFsdWUsIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSByb3RhdGlvbiByYXRlICAoaWYgdGhlIGByb3RhdGlvblJhdGVgIHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IGAnZGV2aWNlbW90aW9uJ2ApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvbiA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIExhdGVzdCBvcmllbnRhdGlvbiB0aW1lc3RhbXBzLCB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgcm90YXRpb24gcmF0ZSAoaWYgdGhlIGByb3RhdGlvblJhdGVgIHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IGAnZGV2aWNlbW90aW9uJ2ApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblRpbWVzdGFtcCA9IG51bGw7XG5cbiAgICB0aGlzLl9wcm9jZXNzRnVuY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuX3Byb2Nlc3MgPSB0aGlzLl9wcm9jZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2sgPSB0aGlzLl9kZXZpY2Vtb3Rpb25DaGVjay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2RldmljZW1vdGlvbkxpc3RlbmVyID0gdGhpcy5fZGV2aWNlbW90aW9uTGlzdGVuZXIuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX2NoZWNrQ291bnRlciA9IDA7XG4gIH1cblxuICAvKipcbiAgICogRGVjYXkgZmFjdG9yIG9mIHRoZSBoaWdoLXBhc3MgZmlsdGVyIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBhY2NlbGVyYXRpb24gZnJvbSB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHJhdyB2YWx1ZXMuXG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IF9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uRGVjYXkoKSB7XG4gICAgcmV0dXJuIE1hdGguZXhwKC0yICogTWF0aC5QSSAqIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5wZXJpb2QgLyB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uVGltZUNvbnN0YW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5zb3IgY2hlY2sgb24gaW5pdGlhbGl6YXRpb24gb2YgdGhlIG1vZHVsZS5cbiAgICogVGhpcyBtZXRob2Q6XG4gICAqIC0gY2hlY2tzIHdoZXRoZXIgdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCwgdGhlIGBhY2NlbGVyYXRpb25gLFxuICAgKiAgIGFuZCB0aGUgYHJvdGF0aW9uUmF0ZWAgdmFsdWVzIGFyZSB2YWxpZCBvciBub3Q7XG4gICAqIC0gZ2V0cyB0aGUgcGVyaW9kIG9mIHRoZSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGFuZCBzZXRzIHRoZSBwZXJpb2Qgb2ZcbiAgICogICB0aGUgYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCBgQWNjZWxlcmF0aW9uYCwgYW5kIGBSb3RhdGlvblJhdGVgXG4gICAqICAgc3VibW9kdWxlcztcbiAgICogLSAoaW4gdGhlIGNhc2Ugd2hlcmUgYWNjZWxlcmF0aW9uIHJhdyB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZClcbiAgICogICBpbmRpY2F0ZXMgd2hldGhlciB0aGUgYWNjZWxlcmF0aW9uIGNhbiBiZSBjYWxjdWxhdGVkIGZyb20gdGhlXG4gICAqICAgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIFRoZSBmaXJzdCBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGNhdWdodC5cbiAgICovXG4gIF9kZXZpY2Vtb3Rpb25DaGVjayhlKSB7XG4gICAgLy8gY2xlYXIgdGltZW91dCAoYW50aS1GaXJlZm94IGJ1ZyBzb2x1dGlvbiwgd2luZG93IGV2ZW50IGRldmljZW9yaWVudGF0aW9uIGJlaW5nIG52ZXIgY2FsbGVkKVxuICAgIC8vIHNldCB0aGUgc2V0IHRpbWVvdXQgaW4gaW5pdCgpIGZ1bmN0aW9uXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2NoZWNrVGltZW91dElkKTtcblxuICAgIHRoaXMuaXNQcm92aWRlZCA9IHRydWU7XG4gICAgdGhpcy5wZXJpb2QgPSBlLmludGVydmFsIC8gMTAwMDtcbiAgICB0aGlzLmludGVydmFsID0gZS5pbnRlcnZhbDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHlcbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNQcm92aWRlZCA9IChcbiAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogPT09ICdudW1iZXInKVxuICAgICk7XG4gICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSBhY2NlbGVyYXRpb25cbiAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkID0gKFxuICAgICAgZS5hY2NlbGVyYXRpb24gJiZcbiAgICAgICh0eXBlb2YgZS5hY2NlbGVyYXRpb24ueCA9PT0gJ251bWJlcicpICYmXG4gICAgICAodHlwZW9mIGUuYWNjZWxlcmF0aW9uLnkgPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLmFjY2VsZXJhdGlvbi56ID09PSAnbnVtYmVyJylcbiAgICApO1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uLnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSByb3RhdGlvbiByYXRlXG4gICAgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZCA9IChcbiAgICAgIGUucm90YXRpb25SYXRlICYmXG4gICAgICAodHlwZW9mIGUucm90YXRpb25SYXRlLmFscGhhID09PSAnbnVtYmVyJykgJiZcbiAgICAgICh0eXBlb2YgZS5yb3RhdGlvblJhdGUuYmV0YSAgPT09ICdudW1iZXInKSAmJlxuICAgICAgKHR5cGVvZiBlLnJvdGF0aW9uUmF0ZS5nYW1tYSA9PT0gJ251bWJlcicpXG4gICAgKTtcbiAgICB0aGlzLnJvdGF0aW9uUmF0ZS5wZXJpb2QgPSBlLmludGVydmFsICogdGhpcy5fdW5pZnlQZXJpb2Q7XG5cbiAgICAvLyBpbiBmaXJlZm94IGFuZHJvaWQsIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgcmV0cmlldmUgbnVsbCB2YWx1ZXNcbiAgICAvLyBvbiB0aGUgZmlyc3QgY2FsbGJhY2suIHNvIHdhaXQgYSBzZWNvbmQgY2FsbCB0byBiZSBzdXJlLlxuICAgIGlmIChcbiAgICAgIHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ0FuZHJvaWQnICYmXG4gICAgICAvRmlyZWZveC8udGVzdChwbGF0Zm9ybS5uYW1lKSAmJlxuICAgICAgdGhpcy5fY2hlY2tDb3VudGVyIDwgMVxuICAgICkge1xuICAgICAgdGhpcy5fY2hlY2tDb3VudGVyKys7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5vdyB0aGF0IHRoZSBzZW5zb3JzIGFyZSBjaGVja2VkLCByZXBsYWNlIHRoZSBwcm9jZXNzIGZ1bmN0aW9uIHdpdGhcbiAgICAgIC8vIHRoZSBmaW5hbCBsaXN0ZW5lclxuICAgICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5fZGV2aWNlbW90aW9uTGlzdGVuZXI7XG5cbiAgICAgIC8vIGlmIGFjY2VsZXJhdGlvbiBpcyBub3QgcHJvdmlkZWQgYnkgcmF3IHNlbnNvcnMsIGluZGljYXRlIHdoZXRoZXIgaXRcbiAgICAgIC8vIGNhbiBiZSBjYWxjdWxhdGVkIHdpdGggYGFjY2VsZXJhdGlvbmluY2x1ZGluZ2dyYXZpdHlgIG9yIG5vdFxuICAgICAgaWYgKCF0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkKVxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc0NhbGN1bGF0ZWQgPSB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNQcm92aWRlZDtcblxuICAgICAgLy8gV0FSTklOR1xuICAgICAgLy8gVGhlIGxpbmVzIG9mIGNvZGUgYmVsb3cgYXJlIGNvbW1lbnRlZCBiZWNhdXNlIG9mIGEgYnVnIG9mIENocm9tZVxuICAgICAgLy8gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHdoZXJlICdkZXZpY2Vtb3Rpb24nIGV2ZW50cyBhcmUgbm90IHNlbnRcbiAgICAgIC8vIG9yIGNhdWdodCBpZiB0aGUgbGlzdGVuZXIgaXMgc2V0IHVwIGFmdGVyIGEgJ2RldmljZW9yaWVudGF0aW9uJ1xuICAgICAgLy8gbGlzdGVuZXIuIEhlcmUsIHRoZSBfdHJ5T3JpZW50YXRpb25GYWxsYmFjayBtZXRob2Qgd291bGQgYWRkIGFcbiAgICAgIC8vICdkZXZpY2VvcmllbnRhdGlvbicgbGlzdGVuZXIgYW5kIGJsb2NrIGFsbCBzdWJzZXF1ZW50ICdkZXZpY2Vtb3Rpb24nXG4gICAgICAvLyBldmVudHMgb24gdGhlc2UgZGV2aWNlcy4gQ29tbWVudHMgd2lsbCBiZSByZW1vdmVkIG9uY2UgdGhlIGJ1ZyBvZlxuICAgICAgLy8gQ2hyb21lIGlzIGNvcnJlY3RlZC5cblxuICAgICAgLy8gaWYgKHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlICYmICF0aGlzLnJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkKVxuICAgICAgLy8gICB0aGlzLl90cnlPcmllbnRhdGlvbkZhbGxiYWNrKCk7XG4gICAgICAvLyBlbHNlXG4gICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogYCdkZXZpY2Vtb3Rpb24nYCBldmVudCBjYWxsYmFjay5cbiAgICogVGhpcyBtZXRob2QgZW1pdHMgYW4gZXZlbnQgd2l0aCB0aGUgcmF3IGAnZGV2aWNlbW90aW9uJ2AgdmFsdWVzLCBhbmQgZW1pdHNcbiAgICogZXZlbnRzIHdpdGggdGhlIHVuaWZpZWQgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCBgYWNjZWxlcmF0aW9uYCxcbiAgICogYW5kIC8gb3IgYHJvdGF0aW9uUmF0ZWAgdmFsdWVzIGlmIHRoZXkgYXJlIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZGV2aWNlbW90aW9uTGlzdGVuZXIoZSkge1xuICAgIC8vICdkZXZpY2Vtb3Rpb24nIGV2ZW50IChyYXcgdmFsdWVzKVxuICAgIGlmICh0aGlzLmxpc3RlbmVycy5zaXplID4gMClcbiAgICAgIHRoaXMuX2VtaXREZXZpY2VNb3Rpb25FdmVudChlKTtcblxuICAgIC8vIGFsZXJ0KGAke3RoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5saXN0ZW5lcnMuc2l6ZX0gLVxuICAgIC8vICAgICAke3RoaXMucmVxdWlyZWQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eX0gLVxuICAgIC8vICAgICAke3RoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1ZhbGlkfVxuICAgIC8vIGApO1xuXG4gICAgLy8gJ2FjY2VsZXJhdGlvbicgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIGlmICh0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkubGlzdGVuZXJzLnNpemUgPiAwICYmXG4gICAgICAgIHRoaXMucmVxdWlyZWQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSAmJlxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZFxuICAgICkge1xuICAgICAgdGhpcy5fZW1pdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlFdmVudChlKTtcbiAgICB9XG5cbiAgICAvLyAnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIC8vIHRoZSBmYWxsYmFjayBjYWxjdWxhdGlvbiBvZiB0aGUgYWNjZWxlcmF0aW9uIGhhcHBlbnMgaW4gdGhlXG4gICAgLy8gIGBfZW1pdEFjY2VsZXJhdGlvbmAgbWV0aG9kLCBzbyB3ZSBjaGVjayBpZiB0aGlzLmFjY2VsZXJhdGlvbi5pc1ZhbGlkXG4gICAgaWYgKHRoaXMuYWNjZWxlcmF0aW9uLmxpc3RlbmVycy5zaXplID4gMCAmJlxuICAgICAgICB0aGlzLnJlcXVpcmVkLmFjY2VsZXJhdGlvbiAmJlxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbi5pc1ZhbGlkXG4gICAgKSB7XG4gICAgICB0aGlzLl9lbWl0QWNjZWxlcmF0aW9uRXZlbnQoZSk7XG4gICAgfVxuXG4gICAgLy8gJ3JvdGF0aW9uUmF0ZScgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIC8vIHRoZSBmYWxsYmFjayBjYWxjdWxhdGlvbiBvZiB0aGUgcm90YXRpb24gcmF0ZSBkb2VzIE5PVCBoYXBwZW4gaW4gdGhlXG4gICAgLy8gYF9lbWl0Um90YXRpb25SYXRlYCBtZXRob2QsIHNvIHdlIG9ubHkgY2hlY2sgaWYgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZFxuICAgIGlmICh0aGlzLnJvdGF0aW9uUmF0ZS5saXN0ZW5lcnMuc2l6ZSA+IDAgJiZcbiAgICAgICAgdGhpcy5yZXF1aXJlZC5yb3RhdGlvblJhdGUgJiZcbiAgICAgICAgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZFxuICAgICkge1xuICAgICAgdGhpcy5fZW1pdFJvdGF0aW9uUmF0ZUV2ZW50KGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYCdkZXZpY2Vtb3Rpb24nYCByYXcgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZW1pdERldmljZU1vdGlvbkV2ZW50KGUpIHtcbiAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLmV2ZW50O1xuXG4gICAgaWYgKGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSkge1xuICAgICAgb3V0RXZlbnRbMF0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueDtcbiAgICAgIG91dEV2ZW50WzFdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lnk7XG4gICAgICBvdXRFdmVudFsyXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56O1xuICAgIH1cblxuICAgIGlmIChlLmFjY2VsZXJhdGlvbikge1xuICAgICAgb3V0RXZlbnRbM10gPSBlLmFjY2VsZXJhdGlvbi54O1xuICAgICAgb3V0RXZlbnRbNF0gPSBlLmFjY2VsZXJhdGlvbi55O1xuICAgICAgb3V0RXZlbnRbNV0gPSBlLmFjY2VsZXJhdGlvbi56O1xuICAgIH1cblxuICAgIGlmIChlLnJvdGF0aW9uUmF0ZSkge1xuICAgICAgb3V0RXZlbnRbNl0gPSBlLnJvdGF0aW9uUmF0ZS5hbHBoYTtcbiAgICAgIG91dEV2ZW50WzddID0gZS5yb3RhdGlvblJhdGUuYmV0YTtcbiAgICAgIG91dEV2ZW50WzhdID0gZS5yb3RhdGlvblJhdGUuZ2FtbWE7XG4gICAgfVxuXG4gICAgdGhpcy5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZW1pdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlFdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmV2ZW50O1xuXG4gICAgb3V0RXZlbnRbMF0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICBvdXRFdmVudFsxXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuICAgIG91dEV2ZW50WzJdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG5cbiAgICB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuZW1pdChvdXRFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIGBhY2NlbGVyYXRpb25gIHVuaWZpZWQgdmFsdWVzLlxuICAgKiBXaGVuIHRoZSBgYWNjZWxlcmF0aW9uYCByYXcgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlLCB0aGUgbWV0aG9kXG4gICAqIGFsc28gY2FsY3VsYXRlcyB0aGUgYWNjZWxlcmF0aW9uIGZyb20gdGhlXG4gICAqIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gVGhlIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQuXG4gICAqL1xuICBfZW1pdEFjY2VsZXJhdGlvbkV2ZW50KGUpIHtcbiAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLmFjY2VsZXJhdGlvbi5ldmVudDtcblxuICAgIGlmICh0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkKSB7XG4gICAgICAvLyBJZiByYXcgYWNjZWxlcmF0aW9uIHZhbHVlcyBhcmUgcHJvdmlkZWRcbiAgICAgIG91dEV2ZW50WzBdID0gZS5hY2NlbGVyYXRpb24ueCAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICAgIG91dEV2ZW50WzFdID0gZS5hY2NlbGVyYXRpb24ueSAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICAgIG91dEV2ZW50WzJdID0gZS5hY2NlbGVyYXRpb24ueiAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1ZhbGlkKSB7XG4gICAgICAvLyBPdGhlcndpc2UsIGlmIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgdmFsdWVzIGFyZSBwcm92aWRlZCxcbiAgICAgIC8vIGVzdGltYXRlIHRoZSBhY2NlbGVyYXRpb24gd2l0aCBhIGhpZ2gtcGFzcyBmaWx0ZXJcbiAgICAgIGNvbnN0IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBbXG4gICAgICAgIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhLFxuICAgICAgICBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueSAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YSxcbiAgICAgICAgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogKiB0aGlzLl91bmlmeU1vdGlvbkRhdGFcbiAgICAgIF07XG4gICAgICBjb25zdCBrID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvbkRlY2F5O1xuXG4gICAgICAvLyBIaWdoLXBhc3MgZmlsdGVyIHRvIGVzdGltYXRlIHRoZSBhY2NlbGVyYXRpb24gKHdpdGhvdXQgdGhlIGdyYXZpdHkpXG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzBdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMF07XG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzFdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMV07XG4gICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzJdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMl07XG5cbiAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXTtcbiAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXTtcbiAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXTtcblxuICAgICAgb3V0RXZlbnRbMF0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzBdO1xuICAgICAgb3V0RXZlbnRbMV0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzFdO1xuICAgICAgb3V0RXZlbnRbMl0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzJdO1xuICAgIH1cblxuICAgIHRoaXMuYWNjZWxlcmF0aW9uLmVtaXQob3V0RXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBgcm90YXRpb25SYXRlYCB1bmlmaWVkIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2VtaXRSb3RhdGlvblJhdGVFdmVudChlKSB7XG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5yb3RhdGlvblJhdGUuZXZlbnQ7XG5cbiAgICAvLyBJbiBhbGwgcGxhdGZvcm1zLCByb3RhdGlvbiBheGVzIGFyZSBtZXNzZWQgdXAgYWNjb3JkaW5nIHRvIHRoZSBzcGVjXG4gICAgLy8gaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2RldmljZW9yaWVudGF0aW9uL3NwZWMtc291cmNlLW9yaWVudGF0aW9uLmh0bWxcbiAgICAvL1xuICAgIC8vIGdhbW1hIHNob3VsZCBiZSBhbHBoYVxuICAgIC8vIGFscGhhIHNob3VsZCBiZSBiZXRhXG4gICAgLy8gYmV0YSBzaG91bGQgYmUgZ2FtbWFcblxuICAgIG91dEV2ZW50WzBdID0gZS5yb3RhdGlvblJhdGUuZ2FtbWE7XG4gICAgb3V0RXZlbnRbMV0gPSBlLnJvdGF0aW9uUmF0ZS5hbHBoYSxcbiAgICBvdXRFdmVudFsyXSA9IGUucm90YXRpb25SYXRlLmJldGE7XG5cbiAgICAvLyBDaHJvbWUgQW5kcm9pZCByZXRyaWV2ZSB2YWx1ZXMgdGhhdCBhcmUgaW4gcmFkL3NcbiAgICAvLyBjZi4gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NTQxNjA3XG4gICAgLy9cbiAgICAvLyBGcm9tIHNwZWM6IFwiVGhlIHJvdGF0aW9uUmF0ZSBhdHRyaWJ1dGUgbXVzdCBiZSBpbml0aWFsaXplZCB3aXRoIHRoZSByYXRlXG4gICAgLy8gb2Ygcm90YXRpb24gb2YgdGhlIGhvc3RpbmcgZGV2aWNlIGluIHNwYWNlLiBJdCBtdXN0IGJlIGV4cHJlc3NlZCBhcyB0aGVcbiAgICAvLyByYXRlIG9mIGNoYW5nZSBvZiB0aGUgYW5nbGVzIGRlZmluZWQgaW4gc2VjdGlvbiA0LjEgYW5kIG11c3QgYmUgZXhwcmVzc2VkXG4gICAgLy8gaW4gZGVncmVlcyBwZXIgc2Vjb25kIChkZWcvcykuXCJcbiAgICAvL1xuICAgIC8vIGZpeGVkIHNpbmNlIENocm9tZSA2NVxuICAgIC8vIGNmLiBodHRwczovL2dpdGh1Yi5jb20vaW1tZXJzaXZlLXdlYi93ZWJ2ci1wb2x5ZmlsbC9pc3N1ZXMvMzA3XG4gICAgaWYgKFxuICAgICAgcGxhdGZvcm0ub3MuZmFtaWx5ID09PSAnQW5kcm9pZCcgJiZcbiAgICAgIGNocm9tZVJlZ0V4cC50ZXN0KHBsYXRmb3JtLm5hbWUpICYmXG4gICAgICBwYXJzZUludChwbGF0Zm9ybS52ZXJzaW9uLnNwbGl0KCcuJylbMF0pIDwgNjVcbiAgICApIHtcbiAgICAgIG91dEV2ZW50WzBdICo9IHRvRGVnO1xuICAgICAgb3V0RXZlbnRbMV0gKj0gdG9EZWcsXG4gICAgICBvdXRFdmVudFsyXSAqPSB0b0RlZztcbiAgICB9XG5cbiAgICB0aGlzLnJvdGF0aW9uUmF0ZS5lbWl0KG91dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGFuZCBlbWl0cyB0aGUgYHJvdGF0aW9uUmF0ZWAgdW5pZmllZCB2YWx1ZXMgZnJvbSB0aGUgYG9yaWVudGF0aW9uYCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyW119IG9yaWVudGF0aW9uIC0gTGF0ZXN0IGBvcmllbnRhdGlvbmAgcmF3IHZhbHVlcy5cbiAgICovXG4gIF9jYWxjdWxhdGVSb3RhdGlvblJhdGVGcm9tT3JpZW50YXRpb24ob3JpZW50YXRpb24pIHtcbiAgICBjb25zdCBub3cgPSBnZXRMb2NhbFRpbWUoKTtcbiAgICBjb25zdCBrID0gMC44OyAvLyBUT0RPOiBpbXByb3ZlIGxvdyBwYXNzIGZpbHRlciAoZnJhbWVzIGFyZSBub3QgcmVndWxhcilcbiAgICBjb25zdCBhbHBoYUlzVmFsaWQgPSAodHlwZW9mIG9yaWVudGF0aW9uWzBdID09PSAnbnVtYmVyJyk7XG5cbiAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wKSB7XG4gICAgICBsZXQgckFscGhhID0gbnVsbDtcbiAgICAgIGxldCByQmV0YTtcbiAgICAgIGxldCByR2FtbWE7XG5cbiAgICAgIGxldCBhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAwO1xuICAgICAgbGV0IGJldGFEaXNjb250aW51aXR5RmFjdG9yID0gMDtcbiAgICAgIGxldCBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAwO1xuXG4gICAgICBjb25zdCBkZWx0YVQgPSBub3cgLSB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXA7XG5cbiAgICAgIGlmIChhbHBoYUlzVmFsaWQpIHtcbiAgICAgICAgLy8gYWxwaGEgZGlzY29udGludWl0eSAoKzM2MCAtPiAwIG9yIDAgLT4gKzM2MClcbiAgICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSA+IDMyMCAmJiBvcmllbnRhdGlvblswXSA8IDQwKVxuICAgICAgICAgIGFscGhhRGlzY29udGludWl0eUZhY3RvciA9IDM2MDtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdIDwgNDAgJiYgb3JpZW50YXRpb25bMF0gPiAzMjApXG4gICAgICAgICAgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yID0gLTM2MDtcbiAgICAgIH1cblxuICAgICAgLy8gYmV0YSBkaXNjb250aW51aXR5ICgrMTgwIC0+IC0xODAgb3IgLTE4MCAtPiArMTgwKVxuICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSA+IDE0MCAmJiBvcmllbnRhdGlvblsxXSA8IC0xNDApXG4gICAgICAgIGJldGFEaXNjb250aW51aXR5RmFjdG9yID0gMzYwO1xuICAgICAgZWxzZSBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzFdIDwgLTE0MCAmJiBvcmllbnRhdGlvblsxXSA+IDE0MClcbiAgICAgICAgYmV0YURpc2NvbnRpbnVpdHlGYWN0b3IgPSAtMzYwO1xuXG4gICAgICAvLyBnYW1tYSBkaXNjb250aW51aXRpZXMgKCsxODAgLT4gLTE4MCBvciAtMTgwIC0+ICsxODApXG4gICAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdID4gNTAgJiYgb3JpZW50YXRpb25bMl0gPCAtNTApXG4gICAgICAgIGdhbW1hRGlzY29udGludWl0eUZhY3RvciA9IDE4MDtcbiAgICAgIGVsc2UgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSA8IC01MCAmJiBvcmllbnRhdGlvblsyXSA+IDUwKVxuICAgICAgICBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAtMTgwO1xuXG4gICAgICBpZiAoZGVsdGFUID4gMCkge1xuICAgICAgICAvLyBMb3cgcGFzcyBmaWx0ZXIgdG8gc21vb3RoIHRoZSBkYXRhXG4gICAgICAgIGlmIChhbHBoYUlzVmFsaWQpXG4gICAgICAgICAgckFscGhhID0gayAqIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMF0gKyAoMSAtIGspICogKG9yaWVudGF0aW9uWzBdIC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdICsgYWxwaGFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcblxuICAgICAgICByQmV0YSA9IGsgKiB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzFdICsgKDEgLSBrKSAqIChvcmllbnRhdGlvblsxXSAtIHRoaXMuX2xhc3RPcmllbnRhdGlvblsxXSArIGJldGFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcbiAgICAgICAgckdhbW1hID0gayAqIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMl0gKyAoMSAtIGspICogKG9yaWVudGF0aW9uWzJdIC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdICsgZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcblxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzBdID0gckFscGhhO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlWzFdID0gckJldGE7XG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMl0gPSByR2FtbWE7XG4gICAgICB9XG5cbiAgICAgIC8vIFRPRE86IHJlc2FtcGxlIHRoZSBlbWlzc2lvbiByYXRlIHRvIG1hdGNoIHRoZSBkZXZpY2Vtb3Rpb24gcmF0ZVxuICAgICAgdGhpcy5yb3RhdGlvblJhdGUuZW1pdCh0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlKTtcbiAgICB9XG5cbiAgICB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXAgPSBub3c7XG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdID0gb3JpZW50YXRpb25bMF07XG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzFdID0gb3JpZW50YXRpb25bMV07XG4gICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdID0gb3JpZW50YXRpb25bMl07XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHJvdGF0aW9uIHJhdGUgY2FuIGJlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYG9yaWVudGF0aW9uYCB2YWx1ZXMgb3Igbm90LlxuICAgKlxuICAgKiBAdG9kbyAtIHRoaXMgc2hvdWxkIGJlIHJldmlld2VkIHRvIGNvbXBseSB3aXRoIHRoZSBheGlzIG9yZGVyIGRlZmluZWRcbiAgICogIGluIHRoZSBzcGVjXG4gICAqL1xuICAvLyBXQVJOSU5HXG4gIC8vIFRoZSBsaW5lcyBvZiBjb2RlIGJlbG93IGFyZSBjb21tZW50ZWQgYmVjYXVzZSBvZiBhIGJ1ZyBvZiBDaHJvbWVcbiAgLy8gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHdoZXJlICdkZXZpY2Vtb3Rpb24nIGV2ZW50cyBhcmUgbm90IHNlbnRcbiAgLy8gb3IgY2F1Z2h0IGlmIHRoZSBsaXN0ZW5lciBpcyBzZXQgdXAgYWZ0ZXIgYSAnZGV2aWNlb3JpZW50YXRpb24nXG4gIC8vIGxpc3RlbmVyLiBIZXJlLCB0aGUgX3RyeU9yaWVudGF0aW9uRmFsbGJhY2sgbWV0aG9kIHdvdWxkIGFkZCBhXG4gIC8vICdkZXZpY2VvcmllbnRhdGlvbicgbGlzdGVuZXIgYW5kIGJsb2NrIGFsbCBzdWJzZXF1ZW50ICdkZXZpY2Vtb3Rpb24nXG4gIC8vIGV2ZW50cyBvbiB0aGVzZSBkZXZpY2VzLiBDb21tZW50cyB3aWxsIGJlIHJlbW92ZWQgb25jZSB0aGUgYnVnIG9mXG4gIC8vIENocm9tZSBpcyBjb3JyZWN0ZWQuXG4gIC8vIF90cnlPcmllbnRhdGlvbkZhbGxiYWNrKCkge1xuICAvLyAgIE1vdGlvbklucHV0LnJlcXVpcmVNb2R1bGUoJ29yaWVudGF0aW9uJylcbiAgLy8gICAgIC50aGVuKChvcmllbnRhdGlvbikgPT4ge1xuICAvLyAgICAgICBpZiAob3JpZW50YXRpb24uaXNWYWxpZCkge1xuICAvLyAgICAgICAgIGNvbnNvbGUubG9nKGBcbiAgLy8gICAgICAgICAgIFdBUk5JTkcgKG1vdGlvbi1pbnB1dCk6IFRoZSAnZGV2aWNlbW90aW9uJyBldmVudCBkb2VzIG5vdCBleGlzdHMgb3JcbiAgLy8gICAgICAgICAgIGRvZXMgbm90IHByb3ZpZGUgcm90YXRpb24gcmF0ZSB2YWx1ZXMgaW4geW91ciBicm93c2VyLCBzbyB0aGUgcm90YXRpb25cbiAgLy8gICAgICAgICAgIHJhdGUgb2YgdGhlIGRldmljZSBpcyBlc3RpbWF0ZWQgZnJvbSB0aGUgJ29yaWVudGF0aW9uJywgY2FsY3VsYXRlZFxuICAvLyAgICAgICAgICAgZnJvbSB0aGUgJ2RldmljZW9yaWVudGF0aW9uJyBldmVudC4gU2luY2UgdGhlIGNvbXBhc3MgbWlnaHQgbm90XG4gIC8vICAgICAgICAgICBiZSBhdmFpbGFibGUsIG9ubHkgXFxgYmV0YVxcYCBhbmQgXFxgZ2FtbWFcXGAgYW5nbGVzIG1heSBiZSBwcm92aWRlZFxuICAvLyAgICAgICAgICAgKFxcYGFscGhhXFxgIHdvdWxkIGJlIG51bGwpLmBcbiAgLy8gICAgICAgICApO1xuXG4gIC8vICAgICAgICAgdGhpcy5yb3RhdGlvblJhdGUuaXNDYWxjdWxhdGVkID0gdHJ1ZTtcblxuICAvLyAgICAgICAgIE1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdvcmllbnRhdGlvbicsIChvcmllbnRhdGlvbikgPT4ge1xuICAvLyAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlUm90YXRpb25SYXRlRnJvbU9yaWVudGF0aW9uKG9yaWVudGF0aW9uKTtcbiAgLy8gICAgICAgICB9KTtcbiAgLy8gICAgICAgfVxuXG4gIC8vICAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlKHRoaXMpO1xuICAvLyAgICAgfSk7XG4gIC8vIH1cblxuICBfcHJvY2VzcyhkYXRhKSB7XG4gICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uKGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIG9mIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEByZXR1cm4ge3Byb21pc2V9XG4gICAqL1xuICBpbml0KCkge1xuICAgIHJldHVybiBzdXBlci5pbml0KChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSA9IHJlc29sdmU7XG5cbiAgICAgIGlmICh3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQpIHtcbiAgICAgICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5fZGV2aWNlbW90aW9uQ2hlY2s7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCB0aGlzLl9wcm9jZXNzKTtcblxuICAgICAgICAvLyBzZXQgZmFsbGJhY2sgdGltZW91dCBmb3IgRmlyZWZveCBkZXNrdG9wIChpdHMgd2luZG93IG5ldmVyIGNhbGxpbmcgdGhlIERldmljZU9yaWVudGF0aW9uIGV2ZW50LCBhXG4gICAgICAgIC8vIHJlcXVpcmUgb2YgdGhlIERldmljZU9yaWVudGF0aW9uIHNlcnZpY2Ugd2lsbCByZXN1bHQgaW4gdGhlIHJlcXVpcmUgcHJvbWlzZSBuZXZlciBiZWluZyByZXNvbHZlZFxuICAgICAgICAvLyBoZW5jZSB0aGUgRXhwZXJpbWVudCBzdGFydCgpIG1ldGhvZCBuZXZlciBjYWxsZWQpXG4gICAgICAgIC8vID4gbm90ZSAwMi8wMi8yMDE4OiB0aGlzIHNlZW1zIHRvIGNyZWF0ZSBwcm9ibGVtcyB3aXRoIGlwb2RzIHRoYXRcbiAgICAgICAgLy8gZG9uJ3QgaGF2ZSBlbm91Z2ggdGltZSB0byBzdGFydCAoc29tZXRpbWVzKSwgaGVuY2UgY3JlYXRpbmcgZmFsc2VcbiAgICAgICAgLy8gbmVnYXRpdmUuIFNvIHdlIG9ubHkgYXBwbHkgdG8gRmlyZWZveCBkZXNrdG9wIGFuZCBwdXQgYSByZWFsbHlcbiAgICAgICAgLy8gbGFyZ2UgdmFsdWUgKDRzZWMpIGp1c3QgaW4gY2FzZS5cbiAgICAgICAgaWYgKHBsYXRmb3JtLm5hbWUgPT09ICdGaXJlZm94JyAmJlxuICAgICAgICAgIHBsYXRmb3JtLm9zLmZhbWlseSAhPT0gJ0FuZHJvaWQnICYmXG4gICAgICAgICAgcGxhdGZvcm0ub3MuZmFtaWx5ICE9PSAnaU9TJ1xuICAgICAgICApIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ1ttb3Rpb24taW5wdXRdIHJlZ2lzdGVyIHRpbWVyIGZvciBGaXJlZm94IGRlc2t0b3AnKTtcbiAgICAgICAgICB0aGlzLl9jaGVja1RpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZSh0aGlzKSwgNCAqIDEwMDApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFdBUk5JTkdcbiAgICAgIC8vIFRoZSBsaW5lcyBvZiBjb2RlIGJlbG93IGFyZSBjb21tZW50ZWQgYmVjYXVzZSBvZiBhIGJ1ZyBvZiBDaHJvbWVcbiAgICAgIC8vIG9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzLCB3aGVyZSAnZGV2aWNlbW90aW9uJyBldmVudHMgYXJlIG5vdCBzZW50XG4gICAgICAvLyBvciBjYXVnaHQgaWYgdGhlIGxpc3RlbmVyIGlzIHNldCB1cCBhZnRlciBhICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAgIC8vIGxpc3RlbmVyLiBIZXJlLCB0aGUgX3RyeU9yaWVudGF0aW9uRmFsbGJhY2sgbWV0aG9kIHdvdWxkIGFkZCBhXG4gICAgICAvLyAnZGV2aWNlb3JpZW50YXRpb24nIGxpc3RlbmVyIGFuZCBibG9jayBhbGwgc3Vic2VxdWVudCAnZGV2aWNlbW90aW9uJ1xuICAgICAgLy8gZXZlbnRzIG9uIHRoZXNlIGRldmljZXMuIENvbW1lbnRzIHdpbGwgYmUgcmVtb3ZlZCBvbmNlIHRoZSBidWcgb2ZcbiAgICAgIC8vIENocm9tZSBpcyBjb3JyZWN0ZWQuXG5cbiAgICAgIC8vIGVsc2UgaWYgKHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlKVxuICAgICAgLy8gdGhpcy5fdHJ5T3JpZW50YXRpb25GYWxsYmFjaygpO1xuXG4gICAgICBlbHNlXG4gICAgICAgIHJlc29sdmUodGhpcyk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IERldmljZU1vdGlvbk1vZHVsZSgpO1xuIiwiaW1wb3J0IERPTUV2ZW50U3VibW9kdWxlIGZyb20gJy4vRE9NRXZlbnRTdWJtb2R1bGUnO1xuaW1wb3J0IElucHV0TW9kdWxlIGZyb20gJy4vSW5wdXRNb2R1bGUnO1xuaW1wb3J0IE1vdGlvbklucHV0IGZyb20gJy4vTW90aW9uSW5wdXQnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJ3BsYXRmb3JtJztcblxuLyoqXG4gKiBDb252ZXJ0cyBkZWdyZWVzIHRvIHJhZGlhbnMuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGRlZyAtIEFuZ2xlIGluIGRlZ3JlZXMuXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGRlZ1RvUmFkKGRlZykge1xuICByZXR1cm4gZGVnICogTWF0aC5QSSAvIDE4MDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyByYWRpYW5zIHRvIGRlZ3JlZXMuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHJhZCAtIEFuZ2xlIGluIHJhZGlhbnMuXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIHJhZFRvRGVnKHJhZCkge1xuICByZXR1cm4gcmFkICogMTgwIC8gTWF0aC5QSTtcbn1cblxuLyoqXG4gKiBOb3JtYWxpemVzIGEgMyB4IDMgbWF0cml4LlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyW119IG0gLSBNYXRyaXggdG8gbm9ybWFsaXplLCByZXByZXNlbnRlZCBieSBhbiBhcnJheSBvZiBsZW5ndGggOS5cbiAqIEByZXR1cm4ge251bWJlcltdfVxuICovXG5mdW5jdGlvbiBub3JtYWxpemUobSkge1xuICBjb25zdCBkZXQgPSBtWzBdICogbVs0XSAqIG1bOF0gKyBtWzFdICogbVs1XSAqIG1bNl0gKyBtWzJdICogbVszXSAqIG1bN10gLSBtWzBdICogbVs1XSAqIG1bN10gLSBtWzFdICogbVszXSAqIG1bOF0gLSBtWzJdICogbVs0XSAqIG1bNl07XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSsrKVxuICAgIG1baV0gLz0gZGV0O1xuXG4gIHJldHVybiBtO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgRXVsZXIgYW5nbGUgYFthbHBoYSwgYmV0YSwgZ2FtbWFdYCB0byB0aGUgVzNDIHNwZWNpZmljYXRpb24sIHdoZXJlOlxuICogLSBgYWxwaGFgIGlzIGluIFswOyArMzYwWztcbiAqIC0gYGJldGFgIGlzIGluIFstMTgwOyArMTgwWztcbiAqIC0gYGdhbW1hYCBpcyBpbiBbLTkwOyArOTBbLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyW119IGV1bGVyQW5nbGUgLSBFdWxlciBhbmdsZSB0byB1bmlmeSwgcmVwcmVzZW50ZWQgYnkgYW4gYXJyYXkgb2YgbGVuZ3RoIDMgKGBbYWxwaGEsIGJldGEsIGdhbW1hXWApLlxuICogQHNlZSB7QGxpbmsgaHR0cDovL3d3dy53My5vcmcvVFIvb3JpZW50YXRpb24tZXZlbnQvfVxuICovXG5mdW5jdGlvbiB1bmlmeShldWxlckFuZ2xlKSB7XG4gIC8vIENmLiBXM0Mgc3BlY2lmaWNhdGlvbiAoaHR0cDovL3czYy5naXRodWIuaW8vZGV2aWNlb3JpZW50YXRpb24vc3BlYy1zb3VyY2Utb3JpZW50YXRpb24uaHRtbClcbiAgLy8gYW5kIEV1bGVyIGFuZ2xlcyBXaWtpcGVkaWEgcGFnZSAoaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FdWxlcl9hbmdsZXMpLlxuICAvL1xuICAvLyBXM0MgY29udmVudGlvbjogVGFpdOKAk0JyeWFuIGFuZ2xlcyBaLVgnLVknJywgd2hlcmU6XG4gIC8vICAgYWxwaGEgaXMgaW4gWzA7ICszNjBbLFxuICAvLyAgIGJldGEgaXMgaW4gWy0xODA7ICsxODBbLFxuICAvLyAgIGdhbW1hIGlzIGluIFstOTA7ICs5MFsuXG5cbiAgY29uc3QgYWxwaGFJc1ZhbGlkID0gKHR5cGVvZiBldWxlckFuZ2xlWzBdID09PSAnbnVtYmVyJyk7XG5cbiAgY29uc3QgX2FscGhhID0gKGFscGhhSXNWYWxpZCA/IGRlZ1RvUmFkKGV1bGVyQW5nbGVbMF0pIDogMCk7XG4gIGNvbnN0IF9iZXRhID0gZGVnVG9SYWQoZXVsZXJBbmdsZVsxXSk7XG4gIGNvbnN0IF9nYW1tYSA9IGRlZ1RvUmFkKGV1bGVyQW5nbGVbMl0pO1xuXG4gIGNvbnN0IGNBID0gTWF0aC5jb3MoX2FscGhhKTtcbiAgY29uc3QgY0IgPSBNYXRoLmNvcyhfYmV0YSk7XG4gIGNvbnN0IGNHID0gTWF0aC5jb3MoX2dhbW1hKTtcbiAgY29uc3Qgc0EgPSBNYXRoLnNpbihfYWxwaGEpO1xuICBjb25zdCBzQiA9IE1hdGguc2luKF9iZXRhKTtcbiAgY29uc3Qgc0cgPSBNYXRoLnNpbihfZ2FtbWEpO1xuXG4gIGxldCBhbHBoYSwgYmV0YSwgZ2FtbWE7XG5cbiAgbGV0IG0gPSBbXG4gICAgY0EgKiBjRyAtIHNBICogc0IgKiBzRyxcbiAgICAtY0IgKiBzQSxcbiAgICBjQSAqIHNHICsgY0cgKiBzQSAqIHNCLFxuICAgIGNHICogc0EgKyBjQSAqIHNCICogc0csXG4gICAgY0EgKiBjQixcbiAgICBzQSAqIHNHIC0gY0EgKiBjRyAqIHNCLFxuICAgIC1jQiAqIHNHLFxuICAgIHNCLFxuICAgIGNCICogY0dcbiAgXTtcbiAgbm9ybWFsaXplKG0pO1xuXG4gIC8vIFNpbmNlIHdlIHdhbnQgZ2FtbWEgaW4gWy05MDsgKzkwWywgY0cgPj0gMC5cbiAgaWYgKG1bOF0gPiAwKSB7XG4gICAgLy8gQ2FzZSAxOiBtWzhdID4gMCA8PT4gY0IgPiAwICAgICAgICAgICAgICAgICAoYW5kIGNHICE9IDApXG4gICAgLy8gICAgICAgICAgICAgICAgICA8PT4gYmV0YSBpbiBdLXBpLzI7ICtwaS8yWyAoYW5kIGNHICE9IDApXG4gICAgYWxwaGEgPSBNYXRoLmF0YW4yKC1tWzFdLCBtWzRdKTtcbiAgICBiZXRhID0gTWF0aC5hc2luKG1bN10pOyAvLyBhc2luIHJldHVybnMgYSBudW1iZXIgYmV0d2VlbiAtcGkvMiBhbmQgK3BpLzIgPT4gT0tcbiAgICBnYW1tYSA9IE1hdGguYXRhbjIoLW1bNl0sIG1bOF0pO1xuICB9IGVsc2UgaWYgKG1bOF0gPCAwKSB7XG4gICAgLy8gQ2FzZSAyOiBtWzhdIDwgMCA8PT4gY0IgPCAwICAgICAgICAgICAgICAgICAgICAgICAgICAgIChhbmQgY0cgIT0gMClcbiAgICAvLyAgICAgICAgICAgICAgICAgIDw9PiBiZXRhIGluIFstcGk7IC1waS8yWyBVIF0rcGkvMjsgK3BpXSAoYW5kIGNHICE9IDApXG5cbiAgICAvLyBTaW5jZSBjQiA8IDAgYW5kIGNCIGlzIGluIG1bMV0gYW5kIG1bNF0sIHRoZSBwb2ludCBpcyBmbGlwcGVkIGJ5IDE4MCBkZWdyZWVzLlxuICAgIC8vIEhlbmNlLCB3ZSBoYXZlIHRvIG11bHRpcGx5IGJvdGggYXJndW1lbnRzIG9mIGF0YW4yIGJ5IC0xIGluIG9yZGVyIHRvIHJldmVydFxuICAgIC8vIHRoZSBwb2ludCBpbiBpdHMgb3JpZ2luYWwgcG9zaXRpb24gKD0+IGFub3RoZXIgZmxpcCBieSAxODAgZGVncmVlcykuXG4gICAgYWxwaGEgPSBNYXRoLmF0YW4yKG1bMV0sIC1tWzRdKTtcbiAgICBiZXRhID0gLU1hdGguYXNpbihtWzddKTtcbiAgICBiZXRhICs9IChiZXRhID49IDApID8gLU1hdGguUEkgOiBNYXRoLlBJOyAvLyBhc2luIHJldHVybnMgYSBudW1iZXIgYmV0d2VlbiAtcGkvMiBhbmQgcGkvMiA9PiBtYWtlIHN1cmUgYmV0YSBpbiBbLXBpOyAtcGkvMlsgVSBdK3BpLzI7ICtwaV1cbiAgICBnYW1tYSA9IE1hdGguYXRhbjIobVs2XSwgLW1bOF0pOyAvLyBzYW1lIHJlbWFyayBhcyBmb3IgYWxwaGEsIG11bHRpcGxpY2F0aW9uIGJ5IC0xXG4gIH0gZWxzZSB7XG4gICAgLy8gQ2FzZSAzOiBtWzhdID0gMCA8PT4gY0IgPSAwIG9yIGNHID0gMFxuICAgIGlmIChtWzZdID4gMCkge1xuICAgICAgLy8gU3ViY2FzZSAxOiBjRyA9IDAgYW5kIGNCID4gMFxuICAgICAgLy8gICAgICAgICAgICBjRyA9IDAgPD0+IHNHID0gLTEgPD0+IGdhbW1hID0gLXBpLzIgPT4gbVs2XSA9IGNCXG4gICAgICAvLyAgICAgICAgICAgIEhlbmNlLCBtWzZdID4gMCA8PT4gY0IgPiAwIDw9PiBiZXRhIGluIF0tcGkvMjsgK3BpLzJbXG4gICAgICBhbHBoYSA9IE1hdGguYXRhbjIoLW1bMV0sIG1bNF0pO1xuICAgICAgYmV0YSA9IE1hdGguYXNpbihtWzddKTsgLy8gYXNpbiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpLzIgYW5kICtwaS8yID0+IE9LXG4gICAgICBnYW1tYSA9IC1NYXRoLlBJIC8gMjtcbiAgICB9IGVsc2UgaWYgKG1bNl0gPCAwKSB7XG4gICAgICAvLyBTdWJjYXNlIDI6IGNHID0gMCBhbmQgY0IgPCAwXG4gICAgICAvLyAgICAgICAgICAgIGNHID0gMCA8PT4gc0cgPSAtMSA8PT4gZ2FtbWEgPSAtcGkvMiA9PiBtWzZdID0gY0JcbiAgICAgIC8vICAgICAgICAgICAgSGVuY2UsIG1bNl0gPCAwIDw9PiBjQiA8IDAgPD0+IGJldGEgaW4gWy1waTsgLXBpLzJbIFUgXStwaS8yOyArcGldXG4gICAgICBhbHBoYSA9IE1hdGguYXRhbjIobVsxXSwgLW1bNF0pOyAvLyBzYW1lIHJlbWFyayBhcyBmb3IgYWxwaGEgaW4gYSBjYXNlIGFib3ZlXG4gICAgICBiZXRhID0gLU1hdGguYXNpbihtWzddKTtcbiAgICAgIGJldGEgKz0gKGJldGEgPj0gMCkgPyAtTWF0aC5QSSA6IE1hdGguUEk7IC8vIGFzaW4gcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waS8yIGFuZCArcGkvMiA9PiBtYWtlIHN1cmUgYmV0YSBpbiBbLXBpOyAtcGkvMlsgVSBdK3BpLzI7ICtwaV1cbiAgICAgIGdhbW1hID0gLU1hdGguUEkgLyAyO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTdWJjYXNlIDM6IGNCID0gMFxuICAgICAgLy8gSW4gdGhlIGNhc2Ugd2hlcmUgY29zKGJldGEpID0gMCAoaS5lLiBiZXRhID0gLXBpLzIgb3IgYmV0YSA9IHBpLzIpLFxuICAgICAgLy8gd2UgaGF2ZSB0aGUgZ2ltYmFsIGxvY2sgcHJvYmxlbTogaW4gdGhhdCBjb25maWd1cmF0aW9uLCBvbmx5IHRoZSBhbmdsZVxuICAgICAgLy8gYWxwaGEgKyBnYW1tYSAoaWYgYmV0YSA9ICtwaS8yKSBvciBhbHBoYSAtIGdhbW1hIChpZiBiZXRhID0gLXBpLzIpXG4gICAgICAvLyBhcmUgdW5pcXVlbHkgZGVmaW5lZDogYWxwaGEgYW5kIGdhbW1hIGNhbiB0YWtlIGFuIGluZmluaXR5IG9mIHZhbHVlcy5cbiAgICAgIC8vIEZvciBjb252ZW5pZW5jZSwgbGV0J3Mgc2V0IGdhbW1hID0gMCAoYW5kIHRodXMgc2luKGdhbW1hKSA9IDApLlxuICAgICAgLy8gKEFzIGEgY29uc2VxdWVuY2Ugb2YgdGhlIGdpbWJhbCBsb2NrIHByb2JsZW0sIHRoZXJlIGlzIGEgZGlzY29udGludWl0eVxuICAgICAgLy8gaW4gYWxwaGEgYW5kIGdhbW1hLilcbiAgICAgIGFscGhhID0gTWF0aC5hdGFuMihtWzNdLCBtWzBdKTtcbiAgICAgIGJldGEgPSAobVs3XSA+IDApID8gTWF0aC5QSSAvIDIgOiAtTWF0aC5QSSAvIDI7XG4gICAgICBnYW1tYSA9IDA7XG4gICAgfVxuICB9XG5cbiAgLy8gYXRhbjIgcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waSBhbmQgcGkgPT4gbWFrZSBzdXJlIHRoYXQgYWxwaGEgaXMgaW4gWzAsIDIqcGlbLlxuICBhbHBoYSArPSAoYWxwaGEgPCAwKSA/IDIgKiBNYXRoLlBJIDogMDtcblxuICBldWxlckFuZ2xlWzBdID0gKGFscGhhSXNWYWxpZCA/IHJhZFRvRGVnKGFscGhhKSA6IG51bGwpO1xuICBldWxlckFuZ2xlWzFdID0gcmFkVG9EZWcoYmV0YSk7XG4gIGV1bGVyQW5nbGVbMl0gPSByYWRUb0RlZyhnYW1tYSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBFdWxlciBhbmdsZSBgW2FscGhhLCBiZXRhLCBnYW1tYV1gIHRvIGEgRXVsZXIgYW5nbGUgd2hlcmU6XG4gKiAtIGBhbHBoYWAgaXMgaW4gWzA7ICszNjBbO1xuICogLSBgYmV0YWAgaXMgaW4gWy05MDsgKzkwWztcbiAqIC0gYGdhbW1hYCBpcyBpbiBbLTE4MDsgKzE4MFsuXG4gKlxuICogQHBhcmFtIHtudW1iZXJbXX0gZXVsZXJBbmdsZSAtIEV1bGVyIGFuZ2xlIHRvIGNvbnZlcnQsIHJlcHJlc2VudGVkIGJ5IGFuIGFycmF5IG9mIGxlbmd0aCAzIChgW2FscGhhLCBiZXRhLCBnYW1tYV1gKS5cbiAqL1xuZnVuY3Rpb24gdW5pZnlBbHQoZXVsZXJBbmdsZSkge1xuICAvLyBDb252ZW50aW9uIGhlcmU6IFRhaXTigJNCcnlhbiBhbmdsZXMgWi1YJy1ZJycsIHdoZXJlOlxuICAvLyAgIGFscGhhIGlzIGluIFswOyArMzYwWyxcbiAgLy8gICBiZXRhIGlzIGluIFstOTA7ICs5MFssXG4gIC8vICAgZ2FtbWEgaXMgaW4gWy0xODA7ICsxODBbLlxuXG4gIGNvbnN0IGFscGhhSXNWYWxpZCA9ICh0eXBlb2YgZXVsZXJBbmdsZVswXSA9PT0gJ251bWJlcicpO1xuXG4gIGNvbnN0IF9hbHBoYSA9IChhbHBoYUlzVmFsaWQgPyBkZWdUb1JhZChldWxlckFuZ2xlWzBdKSA6IDApO1xuICBjb25zdCBfYmV0YSA9IGRlZ1RvUmFkKGV1bGVyQW5nbGVbMV0pO1xuICBjb25zdCBfZ2FtbWEgPSBkZWdUb1JhZChldWxlckFuZ2xlWzJdKTtcblxuICBjb25zdCBjQSA9IE1hdGguY29zKF9hbHBoYSk7XG4gIGNvbnN0IGNCID0gTWF0aC5jb3MoX2JldGEpO1xuICBjb25zdCBjRyA9IE1hdGguY29zKF9nYW1tYSk7XG4gIGNvbnN0IHNBID0gTWF0aC5zaW4oX2FscGhhKTtcbiAgY29uc3Qgc0IgPSBNYXRoLnNpbihfYmV0YSk7XG4gIGNvbnN0IHNHID0gTWF0aC5zaW4oX2dhbW1hKTtcblxuICBsZXQgYWxwaGEsIGJldGEsIGdhbW1hO1xuXG4gIGxldCBtID0gW1xuICAgIGNBICogY0cgLSBzQSAqIHNCICogc0csXG4gICAgLWNCICogc0EsXG4gICAgY0EgKiBzRyArIGNHICogc0EgKiBzQixcbiAgICBjRyAqIHNBICsgY0EgKiBzQiAqIHNHLFxuICAgIGNBICogY0IsXG4gICAgc0EgKiBzRyAtIGNBICogY0cgKiBzQixcbiAgICAtY0IgKiBzRyxcbiAgICBzQixcbiAgICBjQiAqIGNHXG4gIF07XG4gIG5vcm1hbGl6ZShtKTtcblxuICBhbHBoYSA9IE1hdGguYXRhbjIoLW1bMV0sIG1bNF0pO1xuICBhbHBoYSArPSAoYWxwaGEgPCAwKSA/IDIgKiBNYXRoLlBJIDogMDsgLy8gYXRhbjIgcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waSBhbmQgK3BpID0+IG1ha2Ugc3VyZSBhbHBoYSBpcyBpbiBbMCwgMipwaVsuXG4gIGJldGEgPSBNYXRoLmFzaW4obVs3XSk7IC8vIGFzaW4gcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waS8yIGFuZCBwaS8yID0+IE9LXG4gIGdhbW1hID0gTWF0aC5hdGFuMigtbVs2XSwgbVs4XSk7IC8vIGF0YW4yIHJldHVybnMgYSBudW1iZXIgYmV0d2VlbiAtcGkgYW5kICtwaSA9PiBPS1xuXG4gIGV1bGVyQW5nbGVbMF0gPSAoYWxwaGFJc1ZhbGlkID8gcmFkVG9EZWcoYWxwaGEpIDogbnVsbCk7XG4gIGV1bGVyQW5nbGVbMV0gPSByYWRUb0RlZyhiZXRhKTtcbiAgZXVsZXJBbmdsZVsyXSA9IHJhZFRvRGVnKGdhbW1hKTtcbn1cblxuLyoqXG4gKiBgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVgIHNpbmdsZXRvbi5cbiAqIFRoZSBgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVgIHNpbmdsZXRvbiBwcm92aWRlcyB0aGUgcmF3IHZhbHVlc1xuICogb2YgdGhlIG9yaWVudGF0aW9uIHByb3ZpZGVkIGJ5IHRoZSBgRGV2aWNlTW90aW9uYCBldmVudC5cbiAqIEl0IGFsc28gaW5zdGFudGlhdGUgdGhlIGBPcmllbnRhdGlvbmAgc3VibW9kdWxlIHRoYXQgdW5pZmllcyB0aG9zZVxuICogdmFsdWVzIGFjcm9zcyBwbGF0Zm9ybXMgYnkgbWFraW5nIHRoZW0gY29tcGxpYW50IHdpdGgge0BsaW5rXG4gKiBodHRwOi8vd3d3LnczLm9yZy9UUi9vcmllbnRhdGlvbi1ldmVudC98dGhlIFczQyBzdGFuZGFyZH0gKCppLmUuKlxuICogdGhlIGBhbHBoYWAgYW5nbGUgYmV0d2VlbiBgMGAgYW5kIGAzNjBgIGRlZ3JlZXMsIHRoZSBgYmV0YWAgYW5nbGVcbiAqIGJldHdlZW4gYC0xODBgIGFuZCBgMTgwYCBkZWdyZWVzLCBhbmQgYGdhbW1hYCBiZXR3ZWVuIGAtOTBgIGFuZFxuICogYDkwYCBkZWdyZWVzKSwgYXMgd2VsbCBhcyB0aGUgYE9yaWVudGF0aW9uQWx0YCBzdWJtb2R1bGVzICh3aXRoXG4gKiB0aGUgYGFscGhhYCBhbmdsZSBiZXR3ZWVuIGAwYCBhbmQgYDM2MGAgZGVncmVlcywgdGhlIGBiZXRhYCBhbmdsZVxuICogYmV0d2VlbiBgLTkwYCBhbmQgYDkwYCBkZWdyZWVzLCBhbmQgYGdhbW1hYCBiZXR3ZWVuIGAtMTgwYCBhbmRcbiAqIGAxODBgIGRlZ3JlZXMpLlxuICogV2hlbiB0aGUgYG9yaWVudGF0aW9uYCByYXcgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgdGhlIHNlbnNvcnMsXG4gKiB0aGlzIG1vZHVsZXMgdHJpZXMgdG8gcmVjYWxjdWxhdGUgYGJldGFgIGFuZCBgZ2FtbWFgIGZyb20gdGhlXG4gKiBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgbW9kdWxlLCBpZiBhdmFpbGFibGUgKGluIHRoYXQgY2FzZSxcbiAqIHRoZSBgYWxwaGFgIGFuZ2xlIGlzIGltcG9zc2libGUgdG8gcmV0cmlldmUgc2luY2UgdGhlIGNvbXBhc3MgaXNcbiAqIG5vdCBhdmFpbGFibGUpLlxuICpcbiAqIEBjbGFzcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAqIEBleHRlbmRzIElucHV0TW9kdWxlXG4gKi9cbmNsYXNzIERldmljZU9yaWVudGF0aW9uTW9kdWxlIGV4dGVuZHMgSW5wdXRNb2R1bGUge1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBgRGV2aWNlT3JpZW50YXRpb25gIG1vZHVsZSBpbnN0YW5jZS5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignZGV2aWNlb3JpZW50YXRpb24nKTtcblxuICAgIC8qKlxuICAgICAqIFJhdyB2YWx1ZXMgY29taW5nIGZyb20gdGhlIGBkZXZpY2VvcmllbnRhdGlvbmAgZXZlbnQgc2VudCBieSB0aGlzIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFtudWxsLCBudWxsLCBudWxsXVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnQgPSBbbnVsbCwgbnVsbCwgbnVsbF07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYE9yaWVudGF0aW9uYCBtb2R1bGUuXG4gICAgICogUHJvdmlkZXMgdW5pZmllZCB2YWx1ZXMgb2YgdGhlIG9yaWVudGF0aW9uIGNvbXBsaWFudCB3aXRoIHtAbGlua1xuICAgICAqIGh0dHA6Ly93d3cudzMub3JnL1RSL29yaWVudGF0aW9uLWV2ZW50L3x0aGUgVzNDIHN0YW5kYXJkfVxuICAgICAqIChgYWxwaGFgIGluIGBbMCwgMzYwXWAsIGJldGEgaW4gYFstMTgwLCArMTgwXWAsIGBnYW1tYWAgaW4gYFstOTAsICs5MF1gKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBuZXcgRE9NRXZlbnRTdWJtb2R1bGUodGhpcywgJ29yaWVudGF0aW9uJyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYE9yaWVudGF0aW9uQWx0YCBtb2R1bGUuXG4gICAgICogUHJvdmlkZXMgYWx0ZXJuYXRpdmUgdmFsdWVzIG9mIHRoZSBvcmllbnRhdGlvblxuICAgICAqIChgYWxwaGFgIGluIGBbMCwgMzYwXWAsIGJldGEgaW4gYFstOTAsICs5MF1gLCBgZ2FtbWFgIGluIGBbLTE4MCwgKzE4MF1gKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIHRoaXMub3JpZW50YXRpb25BbHQgPSBuZXcgRE9NRXZlbnRTdWJtb2R1bGUodGhpcywgJ29yaWVudGF0aW9uQWx0Jyk7XG5cbiAgICAvKipcbiAgICAgKiBSZXF1aXJlZCBzdWJtb2R1bGVzIC8gZXZlbnRzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gb3JpZW50YXRpb24gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYG9yaWVudGF0aW9uYCB1bmlmaWVkIHZhbHVlcyBhcmUgcmVxdWlyZWQgb3Igbm90IChkZWZhdWx0cyB0byBgZmFsc2VgKS5cbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IG9yaWVudGF0aW9uQWx0IC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGBvcmllbnRhdGlvbkFsdGAgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqL1xuICAgIHRoaXMucmVxdWlyZWQgPSB7XG4gICAgICBvcmllbnRhdGlvbjogZmFsc2UsXG4gICAgICBvcmllbnRhdGlvbkFsdDogZmFsc2VcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZSBmdW5jdGlvbiBvZiB0aGUgbW9kdWxlJ3MgcHJvbWlzZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKiBAc2VlIERldmljZU9yaWVudGF0aW9uTW9kdWxlI2luaXRcbiAgICAgKi9cbiAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBHcmF2aXR5IHZlY3RvciBjYWxjdWxhdGVkIGZyb20gdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2VzdGltYXRlZEdyYXZpdHkgPSBbMCwgMCwgMF07XG5cbiAgICB0aGlzLl9wcm9jZXNzRnVuY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuX3Byb2Nlc3MgPSB0aGlzLl9wcm9jZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZGV2aWNlb3JpZW50YXRpb25DaGVjayA9IHRoaXMuX2RldmljZW9yaWVudGF0aW9uQ2hlY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLl9kZXZpY2VvcmllbnRhdGlvbkxpc3RlbmVyID0gdGhpcy5fZGV2aWNlb3JpZW50YXRpb25MaXN0ZW5lci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbnNvciBjaGVjayBvbiBpbml0aWFsaXphdGlvbiBvZiB0aGUgbW9kdWxlLlxuICAgKiBUaGlzIG1ldGhvZDpcbiAgICogLSBjaGVja3Mgd2hldGhlciB0aGUgYG9yaWVudGF0aW9uYCB2YWx1ZXMgYXJlIHZhbGlkIG9yIG5vdDtcbiAgICogLSAoaW4gdGhlIGNhc2Ugd2hlcmUgb3JpZW50YXRpb24gcmF3IHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkKVxuICAgKiAgIHRyaWVzIHRvIGNhbGN1bGF0ZSB0aGUgb3JpZW50YXRpb24gZnJvbSB0aGVcbiAgICogICBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBGaXJzdCBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGNhdWdodCwgb24gd2hpY2ggdGhlIGNoZWNrIGlzIGRvbmUuXG4gICAqL1xuICBfZGV2aWNlb3JpZW50YXRpb25DaGVjayhlKSB7XG4gICAgLy8gY2xlYXIgdGltZW91dCAoYW50aS1GaXJlZm94IGJ1ZyBzb2x1dGlvbiwgd2luZG93IGV2ZW50IGRldmljZW9yaWVudGF0aW9uIGJlaW5nIG52ZXIgY2FsbGVkKVxuICAgIC8vIHNldCB0aGUgc2V0IHRpbWVvdXQgaW4gaW5pdCgpIGZ1bmN0aW9uXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2NoZWNrVGltZW91dElkKTtcblxuICAgIHRoaXMuaXNQcm92aWRlZCA9IHRydWU7XG5cbiAgICAvLyBTZW5zb3IgYXZhaWxhYmlsaXR5IGZvciB0aGUgb3JpZW50YXRpb24gYW5kIGFsdGVybmF0aXZlIG9yaWVudGF0aW9uXG4gICAgY29uc3QgcmF3VmFsdWVzUHJvdmlkZWQgPSAoKHR5cGVvZiBlLmFscGhhID09PSAnbnVtYmVyJykgJiYgKHR5cGVvZiBlLmJldGEgPT09ICdudW1iZXInKSAmJiAodHlwZW9mIGUuZ2FtbWEgPT09ICdudW1iZXInKSk7XG4gICAgdGhpcy5vcmllbnRhdGlvbi5pc1Byb3ZpZGVkID0gcmF3VmFsdWVzUHJvdmlkZWQ7XG4gICAgdGhpcy5vcmllbnRhdGlvbkFsdC5pc1Byb3ZpZGVkID0gcmF3VmFsdWVzUHJvdmlkZWQ7XG5cbiAgICAvLyBUT0RPKD8pOiBnZXQgcHNldWRvLXBlcmlvZFxuXG4gICAgLy8gc3dhcCB0aGUgcHJvY2VzcyBmdW5jdGlvbiB0byB0aGVcbiAgICB0aGlzLl9wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLl9kZXZpY2VvcmllbnRhdGlvbkxpc3RlbmVyO1xuXG4gICAgLy8gSWYgb3JpZW50YXRpb24gb3IgYWx0ZXJuYXRpdmUgb3JpZW50YXRpb24gYXJlIG5vdCBwcm92aWRlZCBieSByYXcgc2Vuc29ycyBidXQgcmVxdWlyZWQsXG4gICAgLy8gdHJ5IHRvIGNhbGN1bGF0ZSB0aGVtIHdpdGggYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzXG4gICAgaWYgKCh0aGlzLnJlcXVpcmVkLm9yaWVudGF0aW9uICYmICF0aGlzLm9yaWVudGF0aW9uLmlzUHJvdmlkZWQpIHx8ICh0aGlzLnJlcXVpcmVkLm9yaWVudGF0aW9uQWx0ICYmICF0aGlzLm9yaWVudGF0aW9uQWx0LmlzUHJvdmlkZWQpKVxuICAgICAgdGhpcy5fdHJ5QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eUZhbGxiYWNrKCk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcHJvbWlzZVJlc29sdmUodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogYCdkZXZpY2VvcmllbnRhdGlvbidgIGV2ZW50IGNhbGxiYWNrLlxuICAgKiBUaGlzIG1ldGhvZCBlbWl0cyBhbiBldmVudCB3aXRoIHRoZSByYXcgYCdkZXZpY2VvcmllbnRhdGlvbidgIHZhbHVlcyxcbiAgICogYW5kIGVtaXRzIGV2ZW50cyB3aXRoIHRoZSB1bmlmaWVkIGBvcmllbnRhdGlvbmAgYW5kIC8gb3IgdGhlXG4gICAqIGBvcmllbnRhdGlvbkFsdGAgdmFsdWVzIGlmIHRoZXkgYXJlIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU9yaWVudGF0aW9uRXZlbnR9IGUgLSBgJ2RldmljZW9yaWVudGF0aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2RldmljZW9yaWVudGF0aW9uTGlzdGVuZXIoZSkge1xuICAgIC8vICdkZXZpY2VvcmllbnRhdGlvbicgZXZlbnQgKHJhdyB2YWx1ZXMpXG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5ldmVudDtcblxuICAgIG91dEV2ZW50WzBdID0gZS5hbHBoYTtcbiAgICBvdXRFdmVudFsxXSA9IGUuYmV0YTtcbiAgICBvdXRFdmVudFsyXSA9IGUuZ2FtbWE7XG5cbiAgICBpZiAodGhpcy5saXN0ZW5lcnMuc2l6ZSA+IDApXG4gICAgICB0aGlzLmVtaXQob3V0RXZlbnQpO1xuXG4gICAgLy8gJ29yaWVudGF0aW9uJyBldmVudCAodW5pZmllZCB2YWx1ZXMpXG4gICAgaWYgKHRoaXMub3JpZW50YXRpb24ubGlzdGVuZXJzLnNpemUgPiAwICYmXG4gICAgICAgIHRoaXMucmVxdWlyZWQub3JpZW50YXRpb24gJiZcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbi5pc1Byb3ZpZGVkXG4gICAgKSB7XG4gICAgICAvLyBPbiBpT1MsIHRoZSBgYWxwaGFgIHZhbHVlIGlzIGluaXRpYWxpemVkIGF0IGAwYCBvbiB0aGUgZmlyc3QgYGRldmljZW9yaWVudGF0aW9uYCBldmVudFxuICAgICAgLy8gc28gd2Uga2VlcCB0aGF0IHJlZmVyZW5jZSBpbiBtZW1vcnkgdG8gY2FsY3VsYXRlIHRoZSBOb3J0aCBsYXRlciBvblxuICAgICAgaWYgKCF0aGlzLm9yaWVudGF0aW9uLl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSAmJiBlLndlYmtpdENvbXBhc3NIZWFkaW5nICYmIHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycpXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24uX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlID0gZS53ZWJraXRDb21wYXNzSGVhZGluZztcblxuICAgICAgbGV0IG91dEV2ZW50ID0gdGhpcy5vcmllbnRhdGlvbi5ldmVudDtcblxuICAgICAgb3V0RXZlbnRbMF0gPSBlLmFscGhhO1xuICAgICAgb3V0RXZlbnRbMV0gPSBlLmJldGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGUuZ2FtbWE7XG5cbiAgICAgIC8vIE9uIGlPUywgcmVwbGFjZSB0aGUgYGFscGhhYCB2YWx1ZSBieSB0aGUgTm9ydGggdmFsdWUgYW5kIHVuaWZ5IHRoZSBhbmdsZXNcbiAgICAgIC8vICh0aGUgZGVmYXVsdCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYW5nbGVzIG9uIGlPUyBpcyBub3QgY29tcGxpYW50IHdpdGggdGhlIFczQyBzcGVjaWZpY2F0aW9uKVxuICAgICAgaWYgKHRoaXMub3JpZW50YXRpb24uX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlICYmIHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycpIHtcbiAgICAgICAgb3V0RXZlbnRbMF0gKz0gMzYwIC0gdGhpcy5vcmllbnRhdGlvbi5fd2Via2l0Q29tcGFzc0hlYWRpbmdSZWZlcmVuY2U7XG4gICAgICAgIHVuaWZ5KG91dEV2ZW50KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcmllbnRhdGlvbi5lbWl0KG91dEV2ZW50KTtcbiAgICB9XG5cbiAgICAvLyAnb3JpZW50YXRpb25BbHQnIGV2ZW50XG4gICAgaWYgKHRoaXMub3JpZW50YXRpb25BbHQubGlzdGVuZXJzLnNpemUgPiAwICYmXG4gICAgICAgIHRoaXMucmVxdWlyZWQub3JpZW50YXRpb25BbHQgJiZcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbkFsdC5pc1Byb3ZpZGVkXG4gICAgKSB7XG4gICAgICAvLyBPbiBpT1MsIHRoZSBgYWxwaGFgIHZhbHVlIGlzIGluaXRpYWxpemVkIGF0IGAwYCBvbiB0aGUgZmlyc3QgYGRldmljZW9yaWVudGF0aW9uYCBldmVudFxuICAgICAgLy8gc28gd2Uga2VlcCB0aGF0IHJlZmVyZW5jZSBpbiBtZW1vcnkgdG8gY2FsY3VsYXRlIHRoZSBOb3J0aCBsYXRlciBvblxuICAgICAgaWYgKCF0aGlzLm9yaWVudGF0aW9uQWx0Ll93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSAmJiBlLndlYmtpdENvbXBhc3NIZWFkaW5nICYmIHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycpXG4gICAgICAgIHRoaXMub3JpZW50YXRpb25BbHQuX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlID0gZS53ZWJraXRDb21wYXNzSGVhZGluZztcblxuICAgICAgbGV0IG91dEV2ZW50ID0gdGhpcy5vcmllbnRhdGlvbkFsdC5ldmVudDtcblxuICAgICAgb3V0RXZlbnRbMF0gPSBlLmFscGhhO1xuICAgICAgb3V0RXZlbnRbMV0gPSBlLmJldGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGUuZ2FtbWE7XG5cbiAgICAgIC8vIE9uIGlPUywgcmVwbGFjZSB0aGUgYGFscGhhYCB2YWx1ZSBieSB0aGUgTm9ydGggdmFsdWUgYnV0IGRvIG5vdCBjb252ZXJ0IHRoZSBhbmdsZXNcbiAgICAgIC8vICh0aGUgZGVmYXVsdCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYW5nbGVzIG9uIGlPUyBpcyBjb21wbGlhbnQgd2l0aCB0aGUgYWx0ZXJuYXRpdmUgcmVwcmVzZW50YXRpb24pXG4gICAgICBpZiAodGhpcy5vcmllbnRhdGlvbkFsdC5fd2Via2l0Q29tcGFzc0hlYWRpbmdSZWZlcmVuY2UgJiYgcGxhdGZvcm0ub3MuZmFtaWx5ID09PSAnaU9TJyl7XG4gICAgICAgIG91dEV2ZW50WzBdIC09IHRoaXMub3JpZW50YXRpb25BbHQuX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlO1xuICAgICAgICBvdXRFdmVudFswXSArPSAob3V0RXZlbnRbMF0gPCAwKSA/IDM2MCA6IDA7IC8vIG1ha2Ugc3VyZSBgYWxwaGFgIGlzIGluIFswLCArMzYwW1xuICAgICAgfVxuXG4gICAgICAvLyBPbiBBbmRyb2lkLCB0cmFuc2Zvcm0gdGhlIGFuZ2xlcyB0byB0aGUgYWx0ZXJuYXRpdmUgcmVwcmVzZW50YXRpb25cbiAgICAgIC8vICh0aGUgZGVmYXVsdCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYW5nbGVzIG9uIEFuZHJvaWQgaXMgY29tcGxpYW50IHdpdGggdGhlIFczQyBzcGVjaWZpY2F0aW9uKVxuICAgICAgaWYgKHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ0FuZHJvaWQnKVxuICAgICAgICB1bmlmeUFsdChvdXRFdmVudCk7XG5cbiAgICAgIHRoaXMub3JpZW50YXRpb25BbHQuZW1pdChvdXRFdmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIGBiZXRhYCBhbmQgYGdhbW1hYCBjYW4gYmUgY2FsY3VsYXRlZCBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdmFsdWVzIG9yIG5vdC5cbiAgICovXG4gIF90cnlBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RmFsbGJhY2soKSB7XG4gICAgTW90aW9uSW5wdXQucmVxdWlyZU1vZHVsZSgnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScpXG4gICAgICAudGhlbigoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSkgPT4ge1xuICAgICAgICBpZiAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1ZhbGlkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJXQVJOSU5HIChtb3Rpb24taW5wdXQpOiBUaGUgJ2RldmljZW9yaWVudGF0aW9uJyBldmVudCBkb2VzIG5vdCBleGlzdCBvciBkb2VzIG5vdCBwcm92aWRlIHZhbHVlcyBpbiB5b3VyIGJyb3dzZXIsIHNvIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgZGV2aWNlIGlzIGVzdGltYXRlZCBmcm9tIERldmljZU1vdGlvbidzICdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JyBldmVudC4gU2luY2UgdGhlIGNvbXBhc3MgaXMgbm90IGF2YWlsYWJsZSwgb25seSB0aGUgYGJldGFgIGFuZCBgZ2FtbWFgIGFuZ2xlcyBhcmUgcHJvdmlkZWQgKGBhbHBoYWAgaXMgbnVsbCkuXCIpO1xuXG4gICAgICAgICAgaWYgKHRoaXMucmVxdWlyZWQub3JpZW50YXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMub3JpZW50YXRpb24uaXNDYWxjdWxhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMub3JpZW50YXRpb24ucGVyaW9kID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5wZXJpb2Q7XG5cbiAgICAgICAgICAgIE1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JywgKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlQmV0YUFuZEdhbW1hRnJvbUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5yZXF1aXJlZC5vcmllbnRhdGlvbkFsdCkge1xuICAgICAgICAgICAgdGhpcy5vcmllbnRhdGlvbkFsdC5pc0NhbGN1bGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vcmllbnRhdGlvbkFsdC5wZXJpb2QgPSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnBlcmlvZDtcblxuICAgICAgICAgICAgTW90aW9uSW5wdXQuYWRkTGlzdGVuZXIoJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknLCAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVCZXRhQW5kR2FtbWFGcm9tQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eShhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LCB0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlKHRoaXMpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBhbmQgZW1pdHMgYGJldGFgIGFuZCBgZ2FtbWFgIHZhbHVlcyBhcyBhIGZhbGxiYWNrIG9mIHRoZSBgb3JpZW50YXRpb25gIGFuZCAvIG9yIGBvcmllbnRhdGlvbkFsdGAgZXZlbnRzLCBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyW119IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgLSBMYXRlc3QgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgcmF3IHZhbHVlcy5cbiAgICogQHBhcmFtIHtib29sfSBbYWx0PWZhbHNlXSAtIEluZGljYXRlcyB3aGV0aGVyIHdlIG5lZWQgdGhlIGFsdGVybmF0ZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgYW5nbGVzIG9yIG5vdC5cbiAgICovXG4gIF9jYWxjdWxhdGVCZXRhQW5kR2FtbWFGcm9tQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eShhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LCBhbHQgPSBmYWxzZSkge1xuICAgIGNvbnN0IGsgPSAwLjg7XG5cbiAgICAvLyBMb3cgcGFzcyBmaWx0ZXIgdG8gZXN0aW1hdGUgdGhlIGdyYXZpdHlcbiAgICB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzBdID0gayAqIHRoaXMuX2VzdGltYXRlZEdyYXZpdHlbMF0gKyAoMSAtIGspICogYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXTtcbiAgICB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzFdID0gayAqIHRoaXMuX2VzdGltYXRlZEdyYXZpdHlbMV0gKyAoMSAtIGspICogYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXTtcbiAgICB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzJdID0gayAqIHRoaXMuX2VzdGltYXRlZEdyYXZpdHlbMl0gKyAoMSAtIGspICogYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXTtcblxuICAgIGxldCBfZ1ggPSB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzBdO1xuICAgIGxldCBfZ1kgPSB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzFdO1xuICAgIGxldCBfZ1ogPSB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzJdO1xuXG4gICAgY29uc3Qgbm9ybSA9IE1hdGguc3FydChfZ1ggKiBfZ1ggKyBfZ1kgKiBfZ1kgKyBfZ1ogKiBfZ1opO1xuXG4gICAgX2dYIC89IG5vcm07XG4gICAgX2dZIC89IG5vcm07XG4gICAgX2daIC89IG5vcm07XG5cbiAgICAvLyBBZG9wdGluZyB0aGUgZm9sbG93aW5nIGNvbnZlbnRpb25zOlxuICAgIC8vIC0gZWFjaCBtYXRyaXggb3BlcmF0ZXMgYnkgcHJlLW11bHRpcGx5aW5nIGNvbHVtbiB2ZWN0b3JzLFxuICAgIC8vIC0gZWFjaCBtYXRyaXggcmVwcmVzZW50cyBhbiBhY3RpdmUgcm90YXRpb24sXG4gICAgLy8gLSBlYWNoIG1hdHJpeCByZXByZXNlbnRzIHRoZSBjb21wb3NpdGlvbiBvZiBpbnRyaW5zaWMgcm90YXRpb25zLFxuICAgIC8vIHRoZSByb3RhdGlvbiBtYXRyaXggcmVwcmVzZW50aW5nIHRoZSBjb21wb3NpdGlvbiBvZiBhIHJvdGF0aW9uXG4gICAgLy8gYWJvdXQgdGhlIHgtYXhpcyBieSBhbiBhbmdsZSBiZXRhIGFuZCBhIHJvdGF0aW9uIGFib3V0IHRoZSB5LWF4aXNcbiAgICAvLyBieSBhbiBhbmdsZSBnYW1tYSBpczpcbiAgICAvL1xuICAgIC8vIFsgY29zKGdhbW1hKSAgICAgICAgICAgICAgICwgIDAgICAgICAgICAgLCAgc2luKGdhbW1hKSAgICAgICAgICAgICAgLFxuICAgIC8vICAgc2luKGJldGEpICogc2luKGdhbW1hKSAgICwgIGNvcyhiZXRhKSAgLCAgLWNvcyhnYW1tYSkgKiBzaW4oYmV0YSkgLFxuICAgIC8vICAgLWNvcyhiZXRhKSAqIHNpbihnYW1tYSkgICwgIHNpbihiZXRhKSAgLCAgY29zKGJldGEpICogY29zKGdhbW1hKSAgXS5cbiAgICAvL1xuICAgIC8vIEhlbmNlLCB0aGUgcHJvamVjdGlvbiBvZiB0aGUgbm9ybWFsaXplZCBncmF2aXR5IGcgPSBbMCwgMCwgMV1cbiAgICAvLyBpbiB0aGUgZGV2aWNlJ3MgcmVmZXJlbmNlIGZyYW1lIGNvcnJlc3BvbmRzIHRvOlxuICAgIC8vXG4gICAgLy8gZ1ggPSAtY29zKGJldGEpICogc2luKGdhbW1hKSxcbiAgICAvLyBnWSA9IHNpbihiZXRhKSxcbiAgICAvLyBnWiA9IGNvcyhiZXRhKSAqIGNvcyhnYW1tYSksXG4gICAgLy9cbiAgICAvLyBzbyBiZXRhID0gYXNpbihnWSkgYW5kIGdhbW1hID0gYXRhbjIoLWdYLCBnWikuXG5cbiAgICAvLyBCZXRhICYgZ2FtbWEgZXF1YXRpb25zICh3ZSBhcHByb3hpbWF0ZSBbZ1gsIGdZLCBnWl0gYnkgW19nWCwgX2dZLCBfZ1pdKVxuICAgIGxldCBiZXRhID0gcmFkVG9EZWcoTWF0aC5hc2luKF9nWSkpOyAvLyBiZXRhIGlzIGluIFstcGkvMjsgcGkvMltcbiAgICBsZXQgZ2FtbWEgPSByYWRUb0RlZyhNYXRoLmF0YW4yKC1fZ1gsIF9nWikpOyAvLyBnYW1tYSBpcyBpbiBbLXBpOyBwaVtcblxuICAgIGlmIChhbHQpIHtcbiAgICAgIC8vIEluIHRoYXQgY2FzZSwgdGhlcmUgaXMgbm90aGluZyB0byBkbyBzaW5jZSB0aGUgY2FsY3VsYXRpb25zIGFib3ZlIGdhdmUgdGhlIGFuZ2xlIGluIHRoZSByaWdodCByYW5nZXNcbiAgICAgIGxldCBvdXRFdmVudCA9IHRoaXMub3JpZW50YXRpb25BbHQuZXZlbnQ7XG4gICAgICBvdXRFdmVudFswXSA9IG51bGw7XG4gICAgICBvdXRFdmVudFsxXSA9IGJldGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGdhbW1hO1xuXG4gICAgICB0aGlzLm9yaWVudGF0aW9uQWx0LmVtaXQob3V0RXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBIZXJlIHdlIGhhdmUgdG8gdW5pZnkgdGhlIGFuZ2xlcyB0byBnZXQgdGhlIHJhbmdlcyBjb21wbGlhbnQgd2l0aCB0aGUgVzNDIHNwZWNpZmljYXRpb25cbiAgICAgIGxldCBvdXRFdmVudCA9IHRoaXMub3JpZW50YXRpb24uZXZlbnQ7XG4gICAgICBvdXRFdmVudFswXSA9IG51bGw7XG4gICAgICBvdXRFdmVudFsxXSA9IGJldGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGdhbW1hO1xuICAgICAgdW5pZnkob3V0RXZlbnQpO1xuXG4gICAgICB0aGlzLm9yaWVudGF0aW9uLmVtaXQob3V0RXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIF9wcm9jZXNzKGRhdGEpIHtcbiAgICB0aGlzLl9wcm9jZXNzRnVuY3Rpb24oZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgb2YgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIHN1cGVyLmluaXQoKHJlc29sdmUpID0+IHtcbiAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlID0gcmVzb2x2ZTtcblxuICAgICAgaWYgKHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50KSB7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NGdW5jdGlvbiA9IHRoaXMuX2RldmljZW9yaWVudGF0aW9uQ2hlY2s7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIHRoaXMuX3Byb2Nlc3MsIGZhbHNlKTtcbiAgICAgICAgLy8gc2V0IGZhbGxiYWNrIHRpbWVvdXQgZm9yIEZpcmVmb3ggKGl0cyB3aW5kb3cgbmV2ZXIgY2FsbGluZyB0aGUgRGV2aWNlT3JpZW50YXRpb24gZXZlbnQsIGEgXG4gICAgICAgIC8vIHJlcXVpcmUgb2YgdGhlIERldmljZU9yaWVudGF0aW9uIHNlcnZpY2Ugd2lsbCByZXN1bHQgaW4gdGhlIHJlcXVpcmUgcHJvbWlzZSBuZXZlciBiZWluZyByZXNvbHZlZFxuICAgICAgICAvLyBoZW5jZSB0aGUgRXhwZXJpbWVudCBzdGFydCgpIG1ldGhvZCBuZXZlciBjYWxsZWQpXG4gICAgICAgIHRoaXMuX2NoZWNrVGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiByZXNvbHZlKHRoaXMpLCA1MDApO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnJlcXVpcmVkLm9yaWVudGF0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyeUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlGYWxsYmFjaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGUoKTtcbiIsImltcG9ydCBJbnB1dE1vZHVsZSBmcm9tICcuL0lucHV0TW9kdWxlJztcbmltcG9ydCBtb3Rpb25JbnB1dCBmcm9tICcuL01vdGlvbklucHV0JztcblxuLyoqXG4gKiBFbmVyZ3kgbW9kdWxlIHNpbmdsZXRvbi5cbiAqIFRoZSBlbmVyZ3kgbW9kdWxlIHNpbmdsZXRvbiBwcm92aWRlcyBlbmVyZ3kgdmFsdWVzIChiZXR3ZWVuIDAgYW5kIDEpXG4gKiBiYXNlZCBvbiB0aGUgYWNjZWxlcmF0aW9uIGFuZCB0aGUgcm90YXRpb24gcmF0ZSBvZiB0aGUgZGV2aWNlLlxuICogVGhlIHBlcmlvZCBvZiB0aGUgZW5lcmd5IHZhbHVlcyBpcyB0aGUgc2FtZSBhcyB0aGUgcGVyaW9kIG9mIHRoZVxuICogYWNjZWxlcmF0aW9uIGFuZCB0aGUgcm90YXRpb24gcmF0ZSB2YWx1ZXMuXG4gKlxuICogQGNsYXNzIEVuZXJneU1vZHVsZVxuICogQGV4dGVuZHMgSW5wdXRNb2R1bGVcbiAqL1xuY2xhc3MgRW5lcmd5TW9kdWxlIGV4dGVuZHMgSW5wdXRNb2R1bGUge1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBlbmVyZ3kgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCdlbmVyZ3knKTtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGNvbnRhaW5pbmcgdGhlIHZhbHVlIG9mIHRoZSBlbmVyZ3ksIHNlbnQgYnkgdGhlIGVuZXJneSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50ID0gMDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhY2NlbGVyYXRpb24gbW9kdWxlLCB1c2VkIGluIHRoZSBjYWxjdWxhdGlvbiBvZiB0aGUgZW5lcmd5LlxuICAgICAqXG4gICAgICogQHRoaXMgRW5lcmd5TW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKiBAc2VlIERldmljZW1vdGlvbk1vZHVsZVxuICAgICAqL1xuICAgIHRoaXMuX2FjY2VsZXJhdGlvbk1vZHVsZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBMYXRlc3QgYWNjZWxlcmF0aW9uIHZhbHVlIHNlbnQgYnkgdGhlIGFjY2VsZXJhdGlvbiBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIHRoaXMuX2FjY2VsZXJhdGlvblZhbHVlcyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIHZhbHVlIHJlYWNoZWQgYnkgdGhlIGFjY2VsZXJhdGlvbiBtYWduaXR1ZGUsIGNsaXBwZWQgYXQgYHRoaXMuX2FjY2VsZXJhdGlvbk1hZ25pdHVkZVRocmVzaG9sZGAuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDkuODFcbiAgICAgKi9cbiAgICB0aGlzLl9hY2NlbGVyYXRpb25NYWduaXR1ZGVDdXJyZW50TWF4ID0gMSAqIDkuODE7XG5cbiAgICAvKipcbiAgICAgKiBDbGlwcGluZyB2YWx1ZSBvZiB0aGUgYWNjZWxlcmF0aW9uIG1hZ25pdHVkZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgMjBcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICB0aGlzLl9hY2NlbGVyYXRpb25NYWduaXR1ZGVUaHJlc2hvbGQgPSA0ICogOS44MTtcblxuICAgIC8qKlxuICAgICAqIFRoZSByb3RhdGlvbiByYXRlIG1vZHVsZSwgdXNlZCBpbiB0aGUgY2FsY3VsYXRpb24gb2YgdGhlIGVuZXJneS5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICogQHNlZSBEZXZpY2Vtb3Rpb25Nb2R1bGVcbiAgICAgKi9cbiAgICB0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IHJvdGF0aW9uIHJhdGUgdmFsdWUgc2VudCBieSB0aGUgcm90YXRpb24gcmF0ZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIHRoaXMuX3JvdGF0aW9uUmF0ZVZhbHVlcyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIHZhbHVlIHJlYWNoZWQgYnkgdGhlIHJvdGF0aW9uIHJhdGUgbWFnbml0dWRlLCBjbGlwcGVkIGF0IGB0aGlzLl9yb3RhdGlvblJhdGVNYWduaXR1ZGVUaHJlc2hvbGRgLlxuICAgICAqXG4gICAgICogQHRoaXMgRW5lcmd5TW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZGVmYXVsdCA0MDBcbiAgICAgKi9cbiAgICB0aGlzLl9yb3RhdGlvblJhdGVNYWduaXR1ZGVDdXJyZW50TWF4ID0gNDAwO1xuXG4gICAgLyoqXG4gICAgICogQ2xpcHBpbmcgdmFsdWUgb2YgdGhlIHJvdGF0aW9uIHJhdGUgbWFnbml0dWRlLlxuICAgICAqXG4gICAgICogQHRoaXMgRW5lcmd5TW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZGVmYXVsdCA2MDBcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICB0aGlzLl9yb3RhdGlvblJhdGVNYWduaXR1ZGVUaHJlc2hvbGQgPSA2MDA7XG5cbiAgICAvKipcbiAgICAgKiBUaW1lIGNvbnN0YW50IChoYWxmLWxpZmUpIG9mIHRoZSBsb3ctcGFzcyBmaWx0ZXIgdXNlZCB0byBzbW9vdGggdGhlIGVuZXJneSB2YWx1ZXMgKGluIHNlY29uZHMpLlxuICAgICAqXG4gICAgICogQHRoaXMgRW5lcmd5TW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAwLjFcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICB0aGlzLl9lbmVyZ3lUaW1lQ29uc3RhbnQgPSAwLjE7XG5cbiAgICB0aGlzLl9vbkFjY2VsZXJhdGlvbiA9IHRoaXMuX29uQWNjZWxlcmF0aW9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Sb3RhdGlvblJhdGUgPSB0aGlzLl9vblJvdGF0aW9uUmF0ZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlY2F5IGZhY3RvciBvZiB0aGUgbG93LXBhc3MgZmlsdGVyIHVzZWQgdG8gc21vb3RoIHRoZSBlbmVyZ3kgdmFsdWVzLlxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBfZW5lcmd5RGVjYXkoKSB7XG4gICAgcmV0dXJuIE1hdGguZXhwKC0yICogTWF0aC5QSSAqIHRoaXMucGVyaW9kIC8gdGhpcy5fZW5lcmd5VGltZUNvbnN0YW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gc3VwZXIuaW5pdCgocmVzb2x2ZSkgPT4ge1xuICAgICAgLy8gVGhlIGVuZXJneSBtb2R1bGUgcmVxdWlyZXMgdGhlIGFjY2VsZXJhdGlvbiBhbmQgdGhlIHJvdGF0aW9uIHJhdGUgbW9kdWxlc1xuICAgICAgUHJvbWlzZS5hbGwoW21vdGlvbklucHV0LnJlcXVpcmVNb2R1bGUoJ2FjY2VsZXJhdGlvbicpLCBtb3Rpb25JbnB1dC5yZXF1aXJlTW9kdWxlKCdyb3RhdGlvblJhdGUnKV0pXG4gICAgICAgIC50aGVuKChtb2R1bGVzKSA9PiB7XG4gICAgICAgICAgY29uc3QgW2FjY2VsZXJhdGlvbiwgcm90YXRpb25SYXRlXSA9IG1vZHVsZXM7XG5cbiAgICAgICAgICB0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUgPSBhY2NlbGVyYXRpb247XG4gICAgICAgICAgdGhpcy5fcm90YXRpb25SYXRlTW9kdWxlID0gcm90YXRpb25SYXRlO1xuICAgICAgICAgIHRoaXMuaXNDYWxjdWxhdGVkID0gdGhpcy5fYWNjZWxlcmF0aW9uTW9kdWxlLmlzVmFsaWQgfHwgdGhpcy5fcm90YXRpb25SYXRlTW9kdWxlLmlzVmFsaWQ7XG5cbiAgICAgICAgICBpZiAodGhpcy5fYWNjZWxlcmF0aW9uTW9kdWxlLmlzVmFsaWQpXG4gICAgICAgICAgICB0aGlzLnBlcmlvZCA9IHRoaXMuX2FjY2VsZXJhdGlvbk1vZHVsZS5wZXJpb2Q7XG4gICAgICAgICAgZWxzZSBpZiAodGhpcy5fcm90YXRpb25SYXRlTW9kdWxlLmlzVmFsaWQpXG4gICAgICAgICAgICB0aGlzLnBlcmlvZCA9IHRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZS5wZXJpb2Q7XG5cbiAgICAgICAgICByZXNvbHZlKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGFkZExpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMubGlzdGVuZXJzLnNpemUgPT09IDApIHtcbiAgICAgIGlmICh0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUuaXNWYWxpZClcbiAgICAgICAgdGhpcy5fYWNjZWxlcmF0aW9uTW9kdWxlLmFkZExpc3RlbmVyKHRoaXMuX29uQWNjZWxlcmF0aW9uKTtcbiAgICAgIGlmICh0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUuaXNWYWxpZClcbiAgICAgICAgdGhpcy5fcm90YXRpb25SYXRlTW9kdWxlLmFkZExpc3RlbmVyKHRoaXMuX29uUm90YXRpb25SYXRlKTtcbiAgICB9XG5cbiAgICBzdXBlci5hZGRMaXN0ZW5lcihsaXN0ZW5lcik7XG4gIH1cblxuICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIHN1cGVyLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcblxuICAgIGlmICh0aGlzLmxpc3RlbmVycy5zaXplID09PSAwKSB7XG4gICAgICBpZiAodGhpcy5fYWNjZWxlcmF0aW9uTW9kdWxlLmlzVmFsaWQpXG4gICAgICAgIHRoaXMuX2FjY2VsZXJhdGlvbk1vZHVsZS5yZW1vdmVMaXN0ZW5lcih0aGlzLl9vbkFjY2VsZXJhdGlvbik7XG4gICAgICBpZiAodGhpcy5fcm90YXRpb25SYXRlTW9kdWxlLmlzVmFsaWQpXG4gICAgICAgIHRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZS5yZW1vdmVMaXN0ZW5lcih0aGlzLl9vblJvdGF0aW9uUmF0ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFjY2VsZXJhdGlvbiB2YWx1ZXMgaGFuZGxlci5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJbXX0gYWNjZWxlcmF0aW9uIC0gTGF0ZXN0IGFjY2VsZXJhdGlvbiB2YWx1ZS5cbiAgICovXG4gIF9vbkFjY2VsZXJhdGlvbihhY2NlbGVyYXRpb24pIHtcbiAgICB0aGlzLl9hY2NlbGVyYXRpb25WYWx1ZXMgPSBhY2NlbGVyYXRpb247XG5cbiAgICAvLyBJZiB0aGUgcm90YXRpb24gcmF0ZSB2YWx1ZXMgYXJlIG5vdCBhdmFpbGFibGUsIHdlIGNhbGN1bGF0ZSB0aGUgZW5lcmd5IHJpZ2h0IGF3YXkuXG4gICAgaWYgKCF0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUuaXNWYWxpZClcbiAgICAgIHRoaXMuX2NhbGN1bGF0ZUVuZXJneSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJvdGF0aW9uIHJhdGUgdmFsdWVzIGhhbmRsZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyW119IHJvdGF0aW9uUmF0ZSAtIExhdGVzdCByb3RhdGlvbiByYXRlIHZhbHVlLlxuICAgKi9cbiAgX29uUm90YXRpb25SYXRlKHJvdGF0aW9uUmF0ZSkge1xuICAgIHRoaXMuX3JvdGF0aW9uUmF0ZVZhbHVlcyA9IHJvdGF0aW9uUmF0ZTtcblxuICAgIC8vIFdlIGtub3cgdGhhdCB0aGUgYWNjZWxlcmF0aW9uIGFuZCByb3RhdGlvbiByYXRlIHZhbHVlcyBjb21pbmcgZnJvbSB0aGVcbiAgICAvLyBzYW1lIGBkZXZpY2Vtb3Rpb25gIGV2ZW50IGFyZSBzZW50IGluIHRoYXQgb3JkZXIgKGFjY2VsZXJhdGlvbiA+IHJvdGF0aW9uIHJhdGUpXG4gICAgLy8gc28gd2hlbiB0aGUgcm90YXRpb24gcmF0ZSBpcyBwcm92aWRlZCwgd2UgY2FsY3VsYXRlIHRoZSBlbmVyZ3kgdmFsdWUgb2YgdGhlXG4gICAgLy8gbGF0ZXN0IGBkZXZpY2Vtb3Rpb25gIGV2ZW50IHdoZW4gd2UgcmVjZWl2ZSB0aGUgcm90YXRpb24gcmF0ZSB2YWx1ZXMuXG4gICAgdGhpcy5fY2FsY3VsYXRlRW5lcmd5KCk7XG4gIH1cblxuICAvKipcbiAgICogRW5lcmd5IGNhbGN1bGF0aW9uOiBlbWl0cyBhbiBlbmVyZ3kgdmFsdWUgYmV0d2VlbiAwIGFuZCAxLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBjaGVja3MgaWYgdGhlIGFjY2VsZXJhdGlvbiBtb2R1bGVzIGlzIHZhbGlkLiBJZiB0aGF0IGlzIHRoZSBjYXNlLFxuICAgKiBpdCBjYWxjdWxhdGVzIGFuIGVzdGltYXRpb24gb2YgdGhlIGVuZXJneSAoYmV0d2VlbiAwIGFuZCAxKSBiYXNlZCBvbiB0aGUgcmF0aW9cbiAgICogb2YgdGhlIGN1cnJlbnQgYWNjZWxlcmF0aW9uIG1hZ25pdHVkZSBhbmQgdGhlIG1heGltdW0gYWNjZWxlcmF0aW9uIG1hZ25pdHVkZVxuICAgKiByZWFjaGVkIHNvIGZhciAoY2xpcHBlZCBhdCB0aGUgYHRoaXMuX2FjY2VsZXJhdGlvbk1hZ25pdHVkZVRocmVzaG9sZGAgdmFsdWUpLlxuICAgKiAoV2UgdXNlIHRoaXMgdHJpY2sgdG8gZ2V0IHVuaWZvcm0gYmVoYXZpb3JzIGFtb25nIGRldmljZXMuIElmIHdlIGNhbGN1bGF0ZWRcbiAgICogdGhlIHJhdGlvIGJhc2VkIG9uIGEgZml4ZWQgdmFsdWUgaW5kZXBlbmRlbnQgb2Ygd2hhdCB0aGUgZGV2aWNlIGlzIGNhcGFibGUgb2ZcbiAgICogcHJvdmlkaW5nLCB3ZSBjb3VsZCBnZXQgaW5jb25zaXN0ZW50IGJlaGF2aW9ycy4gRm9yIGluc3RhbmNlLCB0aGUgZGV2aWNlc1xuICAgKiB3aG9zZSBhY2NlbGVyb21ldGVycyBhcmUgbGltaXRlZCBhdCAyZyB3b3VsZCBhbHdheXMgcHJvdmlkZSB2ZXJ5IGxvdyB2YWx1ZXNcbiAgICogY29tcGFyZWQgdG8gZGV2aWNlcyB3aXRoIGFjY2VsZXJvbWV0ZXJzIGNhcGFibGUgb2YgbWVhc3VyaW5nIDRnIGFjY2VsZXJhdGlvbnMuKVxuICAgKiBUaGUgc2FtZSBjaGVja3MgYW5kIGNhbGN1bGF0aW9ucyBhcmUgbWFkZSBvbiB0aGUgcm90YXRpb24gcmF0ZSBtb2R1bGUuXG4gICAqIEZpbmFsbHksIHRoZSBlbmVyZ3kgdmFsdWUgaXMgdGhlIG1heGltdW0gYmV0d2VlbiB0aGUgZW5lcmd5IHZhbHVlIGVzdGltYXRlZFxuICAgKiBmcm9tIHRoZSBhY2NlbGVyYXRpb24sIGFuZCB0aGUgb25lIGVzdGltYXRlZCBmcm9tIHRoZSByb3RhdGlvbiByYXRlLiBJdCBpc1xuICAgKiBzbW9vdGhlZCB0aHJvdWdoIGEgbG93LXBhc3MgZmlsdGVyLlxuICAgKi9cbiAgX2NhbGN1bGF0ZUVuZXJneSgpIHtcbiAgICBsZXQgYWNjZWxlcmF0aW9uRW5lcmd5ID0gMDtcbiAgICBsZXQgcm90YXRpb25SYXRlRW5lcmd5ID0gMDtcblxuICAgIC8vIENoZWNrIHRoZSBhY2NlbGVyYXRpb24gbW9kdWxlIGFuZCBjYWxjdWxhdGUgYW4gZXN0aW1hdGlvbiBvZiB0aGUgZW5lcmd5IHZhbHVlIGZyb20gdGhlIGxhdGVzdCBhY2NlbGVyYXRpb24gdmFsdWVcbiAgICBpZiAodGhpcy5fYWNjZWxlcmF0aW9uTW9kdWxlLmlzVmFsaWQpIHtcbiAgICAgIGxldCBhWCA9IHRoaXMuX2FjY2VsZXJhdGlvblZhbHVlc1swXTtcbiAgICAgIGxldCBhWSA9IHRoaXMuX2FjY2VsZXJhdGlvblZhbHVlc1sxXTtcbiAgICAgIGxldCBhWiA9IHRoaXMuX2FjY2VsZXJhdGlvblZhbHVlc1syXTtcbiAgICAgIGxldCBhY2NlbGVyYXRpb25NYWduaXR1ZGUgPSBNYXRoLnNxcnQoYVggKiBhWCArIGFZICogYVkgKyBhWiAqIGFaKTtcblxuICAgICAgLy8gU3RvcmUgdGhlIG1heGltdW0gYWNjZWxlcmF0aW9uIG1hZ25pdHVkZSByZWFjaGVkIHNvIGZhciwgY2xpcHBlZCBhdCBgdGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlVGhyZXNob2xkYFxuICAgICAgaWYgKHRoaXMuX2FjY2VsZXJhdGlvbk1hZ25pdHVkZUN1cnJlbnRNYXggPCBhY2NlbGVyYXRpb25NYWduaXR1ZGUpXG4gICAgICAgIHRoaXMuX2FjY2VsZXJhdGlvbk1hZ25pdHVkZUN1cnJlbnRNYXggPSBNYXRoLm1pbihhY2NlbGVyYXRpb25NYWduaXR1ZGUsIHRoaXMuX2FjY2VsZXJhdGlvbk1hZ25pdHVkZVRocmVzaG9sZCk7XG4gICAgICAvLyBUT0RPKD8pOiByZW1vdmUgb3VsaWVycyAtLS0gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHRoZSBtYWduaXR1ZGUgaXMgdmVyeSBoaWdoIG9uIGEgZmV3IGlzb2xhdGVkIGRhdGFwb2ludHMsXG4gICAgICAvLyB3aGljaCBtYWtlIHRoZSB0aHJlc2hvbGQgdmVyeSBoaWdoIGFzIHdlbGwgPT4gdGhlIGVuZXJneSByZW1haW5zIGFyb3VuZCAwLjUsIGV2ZW4gd2hlbiB5b3Ugc2hha2UgdmVyeSBoYXJkLlxuXG4gICAgICBhY2NlbGVyYXRpb25FbmVyZ3kgPSBNYXRoLm1pbihhY2NlbGVyYXRpb25NYWduaXR1ZGUgLyB0aGlzLl9hY2NlbGVyYXRpb25NYWduaXR1ZGVDdXJyZW50TWF4LCAxKTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayB0aGUgcm90YXRpb24gcmF0ZSBtb2R1bGUgYW5kIGNhbGN1bGF0ZSBhbiBlc3RpbWF0aW9uIG9mIHRoZSBlbmVyZ3kgdmFsdWUgZnJvbSB0aGUgbGF0ZXN0IHJvdGF0aW9uIHJhdGUgdmFsdWVcbiAgICBpZiAodGhpcy5fcm90YXRpb25SYXRlTW9kdWxlLmlzVmFsaWQpIHtcbiAgICAgIGxldCByQSA9IHRoaXMuX3JvdGF0aW9uUmF0ZVZhbHVlc1swXTtcbiAgICAgIGxldCByQiA9IHRoaXMuX3JvdGF0aW9uUmF0ZVZhbHVlc1sxXTtcbiAgICAgIGxldCByRyA9IHRoaXMuX3JvdGF0aW9uUmF0ZVZhbHVlc1syXTtcbiAgICAgIGxldCByb3RhdGlvblJhdGVNYWduaXR1ZGUgPSBNYXRoLnNxcnQockEgKiByQSArIHJCICogckIgKyByRyAqIHJHKTtcblxuICAgICAgLy8gU3RvcmUgdGhlIG1heGltdW0gcm90YXRpb24gcmF0ZSBtYWduaXR1ZGUgcmVhY2hlZCBzbyBmYXIsIGNsaXBwZWQgYXQgYHRoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZVRocmVzaG9sZGBcbiAgICAgIGlmICh0aGlzLl9yb3RhdGlvblJhdGVNYWduaXR1ZGVDdXJyZW50TWF4IDwgcm90YXRpb25SYXRlTWFnbml0dWRlKVxuICAgICAgICB0aGlzLl9yb3RhdGlvblJhdGVNYWduaXR1ZGVDdXJyZW50TWF4ID0gTWF0aC5taW4ocm90YXRpb25SYXRlTWFnbml0dWRlLCB0aGlzLl9yb3RhdGlvblJhdGVNYWduaXR1ZGVUaHJlc2hvbGQpO1xuXG4gICAgICByb3RhdGlvblJhdGVFbmVyZ3kgPSBNYXRoLm1pbihyb3RhdGlvblJhdGVNYWduaXR1ZGUgLyB0aGlzLl9yb3RhdGlvblJhdGVNYWduaXR1ZGVDdXJyZW50TWF4LCAxKTtcbiAgICB9XG5cbiAgICBsZXQgZW5lcmd5ID0gTWF0aC5tYXgoYWNjZWxlcmF0aW9uRW5lcmd5LCByb3RhdGlvblJhdGVFbmVyZ3kpO1xuXG4gICAgLy8gTG93LXBhc3MgZmlsdGVyIHRvIHNtb290aCB0aGUgZW5lcmd5IHZhbHVlc1xuICAgIGNvbnN0IGsgPSB0aGlzLl9lbmVyZ3lEZWNheTtcbiAgICB0aGlzLmV2ZW50ID0gayAqIHRoaXMuZXZlbnQgKyAoMSAtIGspICogZW5lcmd5O1xuXG4gICAgLy8gRW1pdCB0aGUgZW5lcmd5IHZhbHVlXG4gICAgdGhpcy5lbWl0KHRoaXMuZXZlbnQpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBFbmVyZ3lNb2R1bGUoKTtcbiIsIi8qKlxuICogYElucHV0TW9kdWxlYCBjbGFzcy5cbiAqIFRoZSBgSW5wdXRNb2R1bGVgIGNsYXNzIGFsbG93cyB0byBpbnN0YW50aWF0ZSBtb2R1bGVzIHRoYXQgYXJlIHBhcnQgb2YgdGhlXG4gKiBtb3Rpb24gaW5wdXQgbW9kdWxlLCBhbmQgdGhhdCBwcm92aWRlIHZhbHVlcyAoZm9yIGluc3RhbmNlLCBgZGV2aWNlb3JpZW50YXRpb25gLFxuICogYGFjY2VsZXJhdGlvbmAsIGBlbmVyZ3lgKS5cbiAqXG4gKiBAY2xhc3MgSW5wdXRNb2R1bGVcbiAqL1xuY2xhc3MgSW5wdXRNb2R1bGUge1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBJbnB1dE1vZHVsZWAgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIE5hbWUgb2YgdGhlIG1vZHVsZSAvIGV2ZW50ICgqZS5nLiogYGRldmljZW9yaWVudGF0aW9uLCAnYWNjZWxlcmF0aW9uJywgJ2VuZXJneScpLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZXZlbnRUeXBlKSB7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCB0eXBlIG9mIHRoZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgdGhpcy5ldmVudFR5cGUgPSBldmVudFR5cGU7XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBsaXN0ZW5lcnMgYXR0YWNoZWQgdG8gdGhpcyBtb2R1bGUgLyBldmVudC5cbiAgICAgKlxuICAgICAqIEB0aGlzIElucHV0TW9kdWxlXG4gICAgICogQHR5cGUge1NldDxGdW5jdGlvbj59XG4gICAgICovXG4gICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBzZW50IGJ5IHRoaXMgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgSW5wdXRNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfG51bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBwcm9taXNlIChyZXNvbHZlZCB3aGVuIHRoZSBtb2R1bGUgaXMgaW5pdGlhbGl6ZWQpLlxuICAgICAqXG4gICAgICogQHRoaXMgSW5wdXRNb2R1bGVcbiAgICAgKiBAdHlwZSB7UHJvbWlzZX1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICovXG4gICAgdGhpcy5wcm9taXNlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyBpZiB0aGUgbW9kdWxlJ3MgZXZlbnQgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20gcGFyZW50IG1vZHVsZXMgLyBldmVudHMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtib29sfVxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgdGhpcy5pc0NhbGN1bGF0ZWQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyBpZiB0aGUgbW9kdWxlJ3MgZXZlbnQgdmFsdWVzIGFyZSBwcm92aWRlZCBieSB0aGUgZGV2aWNlJ3Mgc2Vuc29ycy5cbiAgICAgKiAoKkkuZS4qIGluZGljYXRlcyBpZiB0aGUgYCdkZXZpY2Vtb3Rpb24nYCBvciBgJ2RldmljZW9yaWVudGF0aW9uJ2AgZXZlbnRzIHByb3ZpZGUgdGhlIHJlcXVpcmVkIHJhdyB2YWx1ZXMuKVxuICAgICAqXG4gICAgICogQHRoaXMgSW5wdXRNb2R1bGVcbiAgICAgKiBAdHlwZSB7Ym9vbH1cbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIHRoaXMuaXNQcm92aWRlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogUGVyaW9kIGF0IHdoaWNoIHRoZSBtb2R1bGUncyBldmVudHMgYXJlIHNlbnQgKGB1bmRlZmluZWRgIGlmIHRoZSBldmVudHMgYXJlIG5vdCBzZW50IGF0IHJlZ3VsYXIgaW50ZXJ2YWxzKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIElucHV0TW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZGVmYXVsdCB1bmRlZmluZWRcbiAgICAgKi9cbiAgICB0aGlzLnBlcmlvZCA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuZW1pdCA9IHRoaXMuZW1pdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgY2FuIHByb3ZpZGUgdmFsdWVzIG9yIG5vdC5cbiAgICpcbiAgICogQHR5cGUge2Jvb2x9XG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IGlzVmFsaWQoKSB7XG4gICAgcmV0dXJuICh0aGlzLmlzUHJvdmlkZWQgfHwgdGhpcy5pc0NhbGN1bGF0ZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2VGdW4gLSBQcm9taXNlIGZ1bmN0aW9uIHRoYXQgdGFrZXMgdGhlIGByZXNvbHZlYCBhbmQgYHJlamVjdGAgZnVuY3Rpb25zIGFzIGFyZ3VtZW50cy5cbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGluaXQocHJvbWlzZUZ1bikge1xuICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKHByb21pc2VGdW4pO1xuICAgIHJldHVybiB0aGlzLnByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxpc3RlbmVyIHRvIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIC0gTGlzdGVuZXIgdG8gYWRkLlxuICAgKi9cbiAgYWRkTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICB0aGlzLmxpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsaXN0ZW5lciBmcm9tIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIC0gTGlzdGVuZXIgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICB0aGlzLmxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZXMgYW4gZXZlbnQgdG8gYWxsIHRoZSBtb2R1bGUncyBsaXN0ZW5lcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfG51bWJlcltdfSBbZXZlbnQ9dGhpcy5ldmVudF0gLSBFdmVudCB2YWx1ZXMgdG8gcHJvcGFnYXRlIHRvIHRoZSBtb2R1bGUncyBsaXN0ZW5lcnMuXG4gICAqL1xuICBlbWl0KGV2ZW50ID0gdGhpcy5ldmVudCkge1xuICAgIHRoaXMubGlzdGVuZXJzLmZvckVhY2gobGlzdGVuZXIgPT4gbGlzdGVuZXIoZXZlbnQpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbnB1dE1vZHVsZTtcbiIsIi8qKlxuICogYE1vdGlvbklucHV0YCBzaW5nbGV0b24uXG4gKiBUaGUgYE1vdGlvbklucHV0YCBzaW5nbGV0b24gYWxsb3dzIHRvIGluaXRpYWxpemUgbW90aW9uIGV2ZW50c1xuICogYW5kIHRvIGxpc3RlbiB0byB0aGVtLlxuICpcbiAqIEBjbGFzcyBNb3Rpb25JbnB1dFxuICovXG5jbGFzcyBNb3Rpb25JbnB1dCB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGBNb3Rpb25JbnB1dGAgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgLyoqXG4gICAgICogUG9vbCBvZiBhbGwgYXZhaWxhYmxlIG1vZHVsZXMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBNb3Rpb25JbnB1dFxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQGRlZmF1bHQge31cbiAgICAgKi9cbiAgICB0aGlzLm1vZHVsZXMgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbW9kdWxlIHRvIHRoZSBgTW90aW9uSW5wdXRgIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIE5hbWUgb2YgdGhlIGV2ZW50IHR5cGUuXG4gICAqIEBwYXJhbSB7SW5wdXRNb2R1bGV9IG1vZHVsZSAtIE1vZHVsZSB0byBhZGQgdG8gdGhlIGBNb3Rpb25JbnB1dGAgbW9kdWxlLlxuICAgKi9cbiAgYWRkTW9kdWxlKGV2ZW50VHlwZSwgbW9kdWxlKSB7XG4gICAgdGhpcy5tb2R1bGVzW2V2ZW50VHlwZV0gPSBtb2R1bGU7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIE5hbWUgb2YgdGhlIGV2ZW50IHR5cGUgKG1vZHVsZSkgdG8gcmV0cmlldmUuXG4gICAqIEByZXR1cm4ge0lucHV0TW9kdWxlfVxuICAgKi9cbiAgZ2V0TW9kdWxlKGV2ZW50VHlwZSkge1xuICAgIHJldHVybiB0aGlzLm1vZHVsZXNbZXZlbnRUeXBlXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1aXJlcyBhIG1vZHVsZS5cbiAgICogSWYgdGhlIG1vZHVsZSBoYXMgYmVlbiBpbml0aWFsaXplZCBhbHJlYWR5LCByZXR1cm5zIGl0cyBwcm9taXNlLiBPdGhlcndpc2UsXG4gICAqIGluaXRpYWxpemVzIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBOYW1lIG9mIHRoZSBldmVudCB0eXBlIChtb2R1bGUpIHRvIHJlcXVpcmUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICByZXF1aXJlTW9kdWxlKGV2ZW50VHlwZSkge1xuICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMuZ2V0TW9kdWxlKGV2ZW50VHlwZSk7XG5cbiAgICBpZiAobW9kdWxlLnByb21pc2UpXG4gICAgICByZXR1cm4gbW9kdWxlLnByb21pc2U7XG5cbiAgICByZXR1cm4gbW9kdWxlLmluaXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgYE1vdGlvbklucHV0YCBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gZXZlbnRUeXBlcyAtIEFycmF5IG9mIHRoZSBldmVudCB0eXBlcyB0byBpbml0aWFsaXplLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgaW5pdCguLi5ldmVudFR5cGVzKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZXZlbnRUeXBlc1swXSkpXG4gICAgICBldmVudFR5cGVzID0gZXZlbnRUeXBlc1swXVxuXG4gICAgY29uc3QgbW9kdWxlUHJvbWlzZXMgPSBldmVudFR5cGVzLm1hcCgodmFsdWUpID0+IHtcbiAgICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMuZ2V0TW9kdWxlKHZhbHVlKTtcbiAgICAgIHJldHVybiBtb2R1bGUuaW5pdCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKG1vZHVsZVByb21pc2VzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBOYW1lIG9mIHRoZSBldmVudCB0eXBlIChtb2R1bGUpIHRvIGFkZCBhIGxpc3RlbmVyIHRvLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIHRvIGFkZC5cbiAgICovXG4gIGFkZExpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBtb2R1bGUgPSB0aGlzLmdldE1vZHVsZShldmVudFR5cGUpO1xuICAgIG1vZHVsZS5hZGRMaXN0ZW5lcihsaXN0ZW5lcik7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxpc3RlbmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gTmFtZSBvZiB0aGUgZXZlbnQgdHlwZSAobW9kdWxlKSB0byBhZGQgYSBsaXN0ZW5lciB0by5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgLSBMaXN0ZW5lciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihldmVudFR5cGUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgbW9kdWxlID0gdGhpcy5nZXRNb2R1bGUoZXZlbnRUeXBlKTtcbiAgICBtb2R1bGUucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBNb3Rpb25JbnB1dCgpO1xuIiwiLyoqXG4gKiBUaGUgbW90aW9uIGlucHV0IG1vZHVsZSBjYW4gYmUgdXNlZCBhcyBmb2xsb3dzXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCBtb3Rpb25JbnB1dCBmcm9tICdtb3Rpb24taW5wdXQnO1xuICogY29uc3QgcmVxdWlyZWRFdmVudHMgPSA7XG4gKlxuICogbW90aW9uSW5wdXRcbiAqICAuaW5pdChbJ2FjY2VsZXJhdGlvbicsICdvcmllbnRhdGlvbicsICdlbmVyZ3knXSlcbiAqICAudGhlbigoW2FjY2VsZXJhdGlvbiwgb3JpZW50YXRpb24sIGVuZXJneV0pID0+IHtcbiAqICAgIGlmIChhY2NlbGVyYXRpb24uaXNWYWxpZCkge1xuICogICAgICBhY2NlbGVyYXRpb24uYWRkTGlzdGVuZXIoKGRhdGEpID0+IHtcbiAqICAgICAgICBjb25zb2xlLmxvZygnYWNjZWxlcmF0aW9uJywgZGF0YSk7XG4gKiAgICAgICAgLy8gZG8gc29tZXRoaW5nIHdpdGggdGhlIGFjY2VsZXJhdGlvbiB2YWx1ZXNcbiAqICAgICAgfSk7XG4gKiAgICB9XG4gKlxuICogICAgLy8gLi4uXG4gKiAgfSk7XG4gKi9cbmltcG9ydCBtb3Rpb25JbnB1dCBmcm9tICcuL01vdGlvbklucHV0JztcbmltcG9ydCBkZXZpY2VvcmllbnRhdGlvbk1vZHVsZSBmcm9tICcuL0RldmljZU9yaWVudGF0aW9uTW9kdWxlJztcbmltcG9ydCBkZXZpY2Vtb3Rpb25Nb2R1bGUgZnJvbSAnLi9EZXZpY2VNb3Rpb25Nb2R1bGUnO1xuaW1wb3J0IGVuZXJneSBmcm9tICcuL0VuZXJneU1vZHVsZSc7XG5cbm1vdGlvbklucHV0LmFkZE1vZHVsZSgnZGV2aWNlbW90aW9uJywgZGV2aWNlbW90aW9uTW9kdWxlKTtcbm1vdGlvbklucHV0LmFkZE1vZHVsZSgnZGV2aWNlb3JpZW50YXRpb24nLCBkZXZpY2VvcmllbnRhdGlvbk1vZHVsZSk7XG5tb3Rpb25JbnB1dC5hZGRNb2R1bGUoJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknLCBkZXZpY2Vtb3Rpb25Nb2R1bGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSk7XG5tb3Rpb25JbnB1dC5hZGRNb2R1bGUoJ2FjY2VsZXJhdGlvbicsIGRldmljZW1vdGlvbk1vZHVsZS5hY2NlbGVyYXRpb24pO1xubW90aW9uSW5wdXQuYWRkTW9kdWxlKCdyb3RhdGlvblJhdGUnLCBkZXZpY2Vtb3Rpb25Nb2R1bGUucm90YXRpb25SYXRlKTtcbm1vdGlvbklucHV0LmFkZE1vZHVsZSgnb3JpZW50YXRpb24nLCBkZXZpY2VvcmllbnRhdGlvbk1vZHVsZS5vcmllbnRhdGlvbik7XG5tb3Rpb25JbnB1dC5hZGRNb2R1bGUoJ29yaWVudGF0aW9uQWx0JywgZGV2aWNlb3JpZW50YXRpb25Nb2R1bGUub3JpZW50YXRpb25BbHQpO1xubW90aW9uSW5wdXQuYWRkTW9kdWxlKCdlbmVyZ3knLCBlbmVyZ3kpO1xuXG5leHBvcnQgZGVmYXVsdCBtb3Rpb25JbnB1dDtcbiIsIi8qIVxuICogUGxhdGZvcm0uanMgPGh0dHBzOi8vbXRocy5iZS9wbGF0Zm9ybT5cbiAqIENvcHlyaWdodCAyMDE0LTIwMTYgQmVuamFtaW4gVGFuIDxodHRwczovL2RlbW9uZWF1eC5naXRodWIuaW8vPlxuICogQ29weXJpZ2h0IDIwMTEtMjAxMyBKb2huLURhdmlkIERhbHRvbiA8aHR0cDovL2FsbHlvdWNhbmxlZXQuY29tLz5cbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9tdGhzLmJlL21pdD5cbiAqL1xuOyhmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKiBVc2VkIHRvIGRldGVybWluZSBpZiB2YWx1ZXMgYXJlIG9mIHRoZSBsYW5ndWFnZSB0eXBlIGBPYmplY3RgLiAqL1xuICB2YXIgb2JqZWN0VHlwZXMgPSB7XG4gICAgJ2Z1bmN0aW9uJzogdHJ1ZSxcbiAgICAnb2JqZWN0JzogdHJ1ZVxuICB9O1xuXG4gIC8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xuICB2YXIgcm9vdCA9IChvYmplY3RUeXBlc1t0eXBlb2Ygd2luZG93XSAmJiB3aW5kb3cpIHx8IHRoaXM7XG5cbiAgLyoqIEJhY2t1cCBwb3NzaWJsZSBnbG9iYWwgb2JqZWN0LiAqL1xuICB2YXIgb2xkUm9vdCA9IHJvb3Q7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbiAgdmFyIGZyZWVFeHBvcnRzID0gb2JqZWN0VHlwZXNbdHlwZW9mIGV4cG9ydHNdICYmIGV4cG9ydHM7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xuICB2YXIgZnJlZU1vZHVsZSA9IG9iamVjdFR5cGVzW3R5cGVvZiBtb2R1bGVdICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzIG9yIEJyb3dzZXJpZmllZCBjb2RlIGFuZCB1c2UgaXQgYXMgYHJvb3RgLiAqL1xuICB2YXIgZnJlZUdsb2JhbCA9IGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUgJiYgdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWw7XG4gIGlmIChmcmVlR2xvYmFsICYmIChmcmVlR2xvYmFsLmdsb2JhbCA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLnNlbGYgPT09IGZyZWVHbG9iYWwpKSB7XG4gICAgcm9vdCA9IGZyZWVHbG9iYWw7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBhcyB0aGUgbWF4aW11bSBsZW5ndGggb2YgYW4gYXJyYXktbGlrZSBvYmplY3QuXG4gICAqIFNlZSB0aGUgW0VTNiBzcGVjXShodHRwOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aClcbiAgICogZm9yIG1vcmUgZGV0YWlscy5cbiAgICovXG4gIHZhciBtYXhTYWZlSW50ZWdlciA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG5cbiAgLyoqIFJlZ3VsYXIgZXhwcmVzc2lvbiB0byBkZXRlY3QgT3BlcmEuICovXG4gIHZhciByZU9wZXJhID0gL1xcYk9wZXJhLztcblxuICAvKiogUG9zc2libGUgZ2xvYmFsIG9iamVjdC4gKi9cbiAgdmFyIHRoaXNCaW5kaW5nID0gdGhpcztcblxuICAvKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xuICB2YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4gIC8qKiBVc2VkIHRvIGNoZWNrIGZvciBvd24gcHJvcGVydGllcyBvZiBhbiBvYmplY3QuICovXG4gIHZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGludGVybmFsIGBbW0NsYXNzXV1gIG9mIHZhbHVlcy4gKi9cbiAgdmFyIHRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENhcGl0YWxpemVzIGEgc3RyaW5nIHZhbHVlLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gY2FwaXRhbGl6ZS5cbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGNhcGl0YWxpemVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyaW5nKSB7XG4gICAgc3RyaW5nID0gU3RyaW5nKHN0cmluZyk7XG4gICAgcmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHV0aWxpdHkgZnVuY3Rpb24gdG8gY2xlYW4gdXAgdGhlIE9TIG5hbWUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcyBUaGUgT1MgbmFtZSB0byBjbGVhbiB1cC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtwYXR0ZXJuXSBBIGBSZWdFeHBgIHBhdHRlcm4gbWF0Y2hpbmcgdGhlIE9TIG5hbWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbbGFiZWxdIEEgbGFiZWwgZm9yIHRoZSBPUy5cbiAgICovXG4gIGZ1bmN0aW9uIGNsZWFudXBPUyhvcywgcGF0dGVybiwgbGFiZWwpIHtcbiAgICAvLyBQbGF0Zm9ybSB0b2tlbnMgYXJlIGRlZmluZWQgYXQ6XG4gICAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM3NTAzKFZTLjg1KS5hc3B4XG4gICAgLy8gaHR0cDovL3dlYi5hcmNoaXZlLm9yZy93ZWIvMjAwODExMjIwNTM5NTAvaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM3NTAzKFZTLjg1KS5hc3B4XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAnMTAuMCc6ICcxMCcsXG4gICAgICAnNi40JzogICcxMCBUZWNobmljYWwgUHJldmlldycsXG4gICAgICAnNi4zJzogICc4LjEnLFxuICAgICAgJzYuMic6ICAnOCcsXG4gICAgICAnNi4xJzogICdTZXJ2ZXIgMjAwOCBSMiAvIDcnLFxuICAgICAgJzYuMCc6ICAnU2VydmVyIDIwMDggLyBWaXN0YScsXG4gICAgICAnNS4yJzogICdTZXJ2ZXIgMjAwMyAvIFhQIDY0LWJpdCcsXG4gICAgICAnNS4xJzogICdYUCcsXG4gICAgICAnNS4wMSc6ICcyMDAwIFNQMScsXG4gICAgICAnNS4wJzogICcyMDAwJyxcbiAgICAgICc0LjAnOiAgJ05UJyxcbiAgICAgICc0LjkwJzogJ01FJ1xuICAgIH07XG4gICAgLy8gRGV0ZWN0IFdpbmRvd3MgdmVyc2lvbiBmcm9tIHBsYXRmb3JtIHRva2Vucy5cbiAgICBpZiAocGF0dGVybiAmJiBsYWJlbCAmJiAvXldpbi9pLnRlc3Qob3MpICYmICEvXldpbmRvd3MgUGhvbmUgL2kudGVzdChvcykgJiZcbiAgICAgICAgKGRhdGEgPSBkYXRhWy9bXFxkLl0rJC8uZXhlYyhvcyldKSkge1xuICAgICAgb3MgPSAnV2luZG93cyAnICsgZGF0YTtcbiAgICB9XG4gICAgLy8gQ29ycmVjdCBjaGFyYWN0ZXIgY2FzZSBhbmQgY2xlYW51cCBzdHJpbmcuXG4gICAgb3MgPSBTdHJpbmcob3MpO1xuXG4gICAgaWYgKHBhdHRlcm4gJiYgbGFiZWwpIHtcbiAgICAgIG9zID0gb3MucmVwbGFjZShSZWdFeHAocGF0dGVybiwgJ2knKSwgbGFiZWwpO1xuICAgIH1cblxuICAgIG9zID0gZm9ybWF0KFxuICAgICAgb3MucmVwbGFjZSgvIGNlJC9pLCAnIENFJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYmhwdy9pLCAnd2ViJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYk1hY2ludG9zaFxcYi8sICdNYWMgT1MnKVxuICAgICAgICAucmVwbGFjZSgvX1Bvd2VyUENcXGIvaSwgJyBPUycpXG4gICAgICAgIC5yZXBsYWNlKC9cXGIoT1MgWCkgW14gXFxkXSsvaSwgJyQxJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYk1hYyAoT1MgWClcXGIvLCAnJDEnKVxuICAgICAgICAucmVwbGFjZSgvXFwvKFxcZCkvLCAnICQxJylcbiAgICAgICAgLnJlcGxhY2UoL18vZywgJy4nKVxuICAgICAgICAucmVwbGFjZSgvKD86IEJlUEN8WyAuXSpmY1sgXFxkLl0rKSQvaSwgJycpXG4gICAgICAgIC5yZXBsYWNlKC9cXGJ4ODZcXC42NFxcYi9naSwgJ3g4Nl82NCcpXG4gICAgICAgIC5yZXBsYWNlKC9cXGIoV2luZG93cyBQaG9uZSkgT1NcXGIvLCAnJDEnKVxuICAgICAgICAucmVwbGFjZSgvXFxiKENocm9tZSBPUyBcXHcrKSBbXFxkLl0rXFxiLywgJyQxJylcbiAgICAgICAgLnNwbGl0KCcgb24gJylbMF1cbiAgICApO1xuXG4gICAgcmV0dXJuIG9zO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGl0ZXJhdGlvbiB1dGlsaXR5IGZvciBhcnJheXMgYW5kIG9iamVjdHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGVhY2gob2JqZWN0LCBjYWxsYmFjaykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBvYmplY3QgPyBvYmplY3QubGVuZ3RoIDogMDtcblxuICAgIGlmICh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInICYmIGxlbmd0aCA+IC0xICYmIGxlbmd0aCA8PSBtYXhTYWZlSW50ZWdlcikge1xuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgY2FsbGJhY2sob2JqZWN0W2luZGV4XSwgaW5kZXgsIG9iamVjdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvck93bihvYmplY3QsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJpbSBhbmQgY29uZGl0aW9uYWxseSBjYXBpdGFsaXplIHN0cmluZyB2YWx1ZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBmb3JtYXQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gZm9ybWF0KHN0cmluZykge1xuICAgIHN0cmluZyA9IHRyaW0oc3RyaW5nKTtcbiAgICByZXR1cm4gL14oPzp3ZWJPU3xpKD86T1N8UCkpLy50ZXN0KHN0cmluZylcbiAgICAgID8gc3RyaW5nXG4gICAgICA6IGNhcGl0YWxpemUoc3RyaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyBvdmVyIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLCBleGVjdXRpbmcgdGhlIGBjYWxsYmFja2AgZm9yIGVhY2guXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiBleGVjdXRlZCBwZXIgb3duIHByb3BlcnR5LlxuICAgKi9cbiAgZnVuY3Rpb24gZm9yT3duKG9iamVjdCwgY2FsbGJhY2spIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgICAgY2FsbGJhY2sob2JqZWN0W2tleV0sIGtleSwgb2JqZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaW50ZXJuYWwgYFtbQ2xhc3NdXWAgb2YgYSB2YWx1ZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBgW1tDbGFzc11dYC5cbiAgICovXG4gIGZ1bmN0aW9uIGdldENsYXNzT2YodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbFxuICAgICAgPyBjYXBpdGFsaXplKHZhbHVlKVxuICAgICAgOiB0b1N0cmluZy5jYWxsKHZhbHVlKS5zbGljZSg4LCAtMSk7XG4gIH1cblxuICAvKipcbiAgICogSG9zdCBvYmplY3RzIGNhbiByZXR1cm4gdHlwZSB2YWx1ZXMgdGhhdCBhcmUgZGlmZmVyZW50IGZyb20gdGhlaXIgYWN0dWFsXG4gICAqIGRhdGEgdHlwZS4gVGhlIG9iamVjdHMgd2UgYXJlIGNvbmNlcm5lZCB3aXRoIHVzdWFsbHkgcmV0dXJuIG5vbi1wcmltaXRpdmVcbiAgICogdHlwZXMgb2YgXCJvYmplY3RcIiwgXCJmdW5jdGlvblwiLCBvciBcInVua25vd25cIi5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIG93bmVyIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IFRoZSBwcm9wZXJ0eSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBwcm9wZXJ0eSB2YWx1ZSBpcyBhIG5vbi1wcmltaXRpdmUsIGVsc2UgYGZhbHNlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGlzSG9zdFR5cGUob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIHZhciB0eXBlID0gb2JqZWN0ICE9IG51bGwgPyB0eXBlb2Ygb2JqZWN0W3Byb3BlcnR5XSA6ICdudW1iZXInO1xuICAgIHJldHVybiAhL14oPzpib29sZWFufG51bWJlcnxzdHJpbmd8dW5kZWZpbmVkKSQvLnRlc3QodHlwZSkgJiZcbiAgICAgICh0eXBlID09ICdvYmplY3QnID8gISFvYmplY3RbcHJvcGVydHldIDogdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUHJlcGFyZXMgYSBzdHJpbmcgZm9yIHVzZSBpbiBhIGBSZWdFeHBgIGJ5IG1ha2luZyBoeXBoZW5zIGFuZCBzcGFjZXMgb3B0aW9uYWwuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBxdWFsaWZ5LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcXVhbGlmaWVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIHF1YWxpZnkoc3RyaW5nKSB7XG4gICAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UoLyhbIC1dKSg/ISQpL2csICckMT8nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGJhcmUtYm9uZXMgYEFycmF5I3JlZHVjZWAgbGlrZSB1dGlsaXR5IGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAqIEByZXR1cm5zIHsqfSBUaGUgYWNjdW11bGF0ZWQgcmVzdWx0LlxuICAgKi9cbiAgZnVuY3Rpb24gcmVkdWNlKGFycmF5LCBjYWxsYmFjaykge1xuICAgIHZhciBhY2N1bXVsYXRvciA9IG51bGw7XG4gICAgZWFjaChhcnJheSwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICBhY2N1bXVsYXRvciA9IGNhbGxiYWNrKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGFycmF5KTtcbiAgICB9KTtcbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlIGZyb20gYSBzdHJpbmcuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byB0cmltLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdHJpbW1lZCBzdHJpbmcuXG4gICAqL1xuICBmdW5jdGlvbiB0cmltKHN0cmluZykge1xuICAgIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKC9eICt8ICskL2csICcnKTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHBsYXRmb3JtIG9iamVjdC5cbiAgICpcbiAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gW3VhPW5hdmlnYXRvci51c2VyQWdlbnRdIFRoZSB1c2VyIGFnZW50IHN0cmluZyBvclxuICAgKiAgY29udGV4dCBvYmplY3QuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEEgcGxhdGZvcm0gb2JqZWN0LlxuICAgKi9cbiAgZnVuY3Rpb24gcGFyc2UodWEpIHtcblxuICAgIC8qKiBUaGUgZW52aXJvbm1lbnQgY29udGV4dCBvYmplY3QuICovXG4gICAgdmFyIGNvbnRleHQgPSByb290O1xuXG4gICAgLyoqIFVzZWQgdG8gZmxhZyB3aGVuIGEgY3VzdG9tIGNvbnRleHQgaXMgcHJvdmlkZWQuICovXG4gICAgdmFyIGlzQ3VzdG9tQ29udGV4dCA9IHVhICYmIHR5cGVvZiB1YSA9PSAnb2JqZWN0JyAmJiBnZXRDbGFzc09mKHVhKSAhPSAnU3RyaW5nJztcblxuICAgIC8vIEp1Z2dsZSBhcmd1bWVudHMuXG4gICAgaWYgKGlzQ3VzdG9tQ29udGV4dCkge1xuICAgICAgY29udGV4dCA9IHVhO1xuICAgICAgdWEgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKiBCcm93c2VyIG5hdmlnYXRvciBvYmplY3QuICovXG4gICAgdmFyIG5hdiA9IGNvbnRleHQubmF2aWdhdG9yIHx8IHt9O1xuXG4gICAgLyoqIEJyb3dzZXIgdXNlciBhZ2VudCBzdHJpbmcuICovXG4gICAgdmFyIHVzZXJBZ2VudCA9IG5hdi51c2VyQWdlbnQgfHwgJyc7XG5cbiAgICB1YSB8fCAodWEgPSB1c2VyQWdlbnQpO1xuXG4gICAgLyoqIFVzZWQgdG8gZmxhZyB3aGVuIGB0aGlzQmluZGluZ2AgaXMgdGhlIFtNb2R1bGVTY29wZV0uICovXG4gICAgdmFyIGlzTW9kdWxlU2NvcGUgPSBpc0N1c3RvbUNvbnRleHQgfHwgdGhpc0JpbmRpbmcgPT0gb2xkUm9vdDtcblxuICAgIC8qKiBVc2VkIHRvIGRldGVjdCBpZiBicm93c2VyIGlzIGxpa2UgQ2hyb21lLiAqL1xuICAgIHZhciBsaWtlQ2hyb21lID0gaXNDdXN0b21Db250ZXh0XG4gICAgICA/ICEhbmF2Lmxpa2VDaHJvbWVcbiAgICAgIDogL1xcYkNocm9tZVxcYi8udGVzdCh1YSkgJiYgIS9pbnRlcm5hbHxcXG4vaS50ZXN0KHRvU3RyaW5nLnRvU3RyaW5nKCkpO1xuXG4gICAgLyoqIEludGVybmFsIGBbW0NsYXNzXV1gIHZhbHVlIHNob3J0Y3V0cy4gKi9cbiAgICB2YXIgb2JqZWN0Q2xhc3MgPSAnT2JqZWN0JyxcbiAgICAgICAgYWlyUnVudGltZUNsYXNzID0gaXNDdXN0b21Db250ZXh0ID8gb2JqZWN0Q2xhc3MgOiAnU2NyaXB0QnJpZGdpbmdQcm94eU9iamVjdCcsXG4gICAgICAgIGVudmlyb0NsYXNzID0gaXNDdXN0b21Db250ZXh0ID8gb2JqZWN0Q2xhc3MgOiAnRW52aXJvbm1lbnQnLFxuICAgICAgICBqYXZhQ2xhc3MgPSAoaXNDdXN0b21Db250ZXh0ICYmIGNvbnRleHQuamF2YSkgPyAnSmF2YVBhY2thZ2UnIDogZ2V0Q2xhc3NPZihjb250ZXh0LmphdmEpLFxuICAgICAgICBwaGFudG9tQ2xhc3MgPSBpc0N1c3RvbUNvbnRleHQgPyBvYmplY3RDbGFzcyA6ICdSdW50aW1lT2JqZWN0JztcblxuICAgIC8qKiBEZXRlY3QgSmF2YSBlbnZpcm9ubWVudHMuICovXG4gICAgdmFyIGphdmEgPSAvXFxiSmF2YS8udGVzdChqYXZhQ2xhc3MpICYmIGNvbnRleHQuamF2YTtcblxuICAgIC8qKiBEZXRlY3QgUmhpbm8uICovXG4gICAgdmFyIHJoaW5vID0gamF2YSAmJiBnZXRDbGFzc09mKGNvbnRleHQuZW52aXJvbm1lbnQpID09IGVudmlyb0NsYXNzO1xuXG4gICAgLyoqIEEgY2hhcmFjdGVyIHRvIHJlcHJlc2VudCBhbHBoYS4gKi9cbiAgICB2YXIgYWxwaGEgPSBqYXZhID8gJ2EnIDogJ1xcdTAzYjEnO1xuXG4gICAgLyoqIEEgY2hhcmFjdGVyIHRvIHJlcHJlc2VudCBiZXRhLiAqL1xuICAgIHZhciBiZXRhID0gamF2YSA/ICdiJyA6ICdcXHUwM2IyJztcblxuICAgIC8qKiBCcm93c2VyIGRvY3VtZW50IG9iamVjdC4gKi9cbiAgICB2YXIgZG9jID0gY29udGV4dC5kb2N1bWVudCB8fCB7fTtcblxuICAgIC8qKlxuICAgICAqIERldGVjdCBPcGVyYSBicm93c2VyIChQcmVzdG8tYmFzZWQpLlxuICAgICAqIGh0dHA6Ly93d3cuaG93dG9jcmVhdGUuY28udWsvb3BlcmFTdHVmZi9vcGVyYU9iamVjdC5odG1sXG4gICAgICogaHR0cDovL2Rldi5vcGVyYS5jb20vYXJ0aWNsZXMvdmlldy9vcGVyYS1taW5pLXdlYi1jb250ZW50LWF1dGhvcmluZy1ndWlkZWxpbmVzLyNvcGVyYW1pbmlcbiAgICAgKi9cbiAgICB2YXIgb3BlcmEgPSBjb250ZXh0Lm9wZXJhbWluaSB8fCBjb250ZXh0Lm9wZXJhO1xuXG4gICAgLyoqIE9wZXJhIGBbW0NsYXNzXV1gLiAqL1xuICAgIHZhciBvcGVyYUNsYXNzID0gcmVPcGVyYS50ZXN0KG9wZXJhQ2xhc3MgPSAoaXNDdXN0b21Db250ZXh0ICYmIG9wZXJhKSA/IG9wZXJhWydbW0NsYXNzXV0nXSA6IGdldENsYXNzT2Yob3BlcmEpKVxuICAgICAgPyBvcGVyYUNsYXNzXG4gICAgICA6IChvcGVyYSA9IG51bGwpO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqIFRlbXBvcmFyeSB2YXJpYWJsZSB1c2VkIG92ZXIgdGhlIHNjcmlwdCdzIGxpZmV0aW1lLiAqL1xuICAgIHZhciBkYXRhO1xuXG4gICAgLyoqIFRoZSBDUFUgYXJjaGl0ZWN0dXJlLiAqL1xuICAgIHZhciBhcmNoID0gdWE7XG5cbiAgICAvKiogUGxhdGZvcm0gZGVzY3JpcHRpb24gYXJyYXkuICovXG4gICAgdmFyIGRlc2NyaXB0aW9uID0gW107XG5cbiAgICAvKiogUGxhdGZvcm0gYWxwaGEvYmV0YSBpbmRpY2F0b3IuICovXG4gICAgdmFyIHByZXJlbGVhc2UgPSBudWxsO1xuXG4gICAgLyoqIEEgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IGVudmlyb25tZW50IGZlYXR1cmVzIHNob3VsZCBiZSB1c2VkIHRvIHJlc29sdmUgdGhlIHBsYXRmb3JtLiAqL1xuICAgIHZhciB1c2VGZWF0dXJlcyA9IHVhID09IHVzZXJBZ2VudDtcblxuICAgIC8qKiBUaGUgYnJvd3Nlci9lbnZpcm9ubWVudCB2ZXJzaW9uLiAqL1xuICAgIHZhciB2ZXJzaW9uID0gdXNlRmVhdHVyZXMgJiYgb3BlcmEgJiYgdHlwZW9mIG9wZXJhLnZlcnNpb24gPT0gJ2Z1bmN0aW9uJyAmJiBvcGVyYS52ZXJzaW9uKCk7XG5cbiAgICAvKiogQSBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBPUyBlbmRzIHdpdGggXCIvIFZlcnNpb25cIiAqL1xuICAgIHZhciBpc1NwZWNpYWxDYXNlZE9TO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBsYXlvdXQgZW5naW5lcyAob3JkZXIgaXMgaW1wb3J0YW50KS4gKi9cbiAgICB2YXIgbGF5b3V0ID0gZ2V0TGF5b3V0KFtcbiAgICAgIHsgJ2xhYmVsJzogJ0VkZ2VIVE1MJywgJ3BhdHRlcm4nOiAnRWRnZScgfSxcbiAgICAgICdUcmlkZW50JyxcbiAgICAgIHsgJ2xhYmVsJzogJ1dlYktpdCcsICdwYXR0ZXJuJzogJ0FwcGxlV2ViS2l0JyB9LFxuICAgICAgJ2lDYWInLFxuICAgICAgJ1ByZXN0bycsXG4gICAgICAnTmV0RnJvbnQnLFxuICAgICAgJ1Rhc21hbicsXG4gICAgICAnS0hUTUwnLFxuICAgICAgJ0dlY2tvJ1xuICAgIF0pO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBicm93c2VyIG5hbWVzIChvcmRlciBpcyBpbXBvcnRhbnQpLiAqL1xuICAgIHZhciBuYW1lID0gZ2V0TmFtZShbXG4gICAgICAnQWRvYmUgQUlSJyxcbiAgICAgICdBcm9yYScsXG4gICAgICAnQXZhbnQgQnJvd3NlcicsXG4gICAgICAnQnJlYWNoJyxcbiAgICAgICdDYW1pbm8nLFxuICAgICAgJ0VsZWN0cm9uJyxcbiAgICAgICdFcGlwaGFueScsXG4gICAgICAnRmVubmVjJyxcbiAgICAgICdGbG9jaycsXG4gICAgICAnR2FsZW9uJyxcbiAgICAgICdHcmVlbkJyb3dzZXInLFxuICAgICAgJ2lDYWInLFxuICAgICAgJ0ljZXdlYXNlbCcsXG4gICAgICAnSy1NZWxlb24nLFxuICAgICAgJ0tvbnF1ZXJvcicsXG4gICAgICAnTHVuYXNjYXBlJyxcbiAgICAgICdNYXh0aG9uJyxcbiAgICAgIHsgJ2xhYmVsJzogJ01pY3Jvc29mdCBFZGdlJywgJ3BhdHRlcm4nOiAnRWRnZScgfSxcbiAgICAgICdNaWRvcmknLFxuICAgICAgJ05vb2sgQnJvd3NlcicsXG4gICAgICAnUGFsZU1vb24nLFxuICAgICAgJ1BoYW50b21KUycsXG4gICAgICAnUmF2ZW4nLFxuICAgICAgJ1Jla29ucScsXG4gICAgICAnUm9ja01lbHQnLFxuICAgICAgeyAnbGFiZWwnOiAnU2Ftc3VuZyBJbnRlcm5ldCcsICdwYXR0ZXJuJzogJ1NhbXN1bmdCcm93c2VyJyB9LFxuICAgICAgJ1NlYU1vbmtleScsXG4gICAgICB7ICdsYWJlbCc6ICdTaWxrJywgJ3BhdHRlcm4nOiAnKD86Q2xvdWQ5fFNpbGstQWNjZWxlcmF0ZWQpJyB9LFxuICAgICAgJ1NsZWlwbmlyJyxcbiAgICAgICdTbGltQnJvd3NlcicsXG4gICAgICB7ICdsYWJlbCc6ICdTUldhcmUgSXJvbicsICdwYXR0ZXJuJzogJ0lyb24nIH0sXG4gICAgICAnU3VucmlzZScsXG4gICAgICAnU3dpZnRmb3gnLFxuICAgICAgJ1dhdGVyZm94JyxcbiAgICAgICdXZWJQb3NpdGl2ZScsXG4gICAgICAnT3BlcmEgTWluaScsXG4gICAgICB7ICdsYWJlbCc6ICdPcGVyYSBNaW5pJywgJ3BhdHRlcm4nOiAnT1BpT1MnIH0sXG4gICAgICAnT3BlcmEnLFxuICAgICAgeyAnbGFiZWwnOiAnT3BlcmEnLCAncGF0dGVybic6ICdPUFInIH0sXG4gICAgICAnQ2hyb21lJyxcbiAgICAgIHsgJ2xhYmVsJzogJ0Nocm9tZSBNb2JpbGUnLCAncGF0dGVybic6ICcoPzpDcmlPU3xDck1vKScgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0ZpcmVmb3gnLCAncGF0dGVybic6ICcoPzpGaXJlZm94fE1pbmVmaWVsZCknIH0sXG4gICAgICB7ICdsYWJlbCc6ICdGaXJlZm94IGZvciBpT1MnLCAncGF0dGVybic6ICdGeGlPUycgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0lFJywgJ3BhdHRlcm4nOiAnSUVNb2JpbGUnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdJRScsICdwYXR0ZXJuJzogJ01TSUUnIH0sXG4gICAgICAnU2FmYXJpJ1xuICAgIF0pO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBwcm9kdWN0cyAob3JkZXIgaXMgaW1wb3J0YW50KS4gKi9cbiAgICB2YXIgcHJvZHVjdCA9IGdldFByb2R1Y3QoW1xuICAgICAgeyAnbGFiZWwnOiAnQmxhY2tCZXJyeScsICdwYXR0ZXJuJzogJ0JCMTAnIH0sXG4gICAgICAnQmxhY2tCZXJyeScsXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUycsICdwYXR0ZXJuJzogJ0dULUk5MDAwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFMyJywgJ3BhdHRlcm4nOiAnR1QtSTkxMDAnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzMnLCAncGF0dGVybic6ICdHVC1JOTMwMCcgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTNCcsICdwYXR0ZXJuJzogJ0dULUk5NTAwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFM1JywgJ3BhdHRlcm4nOiAnU00tRzkwMCcgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTNicsICdwYXR0ZXJuJzogJ1NNLUc5MjAnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzYgRWRnZScsICdwYXR0ZXJuJzogJ1NNLUc5MjUnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzcnLCAncGF0dGVybic6ICdTTS1HOTMwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFM3IEVkZ2UnLCAncGF0dGVybic6ICdTTS1HOTM1JyB9LFxuICAgICAgJ0dvb2dsZSBUVicsXG4gICAgICAnTHVtaWEnLFxuICAgICAgJ2lQYWQnLFxuICAgICAgJ2lQb2QnLFxuICAgICAgJ2lQaG9uZScsXG4gICAgICAnS2luZGxlJyxcbiAgICAgIHsgJ2xhYmVsJzogJ0tpbmRsZSBGaXJlJywgJ3BhdHRlcm4nOiAnKD86Q2xvdWQ5fFNpbGstQWNjZWxlcmF0ZWQpJyB9LFxuICAgICAgJ05leHVzJyxcbiAgICAgICdOb29rJyxcbiAgICAgICdQbGF5Qm9vaycsXG4gICAgICAnUGxheVN0YXRpb24gVml0YScsXG4gICAgICAnUGxheVN0YXRpb24nLFxuICAgICAgJ1RvdWNoUGFkJyxcbiAgICAgICdUcmFuc2Zvcm1lcicsXG4gICAgICB7ICdsYWJlbCc6ICdXaWkgVScsICdwYXR0ZXJuJzogJ1dpaVUnIH0sXG4gICAgICAnV2lpJyxcbiAgICAgICdYYm94IE9uZScsXG4gICAgICB7ICdsYWJlbCc6ICdYYm94IDM2MCcsICdwYXR0ZXJuJzogJ1hib3gnIH0sXG4gICAgICAnWG9vbSdcbiAgICBdKTtcblxuICAgIC8qIERldGVjdGFibGUgbWFudWZhY3R1cmVycy4gKi9cbiAgICB2YXIgbWFudWZhY3R1cmVyID0gZ2V0TWFudWZhY3R1cmVyKHtcbiAgICAgICdBcHBsZSc6IHsgJ2lQYWQnOiAxLCAnaVBob25lJzogMSwgJ2lQb2QnOiAxIH0sXG4gICAgICAnQXJjaG9zJzoge30sXG4gICAgICAnQW1hem9uJzogeyAnS2luZGxlJzogMSwgJ0tpbmRsZSBGaXJlJzogMSB9LFxuICAgICAgJ0FzdXMnOiB7ICdUcmFuc2Zvcm1lcic6IDEgfSxcbiAgICAgICdCYXJuZXMgJiBOb2JsZSc6IHsgJ05vb2snOiAxIH0sXG4gICAgICAnQmxhY2tCZXJyeSc6IHsgJ1BsYXlCb29rJzogMSB9LFxuICAgICAgJ0dvb2dsZSc6IHsgJ0dvb2dsZSBUVic6IDEsICdOZXh1cyc6IDEgfSxcbiAgICAgICdIUCc6IHsgJ1RvdWNoUGFkJzogMSB9LFxuICAgICAgJ0hUQyc6IHt9LFxuICAgICAgJ0xHJzoge30sXG4gICAgICAnTWljcm9zb2Z0JzogeyAnWGJveCc6IDEsICdYYm94IE9uZSc6IDEgfSxcbiAgICAgICdNb3Rvcm9sYSc6IHsgJ1hvb20nOiAxIH0sXG4gICAgICAnTmludGVuZG8nOiB7ICdXaWkgVSc6IDEsICAnV2lpJzogMSB9LFxuICAgICAgJ05va2lhJzogeyAnTHVtaWEnOiAxIH0sXG4gICAgICAnU2Ftc3VuZyc6IHsgJ0dhbGF4eSBTJzogMSwgJ0dhbGF4eSBTMic6IDEsICdHYWxheHkgUzMnOiAxLCAnR2FsYXh5IFM0JzogMSB9LFxuICAgICAgJ1NvbnknOiB7ICdQbGF5U3RhdGlvbic6IDEsICdQbGF5U3RhdGlvbiBWaXRhJzogMSB9XG4gICAgfSk7XG5cbiAgICAvKiBEZXRlY3RhYmxlIG9wZXJhdGluZyBzeXN0ZW1zIChvcmRlciBpcyBpbXBvcnRhbnQpLiAqL1xuICAgIHZhciBvcyA9IGdldE9TKFtcbiAgICAgICdXaW5kb3dzIFBob25lJyxcbiAgICAgICdBbmRyb2lkJyxcbiAgICAgICdDZW50T1MnLFxuICAgICAgeyAnbGFiZWwnOiAnQ2hyb21lIE9TJywgJ3BhdHRlcm4nOiAnQ3JPUycgfSxcbiAgICAgICdEZWJpYW4nLFxuICAgICAgJ0ZlZG9yYScsXG4gICAgICAnRnJlZUJTRCcsXG4gICAgICAnR2VudG9vJyxcbiAgICAgICdIYWlrdScsXG4gICAgICAnS3VidW50dScsXG4gICAgICAnTGludXggTWludCcsXG4gICAgICAnT3BlbkJTRCcsXG4gICAgICAnUmVkIEhhdCcsXG4gICAgICAnU3VTRScsXG4gICAgICAnVWJ1bnR1JyxcbiAgICAgICdYdWJ1bnR1JyxcbiAgICAgICdDeWd3aW4nLFxuICAgICAgJ1N5bWJpYW4gT1MnLFxuICAgICAgJ2hwd09TJyxcbiAgICAgICd3ZWJPUyAnLFxuICAgICAgJ3dlYk9TJyxcbiAgICAgICdUYWJsZXQgT1MnLFxuICAgICAgJ1RpemVuJyxcbiAgICAgICdMaW51eCcsXG4gICAgICAnTWFjIE9TIFgnLFxuICAgICAgJ01hY2ludG9zaCcsXG4gICAgICAnTWFjJyxcbiAgICAgICdXaW5kb3dzIDk4OycsXG4gICAgICAnV2luZG93cyAnXG4gICAgXSk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBQaWNrcyB0aGUgbGF5b3V0IGVuZ2luZSBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBsYXlvdXQgZW5naW5lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldExheW91dChndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgZ3Vlc3MpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCBSZWdFeHAoJ1xcXFxiJyArIChcbiAgICAgICAgICBndWVzcy5wYXR0ZXJuIHx8IHF1YWxpZnkoZ3Vlc3MpXG4gICAgICAgICkgKyAnXFxcXGInLCAnaScpLmV4ZWModWEpICYmIChndWVzcy5sYWJlbCB8fCBndWVzcyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaWNrcyB0aGUgbWFudWZhY3R1cmVyIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBvYmplY3Qgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBtYW51ZmFjdHVyZXIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TWFudWZhY3R1cmVyKGd1ZXNzZXMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UoZ3Vlc3NlcywgZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgICAgIC8vIExvb2t1cCB0aGUgbWFudWZhY3R1cmVyIGJ5IHByb2R1Y3Qgb3Igc2NhbiB0aGUgVUEgZm9yIHRoZSBtYW51ZmFjdHVyZXIuXG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgKFxuICAgICAgICAgIHZhbHVlW3Byb2R1Y3RdIHx8XG4gICAgICAgICAgdmFsdWVbL15bYS16XSsoPzogK1thLXpdK1xcYikqL2kuZXhlYyhwcm9kdWN0KV0gfHxcbiAgICAgICAgICBSZWdFeHAoJ1xcXFxiJyArIHF1YWxpZnkoa2V5KSArICcoPzpcXFxcYnxcXFxcdypcXFxcZCknLCAnaScpLmV4ZWModWEpXG4gICAgICAgICkgJiYga2V5O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIGJyb3dzZXIgbmFtZSBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBicm93c2VyIG5hbWUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TmFtZShndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgZ3Vlc3MpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCBSZWdFeHAoJ1xcXFxiJyArIChcbiAgICAgICAgICBndWVzcy5wYXR0ZXJuIHx8IHF1YWxpZnkoZ3Vlc3MpXG4gICAgICAgICkgKyAnXFxcXGInLCAnaScpLmV4ZWModWEpICYmIChndWVzcy5sYWJlbCB8fCBndWVzcyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaWNrcyB0aGUgT1MgbmFtZSBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBPUyBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE9TKGd1ZXNzZXMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UoZ3Vlc3NlcywgZnVuY3Rpb24ocmVzdWx0LCBndWVzcykge1xuICAgICAgICB2YXIgcGF0dGVybiA9IGd1ZXNzLnBhdHRlcm4gfHwgcXVhbGlmeShndWVzcyk7XG4gICAgICAgIGlmICghcmVzdWx0ICYmIChyZXN1bHQgPVxuICAgICAgICAgICAgICBSZWdFeHAoJ1xcXFxiJyArIHBhdHRlcm4gKyAnKD86L1tcXFxcZC5dK3xbIFxcXFx3Ll0qKScsICdpJykuZXhlYyh1YSlcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICByZXN1bHQgPSBjbGVhbnVwT1MocmVzdWx0LCBwYXR0ZXJuLCBndWVzcy5sYWJlbCB8fCBndWVzcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpY2tzIHRoZSBwcm9kdWN0IG5hbWUgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgcHJvZHVjdCBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFByb2R1Y3QoZ3Vlc3Nlcykge1xuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XG4gICAgICAgIHZhciBwYXR0ZXJuID0gZ3Vlc3MucGF0dGVybiB8fCBxdWFsaWZ5KGd1ZXNzKTtcbiAgICAgICAgaWYgKCFyZXN1bHQgJiYgKHJlc3VsdCA9XG4gICAgICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcGF0dGVybiArICcgKlxcXFxkK1suXFxcXHdfXSonLCAnaScpLmV4ZWModWEpIHx8XG4gICAgICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcGF0dGVybiArICcgKlxcXFx3Ky1bXFxcXHddKicsICdpJykuZXhlYyh1YSkgfHxcbiAgICAgICAgICAgICAgUmVnRXhwKCdcXFxcYicgKyBwYXR0ZXJuICsgJyg/OjsgKig/OlthLXpdK1tfLV0pP1thLXpdK1xcXFxkK3xbXiAoKTstXSopJywgJ2knKS5leGVjKHVhKVxuICAgICAgICAgICAgKSkge1xuICAgICAgICAgIC8vIFNwbGl0IGJ5IGZvcndhcmQgc2xhc2ggYW5kIGFwcGVuZCBwcm9kdWN0IHZlcnNpb24gaWYgbmVlZGVkLlxuICAgICAgICAgIGlmICgocmVzdWx0ID0gU3RyaW5nKChndWVzcy5sYWJlbCAmJiAhUmVnRXhwKHBhdHRlcm4sICdpJykudGVzdChndWVzcy5sYWJlbCkpID8gZ3Vlc3MubGFiZWwgOiByZXN1bHQpLnNwbGl0KCcvJykpWzFdICYmICEvW1xcZC5dKy8udGVzdChyZXN1bHRbMF0pKSB7XG4gICAgICAgICAgICByZXN1bHRbMF0gKz0gJyAnICsgcmVzdWx0WzFdO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBDb3JyZWN0IGNoYXJhY3RlciBjYXNlIGFuZCBjbGVhbnVwIHN0cmluZy5cbiAgICAgICAgICBndWVzcyA9IGd1ZXNzLmxhYmVsIHx8IGd1ZXNzO1xuICAgICAgICAgIHJlc3VsdCA9IGZvcm1hdChyZXN1bHRbMF1cbiAgICAgICAgICAgIC5yZXBsYWNlKFJlZ0V4cChwYXR0ZXJuLCAnaScpLCBndWVzcylcbiAgICAgICAgICAgIC5yZXBsYWNlKFJlZ0V4cCgnOyAqKD86JyArIGd1ZXNzICsgJ1tfLV0pPycsICdpJyksICcgJylcbiAgICAgICAgICAgIC5yZXBsYWNlKFJlZ0V4cCgnKCcgKyBndWVzcyArICcpWy1fLl0/KFxcXFx3KScsICdpJyksICckMSAkMicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZXMgdGhlIHZlcnNpb24gdXNpbmcgYW4gYXJyYXkgb2YgVUEgcGF0dGVybnMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHBhdHRlcm5zIEFuIGFycmF5IG9mIFVBIHBhdHRlcm5zLlxuICAgICAqIEByZXR1cm5zIHtudWxsfHN0cmluZ30gVGhlIGRldGVjdGVkIHZlcnNpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VmVyc2lvbihwYXR0ZXJucykge1xuICAgICAgcmV0dXJuIHJlZHVjZShwYXR0ZXJucywgZnVuY3Rpb24ocmVzdWx0LCBwYXR0ZXJuKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgKFJlZ0V4cChwYXR0ZXJuICtcbiAgICAgICAgICAnKD86LVtcXFxcZC5dKy98KD86IGZvciBbXFxcXHctXSspP1sgLy1dKShbXFxcXGQuXStbXiAoKTsvXy1dKiknLCAnaScpLmV4ZWModWEpIHx8IDApWzFdIHx8IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGBwbGF0Zm9ybS5kZXNjcmlwdGlvbmAgd2hlbiB0aGUgcGxhdGZvcm0gb2JqZWN0IGlzIGNvZXJjZWQgdG8gYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAbmFtZSB0b1N0cmluZ1xuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgYHBsYXRmb3JtLmRlc2NyaXB0aW9uYCBpZiBhdmFpbGFibGUsIGVsc2UgYW4gZW1wdHkgc3RyaW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRvU3RyaW5nUGxhdGZvcm0oKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbiB8fCAnJztcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvLyBDb252ZXJ0IGxheW91dCB0byBhbiBhcnJheSBzbyB3ZSBjYW4gYWRkIGV4dHJhIGRldGFpbHMuXG4gICAgbGF5b3V0ICYmIChsYXlvdXQgPSBbbGF5b3V0XSk7XG5cbiAgICAvLyBEZXRlY3QgcHJvZHVjdCBuYW1lcyB0aGF0IGNvbnRhaW4gdGhlaXIgbWFudWZhY3R1cmVyJ3MgbmFtZS5cbiAgICBpZiAobWFudWZhY3R1cmVyICYmICFwcm9kdWN0KSB7XG4gICAgICBwcm9kdWN0ID0gZ2V0UHJvZHVjdChbbWFudWZhY3R1cmVyXSk7XG4gICAgfVxuICAgIC8vIENsZWFuIHVwIEdvb2dsZSBUVi5cbiAgICBpZiAoKGRhdGEgPSAvXFxiR29vZ2xlIFRWXFxiLy5leGVjKHByb2R1Y3QpKSkge1xuICAgICAgcHJvZHVjdCA9IGRhdGFbMF07XG4gICAgfVxuICAgIC8vIERldGVjdCBzaW11bGF0b3JzLlxuICAgIGlmICgvXFxiU2ltdWxhdG9yXFxiL2kudGVzdCh1YSkpIHtcbiAgICAgIHByb2R1Y3QgPSAocHJvZHVjdCA/IHByb2R1Y3QgKyAnICcgOiAnJykgKyAnU2ltdWxhdG9yJztcbiAgICB9XG4gICAgLy8gRGV0ZWN0IE9wZXJhIE1pbmkgOCsgcnVubmluZyBpbiBUdXJiby9VbmNvbXByZXNzZWQgbW9kZSBvbiBpT1MuXG4gICAgaWYgKG5hbWUgPT0gJ09wZXJhIE1pbmknICYmIC9cXGJPUGlPU1xcYi8udGVzdCh1YSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ3J1bm5pbmcgaW4gVHVyYm8vVW5jb21wcmVzc2VkIG1vZGUnKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IElFIE1vYmlsZSAxMS5cbiAgICBpZiAobmFtZSA9PSAnSUUnICYmIC9cXGJsaWtlIGlQaG9uZSBPU1xcYi8udGVzdCh1YSkpIHtcbiAgICAgIGRhdGEgPSBwYXJzZSh1YS5yZXBsYWNlKC9saWtlIGlQaG9uZSBPUy8sICcnKSk7XG4gICAgICBtYW51ZmFjdHVyZXIgPSBkYXRhLm1hbnVmYWN0dXJlcjtcbiAgICAgIHByb2R1Y3QgPSBkYXRhLnByb2R1Y3Q7XG4gICAgfVxuICAgIC8vIERldGVjdCBpT1MuXG4gICAgZWxzZSBpZiAoL15pUC8udGVzdChwcm9kdWN0KSkge1xuICAgICAgbmFtZSB8fCAobmFtZSA9ICdTYWZhcmknKTtcbiAgICAgIG9zID0gJ2lPUycgKyAoKGRhdGEgPSAvIE9TIChbXFxkX10rKS9pLmV4ZWModWEpKVxuICAgICAgICA/ICcgJyArIGRhdGFbMV0ucmVwbGFjZSgvXy9nLCAnLicpXG4gICAgICAgIDogJycpO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgS3VidW50dS5cbiAgICBlbHNlIGlmIChuYW1lID09ICdLb25xdWVyb3InICYmICEvYnVudHUvaS50ZXN0KG9zKSkge1xuICAgICAgb3MgPSAnS3VidW50dSc7XG4gICAgfVxuICAgIC8vIERldGVjdCBBbmRyb2lkIGJyb3dzZXJzLlxuICAgIGVsc2UgaWYgKChtYW51ZmFjdHVyZXIgJiYgbWFudWZhY3R1cmVyICE9ICdHb29nbGUnICYmXG4gICAgICAgICgoL0Nocm9tZS8udGVzdChuYW1lKSAmJiAhL1xcYk1vYmlsZSBTYWZhcmlcXGIvaS50ZXN0KHVhKSkgfHwgL1xcYlZpdGFcXGIvLnRlc3QocHJvZHVjdCkpKSB8fFxuICAgICAgICAoL1xcYkFuZHJvaWRcXGIvLnRlc3Qob3MpICYmIC9eQ2hyb21lLy50ZXN0KG5hbWUpICYmIC9cXGJWZXJzaW9uXFwvL2kudGVzdCh1YSkpKSB7XG4gICAgICBuYW1lID0gJ0FuZHJvaWQgQnJvd3Nlcic7XG4gICAgICBvcyA9IC9cXGJBbmRyb2lkXFxiLy50ZXN0KG9zKSA/IG9zIDogJ0FuZHJvaWQnO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgU2lsayBkZXNrdG9wL2FjY2VsZXJhdGVkIG1vZGVzLlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ1NpbGsnKSB7XG4gICAgICBpZiAoIS9cXGJNb2JpL2kudGVzdCh1YSkpIHtcbiAgICAgICAgb3MgPSAnQW5kcm9pZCc7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgICAgfVxuICAgICAgaWYgKC9BY2NlbGVyYXRlZCAqPSAqdHJ1ZS9pLnRlc3QodWEpKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2FjY2VsZXJhdGVkJyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIERldGVjdCBQYWxlTW9vbiBpZGVudGlmeWluZyBhcyBGaXJlZm94LlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ1BhbGVNb29uJyAmJiAoZGF0YSA9IC9cXGJGaXJlZm94XFwvKFtcXGQuXSspXFxiLy5leGVjKHVhKSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ2lkZW50aWZ5aW5nIGFzIEZpcmVmb3ggJyArIGRhdGFbMV0pO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgRmlyZWZveCBPUyBhbmQgcHJvZHVjdHMgcnVubmluZyBGaXJlZm94LlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ0ZpcmVmb3gnICYmIChkYXRhID0gL1xcYihNb2JpbGV8VGFibGV0fFRWKVxcYi9pLmV4ZWModWEpKSkge1xuICAgICAgb3MgfHwgKG9zID0gJ0ZpcmVmb3ggT1MnKTtcbiAgICAgIHByb2R1Y3QgfHwgKHByb2R1Y3QgPSBkYXRhWzFdKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlcyBmb3IgRmlyZWZveC9TYWZhcmkuXG4gICAgZWxzZSBpZiAoIW5hbWUgfHwgKGRhdGEgPSAhL1xcYk1pbmVmaWVsZFxcYi9pLnRlc3QodWEpICYmIC9cXGIoPzpGaXJlZm94fFNhZmFyaSlcXGIvLmV4ZWMobmFtZSkpKSB7XG4gICAgICAvLyBFc2NhcGUgdGhlIGAvYCBmb3IgRmlyZWZveCAxLlxuICAgICAgaWYgKG5hbWUgJiYgIXByb2R1Y3QgJiYgL1tcXC8sXXxeW14oXSs/XFwpLy50ZXN0KHVhLnNsaWNlKHVhLmluZGV4T2YoZGF0YSArICcvJykgKyA4KSkpIHtcbiAgICAgICAgLy8gQ2xlYXIgbmFtZSBvZiBmYWxzZSBwb3NpdGl2ZXMuXG4gICAgICAgIG5hbWUgPSBudWxsO1xuICAgICAgfVxuICAgICAgLy8gUmVhc3NpZ24gYSBnZW5lcmljIG5hbWUuXG4gICAgICBpZiAoKGRhdGEgPSBwcm9kdWN0IHx8IG1hbnVmYWN0dXJlciB8fCBvcykgJiZcbiAgICAgICAgICAocHJvZHVjdCB8fCBtYW51ZmFjdHVyZXIgfHwgL1xcYig/OkFuZHJvaWR8U3ltYmlhbiBPU3xUYWJsZXQgT1N8d2ViT1MpXFxiLy50ZXN0KG9zKSkpIHtcbiAgICAgICAgbmFtZSA9IC9bYS16XSsoPzogSGF0KT8vaS5leGVjKC9cXGJBbmRyb2lkXFxiLy50ZXN0KG9zKSA/IG9zIDogZGF0YSkgKyAnIEJyb3dzZXInO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBZGQgQ2hyb21lIHZlcnNpb24gdG8gZGVzY3JpcHRpb24gZm9yIEVsZWN0cm9uLlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ0VsZWN0cm9uJyAmJiAoZGF0YSA9ICgvXFxiQ2hyb21lXFwvKFtcXGQuXSspXFxiLy5leGVjKHVhKSB8fCAwKVsxXSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ0Nocm9taXVtICcgKyBkYXRhKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IG5vbi1PcGVyYSAoUHJlc3RvLWJhc2VkKSB2ZXJzaW9ucyAob3JkZXIgaXMgaW1wb3J0YW50KS5cbiAgICBpZiAoIXZlcnNpb24pIHtcbiAgICAgIHZlcnNpb24gPSBnZXRWZXJzaW9uKFtcbiAgICAgICAgJyg/OkNsb3VkOXxDcmlPU3xDck1vfEVkZ2V8RnhpT1N8SUVNb2JpbGV8SXJvbnxPcGVyYSA/TWluaXxPUGlPU3xPUFJ8UmF2ZW58U2Ftc3VuZ0Jyb3dzZXJ8U2lsayg/IS9bXFxcXGQuXSskKSknLFxuICAgICAgICAnVmVyc2lvbicsXG4gICAgICAgIHF1YWxpZnkobmFtZSksXG4gICAgICAgICcoPzpGaXJlZm94fE1pbmVmaWVsZHxOZXRGcm9udCknXG4gICAgICBdKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IHN0dWJib3JuIGxheW91dCBlbmdpbmVzLlxuICAgIGlmICgoZGF0YSA9XG4gICAgICAgICAgbGF5b3V0ID09ICdpQ2FiJyAmJiBwYXJzZUZsb2F0KHZlcnNpb24pID4gMyAmJiAnV2ViS2l0JyB8fFxuICAgICAgICAgIC9cXGJPcGVyYVxcYi8udGVzdChuYW1lKSAmJiAoL1xcYk9QUlxcYi8udGVzdCh1YSkgPyAnQmxpbmsnIDogJ1ByZXN0bycpIHx8XG4gICAgICAgICAgL1xcYig/Ok1pZG9yaXxOb29rfFNhZmFyaSlcXGIvaS50ZXN0KHVhKSAmJiAhL14oPzpUcmlkZW50fEVkZ2VIVE1MKSQvLnRlc3QobGF5b3V0KSAmJiAnV2ViS2l0JyB8fFxuICAgICAgICAgICFsYXlvdXQgJiYgL1xcYk1TSUVcXGIvaS50ZXN0KHVhKSAmJiAob3MgPT0gJ01hYyBPUycgPyAnVGFzbWFuJyA6ICdUcmlkZW50JykgfHxcbiAgICAgICAgICBsYXlvdXQgPT0gJ1dlYktpdCcgJiYgL1xcYlBsYXlTdGF0aW9uXFxiKD8hIFZpdGFcXGIpL2kudGVzdChuYW1lKSAmJiAnTmV0RnJvbnQnXG4gICAgICAgICkpIHtcbiAgICAgIGxheW91dCA9IFtkYXRhXTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IFdpbmRvd3MgUGhvbmUgNyBkZXNrdG9wIG1vZGUuXG4gICAgaWYgKG5hbWUgPT0gJ0lFJyAmJiAoZGF0YSA9ICgvOyAqKD86WEJMV1B8WnVuZVdQKShcXGQrKS9pLmV4ZWModWEpIHx8IDApWzFdKSkge1xuICAgICAgbmFtZSArPSAnIE1vYmlsZSc7XG4gICAgICBvcyA9ICdXaW5kb3dzIFBob25lICcgKyAoL1xcKyQvLnRlc3QoZGF0YSkgPyBkYXRhIDogZGF0YSArICcueCcpO1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XG4gICAgfVxuICAgIC8vIERldGVjdCBXaW5kb3dzIFBob25lIDgueCBkZXNrdG9wIG1vZGUuXG4gICAgZWxzZSBpZiAoL1xcYldQRGVza3RvcFxcYi9pLnRlc3QodWEpKSB7XG4gICAgICBuYW1lID0gJ0lFIE1vYmlsZSc7XG4gICAgICBvcyA9ICdXaW5kb3dzIFBob25lIDgueCc7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdkZXNrdG9wIG1vZGUnKTtcbiAgICAgIHZlcnNpb24gfHwgKHZlcnNpb24gPSAoL1xcYnJ2OihbXFxkLl0rKS8uZXhlYyh1YSkgfHwgMClbMV0pO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgSUUgMTEgaWRlbnRpZnlpbmcgYXMgb3RoZXIgYnJvd3NlcnMuXG4gICAgZWxzZSBpZiAobmFtZSAhPSAnSUUnICYmIGxheW91dCA9PSAnVHJpZGVudCcgJiYgKGRhdGEgPSAvXFxicnY6KFtcXGQuXSspLy5leGVjKHVhKSkpIHtcbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ2lkZW50aWZ5aW5nIGFzICcgKyBuYW1lICsgKHZlcnNpb24gPyAnICcgKyB2ZXJzaW9uIDogJycpKTtcbiAgICAgIH1cbiAgICAgIG5hbWUgPSAnSUUnO1xuICAgICAgdmVyc2lvbiA9IGRhdGFbMV07XG4gICAgfVxuICAgIC8vIExldmVyYWdlIGVudmlyb25tZW50IGZlYXR1cmVzLlxuICAgIGlmICh1c2VGZWF0dXJlcykge1xuICAgICAgLy8gRGV0ZWN0IHNlcnZlci1zaWRlIGVudmlyb25tZW50cy5cbiAgICAgIC8vIFJoaW5vIGhhcyBhIGdsb2JhbCBmdW5jdGlvbiB3aGlsZSBvdGhlcnMgaGF2ZSBhIGdsb2JhbCBvYmplY3QuXG4gICAgICBpZiAoaXNIb3N0VHlwZShjb250ZXh0LCAnZ2xvYmFsJykpIHtcbiAgICAgICAgaWYgKGphdmEpIHtcbiAgICAgICAgICBkYXRhID0gamF2YS5sYW5nLlN5c3RlbTtcbiAgICAgICAgICBhcmNoID0gZGF0YS5nZXRQcm9wZXJ0eSgnb3MuYXJjaCcpO1xuICAgICAgICAgIG9zID0gb3MgfHwgZGF0YS5nZXRQcm9wZXJ0eSgnb3MubmFtZScpICsgJyAnICsgZGF0YS5nZXRQcm9wZXJ0eSgnb3MudmVyc2lvbicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc01vZHVsZVNjb3BlICYmIGlzSG9zdFR5cGUoY29udGV4dCwgJ3N5c3RlbScpICYmIChkYXRhID0gW2NvbnRleHQuc3lzdGVtXSlbMF0pIHtcbiAgICAgICAgICBvcyB8fCAob3MgPSBkYXRhWzBdLm9zIHx8IG51bGwpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkYXRhWzFdID0gY29udGV4dC5yZXF1aXJlKCdyaW5nby9lbmdpbmUnKS52ZXJzaW9uO1xuICAgICAgICAgICAgdmVyc2lvbiA9IGRhdGFbMV0uam9pbignLicpO1xuICAgICAgICAgICAgbmFtZSA9ICdSaW5nb0pTJztcbiAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGlmIChkYXRhWzBdLmdsb2JhbC5zeXN0ZW0gPT0gY29udGV4dC5zeXN0ZW0pIHtcbiAgICAgICAgICAgICAgbmFtZSA9ICdOYXJ3aGFsJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoXG4gICAgICAgICAgdHlwZW9mIGNvbnRleHQucHJvY2VzcyA9PSAnb2JqZWN0JyAmJiAhY29udGV4dC5wcm9jZXNzLmJyb3dzZXIgJiZcbiAgICAgICAgICAoZGF0YSA9IGNvbnRleHQucHJvY2VzcylcbiAgICAgICAgKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLnZlcnNpb25zID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEudmVyc2lvbnMuZWxlY3Ryb24gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb24ucHVzaCgnTm9kZSAnICsgZGF0YS52ZXJzaW9ucy5ub2RlKTtcbiAgICAgICAgICAgICAgbmFtZSA9ICdFbGVjdHJvbic7XG4gICAgICAgICAgICAgIHZlcnNpb24gPSBkYXRhLnZlcnNpb25zLmVsZWN0cm9uO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZGF0YS52ZXJzaW9ucy5udyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICBkZXNjcmlwdGlvbi5wdXNoKCdDaHJvbWl1bSAnICsgdmVyc2lvbiwgJ05vZGUgJyArIGRhdGEudmVyc2lvbnMubm9kZSk7XG4gICAgICAgICAgICAgIG5hbWUgPSAnTlcuanMnO1xuICAgICAgICAgICAgICB2ZXJzaW9uID0gZGF0YS52ZXJzaW9ucy5udztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmFtZSA9ICdOb2RlLmpzJztcbiAgICAgICAgICAgIGFyY2ggPSBkYXRhLmFyY2g7XG4gICAgICAgICAgICBvcyA9IGRhdGEucGxhdGZvcm07XG4gICAgICAgICAgICB2ZXJzaW9uID0gL1tcXGQuXSsvLmV4ZWMoZGF0YS52ZXJzaW9uKVxuICAgICAgICAgICAgdmVyc2lvbiA9IHZlcnNpb24gPyB2ZXJzaW9uWzBdIDogJ3Vua25vd24nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyaGlubykge1xuICAgICAgICAgIG5hbWUgPSAnUmhpbm8nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBEZXRlY3QgQWRvYmUgQUlSLlxuICAgICAgZWxzZSBpZiAoZ2V0Q2xhc3NPZigoZGF0YSA9IGNvbnRleHQucnVudGltZSkpID09IGFpclJ1bnRpbWVDbGFzcykge1xuICAgICAgICBuYW1lID0gJ0Fkb2JlIEFJUic7XG4gICAgICAgIG9zID0gZGF0YS5mbGFzaC5zeXN0ZW0uQ2FwYWJpbGl0aWVzLm9zO1xuICAgICAgfVxuICAgICAgLy8gRGV0ZWN0IFBoYW50b21KUy5cbiAgICAgIGVsc2UgaWYgKGdldENsYXNzT2YoKGRhdGEgPSBjb250ZXh0LnBoYW50b20pKSA9PSBwaGFudG9tQ2xhc3MpIHtcbiAgICAgICAgbmFtZSA9ICdQaGFudG9tSlMnO1xuICAgICAgICB2ZXJzaW9uID0gKGRhdGEgPSBkYXRhLnZlcnNpb24gfHwgbnVsbCkgJiYgKGRhdGEubWFqb3IgKyAnLicgKyBkYXRhLm1pbm9yICsgJy4nICsgZGF0YS5wYXRjaCk7XG4gICAgICB9XG4gICAgICAvLyBEZXRlY3QgSUUgY29tcGF0aWJpbGl0eSBtb2Rlcy5cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBkb2MuZG9jdW1lbnRNb2RlID09ICdudW1iZXInICYmIChkYXRhID0gL1xcYlRyaWRlbnRcXC8oXFxkKykvaS5leGVjKHVhKSkpIHtcbiAgICAgICAgLy8gV2UncmUgaW4gY29tcGF0aWJpbGl0eSBtb2RlIHdoZW4gdGhlIFRyaWRlbnQgdmVyc2lvbiArIDQgZG9lc24ndFxuICAgICAgICAvLyBlcXVhbCB0aGUgZG9jdW1lbnQgbW9kZS5cbiAgICAgICAgdmVyc2lvbiA9IFt2ZXJzaW9uLCBkb2MuZG9jdW1lbnRNb2RlXTtcbiAgICAgICAgaWYgKChkYXRhID0gK2RhdGFbMV0gKyA0KSAhPSB2ZXJzaW9uWzFdKSB7XG4gICAgICAgICAgZGVzY3JpcHRpb24ucHVzaCgnSUUgJyArIHZlcnNpb25bMV0gKyAnIG1vZGUnKTtcbiAgICAgICAgICBsYXlvdXQgJiYgKGxheW91dFsxXSA9ICcnKTtcbiAgICAgICAgICB2ZXJzaW9uWzFdID0gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICB2ZXJzaW9uID0gbmFtZSA9PSAnSUUnID8gU3RyaW5nKHZlcnNpb25bMV0udG9GaXhlZCgxKSkgOiB2ZXJzaW9uWzBdO1xuICAgICAgfVxuICAgICAgLy8gRGV0ZWN0IElFIDExIG1hc2tpbmcgYXMgb3RoZXIgYnJvd3NlcnMuXG4gICAgICBlbHNlIGlmICh0eXBlb2YgZG9jLmRvY3VtZW50TW9kZSA9PSAnbnVtYmVyJyAmJiAvXig/OkNocm9tZXxGaXJlZm94KVxcYi8udGVzdChuYW1lKSkge1xuICAgICAgICBkZXNjcmlwdGlvbi5wdXNoKCdtYXNraW5nIGFzICcgKyBuYW1lICsgJyAnICsgdmVyc2lvbik7XG4gICAgICAgIG5hbWUgPSAnSUUnO1xuICAgICAgICB2ZXJzaW9uID0gJzExLjAnO1xuICAgICAgICBsYXlvdXQgPSBbJ1RyaWRlbnQnXTtcbiAgICAgICAgb3MgPSAnV2luZG93cyc7XG4gICAgICB9XG4gICAgICBvcyA9IG9zICYmIGZvcm1hdChvcyk7XG4gICAgfVxuICAgIC8vIERldGVjdCBwcmVyZWxlYXNlIHBoYXNlcy5cbiAgICBpZiAodmVyc2lvbiAmJiAoZGF0YSA9XG4gICAgICAgICAgLyg/OlthYl18ZHB8cHJlfFthYl1cXGQrcHJlKSg/OlxcZCtcXCs/KT8kL2kuZXhlYyh2ZXJzaW9uKSB8fFxuICAgICAgICAgIC8oPzphbHBoYXxiZXRhKSg/OiA/XFxkKT8vaS5leGVjKHVhICsgJzsnICsgKHVzZUZlYXR1cmVzICYmIG5hdi5hcHBNaW5vclZlcnNpb24pKSB8fFxuICAgICAgICAgIC9cXGJNaW5lZmllbGRcXGIvaS50ZXN0KHVhKSAmJiAnYSdcbiAgICAgICAgKSkge1xuICAgICAgcHJlcmVsZWFzZSA9IC9iL2kudGVzdChkYXRhKSA/ICdiZXRhJyA6ICdhbHBoYSc7XG4gICAgICB2ZXJzaW9uID0gdmVyc2lvbi5yZXBsYWNlKFJlZ0V4cChkYXRhICsgJ1xcXFwrPyQnKSwgJycpICtcbiAgICAgICAgKHByZXJlbGVhc2UgPT0gJ2JldGEnID8gYmV0YSA6IGFscGhhKSArICgvXFxkK1xcKz8vLmV4ZWMoZGF0YSkgfHwgJycpO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgRmlyZWZveCBNb2JpbGUuXG4gICAgaWYgKG5hbWUgPT0gJ0Zlbm5lYycgfHwgbmFtZSA9PSAnRmlyZWZveCcgJiYgL1xcYig/OkFuZHJvaWR8RmlyZWZveCBPUylcXGIvLnRlc3Qob3MpKSB7XG4gICAgICBuYW1lID0gJ0ZpcmVmb3ggTW9iaWxlJztcbiAgICB9XG4gICAgLy8gT2JzY3VyZSBNYXh0aG9uJ3MgdW5yZWxpYWJsZSB2ZXJzaW9uLlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ01heHRob24nICYmIHZlcnNpb24pIHtcbiAgICAgIHZlcnNpb24gPSB2ZXJzaW9uLnJlcGxhY2UoL1xcLltcXGQuXSsvLCAnLngnKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IFhib3ggMzYwIGFuZCBYYm94IE9uZS5cbiAgICBlbHNlIGlmICgvXFxiWGJveFxcYi9pLnRlc3QocHJvZHVjdCkpIHtcbiAgICAgIGlmIChwcm9kdWN0ID09ICdYYm94IDM2MCcpIHtcbiAgICAgICAgb3MgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKHByb2R1Y3QgPT0gJ1hib3ggMzYwJyAmJiAvXFxiSUVNb2JpbGVcXGIvLnRlc3QodWEpKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ21vYmlsZSBtb2RlJyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEFkZCBtb2JpbGUgcG9zdGZpeC5cbiAgICBlbHNlIGlmICgoL14oPzpDaHJvbWV8SUV8T3BlcmEpJC8udGVzdChuYW1lKSB8fCBuYW1lICYmICFwcm9kdWN0ICYmICEvQnJvd3NlcnxNb2JpLy50ZXN0KG5hbWUpKSAmJlxuICAgICAgICAob3MgPT0gJ1dpbmRvd3MgQ0UnIHx8IC9Nb2JpL2kudGVzdCh1YSkpKSB7XG4gICAgICBuYW1lICs9ICcgTW9iaWxlJztcbiAgICB9XG4gICAgLy8gRGV0ZWN0IElFIHBsYXRmb3JtIHByZXZpZXcuXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnSUUnICYmIHVzZUZlYXR1cmVzKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoY29udGV4dC5leHRlcm5hbCA9PT0gbnVsbCkge1xuICAgICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ3BsYXRmb3JtIHByZXZpZXcnKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2VtYmVkZGVkJyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIERldGVjdCBCbGFja0JlcnJ5IE9TIHZlcnNpb24uXG4gICAgLy8gaHR0cDovL2RvY3MuYmxhY2tiZXJyeS5jb20vZW4vZGV2ZWxvcGVycy9kZWxpdmVyYWJsZXMvMTgxNjkvSFRUUF9oZWFkZXJzX3NlbnRfYnlfQkJfQnJvd3Nlcl8xMjM0OTExXzExLmpzcFxuICAgIGVsc2UgaWYgKCgvXFxiQmxhY2tCZXJyeVxcYi8udGVzdChwcm9kdWN0KSB8fCAvXFxiQkIxMFxcYi8udGVzdCh1YSkpICYmIChkYXRhID1cbiAgICAgICAgICAoUmVnRXhwKHByb2R1Y3QucmVwbGFjZSgvICsvZywgJyAqJykgKyAnLyhbLlxcXFxkXSspJywgJ2knKS5leGVjKHVhKSB8fCAwKVsxXSB8fFxuICAgICAgICAgIHZlcnNpb25cbiAgICAgICAgKSkge1xuICAgICAgZGF0YSA9IFtkYXRhLCAvQkIxMC8udGVzdCh1YSldO1xuICAgICAgb3MgPSAoZGF0YVsxXSA/IChwcm9kdWN0ID0gbnVsbCwgbWFudWZhY3R1cmVyID0gJ0JsYWNrQmVycnknKSA6ICdEZXZpY2UgU29mdHdhcmUnKSArICcgJyArIGRhdGFbMF07XG4gICAgICB2ZXJzaW9uID0gbnVsbDtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IE9wZXJhIGlkZW50aWZ5aW5nL21hc2tpbmcgaXRzZWxmIGFzIGFub3RoZXIgYnJvd3Nlci5cbiAgICAvLyBodHRwOi8vd3d3Lm9wZXJhLmNvbS9zdXBwb3J0L2tiL3ZpZXcvODQzL1xuICAgIGVsc2UgaWYgKHRoaXMgIT0gZm9yT3duICYmIHByb2R1Y3QgIT0gJ1dpaScgJiYgKFxuICAgICAgICAgICh1c2VGZWF0dXJlcyAmJiBvcGVyYSkgfHxcbiAgICAgICAgICAoL09wZXJhLy50ZXN0KG5hbWUpICYmIC9cXGIoPzpNU0lFfEZpcmVmb3gpXFxiL2kudGVzdCh1YSkpIHx8XG4gICAgICAgICAgKG5hbWUgPT0gJ0ZpcmVmb3gnICYmIC9cXGJPUyBYICg/OlxcZCtcXC4pezIsfS8udGVzdChvcykpIHx8XG4gICAgICAgICAgKG5hbWUgPT0gJ0lFJyAmJiAoXG4gICAgICAgICAgICAob3MgJiYgIS9eV2luLy50ZXN0KG9zKSAmJiB2ZXJzaW9uID4gNS41KSB8fFxuICAgICAgICAgICAgL1xcYldpbmRvd3MgWFBcXGIvLnRlc3Qob3MpICYmIHZlcnNpb24gPiA4IHx8XG4gICAgICAgICAgICB2ZXJzaW9uID09IDggJiYgIS9cXGJUcmlkZW50XFxiLy50ZXN0KHVhKVxuICAgICAgICAgICkpXG4gICAgICAgICkgJiYgIXJlT3BlcmEudGVzdCgoZGF0YSA9IHBhcnNlLmNhbGwoZm9yT3duLCB1YS5yZXBsYWNlKHJlT3BlcmEsICcnKSArICc7JykpKSAmJiBkYXRhLm5hbWUpIHtcbiAgICAgIC8vIFdoZW4gXCJpZGVudGlmeWluZ1wiLCB0aGUgVUEgY29udGFpbnMgYm90aCBPcGVyYSBhbmQgdGhlIG90aGVyIGJyb3dzZXIncyBuYW1lLlxuICAgICAgZGF0YSA9ICdpbmcgYXMgJyArIGRhdGEubmFtZSArICgoZGF0YSA9IGRhdGEudmVyc2lvbikgPyAnICcgKyBkYXRhIDogJycpO1xuICAgICAgaWYgKHJlT3BlcmEudGVzdChuYW1lKSkge1xuICAgICAgICBpZiAoL1xcYklFXFxiLy50ZXN0KGRhdGEpICYmIG9zID09ICdNYWMgT1MnKSB7XG4gICAgICAgICAgb3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEgPSAnaWRlbnRpZnknICsgZGF0YTtcbiAgICAgIH1cbiAgICAgIC8vIFdoZW4gXCJtYXNraW5nXCIsIHRoZSBVQSBjb250YWlucyBvbmx5IHRoZSBvdGhlciBicm93c2VyJ3MgbmFtZS5cbiAgICAgIGVsc2Uge1xuICAgICAgICBkYXRhID0gJ21hc2snICsgZGF0YTtcbiAgICAgICAgaWYgKG9wZXJhQ2xhc3MpIHtcbiAgICAgICAgICBuYW1lID0gZm9ybWF0KG9wZXJhQ2xhc3MucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxICQyJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5hbWUgPSAnT3BlcmEnO1xuICAgICAgICB9XG4gICAgICAgIGlmICgvXFxiSUVcXGIvLnRlc3QoZGF0YSkpIHtcbiAgICAgICAgICBvcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF1c2VGZWF0dXJlcykge1xuICAgICAgICAgIHZlcnNpb24gPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsYXlvdXQgPSBbJ1ByZXN0byddO1xuICAgICAgZGVzY3JpcHRpb24ucHVzaChkYXRhKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IFdlYktpdCBOaWdodGx5IGFuZCBhcHByb3hpbWF0ZSBDaHJvbWUvU2FmYXJpIHZlcnNpb25zLlxuICAgIGlmICgoZGF0YSA9ICgvXFxiQXBwbGVXZWJLaXRcXC8oW1xcZC5dK1xcKz8pL2kuZXhlYyh1YSkgfHwgMClbMV0pKSB7XG4gICAgICAvLyBDb3JyZWN0IGJ1aWxkIG51bWJlciBmb3IgbnVtZXJpYyBjb21wYXJpc29uLlxuICAgICAgLy8gKGUuZy4gXCI1MzIuNVwiIGJlY29tZXMgXCI1MzIuMDVcIilcbiAgICAgIGRhdGEgPSBbcGFyc2VGbG9hdChkYXRhLnJlcGxhY2UoL1xcLihcXGQpJC8sICcuMCQxJykpLCBkYXRhXTtcbiAgICAgIC8vIE5pZ2h0bHkgYnVpbGRzIGFyZSBwb3N0Zml4ZWQgd2l0aCBhIFwiK1wiLlxuICAgICAgaWYgKG5hbWUgPT0gJ1NhZmFyaScgJiYgZGF0YVsxXS5zbGljZSgtMSkgPT0gJysnKSB7XG4gICAgICAgIG5hbWUgPSAnV2ViS2l0IE5pZ2h0bHknO1xuICAgICAgICBwcmVyZWxlYXNlID0gJ2FscGhhJztcbiAgICAgICAgdmVyc2lvbiA9IGRhdGFbMV0uc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgICAgLy8gQ2xlYXIgaW5jb3JyZWN0IGJyb3dzZXIgdmVyc2lvbnMuXG4gICAgICBlbHNlIGlmICh2ZXJzaW9uID09IGRhdGFbMV0gfHxcbiAgICAgICAgICB2ZXJzaW9uID09IChkYXRhWzJdID0gKC9cXGJTYWZhcmlcXC8oW1xcZC5dK1xcKz8pL2kuZXhlYyh1YSkgfHwgMClbMV0pKSB7XG4gICAgICAgIHZlcnNpb24gPSBudWxsO1xuICAgICAgfVxuICAgICAgLy8gVXNlIHRoZSBmdWxsIENocm9tZSB2ZXJzaW9uIHdoZW4gYXZhaWxhYmxlLlxuICAgICAgZGF0YVsxXSA9ICgvXFxiQ2hyb21lXFwvKFtcXGQuXSspL2kuZXhlYyh1YSkgfHwgMClbMV07XG4gICAgICAvLyBEZXRlY3QgQmxpbmsgbGF5b3V0IGVuZ2luZS5cbiAgICAgIGlmIChkYXRhWzBdID09IDUzNy4zNiAmJiBkYXRhWzJdID09IDUzNy4zNiAmJiBwYXJzZUZsb2F0KGRhdGFbMV0pID49IDI4ICYmIGxheW91dCA9PSAnV2ViS2l0Jykge1xuICAgICAgICBsYXlvdXQgPSBbJ0JsaW5rJ107XG4gICAgICB9XG4gICAgICAvLyBEZXRlY3QgSmF2YVNjcmlwdENvcmUuXG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY3Njg0NzQvaG93LWNhbi1pLWRldGVjdC13aGljaC1qYXZhc2NyaXB0LWVuZ2luZS12OC1vci1qc2MtaXMtdXNlZC1hdC1ydW50aW1lLWluLWFuZHJvaVxuICAgICAgaWYgKCF1c2VGZWF0dXJlcyB8fCAoIWxpa2VDaHJvbWUgJiYgIWRhdGFbMV0pKSB7XG4gICAgICAgIGxheW91dCAmJiAobGF5b3V0WzFdID0gJ2xpa2UgU2FmYXJpJyk7XG4gICAgICAgIGRhdGEgPSAoZGF0YSA9IGRhdGFbMF0sIGRhdGEgPCA0MDAgPyAxIDogZGF0YSA8IDUwMCA/IDIgOiBkYXRhIDwgNTI2ID8gMyA6IGRhdGEgPCA1MzMgPyA0IDogZGF0YSA8IDUzNCA/ICc0KycgOiBkYXRhIDwgNTM1ID8gNSA6IGRhdGEgPCA1MzcgPyA2IDogZGF0YSA8IDUzOCA/IDcgOiBkYXRhIDwgNjAxID8gOCA6ICc4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXlvdXQgJiYgKGxheW91dFsxXSA9ICdsaWtlIENocm9tZScpO1xuICAgICAgICBkYXRhID0gZGF0YVsxXSB8fCAoZGF0YSA9IGRhdGFbMF0sIGRhdGEgPCA1MzAgPyAxIDogZGF0YSA8IDUzMiA/IDIgOiBkYXRhIDwgNTMyLjA1ID8gMyA6IGRhdGEgPCA1MzMgPyA0IDogZGF0YSA8IDUzNC4wMyA/IDUgOiBkYXRhIDwgNTM0LjA3ID8gNiA6IGRhdGEgPCA1MzQuMTAgPyA3IDogZGF0YSA8IDUzNC4xMyA/IDggOiBkYXRhIDwgNTM0LjE2ID8gOSA6IGRhdGEgPCA1MzQuMjQgPyAxMCA6IGRhdGEgPCA1MzQuMzAgPyAxMSA6IGRhdGEgPCA1MzUuMDEgPyAxMiA6IGRhdGEgPCA1MzUuMDIgPyAnMTMrJyA6IGRhdGEgPCA1MzUuMDcgPyAxNSA6IGRhdGEgPCA1MzUuMTEgPyAxNiA6IGRhdGEgPCA1MzUuMTkgPyAxNyA6IGRhdGEgPCA1MzYuMDUgPyAxOCA6IGRhdGEgPCA1MzYuMTAgPyAxOSA6IGRhdGEgPCA1MzcuMDEgPyAyMCA6IGRhdGEgPCA1MzcuMTEgPyAnMjErJyA6IGRhdGEgPCA1MzcuMTMgPyAyMyA6IGRhdGEgPCA1MzcuMTggPyAyNCA6IGRhdGEgPCA1MzcuMjQgPyAyNSA6IGRhdGEgPCA1MzcuMzYgPyAyNiA6IGxheW91dCAhPSAnQmxpbmsnID8gJzI3JyA6ICcyOCcpO1xuICAgICAgfVxuICAgICAgLy8gQWRkIHRoZSBwb3N0Zml4IG9mIFwiLnhcIiBvciBcIitcIiBmb3IgYXBwcm94aW1hdGUgdmVyc2lvbnMuXG4gICAgICBsYXlvdXQgJiYgKGxheW91dFsxXSArPSAnICcgKyAoZGF0YSArPSB0eXBlb2YgZGF0YSA9PSAnbnVtYmVyJyA/ICcueCcgOiAvWy4rXS8udGVzdChkYXRhKSA/ICcnIDogJysnKSk7XG4gICAgICAvLyBPYnNjdXJlIHZlcnNpb24gZm9yIHNvbWUgU2FmYXJpIDEtMiByZWxlYXNlcy5cbiAgICAgIGlmIChuYW1lID09ICdTYWZhcmknICYmICghdmVyc2lvbiB8fCBwYXJzZUludCh2ZXJzaW9uKSA+IDQ1KSkge1xuICAgICAgICB2ZXJzaW9uID0gZGF0YTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRGV0ZWN0IE9wZXJhIGRlc2t0b3AgbW9kZXMuXG4gICAgaWYgKG5hbWUgPT0gJ09wZXJhJyAmJiAgKGRhdGEgPSAvXFxiemJvdnx6dmF2JC8uZXhlYyhvcykpKSB7XG4gICAgICBuYW1lICs9ICcgJztcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgICAgaWYgKGRhdGEgPT0gJ3p2YXYnKSB7XG4gICAgICAgIG5hbWUgKz0gJ01pbmknO1xuICAgICAgICB2ZXJzaW9uID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5hbWUgKz0gJ01vYmlsZSc7XG4gICAgICB9XG4gICAgICBvcyA9IG9zLnJlcGxhY2UoUmVnRXhwKCcgKicgKyBkYXRhICsgJyQnKSwgJycpO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgQ2hyb21lIGRlc2t0b3AgbW9kZS5cbiAgICBlbHNlIGlmIChuYW1lID09ICdTYWZhcmknICYmIC9cXGJDaHJvbWVcXGIvLmV4ZWMobGF5b3V0ICYmIGxheW91dFsxXSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgICAgbmFtZSA9ICdDaHJvbWUgTW9iaWxlJztcbiAgICAgIHZlcnNpb24gPSBudWxsO1xuXG4gICAgICBpZiAoL1xcYk9TIFhcXGIvLnRlc3Qob3MpKSB7XG4gICAgICAgIG1hbnVmYWN0dXJlciA9ICdBcHBsZSc7XG4gICAgICAgIG9zID0gJ2lPUyA0LjMrJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9zID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gU3RyaXAgaW5jb3JyZWN0IE9TIHZlcnNpb25zLlxuICAgIGlmICh2ZXJzaW9uICYmIHZlcnNpb24uaW5kZXhPZigoZGF0YSA9IC9bXFxkLl0rJC8uZXhlYyhvcykpKSA9PSAwICYmXG4gICAgICAgIHVhLmluZGV4T2YoJy8nICsgZGF0YSArICctJykgPiAtMSkge1xuICAgICAgb3MgPSB0cmltKG9zLnJlcGxhY2UoZGF0YSwgJycpKTtcbiAgICB9XG4gICAgLy8gQWRkIGxheW91dCBlbmdpbmUuXG4gICAgaWYgKGxheW91dCAmJiAhL1xcYig/OkF2YW50fE5vb2spXFxiLy50ZXN0KG5hbWUpICYmIChcbiAgICAgICAgL0Jyb3dzZXJ8THVuYXNjYXBlfE1heHRob24vLnRlc3QobmFtZSkgfHxcbiAgICAgICAgbmFtZSAhPSAnU2FmYXJpJyAmJiAvXmlPUy8udGVzdChvcykgJiYgL1xcYlNhZmFyaVxcYi8udGVzdChsYXlvdXRbMV0pIHx8XG4gICAgICAgIC9eKD86QWRvYmV8QXJvcmF8QnJlYWNofE1pZG9yaXxPcGVyYXxQaGFudG9tfFJla29ucXxSb2NrfFNhbXN1bmcgSW50ZXJuZXR8U2xlaXBuaXJ8V2ViKS8udGVzdChuYW1lKSAmJiBsYXlvdXRbMV0pKSB7XG4gICAgICAvLyBEb24ndCBhZGQgbGF5b3V0IGRldGFpbHMgdG8gZGVzY3JpcHRpb24gaWYgdGhleSBhcmUgZmFsc2V5LlxuICAgICAgKGRhdGEgPSBsYXlvdXRbbGF5b3V0Lmxlbmd0aCAtIDFdKSAmJiBkZXNjcmlwdGlvbi5wdXNoKGRhdGEpO1xuICAgIH1cbiAgICAvLyBDb21iaW5lIGNvbnRleHR1YWwgaW5mb3JtYXRpb24uXG4gICAgaWYgKGRlc2NyaXB0aW9uLmxlbmd0aCkge1xuICAgICAgZGVzY3JpcHRpb24gPSBbJygnICsgZGVzY3JpcHRpb24uam9pbignOyAnKSArICcpJ107XG4gICAgfVxuICAgIC8vIEFwcGVuZCBtYW51ZmFjdHVyZXIgdG8gZGVzY3JpcHRpb24uXG4gICAgaWYgKG1hbnVmYWN0dXJlciAmJiBwcm9kdWN0ICYmIHByb2R1Y3QuaW5kZXhPZihtYW51ZmFjdHVyZXIpIDwgMCkge1xuICAgICAgZGVzY3JpcHRpb24ucHVzaCgnb24gJyArIG1hbnVmYWN0dXJlcik7XG4gICAgfVxuICAgIC8vIEFwcGVuZCBwcm9kdWN0IHRvIGRlc2NyaXB0aW9uLlxuICAgIGlmIChwcm9kdWN0KSB7XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKCgvXm9uIC8udGVzdChkZXNjcmlwdGlvbltkZXNjcmlwdGlvbi5sZW5ndGggLSAxXSkgPyAnJyA6ICdvbiAnKSArIHByb2R1Y3QpO1xuICAgIH1cbiAgICAvLyBQYXJzZSB0aGUgT1MgaW50byBhbiBvYmplY3QuXG4gICAgaWYgKG9zKSB7XG4gICAgICBkYXRhID0gLyAoW1xcZC4rXSspJC8uZXhlYyhvcyk7XG4gICAgICBpc1NwZWNpYWxDYXNlZE9TID0gZGF0YSAmJiBvcy5jaGFyQXQob3MubGVuZ3RoIC0gZGF0YVswXS5sZW5ndGggLSAxKSA9PSAnLyc7XG4gICAgICBvcyA9IHtcbiAgICAgICAgJ2FyY2hpdGVjdHVyZSc6IDMyLFxuICAgICAgICAnZmFtaWx5JzogKGRhdGEgJiYgIWlzU3BlY2lhbENhc2VkT1MpID8gb3MucmVwbGFjZShkYXRhWzBdLCAnJykgOiBvcyxcbiAgICAgICAgJ3ZlcnNpb24nOiBkYXRhID8gZGF0YVsxXSA6IG51bGwsXG4gICAgICAgICd0b1N0cmluZyc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2ZXJzaW9uID0gdGhpcy52ZXJzaW9uO1xuICAgICAgICAgIHJldHVybiB0aGlzLmZhbWlseSArICgodmVyc2lvbiAmJiAhaXNTcGVjaWFsQ2FzZWRPUykgPyAnICcgKyB2ZXJzaW9uIDogJycpICsgKHRoaXMuYXJjaGl0ZWN0dXJlID09IDY0ID8gJyA2NC1iaXQnIDogJycpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBBZGQgYnJvd3Nlci9PUyBhcmNoaXRlY3R1cmUuXG4gICAgaWYgKChkYXRhID0gL1xcYig/OkFNRHxJQXxXaW58V09XfHg4Nl98eCk2NFxcYi9pLmV4ZWMoYXJjaCkpICYmICEvXFxiaTY4NlxcYi9pLnRlc3QoYXJjaCkpIHtcbiAgICAgIGlmIChvcykge1xuICAgICAgICBvcy5hcmNoaXRlY3R1cmUgPSA2NDtcbiAgICAgICAgb3MuZmFtaWx5ID0gb3MuZmFtaWx5LnJlcGxhY2UoUmVnRXhwKCcgKicgKyBkYXRhKSwgJycpO1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICAgIG5hbWUgJiYgKC9cXGJXT1c2NFxcYi9pLnRlc3QodWEpIHx8XG4gICAgICAgICAgKHVzZUZlYXR1cmVzICYmIC9cXHcoPzo4NnwzMikkLy50ZXN0KG5hdi5jcHVDbGFzcyB8fCBuYXYucGxhdGZvcm0pICYmICEvXFxiV2luNjQ7IHg2NFxcYi9pLnRlc3QodWEpKSlcbiAgICAgICkge1xuICAgICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCczMi1iaXQnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQ2hyb21lIDM5IGFuZCBhYm92ZSBvbiBPUyBYIGlzIGFsd2F5cyA2NC1iaXQuXG4gICAgZWxzZSBpZiAoXG4gICAgICAgIG9zICYmIC9eT1MgWC8udGVzdChvcy5mYW1pbHkpICYmXG4gICAgICAgIG5hbWUgPT0gJ0Nocm9tZScgJiYgcGFyc2VGbG9hdCh2ZXJzaW9uKSA+PSAzOVxuICAgICkge1xuICAgICAgb3MuYXJjaGl0ZWN0dXJlID0gNjQ7XG4gICAgfVxuXG4gICAgdWEgfHwgKHVhID0gbnVsbCk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGxhdGZvcm0gb2JqZWN0LlxuICAgICAqXG4gICAgICogQG5hbWUgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgKi9cbiAgICB2YXIgcGxhdGZvcm0gPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF0Zm9ybSBkZXNjcmlwdGlvbi5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0uZGVzY3JpcHRpb24gPSB1YTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBicm93c2VyJ3MgbGF5b3V0IGVuZ2luZS5cbiAgICAgKlxuICAgICAqIFRoZSBsaXN0IG9mIGNvbW1vbiBsYXlvdXQgZW5naW5lcyBpbmNsdWRlOlxuICAgICAqIFwiQmxpbmtcIiwgXCJFZGdlSFRNTFwiLCBcIkdlY2tvXCIsIFwiVHJpZGVudFwiIGFuZCBcIldlYktpdFwiXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLmxheW91dCA9IGxheW91dCAmJiBsYXlvdXRbMF07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgcHJvZHVjdCdzIG1hbnVmYWN0dXJlci5cbiAgICAgKlxuICAgICAqIFRoZSBsaXN0IG9mIG1hbnVmYWN0dXJlcnMgaW5jbHVkZTpcbiAgICAgKiBcIkFwcGxlXCIsIFwiQXJjaG9zXCIsIFwiQW1hem9uXCIsIFwiQXN1c1wiLCBcIkJhcm5lcyAmIE5vYmxlXCIsIFwiQmxhY2tCZXJyeVwiLFxuICAgICAqIFwiR29vZ2xlXCIsIFwiSFBcIiwgXCJIVENcIiwgXCJMR1wiLCBcIk1pY3Jvc29mdFwiLCBcIk1vdG9yb2xhXCIsIFwiTmludGVuZG9cIixcbiAgICAgKiBcIk5va2lhXCIsIFwiU2Ftc3VuZ1wiIGFuZCBcIlNvbnlcIlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5tYW51ZmFjdHVyZXIgPSBtYW51ZmFjdHVyZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYnJvd3Nlci9lbnZpcm9ubWVudC5cbiAgICAgKlxuICAgICAqIFRoZSBsaXN0IG9mIGNvbW1vbiBicm93c2VyIG5hbWVzIGluY2x1ZGU6XG4gICAgICogXCJDaHJvbWVcIiwgXCJFbGVjdHJvblwiLCBcIkZpcmVmb3hcIiwgXCJGaXJlZm94IGZvciBpT1NcIiwgXCJJRVwiLFxuICAgICAqIFwiTWljcm9zb2Z0IEVkZ2VcIiwgXCJQaGFudG9tSlNcIiwgXCJTYWZhcmlcIiwgXCJTZWFNb25rZXlcIiwgXCJTaWxrXCIsXG4gICAgICogXCJPcGVyYSBNaW5pXCIgYW5kIFwiT3BlcmFcIlxuICAgICAqXG4gICAgICogTW9iaWxlIHZlcnNpb25zIG9mIHNvbWUgYnJvd3NlcnMgaGF2ZSBcIk1vYmlsZVwiIGFwcGVuZGVkIHRvIHRoZWlyIG5hbWU6XG4gICAgICogZWcuIFwiQ2hyb21lIE1vYmlsZVwiLCBcIkZpcmVmb3ggTW9iaWxlXCIsIFwiSUUgTW9iaWxlXCIgYW5kIFwiT3BlcmEgTW9iaWxlXCJcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ubmFtZSA9IG5hbWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYWxwaGEvYmV0YSByZWxlYXNlIGluZGljYXRvci5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ucHJlcmVsZWFzZSA9IHByZXJlbGVhc2U7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgcHJvZHVjdCBob3N0aW5nIHRoZSBicm93c2VyLlxuICAgICAqXG4gICAgICogVGhlIGxpc3Qgb2YgY29tbW9uIHByb2R1Y3RzIGluY2x1ZGU6XG4gICAgICpcbiAgICAgKiBcIkJsYWNrQmVycnlcIiwgXCJHYWxheHkgUzRcIiwgXCJMdW1pYVwiLCBcImlQYWRcIiwgXCJpUG9kXCIsIFwiaVBob25lXCIsIFwiS2luZGxlXCIsXG4gICAgICogXCJLaW5kbGUgRmlyZVwiLCBcIk5leHVzXCIsIFwiTm9va1wiLCBcIlBsYXlCb29rXCIsIFwiVG91Y2hQYWRcIiBhbmQgXCJUcmFuc2Zvcm1lclwiXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLnByb2R1Y3QgPSBwcm9kdWN0O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGJyb3dzZXIncyB1c2VyIGFnZW50IHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0udWEgPSB1YTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBicm93c2VyL2Vudmlyb25tZW50IHZlcnNpb24uXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLnZlcnNpb24gPSBuYW1lICYmIHZlcnNpb247XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgb3BlcmF0aW5nIHN5c3RlbS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIHBsYXRmb3JtLm9zID0gb3MgfHwge1xuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBDUFUgYXJjaGl0ZWN0dXJlIHRoZSBPUyBpcyBidWlsdCBmb3IuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXG4gICAgICAgKiBAdHlwZSBudW1iZXJ8bnVsbFxuICAgICAgICovXG4gICAgICAnYXJjaGl0ZWN0dXJlJzogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZmFtaWx5IG9mIHRoZSBPUy5cbiAgICAgICAqXG4gICAgICAgKiBDb21tb24gdmFsdWVzIGluY2x1ZGU6XG4gICAgICAgKiBcIldpbmRvd3NcIiwgXCJXaW5kb3dzIFNlcnZlciAyMDA4IFIyIC8gN1wiLCBcIldpbmRvd3MgU2VydmVyIDIwMDggLyBWaXN0YVwiLFxuICAgICAgICogXCJXaW5kb3dzIFhQXCIsIFwiT1MgWFwiLCBcIlVidW50dVwiLCBcIkRlYmlhblwiLCBcIkZlZG9yYVwiLCBcIlJlZCBIYXRcIiwgXCJTdVNFXCIsXG4gICAgICAgKiBcIkFuZHJvaWRcIiwgXCJpT1NcIiBhbmQgXCJXaW5kb3dzIFBob25lXCJcbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm0ub3NcbiAgICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICAgKi9cbiAgICAgICdmYW1pbHknOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBPUy5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm0ub3NcbiAgICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICAgKi9cbiAgICAgICd2ZXJzaW9uJzogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIHRoZSBPUyBzdHJpbmcuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXG4gICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgT1Mgc3RyaW5nLlxuICAgICAgICovXG4gICAgICAndG9TdHJpbmcnOiBmdW5jdGlvbigpIHsgcmV0dXJuICdudWxsJzsgfVxuICAgIH07XG5cbiAgICBwbGF0Zm9ybS5wYXJzZSA9IHBhcnNlO1xuICAgIHBsYXRmb3JtLnRvU3RyaW5nID0gdG9TdHJpbmdQbGF0Zm9ybTtcblxuICAgIGlmIChwbGF0Zm9ybS52ZXJzaW9uKSB7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KHZlcnNpb24pO1xuICAgIH1cbiAgICBpZiAocGxhdGZvcm0ubmFtZSkge1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdChuYW1lKTtcbiAgICB9XG4gICAgaWYgKG9zICYmIG5hbWUgJiYgIShvcyA9PSBTdHJpbmcob3MpLnNwbGl0KCcgJylbMF0gJiYgKG9zID09IG5hbWUuc3BsaXQoJyAnKVswXSB8fCBwcm9kdWN0KSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2gocHJvZHVjdCA/ICcoJyArIG9zICsgJyknIDogJ29uICcgKyBvcyk7XG4gICAgfVxuICAgIGlmIChkZXNjcmlwdGlvbi5sZW5ndGgpIHtcbiAgICAgIHBsYXRmb3JtLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24uam9pbignICcpO1xuICAgIH1cbiAgICByZXR1cm4gcGxhdGZvcm07XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvLyBFeHBvcnQgcGxhdGZvcm0uXG4gIHZhciBwbGF0Zm9ybSA9IHBhcnNlKCk7XG5cbiAgLy8gU29tZSBBTUQgYnVpbGQgb3B0aW1pemVycywgbGlrZSByLmpzLCBjaGVjayBmb3IgY29uZGl0aW9uIHBhdHRlcm5zIGxpa2UgdGhlIGZvbGxvd2luZzpcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gRXhwb3NlIHBsYXRmb3JtIG9uIHRoZSBnbG9iYWwgb2JqZWN0IHRvIHByZXZlbnQgZXJyb3JzIHdoZW4gcGxhdGZvcm0gaXNcbiAgICAvLyBsb2FkZWQgYnkgYSBzY3JpcHQgdGFnIGluIHRoZSBwcmVzZW5jZSBvZiBhbiBBTUQgbG9hZGVyLlxuICAgIC8vIFNlZSBodHRwOi8vcmVxdWlyZWpzLm9yZy9kb2NzL2Vycm9ycy5odG1sI21pc21hdGNoIGZvciBtb3JlIGRldGFpbHMuXG4gICAgcm9vdC5wbGF0Zm9ybSA9IHBsYXRmb3JtO1xuXG4gICAgLy8gRGVmaW5lIGFzIGFuIGFub255bW91cyBtb2R1bGUgc28gcGxhdGZvcm0gY2FuIGJlIGFsaWFzZWQgdGhyb3VnaCBwYXRoIG1hcHBpbmcuXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHBsYXRmb3JtO1xuICAgIH0pO1xuICB9XG4gIC8vIENoZWNrIGZvciBgZXhwb3J0c2AgYWZ0ZXIgYGRlZmluZWAgaW4gY2FzZSBhIGJ1aWxkIG9wdGltaXplciBhZGRzIGFuIGBleHBvcnRzYCBvYmplY3QuXG4gIGVsc2UgaWYgKGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUpIHtcbiAgICAvLyBFeHBvcnQgZm9yIENvbW1vbkpTIHN1cHBvcnQuXG4gICAgZm9yT3duKHBsYXRmb3JtLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICBmcmVlRXhwb3J0c1trZXldID0gdmFsdWU7XG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gRXhwb3J0IHRvIHRoZSBnbG9iYWwgb2JqZWN0LlxuICAgIHJvb3QucGxhdGZvcm0gPSBwbGF0Zm9ybTtcbiAgfVxufS5jYWxsKHRoaXMpKTtcbiJdfQ==
