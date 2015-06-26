'use strict';

var input = require('../src');

(function() {
  input.init('acceleration', 'accelerationIncludingGravity')
    .then((modules) => {
      console.log(modules);
    });

  var accelerationSupported = false;
  var accelerationIncludingGravitySupported = false;
  var rotationRateSupported = false;
  var orientationSupported = false;

  var orientationAlphaRaw = document.getElementById('orientationAlphaRaw');
  var orientationBetaRaw = document.getElementById('orientationBetaRaw');
  var orientationGammaRaw = document.getElementById('orientationGammaRaw');

  var orientationAlphaUnified = document.getElementById('orientationAlphaUnified');
  var orientationBetaUnified = document.getElementById('orientationBetaUnified');
  var orientationGammaUnified = document.getElementById('orientationGammaUnified');

  var orientationAlphaScreen = document.getElementById('orientationAlphaScreen');
  var orientationBetaScreen = document.getElementById('orientationBetaScreen');
  var orientationGammaScreen = document.getElementById('orientationGammaScreen');

  var orientationAbsolute = document.getElementById('orientationAbsolute');
  var orientationWebkitCompassHeading = document.getElementById('orientationWebkitCompassHeading');
  var orientationWebkitCompassAccuracy = document.getElementById('orientationWebkitCompassAccuracy');

  var accelerationIncludingGravityXRaw = document.getElementById('accelerationIncludingGravityXRaw');
  var accelerationIncludingGravityYRaw = document.getElementById('accelerationIncludingGravityYRaw');
  var accelerationIncludingGravityZRaw = document.getElementById('accelerationIncludingGravityZRaw');

  var accelerationIncludingGravityXUnified = document.getElementById('accelerationIncludingGravityXUnified');
  var accelerationIncludingGravityYUnified = document.getElementById('accelerationIncludingGravityYUnified');
  var accelerationIncludingGravityZUnified = document.getElementById('accelerationIncludingGravityZUnified');

  var accelerationIncludingGravityXScreen = document.getElementById('accelerationIncludingGravityXScreen');
  var accelerationIncludingGravityYScreen = document.getElementById('accelerationIncludingGravityYScreen');
  var accelerationIncludingGravityZScreen = document.getElementById('accelerationIncludingGravityZScreen');

  var accelerationXRaw = document.getElementById('accelerationXRaw');
  var accelerationYRaw = document.getElementById('accelerationYRaw');
  var accelerationZRaw = document.getElementById('accelerationZRaw');

  var accelerationXUnified = document.getElementById('accelerationXUnified');
  var accelerationYUnified = document.getElementById('accelerationYUnified');
  var accelerationZUnified = document.getElementById('accelerationZUnified');

  var accelerationXScreen = document.getElementById('accelerationXScreen');
  var accelerationYScreen = document.getElementById('accelerationYScreen');
  var accelerationZScreen = document.getElementById('accelerationZScreen');

  var rotationRateAlphaRaw = document.getElementById('rotationRateAlphaRaw');
  var rotationRateBetaRaw = document.getElementById('rotationRateBetaRaw');
  var rotationRateGammaRaw = document.getElementById('rotationRateGammaRaw');

  var rotationRateAlphaUnified = document.getElementById('rotationRateAlphaUnified');
  var rotationRateBetaUnified = document.getElementById('rotationRateBetaUnified');
  var rotationRateGammaUnified = document.getElementById('rotationRateGammaUnified');

  var rotationRateAlphaScreen = document.getElementById('rotationRateAlphaScreen');
  var rotationRateBetaScreen = document.getElementById('rotationRateBetaScreen');
  var rotationRateGammaScreen = document.getElementById('rotationRateGammaScreen');

  var orientationSupport = document.getElementById('orientationSupport');
  var accelerationSupport = document.getElementById('accelerationSupport');
  var accelerationIncludingGravitySupport = document.getElementById('accelerationIncludingGravitySupport');
  var rotationRateSupport = document.getElementById('rotationRateSupport');

  function roundValue(input) {
    if (input === undefined)
      return "undefined";
    if (input === null)
      return "null";

    return Math.round(input * 100) / 100;
  }

  // input.orientationModule.on('orientation:support', (support) => {
  //   orientationSupported = support;

  //   if (orientationSupported) {
  //     orientationSupport.textContent = "OK";
  //     orientationSupport.classList.add("success");
  //   } else {
  //     orientationSupport.textContent = "Not supported";
  //     orientationSupport.classList.add("danger");
  //   }
  // });

  // input.motionModule.on('motion:support', (support) => {
  //   accelerationIncludingGravitySupported = support.accelerationIncludingGravity;
  //   accelerationSupported = support.acceleration;
  //   rotationRateSupported = support.rotationRate;

  //   if (accelerationIncludingGravitySupported) {
  //     accelerationIncludingGravitySupport.textContent = "OK";
  //     accelerationIncludingGravitySupport.classList.add("success");
  //   } else {
  //     accelerationIncludingGravitySupport.textContent = "Not supported";
  //     accelerationIncludingGravitySupport.classList.add("danger");
  //   }

  //   if (accelerationSupported) {
  //     accelerationSupport.textContent = "OK";
  //     accelerationSupport.classList.add("success");
  //   } else {
  //     accelerationSupport.textContent = "Not supported";
  //     accelerationSupport.classList.add("danger");
  //   }

  //   if (rotationRateSupported) {
  //     rotationRateSupport.textContent = "OK";
  //     rotationRateSupport.classList.add("success");
  //   } else {
  //     rotationRateSupport.textContent = "Not supported";
  //     rotationRateSupport.classList.add("danger");
  //   }
  // });

  // input.orientationModule.on('orientation:values', () => {
  //   if (orientationSupported) {
  //     orientationAlphaRaw.textContent = roundValue(input.orientationModule.lastRawEvent.alpha);
  //     orientationBetaRaw.textContent = roundValue(input.orientationModule.lastRawEvent.beta);
  //     orientationGammaRaw.textContent = roundValue(input.orientationModule.lastRawEvent.gamma);
  //     orientationAlphaUnified.textContent = roundValue(input.orientationModule.alpha);
  //     orientationBetaUnified.textContent = roundValue(input.orientationModule.beta);
  //     orientationGammaUnified.textContent = roundValue(input.orientationModule.gamma);
  //     orientationAbsolute.textContent = input.orientationModule.lastRawEvent.absolute + "";
  //     orientationWebkitCompassHeading.textContent = roundValue(input.orientationModule.lastRawEvent.webkitCompassHeading);
  //     orientationWebkitCompassAccuracy.textContent = roundValue(input.orientationModule.lastRawEvent.webkitCompassAccuracy);
  //   }

  //   if (!rotationRateSupported && input.rotationRate) {
  //     rotationRateAlphaUnified.textContent = roundValue(input.rotationRate.alpha);
  //     rotationRateBetaUnified.textContent = roundValue(input.rotationRate.beta);
  //     rotationRateGammaUnified.textContent = roundValue(input.rotationRate.gamma);
  //   }
  // });

  // input.motionModule.on('motion:values', () => {
  //   if (accelerationIncludingGravitySupported) {
  //     accelerationIncludingGravityXRaw.textContent = roundValue(input.motionModule.lastRawEvent.accelerationIncludingGravity.x);
  //     accelerationIncludingGravityYRaw.textContent = roundValue(input.motionModule.lastRawEvent.accelerationIncludingGravity.y);
  //     accelerationIncludingGravityZRaw.textContent = roundValue(input.motionModule.lastRawEvent.accelerationIncludingGravity.z);
  //     accelerationIncludingGravityXUnified.textContent = roundValue(input.motionModule.accelerationIncludingGravity.x);
  //     accelerationIncludingGravityYUnified.textContent = roundValue(input.motionModule.accelerationIncludingGravity.y);
  //     accelerationIncludingGravityZUnified.textContent = roundValue(input.motionModule.accelerationIncludingGravity.z);
  //   }

  //   if (accelerationSupported) {
  //     accelerationXRaw.textContent = roundValue(input.motionModule.lastRawEvent.acceleration.x);
  //     accelerationYRaw.textContent = roundValue(input.motionModule.lastRawEvent.acceleration.y);
  //     accelerationZRaw.textContent = roundValue(input.motionModule.lastRawEvent.acceleration.z);
  //     accelerationXUnified.textContent = roundValue(input.acceleration.x);
  //     accelerationYUnified.textContent = roundValue(input.acceleration.y);
  //     accelerationZUnified.textContent = roundValue(input.acceleration.z);
  //   } else {
  //     accelerationXUnified.textContent = roundValue(input.acceleration.x);
  //     accelerationYUnified.textContent = roundValue(input.acceleration.y);
  //     accelerationZUnified.textContent = roundValue(input.acceleration.z);
  //   }

  //   if (!orientationSupported) {
  //     orientationBetaUnified.textContent = roundValue(input.orientation.beta);
  //     orientationGammaUnified.textContent = roundValue(input.orientation.gamma);
  //   }

  //   if (rotationRateSupported) {
  //     rotationRateAlphaRaw.textContent = roundValue(input.motionModule.lastRawEvent.rotationRate.alpha);
  //     rotationRateBetaRaw.textContent = roundValue(input.motionModule.lastRawEvent.rotationRate.beta);
  //     rotationRateGammaRaw.textContent = roundValue(input.motionModule.lastRawEvent.rotationRate.gamma);
  //   } else {
  //     rotationRateAlphaUnified.textContent = roundValue(input.rotationRate.alpha);
  //     rotationRateBetaUnified.textContent = roundValue(input.rotationRate.beta);
  //     rotationRateGammaUnified.textContent = roundValue(input.rotationRate.gamma);
  //   }
  // });

  // input.motionModule.start();
  // input.orientationModule.start();
}());