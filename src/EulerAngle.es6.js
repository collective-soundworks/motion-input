'use strict';

function degToRad(deg) {
  return deg * Math.PI / 180;
}

function radToDeg(rad) {
  return rad * 180 / Math.PI;
}

class EulerAngle {
  constructor(alpha, beta, gamma) {
    const _alpha = (typeof alpha === 'number' ? alpha : 0);
    const _beta = (typeof beta === 'number' ? beta : 0);
    const _gamma = (typeof gamma === 'number' ? gamma : 0);

    this.values = [_alpha, _beta, _gamma];
  }

  setFromRotationMatrix(matrix) {
    const m = matrix.values;
    let alpha, beta, gamma;

    /**
     * Cf. W3C specification (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
     * and Euler angles Wikipedia page (http://en.wikipedia.org/wiki/Euler_angles).
     *
     * W3C convention: Tait–Bryan angles Z-X'-Y'', where
     *   alpha is in [0; 360[
     *   beta is in [-180; 180[
     *   gamma is in [-90; 90[
     */

    /** 
     * In the comments that follow, we use this notation:
     *   cA = cos(alpha)
     *   cB = cos(beta)
     *   cG = cos(gamma)
     *   sA = sin(alpha)
     *   sB = sin(beta)
     *   sG = sin(gamma)
     */

    /**
     * The rotation matrix associated with the rotations Z-X'-Y'' is:
     *   m[0] = cA * cG - sA * sB * sG
     *   m[1] = -cB * sA
     *   m[2] = cA * sG + cG * sA * sB
     *   m[3] = cG * sA + cA * sB * sG
     *   m[4] = cA * cB
     *   m[5] = sA * sG - cA * cG * sB
     *   m[6] = -cB * sG
     *   m[7] = sB
     *   m[8] = cB * cG
     */

    // Since gamma is in [-90; 90[, cG >= 0.
    //
    // Case 1: m[8] > 0 <=> cB > 0                (and cG != 0)
    //                  <=> beta in ]-pi/2; pi/2[ (and cG != 0)
    if (m[8] > 0) {
      alpha = Math.atan2(-m[1], m[4]);
      beta = Math.asin(m[7]); // asin returns a number between -pi/2 and pi/2
      gamma = Math.atan2(-m[6], m[8]);
    }
    // Case 2: m[8] < 0 <=> cB < 0                            (and cG != 0)
    //                  <=> beta in [-pi; -pi/2[ U ]pi/2; pi] (and cG != 0)
    else if (m[8] < 0) {
      // Since cB < 0 and cB is in m[1] and m[4], the point is flipped by 180 degrees.
      // Hence, we have to multiply both arguments of atan2 by -1 in order
      // to revert the point in its original position (=> another flip by 180 degrees).
      alpha = Math.atan2(m[1], -m[4]);
      beta = -Math.asin(m[7]); // asin returns a number between -pi/2 and pi/2
      beta += (beta >= 0) ? -Math.PI : Math.PI; // beta in [-pi; -pi/2[ U ]pi/2; pi]
      gamma = Math.atan2(m[6], -m[8]); // same remark as for alpha
    }
    // Case 3: m[8] = 0 <=> cB = 0 or cG = 0 
    else {
      // Subcase 1: cG = 0 and cB > 0
      //            cG = 0 <=> sG = -1 <=> gamma = -pi/2 => m[6] = cB
      //            Hence, m[6] > 0 <=> cB > 0 <=> beta in ]-pi/2; pi/2[
      if (m[6] > 0) {
        alpha = Math.atan2(-m[1], m[4]);
        beta = Math.asin(m[7]); // asin returns a number between -pi/2 and pi/2
        gamma = -Math.PI / 2;
      }
      // Subcase 2: cG = 0 and cB < 0
      //            cG = 0 <=> sG = -1 <=> gamma = -pi/2 => m[6] = cB
      //            Hence, m[6] < 0 <=> cB < 0 <=> beta in [-pi; -pi/2[ U ]pi/2; pi]
      else if (m[6] < 0) {
        alpha = Math.atan2(m[1], -m[4]); // same remark as for alpha in a case above
        beta = -Math.asin(m[7]); // asin returns a number between -pi/2 and pi/2
        beta += (beta >= 0) ? -Math.PI : Math.PI; // beta in [-pi; -pi/2[ U ]pi/2; pi]
        gamma = -Math.PI / 2;
      }
      // Subcase 3: cB = 0
      // In the case where cos(beta) = 0 (i.e. beta = -pi/2 or beta = pi/2),
      // we have the gimbal lock problem: in that configuration, only the angle
      // alpha + gamma (if beta = pi/2) or alpha - gamma (if beta = -pi/2)
      // are uniquely defined: alpha and gamma can take an infinity of values.
      // For convenience, let's set gamma = 0 (and thus sin(gamma) = 0).
      // (As a consequence of the gimbal lock problem, there is a discontinuity
      // in alpha and gamma.)
      else {
        alpha = Math.atan2(m[3], m[0]);
        beta = (m[7] > 0) ? Math.PI / 2 : -Math.PI / 2;
        gamma = 0;
      }
    }

    // atan2 returns a number between -pi and pi
    // => make sure alpha is in [0, 2*pi[.
    if (alpha < 0)
      alpha += 2 * Math.PI;

    this.values = [radToDeg(alpha), radToDeg(beta), radToDeg(gamma)];
  }
}

module.exports = EulerAngle;