/**
 * @fileoverview `DOMEventSubmodule` module
 * @author <a href='mailto:sebastien@robaszkiewicz.com'>Sébastien Robaszkiewicz</a>, <a href='mailto:Norbert.Schnell@ircam.fr'>Norbert Schnell</a>
 */

'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var InputModule = require('./InputModule');

/**
 * `DOMEventSubmodule` class.
 * The `DOMEventSubmodule` class allows to instantiate modules that provide
 * unified values (such as `AccelerationIncludingGravity`, `Acceleration`,
 * `RotationRate`, `Orientation`, `OrientationAlt) from the `devicemotion`
 * or `deviceorientation` DOM events.
 *
 * @class DOMEventSubmodule
 * @extends InputModule
 */

var DOMEventSubmodule = (function (_InputModule) {
  _inherits(DOMEventSubmodule, _InputModule);

  /**
   * Creates a `DOMEventSubmodule` module instance.
   *
   * @constructor
   * @param {DeviceMotionModule|DeviceOrientationModule} DOMEventModule - The parent DOM event module.
   * @param {string} eventType - The name of the submodule / event (*e.g.* 'acceleration' or 'orientationAlt').
   * @see DeviceMotionModule
   * @see DeviceOrientationModule
   */

  function DOMEventSubmodule(DOMEventModule, eventType) {
    _classCallCheck(this, DOMEventSubmodule);

    _get(Object.getPrototypeOf(DOMEventSubmodule.prototype), 'constructor', this).call(this, eventType);

    /**
     * The DOM event parent module from which this module gets the raw values.
     *
     * @this DOMEventSubmodule
     * @type {DeviceMotionModule|DeviceOrientationModule}
     * @constant
     */
    this.DOMEventModule = DOMEventModule;

    /**
     * Raw values coming from the `devicemotion` event sent by this module.
     *
     * @this DOMEventSubmodule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    this.event = [0, 0, 0];

    /**
     * Compass heading reference (iOS devices only, `Orientation` and `OrientationAlt` submodules only).
     *
     * @this DOMEventSubmodule
     * @type {number}
     * @default null
     */
    this._webkitCompassHeadingReference = null;
  }

  /**
   * Starts the module.
   */

  _createClass(DOMEventSubmodule, [{
    key: 'start',
    value: function start() {
      this.DOMEventModule._addListener();
    }

    /**
     * Stops the module.
     */
  }, {
    key: 'stop',
    value: function stop() {
      this.DOMEventModule._removeListener();
    }

    /**
     * Initializes of the module.
     *
     * @return {Promise}
     */
  }, {
    key: 'init',
    value: function init() {
      var _this = this;

      // Indicate to the parent module that this event is required
      this.DOMEventModule.required[this.eventType] = true;

      // If the parent event has not been initialized yet, initialize it
      var DOMEventPromise = this.DOMEventModule.promise;
      if (!DOMEventPromise) DOMEventPromise = this.DOMEventModule.init();

      return DOMEventPromise.then(function (module) {
        return _this;
      });
    }
  }]);

  return DOMEventSubmodule;
})(InputModule);

module.exports = DOMEventSubmodule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9ET01FdmVudFN1Ym1vZHVsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUtBLFlBQVksQ0FBQzs7Ozs7Ozs7OztBQUViLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7OztJQVl2QyxpQkFBaUI7WUFBakIsaUJBQWlCOzs7Ozs7Ozs7Ozs7QUFXVixXQVhQLGlCQUFpQixDQVdULGNBQWMsRUFBRSxTQUFTLEVBQUU7MEJBWG5DLGlCQUFpQjs7QUFZbkIsK0JBWkUsaUJBQWlCLDZDQVliLFNBQVMsRUFBRTs7Ozs7Ozs7O0FBU2pCLFFBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDOzs7Ozs7Ozs7QUFTckMsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7OztBQVN2QixRQUFJLENBQUMsOEJBQThCLEdBQUcsSUFBSSxDQUFDO0dBQzVDOzs7Ozs7ZUF4Q0csaUJBQWlCOztXQTZDaEIsaUJBQUc7QUFDTixVQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ3BDOzs7Ozs7O1dBS0csZ0JBQUc7QUFDTCxVQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRSxDQUFDO0tBQ3ZDOzs7Ozs7Ozs7V0FPRyxnQkFBRzs7OztBQUVMLFVBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7OztBQUdwRCxVQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQztBQUNsRCxVQUFJLENBQUMsZUFBZSxFQUNsQixlQUFlLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFL0MsYUFBTyxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBTTs7T0FBUyxDQUFDLENBQUM7S0FDL0M7OztTQXZFRyxpQkFBaUI7R0FBUyxXQUFXOztBQTBFM0MsTUFBTSxDQUFDLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyIsImZpbGUiOiJzcmMvRE9NRXZlbnRTdWJtb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgYERPTUV2ZW50U3VibW9kdWxlYCBtb2R1bGVcbiAqIEBhdXRob3IgPGEgaHJlZj0nbWFpbHRvOnNlYmFzdGllbkByb2Jhc3praWV3aWN6LmNvbSc+U8OpYmFzdGllbiBSb2Jhc3praWV3aWN6PC9hPiwgPGEgaHJlZj0nbWFpbHRvOk5vcmJlcnQuU2NobmVsbEBpcmNhbS5mcic+Tm9yYmVydCBTY2huZWxsPC9hPlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgSW5wdXRNb2R1bGUgPSByZXF1aXJlKCcuL0lucHV0TW9kdWxlJyk7XG5cbi8qKlxuICogYERPTUV2ZW50U3VibW9kdWxlYCBjbGFzcy5cbiAqIFRoZSBgRE9NRXZlbnRTdWJtb2R1bGVgIGNsYXNzIGFsbG93cyB0byBpbnN0YW50aWF0ZSBtb2R1bGVzIHRoYXQgcHJvdmlkZVxuICogdW5pZmllZCB2YWx1ZXMgKHN1Y2ggYXMgYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCBgQWNjZWxlcmF0aW9uYCxcbiAqIGBSb3RhdGlvblJhdGVgLCBgT3JpZW50YXRpb25gLCBgT3JpZW50YXRpb25BbHQpIGZyb20gdGhlIGBkZXZpY2Vtb3Rpb25gXG4gKiBvciBgZGV2aWNlb3JpZW50YXRpb25gIERPTSBldmVudHMuXG4gKlxuICogQGNsYXNzIERPTUV2ZW50U3VibW9kdWxlXG4gKiBAZXh0ZW5kcyBJbnB1dE1vZHVsZVxuICovXG5jbGFzcyBET01FdmVudFN1Ym1vZHVsZSBleHRlbmRzIElucHV0TW9kdWxlIHtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGBET01FdmVudFN1Ym1vZHVsZWAgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25Nb2R1bGV8RGV2aWNlT3JpZW50YXRpb25Nb2R1bGV9IERPTUV2ZW50TW9kdWxlIC0gVGhlIHBhcmVudCBET00gZXZlbnQgbW9kdWxlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gVGhlIG5hbWUgb2YgdGhlIHN1Ym1vZHVsZSAvIGV2ZW50ICgqZS5nLiogJ2FjY2VsZXJhdGlvbicgb3IgJ29yaWVudGF0aW9uQWx0JykuXG4gICAqIEBzZWUgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAqIEBzZWUgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKERPTUV2ZW50TW9kdWxlLCBldmVudFR5cGUpIHtcbiAgICBzdXBlcihldmVudFR5cGUpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIERPTSBldmVudCBwYXJlbnQgbW9kdWxlIGZyb20gd2hpY2ggdGhpcyBtb2R1bGUgZ2V0cyB0aGUgcmF3IHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERPTUV2ZW50U3VibW9kdWxlXG4gICAgICogQHR5cGUge0RldmljZU1vdGlvbk1vZHVsZXxEZXZpY2VPcmllbnRhdGlvbk1vZHVsZX1cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICB0aGlzLkRPTUV2ZW50TW9kdWxlID0gRE9NRXZlbnRNb2R1bGU7XG5cbiAgICAvKipcbiAgICAgKiBSYXcgdmFsdWVzIGNvbWluZyBmcm9tIHRoZSBgZGV2aWNlbW90aW9uYCBldmVudCBzZW50IGJ5IHRoaXMgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgRE9NRXZlbnRTdWJtb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgdGhpcy5ldmVudCA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIENvbXBhc3MgaGVhZGluZyByZWZlcmVuY2UgKGlPUyBkZXZpY2VzIG9ubHksIGBPcmllbnRhdGlvbmAgYW5kIGBPcmllbnRhdGlvbkFsdGAgc3VibW9kdWxlcyBvbmx5KS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERPTUV2ZW50U3VibW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICovXG4gICAgdGhpcy5fd2Via2l0Q29tcGFzc0hlYWRpbmdSZWZlcmVuY2UgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5ET01FdmVudE1vZHVsZS5fYWRkTGlzdGVuZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wcyB0aGUgbW9kdWxlLlxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLkRPTUV2ZW50TW9kdWxlLl9yZW1vdmVMaXN0ZW5lcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIG9mIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBpbml0KCkge1xuICAgIC8vIEluZGljYXRlIHRvIHRoZSBwYXJlbnQgbW9kdWxlIHRoYXQgdGhpcyBldmVudCBpcyByZXF1aXJlZFxuICAgIHRoaXMuRE9NRXZlbnRNb2R1bGUucmVxdWlyZWRbdGhpcy5ldmVudFR5cGVdID0gdHJ1ZTtcblxuICAgIC8vIElmIHRoZSBwYXJlbnQgZXZlbnQgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkIHlldCwgaW5pdGlhbGl6ZSBpdFxuICAgIGxldCBET01FdmVudFByb21pc2UgPSB0aGlzLkRPTUV2ZW50TW9kdWxlLnByb21pc2U7XG4gICAgaWYgKCFET01FdmVudFByb21pc2UpXG4gICAgICBET01FdmVudFByb21pc2UgPSB0aGlzLkRPTUV2ZW50TW9kdWxlLmluaXQoKTtcblxuICAgIHJldHVybiBET01FdmVudFByb21pc2UudGhlbigobW9kdWxlKSA9PiB0aGlzKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERPTUV2ZW50U3VibW9kdWxlOyJdfQ==