const motionInput = require("./MotionInput");

const devicemotionModule = require("./DevicemotionModule");
motionInput.addModule('accelerationIncludingGravity', devicemotionModule.accelerationIncludingGravity);
motionInput.addModule('acceleration', devicemotionModule.acceleration);
motionInput.addModule('rotationRate', devicemotionModule.rotationRate);
//motionInput.addModule('coucou', require("./CoucouModule"));

module.exports = motionInput;