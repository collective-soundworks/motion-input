// port of orientation.cpp Max object
import { BaseLfo } from 'waves-lfo/core';


const abs = Math.abs;
const atan2 = Math.atan2;
const cos = Math.cos;
const sin = Math.sin;
const sqrt = Math.sqrt;
const pow = Math.pow;
const tan = Math.tan;

const toDeg = 180 / Math.PI;
const toRad = Math.PI / 180;

function normalize(v) {
  const mag = sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
  v[0] /= mag;
  v[1] /= mag;
  v[2] /= mag;

  return v;
}

const parameters = {
  k: {
    type: 'float',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.98,
  },
};

class OrientationFilter extends BaseLfo {
  constructor(options) {
    super(parameters, options);
  }

  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    this.streamParams.frameSize = 3;

    this.init = false;
    this.lastTime = 0;
    this.interval = 0;
    // this.k = 0.9;

    // normalized acceleration vector
    // coordinates are flipped to match R-ioT coords system
    this.accVector = new Float32Array(3);
    // normalize gyro order and direction according to R-ioT
    this.gyroVector = new Float32Array(3); // third component (yaw) will never be used
    // same as before as a projection vector
    this.gyroEstimate = new Float32Array(3);
    // filtered vector
    this.accEstimate = new Float32Array(3);


    this.propagateStreamParams();
  }

  processVector(frame) {
    const time = frame.time;
    const input = frame.data;
    const output = this.frame.data;
    const accEstimate = this.accEstimate;
    const gyroEstimate = this.gyroEstimate;

    const k = this.params.get('k');

    /**
     * Reorder accelerometer and gyro to follow R-ioT coordinate system or
     * gyro directions
     */
    const accVector = this.accVector;
    const accOffset = 3;
    accVector[0] = -1 * input[0 + accOffset];
    accVector[1] =  1 * input[1 + accOffset];
    accVector[2] = -1 * input[2 + accOffset];

    const gyroVector = this.gyroVector;
    gyroVector[0] = -1 * input[2];
    gyroVector[1] = -1 * input[1];
    gyroVector[2] = -1 * input[0];

    normalize(accVector);

    if (!this.lastTime) {
      this.lastTime = time;
      // initialize corrected orientation with normalized accelerometer data
      for (let i = 0; i < 3; i++) {
        // riot axis are inverted according to the phone axis
        accEstimate[i] = accVector[i];
      }

      return;
    }

    // define if we use that or use the logical `MotionEvent.interval`
    // be consistent with `ComplementaryFilter` that uses `interval`
    const dt = time - this.lastTime;
    this.lastTime = time;

    let pitchAngle = 0;
    let rollAngle = 0;

    // as accEstimate is a normalized vector maybe this could be variable
    // @todo - no idea what's going on here...
    if (abs(accEstimate[2]) < 0.1) {
      for (let i = 0; i < 3; i++)
        gyroEstimate[i] = accEstimate[i];
    } else {
      // integrate angle from gyro current values and last result
      const rollDelta = gyroVector[0] * dt * toRad;
      rollAngle = atan2(accEstimate[0], accEstimate[2]) + rollDelta;

      const pitchDelta = gyroVector[1] * dt * toRad;
      pitchAngle = atan2(accEstimate[1], accEstimate[2]) + pitchDelta;

      // // calculate projection vector from angleEstimates
      gyroEstimate[0] = sin(rollAngle);
      gyroEstimate[0] /= sqrt(1 + pow(cos(rollAngle), 2) * pow(tan(pitchAngle), 2));

      gyroEstimate[1] = sin(pitchAngle);
      gyroEstimate[1] /= sqrt(1 + pow(cos(pitchAngle), 2) * pow(tan(rollAngle), 2));

      // // estimate sign of RzGyro by looking in what qudrant the angle Axz is,
      // // RzGyro is positive if  Axz in range -90 ..90 => cos(Awz) >= 0
      const signYaw = cos(rollAngle) >= 0 ? 1 : -1;
      // estimate yaw since vector is normalized
      gyroEstimate[2] = signYaw * sqrt(1 - pow(gyroEstimate[0], 2) - pow(gyroEstimate[1], 2));
    }

    // interpolate between estimated values and raw values
    for (let i = 0; i < 3; i++)
      accEstimate[i] = gyroEstimate[i] * k + accVector[i] * (1 - k);

    normalize(accEstimate);

    output[0] = accEstimate[0];
    output[1] = accEstimate[1];
    output[2] = accEstimate[2];
  }
}

export default OrientationFilter;
