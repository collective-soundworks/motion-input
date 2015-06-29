const motionInput = require('./MotionInput');
const deviceorientationModule = require('./DeviceorientationModule');
const devicemotionModule = require('./DevicemotionModule');

motionInput.addModule('devicemotion', devicemotionModule);
motionInput.addModule('orientation', deviceorientationModule);
motionInput.addModule('accelerationIncludingGravity', devicemotionModule.accelerationIncludingGravity);
motionInput.addModule('acceleration', devicemotionModule.acceleration);
motionInput.addModule('rotationRate', devicemotionModule.rotationRate);
//motionInput.addModule('coucou', require("./CoucouModule"));

module.exports = motionInput;