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
import motionInput from './MotionInput';
import deviceorientationModule from './DeviceOrientationModule';
import devicemotionModule from './DeviceMotionModule';
import energy from './EnergyModule';

motionInput.addModule('devicemotion', devicemotionModule);
motionInput.addModule('deviceorientation', deviceorientationModule);
motionInput.addModule('accelerationIncludingGravity', devicemotionModule.accelerationIncludingGravity);
motionInput.addModule('acceleration', devicemotionModule.acceleration);
motionInput.addModule('rotationRate', devicemotionModule.rotationRate);
motionInput.addModule('orientation', deviceorientationModule.orientation);
motionInput.addModule('orientationAlt', deviceorientationModule.orientationAlt);
motionInput.addModule('energy', energy);

export default motionInput;
