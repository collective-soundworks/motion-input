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

    _this._onAcceleration = _this._onAcceleration.bind(_this);
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
  }, {
    key: 'addListener',
    value: function addListener(listener) {
      if (this.listeners.size === 0) {
        if (this._accelerationModule.isValid) this._accelerationModule.addListener(this._onAcceleration);
        if (this._rotationRateModule.isValid) this._rotationRateModule.addListener(this._onRotationRate);
      }

      _get(EnergyModule.prototype.__proto__ || Object.getPrototypeOf(EnergyModule.prototype), 'addListener', this).call(this, listener);
    }
  }, {
    key: 'removeListener',
    value: function removeListener(listener) {
      _get(EnergyModule.prototype.__proto__ || Object.getPrototypeOf(EnergyModule.prototype), 'removeListener', this).call(this, listener);

      if (this.listeners.size === 0) {
        if (this._accelerationModule.isValid) this._accelerationModule.removeListener(this._onAcceleration);
        if (this._rotationRateModule.isValid) this._rotationRateModule.removeListener(this._onRotationRate);
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVuZXJneU1vZHVsZS5qcyJdLCJuYW1lcyI6WyJFbmVyZ3lNb2R1bGUiLCJldmVudCIsIl9hY2NlbGVyYXRpb25Nb2R1bGUiLCJfYWNjZWxlcmF0aW9uVmFsdWVzIiwiX2FjY2VsZXJhdGlvbk1hZ25pdHVkZUN1cnJlbnRNYXgiLCJfYWNjZWxlcmF0aW9uTWFnbml0dWRlVGhyZXNob2xkIiwiX3JvdGF0aW9uUmF0ZU1vZHVsZSIsIl9yb3RhdGlvblJhdGVWYWx1ZXMiLCJfcm90YXRpb25SYXRlTWFnbml0dWRlQ3VycmVudE1heCIsIl9yb3RhdGlvblJhdGVNYWduaXR1ZGVUaHJlc2hvbGQiLCJfZW5lcmd5VGltZUNvbnN0YW50IiwiX29uQWNjZWxlcmF0aW9uIiwiYmluZCIsIl9vblJvdGF0aW9uUmF0ZSIsInJlc29sdmUiLCJQcm9taXNlIiwiYWxsIiwicmVxdWlyZU1vZHVsZSIsInRoZW4iLCJtb2R1bGVzIiwiYWNjZWxlcmF0aW9uIiwicm90YXRpb25SYXRlIiwiaXNDYWxjdWxhdGVkIiwiaXNWYWxpZCIsInBlcmlvZCIsImxpc3RlbmVyIiwibGlzdGVuZXJzIiwic2l6ZSIsImFkZExpc3RlbmVyIiwicmVtb3ZlTGlzdGVuZXIiLCJfY2FsY3VsYXRlRW5lcmd5IiwiYWNjZWxlcmF0aW9uRW5lcmd5Iiwicm90YXRpb25SYXRlRW5lcmd5IiwiYVgiLCJhWSIsImFaIiwiYWNjZWxlcmF0aW9uTWFnbml0dWRlIiwiTWF0aCIsInNxcnQiLCJtaW4iLCJyQSIsInJCIiwickciLCJyb3RhdGlvblJhdGVNYWduaXR1ZGUiLCJlbmVyZ3kiLCJtYXgiLCJrIiwiX2VuZXJneURlY2F5IiwiZW1pdCIsImV4cCIsIlBJIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7OztJQVVNQSxZOzs7QUFFSjs7Ozs7QUFLQSwwQkFBYztBQUFBOztBQUdaOzs7Ozs7O0FBSFksNEhBQ04sUUFETTs7QUFVWixVQUFLQyxL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QUFLQSxFQUFMLEdBQVVDLEtBQUtBLEVBQWYsR0FBb0JDLEtBQUtBLEVBQW5DLENBQTVCOztBQUVBO0FBQ0EsWUFBSSxLQUFLbEMsZ0NBQUwsR0FBd0NtQyxxQkFBNUMsRUFDRSxLQUFLbkMsZ0NBQUwsR0FBd0M2QixLQUFLRSxHQUFMLENBQVNJLHFCQUFULEVBQWdDLEtBQUtsQywrQkFBckMsQ0FBeEM7O0FBRUZ1Qiw2QkFBcUJLLEtBQUtFLEdBQUwsQ0FBU0ksd0JBQXdCLEtBQUtuQyxnQ0FBdEMsRUFBd0UsQ0FBeEUsQ0FBckI7QUFDRDs7QUFFRCxVQUFJb0MsU0FBU1AsS0FBS1EsR0FBTCxDQUFTZCxrQkFBVCxFQUE2QkMsa0JBQTdCLENBQWI7O0FBRUE7QUFDQSxVQUFNYyxJQUFJLEtBQUtDLFlBQWY7QUFDQSxXQUFLOUMsS0FBTCxHQUFhNkMsSUFBSSxLQUFLN0MsS0FBVCxHQUFpQixDQUFDLElBQUk2QyxDQUFMLElBQVVGLE1BQXhDOztBQUVBO0FBQ0EsV0FBS0ksSUFBTCxDQUFVLEtBQUsvQyxLQUFmO0FBQ0Q7Ozt3QkEzSWtCO0FBQ2pCLGFBQU9vQyxLQUFLWSxHQUFMLENBQVMsQ0FBQyxDQUFELEdBQUtaLEtBQUthLEVBQVYsR0FBZSxLQUFLMUIsTUFBcEIsR0FBNkIsS0FBS2QsbUJBQTNDLENBQVA7QUFDRDs7Ozs7O2tCQTRJWSxJQUFJVixZQUFKLEUiLCJmaWxlIjoiRW5lcmd5TW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IElucHV0TW9kdWxlIGZyb20gJy4vSW5wdXRNb2R1bGUnO1xuaW1wb3J0IG1vdGlvbklucHV0IGZyb20gJy4vTW90aW9uSW5wdXQnO1xuXG4vKipcbiAqIEVuZXJneSBtb2R1bGUgc2luZ2xldG9uLlxuICogVGhlIGVuZXJneSBtb2R1bGUgc2luZ2xldG9uIHByb3ZpZGVzIGVuZXJneSB2YWx1ZXMgKGJldHdlZW4gMCBhbmQgMSlcbiAqIGJhc2VkIG9uIHRoZSBhY2NlbGVyYXRpb24gYW5kIHRoZSByb3RhdGlvbiByYXRlIG9mIHRoZSBkZXZpY2UuXG4gKiBUaGUgcGVyaW9kIG9mIHRoZSBlbmVyZ3kgdmFsdWVzIGlzIHRoZSBzYW1lIGFzIHRoZSBwZXJpb2Qgb2YgdGhlXG4gKiBhY2NlbGVyYXRpb24gYW5kIHRoZSByb3RhdGlvbiByYXRlIHZhbHVlcy5cbiAqXG4gKiBAY2xhc3MgRW5lcmd5TW9kdWxlXG4gKiBAZXh0ZW5kcyBJbnB1dE1vZHVsZVxuICovXG5jbGFzcyBFbmVyZ3lNb2R1bGUgZXh0ZW5kcyBJbnB1dE1vZHVsZSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGVuZXJneSBtb2R1bGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJ2VuZXJneScpO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnQgY29udGFpbmluZyB0aGUgdmFsdWUgb2YgdGhlIGVuZXJneSwgc2VudCBieSB0aGUgZW5lcmd5IG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIHRoaXMuZXZlbnQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFjY2VsZXJhdGlvbiBtb2R1bGUsIHVzZWQgaW4gdGhlIGNhbGN1bGF0aW9uIG9mIHRoZSBlbmVyZ3kuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7RE9NRXZlbnRTdWJtb2R1bGV9XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqIEBzZWUgRGV2aWNlbW90aW9uTW9kdWxlXG4gICAgICovXG4gICAgdGhpcy5fYWNjZWxlcmF0aW9uTW9kdWxlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIExhdGVzdCBhY2NlbGVyYXRpb24gdmFsdWUgc2VudCBieSB0aGUgYWNjZWxlcmF0aW9uIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICovXG4gICAgdGhpcy5fYWNjZWxlcmF0aW9uVmFsdWVzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gdmFsdWUgcmVhY2hlZCBieSB0aGUgYWNjZWxlcmF0aW9uIG1hZ25pdHVkZSwgY2xpcHBlZCBhdCBgdGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlVGhyZXNob2xkYC5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgOS44MVxuICAgICAqL1xuICAgIHRoaXMuX2FjY2VsZXJhdGlvbk1hZ25pdHVkZUN1cnJlbnRNYXggPSAxICogOS44MTtcblxuICAgIC8qKlxuICAgICAqIENsaXBwaW5nIHZhbHVlIG9mIHRoZSBhY2NlbGVyYXRpb24gbWFnbml0dWRlLlxuICAgICAqXG4gICAgICogQHRoaXMgRW5lcmd5TW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAyMFxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIHRoaXMuX2FjY2VsZXJhdGlvbk1hZ25pdHVkZVRocmVzaG9sZCA9IDQgKiA5LjgxO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJvdGF0aW9uIHJhdGUgbW9kdWxlLCB1c2VkIGluIHRoZSBjYWxjdWxhdGlvbiBvZiB0aGUgZW5lcmd5LlxuICAgICAqXG4gICAgICogQHRoaXMgRW5lcmd5TW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKiBAc2VlIERldmljZW1vdGlvbk1vZHVsZVxuICAgICAqL1xuICAgIHRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBMYXRlc3Qgcm90YXRpb24gcmF0ZSB2YWx1ZSBzZW50IGJ5IHRoZSByb3RhdGlvbiByYXRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICovXG4gICAgdGhpcy5fcm90YXRpb25SYXRlVmFsdWVzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gdmFsdWUgcmVhY2hlZCBieSB0aGUgcm90YXRpb24gcmF0ZSBtYWduaXR1ZGUsIGNsaXBwZWQgYXQgYHRoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZVRocmVzaG9sZGAuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDQwMFxuICAgICAqL1xuICAgIHRoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZUN1cnJlbnRNYXggPSA0MDA7XG5cbiAgICAvKipcbiAgICAgKiBDbGlwcGluZyB2YWx1ZSBvZiB0aGUgcm90YXRpb24gcmF0ZSBtYWduaXR1ZGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDYwMFxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIHRoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZVRocmVzaG9sZCA9IDYwMDtcblxuICAgIC8qKlxuICAgICAqIFRpbWUgY29uc3RhbnQgKGhhbGYtbGlmZSkgb2YgdGhlIGxvdy1wYXNzIGZpbHRlciB1c2VkIHRvIHNtb290aCB0aGUgZW5lcmd5IHZhbHVlcyAoaW4gc2Vjb25kcykuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDAuMVxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIHRoaXMuX2VuZXJneVRpbWVDb25zdGFudCA9IDAuMTtcblxuICAgIHRoaXMuX29uQWNjZWxlcmF0aW9uID0gdGhpcy5fb25BY2NlbGVyYXRpb24uYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblJvdGF0aW9uUmF0ZSA9IHRoaXMuX29uUm90YXRpb25SYXRlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogRGVjYXkgZmFjdG9yIG9mIHRoZSBsb3ctcGFzcyBmaWx0ZXIgdXNlZCB0byBzbW9vdGggdGhlIGVuZXJneSB2YWx1ZXMuXG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IF9lbmVyZ3lEZWNheSgpIHtcbiAgICByZXR1cm4gTWF0aC5leHAoLTIgKiBNYXRoLlBJICogdGhpcy5wZXJpb2QgLyB0aGlzLl9lbmVyZ3lUaW1lQ29uc3RhbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIG9mIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBpbml0KCkge1xuICAgIHJldHVybiBzdXBlci5pbml0KChyZXNvbHZlKSA9PiB7XG4gICAgICAvLyBUaGUgZW5lcmd5IG1vZHVsZSByZXF1aXJlcyB0aGUgYWNjZWxlcmF0aW9uIGFuZCB0aGUgcm90YXRpb24gcmF0ZSBtb2R1bGVzXG4gICAgICBQcm9taXNlLmFsbChbbW90aW9uSW5wdXQucmVxdWlyZU1vZHVsZSgnYWNjZWxlcmF0aW9uJyksIG1vdGlvbklucHV0LnJlcXVpcmVNb2R1bGUoJ3JvdGF0aW9uUmF0ZScpXSlcbiAgICAgICAgLnRoZW4oKG1vZHVsZXMpID0+IHtcbiAgICAgICAgICBjb25zdCBbYWNjZWxlcmF0aW9uLCByb3RhdGlvblJhdGVdID0gbW9kdWxlcztcblxuICAgICAgICAgIHRoaXMuX2FjY2VsZXJhdGlvbk1vZHVsZSA9IGFjY2VsZXJhdGlvbjtcbiAgICAgICAgICB0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUgPSByb3RhdGlvblJhdGU7XG4gICAgICAgICAgdGhpcy5pc0NhbGN1bGF0ZWQgPSB0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUuaXNWYWxpZCB8fCB0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUuaXNWYWxpZDtcblxuICAgICAgICAgIGlmICh0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUuaXNWYWxpZClcbiAgICAgICAgICAgIHRoaXMucGVyaW9kID0gdGhpcy5fYWNjZWxlcmF0aW9uTW9kdWxlLnBlcmlvZDtcbiAgICAgICAgICBlbHNlIGlmICh0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUuaXNWYWxpZClcbiAgICAgICAgICAgIHRoaXMucGVyaW9kID0gdGhpcy5fcm90YXRpb25SYXRlTW9kdWxlLnBlcmlvZDtcblxuICAgICAgICAgIHJlc29sdmUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICBpZiAodGhpcy5saXN0ZW5lcnMuc2l6ZSA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMuX2FjY2VsZXJhdGlvbk1vZHVsZS5pc1ZhbGlkKVxuICAgICAgICB0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUuYWRkTGlzdGVuZXIodGhpcy5fb25BY2NlbGVyYXRpb24pO1xuICAgICAgaWYgKHRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZS5pc1ZhbGlkKVxuICAgICAgICB0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUuYWRkTGlzdGVuZXIodGhpcy5fb25Sb3RhdGlvblJhdGUpO1xuICAgIH1cblxuICAgIHN1cGVyLmFkZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgc3VwZXIucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgaWYgKHRoaXMubGlzdGVuZXJzLnNpemUgPT09IDApIHtcbiAgICAgIGlmICh0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUuaXNWYWxpZClcbiAgICAgICAgdGhpcy5fYWNjZWxlcmF0aW9uTW9kdWxlLnJlbW92ZUxpc3RlbmVyKHRoaXMuX29uQWNjZWxlcmF0aW9uKTtcbiAgICAgIGlmICh0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUuaXNWYWxpZClcbiAgICAgICAgdGhpcy5fcm90YXRpb25SYXRlTW9kdWxlLnJlbW92ZUxpc3RlbmVyKHRoaXMuX29uUm90YXRpb25SYXRlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWNjZWxlcmF0aW9uIHZhbHVlcyBoYW5kbGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcltdfSBhY2NlbGVyYXRpb24gLSBMYXRlc3QgYWNjZWxlcmF0aW9uIHZhbHVlLlxuICAgKi9cbiAgX29uQWNjZWxlcmF0aW9uKGFjY2VsZXJhdGlvbikge1xuICAgIHRoaXMuX2FjY2VsZXJhdGlvblZhbHVlcyA9IGFjY2VsZXJhdGlvbjtcblxuICAgIC8vIElmIHRoZSByb3RhdGlvbiByYXRlIHZhbHVlcyBhcmUgbm90IGF2YWlsYWJsZSwgd2UgY2FsY3VsYXRlIHRoZSBlbmVyZ3kgcmlnaHQgYXdheS5cbiAgICBpZiAoIXRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZS5pc1ZhbGlkKVxuICAgICAgdGhpcy5fY2FsY3VsYXRlRW5lcmd5KCk7XG4gIH1cblxuICAvKipcbiAgICogUm90YXRpb24gcmF0ZSB2YWx1ZXMgaGFuZGxlci5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJbXX0gcm90YXRpb25SYXRlIC0gTGF0ZXN0IHJvdGF0aW9uIHJhdGUgdmFsdWUuXG4gICAqL1xuICBfb25Sb3RhdGlvblJhdGUocm90YXRpb25SYXRlKSB7XG4gICAgdGhpcy5fcm90YXRpb25SYXRlVmFsdWVzID0gcm90YXRpb25SYXRlO1xuXG4gICAgLy8gV2Uga25vdyB0aGF0IHRoZSBhY2NlbGVyYXRpb24gYW5kIHJvdGF0aW9uIHJhdGUgdmFsdWVzIGNvbWluZyBmcm9tIHRoZVxuICAgIC8vIHNhbWUgYGRldmljZW1vdGlvbmAgZXZlbnQgYXJlIHNlbnQgaW4gdGhhdCBvcmRlciAoYWNjZWxlcmF0aW9uID4gcm90YXRpb24gcmF0ZSlcbiAgICAvLyBzbyB3aGVuIHRoZSByb3RhdGlvbiByYXRlIGlzIHByb3ZpZGVkLCB3ZSBjYWxjdWxhdGUgdGhlIGVuZXJneSB2YWx1ZSBvZiB0aGVcbiAgICAvLyBsYXRlc3QgYGRldmljZW1vdGlvbmAgZXZlbnQgd2hlbiB3ZSByZWNlaXZlIHRoZSByb3RhdGlvbiByYXRlIHZhbHVlcy5cbiAgICB0aGlzLl9jYWxjdWxhdGVFbmVyZ3koKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbmVyZ3kgY2FsY3VsYXRpb246IGVtaXRzIGFuIGVuZXJneSB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNoZWNrcyBpZiB0aGUgYWNjZWxlcmF0aW9uIG1vZHVsZXMgaXMgdmFsaWQuIElmIHRoYXQgaXMgdGhlIGNhc2UsXG4gICAqIGl0IGNhbGN1bGF0ZXMgYW4gZXN0aW1hdGlvbiBvZiB0aGUgZW5lcmd5IChiZXR3ZWVuIDAgYW5kIDEpIGJhc2VkIG9uIHRoZSByYXRpb1xuICAgKiBvZiB0aGUgY3VycmVudCBhY2NlbGVyYXRpb24gbWFnbml0dWRlIGFuZCB0aGUgbWF4aW11bSBhY2NlbGVyYXRpb24gbWFnbml0dWRlXG4gICAqIHJlYWNoZWQgc28gZmFyIChjbGlwcGVkIGF0IHRoZSBgdGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlVGhyZXNob2xkYCB2YWx1ZSkuXG4gICAqIChXZSB1c2UgdGhpcyB0cmljayB0byBnZXQgdW5pZm9ybSBiZWhhdmlvcnMgYW1vbmcgZGV2aWNlcy4gSWYgd2UgY2FsY3VsYXRlZFxuICAgKiB0aGUgcmF0aW8gYmFzZWQgb24gYSBmaXhlZCB2YWx1ZSBpbmRlcGVuZGVudCBvZiB3aGF0IHRoZSBkZXZpY2UgaXMgY2FwYWJsZSBvZlxuICAgKiBwcm92aWRpbmcsIHdlIGNvdWxkIGdldCBpbmNvbnNpc3RlbnQgYmVoYXZpb3JzLiBGb3IgaW5zdGFuY2UsIHRoZSBkZXZpY2VzXG4gICAqIHdob3NlIGFjY2VsZXJvbWV0ZXJzIGFyZSBsaW1pdGVkIGF0IDJnIHdvdWxkIGFsd2F5cyBwcm92aWRlIHZlcnkgbG93IHZhbHVlc1xuICAgKiBjb21wYXJlZCB0byBkZXZpY2VzIHdpdGggYWNjZWxlcm9tZXRlcnMgY2FwYWJsZSBvZiBtZWFzdXJpbmcgNGcgYWNjZWxlcmF0aW9ucy4pXG4gICAqIFRoZSBzYW1lIGNoZWNrcyBhbmQgY2FsY3VsYXRpb25zIGFyZSBtYWRlIG9uIHRoZSByb3RhdGlvbiByYXRlIG1vZHVsZS5cbiAgICogRmluYWxseSwgdGhlIGVuZXJneSB2YWx1ZSBpcyB0aGUgbWF4aW11bSBiZXR3ZWVuIHRoZSBlbmVyZ3kgdmFsdWUgZXN0aW1hdGVkXG4gICAqIGZyb20gdGhlIGFjY2VsZXJhdGlvbiwgYW5kIHRoZSBvbmUgZXN0aW1hdGVkIGZyb20gdGhlIHJvdGF0aW9uIHJhdGUuIEl0IGlzXG4gICAqIHNtb290aGVkIHRocm91Z2ggYSBsb3ctcGFzcyBmaWx0ZXIuXG4gICAqL1xuICBfY2FsY3VsYXRlRW5lcmd5KCkge1xuICAgIGxldCBhY2NlbGVyYXRpb25FbmVyZ3kgPSAwO1xuICAgIGxldCByb3RhdGlvblJhdGVFbmVyZ3kgPSAwO1xuXG4gICAgLy8gQ2hlY2sgdGhlIGFjY2VsZXJhdGlvbiBtb2R1bGUgYW5kIGNhbGN1bGF0ZSBhbiBlc3RpbWF0aW9uIG9mIHRoZSBlbmVyZ3kgdmFsdWUgZnJvbSB0aGUgbGF0ZXN0IGFjY2VsZXJhdGlvbiB2YWx1ZVxuICAgIGlmICh0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUuaXNWYWxpZCkge1xuICAgICAgbGV0IGFYID0gdGhpcy5fYWNjZWxlcmF0aW9uVmFsdWVzWzBdO1xuICAgICAgbGV0IGFZID0gdGhpcy5fYWNjZWxlcmF0aW9uVmFsdWVzWzFdO1xuICAgICAgbGV0IGFaID0gdGhpcy5fYWNjZWxlcmF0aW9uVmFsdWVzWzJdO1xuICAgICAgbGV0IGFjY2VsZXJhdGlvbk1hZ25pdHVkZSA9IE1hdGguc3FydChhWCAqIGFYICsgYVkgKiBhWSArIGFaICogYVopO1xuXG4gICAgICAvLyBTdG9yZSB0aGUgbWF4aW11bSBhY2NlbGVyYXRpb24gbWFnbml0dWRlIHJlYWNoZWQgc28gZmFyLCBjbGlwcGVkIGF0IGB0aGlzLl9hY2NlbGVyYXRpb25NYWduaXR1ZGVUaHJlc2hvbGRgXG4gICAgICBpZiAodGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlQ3VycmVudE1heCA8IGFjY2VsZXJhdGlvbk1hZ25pdHVkZSlcbiAgICAgICAgdGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlQ3VycmVudE1heCA9IE1hdGgubWluKGFjY2VsZXJhdGlvbk1hZ25pdHVkZSwgdGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlVGhyZXNob2xkKTtcbiAgICAgIC8vIFRPRE8oPyk6IHJlbW92ZSBvdWxpZXJzIC0tLSBvbiBzb21lIEFuZHJvaWQgZGV2aWNlcywgdGhlIG1hZ25pdHVkZSBpcyB2ZXJ5IGhpZ2ggb24gYSBmZXcgaXNvbGF0ZWQgZGF0YXBvaW50cyxcbiAgICAgIC8vIHdoaWNoIG1ha2UgdGhlIHRocmVzaG9sZCB2ZXJ5IGhpZ2ggYXMgd2VsbCA9PiB0aGUgZW5lcmd5IHJlbWFpbnMgYXJvdW5kIDAuNSwgZXZlbiB3aGVuIHlvdSBzaGFrZSB2ZXJ5IGhhcmQuXG5cbiAgICAgIGFjY2VsZXJhdGlvbkVuZXJneSA9IE1hdGgubWluKGFjY2VsZXJhdGlvbk1hZ25pdHVkZSAvIHRoaXMuX2FjY2VsZXJhdGlvbk1hZ25pdHVkZUN1cnJlbnRNYXgsIDEpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIHRoZSByb3RhdGlvbiByYXRlIG1vZHVsZSBhbmQgY2FsY3VsYXRlIGFuIGVzdGltYXRpb24gb2YgdGhlIGVuZXJneSB2YWx1ZSBmcm9tIHRoZSBsYXRlc3Qgcm90YXRpb24gcmF0ZSB2YWx1ZVxuICAgIGlmICh0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUuaXNWYWxpZCkge1xuICAgICAgbGV0IHJBID0gdGhpcy5fcm90YXRpb25SYXRlVmFsdWVzWzBdO1xuICAgICAgbGV0IHJCID0gdGhpcy5fcm90YXRpb25SYXRlVmFsdWVzWzFdO1xuICAgICAgbGV0IHJHID0gdGhpcy5fcm90YXRpb25SYXRlVmFsdWVzWzJdO1xuICAgICAgbGV0IHJvdGF0aW9uUmF0ZU1hZ25pdHVkZSA9IE1hdGguc3FydChyQSAqIHJBICsgckIgKiByQiArIHJHICogckcpO1xuXG4gICAgICAvLyBTdG9yZSB0aGUgbWF4aW11bSByb3RhdGlvbiByYXRlIG1hZ25pdHVkZSByZWFjaGVkIHNvIGZhciwgY2xpcHBlZCBhdCBgdGhpcy5fcm90YXRpb25SYXRlTWFnbml0dWRlVGhyZXNob2xkYFxuICAgICAgaWYgKHRoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZUN1cnJlbnRNYXggPCByb3RhdGlvblJhdGVNYWduaXR1ZGUpXG4gICAgICAgIHRoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZUN1cnJlbnRNYXggPSBNYXRoLm1pbihyb3RhdGlvblJhdGVNYWduaXR1ZGUsIHRoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZVRocmVzaG9sZCk7XG5cbiAgICAgIHJvdGF0aW9uUmF0ZUVuZXJneSA9IE1hdGgubWluKHJvdGF0aW9uUmF0ZU1hZ25pdHVkZSAvIHRoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZUN1cnJlbnRNYXgsIDEpO1xuICAgIH1cblxuICAgIGxldCBlbmVyZ3kgPSBNYXRoLm1heChhY2NlbGVyYXRpb25FbmVyZ3ksIHJvdGF0aW9uUmF0ZUVuZXJneSk7XG5cbiAgICAvLyBMb3ctcGFzcyBmaWx0ZXIgdG8gc21vb3RoIHRoZSBlbmVyZ3kgdmFsdWVzXG4gICAgY29uc3QgayA9IHRoaXMuX2VuZXJneURlY2F5O1xuICAgIHRoaXMuZXZlbnQgPSBrICogdGhpcy5ldmVudCArICgxIC0gaykgKiBlbmVyZ3k7XG5cbiAgICAvLyBFbWl0IHRoZSBlbmVyZ3kgdmFsdWVcbiAgICB0aGlzLmVtaXQodGhpcy5ldmVudCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEVuZXJneU1vZHVsZSgpO1xuIl19