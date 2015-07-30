/**
 * @fileoverview `DeviceOrientation` module
 * @author <a href='mailto:sebastien@robaszkiewicz.com'>Sébastien Robaszkiewicz</a>, <a href='mailto:Norbert.Schnell@ircam.fr'>Norbert Schnell</a>
 */

'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var DOMEventSubmodule = require('./DOMEventSubmodule');
var InputModule = require('./InputModule');
var MotionInput = require('./MotionInput');
var platform = require('platform');

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

  var alpha = undefined,
      beta = undefined,
      gamma = undefined;

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

  var alpha = undefined,
      beta = undefined,
      gamma = undefined;

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

var DeviceOrientationModule = (function (_InputModule) {
  _inherits(DeviceOrientationModule, _InputModule);

  /**
   * Creates the `DeviceOrientation` module instance.
   *
   * @constructor
   */

  function DeviceOrientationModule() {
    _classCallCheck(this, DeviceOrientationModule);

    _get(Object.getPrototypeOf(DeviceOrientationModule.prototype), 'constructor', this).call(this, 'deviceorientation');

    /**
     * Raw values coming from the `deviceorientation` event sent by this module.
     *
     * @this DeviceOrientationModule
     * @type {number[]}
     * @default [null, null, null]
     */
    this.event = [null, null, null];

    /**
     * The `Orientation` module.
     * Provides unified values of the orientation compliant with {@link
     * http://www.w3.org/TR/orientation-event/|the W3C standard}
     * (`alpha` in `[0, 360]`, beta in `[-180, +180]`, `gamma` in `[-90, +90]`).
     *
     * @this DeviceOrientationModule
     * @type {DOMEventSubmodule}
     */
    this.orientation = new DOMEventSubmodule(this, 'orientation');

    /**
     * The `OrientationAlt` module.
     * Provides alternative values of the orientation
     * (`alpha` in `[0, 360]`, beta in `[-90, +90]`, `gamma` in `[-180, +180]`).
     *
     * @this DeviceOrientationModule
     * @type {DOMEventSubmodule}
     */
    this.orientationAlt = new DOMEventSubmodule(this, 'orientationAlt');

    /**
     * Required submodules / events.
     *
     * @this DeviceOrientationModule
     * @type {object}
     * @property {bool} orientation - Indicates whether the `orientation` unified values are required or not (defaults to `false`).
     * @property {bool} orientationAlt - Indicates whether the `orientationAlt` values are required or not (defaults to `false`).
     */
    this.required = {
      orientation: false,
      orientationAlt: false
    };

    /**
     * Number of listeners subscribed to the `DeviceOrientation` module.
     *
     * @this DeviceOrientationModule
     * @type {number}
     */
    this._numListeners = 0;

    /**
     * Resolve function of the module's promise.
     *
     * @this DeviceOrientationModule
     * @type {function}
     * @default null
     * @see DeviceOrientationModule#init
     */
    this._promiseResolve = null;

    /**
     * Gravity vector calculated from the `accelerationIncludingGravity` unified values.
     *
     * @this DeviceOrientationModule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    this._estimatedGravity = [0, 0, 0];

    /**
     * Method binding of the sensor check.
     *
     * @this DeviceOrientationModule
     * @type {function}
     */
    this._deviceorientationCheck = this._deviceorientationCheck.bind(this);

    /**
     * Method binding of the `'deviceorientation'` event callback.
     *
     * @this DeviceOrientationModule
     * @type {function}
     */
    this._deviceorientationListener = this._deviceorientationListener.bind(this);
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
        if (!this.orientation._webkitCompassHeadingReference && e.webkitCompassHeading && platform.os.family === 'iOS') this.orientation._webkitCompassHeadingReference = e.webkitCompassHeading;

        var _outEvent = this.orientation.event;

        _outEvent[0] = e.alpha;
        _outEvent[1] = e.beta;
        _outEvent[2] = e.gamma;

        // On iOS, replace the `alpha` value by the North value and unify the angles
        // (the default representation of the angles on iOS is not compliant with the W3C specification)
        if (this.orientation._webkitCompassHeadingReference && platform.os.family === 'iOS') {
          _outEvent[0] += 360 - this.orientation._webkitCompassHeadingReference;
          unify(_outEvent);
        }

        this.orientation.emit(_outEvent);
      }

      // 'orientationAlt' event
      if (this.required.orientationAlt && this.orientationAlt.isProvided) {
        // On iOS, the `alpha` value is initialized at `0` on the first `deviceorientation` event
        // so we keep that reference in memory to calculate the North later on
        if (!this.orientationAlt._webkitCompassHeadingReference && e.webkitCompassHeading && platform.os.family === 'iOS') this.orientationAlt._webkitCompassHeadingReference = e.webkitCompassHeading;

        var _outEvent2 = this.orientationAlt.event;

        _outEvent2[0] = e.alpha;
        _outEvent2[1] = e.beta;
        _outEvent2[2] = e.gamma;

        // On iOS, replace the `alpha` value by the North value but do not convert the angles
        // (the default representation of the angles on iOS is compliant with the alternative representation)
        if (this.orientationAlt._webkitCompassHeadingReference && platform.os.family === 'iOS') {
          _outEvent2[0] -= this.orientationAlt._webkitCompassHeadingReference;
          _outEvent2[0] += _outEvent2[0] < 0 ? 360 : 0; // make sure `alpha` is in [0, +360[
        }

        // On Android, transform the angles to the alternative representation
        // (the default representation of the angles on Android is compliant with the W3C specification)
        if (platform.os.family === 'Android') unifyAlt(_outEvent2);

        this.orientationAlt.emit(_outEvent2);
      }
    }

    /**
     * Checks whether `beta` and `gamma` can be calculated from the `accelerationIncludingGravity` values or not.
     */
  }, {
    key: '_tryAccelerationIncludingGravityFallback',
    value: function _tryAccelerationIncludingGravityFallback() {
      var _this = this;

      MotionInput.requireModule('accelerationIncludingGravity').then(function (accelerationIncludingGravity) {
        if (accelerationIncludingGravity.isValid) {
          console.log("WARNING (motion-input): The 'deviceorientation' event does not exist or does not provide values in your browser, so the orientation of the device is estimated from DeviceMotion's 'accelerationIncludingGravity' event. Since the compass is not available, only the `beta` and `gamma` angles are provided (`alpha` is null).");

          if (_this.required.orientation) {
            _this.orientation.isCalculated = true;
            _this.orientation.period = accelerationIncludingGravity.period;

            MotionInput.addListener('accelerationIncludingGravity', function (accelerationIncludingGravity) {
              _this._calculateBetaAndGammaFromAccelerationIncludingGravity(accelerationIncludingGravity);
            });
          }

          if (_this.required.orientationAlt) {
            _this.orientationAlt.isCalculated = true;
            _this.orientationAlt.period = accelerationIncludingGravity.period;

            MotionInput.addListener('accelerationIncludingGravity', function (accelerationIncludingGravity) {
              _this._calculateBetaAndGammaFromAccelerationIncludingGravity(accelerationIncludingGravity, true);
            });
          }
        }

        _this._promiseResolve(_this);
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
      var alt = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

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
        var outEvent = this.orientation.event;
        outEvent[0] = null;
        outEvent[1] = beta;
        outEvent[2] = gamma;
        unify(outEvent);

        this.orientation.emit(outEvent);
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
      var _this2 = this;

      return _get(Object.getPrototypeOf(DeviceOrientationModule.prototype), 'init', this).call(this, function (resolve) {
        _this2._promiseResolve = resolve;

        if (window.DeviceOrientationEvent) window.addEventListener('deviceorientation', _this2._deviceorientationCheck, false);else if (_this2.required.orientation) _this2._tryAccelerationIncludingGravityFallback();else resolve(_this2);
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
      _get(Object.getPrototypeOf(DeviceOrientationModule.prototype), 'addListener', this).call(this, listener);
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
      _get(Object.getPrototypeOf(DeviceOrientationModule.prototype), 'removeListener', this).call(this, listener);
      this._removeListener();
    }
  }]);

  return DeviceOrientationModule;
})(InputModule);

module.exports = new DeviceOrientationModule();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9EZXZpY2VPcmllbnRhdGlvbk1vZHVsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUtBLFlBQVksQ0FBQzs7Ozs7Ozs7OztBQUViLElBQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDekQsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzdDLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUM3QyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7Ozs7Ozs7O0FBUXJDLFNBQVMsUUFBUSxDQUFDLEdBQUcsRUFBRTtBQUNyQixTQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztDQUM1Qjs7Ozs7Ozs7QUFRRCxTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUU7QUFDckIsU0FBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Q0FDNUI7Ozs7Ozs7O0FBUUQsU0FBUyxTQUFTLENBQUMsQ0FBQyxFQUFFO0FBQ3BCLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV4SSxPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7QUFDL0IsS0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQztHQUFBLEFBRWQsT0FBTyxDQUFDLENBQUM7Q0FDVjs7Ozs7Ozs7Ozs7QUFXRCxTQUFTLEtBQUssQ0FBQyxVQUFVLEVBQUU7Ozs7Ozs7OztBQVN6QixNQUFNLFlBQVksR0FBSSxPQUFPLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEFBQUMsQ0FBQzs7QUFFekQsTUFBTSxNQUFNLEdBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEFBQUMsQ0FBQztBQUM1RCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV2QyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFNUIsTUFBSSxLQUFLLFlBQUE7TUFBRSxJQUFJLFlBQUE7TUFBRSxLQUFLLFlBQUEsQ0FBQzs7QUFFdkIsTUFBSSxDQUFDLEdBQUcsQ0FDTixFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUN0QixDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ1IsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFDdEIsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFDdEIsRUFBRSxHQUFHLEVBQUUsRUFDUCxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUN0QixDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ1IsRUFBRSxFQUNGLEVBQUUsR0FBRyxFQUFFLENBQ1IsQ0FBQztBQUNGLFdBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O0FBR2IsTUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFOzs7QUFHWixTQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxRQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixTQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNqQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTs7Ozs7OztBQU9uQixTQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxRQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLFFBQUksSUFBSSxBQUFDLElBQUksSUFBSSxDQUFDLEdBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDekMsU0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDakMsTUFBTTs7QUFFTCxVQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7Ozs7QUFJWixhQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxZQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixhQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztPQUN0QixNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTs7OztBQUluQixhQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxZQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLFlBQUksSUFBSSxBQUFDLElBQUksSUFBSSxDQUFDLEdBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDekMsYUFBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7T0FDdEIsTUFBTTs7Ozs7Ozs7O0FBU0wsYUFBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFlBQUksR0FBRyxBQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMvQyxhQUFLLEdBQUcsQ0FBQyxDQUFDO09BQ1g7S0FDRjs7O0FBR0QsT0FBSyxJQUFJLEFBQUMsS0FBSyxHQUFHLENBQUMsR0FBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRXZDLFlBQVUsQ0FBQyxDQUFDLENBQUMsR0FBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQUFBQyxDQUFDO0FBQ3hELFlBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsWUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztDQUNqQzs7Ozs7Ozs7OztBQVVELFNBQVMsUUFBUSxDQUFDLFVBQVUsRUFBRTs7Ozs7O0FBTTVCLE1BQU0sWUFBWSxHQUFJLE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQUFBQyxDQUFDOztBQUV6RCxNQUFNLE1BQU0sR0FBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQUFBQyxDQUFDO0FBQzVELE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXZDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU1QixNQUFJLEtBQUssWUFBQTtNQUFFLElBQUksWUFBQTtNQUFFLEtBQUssWUFBQSxDQUFDOztBQUV2QixNQUFJLENBQUMsR0FBRyxDQUNOLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQ3RCLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDUixFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUN0QixFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUN0QixFQUFFLEdBQUcsRUFBRSxFQUNQLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQ3RCLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDUixFQUFFLEVBQ0YsRUFBRSxHQUFHLEVBQUUsQ0FDUixDQUFDO0FBQ0YsV0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUViLE9BQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLE9BQUssSUFBSSxBQUFDLEtBQUssR0FBRyxDQUFDLEdBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLE1BQUksR0FBRyxJQUFJLENBQUMsSUFB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T0FDeEQ7S0FDRjs7Ozs7Ozs7O1dBT0csZ0JBQUc7OztBQUNMLHdDQXJWRSx1QkFBdUIsc0NBcVZQLFVBQUMsT0FBTyxFQUFLO0FBQzdCLGVBQUssZUFBZSxHQUFHLE9BQU8sQ0FBQzs7QUFFL0IsWUFBSSxNQUFNLENBQUMsc0JBQXNCLEVBQy9CLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRSxPQUFLLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxDQUFDLEtBQy9FLElBQUksT0FBSyxRQUFRLENBQUMsV0FBVyxFQUNoQyxPQUFLLHdDQUF3QyxFQUFFLENBQUMsS0FFaEQsT0FBTyxRQUFNLENBQUM7T0FDakIsRUFBRTtLQUNKOzs7Ozs7Ozs7V0FPVSxxQkFBQyxRQUFRLEVBQUU7QUFDcEIsaUNBdldFLHVCQUF1Qiw2Q0F1V1AsUUFBUSxFQUFFO0FBQzVCLFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztLQUNyQjs7Ozs7Ozs7O1dBT2Esd0JBQUMsUUFBUSxFQUFFO0FBQ3ZCLGlDQWpYRSx1QkFBdUIsZ0RBaVhKLFFBQVEsRUFBRTtBQUMvQixVQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7S0FDeEI7OztTQW5YRyx1QkFBdUI7R0FBUyxXQUFXOztBQXNYakQsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLHVCQUF1QixFQUFFLENBQUMiLCJmaWxlIjoic3JjL0RldmljZU9yaWVudGF0aW9uTW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IGBEZXZpY2VPcmllbnRhdGlvbmAgbW9kdWxlXG4gKiBAYXV0aG9yIDxhIGhyZWY9J21haWx0bzpzZWJhc3RpZW5Acm9iYXN6a2lld2ljei5jb20nPlPDqWJhc3RpZW4gUm9iYXN6a2lld2ljejwvYT4sIDxhIGhyZWY9J21haWx0bzpOb3JiZXJ0LlNjaG5lbGxAaXJjYW0uZnInPk5vcmJlcnQgU2NobmVsbDwvYT5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IERPTUV2ZW50U3VibW9kdWxlID0gcmVxdWlyZSgnLi9ET01FdmVudFN1Ym1vZHVsZScpO1xuY29uc3QgSW5wdXRNb2R1bGUgPSByZXF1aXJlKCcuL0lucHV0TW9kdWxlJyk7XG5jb25zdCBNb3Rpb25JbnB1dCA9IHJlcXVpcmUoJy4vTW90aW9uSW5wdXQnKTtcbmNvbnN0IHBsYXRmb3JtID0gcmVxdWlyZSgncGxhdGZvcm0nKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBkZWdyZWVzIHRvIHJhZGlhbnMuXG4gKiBcbiAqIEBwYXJhbSB7bnVtYmVyfSBkZWcgLSBBbmdsZSBpbiBkZWdyZWVzLlxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBkZWdUb1JhZChkZWcpIHtcbiAgcmV0dXJuIGRlZyAqIE1hdGguUEkgLyAxODA7XG59XG5cbi8qKlxuICogQ29udmVydHMgcmFkaWFucyB0byBkZWdyZWVzLlxuICogXG4gKiBAcGFyYW0ge251bWJlcn0gcmFkIC0gQW5nbGUgaW4gcmFkaWFucy5cbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gcmFkVG9EZWcocmFkKSB7XG4gIHJldHVybiByYWQgKiAxODAgLyBNYXRoLlBJO1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZXMgYSAzIHggMyBtYXRyaXguXG4gKiBcbiAqIEBwYXJhbSB7bnVtYmVyW119IG0gLSBNYXRyaXggdG8gbm9ybWFsaXplLCByZXByZXNlbnRlZCBieSBhbiBhcnJheSBvZiBsZW5ndGggOS5cbiAqIEByZXR1cm4ge251bWJlcltdfVxuICovXG5mdW5jdGlvbiBub3JtYWxpemUobSkge1xuICBjb25zdCBkZXQgPSBtWzBdICogbVs0XSAqIG1bOF0gKyBtWzFdICogbVs1XSAqIG1bNl0gKyBtWzJdICogbVszXSAqIG1bN10gLSBtWzBdICogbVs1XSAqIG1bN10gLSBtWzFdICogbVszXSAqIG1bOF0gLSBtWzJdICogbVs0XSAqIG1bNl07XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSsrKVxuICAgIG1baV0gLz0gZGV0O1xuXG4gIHJldHVybiBtO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgRXVsZXIgYW5nbGUgYFthbHBoYSwgYmV0YSwgZ2FtbWFdYCB0byB0aGUgVzNDIHNwZWNpZmljYXRpb24sIHdoZXJlOlxuICogLSBgYWxwaGFgIGlzIGluIFswOyArMzYwWztcbiAqIC0gYGJldGFgIGlzIGluIFstMTgwOyArMTgwWztcbiAqIC0gYGdhbW1hYCBpcyBpbiBbLTkwOyArOTBbLlxuICogXG4gKiBAcGFyYW0ge251bWJlcltdfSBldWxlckFuZ2xlIC0gRXVsZXIgYW5nbGUgdG8gdW5pZnksIHJlcHJlc2VudGVkIGJ5IGFuIGFycmF5IG9mIGxlbmd0aCAzIChgW2FscGhhLCBiZXRhLCBnYW1tYV1gKS5cbiAqIEBzZWUge0BsaW5rIGh0dHA6Ly93d3cudzMub3JnL1RSL29yaWVudGF0aW9uLWV2ZW50L31cbiAqL1xuZnVuY3Rpb24gdW5pZnkoZXVsZXJBbmdsZSkge1xuICAvLyBDZi4gVzNDIHNwZWNpZmljYXRpb24gKGh0dHA6Ly93M2MuZ2l0aHViLmlvL2RldmljZW9yaWVudGF0aW9uL3NwZWMtc291cmNlLW9yaWVudGF0aW9uLmh0bWwpXG4gIC8vIGFuZCBFdWxlciBhbmdsZXMgV2lraXBlZGlhIHBhZ2UgKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRXVsZXJfYW5nbGVzKS5cbiAgLy9cbiAgLy8gVzNDIGNvbnZlbnRpb246IFRhaXTigJNCcnlhbiBhbmdsZXMgWi1YJy1ZJycsIHdoZXJlOlxuICAvLyAgIGFscGhhIGlzIGluIFswOyArMzYwWyxcbiAgLy8gICBiZXRhIGlzIGluIFstMTgwOyArMTgwWyxcbiAgLy8gICBnYW1tYSBpcyBpbiBbLTkwOyArOTBbLlxuXG4gIGNvbnN0IGFscGhhSXNWYWxpZCA9ICh0eXBlb2YgZXVsZXJBbmdsZVswXSA9PT0gJ251bWJlcicpO1xuXG4gIGNvbnN0IF9hbHBoYSA9IChhbHBoYUlzVmFsaWQgPyBkZWdUb1JhZChldWxlckFuZ2xlWzBdKSA6IDApO1xuICBjb25zdCBfYmV0YSA9IGRlZ1RvUmFkKGV1bGVyQW5nbGVbMV0pO1xuICBjb25zdCBfZ2FtbWEgPSBkZWdUb1JhZChldWxlckFuZ2xlWzJdKTtcblxuICBjb25zdCBjQSA9IE1hdGguY29zKF9hbHBoYSk7XG4gIGNvbnN0IGNCID0gTWF0aC5jb3MoX2JldGEpO1xuICBjb25zdCBjRyA9IE1hdGguY29zKF9nYW1tYSk7XG4gIGNvbnN0IHNBID0gTWF0aC5zaW4oX2FscGhhKTtcbiAgY29uc3Qgc0IgPSBNYXRoLnNpbihfYmV0YSk7XG4gIGNvbnN0IHNHID0gTWF0aC5zaW4oX2dhbW1hKTtcblxuICBsZXQgYWxwaGEsIGJldGEsIGdhbW1hO1xuXG4gIGxldCBtID0gW1xuICAgIGNBICogY0cgLSBzQSAqIHNCICogc0csXG4gICAgLWNCICogc0EsXG4gICAgY0EgKiBzRyArIGNHICogc0EgKiBzQixcbiAgICBjRyAqIHNBICsgY0EgKiBzQiAqIHNHLFxuICAgIGNBICogY0IsXG4gICAgc0EgKiBzRyAtIGNBICogY0cgKiBzQixcbiAgICAtY0IgKiBzRyxcbiAgICBzQixcbiAgICBjQiAqIGNHXG4gIF07XG4gIG5vcm1hbGl6ZShtKTtcblxuICAvLyBTaW5jZSB3ZSB3YW50IGdhbW1hIGluIFstOTA7ICs5MFssIGNHID49IDAuXG4gIGlmIChtWzhdID4gMCkge1xuICAgIC8vIENhc2UgMTogbVs4XSA+IDAgPD0+IGNCID4gMCAgICAgICAgICAgICAgICAgKGFuZCBjRyAhPSAwKVxuICAgIC8vICAgICAgICAgICAgICAgICAgPD0+IGJldGEgaW4gXS1waS8yOyArcGkvMlsgKGFuZCBjRyAhPSAwKVxuICAgIGFscGhhID0gTWF0aC5hdGFuMigtbVsxXSwgbVs0XSk7XG4gICAgYmV0YSA9IE1hdGguYXNpbihtWzddKTsgLy8gYXNpbiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpLzIgYW5kICtwaS8yID0+IE9LXG4gICAgZ2FtbWEgPSBNYXRoLmF0YW4yKC1tWzZdLCBtWzhdKTtcbiAgfSBlbHNlIGlmIChtWzhdIDwgMCkge1xuICAgIC8vIENhc2UgMjogbVs4XSA8IDAgPD0+IGNCIDwgMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAoYW5kIGNHICE9IDApXG4gICAgLy8gICAgICAgICAgICAgICAgICA8PT4gYmV0YSBpbiBbLXBpOyAtcGkvMlsgVSBdK3BpLzI7ICtwaV0gKGFuZCBjRyAhPSAwKVxuXG4gICAgLy8gU2luY2UgY0IgPCAwIGFuZCBjQiBpcyBpbiBtWzFdIGFuZCBtWzRdLCB0aGUgcG9pbnQgaXMgZmxpcHBlZCBieSAxODAgZGVncmVlcy5cbiAgICAvLyBIZW5jZSwgd2UgaGF2ZSB0byBtdWx0aXBseSBib3RoIGFyZ3VtZW50cyBvZiBhdGFuMiBieSAtMSBpbiBvcmRlciB0byByZXZlcnRcbiAgICAvLyB0aGUgcG9pbnQgaW4gaXRzIG9yaWdpbmFsIHBvc2l0aW9uICg9PiBhbm90aGVyIGZsaXAgYnkgMTgwIGRlZ3JlZXMpLlxuICAgIGFscGhhID0gTWF0aC5hdGFuMihtWzFdLCAtbVs0XSk7XG4gICAgYmV0YSA9IC1NYXRoLmFzaW4obVs3XSk7XG4gICAgYmV0YSArPSAoYmV0YSA+PSAwKSA/IC1NYXRoLlBJIDogTWF0aC5QSTsgLy8gYXNpbiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpLzIgYW5kIHBpLzIgPT4gbWFrZSBzdXJlIGJldGEgaW4gWy1waTsgLXBpLzJbIFUgXStwaS8yOyArcGldXG4gICAgZ2FtbWEgPSBNYXRoLmF0YW4yKG1bNl0sIC1tWzhdKTsgLy8gc2FtZSByZW1hcmsgYXMgZm9yIGFscGhhLCBtdWx0aXBsaWNhdGlvbiBieSAtMVxuICB9IGVsc2Uge1xuICAgIC8vIENhc2UgMzogbVs4XSA9IDAgPD0+IGNCID0gMCBvciBjRyA9IDBcbiAgICBpZiAobVs2XSA+IDApIHtcbiAgICAgIC8vIFN1YmNhc2UgMTogY0cgPSAwIGFuZCBjQiA+IDBcbiAgICAgIC8vICAgICAgICAgICAgY0cgPSAwIDw9PiBzRyA9IC0xIDw9PiBnYW1tYSA9IC1waS8yID0+IG1bNl0gPSBjQlxuICAgICAgLy8gICAgICAgICAgICBIZW5jZSwgbVs2XSA+IDAgPD0+IGNCID4gMCA8PT4gYmV0YSBpbiBdLXBpLzI7ICtwaS8yW1xuICAgICAgYWxwaGEgPSBNYXRoLmF0YW4yKC1tWzFdLCBtWzRdKTtcbiAgICAgIGJldGEgPSBNYXRoLmFzaW4obVs3XSk7IC8vIGFzaW4gcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waS8yIGFuZCArcGkvMiA9PiBPS1xuICAgICAgZ2FtbWEgPSAtTWF0aC5QSSAvIDI7XG4gICAgfSBlbHNlIGlmIChtWzZdIDwgMCkge1xuICAgICAgLy8gU3ViY2FzZSAyOiBjRyA9IDAgYW5kIGNCIDwgMFxuICAgICAgLy8gICAgICAgICAgICBjRyA9IDAgPD0+IHNHID0gLTEgPD0+IGdhbW1hID0gLXBpLzIgPT4gbVs2XSA9IGNCXG4gICAgICAvLyAgICAgICAgICAgIEhlbmNlLCBtWzZdIDwgMCA8PT4gY0IgPCAwIDw9PiBiZXRhIGluIFstcGk7IC1waS8yWyBVIF0rcGkvMjsgK3BpXVxuICAgICAgYWxwaGEgPSBNYXRoLmF0YW4yKG1bMV0sIC1tWzRdKTsgLy8gc2FtZSByZW1hcmsgYXMgZm9yIGFscGhhIGluIGEgY2FzZSBhYm92ZVxuICAgICAgYmV0YSA9IC1NYXRoLmFzaW4obVs3XSk7XG4gICAgICBiZXRhICs9IChiZXRhID49IDApID8gLU1hdGguUEkgOiBNYXRoLlBJOyAvLyBhc2luIHJldHVybnMgYSBudW1iZXIgYmV0d2VlbiAtcGkvMiBhbmQgK3BpLzIgPT4gbWFrZSBzdXJlIGJldGEgaW4gWy1waTsgLXBpLzJbIFUgXStwaS8yOyArcGldXG4gICAgICBnYW1tYSA9IC1NYXRoLlBJIC8gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU3ViY2FzZSAzOiBjQiA9IDBcbiAgICAgIC8vIEluIHRoZSBjYXNlIHdoZXJlIGNvcyhiZXRhKSA9IDAgKGkuZS4gYmV0YSA9IC1waS8yIG9yIGJldGEgPSBwaS8yKSxcbiAgICAgIC8vIHdlIGhhdmUgdGhlIGdpbWJhbCBsb2NrIHByb2JsZW06IGluIHRoYXQgY29uZmlndXJhdGlvbiwgb25seSB0aGUgYW5nbGVcbiAgICAgIC8vIGFscGhhICsgZ2FtbWEgKGlmIGJldGEgPSArcGkvMikgb3IgYWxwaGEgLSBnYW1tYSAoaWYgYmV0YSA9IC1waS8yKVxuICAgICAgLy8gYXJlIHVuaXF1ZWx5IGRlZmluZWQ6IGFscGhhIGFuZCBnYW1tYSBjYW4gdGFrZSBhbiBpbmZpbml0eSBvZiB2YWx1ZXMuXG4gICAgICAvLyBGb3IgY29udmVuaWVuY2UsIGxldCdzIHNldCBnYW1tYSA9IDAgKGFuZCB0aHVzIHNpbihnYW1tYSkgPSAwKS5cbiAgICAgIC8vIChBcyBhIGNvbnNlcXVlbmNlIG9mIHRoZSBnaW1iYWwgbG9jayBwcm9ibGVtLCB0aGVyZSBpcyBhIGRpc2NvbnRpbnVpdHlcbiAgICAgIC8vIGluIGFscGhhIGFuZCBnYW1tYS4pXG4gICAgICBhbHBoYSA9IE1hdGguYXRhbjIobVszXSwgbVswXSk7XG4gICAgICBiZXRhID0gKG1bN10gPiAwKSA/IE1hdGguUEkgLyAyIDogLU1hdGguUEkgLyAyO1xuICAgICAgZ2FtbWEgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8vIGF0YW4yIHJldHVybnMgYSBudW1iZXIgYmV0d2VlbiAtcGkgYW5kIHBpID0+IG1ha2Ugc3VyZSB0aGF0IGFscGhhIGlzIGluIFswLCAyKnBpWy5cbiAgYWxwaGEgKz0gKGFscGhhIDwgMCkgPyAyICogTWF0aC5QSSA6IDA7XG5cbiAgZXVsZXJBbmdsZVswXSA9IChhbHBoYUlzVmFsaWQgPyByYWRUb0RlZyhhbHBoYSkgOiBudWxsKTtcbiAgZXVsZXJBbmdsZVsxXSA9IHJhZFRvRGVnKGJldGEpO1xuICBldWxlckFuZ2xlWzJdID0gcmFkVG9EZWcoZ2FtbWEpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgRXVsZXIgYW5nbGUgYFthbHBoYSwgYmV0YSwgZ2FtbWFdYCB0byBhIEV1bGVyIGFuZ2xlIHdoZXJlOlxuICogLSBgYWxwaGFgIGlzIGluIFswOyArMzYwWztcbiAqIC0gYGJldGFgIGlzIGluIFstOTA7ICs5MFs7XG4gKiAtIGBnYW1tYWAgaXMgaW4gWy0xODA7ICsxODBbLlxuICogXG4gKiBAcGFyYW0ge251bWJlcltdfSBldWxlckFuZ2xlIC0gRXVsZXIgYW5nbGUgdG8gY29udmVydCwgcmVwcmVzZW50ZWQgYnkgYW4gYXJyYXkgb2YgbGVuZ3RoIDMgKGBbYWxwaGEsIGJldGEsIGdhbW1hXWApLlxuICovXG5mdW5jdGlvbiB1bmlmeUFsdChldWxlckFuZ2xlKSB7XG4gIC8vIENvbnZlbnRpb24gaGVyZTogVGFpdOKAk0JyeWFuIGFuZ2xlcyBaLVgnLVknJywgd2hlcmU6XG4gIC8vICAgYWxwaGEgaXMgaW4gWzA7ICszNjBbLFxuICAvLyAgIGJldGEgaXMgaW4gWy05MDsgKzkwWyxcbiAgLy8gICBnYW1tYSBpcyBpbiBbLTE4MDsgKzE4MFsuXG5cbiAgY29uc3QgYWxwaGFJc1ZhbGlkID0gKHR5cGVvZiBldWxlckFuZ2xlWzBdID09PSAnbnVtYmVyJyk7XG5cbiAgY29uc3QgX2FscGhhID0gKGFscGhhSXNWYWxpZCA/IGRlZ1RvUmFkKGV1bGVyQW5nbGVbMF0pIDogMCk7XG4gIGNvbnN0IF9iZXRhID0gZGVnVG9SYWQoZXVsZXJBbmdsZVsxXSk7XG4gIGNvbnN0IF9nYW1tYSA9IGRlZ1RvUmFkKGV1bGVyQW5nbGVbMl0pO1xuXG4gIGNvbnN0IGNBID0gTWF0aC5jb3MoX2FscGhhKTtcbiAgY29uc3QgY0IgPSBNYXRoLmNvcyhfYmV0YSk7XG4gIGNvbnN0IGNHID0gTWF0aC5jb3MoX2dhbW1hKTtcbiAgY29uc3Qgc0EgPSBNYXRoLnNpbihfYWxwaGEpO1xuICBjb25zdCBzQiA9IE1hdGguc2luKF9iZXRhKTtcbiAgY29uc3Qgc0cgPSBNYXRoLnNpbihfZ2FtbWEpO1xuXG4gIGxldCBhbHBoYSwgYmV0YSwgZ2FtbWE7XG5cbiAgbGV0IG0gPSBbXG4gICAgY0EgKiBjRyAtIHNBICogc0IgKiBzRyxcbiAgICAtY0IgKiBzQSxcbiAgICBjQSAqIHNHICsgY0cgKiBzQSAqIHNCLFxuICAgIGNHICogc0EgKyBjQSAqIHNCICogc0csXG4gICAgY0EgKiBjQixcbiAgICBzQSAqIHNHIC0gY0EgKiBjRyAqIHNCLFxuICAgIC1jQiAqIHNHLFxuICAgIHNCLFxuICAgIGNCICogY0dcbiAgXTtcbiAgbm9ybWFsaXplKG0pO1xuXG4gIGFscGhhID0gTWF0aC5hdGFuMigtbVsxXSwgbVs0XSk7XG4gIGFscGhhICs9IChhbHBoYSA8IDApID8gMiAqIE1hdGguUEkgOiAwOyAvLyBhdGFuMiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpIGFuZCArcGkgPT4gbWFrZSBzdXJlIGFscGhhIGlzIGluIFswLCAyKnBpWy5cbiAgYmV0YSA9IE1hdGguYXNpbihtWzddKTsgLy8gYXNpbiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpLzIgYW5kIHBpLzIgPT4gT0tcbiAgZ2FtbWEgPSBNYXRoLmF0YW4yKC1tWzZdLCBtWzhdKTsgLy8gYXRhbjIgcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waSBhbmQgK3BpID0+IE9LXG5cbiAgZXVsZXJBbmdsZVswXSA9IChhbHBoYUlzVmFsaWQgPyByYWRUb0RlZyhhbHBoYSkgOiBudWxsKTtcbiAgZXVsZXJBbmdsZVsxXSA9IHJhZFRvRGVnKGJldGEpO1xuICBldWxlckFuZ2xlWzJdID0gcmFkVG9EZWcoZ2FtbWEpO1xufVxuXG4vKipcbiAqIGBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZWAgc2luZ2xldG9uLlxuICogVGhlIGBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZWAgc2luZ2xldG9uIHByb3ZpZGVzIHRoZSByYXcgdmFsdWVzXG4gKiBvZiB0aGUgb3JpZW50YXRpb24gcHJvdmlkZWQgYnkgdGhlIGBEZXZpY2VNb3Rpb25gIGV2ZW50LlxuICogSXQgYWxzbyBpbnN0YW50aWF0ZSB0aGUgYE9yaWVudGF0aW9uYCBzdWJtb2R1bGUgdGhhdCB1bmlmaWVzIHRob3NlXG4gKiB2YWx1ZXMgYWNyb3NzIHBsYXRmb3JtcyBieSBtYWtpbmcgdGhlbSBjb21wbGlhbnQgd2l0aCB7QGxpbmtcbiAqIGh0dHA6Ly93d3cudzMub3JnL1RSL29yaWVudGF0aW9uLWV2ZW50L3x0aGUgVzNDIHN0YW5kYXJkfSAoKmkuZS4qXG4gKiB0aGUgYGFscGhhYCBhbmdsZSBiZXR3ZWVuIGAwYCBhbmQgYDM2MGAgZGVncmVlcywgdGhlIGBiZXRhYCBhbmdsZVxuICogYmV0d2VlbiBgLTE4MGAgYW5kIGAxODBgIGRlZ3JlZXMsIGFuZCBgZ2FtbWFgIGJldHdlZW4gYC05MGAgYW5kXG4gKiBgOTBgIGRlZ3JlZXMpLCBhcyB3ZWxsIGFzIHRoZSBgT3JpZW50YXRpb25BbHRgIHN1Ym1vZHVsZXMgKHdpdGhcbiAqIHRoZSBgYWxwaGFgIGFuZ2xlIGJldHdlZW4gYDBgIGFuZCBgMzYwYCBkZWdyZWVzLCB0aGUgYGJldGFgIGFuZ2xlXG4gKiBiZXR3ZWVuIGAtOTBgIGFuZCBgOTBgIGRlZ3JlZXMsIGFuZCBgZ2FtbWFgIGJldHdlZW4gYC0xODBgIGFuZFxuICogYDE4MGAgZGVncmVlcykuXG4gKiBXaGVuIHRoZSBgb3JpZW50YXRpb25gIHJhdyB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSB0aGUgc2Vuc29ycyxcbiAqIHRoaXMgbW9kdWxlcyB0cmllcyB0byByZWNhbGN1bGF0ZSBgYmV0YWAgYW5kIGBnYW1tYWAgZnJvbSB0aGVcbiAqIGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCBtb2R1bGUsIGlmIGF2YWlsYWJsZSAoaW4gdGhhdCBjYXNlLFxuICogdGhlIGBhbHBoYWAgYW5nbGUgaXMgaW1wb3NzaWJsZSB0byByZXRyaWV2ZSBzaW5jZSB0aGUgY29tcGFzcyBpc1xuICogbm90IGF2YWlsYWJsZSkuXG4gKlxuICogQGNsYXNzIERldmljZU1vdGlvbk1vZHVsZVxuICogQGV4dGVuZHMgSW5wdXRNb2R1bGVcbiAqL1xuY2xhc3MgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGUgZXh0ZW5kcyBJbnB1dE1vZHVsZSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGBEZXZpY2VPcmllbnRhdGlvbmAgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCdkZXZpY2VvcmllbnRhdGlvbicpO1xuXG4gICAgLyoqXG4gICAgICogUmF3IHZhbHVlcyBjb21pbmcgZnJvbSB0aGUgYGRldmljZW9yaWVudGF0aW9uYCBldmVudCBzZW50IGJ5IHRoaXMgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgW251bGwsIG51bGwsIG51bGxdXG4gICAgICovXG4gICAgdGhpcy5ldmVudCA9IFtudWxsLCBudWxsLCBudWxsXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgT3JpZW50YXRpb25gIG1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyB1bmlmaWVkIHZhbHVlcyBvZiB0aGUgb3JpZW50YXRpb24gY29tcGxpYW50IHdpdGgge0BsaW5rXG4gICAgICogaHR0cDovL3d3dy53My5vcmcvVFIvb3JpZW50YXRpb24tZXZlbnQvfHRoZSBXM0Mgc3RhbmRhcmR9XG4gICAgICogKGBhbHBoYWAgaW4gYFswLCAzNjBdYCwgYmV0YSBpbiBgWy0xODAsICsxODBdYCwgYGdhbW1hYCBpbiBgWy05MCwgKzkwXWApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAnb3JpZW50YXRpb24nKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgT3JpZW50YXRpb25BbHRgIG1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyBhbHRlcm5hdGl2ZSB2YWx1ZXMgb2YgdGhlIG9yaWVudGF0aW9uXG4gICAgICogKGBhbHBoYWAgaW4gYFswLCAzNjBdYCwgYmV0YSBpbiBgWy05MCwgKzkwXWAsIGBnYW1tYWAgaW4gYFstMTgwLCArMTgwXWApLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICovXG4gICAgdGhpcy5vcmllbnRhdGlvbkFsdCA9IG5ldyBET01FdmVudFN1Ym1vZHVsZSh0aGlzLCAnb3JpZW50YXRpb25BbHQnKTtcblxuICAgIC8qKlxuICAgICAqIFJlcXVpcmVkIHN1Ym1vZHVsZXMgLyBldmVudHMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtib29sfSBvcmllbnRhdGlvbiAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBgb3JpZW50YXRpb25gIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gb3JpZW50YXRpb25BbHQgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYG9yaWVudGF0aW9uQWx0YCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICovXG4gICAgdGhpcy5yZXF1aXJlZCA9IHtcbiAgICAgIG9yaWVudGF0aW9uOiBmYWxzZSxcbiAgICAgIG9yaWVudGF0aW9uQWx0OiBmYWxzZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBOdW1iZXIgb2YgbGlzdGVuZXJzIHN1YnNjcmliZWQgdG8gdGhlIGBEZXZpY2VPcmllbnRhdGlvbmAgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX251bUxpc3RlbmVycyA9IDA7XG4gICAgXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZSBmdW5jdGlvbiBvZiB0aGUgbW9kdWxlJ3MgcHJvbWlzZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKiBAc2VlIERldmljZU9yaWVudGF0aW9uTW9kdWxlI2luaXRcbiAgICAgKi9cbiAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBHcmF2aXR5IHZlY3RvciBjYWxjdWxhdGVkIGZyb20gdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuX2VzdGltYXRlZEdyYXZpdHkgPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgYmluZGluZyBvZiB0aGUgc2Vuc29yIGNoZWNrLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICovXG4gICAgdGhpcy5fZGV2aWNlb3JpZW50YXRpb25DaGVjayA9IHRoaXMuX2RldmljZW9yaWVudGF0aW9uQ2hlY2suYmluZCh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCBiaW5kaW5nIG9mIHRoZSBgJ2RldmljZW9yaWVudGF0aW9uJ2AgZXZlbnQgY2FsbGJhY2suXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgKi9cbiAgICB0aGlzLl9kZXZpY2VvcmllbnRhdGlvbkxpc3RlbmVyID0gdGhpcy5fZGV2aWNlb3JpZW50YXRpb25MaXN0ZW5lci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbnNvciBjaGVjayBvbiBpbml0aWFsaXphdGlvbiBvZiB0aGUgbW9kdWxlLlxuICAgKiBUaGlzIG1ldGhvZDpcbiAgICogLSBjaGVja3Mgd2hldGhlciB0aGUgYG9yaWVudGF0aW9uYCB2YWx1ZXMgYXJlIHZhbGlkIG9yIG5vdDtcbiAgICogLSAoaW4gdGhlIGNhc2Ugd2hlcmUgb3JpZW50YXRpb24gcmF3IHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkKVxuICAgKiAgIHRyaWVzIHRvIGNhbGN1bGF0ZSB0aGUgb3JpZW50YXRpb24gZnJvbSB0aGVcbiAgICogICBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBGaXJzdCBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGNhdWdodCwgb24gd2hpY2ggdGhlIGNoZWNrIGlzIGRvbmUuXG4gICAqL1xuICBfZGV2aWNlb3JpZW50YXRpb25DaGVjayhlKSB7XG4gICAgdGhpcy5pc1Byb3ZpZGVkID0gdHJ1ZTtcblxuICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSBvcmllbnRhdGlvbiBhbmQgYWx0ZXJuYXRpdmUgb3JpZW50YXRpb25cbiAgICBjb25zdCByYXdWYWx1ZXNQcm92aWRlZCA9ICgodHlwZW9mIGUuYWxwaGEgPT09ICdudW1iZXInKSAmJiAodHlwZW9mIGUuYmV0YSA9PT0gJ251bWJlcicpICYmICh0eXBlb2YgZS5nYW1tYSA9PT0gJ251bWJlcicpKTtcbiAgICB0aGlzLm9yaWVudGF0aW9uLmlzUHJvdmlkZWQgPSByYXdWYWx1ZXNQcm92aWRlZDtcbiAgICB0aGlzLm9yaWVudGF0aW9uQWx0LmlzUHJvdmlkZWQgPSByYXdWYWx1ZXNQcm92aWRlZDtcblxuICAgIC8vIFRPRE8oPyk6IGdldCBwc2V1ZG8tcGVyaW9kXG5cbiAgICAvLyBXZSBvbmx5IG5lZWQgdG8gbGlzdGVuIHRvIG9uZSBldmVudCAoPT4gcmVtb3ZlIHRoZSBsaXN0ZW5lcilcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCB0aGlzLl9kZXZpY2VvcmllbnRhdGlvbkNoZWNrLCBmYWxzZSk7XG5cbiAgICAvLyBJZiBvcmllbnRhdGlvbiBvciBhbHRlcm5hdGl2ZSBvcmllbnRhdGlvbiBhcmUgbm90IHByb3ZpZGVkIGJ5IHJhdyBzZW5zb3JzIGJ1dCByZXF1aXJlZCxcbiAgICAvLyB0cnkgdG8gY2FsY3VsYXRlIHRoZW0gd2l0aCBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXNcbiAgICBpZiAoKHRoaXMucmVxdWlyZWQub3JpZW50YXRpb24gJiYgIXRoaXMub3JpZW50YXRpb24uaXNQcm92aWRlZCkgfHwgKHRoaXMucmVxdWlyZWQub3JpZW50YXRpb25BbHQgJiYgIXRoaXMub3JpZW50YXRpb25BbHQuaXNQcm92aWRlZCkpXG4gICAgICB0aGlzLl90cnlBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RmFsbGJhY2soKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBgJ2RldmljZW9yaWVudGF0aW9uJ2AgZXZlbnQgY2FsbGJhY2suXG4gICAqIFRoaXMgbWV0aG9kIGVtaXRzIGFuIGV2ZW50IHdpdGggdGhlIHJhdyBgJ2RldmljZW9yaWVudGF0aW9uJ2AgdmFsdWVzLFxuICAgKiBhbmQgZW1pdHMgZXZlbnRzIHdpdGggdGhlIHVuaWZpZWQgYG9yaWVudGF0aW9uYCBhbmQgLyBvciB0aGVcbiAgICogYG9yaWVudGF0aW9uQWx0YCB2YWx1ZXMgaWYgdGhleSBhcmUgcmVxdWlyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlT3JpZW50YXRpb25FdmVudH0gZSAtIGAnZGV2aWNlb3JpZW50YXRpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAqL1xuICBfZGV2aWNlb3JpZW50YXRpb25MaXN0ZW5lcihlKSB7XG4gICAgLy8gJ2RldmljZW9yaWVudGF0aW9uJyBldmVudCAocmF3IHZhbHVlcylcbiAgICBsZXQgb3V0RXZlbnQgPSB0aGlzLmV2ZW50O1xuXG4gICAgb3V0RXZlbnRbMF0gPSBlLmFscGhhO1xuICAgIG91dEV2ZW50WzFdID0gZS5iZXRhO1xuICAgIG91dEV2ZW50WzJdID0gZS5nYW1tYTtcbiAgICBcbiAgICB0aGlzLmVtaXQob3V0RXZlbnQpO1xuXG4gICAgLy8gJ29yaWVudGF0aW9uJyBldmVudCAodW5pZmllZCB2YWx1ZXMpXG4gICAgaWYgKHRoaXMucmVxdWlyZWQub3JpZW50YXRpb24gJiYgdGhpcy5vcmllbnRhdGlvbi5pc1Byb3ZpZGVkKSB7XG4gICAgICAvLyBPbiBpT1MsIHRoZSBgYWxwaGFgIHZhbHVlIGlzIGluaXRpYWxpemVkIGF0IGAwYCBvbiB0aGUgZmlyc3QgYGRldmljZW9yaWVudGF0aW9uYCBldmVudFxuICAgICAgLy8gc28gd2Uga2VlcCB0aGF0IHJlZmVyZW5jZSBpbiBtZW1vcnkgdG8gY2FsY3VsYXRlIHRoZSBOb3J0aCBsYXRlciBvblxuICAgICAgaWYgKCF0aGlzLm9yaWVudGF0aW9uLl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSAmJiBlLndlYmtpdENvbXBhc3NIZWFkaW5nICYmIHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycpXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24uX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlID0gZS53ZWJraXRDb21wYXNzSGVhZGluZztcblxuICAgICAgbGV0IG91dEV2ZW50ID0gdGhpcy5vcmllbnRhdGlvbi5ldmVudDtcblxuICAgICAgb3V0RXZlbnRbMF0gPSBlLmFscGhhO1xuICAgICAgb3V0RXZlbnRbMV0gPSBlLmJldGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGUuZ2FtbWE7XG5cbiAgICAgIC8vIE9uIGlPUywgcmVwbGFjZSB0aGUgYGFscGhhYCB2YWx1ZSBieSB0aGUgTm9ydGggdmFsdWUgYW5kIHVuaWZ5IHRoZSBhbmdsZXNcbiAgICAgIC8vICh0aGUgZGVmYXVsdCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYW5nbGVzIG9uIGlPUyBpcyBub3QgY29tcGxpYW50IHdpdGggdGhlIFczQyBzcGVjaWZpY2F0aW9uKVxuICAgICAgaWYgKHRoaXMub3JpZW50YXRpb24uX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlICYmIHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycpIHtcbiAgICAgICAgb3V0RXZlbnRbMF0gKz0gMzYwIC0gdGhpcy5vcmllbnRhdGlvbi5fd2Via2l0Q29tcGFzc0hlYWRpbmdSZWZlcmVuY2U7XG4gICAgICAgIHVuaWZ5KG91dEV2ZW50KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcmllbnRhdGlvbi5lbWl0KG91dEV2ZW50KTtcbiAgICB9XG5cbiAgICAvLyAnb3JpZW50YXRpb25BbHQnIGV2ZW50XG4gICAgaWYgKHRoaXMucmVxdWlyZWQub3JpZW50YXRpb25BbHQgJiYgdGhpcy5vcmllbnRhdGlvbkFsdC5pc1Byb3ZpZGVkKSB7XG4gICAgICAvLyBPbiBpT1MsIHRoZSBgYWxwaGFgIHZhbHVlIGlzIGluaXRpYWxpemVkIGF0IGAwYCBvbiB0aGUgZmlyc3QgYGRldmljZW9yaWVudGF0aW9uYCBldmVudFxuICAgICAgLy8gc28gd2Uga2VlcCB0aGF0IHJlZmVyZW5jZSBpbiBtZW1vcnkgdG8gY2FsY3VsYXRlIHRoZSBOb3J0aCBsYXRlciBvblxuICAgICAgaWYgKCF0aGlzLm9yaWVudGF0aW9uQWx0Ll93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSAmJiBlLndlYmtpdENvbXBhc3NIZWFkaW5nICYmIHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ2lPUycpXG4gICAgICAgIHRoaXMub3JpZW50YXRpb25BbHQuX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlID0gZS53ZWJraXRDb21wYXNzSGVhZGluZztcblxuICAgICAgbGV0IG91dEV2ZW50ID0gdGhpcy5vcmllbnRhdGlvbkFsdC5ldmVudDtcblxuICAgICAgb3V0RXZlbnRbMF0gPSBlLmFscGhhO1xuICAgICAgb3V0RXZlbnRbMV0gPSBlLmJldGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGUuZ2FtbWE7XG5cbiAgICAgIC8vIE9uIGlPUywgcmVwbGFjZSB0aGUgYGFscGhhYCB2YWx1ZSBieSB0aGUgTm9ydGggdmFsdWUgYnV0IGRvIG5vdCBjb252ZXJ0IHRoZSBhbmdsZXNcbiAgICAgIC8vICh0aGUgZGVmYXVsdCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYW5nbGVzIG9uIGlPUyBpcyBjb21wbGlhbnQgd2l0aCB0aGUgYWx0ZXJuYXRpdmUgcmVwcmVzZW50YXRpb24pXG4gICAgICBpZiAodGhpcy5vcmllbnRhdGlvbkFsdC5fd2Via2l0Q29tcGFzc0hlYWRpbmdSZWZlcmVuY2UgJiYgcGxhdGZvcm0ub3MuZmFtaWx5ID09PSAnaU9TJyl7XG4gICAgICAgIG91dEV2ZW50WzBdIC09IHRoaXMub3JpZW50YXRpb25BbHQuX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlO1xuICAgICAgICBvdXRFdmVudFswXSArPSAob3V0RXZlbnRbMF0gPCAwKSA/IDM2MCA6IDA7IC8vIG1ha2Ugc3VyZSBgYWxwaGFgIGlzIGluIFswLCArMzYwW1xuICAgICAgfVxuXG4gICAgICAvLyBPbiBBbmRyb2lkLCB0cmFuc2Zvcm0gdGhlIGFuZ2xlcyB0byB0aGUgYWx0ZXJuYXRpdmUgcmVwcmVzZW50YXRpb25cbiAgICAgIC8vICh0aGUgZGVmYXVsdCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYW5nbGVzIG9uIEFuZHJvaWQgaXMgY29tcGxpYW50IHdpdGggdGhlIFczQyBzcGVjaWZpY2F0aW9uKVxuICAgICAgaWYgKHBsYXRmb3JtLm9zLmZhbWlseSA9PT0gJ0FuZHJvaWQnKVxuICAgICAgICB1bmlmeUFsdChvdXRFdmVudCk7XG5cbiAgICAgIHRoaXMub3JpZW50YXRpb25BbHQuZW1pdChvdXRFdmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIGBiZXRhYCBhbmQgYGdhbW1hYCBjYW4gYmUgY2FsY3VsYXRlZCBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdmFsdWVzIG9yIG5vdC5cbiAgICovXG4gIF90cnlBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RmFsbGJhY2soKSB7XG4gICAgTW90aW9uSW5wdXQucmVxdWlyZU1vZHVsZSgnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScpXG4gICAgICAudGhlbigoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSkgPT4ge1xuICAgICAgICBpZiAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1ZhbGlkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJXQVJOSU5HIChtb3Rpb24taW5wdXQpOiBUaGUgJ2RldmljZW9yaWVudGF0aW9uJyBldmVudCBkb2VzIG5vdCBleGlzdCBvciBkb2VzIG5vdCBwcm92aWRlIHZhbHVlcyBpbiB5b3VyIGJyb3dzZXIsIHNvIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgZGV2aWNlIGlzIGVzdGltYXRlZCBmcm9tIERldmljZU1vdGlvbidzICdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JyBldmVudC4gU2luY2UgdGhlIGNvbXBhc3MgaXMgbm90IGF2YWlsYWJsZSwgb25seSB0aGUgYGJldGFgIGFuZCBgZ2FtbWFgIGFuZ2xlcyBhcmUgcHJvdmlkZWQgKGBhbHBoYWAgaXMgbnVsbCkuXCIpO1xuXG4gICAgICAgICAgaWYgKHRoaXMucmVxdWlyZWQub3JpZW50YXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMub3JpZW50YXRpb24uaXNDYWxjdWxhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMub3JpZW50YXRpb24ucGVyaW9kID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5wZXJpb2Q7XG5cbiAgICAgICAgICAgIE1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JywgKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlQmV0YUFuZEdhbW1hRnJvbUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5yZXF1aXJlZC5vcmllbnRhdGlvbkFsdCkge1xuICAgICAgICAgICAgdGhpcy5vcmllbnRhdGlvbkFsdC5pc0NhbGN1bGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vcmllbnRhdGlvbkFsdC5wZXJpb2QgPSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnBlcmlvZDtcblxuICAgICAgICAgICAgTW90aW9uSW5wdXQuYWRkTGlzdGVuZXIoJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknLCAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVCZXRhQW5kR2FtbWFGcm9tQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eShhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LCB0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlKHRoaXMpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBhbmQgZW1pdHMgYGJldGFgIGFuZCBgZ2FtbWFgIHZhbHVlcyBhcyBhIGZhbGxiYWNrIG9mIHRoZSBgb3JpZW50YXRpb25gIGFuZCAvIG9yIGBvcmllbnRhdGlvbkFsdGAgZXZlbnRzLCBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyW119IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgLSBMYXRlc3QgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgcmF3IHZhbHVlcy5cbiAgICogQHBhcmFtIHtib29sfSBbYWx0PWZhbHNlXSAtIEluZGljYXRlcyB3aGV0aGVyIHdlIG5lZWQgdGhlIGFsdGVybmF0ZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgYW5nbGVzIG9yIG5vdC5cbiAgICovXG4gIF9jYWxjdWxhdGVCZXRhQW5kR2FtbWFGcm9tQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eShhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LCBhbHQgPSBmYWxzZSkge1xuICAgIGNvbnN0IGsgPSAwLjg7XG5cbiAgICAvLyBMb3cgcGFzcyBmaWx0ZXIgdG8gZXN0aW1hdGUgdGhlIGdyYXZpdHlcbiAgICB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzBdID0gayAqIHRoaXMuX2VzdGltYXRlZEdyYXZpdHlbMF0gKyAoMSAtIGspICogYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXTtcbiAgICB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzFdID0gayAqIHRoaXMuX2VzdGltYXRlZEdyYXZpdHlbMV0gKyAoMSAtIGspICogYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXTtcbiAgICB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzJdID0gayAqIHRoaXMuX2VzdGltYXRlZEdyYXZpdHlbMl0gKyAoMSAtIGspICogYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXTtcblxuICAgIGxldCBfZ1ggPSB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzBdO1xuICAgIGxldCBfZ1kgPSB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzFdO1xuICAgIGxldCBfZ1ogPSB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzJdO1xuXG4gICAgY29uc3Qgbm9ybSA9IE1hdGguc3FydChfZ1ggKiBfZ1ggKyBfZ1kgKiBfZ1kgKyBfZ1ogKiBfZ1opO1xuXG4gICAgX2dYIC89IG5vcm07XG4gICAgX2dZIC89IG5vcm07XG4gICAgX2daIC89IG5vcm07XG5cbiAgICAvLyBBZG9wdGluZyB0aGUgZm9sbG93aW5nIGNvbnZlbnRpb25zOlxuICAgIC8vIC0gZWFjaCBtYXRyaXggb3BlcmF0ZXMgYnkgcHJlLW11bHRpcGx5aW5nIGNvbHVtbiB2ZWN0b3JzLFxuICAgIC8vIC0gZWFjaCBtYXRyaXggcmVwcmVzZW50cyBhbiBhY3RpdmUgcm90YXRpb24sXG4gICAgLy8gLSBlYWNoIG1hdHJpeCByZXByZXNlbnRzIHRoZSBjb21wb3NpdGlvbiBvZiBpbnRyaW5zaWMgcm90YXRpb25zLFxuICAgIC8vIHRoZSByb3RhdGlvbiBtYXRyaXggcmVwcmVzZW50aW5nIHRoZSBjb21wb3NpdGlvbiBvZiBhIHJvdGF0aW9uXG4gICAgLy8gYWJvdXQgdGhlIHgtYXhpcyBieSBhbiBhbmdsZSBiZXRhIGFuZCBhIHJvdGF0aW9uIGFib3V0IHRoZSB5LWF4aXNcbiAgICAvLyBieSBhbiBhbmdsZSBnYW1tYSBpczpcbiAgICAvL1xuICAgIC8vIFsgY29zKGdhbW1hKSAgICAgICAgICAgICAgICwgIDAgICAgICAgICAgLCAgc2luKGdhbW1hKSAgICAgICAgICAgICAgLFxuICAgIC8vICAgc2luKGJldGEpICogc2luKGdhbW1hKSAgICwgIGNvcyhiZXRhKSAgLCAgLWNvcyhnYW1tYSkgKiBzaW4oYmV0YSkgLFxuICAgIC8vICAgLWNvcyhiZXRhKSAqIHNpbihnYW1tYSkgICwgIHNpbihiZXRhKSAgLCAgY29zKGJldGEpICogY29zKGdhbW1hKSAgXS5cbiAgICAvL1xuICAgIC8vIEhlbmNlLCB0aGUgcHJvamVjdGlvbiBvZiB0aGUgbm9ybWFsaXplZCBncmF2aXR5IGcgPSBbMCwgMCwgMV1cbiAgICAvLyBpbiB0aGUgZGV2aWNlJ3MgcmVmZXJlbmNlIGZyYW1lIGNvcnJlc3BvbmRzIHRvOlxuICAgIC8vXG4gICAgLy8gZ1ggPSAtY29zKGJldGEpICogc2luKGdhbW1hKSxcbiAgICAvLyBnWSA9IHNpbihiZXRhKSxcbiAgICAvLyBnWiA9IGNvcyhiZXRhKSAqIGNvcyhnYW1tYSksXG4gICAgLy9cbiAgICAvLyBzbyBiZXRhID0gYXNpbihnWSkgYW5kIGdhbW1hID0gYXRhbjIoLWdYLCBnWikuXG5cbiAgICAvLyBCZXRhICYgZ2FtbWEgZXF1YXRpb25zICh3ZSBhcHByb3hpbWF0ZSBbZ1gsIGdZLCBnWl0gYnkgW19nWCwgX2dZLCBfZ1pdKVxuICAgIGxldCBiZXRhID0gcmFkVG9EZWcoTWF0aC5hc2luKF9nWSkpOyAvLyBiZXRhIGlzIGluIFstcGkvMjsgcGkvMltcbiAgICBsZXQgZ2FtbWEgPSByYWRUb0RlZyhNYXRoLmF0YW4yKC1fZ1gsIF9nWikpOyAvLyBnYW1tYSBpcyBpbiBbLXBpOyBwaVtcblxuICAgIGlmIChhbHQpIHtcbiAgICAgIC8vIEluIHRoYXQgY2FzZSwgdGhlcmUgaXMgbm90aGluZyB0byBkbyBzaW5jZSB0aGUgY2FsY3VsYXRpb25zIGFib3ZlIGdhdmUgdGhlIGFuZ2xlIGluIHRoZSByaWdodCByYW5nZXNcbiAgICAgIGxldCBvdXRFdmVudCA9IHRoaXMub3JpZW50YXRpb25BbHQuZXZlbnQ7XG4gICAgICBvdXRFdmVudFswXSA9IG51bGw7XG4gICAgICBvdXRFdmVudFsxXSA9IGJldGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGdhbW1hO1xuXG4gICAgICB0aGlzLm9yaWVudGF0aW9uQWx0LmVtaXQob3V0RXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBIZXJlIHdlIGhhdmUgdG8gdW5pZnkgdGhlIGFuZ2xlcyB0byBnZXQgdGhlIHJhbmdlcyBjb21wbGlhbnQgd2l0aCB0aGUgVzNDIHNwZWNpZmljYXRpb25cbiAgICAgIGxldCBvdXRFdmVudCA9IHRoaXMub3JpZW50YXRpb24uZXZlbnQ7XG4gICAgICBvdXRFdmVudFswXSA9IG51bGw7XG4gICAgICBvdXRFdmVudFsxXSA9IGJldGE7XG4gICAgICBvdXRFdmVudFsyXSA9IGdhbW1hO1xuICAgICAgdW5pZnkob3V0RXZlbnQpO1xuICAgICAgXG4gICAgICB0aGlzLm9yaWVudGF0aW9uLmVtaXQob3V0RXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbmNyZWFzZXMgdGhlIG51bWJlciBvZiBsaXN0ZW5lcnMgdG8gdGhpcyBtb2R1bGUgKGVpdGhlciBiZWNhdXNlIHNvbWVvbmUgbGlzdGVuc1xuICAgKiB0byB0aGlzIG1vZHVsZSwgb3Igb25lIG9mIHRoZSB0d28gYERPTUV2ZW50U3VibW9kdWxlc2AgKGBPcmllbnRhdGlvbmAsXG4gICAqIGBPcmllbnRhdGlvbkFsdGApLlxuICAgKiBXaGVuIHRoZSBudW1iZXIgb2YgbGlzdGVuZXJzIHJlYWNoZXMgYDFgLCBhZGRzIGEgYCdkZXZpY2VvcmllbnRhdGlvbidgXG4gICAqIGV2ZW50IGxpc3RlbmVyLlxuICAgKlxuICAgKiBAc2VlIERldmljZU9yaWVudGF0aW9uTW9kdWxlI2FkZExpc3RlbmVyXG4gICAqIEBzZWUgRE9NRXZlbnRTdWJtb2R1bGUjc3RhcnRcbiAgICovXG4gIF9hZGRMaXN0ZW5lcigpIHtcbiAgICB0aGlzLl9udW1MaXN0ZW5lcnMrKztcblxuICAgIGlmICh0aGlzLl9udW1MaXN0ZW5lcnMgPT09IDEpXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCB0aGlzLl9kZXZpY2VvcmllbnRhdGlvbkxpc3RlbmVyLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogRGVjcmVhc2VzIHRoZSBudW1iZXIgb2YgbGlzdGVuZXJzIHRvIHRoaXMgbW9kdWxlIChlaXRoZXIgYmVjYXVzZSBzb21lb25lIHN0b3BzXG4gICAqIGxpc3RlbmluZyB0byB0aGlzIG1vZHVsZSwgb3Igb25lIG9mIHRoZSB0aHJlZSBgRE9NRXZlbnRTdWJtb2R1bGVzYFxuICAgKiAoYE9yaWVudGF0aW9uYCwgYE9yaWVudGF0aW9uQWx0YCkuXG4gICAqIFdoZW4gdGhlIG51bWJlciBvZiBsaXN0ZW5lcnMgcmVhY2hlcyBgMGAsIHJlbW92ZXMgdGhlIGAnZGV2aWNlb3JpZW50YXRpb24nYFxuICAgKiBldmVudCBsaXN0ZW5lci5cbiAgICpcbiAgICogQHNlZSBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZSNyZW1vdmVMaXN0ZW5lclxuICAgKiBAc2VlIERPTUV2ZW50U3VibW9kdWxlI3N0b3BcbiAgICovXG4gIF9yZW1vdmVMaXN0ZW5lcigpIHtcbiAgICB0aGlzLl9udW1MaXN0ZW5lcnMtLTtcblxuICAgIGlmICh0aGlzLl9udW1MaXN0ZW5lcnMgPT09IDApIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIHRoaXMuX2RldmljZW9yaWVudGF0aW9uTGlzdGVuZXIsIGZhbHNlKTtcbiAgICAgIHRoaXMub3JpZW50YXRpb24uX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlID0gbnVsbDsgLy8gZG9uJ3QgZm9yZ2V0IHRvIHJlc2V0IHRoZSBjb21wYXNzIHJlZmVyZW5jZSBzaW5jZSB0aGlzIHJlZmVyZW5jZSBpcyBzZXQgZWFjaCB0aW1lIHdlIHN0YXJ0IGxpc3RlbmluZyB0byBhIGAnZGV2aWNlb3JpZW50YXRpb24nYCBldmVudFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gc3VwZXIuaW5pdCgocmVzb2x2ZSkgPT4ge1xuICAgICAgdGhpcy5fcHJvbWlzZVJlc29sdmUgPSByZXNvbHZlO1xuXG4gICAgICBpZiAod2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQpXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIHRoaXMuX2RldmljZW9yaWVudGF0aW9uQ2hlY2ssIGZhbHNlKTtcbiAgICAgIGVsc2UgaWYgKHRoaXMucmVxdWlyZWQub3JpZW50YXRpb24pXG4gICAgICAgIHRoaXMuX3RyeUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlGYWxsYmFjaygpO1xuICAgICAgZWxzZVxuICAgICAgICByZXNvbHZlKHRoaXMpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBsaXN0ZW5lciB0byB0aGlzIG1vZHVsZS5cbiAgICogXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIC0gTGlzdGVuZXIgdG8gYWRkLlxuICAgKi9cbiAgYWRkTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICBzdXBlci5hZGRMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgdGhpcy5fYWRkTGlzdGVuZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSB0aGlzIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgLSBMaXN0ZW5lciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIHN1cGVyLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcigpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IERldmljZU9yaWVudGF0aW9uTW9kdWxlKCk7Il19