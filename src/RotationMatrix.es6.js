'use strict';

function degToRad(deg) {
  return deg * Math.PI / 180;
}

function normalize(m) {
  const det = m[0] * m[4] * m[8] + m[1] * m[5] * m[6] + m[2] * m[3] * m[7] - m[0] * m[5] * m[7] - m[1] * m[3] * m[8] - m[2] * m[4] * m[6];

  for (let i = 0; i < m.length; i++)
    m[i] /= det;

  return m;
}

class RotationMatrix {
  constructor(values = [1, 0, 0, 0, 1, 0, 0, 0, 1]) {
    this.values = values;
  }

  setFromEulerAngles(euler) {
    const a = degToRad(euler.values[0]);
    const b = degToRad(euler.values[1]);
    const g = degToRad(euler.values[2]);

    const cA = Math.cos(a);
    const cB = Math.cos(b);
    const cG = Math.cos(g);
    const sA = Math.sin(a);
    const sB = Math.sin(b);
    const sG = Math.sin(g);

    // Tait–Bryan angles Z-X'-Y''
    // Cf. W3C specification (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
    // and Euler angles Wikipedia page (http://en.wikipedia.org/wiki/Euler_angles).
    let m = [
      cA * cG - sA * sB * sG, -cB * sA,
      cA * sG + cG * sA * sB,
      cG * sA + cA * sB * sG,
      cA * cB,
      sA * sG - cA * cG * sB, -cB * sG,
      sB,
      cB * cG
    ];

    this.values = normalize(m);
  }
}

module.exports = RotationMatrix;