const motionInput = require('./MotionInput');
const deviceorientationModule = require('./DeviceorientationModule');
const devicemotionModule = require('./DevicemotionModule');

motionInput.addModule('deviceorientation', deviceorientationModule);
motionInput.addModule('devicemotion', devicemotionModule);
motionInput.addModule('orientation', deviceorientationModule.orientation);
motionInput.addModule('accelerationIncludingGravity', devicemotionModule.accelerationIncludingGravity);
motionInput.addModule('acceleration', devicemotionModule.acceleration);
motionInput.addModule('rotationRate', devicemotionModule.rotationRate);

module.exports = motionInput;