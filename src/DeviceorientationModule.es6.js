'use strict';

const DOMEventSubmodule = require('./DOMEventSubmodule');
const InputModule = require('./InputModule');
const MotionInput = require('./MotionInput');
const platform = require('platform');

function degToRad(deg) {
  return deg * Math.PI / 180;
}

function radToDeg(rad) {
  return rad * 180 / Math.PI;
}

function normalize(m) {
  const det = m[0] * m[4] * m[8] + m[1] * m[5] * m[6] + m[2] * m[3] * m[7] - m[0] * m[5] * m[7] - m[1] * m[3] * m[8] - m[2] * m[4] * m[6];

  for (let i = 0; i < m.length; i++)
    m[i] /= det;

  return m;
}

function unify(eulerAngle) {
  /**
   * Cf. W3C specification (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
   * and Euler angles Wikipedia page (http://en.wikipedia.org/wiki/Euler_angles).
   *
   * W3C convention: Tait–Bryan angles Z-X'-Y'', where
   *   alpha is in [0; 360[
   *   beta is in [-180; 180[
   *   gamma is in [-90; 90[
   */

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

  // Since we want gamma in [-90; 90[, cG >= 0.
  if (m[8] > 0) {
    // Case 1: m[8] > 0 <=> cB > 0                (and cG != 0)
    //                  <=> beta in ]-pi/2; pi/2[ (and cG != 0)
    alpha = Math.atan2(-m[1], m[4]);
    beta = Math.asin(m[7]); // asin returns a number between -pi/2 and pi/2
    gamma = Math.atan2(-m[6], m[8]);
  } else if (m[8] < 0) {
    // Case 2: m[8] < 0 <=> cB < 0                            (and cG != 0)
    //                  <=> beta in [-pi; -pi/2[ U ]pi/2; pi] (and cG != 0)

    // Since cB < 0 and cB is in m[1] and m[4], the point is flipped by 180 degrees.
    // Hence, we have to multiply both arguments of atan2 by -1 in order to revert
    // the point in its original position (=> another flip by 180 degrees).
    alpha = Math.atan2(m[1], -m[4]);
    beta = -Math.asin(m[7]); // asin returns a number between -pi/2 and pi/2
    beta += (beta >= 0) ? -Math.PI : Math.PI; // beta in [-pi; -pi/2[ U ]pi/2; pi]
    gamma = Math.atan2(m[6], -m[8]); // same remark as for alpha
  } else {
    // Case 3: m[8] = 0 <=> cB = 0 or cG = 0
    if (m[6] > 0) {
      // Subcase 1: cG = 0 and cB > 0
      //            cG = 0 <=> sG = -1 <=> gamma = -pi/2 => m[6] = cB
      //            Hence, m[6] > 0 <=> cB > 0 <=> beta in ]-pi/2; pi/2[
      alpha = Math.atan2(-m[1], m[4]);
      beta = Math.asin(m[7]); // asin returns a number between -pi/2 and pi/2
      gamma = -Math.PI / 2;
    } else if (m[6] < 0) {
      // Subcase 2: cG = 0 and cB < 0
      //            cG = 0 <=> sG = -1 <=> gamma = -pi/2 => m[6] = cB
      //            Hence, m[6] < 0 <=> cB < 0 <=> beta in [-pi; -pi/2[ U ]pi/2; pi]
      alpha = Math.atan2(m[1], -m[4]); // same remark as for alpha in a case above
      beta = -Math.asin(m[7]); // asin returns a number between -pi/2 and pi/2
      beta += (beta >= 0) ? -Math.PI : Math.PI; // beta in [-pi; -pi/2[ U ]pi/2; pi]
      gamma = -Math.PI / 2;
    } else {
      // Subcase 3: cB = 0
      // In the case where cos(beta) = 0 (i.e. beta = -pi/2 or beta = pi/2),
      // we have the gimbal lock problem: in that configuration, only the angle
      // alpha + gamma (if beta = pi/2) or alpha - gamma (if beta = -pi/2)
      // are uniquely defined: alpha and gamma can take an infinity of values.
      // For convenience, let's set gamma = 0 (and thus sin(gamma) = 0).
      // (As a consequence of the gimbal lock problem, there is a discontinuity
      // in alpha and gamma.)
      alpha = Math.atan2(m[3], m[0]);
      beta = (m[7] > 0) ? Math.PI / 2 : -Math.PI / 2;
      gamma = 0;
    }
  }

  // atan2 returns a number between -pi and pi
  // so we make sure that alpha is in [0, 2*pi[.
  alpha += (alpha < 0) ? 2 * Math.PI : 0;

  eulerAngle[0] = (alphaIsValid ? radToDeg(alpha) : null);
  eulerAngle[1] = radToDeg(beta);
  eulerAngle[2] = radToDeg(gamma);
}

function unifyAlt(eulerAngle) {
  /**
   * Convention here: Tait–Bryan angles Z-X'-Y'', where
   *   alpha is in [0; 360[
   *   beta is in [-90; 90[
   *   gamma is in [-180; 180[
   */

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
  beta = Math.asin(m[7]); // asin returns a number between -pi/2 and pi/2
  gamma = Math.atan2(-m[6], m[8]);

  // atan2 returns a number between -pi and pi
  // so we make sure that alpha is in [0, 2*pi[.
  alpha += (alpha < 0) ? 2 * Math.PI : 0;

  eulerAngle[0] = (alphaIsValid ? radToDeg(alpha) : null);
  eulerAngle[1] = radToDeg(beta);
  eulerAngle[2] = radToDeg(gamma);
}

class DeviceorientationModule extends InputModule {
  constructor() {
    super('deviceorientation');

    this.event = [null, null, null];

    this.orientation = new DOMEventSubmodule(this, 'orientation');
    this.orientation._webkitCompassHeadingReference = null;
    this.orientationAlt = new DOMEventSubmodule(this, 'orientationAlt');
    this.orientation._webkitCompassHeadingReference = null;

    this.required = {
      orientation: false,
      orientationAlt: false
    };

    this._deviceorientationCheck = this._deviceorientationCheck.bind(this);
    this._deviceorientationListener = this._deviceorientationListener.bind(this);

    this._numListeners = 0;
    this._promiseResolve = null;

    this._estimatedGravity = [0, 0, 0];
  }

  _deviceorientationCheck(e) {
    this.isProvided = true;

    const rawValuesProvided = ((typeof e.alpha === 'number') && (typeof e.beta === 'number') && (typeof e.gamma === 'number'));

    this.orientation.isProvided = rawValuesProvided;
    this.orientationAlt.isProvided = rawValuesProvided;

    // TODO(?): get pseudo-period

    window.removeEventListener('deviceorientation', this._deviceorientationCheck, false);

    if ((this.required.orientation && !this.orientation.isProvided) || (this.required.orientationAlt && !this.orientationAlt.isProvided))
      this._tryAccelerationIncludingGravityFallback();
    else
      this._promiseResolve(this);
  }

  _deviceorientationListener(e) {
    // 'deviceorientation' event (raw values)
    let outEvent = this.event;

    outEvent[0] = e.alpha;
    outEvent[1] = e.beta;
    outEvent[2] = e.gamma;

    this.emit(outEvent);

    // 'orientation' event
    if (this.required.orientation && this.orientation.isProvided) {
      if (!this.orientation._webkitCompassHeadingReference && e.webkitCompassHeading && platform.os.family === 'iOS')
        this.orientation._webkitCompassHeadingReference = e.webkitCompassHeading;

      let outEvent = this.orientation.event;

      outEvent[0] = e.alpha;
      outEvent[1] = e.beta;
      outEvent[2] = e.gamma;

      if (this.orientation._webkitCompassHeadingReference && platform.os.family === 'iOS') {
        outEvent[0] += 360 - this.orientation._webkitCompassHeadingReference;
        unify(outEvent);
      }

      this.orientation.emit(outEvent);
    }

    // 'orientationAlt' event
    if (this.required.orientationAlt && this.orientationAlt.isProvided) {
      if (!this.orientationAlt._webkitCompassHeadingReference && e.webkitCompassHeading && platform.os.family === 'iOS')
        this.orientationAlt._webkitCompassHeadingReference = e.webkitCompassHeading;

      let outEvent = this.orientationAlt.event;

      outEvent[0] = e.alpha;
      outEvent[1] = e.beta;
      outEvent[2] = e.gamma;

      if (this.orientationAlt._webkitCompassHeadingReference && platform.os.family === 'iOS'){
        outEvent[0] -= this.orientationAlt._webkitCompassHeadingReference;
        outEvent[0] += (outEvent[0] < 0) ? 360 : 0;
      }

      if (platform.os.family === 'Android')
        unifyAlt(outEvent);

      this.orientationAlt.emit(outEvent);
    }
  }

  _tryAccelerationIncludingGravityFallback() {
    MotionInput.requireModule('accelerationIncludingGravity')
      .then((accelerationIncludingGravity) => {
        if (accelerationIncludingGravity.isValid) {
          console.log("WARNING (motion-input): The 'deviceorientation' event does not exist (or does not provide values) in your browser, so the orientation of the device is estimated from DeviceMotion's 'accelerationIncludingGravity' event. Since the compass is not available, only the beta and gamma angles are provided (alpha is null).");

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

    /**
     * Adopting the following conventions:
     * - each matrix operates by pre-multiplying column vectors,
     * - each matrix represents an active rotation,
     * - each matrix represents the composition of intrinsic rotations,
     * the rotation matrix representing the composition of a rotation
     * about the x-axis by an angle beta and a rotation about the y-axis
     * by an angle gamma is:
     *
     * [ cos(gamma)               ,  0          ,  sin(gamma)              ,
     *   sin(beta) * sin(gamma)   ,  cos(beta)  ,  -cos(gamma) * sin(beta) ,
     *   -cos(beta) * sin(gamma)  ,  sin(beta)  ,  cos(beta) * cos(gamma)  ].
     *
     * Hence, the projection of the normalized gravity g = [0, 0, 1]
     * in the device's reference frame corresponds to:
     *
     * gX = -cos(beta) * sin(gamma),
     * gY = sin(beta),
     * gZ = cos(beta) * cos(gamma),
     *
     * so beta = asin(gY) and gamma = atan2(-gX, gZ).
     */

    // Beta & gamma equations (we approximate [gX, gY, gZ] by [_gX, _gY, _gZ])
    let beta = radToDeg(Math.asin(_gY)); // beta is in [-pi/2; pi/2[
    let gamma = radToDeg(Math.atan2(-_gX, _gZ)); // gamma is in [-pi; pi[

    if (alt) {
      let outEvent = this.orientationAlt.event;
      outEvent[0] = null;
      outEvent[1] = beta;
      outEvent[2] = gamma;

      this.orientationAlt.emit(outEvent);
    } else {
      let outEvent = this.orientation.event;
      outEvent[0] = null;
      outEvent[1] = beta;
      outEvent[2] = gamma;
      unify(outEvent);
      
      this.orientation.emit(outEvent);
    }

  }

  _addListener() {
    this._numListeners++;

    if (this._numListeners === 1)
      window.addEventListener('deviceorientation', this._deviceorientationListener, false);
  }

  _removeListener() {
    this._numListeners--;

    if (this._numListeners === 0) {
      window.removeEventListener('deviceorientation', this._deviceorientationListener, false);
      this.orientation._webkitCompassHeadingReference = null; // don't forget to reset the compass reference
    }
  }

  init() {
    return super.init((resolve) => {
      this._promiseResolve = resolve;

      if (window.DeviceOrientationEvent)
        window.addEventListener('deviceorientation', this._deviceorientationCheck, false);
      else if (this.required.orientation)
        this._tryAccelerationIncludingGravityFallback();
      else
        resolve(this);
    });
  }

  addListener(listener) {
    super.addListener(listener);
    this._addListener();
  }

  removeListener(listener) {
    super.removeListener(listener);
    this._removeListener();
  }
}

module.exports = new DeviceorientationModule();