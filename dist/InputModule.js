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
     * @type {function[]}
     * @default []
     */
    this.listeners = [];

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
     * Starts the module.
     */

  }, {
    key: "start",
    value: function start() {}
    // abstract method


    /**
     * Stops the module.
     */

  }, {
    key: "stop",
    value: function stop() {}
    // abstract method


    /**
     * Adds a listener to the module.
     *
     * @param {function} listener - Listener to add.
     */

  }, {
    key: "addListener",
    value: function addListener(listener) {
      this.listeners.push(listener);

      // Start the module as soon as there is a listener
      if (this.listeners.length === 1) this.start();
    }

    /**
     * Removes a listener from the module.
     *
     * @param {function} listener - Listener to remove.
     */

  }, {
    key: "removeListener",
    value: function removeListener(listener) {
      var index = this.listeners.indexOf(listener);
      this.listeners.splice(index, 1);

      // Stop the module id there are no listeners
      if (this.listeners.length === 0) this.stop();
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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var listener = _step.value;

          listener(event);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIklucHV0TW9kdWxlLmpzIl0sIm5hbWVzIjpbIklucHV0TW9kdWxlIiwiZXZlbnRUeXBlIiwibGlzdGVuZXJzIiwiZXZlbnQiLCJwcm9taXNlIiwiaXNDYWxjdWxhdGVkIiwiaXNQcm92aWRlZCIsInBlcmlvZCIsInVuZGVmaW5lZCIsInByb21pc2VGdW4iLCJQcm9taXNlIiwibGlzdGVuZXIiLCJwdXNoIiwibGVuZ3RoIiwic3RhcnQiLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJzdG9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7O0lBUU1BLFc7O0FBRUo7Ozs7OztBQU1BLHVCQUFZQyxTQUFaLEVBQXVCO0FBQUE7O0FBRXJCOzs7Ozs7O0FBT0EsU0FBS0EsU0FBTCxHQUFpQkEsU0FBakI7O0FBRUE7Ozs7Ozs7QUFPQSxTQUFLQyxTQUFMLEdBQWlCLEVBQWpCOztBQUVBOzs7Ozs7O0FBT0EsU0FBS0MsS0FBTCxHQUFhLElBQWI7O0FBRUE7Ozs7Ozs7QUFPQSxTQUFLQyxPQUFMLEdBQWUsSUFBZjs7QUFFQTs7Ozs7OztBQU9BLFNBQUtDLFlBQUwsR0FBb0IsS0FBcEI7O0FBRUE7Ozs7Ozs7O0FBUUEsU0FBS0MsVUFBTCxHQUFrQixLQUFsQjs7QUFFQTs7Ozs7OztBQU9BLFNBQUtDLE1BQUwsR0FBY0MsU0FBZDtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7QUFVQTs7Ozs7O3lCQU1LQyxVLEVBQVk7QUFDZixXQUFLTCxPQUFMLEdBQWUsSUFBSU0sT0FBSixDQUFZRCxVQUFaLENBQWY7QUFDQSxhQUFPLEtBQUtMLE9BQVo7QUFDRDs7QUFFRDs7Ozs7OzRCQUdRLENBRVA7QUFEQzs7O0FBR0Y7Ozs7OzsyQkFHTyxDQUVOO0FBREM7OztBQUdGOzs7Ozs7OztnQ0FLWU8sUSxFQUFVO0FBQ3BCLFdBQUtULFNBQUwsQ0FBZVUsSUFBZixDQUFvQkQsUUFBcEI7O0FBRUE7QUFDQSxVQUFJLEtBQUtULFNBQUwsQ0FBZVcsTUFBZixLQUEwQixDQUE5QixFQUNFLEtBQUtDLEtBQUw7QUFDSDs7QUFFRDs7Ozs7Ozs7bUNBS2VILFEsRUFBVTtBQUN2QixVQUFJSSxRQUFRLEtBQUtiLFNBQUwsQ0FBZWMsT0FBZixDQUF1QkwsUUFBdkIsQ0FBWjtBQUNBLFdBQUtULFNBQUwsQ0FBZWUsTUFBZixDQUFzQkYsS0FBdEIsRUFBNkIsQ0FBN0I7O0FBRUE7QUFDQSxVQUFJLEtBQUtiLFNBQUwsQ0FBZVcsTUFBZixLQUEwQixDQUE5QixFQUNFLEtBQUtLLElBQUw7QUFDSDs7QUFFRDs7Ozs7Ozs7MkJBS3lCO0FBQUEsVUFBcEJmLEtBQW9CLHVFQUFaLEtBQUtBLEtBQU87QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDdkIsNkJBQXFCLEtBQUtELFNBQTFCO0FBQUEsY0FBU1MsUUFBVDs7QUFDRUEsbUJBQVNSLEtBQVQ7QUFERjtBQUR1QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR3hCOzs7d0JBaEVhO0FBQ1osYUFBUSxLQUFLRyxVQUFMLElBQW1CLEtBQUtELFlBQWhDO0FBQ0Q7Ozs7OztrQkFpRVlMLFciLCJmaWxlIjoiSW5wdXRNb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGBJbnB1dE1vZHVsZWAgY2xhc3MuXG4gKiBUaGUgYElucHV0TW9kdWxlYCBjbGFzcyBhbGxvd3MgdG8gaW5zdGFudGlhdGUgbW9kdWxlcyB0aGF0IGFyZSBwYXJ0IG9mIHRoZVxuICogbW90aW9uIGlucHV0IG1vZHVsZSwgYW5kIHRoYXQgcHJvdmlkZSB2YWx1ZXMgKGZvciBpbnN0YW5jZSwgYGRldmljZW9yaWVudGF0aW9uYCxcbiAqIGBhY2NlbGVyYXRpb25gLCBgZW5lcmd5YCkuXG4gKlxuICogQGNsYXNzIElucHV0TW9kdWxlXG4gKi9cbmNsYXNzIElucHV0TW9kdWxlIHtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgSW5wdXRNb2R1bGVgIG1vZHVsZSBpbnN0YW5jZS5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBOYW1lIG9mIHRoZSBtb2R1bGUgLyBldmVudCAoKmUuZy4qIGBkZXZpY2VvcmllbnRhdGlvbiwgJ2FjY2VsZXJhdGlvbicsICdlbmVyZ3knKS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGV2ZW50VHlwZSkge1xuXG4gICAgLyoqXG4gICAgICogRXZlbnQgdHlwZSBvZiB0aGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgSW5wdXRNb2R1bGVcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIHRoaXMuZXZlbnRUeXBlID0gZXZlbnRUeXBlO1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgbGlzdGVuZXJzIGF0dGFjaGVkIHRvIHRoaXMgbW9kdWxlIC8gZXZlbnQuXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtmdW5jdGlvbltdfVxuICAgICAqIEBkZWZhdWx0IFtdXG4gICAgICovXG4gICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IHNlbnQgYnkgdGhpcyBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ8bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIHRoaXMuZXZlbnQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIHByb21pc2UgKHJlc29sdmVkIHdoZW4gdGhlIG1vZHVsZSBpcyBpbml0aWFsaXplZCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtQcm9taXNlfVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICB0aGlzLnByb21pc2UgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIGlmIHRoZSBtb2R1bGUncyBldmVudCB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbSBwYXJlbnQgbW9kdWxlcyAvIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIEB0aGlzIElucHV0TW9kdWxlXG4gICAgICogQHR5cGUge2Jvb2x9XG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICB0aGlzLmlzQ2FsY3VsYXRlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIGlmIHRoZSBtb2R1bGUncyBldmVudCB2YWx1ZXMgYXJlIHByb3ZpZGVkIGJ5IHRoZSBkZXZpY2UncyBzZW5zb3JzLlxuICAgICAqICgqSS5lLiogaW5kaWNhdGVzIGlmIHRoZSBgJ2RldmljZW1vdGlvbidgIG9yIGAnZGV2aWNlb3JpZW50YXRpb24nYCBldmVudHMgcHJvdmlkZSB0aGUgcmVxdWlyZWQgcmF3IHZhbHVlcy4pXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtib29sfVxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgdGhpcy5pc1Byb3ZpZGVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBQZXJpb2QgYXQgd2hpY2ggdGhlIG1vZHVsZSdzIGV2ZW50cyBhcmUgc2VudCAoYHVuZGVmaW5lZGAgaWYgdGhlIGV2ZW50cyBhcmUgbm90IHNlbnQgYXQgcmVndWxhciBpbnRlcnZhbHMpLlxuICAgICAqXG4gICAgICogQHRoaXMgSW5wdXRNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IHVuZGVmaW5lZFxuICAgICAqL1xuICAgIHRoaXMucGVyaW9kID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgY2FuIHByb3ZpZGUgdmFsdWVzIG9yIG5vdC5cbiAgICpcbiAgICogQHR5cGUge2Jvb2x9XG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IGlzVmFsaWQoKSB7XG4gICAgcmV0dXJuICh0aGlzLmlzUHJvdmlkZWQgfHwgdGhpcy5pc0NhbGN1bGF0ZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2VGdW4gLSBQcm9taXNlIGZ1bmN0aW9uIHRoYXQgdGFrZXMgdGhlIGByZXNvbHZlYCBhbmQgYHJlamVjdGAgZnVuY3Rpb25zIGFzIGFyZ3VtZW50cy5cbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGluaXQocHJvbWlzZUZ1bikge1xuICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKHByb21pc2VGdW4pO1xuICAgIHJldHVybiB0aGlzLnByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICAvLyBhYnN0cmFjdCBtZXRob2RcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wcyB0aGUgbW9kdWxlLlxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICAvLyBhYnN0cmFjdCBtZXRob2RcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdG8gdGhlIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgLSBMaXN0ZW5lciB0byBhZGQuXG4gICAqL1xuICBhZGRMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuXG4gICAgLy8gU3RhcnQgdGhlIG1vZHVsZSBhcyBzb29uIGFzIHRoZXJlIGlzIGEgbGlzdGVuZXJcbiAgICBpZiAodGhpcy5saXN0ZW5lcnMubGVuZ3RoID09PSAxKVxuICAgICAgdGhpcy5zdGFydCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsaXN0ZW5lciBmcm9tIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIC0gTGlzdGVuZXIgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLmxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICB0aGlzLmxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgLy8gU3RvcCB0aGUgbW9kdWxlIGlkIHRoZXJlIGFyZSBubyBsaXN0ZW5lcnNcbiAgICBpZiAodGhpcy5saXN0ZW5lcnMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogUHJvcGFnYXRlcyBhbiBldmVudCB0byBhbGwgdGhlIG1vZHVsZSdzIGxpc3RlbmVycy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ8bnVtYmVyW119IFtldmVudD10aGlzLmV2ZW50XSAtIEV2ZW50IHZhbHVlcyB0byBwcm9wYWdhdGUgdG8gdGhlIG1vZHVsZSdzIGxpc3RlbmVycy5cbiAgICovXG4gIGVtaXQoZXZlbnQgPSB0aGlzLmV2ZW50KSB7XG4gICAgZm9yIChsZXQgbGlzdGVuZXIgb2YgdGhpcy5saXN0ZW5lcnMpXG4gICAgICBsaXN0ZW5lcihldmVudCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW5wdXRNb2R1bGU7XG4iXX0=