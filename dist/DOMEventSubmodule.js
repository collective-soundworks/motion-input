/**
 * @fileoverview `DOMEventSubmodule` module
 * @author <a href='mailto:sebastien@robaszkiewicz.com'>Sébastien Robaszkiewicz</a>, <a href='mailto:Norbert.Schnell@ircam.fr'>Norbert Schnell</a>
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var DOMEventSubmodule = function (_InputModule) {
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

    /**
     * The DOM event parent module from which this module gets the raw values.
     *
     * @this DOMEventSubmodule
     * @type {DeviceMotionModule|DeviceOrientationModule}
     * @constant
     */
    var _this = _possibleConstructorReturn(this, (DOMEventSubmodule.__proto__ || Object.getPrototypeOf(DOMEventSubmodule)).call(this, eventType));

    _this.DOMEventModule = DOMEventModule;

    /**
     * Raw values coming from the `devicemotion` event sent by this module.
     *
     * @this DOMEventSubmodule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    _this.event = [0, 0, 0];

    /**
     * Compass heading reference (iOS devices only, `Orientation` and `OrientationAlt` submodules only).
     *
     * @this DOMEventSubmodule
     * @type {number}
     * @default null
     */
    _this._webkitCompassHeadingReference = null;
    return _this;
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
      var _this2 = this;

      // Indicate to the parent module that this event is required
      this.DOMEventModule.required[this.eventType] = true;

      // If the parent event has not been initialized yet, initialize it
      var DOMEventPromise = this.DOMEventModule.promise;
      if (!DOMEventPromise) DOMEventPromise = this.DOMEventModule.init();

      return DOMEventPromise.then(function (module) {
        return _this2;
      });
    }
  }]);

  return DOMEventSubmodule;
}(InputModule);

module.exports = DOMEventSubmodule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRPTUV2ZW50U3VibW9kdWxlLmpzIl0sIm5hbWVzIjpbIklucHV0TW9kdWxlIiwicmVxdWlyZSIsIkRPTUV2ZW50U3VibW9kdWxlIiwiRE9NRXZlbnRNb2R1bGUiLCJldmVudFR5cGUiLCJldmVudCIsIl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSIsIl9hZGRMaXN0ZW5lciIsIl9yZW1vdmVMaXN0ZW5lciIsInJlcXVpcmVkIiwiRE9NRXZlbnRQcm9taXNlIiwicHJvbWlzZSIsImluaXQiLCJ0aGVuIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FBS0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxjQUFjQyxRQUFRLGVBQVIsQ0FBcEI7O0FBRUE7Ozs7Ozs7Ozs7O0lBVU1DLGlCOzs7QUFFSjs7Ozs7Ozs7O0FBU0EsNkJBQVlDLGNBQVosRUFBNEJDLFNBQTVCLEVBQXVDO0FBQUE7O0FBR3JDOzs7Ozs7O0FBSHFDLHNJQUMvQkEsU0FEK0I7O0FBVXJDLFVBQUtELGNBQUwsR0FBc0JBLGNBQXRCOztBQUVBOzs7Ozs7O0FBT0EsVUFBS0UsS0FBTCxHQUFhLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQWI7O0FBRUE7Ozs7Ozs7QUFPQSxVQUFLQyw4QkFBTCxHQUFzQyxJQUF0QztBQTVCcUM7QUE2QnRDOztBQUVEOzs7Ozs7OzRCQUdRO0FBQ04sV0FBS0gsY0FBTCxDQUFvQkksWUFBcEI7QUFDRDs7QUFFRDs7Ozs7OzJCQUdPO0FBQ0wsV0FBS0osY0FBTCxDQUFvQkssZUFBcEI7QUFDRDs7QUFFRDs7Ozs7Ozs7MkJBS087QUFBQTs7QUFDTDtBQUNBLFdBQUtMLGNBQUwsQ0FBb0JNLFFBQXBCLENBQTZCLEtBQUtMLFNBQWxDLElBQStDLElBQS9DOztBQUVBO0FBQ0EsVUFBSU0sa0JBQWtCLEtBQUtQLGNBQUwsQ0FBb0JRLE9BQTFDO0FBQ0EsVUFBSSxDQUFDRCxlQUFMLEVBQ0VBLGtCQUFrQixLQUFLUCxjQUFMLENBQW9CUyxJQUFwQixFQUFsQjs7QUFFRixhQUFPRixnQkFBZ0JHLElBQWhCLENBQXFCLFVBQUNDLE1BQUQ7QUFBQTtBQUFBLE9BQXJCLENBQVA7QUFDRDs7OztFQXZFNkJkLFc7O0FBMEVoQ2MsT0FBT0MsT0FBUCxHQUFpQmIsaUJBQWpCIiwiZmlsZSI6IkRPTUV2ZW50U3VibW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IGBET01FdmVudFN1Ym1vZHVsZWAgbW9kdWxlXG4gKiBAYXV0aG9yIDxhIGhyZWY9J21haWx0bzpzZWJhc3RpZW5Acm9iYXN6a2lld2ljei5jb20nPlPDqWJhc3RpZW4gUm9iYXN6a2lld2ljejwvYT4sIDxhIGhyZWY9J21haWx0bzpOb3JiZXJ0LlNjaG5lbGxAaXJjYW0uZnInPk5vcmJlcnQgU2NobmVsbDwvYT5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IElucHV0TW9kdWxlID0gcmVxdWlyZSgnLi9JbnB1dE1vZHVsZScpO1xuXG4vKipcbiAqIGBET01FdmVudFN1Ym1vZHVsZWAgY2xhc3MuXG4gKiBUaGUgYERPTUV2ZW50U3VibW9kdWxlYCBjbGFzcyBhbGxvd3MgdG8gaW5zdGFudGlhdGUgbW9kdWxlcyB0aGF0IHByb3ZpZGVcbiAqIHVuaWZpZWQgdmFsdWVzIChzdWNoIGFzIGBBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCwgYEFjY2VsZXJhdGlvbmAsXG4gKiBgUm90YXRpb25SYXRlYCwgYE9yaWVudGF0aW9uYCwgYE9yaWVudGF0aW9uQWx0KSBmcm9tIHRoZSBgZGV2aWNlbW90aW9uYFxuICogb3IgYGRldmljZW9yaWVudGF0aW9uYCBET00gZXZlbnRzLlxuICpcbiAqIEBjbGFzcyBET01FdmVudFN1Ym1vZHVsZVxuICogQGV4dGVuZHMgSW5wdXRNb2R1bGVcbiAqL1xuY2xhc3MgRE9NRXZlbnRTdWJtb2R1bGUgZXh0ZW5kcyBJbnB1dE1vZHVsZSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBgRE9NRXZlbnRTdWJtb2R1bGVgIG1vZHVsZSBpbnN0YW5jZS5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uTW9kdWxlfERldmljZU9yaWVudGF0aW9uTW9kdWxlfSBET01FdmVudE1vZHVsZSAtIFRoZSBwYXJlbnQgRE9NIGV2ZW50IG1vZHVsZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIFRoZSBuYW1lIG9mIHRoZSBzdWJtb2R1bGUgLyBldmVudCAoKmUuZy4qICdhY2NlbGVyYXRpb24nIG9yICdvcmllbnRhdGlvbkFsdCcpLlxuICAgKiBAc2VlIERldmljZU1vdGlvbk1vZHVsZVxuICAgKiBAc2VlIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihET01FdmVudE1vZHVsZSwgZXZlbnRUeXBlKSB7XG4gICAgc3VwZXIoZXZlbnRUeXBlKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBET00gZXZlbnQgcGFyZW50IG1vZHVsZSBmcm9tIHdoaWNoIHRoaXMgbW9kdWxlIGdldHMgdGhlIHJhdyB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAdGhpcyBET01FdmVudFN1Ym1vZHVsZVxuICAgICAqIEB0eXBlIHtEZXZpY2VNb3Rpb25Nb2R1bGV8RGV2aWNlT3JpZW50YXRpb25Nb2R1bGV9XG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgdGhpcy5ET01FdmVudE1vZHVsZSA9IERPTUV2ZW50TW9kdWxlO1xuXG4gICAgLyoqXG4gICAgICogUmF3IHZhbHVlcyBjb21pbmcgZnJvbSB0aGUgYGRldmljZW1vdGlvbmAgZXZlbnQgc2VudCBieSB0aGlzIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERPTUV2ZW50U3VibW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnQgPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBDb21wYXNzIGhlYWRpbmcgcmVmZXJlbmNlIChpT1MgZGV2aWNlcyBvbmx5LCBgT3JpZW50YXRpb25gIGFuZCBgT3JpZW50YXRpb25BbHRgIHN1Ym1vZHVsZXMgb25seSkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBET01FdmVudFN1Ym1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIHRoaXMuX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIG1vZHVsZS5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuRE9NRXZlbnRNb2R1bGUuX2FkZExpc3RlbmVyKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcHMgdGhlIG1vZHVsZS5cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5ET01FdmVudE1vZHVsZS5fcmVtb3ZlTGlzdGVuZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBvZiB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICAvLyBJbmRpY2F0ZSB0byB0aGUgcGFyZW50IG1vZHVsZSB0aGF0IHRoaXMgZXZlbnQgaXMgcmVxdWlyZWRcbiAgICB0aGlzLkRPTUV2ZW50TW9kdWxlLnJlcXVpcmVkW3RoaXMuZXZlbnRUeXBlXSA9IHRydWU7XG5cbiAgICAvLyBJZiB0aGUgcGFyZW50IGV2ZW50IGhhcyBub3QgYmVlbiBpbml0aWFsaXplZCB5ZXQsIGluaXRpYWxpemUgaXRcbiAgICBsZXQgRE9NRXZlbnRQcm9taXNlID0gdGhpcy5ET01FdmVudE1vZHVsZS5wcm9taXNlO1xuICAgIGlmICghRE9NRXZlbnRQcm9taXNlKVxuICAgICAgRE9NRXZlbnRQcm9taXNlID0gdGhpcy5ET01FdmVudE1vZHVsZS5pbml0KCk7XG5cbiAgICByZXR1cm4gRE9NRXZlbnRQcm9taXNlLnRoZW4oKG1vZHVsZSkgPT4gdGhpcyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBET01FdmVudFN1Ym1vZHVsZTsiXX0=