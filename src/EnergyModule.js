import InputModule from './InputModule';
import motionInput from './MotionInput';

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
class EnergyModule extends InputModule {

  /**
   * Creates the energy module instance.
   *
   * @constructor
   */
  constructor() {
    super('energy');

    /**
     * Event containing the value of the energy, sent by the energy module.
     *
     * @this EnergyModule
     * @type {number}
     * @default 0
     */
    this.event = 0;

    /**
     * The acceleration module, used in the calculation of the energy.
     *
     * @this EnergyModule
     * @type {DOMEventSubmodule}
     * @default null
     * @see DevicemotionModule
     */
    this._accelerationModule = null;

    /**
     * Latest acceleration value sent by the acceleration module.
     *
     * @this EnergyModule
     * @type {number[]}
     * @default null
     */
    this._accelerationValues = null;

    /**
     * Maximum value reached by the acceleration magnitude, clipped at `this._accelerationMagnitudeThreshold`.
     *
     * @this EnergyModule
     * @type {number}
     * @default 9.81
     */
    this._accelerationMagnitudeCurrentMax = 1 * 9.81;

    /**
     * Clipping value of the acceleration magnitude.
     *
     * @this EnergyModule
     * @type {number}
     * @default 20
     * @constant
     */
    this._accelerationMagnitudeThreshold = 4 * 9.81;

    /**
     * The rotation rate module, used in the calculation of the energy.
     *
     * @this EnergyModule
     * @type {DOMEventSubmodule}
     * @default null
     * @see DevicemotionModule
     */
    this._rotationRateModule = null;

    /**
     * Latest rotation rate value sent by the rotation rate module.
     *
     * @this EnergyModule
     * @type {number[]}
     * @default null
     */
    this._rotationRateValues = null;

    /**
     * Maximum value reached by the rotation rate magnitude, clipped at `this._rotationRateMagnitudeThreshold`.
     *
     * @this EnergyModule
     * @type {number}
     * @default 400
     */
    this._rotationRateMagnitudeCurrentMax = 400;

    /**
     * Clipping value of the rotation rate magnitude.
     *
     * @this EnergyModule
     * @type {number}
     * @default 600
     * @constant
     */
    this._rotationRateMagnitudeThreshold = 600;

    /**
     * Time constant (half-life) of the low-pass filter used to smooth the energy values (in seconds).
     *
     * @this EnergyModule
     * @type {number}
     * @default 0.1
     * @constant
     */
    this._energyTimeConstant = 0.1;

    this._onAcceleration = this._onAcceleration.bind(this);
    this._onRotationRate = this._onRotationRate.bind(this);
  }

  /**
   * Decay factor of the low-pass filter used to smooth the energy values.
   *
   * @type {number}
   * @readonly
   */
  get _energyDecay() {
    return Math.exp(-2 * Math.PI * this.period / this._energyTimeConstant);
  }

  /**
   * Initializes of the module.
   *
   * @return {Promise}
   */
  init() {
    return super.init((resolve) => {
      // The energy module requires the acceleration and the rotation rate modules
      Promise.all([motionInput.requireModule('acceleration'), motionInput.requireModule('rotationRate')])
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

  addListener(listener) {
    if (this.listeners.size === 0) {
      if (this._accelerationModule.isValid)
        this._accelerationModule.addListener(this._onAcceleration);
      if (this._rotationRateModule.isValid)
        this._rotationRateModule.addListener(this._onRotationRate);
    }

    super.addListener(listener);
  }

  removeListener(listener) {
    super.removeListener(listener);

    if (this.listeners.size === 0) {
      if (this._accelerationModule.isValid)
        this._accelerationModule.removeListener(this._onAcceleration);
      if (this._rotationRateModule.isValid)
        this._rotationRateModule.removeListener(this._onRotationRate);
    }
  }

  /**
   * Acceleration values handler.
   *
   * @param {number[]} acceleration - Latest acceleration value.
   */
  _onAcceleration(acceleration) {
    this._accelerationValues = acceleration;

    // If the rotation rate values are not available, we calculate the energy right away.
    if (!this._rotationRateModule.isValid)
      this._calculateEnergy();
  }

  /**
   * Rotation rate values handler.
   *
   * @param {number[]} rotationRate - Latest rotation rate value.
   */
  _onRotationRate(rotationRate) {
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
  _calculateEnergy() {
    let accelerationEnergy = 0;
    let rotationRateEnergy = 0;

    // Check the acceleration module and calculate an estimation of the energy value from the latest acceleration value
    if (this._accelerationModule.isValid) {
      let aX = this._accelerationValues[0];
      let aY = this._accelerationValues[1];
      let aZ = this._accelerationValues[2];
      let accelerationMagnitude = Math.sqrt(aX * aX + aY * aY + aZ * aZ);

      // Store the maximum acceleration magnitude reached so far, clipped at `this._accelerationMagnitudeThreshold`
      if (this._accelerationMagnitudeCurrentMax < accelerationMagnitude)
        this._accelerationMagnitudeCurrentMax = Math.min(accelerationMagnitude, this._accelerationMagnitudeThreshold);
      // TODO(?): remove ouliers --- on some Android devices, the magnitude is very high on a few isolated datapoints,
      // which make the threshold very high as well => the energy remains around 0.5, even when you shake very hard.

      accelerationEnergy = Math.min(accelerationMagnitude / this._accelerationMagnitudeCurrentMax, 1);
    }

    // Check the rotation rate module and calculate an estimation of the energy value from the latest rotation rate value
    if (this._rotationRateModule.isValid) {
      let rA = this._rotationRateValues[0];
      let rB = this._rotationRateValues[1];
      let rG = this._rotationRateValues[2];
      let rotationRateMagnitude = Math.sqrt(rA * rA + rB * rB + rG * rG);

      // Store the maximum rotation rate magnitude reached so far, clipped at `this._rotationRateMagnitudeThreshold`
      if (this._rotationRateMagnitudeCurrentMax < rotationRateMagnitude)
        this._rotationRateMagnitudeCurrentMax = Math.min(rotationRateMagnitude, this._rotationRateMagnitudeThreshold);

      rotationRateEnergy = Math.min(rotationRateMagnitude / this._rotationRateMagnitudeCurrentMax, 1);
    }

    let energy = Math.max(accelerationEnergy, rotationRateEnergy);

    // Low-pass filter to smooth the energy values
    const k = this._energyDecay;
    this.event = k * this.event + (1 - k) * energy;

    // Emit the energy value
    this.emit(this.event);
  }
}

export default new EnergyModule();
