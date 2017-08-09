"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * `MotionInput` singleton.
 * The `MotionInput` singleton allows to initialize motion events
 * and to listen to them.
 *
 * @class MotionInput
 */
var MotionInput = function () {

  /**
   * Creates the `MotionInput` module instance.
   *
   * @constructor
   */
  function MotionInput() {
    _classCallCheck(this, MotionInput);

    /**
     * Pool of all available modules.
     *
     * @this MotionInput
     * @type {object}
     * @default {}
     */
    this.modules = {};
  }

  /**
   * Adds a module to the `MotionInput` module.
   *
   * @param {string} eventType - Name of the event type.
   * @param {InputModule} module - Module to add to the `MotionInput` module.
   */


  _createClass(MotionInput, [{
    key: "addModule",
    value: function addModule(eventType, module) {
      this.modules[eventType] = module;
    }

    /**
     * Gets a module.
     *
     * @param {string} eventType - Name of the event type (module) to retrieve.
     * @return {InputModule}
     */

  }, {
    key: "getModule",
    value: function getModule(eventType) {
      return this.modules[eventType];
    }

    /**
     * Requires a module.
     * If the module has been initialized already, returns its promise. Otherwise,
     * initializes the module.
     *
     * @param {string} eventType - Name of the event type (module) to require.
     * @return {Promise}
     */

  }, {
    key: "requireModule",
    value: function requireModule(eventType) {
      var module = this.getModule(eventType);

      if (module.promise) return module.promise;

      return module.init();
    }

    /**
     * Initializes the `MotionInput` module.
     *
     * @param {Array<String>} eventTypes - Array of the event types to initialize.
     * @return {Promise}
     */

  }, {
    key: "init",
    value: function init() {
      var _this = this;

      for (var _len = arguments.length, eventTypes = Array(_len), _key = 0; _key < _len; _key++) {
        eventTypes[_key] = arguments[_key];
      }

      if (Array.isArray(eventTypes[0])) eventTypes = eventTypes[0];

      var modulePromises = eventTypes.map(function (value) {
        var module = _this.getModule(value);
        return module.init();
      });

      return Promise.all(modulePromises);
    }

    /**
     * Adds a listener.
     *
     * @param {string} eventType - Name of the event type (module) to add a listener to.
     * @param {function} listener - Listener to add.
     */

  }, {
    key: "addListener",
    value: function addListener(eventType, listener) {
      var module = this.getModule(eventType);
      module.addListener(listener);
    }

    /**
     * Removes a listener.
     *
     * @param {string} eventType - Name of the event type (module) to add a listener to.
     * @param {function} listener - Listener to remove.
     */

  }, {
    key: "removeListener",
    value: function removeListener(eventType, listener) {
      var module = this.getModule(eventType);
      module.removeListener(listener);
    }
  }]);

  return MotionInput;
}();

exports.default = new MotionInput();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vdGlvbklucHV0LmpzIl0sIm5hbWVzIjpbIk1vdGlvbklucHV0IiwibW9kdWxlcyIsImV2ZW50VHlwZSIsIm1vZHVsZSIsImdldE1vZHVsZSIsInByb21pc2UiLCJpbml0IiwiZXZlbnRUeXBlcyIsIkFycmF5IiwiaXNBcnJheSIsIm1vZHVsZVByb21pc2VzIiwibWFwIiwidmFsdWUiLCJQcm9taXNlIiwiYWxsIiwibGlzdGVuZXIiLCJhZGRMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7SUFPTUEsVzs7QUFFSjs7Ozs7QUFLQSx5QkFBYztBQUFBOztBQUVaOzs7Ozs7O0FBT0EsU0FBS0MsT0FBTCxHQUFlLEVBQWY7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs4QkFNVUMsUyxFQUFXQyxNLEVBQVE7QUFDM0IsV0FBS0YsT0FBTCxDQUFhQyxTQUFiLElBQTBCQyxNQUExQjtBQUNEOztBQUVEOzs7Ozs7Ozs7OEJBTVVELFMsRUFBVztBQUNuQixhQUFPLEtBQUtELE9BQUwsQ0FBYUMsU0FBYixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O2tDQVFjQSxTLEVBQVc7QUFDdkIsVUFBTUMsU0FBUyxLQUFLQyxTQUFMLENBQWVGLFNBQWYsQ0FBZjs7QUFFQSxVQUFJQyxPQUFPRSxPQUFYLEVBQ0UsT0FBT0YsT0FBT0UsT0FBZDs7QUFFRixhQUFPRixPQUFPRyxJQUFQLEVBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OzJCQU1vQjtBQUFBOztBQUFBLHdDQUFaQyxVQUFZO0FBQVpBLGtCQUFZO0FBQUE7O0FBQ2xCLFVBQUlDLE1BQU1DLE9BQU4sQ0FBY0YsV0FBVyxDQUFYLENBQWQsQ0FBSixFQUNFQSxhQUFhQSxXQUFXLENBQVgsQ0FBYjs7QUFFRixVQUFNRyxpQkFBaUJILFdBQVdJLEdBQVgsQ0FBZSxVQUFDQyxLQUFELEVBQVc7QUFDL0MsWUFBTVQsU0FBUyxNQUFLQyxTQUFMLENBQWVRLEtBQWYsQ0FBZjtBQUNBLGVBQU9ULE9BQU9HLElBQVAsRUFBUDtBQUNELE9BSHNCLENBQXZCOztBQUtBLGFBQU9PLFFBQVFDLEdBQVIsQ0FBWUosY0FBWixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztnQ0FNWVIsUyxFQUFXYSxRLEVBQVU7QUFDL0IsVUFBTVosU0FBUyxLQUFLQyxTQUFMLENBQWVGLFNBQWYsQ0FBZjtBQUNBQyxhQUFPYSxXQUFQLENBQW1CRCxRQUFuQjtBQUNEOztBQUVEOzs7Ozs7Ozs7bUNBTWViLFMsRUFBV2EsUSxFQUFVO0FBQ2xDLFVBQU1aLFNBQVMsS0FBS0MsU0FBTCxDQUFlRixTQUFmLENBQWY7QUFDQUMsYUFBT2MsY0FBUCxDQUFzQkYsUUFBdEI7QUFDRDs7Ozs7O2tCQUdZLElBQUlmLFdBQUosRSIsImZpbGUiOiJNb3Rpb25JbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogYE1vdGlvbklucHV0YCBzaW5nbGV0b24uXG4gKiBUaGUgYE1vdGlvbklucHV0YCBzaW5nbGV0b24gYWxsb3dzIHRvIGluaXRpYWxpemUgbW90aW9uIGV2ZW50c1xuICogYW5kIHRvIGxpc3RlbiB0byB0aGVtLlxuICpcbiAqIEBjbGFzcyBNb3Rpb25JbnB1dFxuICovXG5jbGFzcyBNb3Rpb25JbnB1dCB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGBNb3Rpb25JbnB1dGAgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgLyoqXG4gICAgICogUG9vbCBvZiBhbGwgYXZhaWxhYmxlIG1vZHVsZXMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBNb3Rpb25JbnB1dFxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQGRlZmF1bHQge31cbiAgICAgKi9cbiAgICB0aGlzLm1vZHVsZXMgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbW9kdWxlIHRvIHRoZSBgTW90aW9uSW5wdXRgIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIE5hbWUgb2YgdGhlIGV2ZW50IHR5cGUuXG4gICAqIEBwYXJhbSB7SW5wdXRNb2R1bGV9IG1vZHVsZSAtIE1vZHVsZSB0byBhZGQgdG8gdGhlIGBNb3Rpb25JbnB1dGAgbW9kdWxlLlxuICAgKi9cbiAgYWRkTW9kdWxlKGV2ZW50VHlwZSwgbW9kdWxlKSB7XG4gICAgdGhpcy5tb2R1bGVzW2V2ZW50VHlwZV0gPSBtb2R1bGU7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIE5hbWUgb2YgdGhlIGV2ZW50IHR5cGUgKG1vZHVsZSkgdG8gcmV0cmlldmUuXG4gICAqIEByZXR1cm4ge0lucHV0TW9kdWxlfVxuICAgKi9cbiAgZ2V0TW9kdWxlKGV2ZW50VHlwZSkge1xuICAgIHJldHVybiB0aGlzLm1vZHVsZXNbZXZlbnRUeXBlXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1aXJlcyBhIG1vZHVsZS5cbiAgICogSWYgdGhlIG1vZHVsZSBoYXMgYmVlbiBpbml0aWFsaXplZCBhbHJlYWR5LCByZXR1cm5zIGl0cyBwcm9taXNlLiBPdGhlcndpc2UsXG4gICAqIGluaXRpYWxpemVzIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBOYW1lIG9mIHRoZSBldmVudCB0eXBlIChtb2R1bGUpIHRvIHJlcXVpcmUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICByZXF1aXJlTW9kdWxlKGV2ZW50VHlwZSkge1xuICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMuZ2V0TW9kdWxlKGV2ZW50VHlwZSk7XG5cbiAgICBpZiAobW9kdWxlLnByb21pc2UpXG4gICAgICByZXR1cm4gbW9kdWxlLnByb21pc2U7XG5cbiAgICByZXR1cm4gbW9kdWxlLmluaXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgYE1vdGlvbklucHV0YCBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gZXZlbnRUeXBlcyAtIEFycmF5IG9mIHRoZSBldmVudCB0eXBlcyB0byBpbml0aWFsaXplLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgaW5pdCguLi5ldmVudFR5cGVzKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZXZlbnRUeXBlc1swXSkpXG4gICAgICBldmVudFR5cGVzID0gZXZlbnRUeXBlc1swXVxuXG4gICAgY29uc3QgbW9kdWxlUHJvbWlzZXMgPSBldmVudFR5cGVzLm1hcCgodmFsdWUpID0+IHtcbiAgICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMuZ2V0TW9kdWxlKHZhbHVlKTtcbiAgICAgIHJldHVybiBtb2R1bGUuaW5pdCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKG1vZHVsZVByb21pc2VzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBOYW1lIG9mIHRoZSBldmVudCB0eXBlIChtb2R1bGUpIHRvIGFkZCBhIGxpc3RlbmVyIHRvLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIHRvIGFkZC5cbiAgICovXG4gIGFkZExpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBtb2R1bGUgPSB0aGlzLmdldE1vZHVsZShldmVudFR5cGUpO1xuICAgIG1vZHVsZS5hZGRMaXN0ZW5lcihsaXN0ZW5lcik7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxpc3RlbmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gTmFtZSBvZiB0aGUgZXZlbnQgdHlwZSAobW9kdWxlKSB0byBhZGQgYSBsaXN0ZW5lciB0by5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgLSBMaXN0ZW5lciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihldmVudFR5cGUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgbW9kdWxlID0gdGhpcy5nZXRNb2R1bGUoZXZlbnRUeXBlKTtcbiAgICBtb2R1bGUucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBNb3Rpb25JbnB1dCgpO1xuIl19