'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _InputModule2 = require('./InputModule');

var _InputModule3 = _interopRequireDefault(_InputModule2);

var _MotionInput = require('./MotionInput');

var _MotionInput2 = _interopRequireDefault(_MotionInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
var EnergyModule = function (_InputModule) {
  _inherits(EnergyModule, _InputModule);

  /**
   * Creates the energy module instance.
   *
   * @constructor
   */
  function EnergyModule() {
    _classCallCheck(this, EnergyModule);

    /**
     * Event containing the value of the energy, sent by the energy module.
     *
     * @this EnergyModule
     * @type {number}
     * @default 0
     */
    var _this = _possibleConstructorReturn(this, (EnergyModule.__proto__ || Object.getPrototypeOf(EnergyModule)).call(this, 'energy'));

    _this.event = 0;

    /**
     * The acceleration module, used in the calculation of the energy.
     *
     * @this EnergyModule
     * @type {DOMEventSubmodule}
     * @default null
     * @see DevicemotionModule
     */
    _this._accelerationModule = null;

    /**
     * Latest acceleration value sent by the acceleration module.
     *
     * @this EnergyModule
     * @type {number[]}
     * @default null
     */
    _this._accelerationValues = null;

    /**
     * Maximum value reached by the acceleration magnitude, clipped at `this._accelerationMagnitudeThreshold`.
     *
     * @this EnergyModule
     * @type {number}
     * @default 9.81
     */
    _this._accelerationMagnitudeCurrentMax = 1 * 9.81;

    /**
     * Clipping value of the acceleration magnitude.
     *
     * @this EnergyModule
     * @type {number}
     * @default 20
     * @constant
     */
    _this._accelerationMagnitudeThreshold = 4 * 9.81;

    /**
     * The rotation rate module, used in the calculation of the energy.
     *
     * @this EnergyModule
     * @type {DOMEventSubmodule}
     * @default null
     * @see DevicemotionModule
     */
    _this._rotationRateModule = null;

    /**
     * Latest rotation rate value sent by the rotation rate module.
     *
     * @this EnergyModule
     * @type {number[]}
     * @default null
     */
    _this._rotationRateValues = null;

    /**
     * Maximum value reached by the rotation rate magnitude, clipped at `this._rotationRateMagnitudeThreshold`.
     *
     * @this EnergyModule
     * @type {number}
     * @default 400
     */
    _this._rotationRateMagnitudeCurrentMax = 400;

    /**
     * Clipping value of the rotation rate magnitude.
     *
     * @this EnergyModule
     * @type {number}
     * @default 600
     * @constant
     */
    _this._rotationRateMagnitudeThreshold = 600;

    /**
     * Time constant (half-life) of the low-pass filter used to smooth the energy values (in seconds).
     *
     * @this EnergyModule
     * @type {number}
     * @default 0.1
     * @constant
     */
    _this._energyTimeConstant = 0.1;

    /**
     * Method binding of the acceleration values callback.
     *
     * @this EnergyModule
     * @type {function}
     */
    _this._onAcceleration = _this._onAcceleration.bind(_this);

    /**
     * Method binding of the rotation rate values callback.
     *
     * @this EnergyModule
     * @type {function}
     */
    _this._onRotationRate = _this._onRotationRate.bind(_this);
    return _this;
  }

  /**
   * Decay factor of the low-pass filter used to smooth the energy values.
   *
   * @type {number}
   * @readonly
   */


  _createClass(EnergyModule, [{
    key: 'init',


    /**
     * Initializes of the module.
     *
     * @return {Promise}
     */
    value: function init() {
      var _this2 = this;

      return _get(EnergyModule.prototype.__proto__ || Object.getPrototypeOf(EnergyModule.prototype), 'init', this).call(this, function (resolve) {
        // The energy module requires the acceleration and the rotation rate modules
        Promise.all([_MotionInput2.default.requireModule('acceleration'), _MotionInput2.default.requireModule('rotationRate')]).then(function (modules) {
          var _modules = _slicedToArray(modules, 2),
              acceleration = _modules[0],
              rotationRate = _modules[1];

          _this2._accelerationModule = acceleration;
          _this2._rotationRateModule = rotationRate;
          _this2.isCalculated = _this2._accelerationModule.isValid || _this2._rotationRateModule.isValid;

          if (_this2._accelerationModule.isValid) _this2.period = _this2._accelerationModule.period;else if (_this2._rotationRateModule.isValid) _this2.period = _this2._rotationRateModule.period;

          resolve(_this2);
        });
      });
    }

    /**
     * Start the module.
     */

  }, {
    key: 'start',
    value: function start() {
      // TODO(?): make this method private
      if (this._accelerationModule.isValid) _MotionInput2.default.addListener('acceleration', this._onAcceleration);
      if (this._rotationRateModule.isValid) _MotionInput2.default.addListener('rotationRate', this._onRotationRate);
    }

    /**
     * Stop the module.
     */

  }, {
    key: 'stop',
    value: function stop() {
      // TODO(?): make this method private
      if (this._accelerationModule.isValid) _MotionInput2.default.removeListener('acceleration', this._onAcceleration);
      if (this._rotationRateModule.isValid) _MotionInput2.default.removeListener('rotationRate', this._onRotationRate);
    }

    /**
     * Acceleration values handler.
     *
     * @param {number[]} acceleration - Latest acceleration value.
     */

  }, {
    key: '_onAcceleration',
    value: function _onAcceleration(acceleration) {
      this._accelerationValues = acceleration;

      // If the rotation rate values are not available, we calculate the energy right away.
      if (!this._rotationRateModule.isValid) this._calculateEnergy();
    }

    /**
     * Rotation rate values handler.
     *
     * @param {number[]} rotationRate - Latest rotation rate value.
     */

  }, {
    key: '_onRotationRate',
    value: function _onRotationRate(rotationRate) {
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

  }, {
    key: '_calculateEnergy',
    value: function _calculateEnergy() {
      var accelerationEnergy = 0;
      var rotationRateEnergy = 0;

      // Check the acceleration module and calculate an estimation of the energy value from the latest acceleration value
      if (this._accelerationModule.isValid) {
        var aX = this._accelerationValues[0];
        var aY = this._accelerationValues[1];
        var aZ = this._accelerationValues[2];
        var accelerationMagnitude = Math.sqrt(aX * aX + aY * aY + aZ * aZ);

        // Store the maximum acceleration magnitude reached so far, clipped at `this._accelerationMagnitudeThreshold`
        if (this._accelerationMagnitudeCurrentMax < accelerationMagnitude) this._accelerationMagnitudeCurrentMax = Math.min(accelerationMagnitude, this._accelerationMagnitudeThreshold);
        // TODO(?): remove ouliers --- on some Android devices, the magnitude is very high on a few isolated datapoints,
        // which make the threshold very high as well => the energy remains around 0.5, even when you shake very hard.

        accelerationEnergy = Math.min(accelerationMagnitude / this._accelerationMagnitudeCurrentMax, 1);
      }

      // Check the rotation rate module and calculate an estimation of the energy value from the latest rotation rate value
      if (this._rotationRateModule.isValid) {
        var rA = this._rotationRateValues[0];
        var rB = this._rotationRateValues[1];
        var rG = this._rotationRateValues[2];
        var rotationRateMagnitude = Math.sqrt(rA * rA + rB * rB + rG * rG);

        // Store the maximum rotation rate magnitude reached so far, clipped at `this._rotationRateMagnitudeThreshold`
        if (this._rotationRateMagnitudeCurrentMax < rotationRateMagnitude) this._rotationRateMagnitudeCurrentMax = Math.min(rotationRateMagnitude, this._rotationRateMagnitudeThreshold);

        rotationRateEnergy = Math.min(rotationRateMagnitude / this._rotationRateMagnitudeCurrentMax, 1);
      }

      var energy = Math.max(accelerationEnergy, rotationRateEnergy);

      // Low-pass filter to smooth the energy values
      var k = this._energyDecay;
      this.event = k * this.event + (1 - k) * energy;

      // Emit the energy value
      this.emit(this.event);
    }
  }, {
    key: '_energyDecay',
    get: function get() {
      return Math.exp(-2 * Math.PI * this.period / this._energyTimeConstant);
    }
  }]);

  return EnergyModule;
}(_InputModule3.default);

exports.default = new EnergyModule();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVuZXJneU1vZHVsZS5qcyJdLCJuYW1lcyI6WyJFbmVyZ3lNb2R1bGUiLCJldmVudCIsIl9hY2NlbGVyYXRpb25Nb2R1bGUiLCJfYWNjZWxlcmF0aW9uVmFsdWVzIiwiX2FjY2VsZXJhdGlvbk1hZ25pdHVkZUN1cnJlbnRNYXgiLCJfYWNjZWxlcmF0aW9uTWFnbml0dWRlVGhyZXNob2xkIiwiX3JvdGF0aW9uUmF0ZU1vZHVsZSIsIl9yb3RhdGlvblJhdGVWYWx1ZXMiLCJfcm90YXRpb25SYXRlTWFnbml0dWRlQ3VycmVudE1heCIsIl9yb3RhdGlvblJhdGVNYWduaXR1ZGVUaHJlc2hvbGQiLCJfZW5lcmd5VGltZUNvbnN0YW50IiwiX29uQWNjZWxlcmF0aW9uIiwiYmluZCIsIl9vblJvdGF0aW9uUmF0ZSIsInJlc29sdmUiLCJQcm9taXNlIiwiYWxsIiwicmVxdWlyZU1vZHVsZSIsInRoZW4iLCJtb2R1bGVzIiwiYWNjZWxlcmF0aW9uIiwicm90YXRpb25SYXRlIiwiaXNDYWxjdWxhdGVkIiwiaXNWYWxpZCIsInBlcmlvZCIsImFkZExpc3RlbmVyIiwicmVtb3ZlTGlzdGVuZXIiLCJfY2FsY3VsYXRlRW5lcmd5IiwiYWNjZWxlcmF0aW9uRW5lcmd5Iiwicm90YXRpb25SYXRlRW5lcmd5IiwiYVgiLCJhWSIsImFaIiwiYWNjZWxlcmF0aW9uTWFnbml0dWRlIiwiTWF0aCIsInNxcnQiLCJtaW4iLCJyQSIsInJCIiwickciLCJyb3RhdGlvblJhdGVNYWduaXR1ZGUiLCJlbmVyZ3kiLCJtYXgiLCJrIiwiX2VuZXJneURlY2F5IiwiZW1pdCIsImV4cCIsIlBJIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7OztJQVVNQSxZOzs7QUFFSjs7Ozs7QUFLQSwwQkFBYztBQUFBOztBQUdaOzs7Ozs7O0FBSFksNEhBQ04sUUFETTs7QUFVWixVQUFLQyxLQUFMLEdBQWEsQ0FBYjs7QUFFQTs7Ozs7Ozs7QUFR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Qzs7QUFFRm9CLDZCQUFxQkssS0FBS0UsR0FBTCxDQUFTSSx3QkFBd0IsS0FBS2hDLGdDQUF0QyxFQUF3RSxDQUF4RSxDQUFyQjtBQUNEOztBQUVELFVBQUlpQyxTQUFTUCxLQUFLUSxHQUFMLENBQVNkLGtCQUFULEVBQTZCQyxrQkFBN0IsQ0FBYjs7QUFFQTtBQUNBLFVBQU1jLElBQUksS0FBS0MsWUFBZjtBQUNBLFdBQUszQyxLQUFMLEdBQWEwQyxJQUFJLEtBQUsxQyxLQUFULEdBQWlCLENBQUMsSUFBSTBDLENBQUwsSUFBVUYsTUFBeEM7O0FBRUE7QUFDQSxXQUFLSSxJQUFMLENBQVUsS0FBSzVDLEtBQWY7QUFDRDs7O3dCQTNJa0I7QUFDakIsYUFBT2lDLEtBQUtZLEdBQUwsQ0FBUyxDQUFDLENBQUQsR0FBS1osS0FBS2EsRUFBVixHQUFlLEtBQUt2QixNQUFwQixHQUE2QixLQUFLZCxtQkFBM0MsQ0FBUDtBQUNEOzs7Ozs7a0JBNElZLElBQUlWLFlBQUosRSIsImZpbGUiOiJFbmVyZ3lNb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSW5wdXRNb2R1bGUgZnJvbSAnLi9JbnB1dE1vZHVsZSc7XG5pbXBvcnQgTW90aW9uSW5wdXQgZnJvbSAnLi9Nb3Rpb25JbnB1dCc7XG5cbi8qKlxuICogRW5lcmd5IG1vZHVsZSBzaW5nbGV0b24uXG4gKiBUaGUgZW5lcmd5IG1vZHVsZSBzaW5nbGV0b24gcHJvdmlkZXMgZW5lcmd5IHZhbHVlcyAoYmV0d2VlbiAwIGFuZCAxKVxuICogYmFzZWQgb24gdGhlIGFjY2VsZXJhdGlvbiBhbmQgdGhlIHJvdGF0aW9uIHJhdGUgb2YgdGhlIGRldmljZS5cbiAqIFRoZSBwZXJpb2Qgb2YgdGhlIGVuZXJneSB2YWx1ZXMgaXMgdGhlIHNhbWUgYXMgdGhlIHBlcmlvZCBvZiB0aGVcbiAqIGFjY2VsZXJhdGlvbiBhbmQgdGhlIHJvdGF0aW9uIHJhdGUgdmFsdWVzLlxuICpcbiAqIEBjbGFzcyBFbmVyZ3lNb2R1bGVcbiAqIEBleHRlbmRzIElucHV0TW9kdWxlXG4gKi9cbmNsYXNzIEVuZXJneU1vZHVsZSBleHRlbmRzIElucHV0TW9kdWxlIHtcblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgZW5lcmd5IG1vZHVsZSBpbnN0YW5jZS5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignZW5lcmd5Jyk7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBjb250YWluaW5nIHRoZSB2YWx1ZSBvZiB0aGUgZW5lcmd5LCBzZW50IGJ5IHRoZSBlbmVyZ3kgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgRW5lcmd5TW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgdGhpcy5ldmVudCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYWNjZWxlcmF0aW9uIG1vZHVsZSwgdXNlZCBpbiB0aGUgY2FsY3VsYXRpb24gb2YgdGhlIGVuZXJneS5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICogQHNlZSBEZXZpY2Vtb3Rpb25Nb2R1bGVcbiAgICAgKi9cbiAgICB0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IGFjY2VsZXJhdGlvbiB2YWx1ZSBzZW50IGJ5IHRoZSBhY2NlbGVyYXRpb24gbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgRW5lcmd5TW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICB0aGlzLl9hY2NlbGVyYXRpb25WYWx1ZXMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTWF4aW11bSB2YWx1ZSByZWFjaGVkIGJ5IHRoZSBhY2NlbGVyYXRpb24gbWFnbml0dWRlLCBjbGlwcGVkIGF0IGB0aGlzLl9hY2NlbGVyYXRpb25NYWduaXR1ZGVUaHJlc2hvbGRgLlxuICAgICAqXG4gICAgICogQHRoaXMgRW5lcmd5TW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZGVmYXVsdCA5LjgxXG4gICAgICovXG4gICAgdGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlQ3VycmVudE1heCA9IDEgKiA5LjgxO1xuXG4gICAgLyoqXG4gICAgICogQ2xpcHBpbmcgdmFsdWUgb2YgdGhlIGFjY2VsZXJhdGlvbiBtYWduaXR1ZGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDIwXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgdGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlVGhyZXNob2xkID0gNCAqIDkuODE7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcm90YXRpb24gcmF0ZSBtb2R1bGUsIHVzZWQgaW4gdGhlIGNhbGN1bGF0aW9uIG9mIHRoZSBlbmVyZ3kuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqIEBzZWUgRGV2aWNlbW90aW9uTW9kdWxlXG4gICAgICovXG4gICAgdGhpcy5fcm90YXRpb25SYXRlTW9kdWxlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIExhdGVzdCByb3RhdGlvbiByYXRlIHZhbHVlIHNlbnQgYnkgdGhlIHJvdGF0aW9uIHJhdGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgRW5lcmd5TW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICB0aGlzLl9yb3RhdGlvblJhdGVWYWx1ZXMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTWF4aW11bSB2YWx1ZSByZWFjaGVkIGJ5IHRoZSByb3RhdGlvbiByYXRlIG1hZ25pdHVkZSwgY2xpcHBlZCBhdCBgdGhpcy5fcm90YXRpb25SYXRlTWFnbml0dWRlVGhyZXNob2xkYC5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgNDAwXG4gICAgICovXG4gICAgdGhpcy5fcm90YXRpb25SYXRlTWFnbml0dWRlQ3VycmVudE1heCA9IDQwMDtcblxuICAgIC8qKlxuICAgICAqIENsaXBwaW5nIHZhbHVlIG9mIHRoZSByb3RhdGlvbiByYXRlIG1hZ25pdHVkZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgNjAwXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgdGhpcy5fcm90YXRpb25SYXRlTWFnbml0dWRlVGhyZXNob2xkID0gNjAwO1xuXG4gICAgLyoqXG4gICAgICogVGltZSBjb25zdGFudCAoaGFsZi1saWZlKSBvZiB0aGUgbG93LXBhc3MgZmlsdGVyIHVzZWQgdG8gc21vb3RoIHRoZSBlbmVyZ3kgdmFsdWVzIChpbiBzZWNvbmRzKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgMC4xXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgdGhpcy5fZW5lcmd5VGltZUNvbnN0YW50ID0gMC4xO1xuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIGJpbmRpbmcgb2YgdGhlIGFjY2VsZXJhdGlvbiB2YWx1ZXMgY2FsbGJhY2suXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICovXG4gICAgdGhpcy5fb25BY2NlbGVyYXRpb24gPSB0aGlzLl9vbkFjY2VsZXJhdGlvbi5iaW5kKHRoaXMpO1xuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIGJpbmRpbmcgb2YgdGhlIHJvdGF0aW9uIHJhdGUgdmFsdWVzIGNhbGxiYWNrLlxuICAgICAqXG4gICAgICogQHRoaXMgRW5lcmd5TW9kdWxlXG4gICAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgICAqL1xuICAgIHRoaXMuX29uUm90YXRpb25SYXRlID0gdGhpcy5fb25Sb3RhdGlvblJhdGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWNheSBmYWN0b3Igb2YgdGhlIGxvdy1wYXNzIGZpbHRlciB1c2VkIHRvIHNtb290aCB0aGUgZW5lcmd5IHZhbHVlcy5cbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgX2VuZXJneURlY2F5KCkge1xuICAgIHJldHVybiBNYXRoLmV4cCgtMiAqIE1hdGguUEkgKiB0aGlzLnBlcmlvZCAvIHRoaXMuX2VuZXJneVRpbWVDb25zdGFudCk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgb2YgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIHN1cGVyLmluaXQoKHJlc29sdmUpID0+IHtcbiAgICAgIC8vIFRoZSBlbmVyZ3kgbW9kdWxlIHJlcXVpcmVzIHRoZSBhY2NlbGVyYXRpb24gYW5kIHRoZSByb3RhdGlvbiByYXRlIG1vZHVsZXNcbiAgICAgIFByb21pc2UuYWxsKFtNb3Rpb25JbnB1dC5yZXF1aXJlTW9kdWxlKCdhY2NlbGVyYXRpb24nKSwgTW90aW9uSW5wdXQucmVxdWlyZU1vZHVsZSgncm90YXRpb25SYXRlJyldKVxuICAgICAgICAudGhlbigobW9kdWxlcykgPT4ge1xuICAgICAgICAgIGNvbnN0IFthY2NlbGVyYXRpb24sIHJvdGF0aW9uUmF0ZV0gPSBtb2R1bGVzO1xuXG4gICAgICAgICAgdGhpcy5fYWNjZWxlcmF0aW9uTW9kdWxlID0gYWNjZWxlcmF0aW9uO1xuICAgICAgICAgIHRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZSA9IHJvdGF0aW9uUmF0ZTtcbiAgICAgICAgICB0aGlzLmlzQ2FsY3VsYXRlZCA9IHRoaXMuX2FjY2VsZXJhdGlvbk1vZHVsZS5pc1ZhbGlkIHx8IHRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZS5pc1ZhbGlkO1xuXG4gICAgICAgICAgaWYgKHRoaXMuX2FjY2VsZXJhdGlvbk1vZHVsZS5pc1ZhbGlkKVxuICAgICAgICAgICAgdGhpcy5wZXJpb2QgPSB0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUucGVyaW9kO1xuICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZS5pc1ZhbGlkKVxuICAgICAgICAgICAgdGhpcy5wZXJpb2QgPSB0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUucGVyaW9kO1xuXG4gICAgICAgICAgcmVzb2x2ZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZS5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIC8vIFRPRE8oPyk6IG1ha2UgdGhpcyBtZXRob2QgcHJpdmF0ZVxuICAgIGlmICh0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUuaXNWYWxpZClcbiAgICAgIE1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdhY2NlbGVyYXRpb24nLCB0aGlzLl9vbkFjY2VsZXJhdGlvbik7XG4gICAgaWYgKHRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZS5pc1ZhbGlkKVxuICAgICAgTW90aW9uSW5wdXQuYWRkTGlzdGVuZXIoJ3JvdGF0aW9uUmF0ZScsIHRoaXMuX29uUm90YXRpb25SYXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBtb2R1bGUuXG4gICAqL1xuICBzdG9wKCkge1xuICAgIC8vIFRPRE8oPyk6IG1ha2UgdGhpcyBtZXRob2QgcHJpdmF0ZVxuICAgIGlmICh0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUuaXNWYWxpZClcbiAgICAgIE1vdGlvbklucHV0LnJlbW92ZUxpc3RlbmVyKCdhY2NlbGVyYXRpb24nLCB0aGlzLl9vbkFjY2VsZXJhdGlvbik7XG4gICAgaWYgKHRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZS5pc1ZhbGlkKVxuICAgICAgTW90aW9uSW5wdXQucmVtb3ZlTGlzdGVuZXIoJ3JvdGF0aW9uUmF0ZScsIHRoaXMuX29uUm90YXRpb25SYXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBY2NlbGVyYXRpb24gdmFsdWVzIGhhbmRsZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyW119IGFjY2VsZXJhdGlvbiAtIExhdGVzdCBhY2NlbGVyYXRpb24gdmFsdWUuXG4gICAqL1xuICBfb25BY2NlbGVyYXRpb24oYWNjZWxlcmF0aW9uKSB7XG4gICAgdGhpcy5fYWNjZWxlcmF0aW9uVmFsdWVzID0gYWNjZWxlcmF0aW9uO1xuXG4gICAgLy8gSWYgdGhlIHJvdGF0aW9uIHJhdGUgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlLCB3ZSBjYWxjdWxhdGUgdGhlIGVuZXJneSByaWdodCBhd2F5LlxuICAgIGlmICghdGhpcy5fcm90YXRpb25SYXRlTW9kdWxlLmlzVmFsaWQpXG4gICAgICB0aGlzLl9jYWxjdWxhdGVFbmVyZ3koKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSb3RhdGlvbiByYXRlIHZhbHVlcyBoYW5kbGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcltdfSByb3RhdGlvblJhdGUgLSBMYXRlc3Qgcm90YXRpb24gcmF0ZSB2YWx1ZS5cbiAgICovXG4gIF9vblJvdGF0aW9uUmF0ZShyb3RhdGlvblJhdGUpIHtcbiAgICB0aGlzLl9yb3RhdGlvblJhdGVWYWx1ZXMgPSByb3RhdGlvblJhdGU7XG5cbiAgICAvLyBXZSBrbm93IHRoYXQgdGhlIGFjY2VsZXJhdGlvbiBhbmQgcm90YXRpb24gcmF0ZSB2YWx1ZXMgY29taW5nIGZyb20gdGhlXG4gICAgLy8gc2FtZSBgZGV2aWNlbW90aW9uYCBldmVudCBhcmUgc2VudCBpbiB0aGF0IG9yZGVyIChhY2NlbGVyYXRpb24gPiByb3RhdGlvbiByYXRlKVxuICAgIC8vIHNvIHdoZW4gdGhlIHJvdGF0aW9uIHJhdGUgaXMgcHJvdmlkZWQsIHdlIGNhbGN1bGF0ZSB0aGUgZW5lcmd5IHZhbHVlIG9mIHRoZVxuICAgIC8vIGxhdGVzdCBgZGV2aWNlbW90aW9uYCBldmVudCB3aGVuIHdlIHJlY2VpdmUgdGhlIHJvdGF0aW9uIHJhdGUgdmFsdWVzLlxuICAgIHRoaXMuX2NhbGN1bGF0ZUVuZXJneSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuZXJneSBjYWxjdWxhdGlvbjogZW1pdHMgYW4gZW5lcmd5IHZhbHVlIGJldHdlZW4gMCBhbmQgMS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2hlY2tzIGlmIHRoZSBhY2NlbGVyYXRpb24gbW9kdWxlcyBpcyB2YWxpZC4gSWYgdGhhdCBpcyB0aGUgY2FzZSxcbiAgICogaXQgY2FsY3VsYXRlcyBhbiBlc3RpbWF0aW9uIG9mIHRoZSBlbmVyZ3kgKGJldHdlZW4gMCBhbmQgMSkgYmFzZWQgb24gdGhlIHJhdGlvXG4gICAqIG9mIHRoZSBjdXJyZW50IGFjY2VsZXJhdGlvbiBtYWduaXR1ZGUgYW5kIHRoZSBtYXhpbXVtIGFjY2VsZXJhdGlvbiBtYWduaXR1ZGVcbiAgICogcmVhY2hlZCBzbyBmYXIgKGNsaXBwZWQgYXQgdGhlIGB0aGlzLl9hY2NlbGVyYXRpb25NYWduaXR1ZGVUaHJlc2hvbGRgIHZhbHVlKS5cbiAgICogKFdlIHVzZSB0aGlzIHRyaWNrIHRvIGdldCB1bmlmb3JtIGJlaGF2aW9ycyBhbW9uZyBkZXZpY2VzLiBJZiB3ZSBjYWxjdWxhdGVkXG4gICAqIHRoZSByYXRpbyBiYXNlZCBvbiBhIGZpeGVkIHZhbHVlIGluZGVwZW5kZW50IG9mIHdoYXQgdGhlIGRldmljZSBpcyBjYXBhYmxlIG9mXG4gICAqIHByb3ZpZGluZywgd2UgY291bGQgZ2V0IGluY29uc2lzdGVudCBiZWhhdmlvcnMuIEZvciBpbnN0YW5jZSwgdGhlIGRldmljZXNcbiAgICogd2hvc2UgYWNjZWxlcm9tZXRlcnMgYXJlIGxpbWl0ZWQgYXQgMmcgd291bGQgYWx3YXlzIHByb3ZpZGUgdmVyeSBsb3cgdmFsdWVzXG4gICAqIGNvbXBhcmVkIHRvIGRldmljZXMgd2l0aCBhY2NlbGVyb21ldGVycyBjYXBhYmxlIG9mIG1lYXN1cmluZyA0ZyBhY2NlbGVyYXRpb25zLilcbiAgICogVGhlIHNhbWUgY2hlY2tzIGFuZCBjYWxjdWxhdGlvbnMgYXJlIG1hZGUgb24gdGhlIHJvdGF0aW9uIHJhdGUgbW9kdWxlLlxuICAgKiBGaW5hbGx5LCB0aGUgZW5lcmd5IHZhbHVlIGlzIHRoZSBtYXhpbXVtIGJldHdlZW4gdGhlIGVuZXJneSB2YWx1ZSBlc3RpbWF0ZWRcbiAgICogZnJvbSB0aGUgYWNjZWxlcmF0aW9uLCBhbmQgdGhlIG9uZSBlc3RpbWF0ZWQgZnJvbSB0aGUgcm90YXRpb24gcmF0ZS4gSXQgaXNcbiAgICogc21vb3RoZWQgdGhyb3VnaCBhIGxvdy1wYXNzIGZpbHRlci5cbiAgICovXG4gIF9jYWxjdWxhdGVFbmVyZ3koKSB7XG4gICAgbGV0IGFjY2VsZXJhdGlvbkVuZXJneSA9IDA7XG4gICAgbGV0IHJvdGF0aW9uUmF0ZUVuZXJneSA9IDA7XG5cbiAgICAvLyBDaGVjayB0aGUgYWNjZWxlcmF0aW9uIG1vZHVsZSBhbmQgY2FsY3VsYXRlIGFuIGVzdGltYXRpb24gb2YgdGhlIGVuZXJneSB2YWx1ZSBmcm9tIHRoZSBsYXRlc3QgYWNjZWxlcmF0aW9uIHZhbHVlXG4gICAgaWYgKHRoaXMuX2FjY2VsZXJhdGlvbk1vZHVsZS5pc1ZhbGlkKSB7XG4gICAgICBsZXQgYVggPSB0aGlzLl9hY2NlbGVyYXRpb25WYWx1ZXNbMF07XG4gICAgICBsZXQgYVkgPSB0aGlzLl9hY2NlbGVyYXRpb25WYWx1ZXNbMV07XG4gICAgICBsZXQgYVogPSB0aGlzLl9hY2NlbGVyYXRpb25WYWx1ZXNbMl07XG4gICAgICBsZXQgYWNjZWxlcmF0aW9uTWFnbml0dWRlID0gTWF0aC5zcXJ0KGFYICogYVggKyBhWSAqIGFZICsgYVogKiBhWik7XG5cbiAgICAgIC8vIFN0b3JlIHRoZSBtYXhpbXVtIGFjY2VsZXJhdGlvbiBtYWduaXR1ZGUgcmVhY2hlZCBzbyBmYXIsIGNsaXBwZWQgYXQgYHRoaXMuX2FjY2VsZXJhdGlvbk1hZ25pdHVkZVRocmVzaG9sZGBcbiAgICAgIGlmICh0aGlzLl9hY2NlbGVyYXRpb25NYWduaXR1ZGVDdXJyZW50TWF4IDwgYWNjZWxlcmF0aW9uTWFnbml0dWRlKVxuICAgICAgICB0aGlzLl9hY2NlbGVyYXRpb25NYWduaXR1ZGVDdXJyZW50TWF4ID0gTWF0aC5taW4oYWNjZWxlcmF0aW9uTWFnbml0dWRlLCB0aGlzLl9hY2NlbGVyYXRpb25NYWduaXR1ZGVUaHJlc2hvbGQpO1xuICAgICAgLy8gVE9ETyg/KTogcmVtb3ZlIG91bGllcnMgLS0tIG9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzLCB0aGUgbWFnbml0dWRlIGlzIHZlcnkgaGlnaCBvbiBhIGZldyBpc29sYXRlZCBkYXRhcG9pbnRzLFxuICAgICAgLy8gd2hpY2ggbWFrZSB0aGUgdGhyZXNob2xkIHZlcnkgaGlnaCBhcyB3ZWxsID0+IHRoZSBlbmVyZ3kgcmVtYWlucyBhcm91bmQgMC41LCBldmVuIHdoZW4geW91IHNoYWtlIHZlcnkgaGFyZC5cblxuICAgICAgYWNjZWxlcmF0aW9uRW5lcmd5ID0gTWF0aC5taW4oYWNjZWxlcmF0aW9uTWFnbml0dWRlIC8gdGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlQ3VycmVudE1heCwgMSk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgdGhlIHJvdGF0aW9uIHJhdGUgbW9kdWxlIGFuZCBjYWxjdWxhdGUgYW4gZXN0aW1hdGlvbiBvZiB0aGUgZW5lcmd5IHZhbHVlIGZyb20gdGhlIGxhdGVzdCByb3RhdGlvbiByYXRlIHZhbHVlXG4gICAgaWYgKHRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZS5pc1ZhbGlkKSB7XG4gICAgICBsZXQgckEgPSB0aGlzLl9yb3RhdGlvblJhdGVWYWx1ZXNbMF07XG4gICAgICBsZXQgckIgPSB0aGlzLl9yb3RhdGlvblJhdGVWYWx1ZXNbMV07XG4gICAgICBsZXQgckcgPSB0aGlzLl9yb3RhdGlvblJhdGVWYWx1ZXNbMl07XG4gICAgICBsZXQgcm90YXRpb25SYXRlTWFnbml0dWRlID0gTWF0aC5zcXJ0KHJBICogckEgKyByQiAqIHJCICsgckcgKiByRyk7XG5cbiAgICAgIC8vIFN0b3JlIHRoZSBtYXhpbXVtIHJvdGF0aW9uIHJhdGUgbWFnbml0dWRlIHJlYWNoZWQgc28gZmFyLCBjbGlwcGVkIGF0IGB0aGlzLl9yb3RhdGlvblJhdGVNYWduaXR1ZGVUaHJlc2hvbGRgXG4gICAgICBpZiAodGhpcy5fcm90YXRpb25SYXRlTWFnbml0dWRlQ3VycmVudE1heCA8IHJvdGF0aW9uUmF0ZU1hZ25pdHVkZSlcbiAgICAgICAgdGhpcy5fcm90YXRpb25SYXRlTWFnbml0dWRlQ3VycmVudE1heCA9IE1hdGgubWluKHJvdGF0aW9uUmF0ZU1hZ25pdHVkZSwgdGhpcy5fcm90YXRpb25SYXRlTWFnbml0dWRlVGhyZXNob2xkKTtcblxuICAgICAgcm90YXRpb25SYXRlRW5lcmd5ID0gTWF0aC5taW4ocm90YXRpb25SYXRlTWFnbml0dWRlIC8gdGhpcy5fcm90YXRpb25SYXRlTWFnbml0dWRlQ3VycmVudE1heCwgMSk7XG4gICAgfVxuXG4gICAgbGV0IGVuZXJneSA9IE1hdGgubWF4KGFjY2VsZXJhdGlvbkVuZXJneSwgcm90YXRpb25SYXRlRW5lcmd5KTtcblxuICAgIC8vIExvdy1wYXNzIGZpbHRlciB0byBzbW9vdGggdGhlIGVuZXJneSB2YWx1ZXNcbiAgICBjb25zdCBrID0gdGhpcy5fZW5lcmd5RGVjYXk7XG4gICAgdGhpcy5ldmVudCA9IGsgKiB0aGlzLmV2ZW50ICsgKDEgLSBrKSAqIGVuZXJneTtcblxuICAgIC8vIEVtaXQgdGhlIGVuZXJneSB2YWx1ZVxuICAgIHRoaXMuZW1pdCh0aGlzLmV2ZW50KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRW5lcmd5TW9kdWxlKCk7XG4iXX0=