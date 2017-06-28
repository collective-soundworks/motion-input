"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * `InputModule` class.
 * The `InputModule` class allows to instantiate modules that are part of the
 * motion input module, and that provide values (for instance, `deviceorientation`,
 * `acceleration`, `energy`).
 *
 * @class InputModule
 */
var InputModule = function () {

  /**
   * Creates an `InputModule` module instance.
   *
   * @constructor
   * @param {string} eventType - Name of the module / event (*e.g.* `deviceorientation, 'acceleration', 'energy').
   */
  function InputModule(eventType) {
    _classCallCheck(this, InputModule);

    /**
     * Event type of the module.
     *
     * @this InputModule
     * @type {string}
     * @constant
     */
    this.eventType = eventType;

    /**
     * Array of listeners attached to this module / event.
     *
     * @this InputModule
     * @type {Set<Function>}
     */
    this.listeners = new Set();

    /**
     * Event sent by this module.
     *
     * @this InputModule
     * @type {number|number[]}
     * @default null
     */
    this.event = null;

    /**
     * Module promise (resolved when the module is initialized).
     *
     * @this InputModule
     * @type {Promise}
     * @default null
     */
    this.promise = null;

    /**
     * Indicates if the module's event values are calculated from parent modules / events.
     *
     * @this InputModule
     * @type {bool}
     * @default false
     */
    this.isCalculated = false;

    /**
     * Indicates if the module's event values are provided by the device's sensors.
     * (*I.e.* indicates if the `'devicemotion'` or `'deviceorientation'` events provide the required raw values.)
     *
     * @this InputModule
     * @type {bool}
     * @default false
     */
    this.isProvided = false;

    /**
     * Period at which the module's events are sent (`undefined` if the events are not sent at regular intervals).
     *
     * @this InputModule
     * @type {number}
     * @default undefined
     */
    this.period = undefined;

    this.emit = this.emit.bind(this);
  }

  /**
   * Indicates whether the module can provide values or not.
   *
   * @type {bool}
   * @readonly
   */


  _createClass(InputModule, [{
    key: "init",


    /**
     * Initializes the module.
     *
     * @param {function} promiseFun - Promise function that takes the `resolve` and `reject` functions as arguments.
     * @return {Promise}
     */
    value: function init(promiseFun) {
      this.promise = new Promise(promiseFun);
      return this.promise;
    }

    /**
     * Adds a listener to the module.
     *
     * @param {function} listener - Listener to add.
     */

  }, {
    key: "addListener",
    value: function addListener(listener) {
      this.listeners.add(listener);
    }

    /**
     * Removes a listener from the module.
     *
     * @param {function} listener - Listener to remove.
     */

  }, {
    key: "removeListener",
    value: function removeListener(listener) {
      this.listeners.delete(listener);
    }

    /**
     * Propagates an event to all the module's listeners.
     *
     * @param {number|number[]} [event=this.event] - Event values to propagate to the module's listeners.
     */

  }, {
    key: "emit",
    value: function emit() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.event;

      this.listeners.forEach(function (listener) {
        return listener(event);
      });
    }
  }, {
    key: "isValid",
    get: function get() {
      return this.isProvided || this.isCalculated;
    }
  }]);

  return InputModule;
}();

exports.default = InputModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIklucHV0TW9kdWxlLmpzIl0sIm5hbWVzIjpbIklucHV0TW9kdWxlIiwiZXZlbnRUeXBlIiwibGlzdGVuZXJzIiwiU2V0IiwiZXZlbnQiLCJwcm9taXNlIiwiaXNDYWxjdWxhdGVkIiwiaXNQcm92aWRlZCIsInBlcmlvZCIsInVuZGVmaW5lZCIsImVtaXQiLCJiaW5kIiwicHJvbWlzZUZ1biIsIlByb21pc2UiLCJsaXN0ZW5lciIsImFkZCIsImRlbGV0ZSIsImZvckVhY2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7SUFRTUEsVzs7QUFFSjs7Ozs7O0FBTUEsdUJBQVlDLFNBQVosRUFBdUI7QUFBQTs7QUFFckI7Ozs7Ozs7QUFPQSxTQUFLQSxTQUFMLEdBQWlCQSxTQUFqQjs7QUFFQTs7Ozs7O0FBTUEsU0FBS0MsU0FBTCxHQUFpQixJQUFJQyxHQUFKLEVBQWpCOztBQUVBOzs7Ozs7O0FBT0EsU0FBS0MsS0FBTCxHQUFhLElBQWI7O0FBRUE7Ozs7Ozs7QUFPQSxTQUFLQyxPQUFMLEdBQWUsSUFBZjs7QUFFQTs7Ozs7OztBQU9BLFNBQUtDLFlBQUwsR0FBb0IsS0FBcEI7O0FBRUE7Ozs7Ozs7O0FBUUEsU0FBS0MsVUFBTCxHQUFrQixLQUFsQjs7QUFFQTs7Ozs7OztBQU9BLFNBQUtDLE1BQUwsR0FBY0MsU0FBZDs7QUFFQSxTQUFLQyxJQUFMLEdBQVksS0FBS0EsSUFBTCxDQUFVQyxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7OztBQVVBOzs7Ozs7eUJBTUtDLFUsRUFBWTtBQUNmLFdBQUtQLE9BQUwsR0FBZSxJQUFJUSxPQUFKLENBQVlELFVBQVosQ0FBZjtBQUNBLGFBQU8sS0FBS1AsT0FBWjtBQUNEOztBQUVEOzs7Ozs7OztnQ0FLWVMsUSxFQUFVO0FBQ3BCLFdBQUtaLFNBQUwsQ0FBZWEsR0FBZixDQUFtQkQsUUFBbkI7QUFDRDs7QUFFRDs7Ozs7Ozs7bUNBS2VBLFEsRUFBVTtBQUN2QixXQUFLWixTQUFMLENBQWVjLE1BQWYsQ0FBc0JGLFFBQXRCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzJCQUt5QjtBQUFBLFVBQXBCVixLQUFvQix1RUFBWixLQUFLQSxLQUFPOztBQUN2QixXQUFLRixTQUFMLENBQWVlLE9BQWYsQ0FBdUI7QUFBQSxlQUFZSCxTQUFTVixLQUFULENBQVo7QUFBQSxPQUF2QjtBQUNEOzs7d0JBeENhO0FBQ1osYUFBUSxLQUFLRyxVQUFMLElBQW1CLEtBQUtELFlBQWhDO0FBQ0Q7Ozs7OztrQkF5Q1lOLFciLCJmaWxlIjoiSW5wdXRNb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGBJbnB1dE1vZHVsZWAgY2xhc3MuXG4gKiBUaGUgYElucHV0TW9kdWxlYCBjbGFzcyBhbGxvd3MgdG8gaW5zdGFudGlhdGUgbW9kdWxlcyB0aGF0IGFyZSBwYXJ0IG9mIHRoZVxuICogbW90aW9uIGlucHV0IG1vZHVsZSwgYW5kIHRoYXQgcHJvdmlkZSB2YWx1ZXMgKGZvciBpbnN0YW5jZSwgYGRldmljZW9yaWVudGF0aW9uYCxcbiAqIGBhY2NlbGVyYXRpb25gLCBgZW5lcmd5YCkuXG4gKlxuICogQGNsYXNzIElucHV0TW9kdWxlXG4gKi9cbmNsYXNzIElucHV0TW9kdWxlIHtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgSW5wdXRNb2R1bGVgIG1vZHVsZSBpbnN0YW5jZS5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBOYW1lIG9mIHRoZSBtb2R1bGUgLyBldmVudCAoKmUuZy4qIGBkZXZpY2VvcmllbnRhdGlvbiwgJ2FjY2VsZXJhdGlvbicsICdlbmVyZ3knKS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGV2ZW50VHlwZSkge1xuXG4gICAgLyoqXG4gICAgICogRXZlbnQgdHlwZSBvZiB0aGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgSW5wdXRNb2R1bGVcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIHRoaXMuZXZlbnRUeXBlID0gZXZlbnRUeXBlO1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgbGlzdGVuZXJzIGF0dGFjaGVkIHRvIHRoaXMgbW9kdWxlIC8gZXZlbnQuXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtTZXQ8RnVuY3Rpb24+fVxuICAgICAqL1xuICAgIHRoaXMubGlzdGVuZXJzID0gbmV3IFNldCgpO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnQgc2VudCBieSB0aGlzIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIElucHV0TW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcnxudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICovXG4gICAgdGhpcy5ldmVudCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgcHJvbWlzZSAocmVzb2x2ZWQgd2hlbiB0aGUgbW9kdWxlIGlzIGluaXRpYWxpemVkKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIElucHV0TW9kdWxlXG4gICAgICogQHR5cGUge1Byb21pc2V9XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIHRoaXMucHJvbWlzZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIG1vZHVsZSdzIGV2ZW50IHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tIHBhcmVudCBtb2R1bGVzIC8gZXZlbnRzLlxuICAgICAqXG4gICAgICogQHRoaXMgSW5wdXRNb2R1bGVcbiAgICAgKiBAdHlwZSB7Ym9vbH1cbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIHRoaXMuaXNDYWxjdWxhdGVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIG1vZHVsZSdzIGV2ZW50IHZhbHVlcyBhcmUgcHJvdmlkZWQgYnkgdGhlIGRldmljZSdzIHNlbnNvcnMuXG4gICAgICogKCpJLmUuKiBpbmRpY2F0ZXMgaWYgdGhlIGAnZGV2aWNlbW90aW9uJ2Agb3IgYCdkZXZpY2VvcmllbnRhdGlvbidgIGV2ZW50cyBwcm92aWRlIHRoZSByZXF1aXJlZCByYXcgdmFsdWVzLilcbiAgICAgKlxuICAgICAqIEB0aGlzIElucHV0TW9kdWxlXG4gICAgICogQHR5cGUge2Jvb2x9XG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICB0aGlzLmlzUHJvdmlkZWQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFBlcmlvZCBhdCB3aGljaCB0aGUgbW9kdWxlJ3MgZXZlbnRzIGFyZSBzZW50IChgdW5kZWZpbmVkYCBpZiB0aGUgZXZlbnRzIGFyZSBub3Qgc2VudCBhdCByZWd1bGFyIGludGVydmFscykuXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgdW5kZWZpbmVkXG4gICAgICovXG4gICAgdGhpcy5wZXJpb2QgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLmVtaXQgPSB0aGlzLmVtaXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbW9kdWxlIGNhbiBwcm92aWRlIHZhbHVlcyBvciBub3QuXG4gICAqXG4gICAqIEB0eXBlIHtib29sfVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBpc1ZhbGlkKCkge1xuICAgIHJldHVybiAodGhpcy5pc1Byb3ZpZGVkIHx8IHRoaXMuaXNDYWxjdWxhdGVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcm9taXNlRnVuIC0gUHJvbWlzZSBmdW5jdGlvbiB0aGF0IHRha2VzIHRoZSBgcmVzb2x2ZWAgYW5kIGByZWplY3RgIGZ1bmN0aW9ucyBhcyBhcmd1bWVudHMuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBpbml0KHByb21pc2VGdW4pIHtcbiAgICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShwcm9taXNlRnVuKTtcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBsaXN0ZW5lciB0byB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIHRvIGFkZC5cbiAgICovXG4gIGFkZExpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGVzIGFuIGV2ZW50IHRvIGFsbCB0aGUgbW9kdWxlJ3MgbGlzdGVuZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcnxudW1iZXJbXX0gW2V2ZW50PXRoaXMuZXZlbnRdIC0gRXZlbnQgdmFsdWVzIHRvIHByb3BhZ2F0ZSB0byB0aGUgbW9kdWxlJ3MgbGlzdGVuZXJzLlxuICAgKi9cbiAgZW1pdChldmVudCA9IHRoaXMuZXZlbnQpIHtcbiAgICB0aGlzLmxpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IGxpc3RlbmVyKGV2ZW50KSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW5wdXRNb2R1bGU7XG4iXX0=