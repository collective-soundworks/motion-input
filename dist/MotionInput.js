/**
 * @fileoverview `MotionInput` module
 * @author <a href='mailto:sebastien@robaszkiewicz.com'>Sébastien Robaszkiewicz</a>, <a href='mailto:Norbert.Schnell@ircam.fr'>Norbert Schnell</a>
 */

'use strict';

/**
 * `MotionInput` singleton.
 * The `MotionInput` singleton allows to initialize motion events
 * and to listen to them.
 * 
 * @class MotionInput
 */

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var MotionInput = (function () {

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
    key: 'addModule',
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
    key: 'getModule',
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
    key: 'requireModule',
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
    key: 'init',
    value: function init() {
      var _this = this;

      for (var _len = arguments.length, eventTypes = Array(_len), _key = 0; _key < _len; _key++) {
        eventTypes[_key] = arguments[_key];
      }

      var modulePromises = eventTypes.map(function (value) {
        var module = _this.getModule(value);
        return module.init();
      });

      return _Promise.all(modulePromises);
    }

    /**
     * Adds a listener.
     *
     * @param {string} eventType - Name of the event type (module) to add a listener to.
     * @param {function} listener - Listener to add.
     */
  }, {
    key: 'addListener',
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
    key: 'removeListener',
    value: function removeListener(eventType, listener) {
      var module = this.getModule(eventType);
      module.removeListener(listener);
    }
  }]);

  return MotionInput;
})();

module.exports = new MotionInput();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Nb3Rpb25JbnB1dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUtBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztJQVNQLFdBQVc7Ozs7Ozs7O0FBT0osV0FQUCxXQUFXLEdBT0Q7MEJBUFYsV0FBVzs7Ozs7Ozs7O0FBZ0JiLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0dBQ25COzs7Ozs7Ozs7ZUFqQkcsV0FBVzs7V0F5Qk4sbUJBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRTtBQUMzQixVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztLQUNsQzs7Ozs7Ozs7OztXQVFRLG1CQUFDLFNBQVMsRUFBRTtBQUNuQixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDaEM7Ozs7Ozs7Ozs7OztXQVVZLHVCQUFDLFNBQVMsRUFBRTtBQUN2QixVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUV2QyxVQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQ2YsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDOztBQUV4QixhQUFPLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUN0Qjs7Ozs7Ozs7OztXQVFHLGdCQUFnQjs7O3dDQUFaLFVBQVU7QUFBVixrQkFBVTs7O0FBQ2hCLFVBQUksY0FBYyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDN0MsWUFBSSxNQUFNLEdBQUcsTUFBSyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkMsZUFBTyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDdEIsQ0FBQyxDQUFDOztBQUVILGFBQU8sU0FBUSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDcEM7Ozs7Ozs7Ozs7V0FRVSxxQkFBQyxTQUFTLEVBQUUsUUFBUSxFQUFFO0FBQy9CLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsWUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUM5Qjs7Ozs7Ozs7OztXQVFhLHdCQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUU7QUFDbEMsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2QyxZQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2pDOzs7U0EzRkcsV0FBVzs7O0FBOEZqQixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUMiLCJmaWxlIjoic3JjL01vdGlvbklucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IGBNb3Rpb25JbnB1dGAgbW9kdWxlXG4gKiBAYXV0aG9yIDxhIGhyZWY9J21haWx0bzpzZWJhc3RpZW5Acm9iYXN6a2lld2ljei5jb20nPlPDqWJhc3RpZW4gUm9iYXN6a2lld2ljejwvYT4sIDxhIGhyZWY9J21haWx0bzpOb3JiZXJ0LlNjaG5lbGxAaXJjYW0uZnInPk5vcmJlcnQgU2NobmVsbDwvYT5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogYE1vdGlvbklucHV0YCBzaW5nbGV0b24uXG4gKiBUaGUgYE1vdGlvbklucHV0YCBzaW5nbGV0b24gYWxsb3dzIHRvIGluaXRpYWxpemUgbW90aW9uIGV2ZW50c1xuICogYW5kIHRvIGxpc3RlbiB0byB0aGVtLlxuICogXG4gKiBAY2xhc3MgTW90aW9uSW5wdXRcbiAqL1xuY2xhc3MgTW90aW9uSW5wdXQge1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBgTW90aW9uSW5wdXRgIG1vZHVsZSBpbnN0YW5jZS5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIC8qKlxuICAgICAqIFBvb2wgb2YgYWxsIGF2YWlsYWJsZSBtb2R1bGVzLlxuICAgICAqXG4gICAgICogQHRoaXMgTW90aW9uSW5wdXRcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqIEBkZWZhdWx0IHt9XG4gICAgICovXG4gICAgdGhpcy5tb2R1bGVzID0ge307XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG1vZHVsZSB0byB0aGUgYE1vdGlvbklucHV0YCBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBOYW1lIG9mIHRoZSBldmVudCB0eXBlLlxuICAgKiBAcGFyYW0ge0lucHV0TW9kdWxlfSBtb2R1bGUgLSBNb2R1bGUgdG8gYWRkIHRvIHRoZSBgTW90aW9uSW5wdXRgIG1vZHVsZS5cbiAgICovXG4gIGFkZE1vZHVsZShldmVudFR5cGUsIG1vZHVsZSkge1xuICAgIHRoaXMubW9kdWxlc1tldmVudFR5cGVdID0gbW9kdWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBOYW1lIG9mIHRoZSBldmVudCB0eXBlIChtb2R1bGUpIHRvIHJldHJpZXZlLlxuICAgKiBAcmV0dXJuIHtJbnB1dE1vZHVsZX1cbiAgICovXG4gIGdldE1vZHVsZShldmVudFR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5tb2R1bGVzW2V2ZW50VHlwZV07XG4gIH1cblxuICAvKipcbiAgICogUmVxdWlyZXMgYSBtb2R1bGUuXG4gICAqIElmIHRoZSBtb2R1bGUgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWxyZWFkLCByZXR1cm5zIGl0cyBwcm9taXNlLiBPdGhlcndpc2UsXG4gICAqIGluaXRpYWxpemVzIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBOYW1lIG9mIHRoZSBldmVudCB0eXBlIChtb2R1bGUpIHRvIHJlcXVpcmUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICByZXF1aXJlTW9kdWxlKGV2ZW50VHlwZSkge1xuICAgIGxldCBtb2R1bGUgPSB0aGlzLmdldE1vZHVsZShldmVudFR5cGUpO1xuXG4gICAgaWYobW9kdWxlLnByb21pc2UpXG4gICAgICByZXR1cm4gbW9kdWxlLnByb21pc2U7XG5cbiAgICByZXR1cm4gbW9kdWxlLmluaXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgYE1vdGlvbklucHV0YCBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IC4uLmV2ZW50VHlwZXMgLSBBcnJheSBvZiB0aGUgZXZlbnQgdHlwZXMgdG8gaW5pdGlhbGl6ZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGluaXQoLi4uZXZlbnRUeXBlcykge1xuICAgIGxldCBtb2R1bGVQcm9taXNlcyA9IGV2ZW50VHlwZXMubWFwKCh2YWx1ZSkgPT4ge1xuICAgICAgbGV0IG1vZHVsZSA9IHRoaXMuZ2V0TW9kdWxlKHZhbHVlKTtcbiAgICAgIHJldHVybiBtb2R1bGUuaW5pdCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKG1vZHVsZVByb21pc2VzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBOYW1lIG9mIHRoZSBldmVudCB0eXBlIChtb2R1bGUpIHRvIGFkZCBhIGxpc3RlbmVyIHRvLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIHRvIGFkZC5cbiAgICovXG4gIGFkZExpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIpIHtcbiAgICBsZXQgbW9kdWxlID0gdGhpcy5nZXRNb2R1bGUoZXZlbnRUeXBlKTtcbiAgICBtb2R1bGUuYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsaXN0ZW5lci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIE5hbWUgb2YgdGhlIGV2ZW50IHR5cGUgKG1vZHVsZSkgdG8gYWRkIGEgbGlzdGVuZXIgdG8uXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIC0gTGlzdGVuZXIgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoZXZlbnRUeXBlLCBsaXN0ZW5lcikge1xuICAgIGxldCBtb2R1bGUgPSB0aGlzLmdldE1vZHVsZShldmVudFR5cGUpO1xuICAgIG1vZHVsZS5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgTW90aW9uSW5wdXQoKTsiXX0=