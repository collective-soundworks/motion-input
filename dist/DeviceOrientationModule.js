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
     * Number of listeners subscribed to the `DeviceOrientation` module.
     *
     * @this DeviceOrientationModule
     * @type {number}
     */
    _this._numListeners = 0;

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

    /**
     * Method binding of the sensor check.
     *
     * @this DeviceOrientationModule
     * @type {function}
     */
    _this._deviceorientationCheck = _this._deviceorientationCheck.bind(_this);

    /**
     * Method binding of the `'deviceorientation'` event callback.
     *
     * @this DeviceOrientationModule
     * @type {function}
     */
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

      // We only need to listen to one event (=> remove the listener)
      window.removeEventListener('deviceorientation', this._deviceorientationCheck, false);

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

      this.emit(outEvent);

      // 'orientation' event (unified values)
      if (this.required.orientation && this.orientation.isProvided) {
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
      if (this.required.orientationAlt && this.orientationAlt.isProvided) {
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

    /**
     * Increases the number of listeners to this module (either because someone listens
     * to this module, or one of the two `DOMEventSubmodules` (`Orientation`,
     * `OrientationAlt`).
     * When the number of listeners reaches `1`, adds a `'deviceorientation'`
     * event listener.
     *
     * @see DeviceOrientationModule#addListener
     * @see DOMEventSubmodule#start
     */

  }, {
    key: '_addListener',
    value: function _addListener() {
      this._numListeners++;

      if (this._numListeners === 1) window.addEventListener('deviceorientation', this._deviceorientationListener, false);
    }

    /**
     * Decreases the number of listeners to this module (either because someone stops
     * listening to this module, or one of the three `DOMEventSubmodules`
     * (`Orientation`, `OrientationAlt`).
     * When the number of listeners reaches `0`, removes the `'deviceorientation'`
     * event listener.
     *
     * @see DeviceOrientationModule#removeListener
     * @see DOMEventSubmodule#stop
     */

  }, {
    key: '_removeListener',
    value: function _removeListener() {
      this._numListeners--;

      if (this._numListeners === 0) {
        window.removeEventListener('deviceorientation', this._deviceorientationListener, false);
        this.orientation._webkitCompassHeadingReference = null; // don't forget to reset the compass reference since this reference is set each time we start listening to a `'deviceorientation'` event
      }
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

        if (window.DeviceOrientationEvent) window.addEventListener('deviceorientation', _this3._deviceorientationCheck, false);else if (_this3.required.orientation) _this3._tryAccelerationIncludingGravityFallback();else resolve(_this3);
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
      _get(DeviceOrientationModule.prototype.__proto__ || Object.getPrototypeOf(DeviceOrientationModule.prototype), 'addListener', this).call(this, listener);
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
      _get(DeviceOrientationModule.prototype.__proto__ || Object.getPrototypeOf(DeviceOrientationModule.prototype), 'removeListener', this).call(this, listener);
      this._removeListener();
    }
  }]);

  return DeviceOrientationModule;
}(_InputModule3.default);

exports.default = new DeviceOrientationModule();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRldmljZU9yaWVudGF0aW9uTW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZ1RvUmFkIiwiZGVnIiwiTWF0aCIsIlBJIiwicmFkVG9EZWciLCJyYWQiLCJub3JtYWxpemUiLCJtIiwiZGV0IiwiaSIsImxlbmd0aCIsInVuaWZ5IiwiZXVsZXJBbmdsZSIsImFscGhhSXNWYWxpZCIsIl9hbHBoYSIsIl9iZXRhIiwiX2dhbW1hIiwiY0EiLCJjb3MiLCJjQiIsImNHIiwic0EiLCJzaW4iLCJzQiIsInNHIiwiYWxwaGEiLCJiZXRhIiwiZ2FtbWEiLCJhdGFuMiIsImFzaW4iLCJ1bmlmeUFsdCIsIkRldmljZU9yaWVudGF0aW9uTW9kdWxlIiwiZXZlbnQiLCJvcmllbnRhdGlvbiIsIm9yaWVudGF0aW9uQWx0IiwicmVxdWlyZWQiLCJfbnVtTGlzdGVuZXJzIiwiX3Byb21pc2VSZXNvbHZlIiwiX2VzdGltYXRlZEdyYXZpdHkiLCJfZGV2aWNlb3JpZW50YXRpb25DaGVjayIsImJpbmQiLCJfZGV2aWNlb3JpZW50YXRpb25MaXN0ZW5lciIsImUiLCJpc1Byb3ZpZGVkIiwicmF3VmFsdWVzUHJvdmlkZWQiLCJ3aW5kb3ciLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiX3RyeUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlGYWxsYmFjayIsIm91dEV2ZW50IiwiZW1pdCIsIl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSIsIndlYmtpdENvbXBhc3NIZWFkaW5nIiwib3MiLCJmYW1pbHkiLCJyZXF1aXJlTW9kdWxlIiwidGhlbiIsImFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkiLCJpc1ZhbGlkIiwiY29uc29sZSIsImxvZyIsImlzQ2FsY3VsYXRlZCIsInBlcmlvZCIsImFkZExpc3RlbmVyIiwiX2NhbGN1bGF0ZUJldGFBbmRHYW1tYUZyb21BY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IiwiYWx0IiwiayIsIl9nWCIsIl9nWSIsIl9nWiIsIm5vcm0iLCJzcXJ0IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlc29sdmUiLCJEZXZpY2VPcmllbnRhdGlvbkV2ZW50IiwibGlzdGVuZXIiLCJfYWRkTGlzdGVuZXIiLCJfcmVtb3ZlTGlzdGVuZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7OztBQU1BLFNBQVNBLFFBQVQsQ0FBa0JDLEdBQWxCLEVBQXVCO0FBQ3JCLFNBQU9BLE1BQU1DLEtBQUtDLEVBQVgsR0FBZ0IsR0FBdkI7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsU0FBU0MsUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUI7QUFDckIsU0FBT0EsTUFBTSxHQUFOLEdBQVlILEtBQUtDLEVBQXhCO0FBQ0Q7O0FBRUQ7Ozs7OztBQU1BLFNBQVNHLFNBQVQsQ0FBbUJDLENBQW5CLEVBQXNCO0FBQ3BCLE1BQU1DLE1BQU1ELEVBQUUsQ0FBRixJQUFPQSxFQUFFLENBQUYsQ0FBUCxHQUFjQSxFQUFFLENBQUYsQ0FBZCxHQUFxQkEsRUFBRSxDQUFGLElBQU9BLEVBQUUsQ0FBRixDQUFQLEdBQWNBLEVBQUUsQ0FBRixDQUFuQyxHQUEwQ0EsRUFBRSxDQUFGLElBQU9BLEVBQUUsQ0FBRixDQUFQLEdBQWNBLEVBQUUsQ0FBRixDQUF4RCxHQUErREEsRUFBRSxDQUFGLElBQU9BLEVBQUUsQ0FBRixDQUFQLEdBQWNBLEVBQUUsQ0FBRixDQUE3RSxHQUFvRkEsRUFBRSxDQUFGLElBQU9BLEVBQUUsQ0FBRixDQUFQLEdBQWNBLEVBQUUsQ0FBRixDQUFsRyxHQUF5R0EsRUFBRSxDQUFGLElBQU9BLEVBQUUsQ0FBRixDQUFQLEdBQWNBLEVBQUUsQ0FBRixDQUFuSTs7QUFFQSxPQUFLLElBQUlFLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsRUFBRUcsTUFBdEIsRUFBOEJELEdBQTlCO0FBQ0VGLE1BQUVFLENBQUYsS0FBUUQsR0FBUjtBQURGLEdBR0EsT0FBT0QsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7QUFT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OztBQUVEOzs7Ozs7Ozs7Ozs7O3NDQVVrQjtBQUNoQixXQUFLTCxhQUFMOztBQUVBLFVBQUksS0FBS0EsYUFBTCxLQUF1QixDQUEzQixFQUE4QjtBQUM1QlMsZUFBT0MsbUJBQVAsQ0FBMkIsbUJBQTNCLEVBQWdELEtBQUtMLDBCQUFyRCxFQUFpRixLQUFqRjtBQUNBLGFBQUtSLFdBQUwsQ0FBaUJpQiw4QkFBakIsR0FBa0QsSUFBbEQsQ0FGNEIsQ0FFNEI7QUFDekQ7QUFDRjs7QUFFRDs7Ozs7Ozs7MkJBS087QUFBQTs7QUFDTCxvSkFBa0IsVUFBQ3NCLE9BQUQsRUFBYTtBQUM3QixlQUFLbkMsZUFBTCxHQUF1Qm1DLE9BQXZCOztBQUVBLFlBQUkzQixPQUFPNEIsc0JBQVgsRUFDRTVCLE9BQU8wQixnQkFBUCxDQUF3QixtQkFBeEIsRUFBNkMsT0FBS2hDLHVCQUFsRCxFQUEyRSxLQUEzRSxFQURGLEtBRUssSUFBSSxPQUFLSixRQUFMLENBQWNGLFdBQWxCLEVBQ0gsT0FBS2Msd0NBQUwsR0FERyxLQUdIeUI7QUFDSCxPQVREO0FBVUQ7O0FBRUQ7Ozs7Ozs7O2dDQUtZRSxRLEVBQVU7QUFDcEIsb0pBQWtCQSxRQUFsQjtBQUNBLFdBQUtDLFlBQUw7QUFDRDs7QUFFRDs7Ozs7Ozs7bUNBS2VELFEsRUFBVTtBQUN2Qix1SkFBcUJBLFFBQXJCO0FBQ0EsV0FBS0UsZUFBTDtBQUNEOzs7Ozs7a0JBR1ksSUFBSTdDLHVCQUFKLEUiLCJmaWxlIjoiRGV2aWNlT3JpZW50YXRpb25Nb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRE9NRXZlbnRTdWJtb2R1bGUgZnJvbSAnLi9ET01FdmVudFN1Ym1vZHVsZSc7XG5pbXBvcnQgSW5wdXRNb2R1bGUgZnJvbSAnLi9JbnB1dE1vZHVsZSc7XG5pbXBvcnQgTW90aW9uSW5wdXQgZnJvbSAnLi9Nb3Rpb25JbnB1dCc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAncGxhdGZvcm0nO1xuXG4vKipcbiAqIENvbnZlcnRzIGRlZ3JlZXMgdG8gcmFkaWFucy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gZGVnIC0gQW5nbGUgaW4gZGVncmVlcy5cbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gZGVnVG9SYWQoZGVnKSB7XG4gIHJldHVybiBkZWcgKiBNYXRoLlBJIC8gMTgwO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHJhZGlhbnMgdG8gZGVncmVlcy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gcmFkIC0gQW5nbGUgaW4gcmFkaWFucy5cbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gcmFkVG9EZWcocmFkKSB7XG4gIHJldHVybiByYWQgKiAxODAgLyBNYXRoLlBJO1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZXMgYSAzIHggMyBtYXRyaXguXG4gKlxuICogQHBhcmFtIHtudW1iZXJbXX0gbSAtIE1hdHJpeCB0byBub3JtYWxpemUsIHJlcHJlc2VudGVkIGJ5IGFuIGFycmF5IG9mIGxlbmd0aCA5LlxuICogQHJldHVybiB7bnVtYmVyW119XG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZShtKSB7XG4gIGNvbnN0IGRldCA9IG1bMF0gKiBtWzRdICogbVs4XSArIG1bMV0gKiBtWzVdICogbVs2XSArIG1bMl0gKiBtWzNdICogbVs3XSAtIG1bMF0gKiBtWzVdICogbVs3XSAtIG1bMV0gKiBtWzNdICogbVs4XSAtIG1bMl0gKiBtWzRdICogbVs2XTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG0ubGVuZ3RoOyBpKyspXG4gICAgbVtpXSAvPSBkZXQ7XG5cbiAgcmV0dXJuIG07XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBFdWxlciBhbmdsZSBgW2FscGhhLCBiZXRhLCBnYW1tYV1gIHRvIHRoZSBXM0Mgc3BlY2lmaWNhdGlvbiwgd2hlcmU6XG4gKiAtIGBhbHBoYWAgaXMgaW4gWzA7ICszNjBbO1xuICogLSBgYmV0YWAgaXMgaW4gWy0xODA7ICsxODBbO1xuICogLSBgZ2FtbWFgIGlzIGluIFstOTA7ICs5MFsuXG4gKlxuICogQHBhcmFtIHtudW1iZXJbXX0gZXVsZXJBbmdsZSAtIEV1bGVyIGFuZ2xlIHRvIHVuaWZ5LCByZXByZXNlbnRlZCBieSBhbiBhcnJheSBvZiBsZW5ndGggMyAoYFthbHBoYSwgYmV0YSwgZ2FtbWFdYCkuXG4gKiBAc2VlIHtAbGluayBodHRwOi8vd3d3LnczLm9yZy9UUi9vcmllbnRhdGlvbi1ldmVudC99XG4gKi9cbmZ1bmN0aW9uIHVuaWZ5KGV1bGVyQW5nbGUpIHtcbiAgLy8gQ2YuIFczQyBzcGVjaWZpY2F0aW9uIChodHRwOi8vdzNjLmdpdGh1Yi5pby9kZXZpY2VvcmllbnRhdGlvbi9zcGVjLXNvdXJjZS1vcmllbnRhdGlvbi5odG1sKVxuICAvLyBhbmQgRXVsZXIgYW5nbGVzIFdpa2lwZWRpYSBwYWdlIChodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0V1bGVyX2FuZ2xlcykuXG4gIC8vXG4gIC8vIFczQyBjb252ZW50aW9uOiBUYWl04oCTQnJ5YW4gYW5nbGVzIFotWCctWScnLCB3aGVyZTpcbiAgLy8gICBhbHBoYSBpcyBpbiBbMDsgKzM2MFssXG4gIC8vICAgYmV0YSBpcyBpbiBbLTE4MDsgKzE4MFssXG4gIC8vICAgZ2FtbWEgaXMgaW4gWy05MDsgKzkwWy5cblxuICBjb25zdCBhbHBoYUlzVmFsaWQgPSAodHlwZW9mIGV1bGVyQW5nbGVbMF0gPT09ICdudW1iZXInKTtcblxuICBjb25zdCBfYWxwaGEgPSAoYWxwaGFJc1ZhbGlkID8gZGVnVG9SYWQoZXVsZXJBbmdsZVswXSkgOiAwKTtcbiAgY29uc3QgX2JldGEgPSBkZWdUb1JhZChldWxlckFuZ2xlWzFdKTtcbiAgY29uc3QgX2dhbW1hID0gZGVnVG9SYWQoZXVsZXJBbmdsZVsyXSk7XG5cbiAgY29uc3QgY0EgPSBNYXRoLmNvcyhfYWxwaGEpO1xuICBjb25zdCBjQiA9IE1hdGguY29zKF9iZXRhKTtcbiAgY29uc3QgY0cgPSBNYXRoLmNvcyhfZ2FtbWEpO1xuICBjb25zdCBzQSA9IE1hdGguc2luKF9hbHBoYSk7XG4gIGNvbnN0IHNCID0gTWF0aC5zaW4oX2JldGEpO1xuICBjb25zdCBzRyA9IE1hdGguc2luKF9nYW1tYSk7XG5cbiAgbGV0IGFscGhhLCBiZXRhLCBnYW1tYTtcblxuICBsZXQgbSA9IFtcbiAgICBjQSAqIGNHIC0gc0EgKiBzQiAqIHNHLFxuICAgIC1jQiAqIHNBLFxuICAgIGNBICogc0cgKyBjRyAqIHNBICogc0IsXG4gICAgY0cgKiBzQSArIGNBICogc0IgKiBzRyxcbiAgICBjQSAqIGNCLFxuICAgIHNBICogc0cgLSBjQSAqIGNHICogc0IsXG4gICAgLWNCICogc0csXG4gICAgc0IsXG4gICAgY0IgKiBjR1xuICBdO1xuICBub3JtYWxpemUobSk7XG5cbiAgLy8gU2luY2Ugd2Ugd2FudCBnYW1tYSBpbiBbLTkwOyArOTBbLCBjRyA+PSAwLlxuICBpZiAobVs4XSA+IDApIHtcbiAgICAvLyBDYXNlIDE6IG1bOF0gPiAwIDw9PiBjQiA+IDAgICAgICAgICAgICAgICAgIChhbmQgY0cgIT0gMClcbiAgICAvLyAgICAgICAgICAgICAgICAgIDw9PiBiZXRhIGluIF0tcGkvMjsgK3BpLzJbIChhbmQgY0cgIT0gMClcbiAgICBhbHBoYSA9IE1hdGguYXRhbjIoLW1bMV0sIG1bNF0pO1xuICAgIGJldGEgPSBNYXRoLmFzaW4obVs3XSk7IC8vIGFzaW4gcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waS8yIGFuZCArcGkvMiA9PiBPS1xuICAgIGdhbW1hID0gTWF0aC5hdGFuMigtbVs2XSwgbVs4XSk7XG4gIH0gZWxzZSBpZiAobVs4XSA8IDApIHtcbiAgICAvLyBDYXNlIDI6IG1bOF0gPCAwIDw9PiBjQiA8IDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGFuZCBjRyAhPSAwKVxuICAgIC8vICAgICAgICAgICAgICAgICAgPD0+IGJldGEgaW4gWy1waTsgLXBpLzJbIFUgXStwaS8yOyArcGldIChhbmQgY0cgIT0gMClcblxuICAgIC8vIFNpbmNlIGNCIDwgMCBhbmQgY0IgaXMgaW4gbVsxXSBhbmQgbVs0XSwgdGhlIHBvaW50IGlzIGZsaXBwZWQgYnkgMTgwIGRlZ3JlZXMuXG4gICAgLy8gSGVuY2UsIHdlIGhhdmUgdG8gbXVsdGlwbHkgYm90aCBhcmd1bWVudHMgb2YgYXRhbjIgYnkgLTEgaW4gb3JkZXIgdG8gcmV2ZXJ0XG4gICAgLy8gdGhlIHBvaW50IGluIGl0cyBvcmlnaW5hbCBwb3NpdGlvbiAoPT4gYW5vdGhlciBmbGlwIGJ5IDE4MCBkZWdyZWVzKS5cbiAgICBhbHBoYSA9IE1hdGguYXRhbjIobVsxXSwgLW1bNF0pO1xuICAgIGJldGEgPSAtTWF0aC5hc2luKG1bN10pO1xuICAgIGJldGEgKz0gKGJldGEgPj0gMCkgPyAtTWF0aC5QSSA6IE1hdGguUEk7IC8vIGFzaW4gcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waS8yIGFuZCBwaS8yID0+IG1ha2Ugc3VyZSBiZXRhIGluIFstcGk7IC1waS8yWyBVIF0rcGkvMjsgK3BpXVxuICAgIGdhbW1hID0gTWF0aC5hdGFuMihtWzZdLCAtbVs4XSk7IC8vIHNhbWUgcmVtYXJrIGFzIGZvciBhbHBoYSwgbXVsdGlwbGljYXRpb24gYnkgLTFcbiAgfSBlbHNlIHtcbiAgICAvLyBDYXNlIDM6IG1bOF0gPSAwIDw9PiBjQiA9IDAgb3IgY0cgPSAwXG4gICAgaWYgKG1bNl0gPiAwKSB7XG4gICAgICAvLyBTdWJjYXNlIDE6IGNHID0gMCBhbmQgY0IgPiAwXG4gICAgICAvLyAgICAgICAgICAgIGNHID0gMCA8PT4gc0cgPSAtMSA8PT4gZ2FtbWEgPSAtcGkvMiA9PiBtWzZdID0gY0JcbiAgICAgIC8vICAgICAgICAgICAgSGVuY2UsIG1bNl0gPiAwIDw9PiBjQiA+IDAgPD0+IGJldGEgaW4gXS1waS8yOyArcGkvMltcbiAgICAgIGFscGhhID0gTWF0aC5hdGFuMigtbVsxXSwgbVs0XSk7XG4gICAgICBiZXRhID0gTWF0aC5hc2luKG1bN10pOyAvLyBhc2luIHJldHVybnMgYSBudW1iZXIgYmV0d2VlbiAtcGkvMiBhbmQgK3BpLzIgPT4gT0tcbiAgICAgIGdhbW1hID0gLU1hdGguUEkgLyAyO1xuICAgIH0gZWxzZSBpZiAobVs2XSA8IDApIHtcbiAgICAgIC8vIFN1YmNhc2UgMjogY0cgPSAwIGFuZCBjQiA8IDBcbiAgICAgIC8vICAgICAgICAgICAgY0cgPSAwIDw9PiBzRyA9IC0xIDw9PiBnYW1tYSA9IC1waS8yID0+IG1bNl0gPSBjQlxuICAgICAgLy8gICAgICAgICAgICBIZW5jZSwgbVs2XSA8IDAgPD0+IGNCIDwgMCA8PT4gYmV0YSBpbiBbLXBpOyAtcGkvMlsgVSBdK3BpLzI7ICtwaV1cbiAgICAgIGFscGhhID0gTWF0aC5hdGFuMihtWzFdLCAtbVs0XSk7IC8vIHNhbWUgcmVtYXJrIGFzIGZvciBhbHBoYSBpbiBhIGNhc2UgYWJvdmVcbiAgICAgIGJldGEgPSAtTWF0aC5hc2luKG1bN10pO1xuICAgICAgYmV0YSArPSAoYmV0YSA+PSAwKSA/IC1NYXRoLlBJIDogTWF0aC5QSTsgLy8gYXNpbiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpLzIgYW5kICtwaS8yID0+IG1ha2Ugc3VyZSBiZXRhIGluIFstcGk7IC1waS8yWyBVIF0rcGkvMjsgK3BpXVxuICAgICAgZ2FtbWEgPSAtTWF0aC5QSSAvIDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFN1YmNhc2UgMzogY0IgPSAwXG4gICAgICAvLyBJbiB0aGUgY2FzZSB3aGVyZSBjb3MoYmV0YSkgPSAwIChpLmUuIGJldGEgPSAtcGkvMiBvciBiZXRhID0gcGkvMiksXG4gICAgICAvLyB3ZSBoYXZlIHRoZSBnaW1iYWwgbG9jayBwcm9ibGVtOiBpbiB0aGF0IGNvbmZpZ3VyYXRpb24sIG9ubHkgdGhlIGFuZ2xlXG4gICAgICAvLyBhbHBoYSArIGdhbW1hIChpZiBiZXRhID0gK3BpLzIpIG9yIGFscGhhIC0gZ2FtbWEgKGlmIGJldGEgPSAtcGkvMilcbiAgICAgIC8vIGFyZSB1bmlxdWVseSBkZWZpbmVkOiBhbHBoYSBhbmQgZ2FtbWEgY2FuIHRha2UgYW4gaW5maW5pdHkgb2YgdmFsdWVzLlxuICAgICAgLy8gRm9yIGNvbnZlbmllbmNlLCBsZXQncyBzZXQgZ2FtbWEgPSAwIChhbmQgdGh1cyBzaW4oZ2FtbWEpID0gMCkuXG4gICAgICAvLyAoQXMgYSBjb25zZXF1ZW5jZSBvZiB0aGUgZ2ltYmFsIGxvY2sgcHJvYmxlbSwgdGhlcmUgaXMgYSBkaXNjb250aW51aXR5XG4gICAgICAvLyBpbiBhbHBoYSBhbmQgZ2FtbWEuKVxuICAgICAgYWxwaGEgPSBNYXRoLmF0YW4yKG1bM10sIG1bMF0pO1xuICAgICAgYmV0YSA9IChtWzddID4gMCkgPyBNYXRoLlBJIC8gMiA6IC1NYXRoLlBJIC8gMjtcbiAgICAgIGdhbW1hID0gMDtcbiAgICB9XG4gIH1cblxuICAvLyBhdGFuMiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpIGFuZCBwaSA9PiBtYWtlIHN1cmUgdGhhdCBhbHBoYSBpcyBpbiBbMCwgMipwaVsuXG4gIGFscGhhICs9IChhbHBoYSA8IDApID8gMiAqIE1hdGguUEkgOiAwO1xuXG4gIGV1bGVyQW5nbGVbMF0gPSAoYWxwaGFJc1ZhbGlkID8gcmFkVG9EZWcoYWxwaGEpIDogbnVsbCk7XG4gIGV1bGVyQW5nbGVbMV0gPSByYWRUb0RlZyhiZXRhKTtcbiAgZXVsZXJBbmdsZVsyXSA9IHJhZFRvRGVnKGdhbW1hKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhIEV1bGVyIGFuZ2xlIGBbYWxwaGEsIGJldGEsIGdhbW1hXWAgdG8gYSBFdWxlciBhbmdsZSB3aGVyZTpcbiAqIC0gYGFscGhhYCBpcyBpbiBbMDsgKzM2MFs7XG4gKiAtIGBiZXRhYCBpcyBpbiBbLTkwOyArOTBbO1xuICogLSBgZ2FtbWFgIGlzIGluIFstMTgwOyArMTgwWy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcltdfSBldWxlckFuZ2xlIC0gRXVsZXIgYW5nbGUgdG8gY29udmVydCwgcmVwcmVzZW50ZWQgYnkgYW4gYXJyYXkgb2YgbGVuZ3RoIDMgKGBbYWxwaGEsIGJldGEsIGdhbW1hXWApLlxuICovXG5mdW5jdGlvbiB1bmlmeUFsdChldWxlckFuZ2xlKSB7XG4gIC8vIENvbnZlbnRpb24gaGVyZTogVGFpdOKAk0JyeWFuIGFuZ2xlcyBaLVgnLVknJywgd2hlcmU6XG4gIC8vICAgYWxwaGEgaXMgaW4gWzA7ICszNjBbLFxuICAvLyAgIGJldGEgaXMgaW4gWy05MDsgKzkwWyxcbiAgLy8gICBnYW1tYSBpcyBpbiBbLTE4MDsgKzE4MFsuXG5cbiAgY29uc3QgYWxwaGFJc1ZhbGlkID0gKHR5cGVvZiBldWxlckFuZ2xlWzBdID09PSAnbnVtYmVyJyk7XG5cbiAgY29uc3QgX2FscGhhID0gKGFscGhhSXNWYWxpZCA/IGRlZ1RvUmFkKGV1bGVyQW5nbGVbMF0pIDogMCk7XG4gIGNvbnN0IF9iZXRhID0gZGVnVG9SYWQoZXVsZXJBbmdsZVsxXSk7XG4gIGNvbnN0IF9nYW1tYSA9IGRlZ1RvUmFkKGV1bGVyQW5nbGVbMl0pO1xuXG4gIGNvbnN0IGNBID0gTWF0aC5jb3MoX2FscGhhKTtcbiAgY29uc3QgY0IgPSBNYXRoLmNvcyhfYmV0YSk7XG4gIGNvbnN0IGNHID0gTWF0aC5jb3MoX2dhbW1hKTtcbiAgY29uc3Qgc0EgPSBNYXRoLnNpbihfYWxwaGEpO1xuICBjb25zdCBzQiA9IE1hdGguc2luKF9iZXRhKTtcbiAgY29uc3Qgc0cgPSBNYXRoLnNpbihfZ2FtbWEpO1xuXG4gIGxldCBhbHBoYSwgYmV0YSwgZ2FtbWE7XG5cbiAgbGV0IG0gPSBbXG4gICAgY0EgKiBjRyAtIHNBICogc0IgKiBzRyxcbiAgICAtY0IgKiBzQSxcbiAgICBjQSAqIHNHICsgY0cgKiBzQSAqIHNCLFxuICAgIGNHICogc0EgKyBjQSAqIHNCICogc0csXG4gICAgY0EgKiBjQixcbiAgICBzQSAqIHNHIC0gY0EgKiBjRyAqIHNCLFxuICAgIC1jQiAqIHNHLFxuICAgIHNCLFxuICAgIGNCICogY0dcbiAgXTtcbiAgbm9ybWFsaXplKG0pO1xuXG4gIGFscGhhID0gTWF0aC5hdGFuMigtbVsxXSwgbVs0XSk7XG4gIGFscGhhICs9IChhbHBoYSA8IDApID8gMiAqIE1hdGguUEkgOiAwOyAvLyBhdGFuMiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpIGFuZCArcGkgPT4gbWFrZSBzdXJlIGFscGhhIGlzIGluIFswLCAyKnBpWy5cbiAgYmV0YSA9IE1hdGguYXNpbihtWzddKTsgLy8gYXNpbiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpLzIgYW5kIHBpLzIgPT4gT0tcbiAgZ2FtbWEgPSBNYXRoLmF0YW4yKC1tWzZdLCBtWzhdKTsgLy8gYXRhbjIgcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waSBhbmQgK3BpID0+IE9LXG5cbiAgZXVsZXJBbmdsZVswXSA9IChhbHBoYUlzVmFsaWQgPyByYWRUb0RlZyhhbHBoYSkgOiBudWxsKTtcbiAgZXVsZXJBbmdsZVsxXSA9IHJhZFRvRGVnKGJldGEpO1xuICBldWxlckFuZ2xlWzJdID0gcmFkVG9EZWcoZ2FtbWEpO1xufVxuXG4vKipcbiAqIGBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZWAgc2luZ2xldG9uLlxuICogVGhlIGBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZWAgc2luZ2xldG9uIHByb3ZpZGVzIHRoZSByYXcgdmFsdWVzXG4gKiBvZiB0aGUgb3JpZW50YXRpb24gcHJvdmlkZWQgYnkgdGhlIGBEZXZpY2VNb3Rpb25gIGV2ZW50LlxuICogSXQgYWxzbyBpbnN0YW50aWF0ZSB0aGUgYE9yaWVudGF0aW9uYCBzdWJtb2R1bGUgdGhhdCB1bmlmaWVzIHRob3NlXG4gKiB2YWx1ZXMgYWNyb3NzIHBsYXRmb3JtcyBieSBtYWtpbmcgdGhlbSBjb21wbGlhbnQgd2l0aCB7QGxpbmtcbiAqIGh0dHA6Ly93d3cudzMub3JnL1RSL29yaWVudGF0aW9uLWV2ZW50L3x0aGUgVzNDIHN0YW5kYXJkfSAoKmkuZS4qXG4gKiB0aGUgYGFscGhhYCBhbmdsZSBiZXR3ZWVuIGAwYCBhbmQgYDM2MGAgZGVncmVlcywgdGhlIGBiZXRhYCBhbmdsZVxuICogYmV0d2VlbiBgLTE4MGAgYW5kIGAxODBgIGRlZ3JlZXMsIGFuZCBgZ2FtbWFgIGJldHdlZW4gYC05MGAgYW5kXG4gKiBgOTBgIGRlZ3JlZXMpLCBhcyB3ZWxsIGFzIHRoZSBgT3JpZW50YXRpb25BbHRgIHN1Ym1vZHVsZXMgKHdpdGhcbiAqIHRoZSBgYWxwaGFgIGFuZ2xlIGJldHdlZW4gYDBgIGFuZCBgMzYwYCBkZWdyZWVzLCB0aGUgYGJldGFgIGFuZ2xlXG4gKiBiZXR3ZWVuIGAtOTBgIGFuZCBgOTBgIGRlZ3JlZXMsIGFuZCBgZ2FtbWFgIGJldHdlZW4gYC0xODBgIGFuZFxuICogYDE4MGAgZGVncmVlcykuXG4gKiBXaGVuIHRoZSBgb3JpZW50YXRpb25gIHJhdyB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSB0aGUgc2Vuc29ycyxcbiAqIHRoaXMgbW9kdWxlcyB0cmllcyB0byByZWNhbGN1bGF0ZSBgYmV0YWAgYW5kIGBnYW1tYWAgZnJvbSB0aGVcbiAqIGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCBtb2R1bGUsIGlmIGF2YWlsYWJsZSAoaW4gdGhhdCBjYXNlLFxuICogdGhlIGBhbHBoYWAgYW5nbGUgaXMgaW1wb3NzaWJsZSB0byByZXRyaWV2ZSBzaW5jZSB0aGUgY29tcGFzcyBpc1xuICogbm90IGF2YWlsYWJsZSkuXG4gKlxuICogQGNsYXNzIERldmljZU1vdGlvbk1vZHVsZVxuICogQGV4dGVuZHMgSW5wdXRNb2R1bGVcbiAqL1xuY2xhc3MgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGUgZXh0ZW5kcyBJbnB1dE1vZHVsZSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGBEZXZpY2VPcmllbnRhdGlvbmAgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCdkZXZpY2VvcmllbnRhdGlvbicpO1xuXG4gICAgLyoqXG4gICAgICogUmF3IHZhbHVlcyBjb21pbmcgZnJvbSB0aGUgYGRldmljZW9yaWVudGF0aW9uYCBldmVudCBzZW50IGJ5IHRoaXMgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgW251bGwsIG51bGwsIG51bGxdXG4gICAgICovXG4gICAgdGhpcy5ldmVudCA9IFtudWxsLCBudWxsLCBudWxsXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgT3JpZW50YXRpb25gIG1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyB1bmlmaWVkIHZhbHVlcyBvZiB0aGUgb3JpZW50YXRpb24gY29tcGxpYW50IHdpdGgge0BsaW5rXG4gICAgICogaHR0cDovL3d3dy53My5vcmcvVFIvb3JpZW50YXRpb24tZXZlbnQvfHRoZSBXM0Mgc3RhbmRhcmR9XG4gICAgICogKGBhbHBoYWAgaW4gYFswLCAzNjBdYCwgYmV0YSBpbiBgWy0xODAsICsxODBdYCwgYGdhbW1hYCBpbiBgWy05MCwgKzkwXWApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAnb3JpZW50YXRpb24nKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgT3JpZW50YXRpb25BbHRgIG1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyBhbHRlcm5hdGl2ZSB2YWx1ZXMgb2YgdGhlIG9yaWVudGF0aW9uXG4gICAgICogKGBhbHBoYWAgaW4gYFswLCAzNjBdYCwgYmV0YSBpbiBgWy05MCwgKzkwXWAsIGBnYW1tYWAgaW4gYFstMTgwLCArMTgwXWApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5vcmllbnRhdGlvbkFsdCA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAnb3JpZW50YXRpb25BbHQnKTtcblxuICAgIC8qKlxuICAgICAqIFJlcXVpcmVkIHN1Ym1vZHVsZXMgLyBldmVudHMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtib29sfSBvcmllbnRhdGlvbiAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBgb3JpZW50YXRpb25gIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gb3JpZW50YXRpb25BbHQgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYG9yaWVudGF0aW9uQWx0YCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICovXG4gICAgdGhpcy5yZXF1aXJlZCA9IHtcbiAgICAgIG9yaWVudGF0aW9uOiBmYWxzZSxcbiAgICAgIG9yaWVudGF0aW9uQWx0OiBmYWxzZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBOdW1iZXIgb2YgbGlzdGVuZXJzIHN1YnNjcmliZWQgdG8gdGhlIGBEZXZpY2VPcmllbnRhdGlvbmAgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX251bUxpc3RlbmVycyA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlIGZ1bmN0aW9uIG9mIHRoZSBtb2R1bGUncyBwcm9taXNlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqIEBzZWUgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGUjaW5pdFxuICAgICAqL1xuICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEdyYXZpdHkgdmVjdG9yIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5fZXN0aW1hdGVkR3Jhdml0eSA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCBiaW5kaW5nIG9mIHRoZSBzZW5zb3IgY2hlY2suXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgKi9cbiAgICB0aGlzLl9kZXZpY2VvcmllbnRhdGlvbkNoZWNrID0gdGhpcy5fZGV2aWNlb3JpZW50YXRpb25DaGVjay5iaW5kKHRoaXMpO1xuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIGJpbmRpbmcgb2YgdGhlIGAnZGV2aWNlb3JpZW50YXRpb24nYCBldmVudCBjYWxsYmFjay5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgICAqL1xuICAgIHRoaXMuX2RldmljZW9yaWVudGF0aW9uTGlzdGVuZXIgPSB0aGlzLl9kZXZpY2VvcmllbnRhdGlvbkxpc3RlbmVyLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU2Vuc29yIGNoZWNrIG9uIGluaXRpYWxpemF0aW9uIG9mIHRoZSBtb2R1bGUuXG4gICAqIFRoaXMgbWV0aG9kOlxuICAgKiAtIGNoZWNrcyB3aGV0aGVyIHRoZSBgb3JpZW50YXRpb25gIHZhbHVlcyBhcmUgdmFsaWQgb3Igbm90O1xuICAgKiAtIChpbiB0aGUgY2FzZSB3aGVyZSBvcmllbnRhdGlvbiByYXcgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQpXG4gICAqICAgdHJpZXMgdG8gY2FsY3VsYXRlIHRoZSBvcmllbnRhdGlvbiBmcm9tIHRoZVxuICAgKiAgIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIEZpcnN0IGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgY2F1Z2h0LCBvbiB3aGljaCB0aGUgY2hlY2sgaXMgZG9uZS5cbiAgICovXG4gIF9kZXZpY2VvcmllbnRhdGlvbkNoZWNrKGUpIHtcbiAgICB0aGlzLmlzUHJvdmlkZWQgPSB0cnVlO1xuXG4gICAgLy8gU2Vuc29yIGF2YWlsYWJpbGl0eSBmb3IgdGhlIG9yaWVudGF0aW9uIGFuZCBhbHRlcm5hdGl2ZSBvcmllbnRhdGlvblxuICAgIGNvbnN0IHJhd1ZhbHVlc1Byb3ZpZGVkID0gKCh0eXBlb2YgZS5hbHBoYSA9PT0gJ251bWJlcicpICYmICh0eXBlb2YgZS5iZXRhID09PSAnbnVtYmVyJykgJiYgKHR5cGVvZiBlLmdhbW1hID09PSAnbnVtYmVyJykpO1xuICAgIHRoaXMub3JpZW50YXRpb24uaXNQcm92aWRlZCA9IHJhd1ZhbHVlc1Byb3ZpZGVkO1xuICAgIHRoaXMub3JpZW50YXRpb25BbHQuaXNQcm92aWRlZCA9IHJhd1ZhbHVlc1Byb3ZpZGVkO1xuXG4gICAgLy8gVE9ETyg/KTogZ2V0IHBzZXVkby1wZXJpb2RcblxuICAgIC8vIFdlIG9ubHkgbmVlZCB0byBsaXN0ZW4gdG8gb25lIGV2ZW50ICg9PiByZW1vdmUgdGhlIGxpc3RlbmVyKVxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIHRoaXMuX2RldmljZW9yaWVudGF0aW9uQ2hlY2ssIGZhbHNlKTtcblxuICAgIC8vIElmIG9yaWVudGF0aW9uIG9yIGFsdGVybmF0aXZlIG9yaWVudGF0aW9uIGFyZSBub3QgcHJvdmlkZWQgYnkgcmF3IHNlbnNvcnMgYnV0IHJlcXVpcmVkLFxuICAgIC8vIHRyeSB0byBjYWxjdWxhdGUgdGhlbSB3aXRoIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlc1xuICAgIGlmICgodGhpcy5yZXF1aXJlZC5vcmllbnRhdGlvbiAmJiAhdGhpcy5vcmllbnRhdGlvbi5pc1Byb3ZpZGVkKSB8fCAodGhpcy5yZXF1aXJlZC5vcmllbnRhdGlvbkFsdCAmJiAhdGhpcy5vcmllbnRhdGlvbkFsdC5pc1Byb3ZpZGVkKSlcbiAgICAgIHRoaXMuX3RyeUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlGYWxsYmFjaygpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIGAnZGV2aWNlb3JpZW50YXRpb24nYCBldmVudCBjYWxsYmFjay5cbiAgICogVGhpcyBtZXRob2QgZW1pdHMgYW4gZXZlbnQgd2l0aCB0aGUgcmF3IGAnZGV2aWNlb3JpZW50YXRpb24nYCB2YWx1ZXMsXG4gICAqIGFuZCBlbWl0cyBldmVudHMgd2l0aCB0aGUgdW5pZmllZCBgb3JpZW50YXRpb25gIGFuZCAvIG9yIHRoZVxuICAgKiBgb3JpZW50YXRpb25BbHRgIHZhbHVlcyBpZiB0aGV5IGFyZSByZXF1aXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHtEZXZpY2VPcmllbnRhdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2VvcmllbnRhdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICovXG4gIF9kZXZpY2VvcmllbnRhdGlvbkxpc3RlbmVyKGUpIHtcbiAgICAvLyAnZGV2aWNlb3JpZW50YXRpb24nIGV2ZW50IChyYXcgdmFsdWVzKVxuICAgIGxldCBvdXRFdmVudCA9IHRoaXMuZXZlbnQ7XG5cbiAgICBvdXRFdmVudFswXSA9IGUuYWxwaGE7XG4gICAgb3V0RXZlbnRbMV0gPSBlLmJldGE7XG4gICAgb3V0RXZlbnRbMl0gPSBlLmdhbW1hO1xuXG4gICAgdGhpcy5lbWl0KG91dEV2ZW50KTtcblxuICAgIC8vICdvcmllbnRhdGlvbicgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgIGlmICh0aGlzLnJlcXVpcmVkLm9yaWVudGF0aW9uICYmIHRoaXMub3JpZW50YXRpb24uaXNQcm92aWRlZCkge1xuICAgICAgLy8gT24gaU9TLCB0aGUgYGFscGhhYCB2YWx1ZSBpcyBpbml0aWFsaXplZCBhdCBgMGAgb24gdGhlIGZpcnN0IGBkZXZpY2VvcmllbnRhdGlvbmAgZXZlbnRcbiAgICAgIC8vIHNvIHdlIGtlZXAgdGhhdCByZWZlcmVuY2UgaW4gbWVtb3J5IHRvIGNhbGN1bGF0ZSB0aGUgTm9ydGggbGF0ZXIgb25cbiAgICAgIGlmICghdGhpcy5vcmllbnRhdGlvbi5fd2Via2l0Q29tcGFzc0hlYWRpbmdSZWZlcmVuY2UgJiYgZS53ZWJraXRDb21wYXNzSGVhZGluZyAmJiBwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdpT1MnKVxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uLl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSA9IGUud2Via2l0Q29tcGFzc0hlYWRpbmc7XG5cbiAgICAgIGxldCBvdXRFdmVudCA9IHRoaXMub3JpZW50YXRpb24uZXZlbnQ7XG5cbiAgICAgIG91dEV2ZW50WzBdID0gZS5hbHBoYTtcbiAgICAgIG91dEV2ZW50WzFdID0gZS5iZXRhO1xuICAgICAgb3V0RXZlbnRbMl0gPSBlLmdhbW1hO1xuXG4gICAgICAvLyBPbiBpT1MsIHJlcGxhY2UgdGhlIGBhbHBoYWAgdmFsdWUgYnkgdGhlIE5vcnRoIHZhbHVlIGFuZCB1bmlmeSB0aGUgYW5nbGVzXG4gICAgICAvLyAodGhlIGRlZmF1bHQgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFuZ2xlcyBvbiBpT1MgaXMgbm90IGNvbXBsaWFudCB3aXRoIHRoZSBXM0Mgc3BlY2lmaWNhdGlvbilcbiAgICAgIGlmICh0aGlzLm9yaWVudGF0aW9uLl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSAmJiBwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdpT1MnKSB7XG4gICAgICAgIG91dEV2ZW50WzBdICs9IDM2MCAtIHRoaXMub3JpZW50YXRpb24uX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlO1xuICAgICAgICB1bmlmeShvdXRFdmVudCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3JpZW50YXRpb24uZW1pdChvdXRFdmVudCk7XG4gICAgfVxuXG4gICAgLy8gJ29yaWVudGF0aW9uQWx0JyBldmVudFxuICAgIGlmICh0aGlzLnJlcXVpcmVkLm9yaWVudGF0aW9uQWx0ICYmIHRoaXMub3JpZW50YXRpb25BbHQuaXNQcm92aWRlZCkge1xuICAgICAgLy8gT24gaU9TLCB0aGUgYGFscGhhYCB2YWx1ZSBpcyBpbml0aWFsaXplZCBhdCBgMGAgb24gdGhlIGZpcnN0IGBkZXZpY2VvcmllbnRhdGlvbmAgZXZlbnRcbiAgICAgIC8vIHNvIHdlIGtlZXAgdGhhdCByZWZlcmVuY2UgaW4gbWVtb3J5IHRvIGNhbGN1bGF0ZSB0aGUgTm9ydGggbGF0ZXIgb25cbiAgICAgIGlmICghdGhpcy5vcmllbnRhdGlvbkFsdC5fd2Via2l0Q29tcGFzc0hlYWRpbmdSZWZlcmVuY2UgJiYgZS53ZWJraXRDb21wYXNzSGVhZGluZyAmJiBwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdpT1MnKVxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uQWx0Ll93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSA9IGUud2Via2l0Q29tcGFzc0hlYWRpbmc7XG5cbiAgICAgIGxldCBvdXRFdmVudCA9IHRoaXMub3JpZW50YXRpb25BbHQuZXZlbnQ7XG5cbiAgICAgIG91dEV2ZW50WzBdID0gZS5hbHBoYTtcbiAgICAgIG91dEV2ZW50WzFdID0gZS5iZXRhO1xuICAgICAgb3V0RXZlbnRbMl0gPSBlLmdhbW1hO1xuXG4gICAgICAvLyBPbiBpT1MsIHJlcGxhY2UgdGhlIGBhbHBoYWAgdmFsdWUgYnkgdGhlIE5vcnRoIHZhbHVlIGJ1dCBkbyBub3QgY29udmVydCB0aGUgYW5nbGVzXG4gICAgICAvLyAodGhlIGRlZmF1bHQgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFuZ2xlcyBvbiBpT1MgaXMgY29tcGxpYW50IHdpdGggdGhlIGFsdGVybmF0aXZlIHJlcHJlc2VudGF0aW9uKVxuICAgICAgaWYgKHRoaXMub3JpZW50YXRpb25BbHQuX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlICYmIHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycpe1xuICAgICAgICBvdXRFdmVudFswXSAtPSB0aGlzLm9yaWVudGF0aW9uQWx0Ll93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZTtcbiAgICAgICAgb3V0RXZlbnRbMF0gKz0gKG91dEV2ZW50WzBdIDwgMCkgPyAzNjAgOiAwOyAvLyBtYWtlIHN1cmUgYGFscGhhYCBpcyBpbiBbMCwgKzM2MFtcbiAgICAgIH1cblxuICAgICAgLy8gT24gQW5kcm9pZCwgdHJhbnNmb3JtIHRoZSBhbmdsZXMgdG8gdGhlIGFsdGVybmF0aXZlIHJlcHJlc2VudGF0aW9uXG4gICAgICAvLyAodGhlIGRlZmF1bHQgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFuZ2xlcyBvbiBBbmRyb2lkIGlzIGNvbXBsaWFudCB3aXRoIHRoZSBXM0Mgc3BlY2lmaWNhdGlvbilcbiAgICAgIGlmIChwbGF0Zm9ybS5vcy5mYW1pbHkgPT09ICdBbmRyb2lkJylcbiAgICAgICAgdW5pZnlBbHQob3V0RXZlbnQpO1xuXG4gICAgICB0aGlzLm9yaWVudGF0aW9uQWx0LmVtaXQob3V0RXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciBgYmV0YWAgYW5kIGBnYW1tYWAgY2FuIGJlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHZhbHVlcyBvciBub3QuXG4gICAqL1xuICBfdHJ5QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eUZhbGxiYWNrKCkge1xuICAgIE1vdGlvbklucHV0LnJlcXVpcmVNb2R1bGUoJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknKVxuICAgICAgLnRoZW4oKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpID0+IHtcbiAgICAgICAgaWYgKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiV0FSTklORyAobW90aW9uLWlucHV0KTogVGhlICdkZXZpY2VvcmllbnRhdGlvbicgZXZlbnQgZG9lcyBub3QgZXhpc3Qgb3IgZG9lcyBub3QgcHJvdmlkZSB2YWx1ZXMgaW4geW91ciBicm93c2VyLCBzbyB0aGUgb3JpZW50YXRpb24gb2YgdGhlIGRldmljZSBpcyBlc3RpbWF0ZWQgZnJvbSBEZXZpY2VNb3Rpb24ncyAnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScgZXZlbnQuIFNpbmNlIHRoZSBjb21wYXNzIGlzIG5vdCBhdmFpbGFibGUsIG9ubHkgdGhlIGBiZXRhYCBhbmQgYGdhbW1hYCBhbmdsZXMgYXJlIHByb3ZpZGVkIChgYWxwaGFgIGlzIG51bGwpLlwiKTtcblxuICAgICAgICAgIGlmICh0aGlzLnJlcXVpcmVkLm9yaWVudGF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uLmlzQ2FsY3VsYXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uLnBlcmlvZCA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkucGVyaW9kO1xuXG4gICAgICAgICAgICBNb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcignYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScsIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZUJldGFBbmRHYW1tYUZyb21BY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMucmVxdWlyZWQub3JpZW50YXRpb25BbHQpIHtcbiAgICAgICAgICAgIHRoaXMub3JpZW50YXRpb25BbHQuaXNDYWxjdWxhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMub3JpZW50YXRpb25BbHQucGVyaW9kID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5wZXJpb2Q7XG5cbiAgICAgICAgICAgIE1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JywgKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlQmV0YUFuZEdhbW1hRnJvbUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSh0aGlzKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgYW5kIGVtaXRzIGBiZXRhYCBhbmQgYGdhbW1hYCB2YWx1ZXMgYXMgYSBmYWxsYmFjayBvZiB0aGUgYG9yaWVudGF0aW9uYCBhbmQgLyBvciBgb3JpZW50YXRpb25BbHRgIGV2ZW50cywgZnJvbSB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcltdfSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IC0gTGF0ZXN0IGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IHJhdyB2YWx1ZXMuXG4gICAqIEBwYXJhbSB7Ym9vbH0gW2FsdD1mYWxzZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB3ZSBuZWVkIHRoZSBhbHRlcm5hdGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFuZ2xlcyBvciBub3QuXG4gICAqL1xuICBfY2FsY3VsYXRlQmV0YUFuZEdhbW1hRnJvbUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSwgYWx0ID0gZmFsc2UpIHtcbiAgICBjb25zdCBrID0gMC44O1xuXG4gICAgLy8gTG93IHBhc3MgZmlsdGVyIHRvIGVzdGltYXRlIHRoZSBncmF2aXR5XG4gICAgdGhpcy5fZXN0aW1hdGVkR3Jhdml0eVswXSA9IGsgKiB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzBdICsgKDEgLSBrKSAqIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF07XG4gICAgdGhpcy5fZXN0aW1hdGVkR3Jhdml0eVsxXSA9IGsgKiB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzFdICsgKDEgLSBrKSAqIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV07XG4gICAgdGhpcy5fZXN0aW1hdGVkR3Jhdml0eVsyXSA9IGsgKiB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzJdICsgKDEgLSBrKSAqIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl07XG5cbiAgICBsZXQgX2dYID0gdGhpcy5fZXN0aW1hdGVkR3Jhdml0eVswXTtcbiAgICBsZXQgX2dZID0gdGhpcy5fZXN0aW1hdGVkR3Jhdml0eVsxXTtcbiAgICBsZXQgX2daID0gdGhpcy5fZXN0aW1hdGVkR3Jhdml0eVsyXTtcblxuICAgIGNvbnN0IG5vcm0gPSBNYXRoLnNxcnQoX2dYICogX2dYICsgX2dZICogX2dZICsgX2daICogX2daKTtcblxuICAgIF9nWCAvPSBub3JtO1xuICAgIF9nWSAvPSBub3JtO1xuICAgIF9nWiAvPSBub3JtO1xuXG4gICAgLy8gQWRvcHRpbmcgdGhlIGZvbGxvd2luZyBjb252ZW50aW9uczpcbiAgICAvLyAtIGVhY2ggbWF0cml4IG9wZXJhdGVzIGJ5IHByZS1tdWx0aXBseWluZyBjb2x1bW4gdmVjdG9ycyxcbiAgICAvLyAtIGVhY2ggbWF0cml4IHJlcHJlc2VudHMgYW4gYWN0aXZlIHJvdGF0aW9uLFxuICAgIC8vIC0gZWFjaCBtYXRyaXggcmVwcmVzZW50cyB0aGUgY29tcG9zaXRpb24gb2YgaW50cmluc2ljIHJvdGF0aW9ucyxcbiAgICAvLyB0aGUgcm90YXRpb24gbWF0cml4IHJlcHJlc2VudGluZyB0aGUgY29tcG9zaXRpb24gb2YgYSByb3RhdGlvblxuICAgIC8vIGFib3V0IHRoZSB4LWF4aXMgYnkgYW4gYW5nbGUgYmV0YSBhbmQgYSByb3RhdGlvbiBhYm91dCB0aGUgeS1heGlzXG4gICAgLy8gYnkgYW4gYW5nbGUgZ2FtbWEgaXM6XG4gICAgLy9cbiAgICAvLyBbIGNvcyhnYW1tYSkgICAgICAgICAgICAgICAsICAwICAgICAgICAgICwgIHNpbihnYW1tYSkgICAgICAgICAgICAgICxcbiAgICAvLyAgIHNpbihiZXRhKSAqIHNpbihnYW1tYSkgICAsICBjb3MoYmV0YSkgICwgIC1jb3MoZ2FtbWEpICogc2luKGJldGEpICxcbiAgICAvLyAgIC1jb3MoYmV0YSkgKiBzaW4oZ2FtbWEpICAsICBzaW4oYmV0YSkgICwgIGNvcyhiZXRhKSAqIGNvcyhnYW1tYSkgIF0uXG4gICAgLy9cbiAgICAvLyBIZW5jZSwgdGhlIHByb2plY3Rpb24gb2YgdGhlIG5vcm1hbGl6ZWQgZ3Jhdml0eSBnID0gWzAsIDAsIDFdXG4gICAgLy8gaW4gdGhlIGRldmljZSdzIHJlZmVyZW5jZSBmcmFtZSBjb3JyZXNwb25kcyB0bzpcbiAgICAvL1xuICAgIC8vIGdYID0gLWNvcyhiZXRhKSAqIHNpbihnYW1tYSksXG4gICAgLy8gZ1kgPSBzaW4oYmV0YSksXG4gICAgLy8gZ1ogPSBjb3MoYmV0YSkgKiBjb3MoZ2FtbWEpLFxuICAgIC8vXG4gICAgLy8gc28gYmV0YSA9IGFzaW4oZ1kpIGFuZCBnYW1tYSA9IGF0YW4yKC1nWCwgZ1opLlxuXG4gICAgLy8gQmV0YSAmIGdhbW1hIGVxdWF0aW9ucyAod2UgYXBwcm94aW1hdGUgW2dYLCBnWSwgZ1pdIGJ5IFtfZ1gsIF9nWSwgX2daXSlcbiAgICBsZXQgYmV0YSA9IHJhZFRvRGVnKE1hdGguYXNpbihfZ1kpKTsgLy8gYmV0YSBpcyBpbiBbLXBpLzI7IHBpLzJbXG4gICAgbGV0IGdhbW1hID0gcmFkVG9EZWcoTWF0aC5hdGFuMigtX2dYLCBfZ1opKTsgLy8gZ2FtbWEgaXMgaW4gWy1waTsgcGlbXG5cbiAgICBpZiAoYWx0KSB7XG4gICAgICAvLyBJbiB0aGF0IGNhc2UsIHRoZXJlIGlzIG5vdGhpbmcgdG8gZG8gc2luY2UgdGhlIGNhbGN1bGF0aW9ucyBhYm92ZSBnYXZlIHRoZSBhbmdsZSBpbiB0aGUgcmlnaHQgcmFuZ2VzXG4gICAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLm9yaWVudGF0aW9uQWx0LmV2ZW50O1xuICAgICAgb3V0RXZlbnRbMF0gPSBudWxsO1xuICAgICAgb3V0RXZlbnRbMV0gPSBiZXRhO1xuICAgICAgb3V0RXZlbnRbMl0gPSBnYW1tYTtcblxuICAgICAgdGhpcy5vcmllbnRhdGlvbkFsdC5lbWl0KG91dEV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSGVyZSB3ZSBoYXZlIHRvIHVuaWZ5IHRoZSBhbmdsZXMgdG8gZ2V0IHRoZSByYW5nZXMgY29tcGxpYW50IHdpdGggdGhlIFczQyBzcGVjaWZpY2F0aW9uXG4gICAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLm9yaWVudGF0aW9uLmV2ZW50O1xuICAgICAgb3V0RXZlbnRbMF0gPSBudWxsO1xuICAgICAgb3V0RXZlbnRbMV0gPSBiZXRhO1xuICAgICAgb3V0RXZlbnRbMl0gPSBnYW1tYTtcbiAgICAgIHVuaWZ5KG91dEV2ZW50KTtcblxuICAgICAgdGhpcy5vcmllbnRhdGlvbi5lbWl0KG91dEV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5jcmVhc2VzIHRoZSBudW1iZXIgb2YgbGlzdGVuZXJzIHRvIHRoaXMgbW9kdWxlIChlaXRoZXIgYmVjYXVzZSBzb21lb25lIGxpc3RlbnNcbiAgICogdG8gdGhpcyBtb2R1bGUsIG9yIG9uZSBvZiB0aGUgdHdvIGBET01FdmVudFN1Ym1vZHVsZXNgIChgT3JpZW50YXRpb25gLFxuICAgKiBgT3JpZW50YXRpb25BbHRgKS5cbiAgICogV2hlbiB0aGUgbnVtYmVyIG9mIGxpc3RlbmVycyByZWFjaGVzIGAxYCwgYWRkcyBhIGAnZGV2aWNlb3JpZW50YXRpb24nYFxuICAgKiBldmVudCBsaXN0ZW5lci5cbiAgICpcbiAgICogQHNlZSBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZSNhZGRMaXN0ZW5lclxuICAgKiBAc2VlIERPTUV2ZW50U3VibW9kdWxlI3N0YXJ0XG4gICAqL1xuICBfYWRkTGlzdGVuZXIoKSB7XG4gICAgdGhpcy5fbnVtTGlzdGVuZXJzKys7XG5cbiAgICBpZiAodGhpcy5fbnVtTGlzdGVuZXJzID09PSAxKVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9uJywgdGhpcy5fZGV2aWNlb3JpZW50YXRpb25MaXN0ZW5lciwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlY3JlYXNlcyB0aGUgbnVtYmVyIG9mIGxpc3RlbmVycyB0byB0aGlzIG1vZHVsZSAoZWl0aGVyIGJlY2F1c2Ugc29tZW9uZSBzdG9wc1xuICAgKiBsaXN0ZW5pbmcgdG8gdGhpcyBtb2R1bGUsIG9yIG9uZSBvZiB0aGUgdGhyZWUgYERPTUV2ZW50U3VibW9kdWxlc2BcbiAgICogKGBPcmllbnRhdGlvbmAsIGBPcmllbnRhdGlvbkFsdGApLlxuICAgKiBXaGVuIHRoZSBudW1iZXIgb2YgbGlzdGVuZXJzIHJlYWNoZXMgYDBgLCByZW1vdmVzIHRoZSBgJ2RldmljZW9yaWVudGF0aW9uJ2BcbiAgICogZXZlbnQgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBzZWUgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGUjcmVtb3ZlTGlzdGVuZXJcbiAgICogQHNlZSBET01FdmVudFN1Ym1vZHVsZSNzdG9wXG4gICAqL1xuICBfcmVtb3ZlTGlzdGVuZXIoKSB7XG4gICAgdGhpcy5fbnVtTGlzdGVuZXJzLS07XG5cbiAgICBpZiAodGhpcy5fbnVtTGlzdGVuZXJzID09PSAwKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCB0aGlzLl9kZXZpY2VvcmllbnRhdGlvbkxpc3RlbmVyLCBmYWxzZSk7XG4gICAgICB0aGlzLm9yaWVudGF0aW9uLl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSA9IG51bGw7IC8vIGRvbid0IGZvcmdldCB0byByZXNldCB0aGUgY29tcGFzcyByZWZlcmVuY2Ugc2luY2UgdGhpcyByZWZlcmVuY2UgaXMgc2V0IGVhY2ggdGltZSB3ZSBzdGFydCBsaXN0ZW5pbmcgdG8gYSBgJ2RldmljZW9yaWVudGF0aW9uJ2AgZXZlbnRcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgb2YgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIHN1cGVyLmluaXQoKHJlc29sdmUpID0+IHtcbiAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlID0gcmVzb2x2ZTtcblxuICAgICAgaWYgKHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50KVxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCB0aGlzLl9kZXZpY2VvcmllbnRhdGlvbkNoZWNrLCBmYWxzZSk7XG4gICAgICBlbHNlIGlmICh0aGlzLnJlcXVpcmVkLm9yaWVudGF0aW9uKVxuICAgICAgICB0aGlzLl90cnlBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RmFsbGJhY2soKTtcbiAgICAgIGVsc2VcbiAgICAgICAgcmVzb2x2ZSh0aGlzKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdG8gdGhpcyBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIC0gTGlzdGVuZXIgdG8gYWRkLlxuICAgKi9cbiAgYWRkTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICBzdXBlci5hZGRMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgdGhpcy5fYWRkTGlzdGVuZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSB0aGlzIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgLSBMaXN0ZW5lciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIHN1cGVyLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZSgpO1xuIl19