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
     * If the module has been initialized alread, returns its promise. Otherwise,
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
     * @param {string[]} ...eventTypes - Array of the event types to initialize.
     * @return {Promise}
     */

  }, {
    key: "init",
    value: function init() {
      var _this = this;

      for (var _len = arguments.length, eventTypes = Array(_len), _key = 0; _key < _len; _key++) {
        eventTypes[_key] = arguments[_key];
      }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vdGlvbklucHV0LmpzIl0sIm5hbWVzIjpbIk1vdGlvbklucHV0IiwibW9kdWxlcyIsImV2ZW50VHlwZSIsIm1vZHVsZSIsImdldE1vZHVsZSIsInByb21pc2UiLCJpbml0IiwiZXZlbnRUeXBlcyIsIm1vZHVsZVByb21pc2VzIiwibWFwIiwidmFsdWUiLCJQcm9taXNlIiwiYWxsIiwibGlzdGVuZXIiLCJhZGRMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7SUFPTUEsVzs7QUFFSjs7Ozs7QUFLQSx5QkFBYztBQUFBOztBQUVaOzs7Ozs7O0FBT0EsU0FBS0MsT0FBTCxHQUFlLEVBQWY7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs4QkFNVUMsUyxFQUFXQyxNLEVBQVE7QUFDM0IsV0FBS0YsT0FBTCxDQUFhQyxTQUFiLElBQTBCQyxNQUExQjtBQUNEOztBQUVEOzs7Ozs7Ozs7OEJBTVVELFMsRUFBVztBQUNuQixhQUFPLEtBQUtELE9BQUwsQ0FBYUMsU0FBYixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O2tDQVFjQSxTLEVBQVc7QUFDdkIsVUFBSUMsU0FBUyxLQUFLQyxTQUFMLENBQWVGLFNBQWYsQ0FBYjs7QUFFQSxVQUFHQyxPQUFPRSxPQUFWLEVBQ0UsT0FBT0YsT0FBT0UsT0FBZDs7QUFFRixhQUFPRixPQUFPRyxJQUFQLEVBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OzJCQU1vQjtBQUFBOztBQUFBLHdDQUFaQyxVQUFZO0FBQVpBLGtCQUFZO0FBQUE7O0FBQ2xCLFVBQUlDLGlCQUFpQkQsV0FBV0UsR0FBWCxDQUFlLFVBQUNDLEtBQUQsRUFBVztBQUM3QyxZQUFJUCxTQUFTLE1BQUtDLFNBQUwsQ0FBZU0sS0FBZixDQUFiO0FBQ0EsZUFBT1AsT0FBT0csSUFBUCxFQUFQO0FBQ0QsT0FIb0IsQ0FBckI7O0FBS0EsYUFBT0ssUUFBUUMsR0FBUixDQUFZSixjQUFaLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7O2dDQU1ZTixTLEVBQVdXLFEsRUFBVTtBQUMvQixVQUFJVixTQUFTLEtBQUtDLFNBQUwsQ0FBZUYsU0FBZixDQUFiO0FBQ0FDLGFBQU9XLFdBQVAsQ0FBbUJELFFBQW5CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzttQ0FNZVgsUyxFQUFXVyxRLEVBQVU7QUFDbEMsVUFBSVYsU0FBUyxLQUFLQyxTQUFMLENBQWVGLFNBQWYsQ0FBYjtBQUNBQyxhQUFPWSxjQUFQLENBQXNCRixRQUF0QjtBQUNEOzs7Ozs7a0JBR1ksSUFBSWIsV0FBSixFIiwiZmlsZSI6Ik1vdGlvbklucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBgTW90aW9uSW5wdXRgIHNpbmdsZXRvbi5cbiAqIFRoZSBgTW90aW9uSW5wdXRgIHNpbmdsZXRvbiBhbGxvd3MgdG8gaW5pdGlhbGl6ZSBtb3Rpb24gZXZlbnRzXG4gKiBhbmQgdG8gbGlzdGVuIHRvIHRoZW0uXG4gKlxuICogQGNsYXNzIE1vdGlvbklucHV0XG4gKi9cbmNsYXNzIE1vdGlvbklucHV0IHtcblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgYE1vdGlvbklucHV0YCBtb2R1bGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAvKipcbiAgICAgKiBQb29sIG9mIGFsbCBhdmFpbGFibGUgbW9kdWxlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIE1vdGlvbklucHV0XG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAZGVmYXVsdCB7fVxuICAgICAqL1xuICAgIHRoaXMubW9kdWxlcyA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBtb2R1bGUgdG8gdGhlIGBNb3Rpb25JbnB1dGAgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gTmFtZSBvZiB0aGUgZXZlbnQgdHlwZS5cbiAgICogQHBhcmFtIHtJbnB1dE1vZHVsZX0gbW9kdWxlIC0gTW9kdWxlIHRvIGFkZCB0byB0aGUgYE1vdGlvbklucHV0YCBtb2R1bGUuXG4gICAqL1xuICBhZGRNb2R1bGUoZXZlbnRUeXBlLCBtb2R1bGUpIHtcbiAgICB0aGlzLm1vZHVsZXNbZXZlbnRUeXBlXSA9IG1vZHVsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gTmFtZSBvZiB0aGUgZXZlbnQgdHlwZSAobW9kdWxlKSB0byByZXRyaWV2ZS5cbiAgICogQHJldHVybiB7SW5wdXRNb2R1bGV9XG4gICAqL1xuICBnZXRNb2R1bGUoZXZlbnRUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kdWxlc1tldmVudFR5cGVdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVpcmVzIGEgbW9kdWxlLlxuICAgKiBJZiB0aGUgbW9kdWxlIGhhcyBiZWVuIGluaXRpYWxpemVkIGFscmVhZCwgcmV0dXJucyBpdHMgcHJvbWlzZS4gT3RoZXJ3aXNlLFxuICAgKiBpbml0aWFsaXplcyB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gTmFtZSBvZiB0aGUgZXZlbnQgdHlwZSAobW9kdWxlKSB0byByZXF1aXJlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgcmVxdWlyZU1vZHVsZShldmVudFR5cGUpIHtcbiAgICBsZXQgbW9kdWxlID0gdGhpcy5nZXRNb2R1bGUoZXZlbnRUeXBlKTtcblxuICAgIGlmKG1vZHVsZS5wcm9taXNlKVxuICAgICAgcmV0dXJuIG1vZHVsZS5wcm9taXNlO1xuXG4gICAgcmV0dXJuIG1vZHVsZS5pbml0KCk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIGBNb3Rpb25JbnB1dGAgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSAuLi5ldmVudFR5cGVzIC0gQXJyYXkgb2YgdGhlIGV2ZW50IHR5cGVzIHRvIGluaXRpYWxpemUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBpbml0KC4uLmV2ZW50VHlwZXMpIHtcbiAgICBsZXQgbW9kdWxlUHJvbWlzZXMgPSBldmVudFR5cGVzLm1hcCgodmFsdWUpID0+IHtcbiAgICAgIGxldCBtb2R1bGUgPSB0aGlzLmdldE1vZHVsZSh2YWx1ZSk7XG4gICAgICByZXR1cm4gbW9kdWxlLmluaXQoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChtb2R1bGVQcm9taXNlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxpc3RlbmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gTmFtZSBvZiB0aGUgZXZlbnQgdHlwZSAobW9kdWxlKSB0byBhZGQgYSBsaXN0ZW5lciB0by5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgLSBMaXN0ZW5lciB0byBhZGQuXG4gICAqL1xuICBhZGRMaXN0ZW5lcihldmVudFR5cGUsIGxpc3RlbmVyKSB7XG4gICAgbGV0IG1vZHVsZSA9IHRoaXMuZ2V0TW9kdWxlKGV2ZW50VHlwZSk7XG4gICAgbW9kdWxlLmFkZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBOYW1lIG9mIHRoZSBldmVudCB0eXBlIChtb2R1bGUpIHRvIGFkZCBhIGxpc3RlbmVyIHRvLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIpIHtcbiAgICBsZXQgbW9kdWxlID0gdGhpcy5nZXRNb2R1bGUoZXZlbnRUeXBlKTtcbiAgICBtb2R1bGUucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBNb3Rpb25JbnB1dCgpO1xuIl19