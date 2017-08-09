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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRldmljZU9yaWVudGF0aW9uTW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZ1RvUmFkIiwiZGVnIiwiTWF0aCIsIlBJIiwicmFkVG9EZWciLCJyYWQiLCJub3JtYWxpemUiLCJtIiwiZGV0IiwiaSIsImxlbmd0aCIsInVuaWZ5IiwiZXVsZXJBbmdsZSIsImFscGhhSXNWYWxpZCIsIl9hbHBoYSIsIl9iZXRhIiwiX2dhbW1hIiwiY0EiLCJjb3MiLCJjQiIsImNHIiwic0EiLCJzaW4iLCJzQiIsInNHIiwiYWxwaGEiLCJiZXRhIiwiZ2FtbWEiLCJhdGFuMiIsImFzaW4iLCJ1bmlmeUFsdCIsIkRldmljZU9yaWVudGF0aW9uTW9kdWxlIiwiZXZlbnQiLCJvcmllbnRhdGlvbiIsIm9yaWVudGF0aW9uQWx0IiwicmVxdWlyZWQiLCJfcHJvbWlzZVJlc29sdmUiLCJfZXN0aW1hdGVkR3Jhdml0eSIsIl9wcm9jZXNzRnVuY3Rpb24iLCJfcHJvY2VzcyIsImJpbmQiLCJfZGV2aWNlb3JpZW50YXRpb25DaGVjayIsIl9kZXZpY2VvcmllbnRhdGlvbkxpc3RlbmVyIiwiZSIsImNsZWFyVGltZW91dCIsIl9jaGVja1RpbWVvdXRJZCIsImlzUHJvdmlkZWQiLCJyYXdWYWx1ZXNQcm92aWRlZCIsIl90cnlBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RmFsbGJhY2siLCJvdXRFdmVudCIsImxpc3RlbmVycyIsInNpemUiLCJlbWl0IiwiX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlIiwid2Via2l0Q29tcGFzc0hlYWRpbmciLCJvcyIsImZhbWlseSIsInJlcXVpcmVNb2R1bGUiLCJ0aGVuIiwiYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSIsImlzVmFsaWQiLCJjb25zb2xlIiwibG9nIiwiaXNDYWxjdWxhdGVkIiwicGVyaW9kIiwiYWRkTGlzdGVuZXIiLCJfY2FsY3VsYXRlQmV0YUFuZEdhbW1hRnJvbUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkiLCJhbHQiLCJrIiwiX2dYIiwiX2dZIiwiX2daIiwibm9ybSIsInNxcnQiLCJkYXRhIiwicmVzb2x2ZSIsIndpbmRvdyIsIkRldmljZU9yaWVudGF0aW9uRXZlbnQiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0VGltZW91dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7O0FBTUEsU0FBU0EsUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUI7QUFDckIsU0FBT0EsTUFBTUMsS0FBS0MsRUFBWCxHQUFnQixHQUF2QjtBQUNEOztBQUVEOzs7Ozs7QUFNQSxTQUFTQyxRQUFULENBQWtCQyxHQUFsQixFQUF1QjtBQUNyQixTQUFPQSxNQUFNLEdBQU4sR0FBWUgsS0FBS0MsRUFBeEI7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsU0FBU0csU0FBVCxDQUFtQkMsQ0FBbkIsRUFBc0I7QUFDcEIsTUFBTUMsTUFBTUQsRUFBRSxDQUFGLElBQU9BLEVBQUUsQ0FBRixDQUFQLEdBQWNBLEVBQUUsQ0FBRixDQUFkLEdBQXFCQSxFQUFFLENBQUYsSUFBT0EsRUFBRSxDQUFGLENBQVAsR0FBY0EsRUFBRSxDQUFGLENBQW5DLEdBQTBDQSxFQUFFLENBQUYsSUFBT0EsRUFBRSxDQUFGLENBQVAsR0FBY0EsRUFBRSxDQUFGLENBQXhELEdBQStEQSxFQUFFLENBQUYsSUFBT0EsRUFBRSxDQUFGLENBQVAsR0FBY0EsRUFBRSxDQUFGLENBQTdFLEdBQW9GQSxFQUFFLENBQUYsSUFBT0EsRUFBRSxDQUFGLENBQVAsR0FBY0EsRUFBRSxDQUFGLENBQWxHLEdBQXlHQSxFQUFFLENBQUYsSUFBT0EsRUFBRSxDQUFGLENBQVAsR0FBY0EsRUFBRSxDQUFGLENBQW5JOztBQUVBLE9BQUssSUFBSUUsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRixFQUFFRyxNQUF0QixFQUE4QkQsR0FBOUI7QUFDRUYsTUFBRUUsQ0FBRixLQUFRRCxHQUFSO0FBREYsR0FHQSxPQUFPRCxDQUFQO0FB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LGNBQU1zQyxVQUFOOztBQUVBLGFBQUtoQixXQUFMLENBQWlCbUIsSUFBakIsQ0FBc0JILFVBQXRCO0FBQ0Q7QUFDRjs7OzZCQUVReUIsSSxFQUFNO0FBQ2IsV0FBS3BDLGdCQUFMLENBQXNCb0MsSUFBdEI7QUFDRDs7QUFFRDs7Ozs7Ozs7MkJBS087QUFBQTs7QUFDTCxvSkFBa0IsVUFBQ0MsT0FBRCxFQUFhO0FBQzdCLGVBQUt2QyxlQUFMLEdBQXVCdUMsT0FBdkI7O0FBRUEsWUFBSUMsT0FBT0Msc0JBQVgsRUFBbUM7QUFDakMsaUJBQUt2QyxnQkFBTCxHQUF3QixPQUFLRyx1QkFBN0I7QUFDQW1DLGlCQUFPRSxnQkFBUCxDQUF3QixtQkFBeEIsRUFBNkMsT0FBS3ZDLFFBQWxELEVBQTRELEtBQTVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQUtNLGVBQUwsR0FBdUJrQyxXQUFXO0FBQUEsbUJBQU1KLGVBQU47QUFBQSxXQUFYLEVBQWdDLEdBQWhDLENBQXZCO0FBQ0QsU0FQRCxNQU9PLElBQUksT0FBS3hDLFFBQUwsQ0FBY0YsV0FBbEIsRUFBK0I7QUFDcEMsaUJBQUtlLHdDQUFMO0FBQ0QsU0FGTSxNQUVBO0FBQ0wyQjtBQUNEO0FBQ0YsT0FmRDtBQWdCRDs7Ozs7O2tCQUdZLElBQUk1Qyx1QkFBSixFIiwiZmlsZSI6IkRldmljZU9yaWVudGF0aW9uTW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERPTUV2ZW50U3VibW9kdWxlIGZyb20gJy4vRE9NRXZlbnRTdWJtb2R1bGUnO1xuaW1wb3J0IElucHV0TW9kdWxlIGZyb20gJy4vSW5wdXRNb2R1bGUnO1xuaW1wb3J0IE1vdGlvbklucHV0IGZyb20gJy4vTW90aW9uSW5wdXQnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJ3BsYXRmb3JtJztcblxuLyoqXG4gKiBDb252ZXJ0cyBkZWdyZWVzIHRvIHJhZGlhbnMuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGRlZyAtIEFuZ2xlIGluIGRlZ3JlZXMuXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGRlZ1RvUmFkKGRlZykge1xuICByZXR1cm4gZGVnICogTWF0aC5QSSAvIDE4MDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyByYWRpYW5zIHRvIGRlZ3JlZXMuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHJhZCAtIEFuZ2xlIGluIHJhZGlhbnMuXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIHJhZFRvRGVnKHJhZCkge1xuICByZXR1cm4gcmFkICogMTgwIC8gTWF0aC5QSTtcbn1cblxuLyoqXG4gKiBOb3JtYWxpemVzIGEgMyB4IDMgbWF0cml4LlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyW119IG0gLSBNYXRyaXggdG8gbm9ybWFsaXplLCByZXByZXNlbnRlZCBieSBhbiBhcnJheSBvZiBsZW5ndGggOS5cbiAqIEByZXR1cm4ge251bWJlcltdfVxuICovXG5mdW5jdGlvbiBub3JtYWxpemUobSkge1xuICBjb25zdCBkZXQgPSBtWzBdICogbVs0XSAqIG1bOF0gKyBtWzFdICogbVs1XSAqIG1bNl0gKyBtWzJdICogbVszXSAqIG1bN10gLSBtWzBdICogbVs1XSAqIG1bN10gLSBtWzFdICogbVszXSAqIG1bOF0gLSBtWzJdICogbVs0XSAqIG1bNl07XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSsrKVxuICAgIG1baV0gLz0gZGV0O1xuXG4gIHJldHVybiBtO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgRXVsZXIgYW5nbGUgYFthbHBoYSwgYmV0YSwgZ2FtbWFdYCB0byB0aGUgVzNDIHNwZWNpZmljYXRpb24sIHdoZXJlOlxuICogLSBgYWxwaGFgIGlzIGluIFswOyArMzYwWztcbiAqIC0gYGJldGFgIGlzIGluIFstMTgwOyArMTgwWztcbiAqIC0gYGdhbW1hYCBpcyBpbiBbLTkwOyArOTBbLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyW119IGV1bGVyQW5nbGUgLSBFdWxlciBhbmdsZSB0byB1bmlmeSwgcmVwcmVzZW50ZWQgYnkgYW4gYXJyYXkgb2YgbGVuZ3RoIDMgKGBbYWxwaGEsIGJldGEsIGdhbW1hXWApLlxuICogQHNlZSB7QGxpbmsgaHR0cDovL3d3dy53My5vcmcvVFIvb3JpZW50YXRpb24tZXZlbnQvfVxuICovXG5mdW5jdGlvbiB1bmlmeShldWxlckFuZ2xlKSB7XG4gIC8vIENmLiBXM0Mgc3BlY2lmaWNhdGlvbiAoaHR0cDovL3czYy5naXRodWIuaW8vZGV2aWNlb3JpZW50YXRpb24vc3BlYy1zb3VyY2Utb3JpZW50YXRpb24uaHRtbClcbiAgLy8gYW5kIEV1bGVyIGFuZ2xlcyBXaWtpcGVkaWEgcGFnZSAoaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FdWxlcl9hbmdsZXMpLlxuICAvL1xuICAvLyBXM0MgY29udmVudGlvbjogVGFpdOKAk0JyeWFuIGFuZ2xlcyBaLVgnLVknJywgd2hlcmU6XG4gIC8vICAgYWxwaGEgaXMgaW4gWzA7ICszNjBbLFxuICAvLyAgIGJldGEgaXMgaW4gWy0xODA7ICsxODBbLFxuICAvLyAgIGdhbW1hIGlzIGluIFstOTA7ICs5MFsuXG5cbiAgY29uc3QgYWxwaGFJc1ZhbGlkID0gKHR5cGVvZiBldWxlckFuZ2xlWzBdID09PSAnbnVtYmVyJyk7XG5cbiAgY29uc3QgX2FscGhhID0gKGFscGhhSXNWYWxpZCA/IGRlZ1RvUmFkKGV1bGVyQW5nbGVbMF0pIDogMCk7XG4gIGNvbnN0IF9iZXRhID0gZGVnVG9SYWQoZXVsZXJBbmdsZVsxXSk7XG4gIGNvbnN0IF9nYW1tYSA9IGRlZ1RvUmFkKGV1bGVyQW5nbGVbMl0pO1xuXG4gIGNvbnN0IGNBID0gTWF0aC5jb3MoX2FscGhhKTtcbiAgY29uc3QgY0IgPSBNYXRoLmNvcyhfYmV0YSk7XG4gIGNvbnN0IGNHID0gTWF0aC5jb3MoX2dhbW1hKTtcbiAgY29uc3Qgc0EgPSBNYXRoLnNpbihfYWxwaGEpO1xuICBjb25zdCBzQiA9IE1hdGguc2luKF9iZXRhKTtcbiAgY29uc3Qgc0cgPSBNYXRoLnNpbihfZ2FtbWEpO1xuXG4gIGxldCBhbHBoYSwgYmV0YSwgZ2FtbWE7XG5cbiAgbGV0IG0gPSBbXG4gICAgY0EgKiBjRyAtIHNBICogc0IgKiBzRyxcbiAgICAtY0IgKiBzQSxcbiAgICBjQSAqIHNHICsgY0cgKiBzQSAqIHNCLFxuICAgIGNHICogc0EgKyBjQSAqIHNCICogc0csXG4gICAgY0EgKiBjQixcbiAgICBzQSAqIHNHIC0gY0EgKiBjRyAqIHNCLFxuICAgIC1jQiAqIHNHLFxuICAgIHNCLFxuICAgIGNCICogY0dcbiAgXTtcbiAgbm9ybWFsaXplKG0pO1xuXG4gIC8vIFNpbmNlIHdlIHdhbnQgZ2FtbWEgaW4gWy05MDsgKzkwWywgY0cgPj0gMC5cbiAgaWYgKG1bOF0gPiAwKSB7XG4gICAgLy8gQ2FzZSAxOiBtWzhdID4gMCA8PT4gY0IgPiAwICAgICAgICAgICAgICAgICAoYW5kIGNHICE9IDApXG4gICAgLy8gICAgICAgICAgICAgICAgICA8PT4gYmV0YSBpbiBdLXBpLzI7ICtwaS8yWyAoYW5kIGNHICE9IDApXG4gICAgYWxwaGEgPSBNYXRoLmF0YW4yKC1tWzFdLCBtWzRdKTtcbiAgICBiZXRhID0gTWF0aC5hc2luKG1bN10pOyAvLyBhc2luIHJldHVybnMgYSBudW1iZXIgYmV0d2VlbiAtcGkvMiBhbmQgK3BpLzIgPT4gT0tcbiAgICBnYW1tYSA9IE1hdGguYXRhbjIoLW1bNl0sIG1bOF0pO1xuICB9IGVsc2UgaWYgKG1bOF0gPCAwKSB7XG4gICAgLy8gQ2FzZSAyOiBtWzhdIDwgMCA8PT4gY0IgPCAwICAgICAgICAgICAgICAgICAgICAgICAgICAgIChhbmQgY0cgIT0gMClcbiAgICAvLyAgICAgICAgICAgICAgICAgIDw9PiBiZXRhIGluIFstcGk7IC1waS8yWyBVIF0rcGkvMjsgK3BpXSAoYW5kIGNHICE9IDApXG5cbiAgICAvLyBTaW5jZSBjQiA8IDAgYW5kIGNCIGlzIGluIG1bMV0gYW5kIG1bNF0sIHRoZSBwb2ludCBpcyBmbGlwcGVkIGJ5IDE4MCBkZWdyZWVzLlxuICAgIC8vIEhlbmNlLCB3ZSBoYXZlIHRvIG11bHRpcGx5IGJvdGggYXJndW1lbnRzIG9mIGF0YW4yIGJ5IC0xIGluIG9yZGVyIHRvIHJldmVydFxuICAgIC8vIHRoZSBwb2ludCBpbiBpdHMgb3JpZ2luYWwgcG9zaXRpb24gKD0+IGFub3RoZXIgZmxpcCBieSAxODAgZGVncmVlcykuXG4gICAgYWxwaGEgPSBNYXRoLmF0YW4yKG1bMV0sIC1tWzRdKTtcbiAgICBiZXRhID0gLU1hdGguYXNpbihtWzddKTtcbiAgICBiZXRhICs9IChiZXRhID49IDApID8gLU1hdGguUEkgOiBNYXRoLlBJOyAvLyBhc2luIHJldHVybnMgYSBudW1iZXIgYmV0d2VlbiAtcGkvMiBhbmQgcGkvMiA9PiBtYWtlIHN1cmUgYmV0YSBpbiBbLXBpOyAtcGkvMlsgVSBdK3BpLzI7ICtwaV1cbiAgICBnYW1tYSA9IE1hdGguYXRhbjIobVs2XSwgLW1bOF0pOyAvLyBzYW1lIHJlbWFyayBhcyBmb3IgYWxwaGEsIG11bHRpcGxpY2F0aW9uIGJ5IC0xXG4gIH0gZWxzZSB7XG4gICAgLy8gQ2FzZSAzOiBtWzhdID0gMCA8PT4gY0IgPSAwIG9yIGNHID0gMFxuICAgIGlmIChtWzZdID4gMCkge1xuICAgICAgLy8gU3ViY2FzZSAxOiBjRyA9IDAgYW5kIGNCID4gMFxuICAgICAgLy8gICAgICAgICAgICBjRyA9IDAgPD0+IHNHID0gLTEgPD0+IGdhbW1hID0gLXBpLzIgPT4gbVs2XSA9IGNCXG4gICAgICAvLyAgICAgICAgICAgIEhlbmNlLCBtWzZdID4gMCA8PT4gY0IgPiAwIDw9PiBiZXRhIGluIF0tcGkvMjsgK3BpLzJbXG4gICAgICBhbHBoYSA9IE1hdGguYXRhbjIoLW1bMV0sIG1bNF0pO1xuICAgICAgYmV0YSA9IE1hdGguYXNpbihtWzddKTsgLy8gYXNpbiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpLzIgYW5kICtwaS8yID0+IE9LXG4gICAgICBnYW1tYSA9IC1NYXRoLlBJIC8gMjtcbiAgICB9IGVsc2UgaWYgKG1bNl0gPCAwKSB7XG4gICAgICAvLyBTdWJjYXNlIDI6IGNHID0gMCBhbmQgY0IgPCAwXG4gICAgICAvLyAgICAgICAgICAgIGNHID0gMCA8PT4gc0cgPSAtMSA8PT4gZ2FtbWEgPSAtcGkvMiA9PiBtWzZdID0gY0JcbiAgICAgIC8vICAgICAgICAgICAgSGVuY2UsIG1bNl0gPCAwIDw9PiBjQiA8IDAgPD0+IGJldGEgaW4gWy1waTsgLXBpLzJbIFUgXStwaS8yOyArcGldXG4gICAgICBhbHBoYSA9IE1hdGguYXRhbjIobVsxXSwgLW1bNF0pOyAvLyBzYW1lIHJlbWFyayBhcyBmb3IgYWxwaGEgaW4gYSBjYXNlIGFib3ZlXG4gICAgICBiZXRhID0gLU1hdGguYXNpbihtWzddKTtcbiAgICAgIGJldGEgKz0gKGJldGEgPj0gMCkgPyAtTWF0aC5QSSA6IE1hdGguUEk7IC8vIGFzaW4gcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waS8yIGFuZCArcGkvMiA9PiBtYWtlIHN1cmUgYmV0YSBpbiBbLXBpOyAtcGkvMlsgVSBdK3BpLzI7ICtwaV1cbiAgICAgIGdhbW1hID0gLU1hdGguUEkgLyAyO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTdWJjYXNlIDM6IGNCID0gMFxuICAgICAgLy8gSW4gdGhlIGNhc2Ugd2hlcmUgY29zKGJldGEpID0gMCAoaS5lLiBiZXRhID0gLXBpLzIgb3IgYmV0YSA9IHBpLzIpLFxuICAgICAgLy8gd2UgaGF2ZSB0aGUgZ2ltYmFsIGxvY2sgcHJvYmxlbTogaW4gdGhhdCBjb25maWd1cmF0aW9uLCBvbmx5IHRoZSBhbmdsZVxuICAgICAgLy8gYWxwaGEgKyBnYW1tYSAoaWYgYmV0YSA9ICtwaS8yKSBvciBhbHBoYSAtIGdhbW1hIChpZiBiZXRhID0gLXBpLzIpXG4gICAgICAvLyBhcmUgdW5pcXVlbHkgZGVmaW5lZDogYWxwaGEgYW5kIGdhbW1hIGNhbiB0YWtlIGFuIGluZmluaXR5IG9mIHZhbHVlcy5cbiAgICAgIC8vIEZvciBjb252ZW5pZW5jZSwgbGV0J3Mgc2V0IGdhbW1hID0gMCAoYW5kIHRodXMgc2luKGdhbW1hKSA9IDApLlxuICAgICAgLy8gKEFzIGEgY29uc2VxdWVuY2Ugb2YgdGhlIGdpbWJhbCBsb2NrIHByb2JsZW0sIHRoZXJlIGlzIGEgZGlzY29udGludWl0eVxuICAgICAgLy8gaW4gYWxwaGEgYW5kIGdhbW1hLilcbiAgICAgIGFscGhhID0gTWF0aC5hdGFuMihtWzNdLCBtWzBdKTtcbiAgICAgIGJldGEgPSAobVs3XSA+IDApID8gTWF0aC5QSSAvIDIgOiAtTWF0aC5QSSAvIDI7XG4gICAgICBnYW1tYSA9IDA7XG4gICAgfVxuICB9XG5cbiAgLy8gYXRhbjIgcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waSBhbmQgcGkgPT4gbWFrZSBzdXJlIHRoYXQgYWxwaGEgaXMgaW4gWzAsIDIqcGlbLlxuICBhbHBoYSArPSAoYWxwaGEgPCAwKSA/IDIgKiBNYXRoLlBJIDogMDtcblxuICBldWxlckFuZ2xlWzBdID0gKGFscGhhSXNWYWxpZCA/IHJhZFRvRGVnKGFscGhhKSA6IG51bGwpO1xuICBldWxlckFuZ2xlWzFdID0gcmFkVG9EZWcoYmV0YSk7XG4gIGV1bGVyQW5nbGVbMl0gPSByYWRUb0RlZyhnYW1tYSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBFdWxlciBhbmdsZSBgW2FscGhhLCBiZXRhLCBnYW1tYV1gIHRvIGEgRXVsZXIgYW5nbGUgd2hlcmU6XG4gKiAtIGBhbHBoYWAgaXMgaW4gWzA7ICszNjBbO1xuICogLSBgYmV0YWAgaXMgaW4gWy05MDsgKzkwWztcbiAqIC0gYGdhbW1hYCBpcyBpbiBbLTE4MDsgKzE4MFsuXG4gKlxuICogQHBhcmFtIHtudW1iZXJbXX0gZXVsZXJBbmdsZSAtIEV1bGVyIGFuZ2xlIHRvIGNvbnZlcnQsIHJlcHJlc2VudGVkIGJ5IGFuIGFycmF5IG9mIGxlbmd0aCAzIChgW2FscGhhLCBiZXRhLCBnYW1tYV1gKS5cbiAqL1xuZnVuY3Rpb24gdW5pZnlBbHQoZXVsZXJBbmdsZSkge1xuICAvLyBDb252ZW50aW9uIGhlcmU6IFRhaXTigJNCcnlhbiBhbmdsZXMgWi1YJy1ZJycsIHdoZXJlOlxuICAvLyAgIGFscGhhIGlzIGluIFswOyArMzYwWyxcbiAgLy8gICBiZXRhIGlzIGluIFstOTA7ICs5MFssXG4gIC8vICAgZ2FtbWEgaXMgaW4gWy0xODA7ICsxODBbLlxuXG4gIGNvbnN0IGFscGhhSXNWYWxpZCA9ICh0eXBlb2YgZXVsZXJBbmdsZVswXSA9PT0gJ251bWJlcicpO1xuXG4gIGNvbnN0IF9hbHBoYSA9IChhbHBoYUlzVmFsaWQgPyBkZWdUb1JhZChldWxlckFuZ2xlWzBdKSA6IDApO1xuICBjb25zdCBfYmV0YSA9IGRlZ1RvUmFkKGV1bGVyQW5nbGVbMV0pO1xuICBjb25zdCBfZ2FtbWEgPSBkZWdUb1JhZChldWxlckFuZ2xlWzJdKTtcblxuICBjb25zdCBjQSA9IE1hdGguY29zKF9hbHBoYSk7XG4gIGNvbnN0IGNCID0gTWF0aC5jb3MoX2JldGEpO1xuICBjb25zdCBjRyA9IE1hdGguY29zKF9nYW1tYSk7XG4gIGNvbnN0IHNBID0gTWF0aC5zaW4oX2FscGhhKTtcbiAgY29uc3Qgc0IgPSBNYXRoLnNpbihfYmV0YSk7XG4gIGNvbnN0IHNHID0gTWF0aC5zaW4oX2dhbW1hKTtcblxuICBsZXQgYWxwaGEsIGJldGEsIGdhbW1hO1xuXG4gIGxldCBtID0gW1xuICAgIGNBICogY0cgLSBzQSAqIHNCICogc0csXG4gICAgLWNCICogc0EsXG4gICAgY0EgKiBzRyArIGNHICogc0EgKiBzQixcbiAgICBjRyAqIHNBICsgY0EgKiBzQiAqIHNHLFxuICAgIGNBICogY0IsXG4gICAgc0EgKiBzRyAtIGNBICogY0cgKiBzQixcbiAgICAtY0IgKiBzRyxcbiAgICBzQixcbiAgICBjQiAqIGNHXG4gIF07XG4gIG5vcm1hbGl6ZShtKTtcblxuICBhbHBoYSA9IE1hdGguYXRhbjIoLW1bMV0sIG1bNF0pO1xuICBhbHBoYSArPSAoYWxwaGEgPCAwKSA/IDIgKiBNYXRoLlBJIDogMDsgLy8gYXRhbjIgcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waSBhbmQgK3BpID0+IG1ha2Ugc3VyZSBhbHBoYSBpcyBpbiBbMCwgMipwaVsuXG4gIGJldGEgPSBNYXRoLmFzaW4obVs3XSk7IC8vIGFzaW4gcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waS8yIGFuZCBwaS8yID0+IE9LXG4gIGdhbW1hID0gTWF0aC5hdGFuMigtbVs2XSwgbVs4XSk7IC8vIGF0YW4yIHJldHVybnMgYSBudW1iZXIgYmV0d2VlbiAtcGkgYW5kICtwaSA9PiBPS1xuXG4gIGV1bGVyQW5nbGVbMF0gPSAoYWxwaGFJc1ZhbGlkID8gcmFkVG9EZWcoYWxwaGEpIDogbnVsbCk7XG4gIGV1bGVyQW5nbGVbMV0gPSByYWRUb0RlZyhiZXRhKTtcbiAgZXVsZXJBbmdsZVsyXSA9IHJhZFRvRGVnKGdhbW1hKTtcbn1cblxuLyoqXG4gKiBgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVgIHNpbmdsZXRvbi5cbiAqIFRoZSBgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVgIHNpbmdsZXRvbiBwcm92aWRlcyB0aGUgcmF3IHZhbHVlc1xuICogb2YgdGhlIG9yaWVudGF0aW9uIHByb3ZpZGVkIGJ5IHRoZSBgRGV2aWNlTW90aW9uYCBldmVudC5cbiAqIEl0IGFsc28gaW5zdGFudGlhdGUgdGhlIGBPcmllbnRhdGlvbmAgc3VibW9kdWxlIHRoYXQgdW5pZmllcyB0aG9zZVxuICogdmFsdWVzIGFjcm9zcyBwbGF0Zm9ybXMgYnkgbWFraW5nIHRoZW0gY29tcGxpYW50IHdpdGgge0BsaW5rXG4gKiBodHRwOi8vd3d3LnczLm9yZy9UUi9vcmllbnRhdGlvbi1ldmVudC98dGhlIFczQyBzdGFuZGFyZH0gKCppLmUuKlxuICogdGhlIGBhbHBoYWAgYW5nbGUgYmV0d2VlbiBgMGAgYW5kIGAzNjBgIGRlZ3JlZXMsIHRoZSBgYmV0YWAgYW5nbGVcbiAqIGJldHdlZW4gYC0xODBgIGFuZCBgMTgwYCBkZWdyZWVzLCBhbmQgYGdhbW1hYCBiZXR3ZWVuIGAtOTBgIGFuZFxuICogYDkwYCBkZWdyZWVzKSwgYXMgd2VsbCBhcyB0aGUgYE9yaWVudGF0aW9uQWx0YCBzdWJtb2R1bGVzICh3aXRoXG4gKiB0aGUgYGFscGhhYCBhbmdsZSBiZXR3ZWVuIGAwYCBhbmQgYDM2MGAgZGVncmVlcywgdGhlIGBiZXRhYCBhbmdsZVxuICogYmV0d2VlbiBgLTkwYCBhbmQgYDkwYCBkZWdyZWVzLCBhbmQgYGdhbW1hYCBiZXR3ZWVuIGAtMTgwYCBhbmRcbiAqIGAxODBgIGRlZ3JlZXMpLlxuICogV2hlbiB0aGUgYG9yaWVudGF0aW9uYCByYXcgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgdGhlIHNlbnNvcnMsXG4gKiB0aGlzIG1vZHVsZXMgdHJpZXMgdG8gcmVjYWxjdWxhdGUgYGJldGFgIGFuZCBgZ2FtbWFgIGZyb20gdGhlXG4gKiBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgbW9kdWxlLCBpZiBhdmFpbGFibGUgKGluIHRoYXQgY2FzZSxcbiAqIHRoZSBgYWxwaGFgIGFuZ2xlIGlzIGltcG9zc2libGUgdG8gcmV0cmlldmUgc2luY2UgdGhlIGNvbXBhc3MgaXNcbiAqIG5vdCBhdmFpbGFibGUpLlxuICpcbiAqIEBjbGFzcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAqIEBleHRlbmRzIElucHV0TW9kdWxlXG4gKi9cbmNsYXNzIERldmljZU9yaWVudGF0aW9uTW9kdWxlIGV4dGVuZHMgSW5wdXRNb2R1bGUge1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBgRGV2aWNlT3JpZW50YXRpb25gIG1vZHVsZSBpbnN0YW5jZS5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignZGV2aWNlb3JpZW50YXRpb24nKTtcblxuICAgIC8qKlxuICAgICAqIFJhdyB2YWx1ZXMgY29taW5nIGZyb20gdGhlIGBkZXZpY2VvcmllbnRhdGlvbmAgZXZlbnQgc2VudCBieSB0aGlzIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFtudWxsLCBudWxsLCBudWxsXVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnQgPSBbbnVsbCwgbnVsbCwgbnVsbF07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYE9yaWVudGF0aW9uYCBtb2R1bGUuXG4gICAgICogUHJvdmlkZXMgdW5pZmllZCB2YWx1ZXMgb2YgdGhlIG9yaWVudGF0aW9uIGNvbXBsaWFudCB3aXRoIHtAbGlua1xuICAgICAqIGh0dHA6Ly93d3cudzMub3JnL1RSL29yaWVudGF0aW9uLWV2ZW50L3x0aGUgVzNDIHN0YW5kYXJkfVxuICAgICAqIChgYWxwaGFgIGluIGBbMCwgMzYwXWAsIGJldGEgaW4gYFstMTgwLCArMTgwXWAsIGBnYW1tYWAgaW4gYFstOTAsICs5MF1gKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBuZXcgRE9NRXZlbnRTdWJtb2R1bGUodGhpcywgJ29yaWVudGF0aW9uJyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYE9yaWVudGF0aW9uQWx0YCBtb2R1bGUuXG4gICAgICogUHJvdmlkZXMgYWx0ZXJuYXRpdmUgdmFsdWVzIG9mIHRoZSBvcmllbnRhdGlvblxuICAgICAqIChgYWxwaGFgIGluIGBbMCwgMzYwXWAsIGJldGEgaW4gYFstOTAsICs5MF1gLCBgZ2FtbWFgIGluIGBbLTE4MCwgKzE4MF1gKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIHRoaXMub3JpZW50YXRpb25BbHQgPSBuZXcgRE9NRXZlbnRTdWJtb2R1bGUodGhpcywgJ29yaWVudGF0aW9uQWx0Jyk7XG5cbiAgICAvKipcbiAgICAgKiBSZXF1aXJlZCBzdWJtb2R1bGVzIC8gZXZlbnRzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gb3JpZW50YXRpb24gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYG9yaWVudGF0aW9uYCB1bmlmaWVkIHZhbHVlcyBhcmUgcmVxdWlyZWQgb3Igbm90IChkZWZhdWx0cyB0byBgZmFsc2VgKS5cbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IG9yaWVudGF0aW9uQWx0IC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGBvcmllbnRhdGlvbkFsdGAgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqL1xuICAgIHRoaXMucmVxdWlyZWQgPSB7XG4gICAgICBvcmllbnRhdGlvbjogZmFsc2UsXG4gICAgICBvcmllbnRhdGlvbkFsdDogZmFsc2VcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZSBmdW5jdGlvbiBvZiB0aGUgbW9kdWxlJ3MgcHJvbWlzZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKiBAc2VlIERldmljZU9yaWVudGF0aW9uTW9kdWxlI2luaXRcbiAgICAgKi9cbiAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBHcmF2aXR5IHZlY3RvciBjYWxjdWxhdGVkIGZyb20gdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2VzdGltYXRlZEdyYXZpdHkgPSBbMCwgMCwgMF07XG5cbiAgICB0aGlzLl9wcm9jZXNzRnVuY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuX3Byb2Nlc3MgPSB0aGlzLl9wcm9jZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZGV2aWNlb3JpZW50YXRpb25DaGVjayA9IHRoaXMuX2RldmljZW9yaWVudGF0aW9uQ2hlY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLl9kZXZpY2VvcmllbnRhdGlvbkxpc3RlbmVyID0gdGhpcy5fZGV2aWNlb3JpZW50YXRpb25MaXN0ZW5lci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbnNvciBjaGVjayBvbiBpbml0aWFsaXphdGlvbiBvZiB0aGUgbW9kdWxlLlxuICAgKiBUaGlzIG1ldGhvZDpcbiAgICogLSBjaGVja3Mgd2hldGhlciB0aGUgYG9yaWVudGF0aW9uYCB2YWx1ZXMgYXJlIHZhbGlkIG9yIG5vdDtcbiAgICogLSAoaW4gdGhlIGNhc2Ugd2hlcmUgb3JpZW50YXRpb24gcmF3IHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkKVxuICAgKiAgIHRyaWVzIHRvIGNhbGN1bGF0ZSB0aGUgb3JpZW50YXRpb24gZnJvbSB0aGVcbiAgICogICBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBGaXJzdCBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGNhdWdodCwgb24gd2hpY2ggdGhlIGNoZWNrIGlzIGRvbmUuXG4gICAqL1xuICBfZGV2aWNlb3JpZW50YXRpb25DaGVjayhlKSB7XG4gICAgLy8gY2xlYXIgdGltZW91dCAoYW50aS1GaXJlZm94IGJ1ZyBzb2x1dGlvbiwgd2luZG93IGV2ZW50IGRldmljZW9yaWVudGF0aW9uIGJlaW5nIG52ZXIgY2FsbGVkKVxuICAgIC8vIHNldCB0aGUgc2V0IHRpbWVvdXQgaW4gaW5pdCgpIGZ1bmN0aW9uXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2NoZWNrVGltZW91dElkKTtcblxuICAgIHRoaXMuaXNQcm92aWRlZCA9IHRydWU7XG5cbiAgICAvLyBTZW5zb3IgYXZhaWxhYmlsaXR5IGZvciB0aGUgb3JpZW50YXRpb24gYW5kIGFsdGVybmF0aXZlIG9yaWVudGF0aW9uXG4gICAgY29uc3QgcmF3VmFsdWVzUHJvdmlkZWQgPSAoKHR5cGVvZiBlLmFscGhhID09PSAnbnVtYmVyJykgJiYgKHR5cGVvZiBlLmJldGEgPT09ICdudW1iZXInKSAmJiAodHlwZW9mIGUuZ2FtbWEgPT09ICdudW1iZXInKSk7XG4gICAgdGhpcy5vcmllbnRhdGlvbi5pc1Byb3ZpZGVkID0gcmF3VmFsdWVzUHJvdmlkZWQ7XG4gICAgdGhpcy5vcmllbnRhdGlvbkFsdC5pc1Byb3ZpZGVkID0gcmF3VmFsdWVzUHJvdmlkZWQ7XG5cbiAgICAvLyBUT0RPKD8pOiBnZXQgcHNldWRvLXBlcmlvZFxuXG4gICAgLy8gc3dhcCB0aGUgcHJvY2VzcyBmdW5jdGlvbiB0byB0aGVcbiAgICB0aGlzLl9wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLl9kZXZpY2VvcmllbnRhdGlvbkxpc3RlbmVyO1xuXG4gICAgLy8gSWYgb3JpZW50YXRpb24gb3IgYWx0ZXJuYXRpdmUgb3JpZW50YXRpb24gYXJlIG5vdCBwcm92aWRlZCBieSByYXcgc2Vuc29ycyBidXQgcmVxdWlyZWQsXG4gICAgLy8gdHJ5IHRvIGNhbGN1bGF0ZSB0aGVtIHdpdGggYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzXG4gICAgaWYgKCh0aGlzLnJlcXVpcmVkLm9yaWVudGF0aW9uICYmICF0aGlzLm9yaWVudGF0aW9uLmlzUHJvdmlkZWQpIHx8ICh0aGlzLnJlcXVpcmVkLm9yaWVudGF0aW9uQWx0ICYmICF0aGlzLm9yaWVudGF0aW9uQWx0LmlzUHJvdmlkZWQpKVxuICAgICAgdGhpcy5fdHJ5QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eUZhbGxiYWNrKCk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcHJvbWlzZVJlc29sdmUodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogYCdkZXZpY2VvcmllbnRhdGlvbidgIGV2ZW50IGNhbGxiYWNrLlxuICAgKiBUaGlzIG1ldGhvZCBlbWl0cyBhbiBldmVudCB3aXRoIHRoZSByYXcgYCdkZXZpY2VvcmllbnRhdGlvbidgIHZhbHVlcyxcbiAgICogYW5kIGVtaXRzIGV2ZW50cyB3aXRoIHRoZSB1bmlmaWVkIGBvcmllbnRhdGlvbmAgYW5kIC8gb3IgdGhlXG4gICAqIGBvcmllbnRhdGlvbkFsdGAgdmFsdWVzIGlmIHRoZXkgYXJlIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge0RldmljZU9yaWVudGF0aW9uRXZlbnR9IGUgLSBgJ2RldmljZW9yaWVudGF0aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgKi9cbiAgX2RldmljZW9yaWVudGF0aW9uTGlzdGVuZXIoZSkge1xuICAgIC8vICdkZXZpY2VvcmllbnRhdGlvbicgZXZlbnQgKHJhdyB2YWx1ZXMpXG4gICAgbGV0IG91dEV2ZW50ID0gdGhpcy5ldmVudDtcblxuICAgIG91dEV2ZW50WzBdID0gZS5hbHBoYTtcbiAgICBvdXRFdmVudFsxXSA9IGUuYmV0YTtcbiAgICBvdXRFdmVudFsyXSA9IGUuZ2FtbWE7XG5cbiAgICBpZiAodGhpcy5saXN0ZW5lcnMuc2l6ZSA+IDApXG4gICAgICB0aGlzLmVtaXQob3V0RXZlbnQpO1xuXG4gICAgLy8gJ29yaWVudGF0aW9uJyBldmVudCAodW5pZmllZCB2YWx1ZXMpXG4gICAgaWYgKHRoaXMub3JpZW50YXRpb24ubGlzdGVuZXJzLnNpemUgPiAwICYmXG4gICAgICAgIHRoaXMucmVxdWlyZWQub3JpZW50YXRpb24gJiZcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbi5pc1Byb3ZpZGVkXG4gICAgKSB7XG4gICAgICAvLyBPbiBpT1MsIHRoZSBgYWxwaGFgIHZhbHVlIGlzIGluaXRpYWxpemVkIGF0IGAwYCBvbiB0aGUgZmlyc3QgYGRldmljZW9yaWVudGF0aW9uYCBldmVudFxuICAgICAgLy8gc28gd2Uga2VlcCB0aGF0IHJlZmVyZW5jZSBpbiBtZW1vcnkgdG8gY2FsY3VsYXRlIHRoZSBOb3J0aCBsYXRlciBvblxuICAgICAgaWYgKCF0aGlzLm9yaWVudGF0aW9uLl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSAmJiBlLndlYmtpdENvbXBhc3NIZWFkaW5nICYmIHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycpXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24uX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlID0gZS53ZWJraXRDb21wYXNzSGVhZGluZztcblxuICAgICAgbGV0IG91dEV2ZW50ID0gdGhpcy5vcmllbnRhdGlvbi5ldmVudDtcblxuICAgICAgb3V0RXZlbnRbMF0gPSBlLmFscGhhO1xuICAgICAgb3V0RXZlbnRbMV0gPSBlLmJldGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGUuZ2FtbWE7XG5cbiAgICAgIC8vIE9uIGlPUywgcmVwbGFjZSB0aGUgYGFscGhhYCB2YWx1ZSBieSB0aGUgTm9ydGggdmFsdWUgYW5kIHVuaWZ5IHRoZSBhbmdsZXNcbiAgICAgIC8vICh0aGUgZGVmYXVsdCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYW5nbGVzIG9uIGlPUyBpcyBub3QgY29tcGxpYW50IHdpdGggdGhlIFczQyBzcGVjaWZpY2F0aW9uKVxuICAgICAgaWYgKHRoaXMub3JpZW50YXRpb24uX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlICYmIHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycpIHtcbiAgICAgICAgb3V0RXZlbnRbMF0gKz0gMzYwIC0gdGhpcy5vcmllbnRhdGlvbi5fd2Via2l0Q29tcGFzc0hlYWRpbmdSZWZlcmVuY2U7XG4gICAgICAgIHVuaWZ5KG91dEV2ZW50KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcmllbnRhdGlvbi5lbWl0KG91dEV2ZW50KTtcbiAgICB9XG5cbiAgICAvLyAnb3JpZW50YXRpb25BbHQnIGV2ZW50XG4gICAgaWYgKHRoaXMub3JpZW50YXRpb25BbHQubGlzdGVuZXJzLnNpemUgPiAwICYmXG4gICAgICAgIHRoaXMucmVxdWlyZWQub3JpZW50YXRpb25BbHQgJiZcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbkFsdC5pc1Byb3ZpZGVkXG4gICAgKSB7XG4gICAgICAvLyBPbiBpT1MsIHRoZSBgYWxwaGFgIHZhbHVlIGlzIGluaXRpYWxpemVkIGF0IGAwYCBvbiB0aGUgZmlyc3QgYGRldmljZW9yaWVudGF0aW9uYCBldmVudFxuICAgICAgLy8gc28gd2Uga2VlcCB0aGF0IHJlZmVyZW5jZSBpbiBtZW1vcnkgdG8gY2FsY3VsYXRlIHRoZSBOb3J0aCBsYXRlciBvblxuICAgICAgaWYgKCF0aGlzLm9yaWVudGF0aW9uQWx0Ll93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSAmJiBlLndlYmtpdENvbXBhc3NIZWFkaW5nICYmIHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycpXG4gICAgICAgIHRoaXMub3JpZW50YXRpb25BbHQuX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlID0gZS53ZWJraXRDb21wYXNzSGVhZGluZztcblxuICAgICAgbGV0IG91dEV2ZW50ID0gdGhpcy5vcmllbnRhdGlvbkFsdC5ldmVudDtcblxuICAgICAgb3V0RXZlbnRbMF0gPSBlLmFscGhhO1xuICAgICAgb3V0RXZlbnRbMV0gPSBlLmJldGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGUuZ2FtbWE7XG5cbiAgICAgIC8vIE9uIGlPUywgcmVwbGFjZSB0aGUgYGFscGhhYCB2YWx1ZSBieSB0aGUgTm9ydGggdmFsdWUgYnV0IGRvIG5vdCBjb252ZXJ0IHRoZSBhbmdsZXNcbiAgICAgIC8vICh0aGUgZGVmYXVsdCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYW5nbGVzIG9uIGlPUyBpcyBjb21wbGlhbnQgd2l0aCB0aGUgYWx0ZXJuYXRpdmUgcmVwcmVzZW50YXRpb24pXG4gICAgICBpZiAodGhpcy5vcmllbnRhdGlvbkFsdC5fd2Via2l0Q29tcGFzc0hlYWRpbmdSZWZlcmVuY2UgJiYgcGxhdGZvcm0ub3MuZmFtaWx5ID09PSAnaU9TJyl7XG4gICAgICAgIG91dEV2ZW50WzBdIC09IHRoaXMub3JpZW50YXRpb25BbHQuX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlO1xuICAgICAgICBvdXRFdmVudFswXSArPSAob3V0RXZlbnRbMF0gPCAwKSA/IDM2MCA6IDA7IC8vIG1ha2Ugc3VyZSBgYWxwaGFgIGlzIGluIFswLCArMzYwW1xuICAgICAgfVxuXG4gICAgICAvLyBPbiBBbmRyb2lkLCB0cmFuc2Zvcm0gdGhlIGFuZ2xlcyB0byB0aGUgYWx0ZXJuYXRpdmUgcmVwcmVzZW50YXRpb25cbiAgICAgIC8vICh0aGUgZGVmYXVsdCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYW5nbGVzIG9uIEFuZHJvaWQgaXMgY29tcGxpYW50IHdpdGggdGhlIFczQyBzcGVjaWZpY2F0aW9uKVxuICAgICAgaWYgKHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ0FuZHJvaWQnKVxuICAgICAgICB1bmlmeUFsdChvdXRFdmVudCk7XG5cbiAgICAgIHRoaXMub3JpZW50YXRpb25BbHQuZW1pdChvdXRFdmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIGBiZXRhYCBhbmQgYGdhbW1hYCBjYW4gYmUgY2FsY3VsYXRlZCBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdmFsdWVzIG9yIG5vdC5cbiAgICovXG4gIF90cnlBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RmFsbGJhY2soKSB7XG4gICAgTW90aW9uSW5wdXQucmVxdWlyZU1vZHVsZSgnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScpXG4gICAgICAudGhlbigoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSkgPT4ge1xuICAgICAgICBpZiAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1ZhbGlkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJXQVJOSU5HIChtb3Rpb24taW5wdXQpOiBUaGUgJ2RldmljZW9yaWVudGF0aW9uJyBldmVudCBkb2VzIG5vdCBleGlzdCBvciBkb2VzIG5vdCBwcm92aWRlIHZhbHVlcyBpbiB5b3VyIGJyb3dzZXIsIHNvIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgZGV2aWNlIGlzIGVzdGltYXRlZCBmcm9tIERldmljZU1vdGlvbidzICdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JyBldmVudC4gU2luY2UgdGhlIGNvbXBhc3MgaXMgbm90IGF2YWlsYWJsZSwgb25seSB0aGUgYGJldGFgIGFuZCBgZ2FtbWFgIGFuZ2xlcyBhcmUgcHJvdmlkZWQgKGBhbHBoYWAgaXMgbnVsbCkuXCIpO1xuXG4gICAgICAgICAgaWYgKHRoaXMucmVxdWlyZWQub3JpZW50YXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMub3JpZW50YXRpb24uaXNDYWxjdWxhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMub3JpZW50YXRpb24ucGVyaW9kID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5wZXJpb2Q7XG5cbiAgICAgICAgICAgIE1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JywgKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlQmV0YUFuZEdhbW1hRnJvbUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5yZXF1aXJlZC5vcmllbnRhdGlvbkFsdCkge1xuICAgICAgICAgICAgdGhpcy5vcmllbnRhdGlvbkFsdC5pc0NhbGN1bGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vcmllbnRhdGlvbkFsdC5wZXJpb2QgPSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnBlcmlvZDtcblxuICAgICAgICAgICAgTW90aW9uSW5wdXQuYWRkTGlzdGVuZXIoJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknLCAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVCZXRhQW5kR2FtbWFGcm9tQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eShhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LCB0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlKHRoaXMpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBhbmQgZW1pdHMgYGJldGFgIGFuZCBgZ2FtbWFgIHZhbHVlcyBhcyBhIGZhbGxiYWNrIG9mIHRoZSBgb3JpZW50YXRpb25gIGFuZCAvIG9yIGBvcmllbnRhdGlvbkFsdGAgZXZlbnRzLCBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyW119IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgLSBMYXRlc3QgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgcmF3IHZhbHVlcy5cbiAgICogQHBhcmFtIHtib29sfSBbYWx0PWZhbHNlXSAtIEluZGljYXRlcyB3aGV0aGVyIHdlIG5lZWQgdGhlIGFsdGVybmF0ZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgYW5nbGVzIG9yIG5vdC5cbiAgICovXG4gIF9jYWxjdWxhdGVCZXRhQW5kR2FtbWFGcm9tQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eShhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LCBhbHQgPSBmYWxzZSkge1xuICAgIGNvbnN0IGsgPSAwLjg7XG5cbiAgICAvLyBMb3cgcGFzcyBmaWx0ZXIgdG8gZXN0aW1hdGUgdGhlIGdyYXZpdHlcbiAgICB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzBdID0gayAqIHRoaXMuX2VzdGltYXRlZEdyYXZpdHlbMF0gKyAoMSAtIGspICogYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXTtcbiAgICB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzFdID0gayAqIHRoaXMuX2VzdGltYXRlZEdyYXZpdHlbMV0gKyAoMSAtIGspICogYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXTtcbiAgICB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzJdID0gayAqIHRoaXMuX2VzdGltYXRlZEdyYXZpdHlbMl0gKyAoMSAtIGspICogYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXTtcblxuICAgIGxldCBfZ1ggPSB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzBdO1xuICAgIGxldCBfZ1kgPSB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzFdO1xuICAgIGxldCBfZ1ogPSB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzJdO1xuXG4gICAgY29uc3Qgbm9ybSA9IE1hdGguc3FydChfZ1ggKiBfZ1ggKyBfZ1kgKiBfZ1kgKyBfZ1ogKiBfZ1opO1xuXG4gICAgX2dYIC89IG5vcm07XG4gICAgX2dZIC89IG5vcm07XG4gICAgX2daIC89IG5vcm07XG5cbiAgICAvLyBBZG9wdGluZyB0aGUgZm9sbG93aW5nIGNvbnZlbnRpb25zOlxuICAgIC8vIC0gZWFjaCBtYXRyaXggb3BlcmF0ZXMgYnkgcHJlLW11bHRpcGx5aW5nIGNvbHVtbiB2ZWN0b3JzLFxuICAgIC8vIC0gZWFjaCBtYXRyaXggcmVwcmVzZW50cyBhbiBhY3RpdmUgcm90YXRpb24sXG4gICAgLy8gLSBlYWNoIG1hdHJpeCByZXByZXNlbnRzIHRoZSBjb21wb3NpdGlvbiBvZiBpbnRyaW5zaWMgcm90YXRpb25zLFxuICAgIC8vIHRoZSByb3RhdGlvbiBtYXRyaXggcmVwcmVzZW50aW5nIHRoZSBjb21wb3NpdGlvbiBvZiBhIHJvdGF0aW9uXG4gICAgLy8gYWJvdXQgdGhlIHgtYXhpcyBieSBhbiBhbmdsZSBiZXRhIGFuZCBhIHJvdGF0aW9uIGFib3V0IHRoZSB5LWF4aXNcbiAgICAvLyBieSBhbiBhbmdsZSBnYW1tYSBpczpcbiAgICAvL1xuICAgIC8vIFsgY29zKGdhbW1hKSAgICAgICAgICAgICAgICwgIDAgICAgICAgICAgLCAgc2luKGdhbW1hKSAgICAgICAgICAgICAgLFxuICAgIC8vICAgc2luKGJldGEpICogc2luKGdhbW1hKSAgICwgIGNvcyhiZXRhKSAgLCAgLWNvcyhnYW1tYSkgKiBzaW4oYmV0YSkgLFxuICAgIC8vICAgLWNvcyhiZXRhKSAqIHNpbihnYW1tYSkgICwgIHNpbihiZXRhKSAgLCAgY29zKGJldGEpICogY29zKGdhbW1hKSAgXS5cbiAgICAvL1xuICAgIC8vIEhlbmNlLCB0aGUgcHJvamVjdGlvbiBvZiB0aGUgbm9ybWFsaXplZCBncmF2aXR5IGcgPSBbMCwgMCwgMV1cbiAgICAvLyBpbiB0aGUgZGV2aWNlJ3MgcmVmZXJlbmNlIGZyYW1lIGNvcnJlc3BvbmRzIHRvOlxuICAgIC8vXG4gICAgLy8gZ1ggPSAtY29zKGJldGEpICogc2luKGdhbW1hKSxcbiAgICAvLyBnWSA9IHNpbihiZXRhKSxcbiAgICAvLyBnWiA9IGNvcyhiZXRhKSAqIGNvcyhnYW1tYSksXG4gICAgLy9cbiAgICAvLyBzbyBiZXRhID0gYXNpbihnWSkgYW5kIGdhbW1hID0gYXRhbjIoLWdYLCBnWikuXG5cbiAgICAvLyBCZXRhICYgZ2FtbWEgZXF1YXRpb25zICh3ZSBhcHByb3hpbWF0ZSBbZ1gsIGdZLCBnWl0gYnkgW19nWCwgX2dZLCBfZ1pdKVxuICAgIGxldCBiZXRhID0gcmFkVG9EZWcoTWF0aC5hc2luKF9nWSkpOyAvLyBiZXRhIGlzIGluIFstcGkvMjsgcGkvMltcbiAgICBsZXQgZ2FtbWEgPSByYWRUb0RlZyhNYXRoLmF0YW4yKC1fZ1gsIF9nWikpOyAvLyBnYW1tYSBpcyBpbiBbLXBpOyBwaVtcblxuICAgIGlmIChhbHQpIHtcbiAgICAgIC8vIEluIHRoYXQgY2FzZSwgdGhlcmUgaXMgbm90aGluZyB0byBkbyBzaW5jZSB0aGUgY2FsY3VsYXRpb25zIGFib3ZlIGdhdmUgdGhlIGFuZ2xlIGluIHRoZSByaWdodCByYW5nZXNcbiAgICAgIGxldCBvdXRFdmVudCA9IHRoaXMub3JpZW50YXRpb25BbHQuZXZlbnQ7XG4gICAgICBvdXRFdmVudFswXSA9IG51bGw7XG4gICAgICBvdXRFdmVudFsxXSA9IGJldGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGdhbW1hO1xuXG4gICAgICB0aGlzLm9yaWVudGF0aW9uQWx0LmVtaXQob3V0RXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBIZXJlIHdlIGhhdmUgdG8gdW5pZnkgdGhlIGFuZ2xlcyB0byBnZXQgdGhlIHJhbmdlcyBjb21wbGlhbnQgd2l0aCB0aGUgVzNDIHNwZWNpZmljYXRpb25cbiAgICAgIGxldCBvdXRFdmVudCA9IHRoaXMub3JpZW50YXRpb24uZXZlbnQ7XG4gICAgICBvdXRFdmVudFswXSA9IG51bGw7XG4gICAgICBvdXRFdmVudFsxXSA9IGJldGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGdhbW1hO1xuICAgICAgdW5pZnkob3V0RXZlbnQpO1xuXG4gICAgICB0aGlzLm9yaWVudGF0aW9uLmVtaXQob3V0RXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIF9wcm9jZXNzKGRhdGEpIHtcbiAgICB0aGlzLl9wcm9jZXNzRnVuY3Rpb24oZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgb2YgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIHN1cGVyLmluaXQoKHJlc29sdmUpID0+IHtcbiAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlID0gcmVzb2x2ZTtcblxuICAgICAgaWYgKHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50KSB7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NGdW5jdGlvbiA9IHRoaXMuX2RldmljZW9yaWVudGF0aW9uQ2hlY2s7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIHRoaXMuX3Byb2Nlc3MsIGZhbHNlKTtcbiAgICAgICAgLy8gc2V0IGZhbGxiYWNrIHRpbWVvdXQgZm9yIEZpcmVmb3ggKGl0cyB3aW5kb3cgbmV2ZXIgY2FsbGluZyB0aGUgRGV2aWNlT3JpZW50YXRpb24gZXZlbnQsIGEgXG4gICAgICAgIC8vIHJlcXVpcmUgb2YgdGhlIERldmljZU9yaWVudGF0aW9uIHNlcnZpY2Ugd2lsbCByZXN1bHQgaW4gdGhlIHJlcXVpcmUgcHJvbWlzZSBuZXZlciBiZWluZyByZXNvbHZlZFxuICAgICAgICAvLyBoZW5jZSB0aGUgRXhwZXJpbWVudCBzdGFydCgpIG1ldGhvZCBuZXZlciBjYWxsZWQpXG4gICAgICAgIHRoaXMuX2NoZWNrVGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiByZXNvbHZlKHRoaXMpLCA1MDApO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnJlcXVpcmVkLm9yaWVudGF0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyeUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlGYWxsYmFjaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGUoKTtcbiJdfQ==