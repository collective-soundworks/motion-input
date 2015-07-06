'use strict';

const InputModule = require('./InputModule');
const MotionInput = require('./MotionInput');

class EnergyModule extends InputModule {
  constructor() {
    super();

    this.event = 0;

    this._accelerationModule = null;
    this._accelerationValues = null;
    this._accelerationMagnitudeThreshold = 9.81;
    this._accelerationMagnitudeThresholdMax = 20;
    
    this._rotationRateModule = null;
    this._rotationRateValues = null;
    this._rotationRateMagnitudeThreshold = 200;
    this._rotationRateMagnitudeThresholdMax = 600;

    this._energyTimeConstant = 0.100;

    this._onAcceleration = this._onAcceleration.bind(this);
    this._onRotationRate = this._onRotationRate.bind(this);
  }

  get _energyDecay() {
    return Math.exp(-2 * Math.PI * this.period / this._energyTimeConstant);
  }

  init() {
    return super.init((resolve) => {
      Promise.all([MotionInput.requireModule('acceleration'), MotionInput.requireModule('rotationRate')])
        .then((modules) => {
          const [acceleration, rotationRate] = modules;

          this._accelerationModule = acceleration;
          this._rotationRateModule = rotationRate;
          this.isCalculated = this._accelerationModule.isValid || this._rotationRateModule.isValid;

          if (this._accelerationModule.isValid)
            this.period = this._accelerationModule.period;
          else if (this._rotationRateModule.isValid)
            this.period = this._rotationRateModule.period;

          resolve(this);
        });
    });
  }

  start() {
    if (this._accelerationModule.isValid)
      MotionInput.addListener('acceleration', this._onAcceleration);
    if (this._rotationRateModule.isValid)
      MotionInput.addListener('rotationRate', this._onRotationRate);
  }

  stop() {
    if (this._accelerationModule.isValid)
      MotionInput.removeListener('acceleration', this._onAcceleration);
    if (this._rotationRateModule.isValid)
      MotionInput.removeListener('rotationRate', this._onRotationRate);
  }

  _onAcceleration(acceleration) {
    this._accelerationValues = acceleration;

    if (!this._rotationRateModule.isValid)
      this._calculateEnergy();
  }

  _onRotationRate(rotationRate) {
    this._rotationRateValues = rotationRate;

    this._calculateEnergy();
  }

  _calculateEnergy() {
    let accelerationEnergy = 0;
    let rotationRateEnergy = 0;

    if (this._accelerationModule.isValid) {
      let aX = this._accelerationValues[0];
      let aY = this._accelerationValues[1];
      let aZ = this._accelerationValues[2];
      let accelerationMagnitude = Math.sqrt(aX * aX + aY * aY + aZ * aZ);

      if (this._accelerationMagnitudeThreshold < accelerationMagnitude)
        this._accelerationMagnitudeThreshold = Math.min(accelerationMagnitude, this._accelerationMagnitudeThresholdMax);
        // TODO(?): remove ouliers --- on some Android devices, the magnitude is very high on a few isolated datapoints,
        // which make the threshold very high as well => the energy remains around 0.5, even when you shake very hard.

      accelerationEnergy = Math.min(accelerationMagnitude / this._accelerationMagnitudeThreshold, 1);
    }

    if (this._rotationRateModule.isValid) {
      let rA = this._rotationRateValues[0];
      let rB = this._rotationRateValues[1];
      let rG = this._rotationRateValues[2];
      let rotationRateMagnitude = Math.sqrt(rA * rA + rB * rB + rG * rG);

      if (this._rotationRateMagnitudeThreshold < rotationRateMagnitude)
        this._rotationRateMagnitudeThreshold = Math.min(rotationRateMagnitude, this._rotationRateMagnitudeThresholdMax);

      rotationRateEnergy = Math.min(rotationRateMagnitude / this._rotationRateMagnitudeThreshold, 1);
    }

    let energy = Math.max(accelerationEnergy, rotationRateEnergy);

    // Low-pass filter
    const k = this._energyDecay;
    this.event = k * this.event + (1 - k) * energy;

    this.emit(this.event);
  }

}

module.exports = new EnergyModule();