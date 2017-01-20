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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImFkZE1vZHVsZSIsImFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkiLCJhY2NlbGVyYXRpb24iLCJyb3RhdGlvblJhdGUiLCJvcmllbnRhdGlvbiIsIm9yaWVudGF0aW9uQWx0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFxQkE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQXhCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLHNCQUFZQSxTQUFaLENBQXNCLGNBQXRCO0FBQ0Esc0JBQVlBLFNBQVosQ0FBc0IsbUJBQXRCO0FBQ0Esc0JBQVlBLFNBQVosQ0FBc0IsOEJBQXRCLEVBQXNELDZCQUFtQkMsNEJBQXpFO0FBQ0Esc0JBQVlELFNBQVosQ0FBc0IsY0FBdEIsRUFBc0MsNkJBQW1CRSxZQUF6RDtBQUNBLHNCQUFZRixTQUFaLENBQXNCLGNBQXRCLEVBQXNDLDZCQUFtQkcsWUFBekQ7QUFDQSxzQkFBWUgsU0FBWixDQUFzQixhQUF0QixFQUFxQyxrQ0FBd0JJLFdBQTdEO0FBQ0Esc0JBQVlKLFNBQVosQ0FBc0IsZ0JBQXRCLEVBQXdDLGtDQUF3QkssY0FBaEU7QUFDQSxzQkFBWUwsU0FBWixDQUFzQixRQUF0QiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIG1vdGlvbiBpbnB1dCBtb2R1bGUgY2FuIGJlIHVzZWQgYXMgZm9sbG93c1xuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgbW90aW9uSW5wdXQgZnJvbSAnbW90aW9uLWlucHV0JztcbiAqIGNvbnN0IHJlcXVpcmVkRXZlbnRzID0gO1xuICpcbiAqIG1vdGlvbklucHV0XG4gKiAgLmluaXQoWydhY2NlbGVyYXRpb24nLCAnb3JpZW50YXRpb24nLCAnZW5lcmd5J10pXG4gKiAgLnRoZW4oKFthY2NlbGVyYXRpb24sIG9yaWVudGF0aW9uLCBlbmVyZ3ldKSA9PiB7XG4gKiAgICBpZiAoYWNjZWxlcmF0aW9uLmlzVmFsaWQpIHtcbiAqICAgICAgYWNjZWxlcmF0aW9uLmFkZExpc3RlbmVyKChkYXRhKSA9PiB7XG4gKiAgICAgICAgY29uc29sZS5sb2coJ2FjY2VsZXJhdGlvbicsIGRhdGEpO1xuICogICAgICAgIC8vIGRvIHNvbWV0aGluZyB3aXRoIHRoZSBhY2NlbGVyYXRpb24gdmFsdWVzXG4gKiAgICAgIH0pO1xuICogICAgfVxuICpcbiAqICAgIC8vIC4uLlxuICogIH0pO1xuICovXG5cbmltcG9ydCBtb3Rpb25JbnB1dCBmcm9tICcuL01vdGlvbklucHV0JztcbmltcG9ydCBkZXZpY2VvcmllbnRhdGlvbk1vZHVsZSBmcm9tICcuL0RldmljZU9yaWVudGF0aW9uTW9kdWxlJztcbmltcG9ydCBkZXZpY2Vtb3Rpb25Nb2R1bGUgZnJvbSAnLi9EZXZpY2VNb3Rpb25Nb2R1bGUnO1xuaW1wb3J0IGVuZXJneSBmcm9tICcuL0VuZXJneU1vZHVsZSc7XG5cbm1vdGlvbklucHV0LmFkZE1vZHVsZSgnZGV2aWNlbW90aW9uJywgZGV2aWNlbW90aW9uTW9kdWxlKTtcbm1vdGlvbklucHV0LmFkZE1vZHVsZSgnZGV2aWNlb3JpZW50YXRpb24nLCBkZXZpY2VvcmllbnRhdGlvbk1vZHVsZSk7XG5tb3Rpb25JbnB1dC5hZGRNb2R1bGUoJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknLCBkZXZpY2Vtb3Rpb25Nb2R1bGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSk7XG5tb3Rpb25JbnB1dC5hZGRNb2R1bGUoJ2FjY2VsZXJhdGlvbicsIGRldmljZW1vdGlvbk1vZHVsZS5hY2NlbGVyYXRpb24pO1xubW90aW9uSW5wdXQuYWRkTW9kdWxlKCdyb3RhdGlvblJhdGUnLCBkZXZpY2Vtb3Rpb25Nb2R1bGUucm90YXRpb25SYXRlKTtcbm1vdGlvbklucHV0LmFkZE1vZHVsZSgnb3JpZW50YXRpb24nLCBkZXZpY2VvcmllbnRhdGlvbk1vZHVsZS5vcmllbnRhdGlvbik7XG5tb3Rpb25JbnB1dC5hZGRNb2R1bGUoJ29yaWVudGF0aW9uQWx0JywgZGV2aWNlb3JpZW50YXRpb25Nb2R1bGUub3JpZW50YXRpb25BbHQpO1xubW90aW9uSW5wdXQuYWRkTW9kdWxlKCdlbmVyZ3knLCBlbmVyZ3kpO1xuXG5leHBvcnQgZGVmYXVsdCBtb3Rpb25JbnB1dDtcbiJdfQ==