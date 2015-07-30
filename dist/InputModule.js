/**
 * @fileoverview `InputModule` module
 * @author <a href='mailto:sebastien@robaszkiewicz.com'>Sébastien Robaszkiewicz</a>, <a href='mailto:Norbert.Schnell@ircam.fr'>Norbert Schnell</a>
 */

'use strict';

/**
 * `InputModule` class.
 * The `InputModule` class allows to instantiate modules that are part of the
 * motion input module, and that provide values (for instance, `deviceorientation`,
 * `acceleration`, `energy`).
 *
 * @class InputModule
 */

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var InputModule = (function () {

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
    key: 'init',

    /**
     * Initializes the module.
     *
     * @param {function} promiseFun - Promise function that takes the `resolve` and `reject` functions as arguments.
     * @return {Promise}
     */
    value: function init(promiseFun) {
      this.promise = new _Promise(promiseFun);
      return this.promise;
    }

    /**
     * Starts the module.
     */
  }, {
    key: 'start',
    value: function start() {}
    // abstract method

    /**
     * Stops the module.
     */

  }, {
    key: 'stop',
    value: function stop() {}
    // abstract method

    /**
     * Adds a listener to the module.
     *
     * @param {function} listener - Listener to add.
     */

  }, {
    key: 'addListener',
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
    key: 'removeListener',
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
    key: 'emit',
    value: function emit() {
      var event = arguments.length <= 0 || arguments[0] === undefined ? this.event : arguments[0];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(this.listeners), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var listener = _step.value;

          listener(event);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'isValid',
    get: function get() {
      return this.isProvided || this.isCalculated;
    }
  }]);

  return InputModule;
})();

module.exports = InputModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9JbnB1dE1vZHVsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUtBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQVVQLFdBQVc7Ozs7Ozs7OztBQVFKLFdBUlAsV0FBVyxDQVFILFNBQVMsRUFBRTswQkFSbkIsV0FBVzs7Ozs7Ozs7O0FBaUJiLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDOzs7Ozs7Ozs7QUFTM0IsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7Ozs7Ozs7OztBQVNwQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7O0FBU2xCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOzs7Ozs7Ozs7QUFTcEIsUUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7Ozs7Ozs7Ozs7QUFVMUIsUUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7Ozs7Ozs7OztBQVN4QixRQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztHQUN6Qjs7Ozs7Ozs7O2VBekVHLFdBQVc7Ozs7Ozs7OztXQTJGWCxjQUFDLFVBQVUsRUFBRTtBQUNmLFVBQUksQ0FBQyxPQUFPLEdBQUcsYUFBWSxVQUFVLENBQUMsQ0FBQztBQUN2QyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7Ozs7Ozs7V0FLSSxpQkFBRyxFQUVQOzs7Ozs7QUFBQTs7O1dBS0csZ0JBQUcsRUFFTjs7Ozs7Ozs7QUFBQTs7O1dBT1UscUJBQUMsUUFBUSxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7QUFHOUIsVUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQzdCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNoQjs7Ozs7Ozs7O1dBT2Esd0JBQUMsUUFBUSxFQUFFO0FBQ3ZCLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdDLFVBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7O0FBR2hDLFVBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUM3QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDZjs7Ozs7Ozs7O1dBT0csZ0JBQXFCO1VBQXBCLEtBQUsseURBQUcsSUFBSSxDQUFDLEtBQUs7Ozs7OztBQUNyQiwwQ0FBcUIsSUFBSSxDQUFDLFNBQVM7Y0FBMUIsUUFBUTs7QUFDZixrQkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUE7Ozs7Ozs7Ozs7Ozs7OztLQUNuQjs7O1NBaEVVLGVBQUc7QUFDWixhQUFRLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBRTtLQUMvQzs7O1NBbkZHLFdBQVc7OztBQW9KakIsTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMiLCJmaWxlIjoic3JjL0lucHV0TW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IGBJbnB1dE1vZHVsZWAgbW9kdWxlXG4gKiBAYXV0aG9yIDxhIGhyZWY9J21haWx0bzpzZWJhc3RpZW5Acm9iYXN6a2lld2ljei5jb20nPlPDqWJhc3RpZW4gUm9iYXN6a2lld2ljejwvYT4sIDxhIGhyZWY9J21haWx0bzpOb3JiZXJ0LlNjaG5lbGxAaXJjYW0uZnInPk5vcmJlcnQgU2NobmVsbDwvYT5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogYElucHV0TW9kdWxlYCBjbGFzcy5cbiAqIFRoZSBgSW5wdXRNb2R1bGVgIGNsYXNzIGFsbG93cyB0byBpbnN0YW50aWF0ZSBtb2R1bGVzIHRoYXQgYXJlIHBhcnQgb2YgdGhlXG4gKiBtb3Rpb24gaW5wdXQgbW9kdWxlLCBhbmQgdGhhdCBwcm92aWRlIHZhbHVlcyAoZm9yIGluc3RhbmNlLCBgZGV2aWNlb3JpZW50YXRpb25gLFxuICogYGFjY2VsZXJhdGlvbmAsIGBlbmVyZ3lgKS5cbiAqXG4gKiBAY2xhc3MgSW5wdXRNb2R1bGVcbiAqL1xuY2xhc3MgSW5wdXRNb2R1bGUge1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBJbnB1dE1vZHVsZWAgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIE5hbWUgb2YgdGhlIG1vZHVsZSAvIGV2ZW50ICgqZS5nLiogYGRldmljZW9yaWVudGF0aW9uLCAnYWNjZWxlcmF0aW9uJywgJ2VuZXJneScpLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZXZlbnRUeXBlKSB7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCB0eXBlIG9mIHRoZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgdGhpcy5ldmVudFR5cGUgPSBldmVudFR5cGU7XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBsaXN0ZW5lcnMgYXR0YWNoZWQgdG8gdGhpcyBtb2R1bGUgLyBldmVudC5cbiAgICAgKlxuICAgICAqIEB0aGlzIElucHV0TW9kdWxlXG4gICAgICogQHR5cGUge2Z1bmN0aW9uW119XG4gICAgICogQGRlZmF1bHQgW11cbiAgICAgKi9cbiAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnQgc2VudCBieSB0aGlzIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIElucHV0TW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcnxudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICovXG4gICAgdGhpcy5ldmVudCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgcHJvbWlzZSAocmVzb2x2ZWQgd2hlbiB0aGUgbW9kdWxlIGlzIGluaXRpYWxpemVkKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIElucHV0TW9kdWxlXG4gICAgICogQHR5cGUge1Byb21pc2V9XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIHRoaXMucHJvbWlzZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIG1vZHVsZSdzIGV2ZW50IHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tIHBhcmVudCBtb2R1bGVzIC8gZXZlbnRzLlxuICAgICAqXG4gICAgICogQHRoaXMgSW5wdXRNb2R1bGVcbiAgICAgKiBAdHlwZSB7Ym9vbH1cbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIHRoaXMuaXNDYWxjdWxhdGVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIG1vZHVsZSdzIGV2ZW50IHZhbHVlcyBhcmUgcHJvdmlkZWQgYnkgdGhlIGRldmljZSdzIHNlbnNvcnMuXG4gICAgICogKCpJLmUuKiBpbmRpY2F0ZXMgaWYgdGhlIGAnZGV2aWNlbW90aW9uJ2Agb3IgYCdkZXZpY2VvcmllbnRhdGlvbidgIGV2ZW50cyBwcm92aWRlIHRoZSByZXF1aXJlZCByYXcgdmFsdWVzLilcbiAgICAgKlxuICAgICAqIEB0aGlzIElucHV0TW9kdWxlXG4gICAgICogQHR5cGUge2Jvb2x9XG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICB0aGlzLmlzUHJvdmlkZWQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFBlcmlvZCBhdCB3aGljaCB0aGUgbW9kdWxlJ3MgZXZlbnRzIGFyZSBzZW50IChgdW5kZWZpbmVkYCBpZiB0aGUgZXZlbnRzIGFyZSBub3Qgc2VudCBhdCByZWd1bGFyIGludGVydmFscykuXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgdW5kZWZpbmVkXG4gICAgICovXG4gICAgdGhpcy5wZXJpb2QgPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZSBjYW4gcHJvdmlkZSB2YWx1ZXMgb3Igbm90LlxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbH1cbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgaXNWYWxpZCgpIHtcbiAgICByZXR1cm4gKHRoaXMuaXNQcm92aWRlZCB8fCB0aGlzLmlzQ2FsY3VsYXRlZCk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvbWlzZUZ1biAtIFByb21pc2UgZnVuY3Rpb24gdGhhdCB0YWtlcyB0aGUgYHJlc29sdmVgIGFuZCBgcmVqZWN0YCBmdW5jdGlvbnMgYXMgYXJndW1lbnRzLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgaW5pdChwcm9taXNlRnVuKSB7XG4gICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UocHJvbWlzZUZ1bik7XG4gICAgcmV0dXJuIHRoaXMucHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIG1vZHVsZS5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIC8vIGFic3RyYWN0IG1ldGhvZFxuICB9XG5cbiAgLyoqXG4gICAqIFN0b3BzIHRoZSBtb2R1bGUuXG4gICAqL1xuICBzdG9wKCkge1xuICAgIC8vIGFic3RyYWN0IG1ldGhvZFxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBsaXN0ZW5lciB0byB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIHRvIGFkZC5cbiAgICovXG4gIGFkZExpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG5cbiAgICAvLyBTdGFydCB0aGUgbW9kdWxlIGFzIHNvb24gYXMgdGhlcmUgaXMgYSBsaXN0ZW5lclxuICAgIGlmICh0aGlzLmxpc3RlbmVycy5sZW5ndGggPT09IDEpXG4gICAgICB0aGlzLnN0YXJ0KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZyb20gdGhlIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgLSBMaXN0ZW5lciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIGxldCBpbmRleCA9IHRoaXMubGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICAgIHRoaXMubGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAvLyBTdG9wIHRoZSBtb2R1bGUgaWQgdGhlcmUgYXJlIG5vIGxpc3RlbmVyc1xuICAgIGlmICh0aGlzLmxpc3RlbmVycy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGVzIGFuIGV2ZW50IHRvIGFsbCB0aGUgbW9kdWxlJ3MgbGlzdGVuZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcnxudW1iZXJbXX0gW2V2ZW50PXRoaXMuZXZlbnRdIC0gRXZlbnQgdmFsdWVzIHRvIHByb3BhZ2F0ZSB0byB0aGUgbW9kdWxlJ3MgbGlzdGVuZXJzLlxuICAgKi9cbiAgZW1pdChldmVudCA9IHRoaXMuZXZlbnQpIHtcbiAgICBmb3IgKGxldCBsaXN0ZW5lciBvZiB0aGlzLmxpc3RlbmVycylcbiAgICAgIGxpc3RlbmVyKGV2ZW50KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0TW9kdWxlOyJdfQ==