'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MotionInput = require('./MotionInput');

var _MotionInput2 = _interopRequireDefault(_MotionInput);

var _DeviceOrientationModule = require('./DeviceOrientationModule');

var _DeviceOrientationModule2 = _interopRequireDefault(_DeviceOrientationModule);

var _DeviceMotionModule = require('./DeviceMotionModule');

var _DeviceMotionModule2 = _interopRequireDefault(_DeviceMotionModule);

var _EnergyModule = require('./EnergyModule');

var _EnergyModule2 = _interopRequireDefault(_EnergyModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The motion input module can be used as follows
 *
 * @example
 * import motionInput from 'motion-input';
 * const requiredEvents = ;
 *
 * motionInput
 *  .init(['acceleration', 'orientation', 'energy'])
 *  .then(([acceleration, orientation, energy]) => {
 *    if (acceleration.isValid) {
 *      acceleration.addListener((data) => {
 *        console.log('acceleration', data);
 *        // do something with the acceleration values
 *      });
 *    }
 *
 *    // ...
 *  });
 */
_MotionInput2.default.addModule('devicemotion', _DeviceMotionModule2.default);
_MotionInput2.default.addModule('deviceorientation', _DeviceOrientationModule2.default);
_MotionInput2.default.addModule('accelerationIncludingGravity', _DeviceMotionModule2.default.accelerationIncludingGravity);
_MotionInput2.default.addModule('acceleration', _DeviceMotionModule2.default.acceleration);
_MotionInput2.default.addModule('rotationRate', _DeviceMotionModule2.default.rotationRate);
_MotionInput2.default.addModule('orientation', _DeviceOrientationModule2.default.orientation);
_MotionInput2.default.addModule('orientationAlt', _DeviceOrientationModule2.default.orientationAlt);
_MotionInput2.default.addModule('energy', _EnergyModule2.default);

exports.default = _MotionInput2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImFkZE1vZHVsZSIsImFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkiLCJhY2NlbGVyYXRpb24iLCJyb3RhdGlvblJhdGUiLCJvcmllbnRhdGlvbiIsIm9yaWVudGF0aW9uQWx0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFvQkE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQXZCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsc0JBQVlBLFNBQVosQ0FBc0IsY0FBdEI7QUFDQSxzQkFBWUEsU0FBWixDQUFzQixtQkFBdEI7QUFDQSxzQkFBWUEsU0FBWixDQUFzQiw4QkFBdEIsRUFBc0QsNkJBQW1CQyw0QkFBekU7QUFDQSxzQkFBWUQsU0FBWixDQUFzQixjQUF0QixFQUFzQyw2QkFBbUJFLFlBQXpEO0FBQ0Esc0JBQVlGLFNBQVosQ0FBc0IsY0FBdEIsRUFBc0MsNkJBQW1CRyxZQUF6RDtBQUNBLHNCQUFZSCxTQUFaLENBQXNCLGFBQXRCLEVBQXFDLGtDQUF3QkksV0FBN0Q7QUFDQSxzQkFBWUosU0FBWixDQUFzQixnQkFBdEIsRUFBd0Msa0NBQXdCSyxjQUFoRTtBQUNBLHNCQUFZTCxTQUFaLENBQXNCLFFBQXRCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgbW90aW9uIGlucHV0IG1vZHVsZSBjYW4gYmUgdXNlZCBhcyBmb2xsb3dzXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCBtb3Rpb25JbnB1dCBmcm9tICdtb3Rpb24taW5wdXQnO1xuICogY29uc3QgcmVxdWlyZWRFdmVudHMgPSA7XG4gKlxuICogbW90aW9uSW5wdXRcbiAqICAuaW5pdChbJ2FjY2VsZXJhdGlvbicsICdvcmllbnRhdGlvbicsICdlbmVyZ3knXSlcbiAqICAudGhlbigoW2FjY2VsZXJhdGlvbiwgb3JpZW50YXRpb24sIGVuZXJneV0pID0+IHtcbiAqICAgIGlmIChhY2NlbGVyYXRpb24uaXNWYWxpZCkge1xuICogICAgICBhY2NlbGVyYXRpb24uYWRkTGlzdGVuZXIoKGRhdGEpID0+IHtcbiAqICAgICAgICBjb25zb2xlLmxvZygnYWNjZWxlcmF0aW9uJywgZGF0YSk7XG4gKiAgICAgICAgLy8gZG8gc29tZXRoaW5nIHdpdGggdGhlIGFjY2VsZXJhdGlvbiB2YWx1ZXNcbiAqICAgICAgfSk7XG4gKiAgICB9XG4gKlxuICogICAgLy8gLi4uXG4gKiAgfSk7XG4gKi9cbmltcG9ydCBtb3Rpb25JbnB1dCBmcm9tICcuL01vdGlvbklucHV0JztcbmltcG9ydCBkZXZpY2VvcmllbnRhdGlvbk1vZHVsZSBmcm9tICcuL0RldmljZU9yaWVudGF0aW9uTW9kdWxlJztcbmltcG9ydCBkZXZpY2Vtb3Rpb25Nb2R1bGUgZnJvbSAnLi9EZXZpY2VNb3Rpb25Nb2R1bGUnO1xuaW1wb3J0IGVuZXJneSBmcm9tICcuL0VuZXJneU1vZHVsZSc7XG5cbm1vdGlvbklucHV0LmFkZE1vZHVsZSgnZGV2aWNlbW90aW9uJywgZGV2aWNlbW90aW9uTW9kdWxlKTtcbm1vdGlvbklucHV0LmFkZE1vZHVsZSgnZGV2aWNlb3JpZW50YXRpb24nLCBkZXZpY2VvcmllbnRhdGlvbk1vZHVsZSk7XG5tb3Rpb25JbnB1dC5hZGRNb2R1bGUoJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknLCBkZXZpY2Vtb3Rpb25Nb2R1bGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSk7XG5tb3Rpb25JbnB1dC5hZGRNb2R1bGUoJ2FjY2VsZXJhdGlvbicsIGRldmljZW1vdGlvbk1vZHVsZS5hY2NlbGVyYXRpb24pO1xubW90aW9uSW5wdXQuYWRkTW9kdWxlKCdyb3RhdGlvblJhdGUnLCBkZXZpY2Vtb3Rpb25Nb2R1bGUucm90YXRpb25SYXRlKTtcbm1vdGlvbklucHV0LmFkZE1vZHVsZSgnb3JpZW50YXRpb24nLCBkZXZpY2VvcmllbnRhdGlvbk1vZHVsZS5vcmllbnRhdGlvbik7XG5tb3Rpb25JbnB1dC5hZGRNb2R1bGUoJ29yaWVudGF0aW9uQWx0JywgZGV2aWNlb3JpZW50YXRpb25Nb2R1bGUub3JpZW50YXRpb25BbHQpO1xubW90aW9uSW5wdXQuYWRkTW9kdWxlKCdlbmVyZ3knLCBlbmVyZ3kpO1xuXG5leHBvcnQgZGVmYXVsdCBtb3Rpb25JbnB1dDtcbiJdfQ==