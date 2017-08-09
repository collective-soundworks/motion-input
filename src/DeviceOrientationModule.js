import DOMEventSubmodule from './DOMEventSubmodule';
import InputModule from './InputModule';
import MotionInput from './MotionInput';
import platform from 'platform';

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
  const det = m[0] * m[4] * m[8] + m[1] * m[5] * m[6] + m[2] * m[3] * m[7] - m[0] * m[5] * m[7] - m[1] * m[3] * m[8] - m[2] * m[4] * m[6];

  for (let i = 0; i < m.length; i++)
    m[i] /= det;

  return m;
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

  const alphaIsValid = (typeof eulerAngle[0] === 'number');

  const _alpha = (alphaIsValid ? degToRad(eulerAngle[0]) : 0);
  const _beta = degToRad(eulerAngle[1]);
  const _gamma = degToRad(eulerAngle[2]);

  const cA = Math.cos(_alpha);
  const cB = Math.cos(_beta);
  const cG = Math.cos(_gamma);
  const sA = Math.sin(_alpha);
  const sB = Math.sin(_beta);
  const sG = Math.sin(_gamma);

  let alpha, beta, gamma;

  let m = [
    cA * cG - sA * sB * sG,
    -cB * sA,
    cA * sG + cG * sA * sB,
    cG * sA + cA * sB * sG,
    cA * cB,
    sA * sG - cA * cG * sB,
    -cB * sG,
    sB,
    cB * cG
  ];
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
    beta += (beta >= 0) ? -Math.PI : Math.PI; // asin returns a number between -pi/2 and pi/2 => make sure beta in [-pi; -pi/2[ U ]+pi/2; +pi]
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
      beta += (beta >= 0) ? -Math.PI : Math.PI; // asin returns a number between -pi/2 and +pi/2 => make sure beta in [-pi; -pi/2[ U ]+pi/2; +pi]
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
      beta = (m[7] > 0) ? Math.PI / 2 : -Math.PI / 2;
      gamma = 0;
    }
  }

  // atan2 returns a number between -pi and pi => make sure that alpha is in [0, 2*pi[.
  alpha += (alpha < 0) ? 2 * Math.PI : 0;

  eulerAngle[0] = (alphaIsValid ? radToDeg(alpha) : null);
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

  const alphaIsValid = (typeof eulerAngle[0] === 'number');

  const _alpha = (alphaIsValid ? degToRad(eulerAngle[0]) : 0);
  const _beta = degToRad(eulerAngle[1]);
  const _gamma = degToRad(eulerAngle[2]);

  const cA = Math.cos(_alpha);
  const cB = Math.cos(_beta);
  const cG = Math.cos(_gamma);
  const sA = Math.sin(_alpha);
  const sB = Math.sin(_beta);
  const sG = Math.sin(_gamma);

  let alpha, beta, gamma;

  let m = [
    cA * cG - sA * sB * sG,
    -cB * sA,
    cA * sG + cG * sA * sB,
    cG * sA + cA * sB * sG,
    cA * cB,
    sA * sG - cA * cG * sB,
    -cB * sG,
    sB,
    cB * cG
  ];
  normalize(m);

  alpha = Math.atan2(-m[1], m[4]);
  alpha += (alpha < 0) ? 2 * Math.PI : 0; // atan2 returns a number between -pi and +pi => make sure alpha is in [0, 2*pi[.
  beta = Math.asin(m[7]); // asin returns a number between -pi/2 and pi/2 => OK
  gamma = Math.atan2(-m[6], m[8]); // atan2 returns a number between -pi and +pi => OK

  eulerAngle[0] = (alphaIsValid ? radToDeg(alpha) : null);
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
class DeviceOrientationModule extends InputModule {

  /**
   * Creates the `DeviceOrientation` module instance.
   *
   * @constructor
   */
  constructor() {
    super('deviceorientation');

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

    this._processFunction = null;
    this._process = this._process.bind(this);
    this._deviceorientationCheck = this._deviceorientationCheck.bind(this);
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
  _deviceorientationCheck(e) {
    // clear timeout (anti-Firefox bug solution, window event deviceorientation being nver called)
    // set the set timeout in init() function
    clearTimeout(this._checkTimeoutId);

    this.isProvided = true;

    // Sensor availability for the orientation and alternative orientation
    const rawValuesProvided = ((typeof e.alpha === 'number') && (typeof e.beta === 'number') && (typeof e.gamma === 'number'));
    this.orientation.isProvided = rawValuesProvided;
    this.orientationAlt.isProvided = rawValuesProvided;

    // TODO(?): get pseudo-period

    // swap the process function to the
    this._processFunction = this._deviceorientationListener;

    // If orientation or alternative orientation are not provided by raw sensors but required,
    // try to calculate them with `accelerationIncludingGravity` unified values
    if ((this.required.orientation && !this.orientation.isProvided) || (this.required.orientationAlt && !this.orientationAlt.isProvided))
      this._tryAccelerationIncludingGravityFallback();
    else
      this._promiseResolve(this);
  }

  /**
   * `'deviceorientation'` event callback.
   * This method emits an event with the raw `'deviceorientation'` values,
   * and emits events with the unified `orientation` and / or the
   * `orientationAlt` values if they are required.
   *
   * @param {DeviceOrientationEvent} e - `'deviceorientation'` event the values are calculated from.
   */
  _deviceorientationListener(e) {
    // 'deviceorientation' event (raw values)
    let outEvent = this.event;

    outEvent[0] = e.alpha;
    outEvent[1] = e.beta;
    outEvent[2] = e.gamma;

    if (this.listeners.size > 0)
      this.emit(outEvent);

    // 'orientation' event (unified values)
    if (this.orientation.listeners.size > 0 &&
        this.required.orientation &&
        this.orientation.isProvided
    ) {
      // On iOS, the `alpha` value is initialized at `0` on the first `deviceorientation` event
      // so we keep that reference in memory to calculate the North later on
      if (!this.orientation._webkitCompassHeadingReference && e.webkitCompassHeading && platform.os.family === 'iOS')
        this.orientation._webkitCompassHeadingReference = e.webkitCompassHeading;

      let outEvent = this.orientation.event;

      outEvent[0] = e.alpha;
      outEvent[1] = e.beta;
      outEvent[2] = e.gamma;

      // On iOS, replace the `alpha` value by the North value and unify the angles
      // (the default representation of the angles on iOS is not compliant with the W3C specification)
      if (this.orientation._webkitCompassHeadingReference && platform.os.family === 'iOS') {
        outEvent[0] += 360 - this.orientation._webkitCompassHeadingReference;
        unify(outEvent);
      }

      this.orientation.emit(outEvent);
    }

    // 'orientationAlt' event
    if (this.orientationAlt.listeners.size > 0 &&
        this.required.orientationAlt &&
        this.orientationAlt.isProvided
    ) {
      // On iOS, the `alpha` value is initialized at `0` on the first `deviceorientation` event
      // so we keep that reference in memory to calculate the North later on
      if (!this.orientationAlt._webkitCompassHeadingReference && e.webkitCompassHeading && platform.os.family === 'iOS')
        this.orientationAlt._webkitCompassHeadingReference = e.webkitCompassHeading;

      let outEvent = this.orientationAlt.event;

      outEvent[0] = e.alpha;
      outEvent[1] = e.beta;
      outEvent[2] = e.gamma;

      // On iOS, replace the `alpha` value by the North value but do not convert the angles
      // (the default representation of the angles on iOS is compliant with the alternative representation)
      if (this.orientationAlt._webkitCompassHeadingReference && platform.os.family === 'iOS'){
        outEvent[0] -= this.orientationAlt._webkitCompassHeadingReference;
        outEvent[0] += (outEvent[0] < 0) ? 360 : 0; // make sure `alpha` is in [0, +360[
      }

      // On Android, transform the angles to the alternative representation
      // (the default representation of the angles on Android is compliant with the W3C specification)
      if (platform.os.family === 'Android')
        unifyAlt(outEvent);

      this.orientationAlt.emit(outEvent);
    }
  }

  /**
   * Checks whether `beta` and `gamma` can be calculated from the `accelerationIncludingGravity` values or not.
   */
  _tryAccelerationIncludingGravityFallback() {
    MotionInput.requireModule('accelerationIncludingGravity')
      .then((accelerationIncludingGravity) => {
        if (accelerationIncludingGravity.isValid) {
          console.log("WARNING (motion-input): The 'deviceorientation' event does not exist or does not provide values in your browser, so the orientation of the device is estimated from DeviceMotion's 'accelerationIncludingGravity' event. Since the compass is not available, only the `beta` and `gamma` angles are provided (`alpha` is null).");

          if (this.required.orientation) {
            this.orientation.isCalculated = true;
            this.orientation.period = accelerationIncludingGravity.period;

            MotionInput.addListener('accelerationIncludingGravity', (accelerationIncludingGravity) => {
              this._calculateBetaAndGammaFromAccelerationIncludingGravity(accelerationIncludingGravity);
            });
          }

          if (this.required.orientationAlt) {
            this.orientationAlt.isCalculated = true;
            this.orientationAlt.period = accelerationIncludingGravity.period;

            MotionInput.addListener('accelerationIncludingGravity', (accelerationIncludingGravity) => {
              this._calculateBetaAndGammaFromAccelerationIncludingGravity(accelerationIncludingGravity, true);
            });
          }
        }

        this._promiseResolve(this);
      });
  }

  /**
   * Calculates and emits `beta` and `gamma` values as a fallback of the `orientation` and / or `orientationAlt` events, from the `accelerationIncludingGravity` unified values.
   *
   * @param {number[]} accelerationIncludingGravity - Latest `accelerationIncludingGravity raw values.
   * @param {bool} [alt=false] - Indicates whether we need the alternate representation of the angles or not.
   */
  _calculateBetaAndGammaFromAccelerationIncludingGravity(accelerationIncludingGravity, alt = false) {
    const k = 0.8;

    // Low pass filter to estimate the gravity
    this._estimatedGravity[0] = k * this._estimatedGravity[0] + (1 - k) * accelerationIncludingGravity[0];
    this._estimatedGravity[1] = k * this._estimatedGravity[1] + (1 - k) * accelerationIncludingGravity[1];
    this._estimatedGravity[2] = k * this._estimatedGravity[2] + (1 - k) * accelerationIncludingGravity[2];

    let _gX = this._estimatedGravity[0];
    let _gY = this._estimatedGravity[1];
    let _gZ = this._estimatedGravity[2];

    const norm = Math.sqrt(_gX * _gX + _gY * _gY + _gZ * _gZ);

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
    let beta = radToDeg(Math.asin(_gY)); // beta is in [-pi/2; pi/2[
    let gamma = radToDeg(Math.atan2(-_gX, _gZ)); // gamma is in [-pi; pi[

    if (alt) {
      // In that case, there is nothing to do since the calculations above gave the angle in the right ranges
      let outEvent = this.orientationAlt.event;
      outEvent[0] = null;
      outEvent[1] = beta;
      outEvent[2] = gamma;

      this.orientationAlt.emit(outEvent);
    } else {
      // Here we have to unify the angles to get the ranges compliant with the W3C specification
      let outEvent = this.orientation.event;
      outEvent[0] = null;
      outEvent[1] = beta;
      outEvent[2] = gamma;
      unify(outEvent);

      this.orientation.emit(outEvent);
    }
  }

  _process(data) {
    this._processFunction(data);
  }

  /**
   * Initializes of the module.
   *
   * @return {Promise}
   */
  init() {
    return super.init((resolve) => {
      this._promiseResolve = resolve;

      if (window.DeviceOrientationEvent) {
        this._processFunction = this._deviceorientationCheck;
        window.addEventListener('deviceorientation', this._process, false);
        // set fallback timeout for Firefox (its window never calling the DeviceOrientation event, a 
        // require of the DeviceOrientation service will result in the require promise never being resolved
        // hence the Experiment start() method never called)
        this._checkTimeoutId = setTimeout(() => resolve(this), 500);
      } else if (this.required.orientation) {
        this._tryAccelerationIncludingGravityFallback();
      } else {
        resolve(this);
      }
    });
  }
}

export default new DeviceOrientationModule();
