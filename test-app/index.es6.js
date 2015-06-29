'use strict';
require('babel/polyfill');

const input = require('../src');

// Sensor support DOM elements
var orientationProvided = document.getElementById('orientationProvided');
var accelerationIncludingGravityProvided = document.getElementById('accelerationIncludingGravityProvided');
var accelerationProvided = document.getElementById('accelerationProvided');
var rotationRateProvided = document.getElementById('rotationRateProvided');

// Orientation DOM elements
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

// Acceleration including gravity DOM elements
var accelerationIncludingGravityXRaw = document.getElementById('accelerationIncludingGravityXRaw');
var accelerationIncludingGravityYRaw = document.getElementById('accelerationIncludingGravityYRaw');
var accelerationIncludingGravityZRaw = document.getElementById('accelerationIncludingGravityZRaw');

var accelerationIncludingGravityXUnified = document.getElementById('accelerationIncludingGravityXUnified');
var accelerationIncludingGravityYUnified = document.getElementById('accelerationIncludingGravityYUnified');
var accelerationIncludingGravityZUnified = document.getElementById('accelerationIncludingGravityZUnified');

var accelerationIncludingGravityXScreen = document.getElementById('accelerationIncludingGravityXScreen');
var accelerationIncludingGravityYScreen = document.getElementById('accelerationIncludingGravityYScreen');
var accelerationIncludingGravityZScreen = document.getElementById('accelerationIncludingGravityZScreen');

// Acceleration DOM elements
var accelerationXRaw = document.getElementById('accelerationXRaw');
var accelerationYRaw = document.getElementById('accelerationYRaw');
var accelerationZRaw = document.getElementById('accelerationZRaw');

var accelerationXUnified = document.getElementById('accelerationXUnified');
var accelerationYUnified = document.getElementById('accelerationYUnified');
var accelerationZUnified = document.getElementById('accelerationZUnified');

var accelerationXScreen = document.getElementById('accelerationXScreen');
var accelerationYScreen = document.getElementById('accelerationYScreen');
var accelerationZScreen = document.getElementById('accelerationZScreen');

// Rotation rate DOM elements
var rotationRateAlphaRaw = document.getElementById('rotationRateAlphaRaw');
var rotationRateBetaRaw = document.getElementById('rotationRateBetaRaw');
var rotationRateGammaRaw = document.getElementById('rotationRateGammaRaw');

var rotationRateAlphaUnified = document.getElementById('rotationRateAlphaUnified');
var rotationRateBetaUnified = document.getElementById('rotationRateBetaUnified');
var rotationRateGammaUnified = document.getElementById('rotationRateGammaUnified');

var rotationRateAlphaScreen = document.getElementById('rotationRateAlphaScreen');
var rotationRateBetaScreen = document.getElementById('rotationRateBetaScreen');
var rotationRateGammaScreen = document.getElementById('rotationRateGammaScreen');

function roundValue(input) {
  if (input === undefined)
    return 'undefined';
  if (input === null)
    return 'null';

  return Math.round(input * 100) / 100;
}

function displayProvidedSensors(modules) {
  const [orientation, accelerationIncludingGravity, acceleration, rotationRate] = modules;
  if (orientation.isValid) {
    orientationProvided.textContent = 'Yes';
    orientationProvided.classList.add('success');
    orientationProvided.classList.remove('danger');
  }
  if (accelerationIncludingGravity.isValid) {
    accelerationIncludingGravityProvided.textContent = 'Yes';
    accelerationIncludingGravityProvided.classList.add('success');
    accelerationIncludingGravityProvided.classList.remove('danger');
  }
  if (acceleration.isValid) {
    accelerationProvided.textContent = 'Yes';
    accelerationProvided.classList.add('success');
    accelerationProvided.classList.remove('danger');
  }
  if (rotationRate.isValid) {
    rotationRateProvided.textContent = 'Yes';
    rotationRateProvided.classList.add('success');
    rotationRateProvided.classList.remove('danger');
  }
}

function displayDevicemotionRaw(module) {
  if (module.isValid) {
    input.addListener('devicemotion', (devicemotion) => {
      accelerationIncludingGravityXRaw.textContent = roundValue(devicemotion[0]);
      accelerationIncludingGravityYRaw.textContent = roundValue(devicemotion[1]);
      accelerationIncludingGravityZRaw.textContent = roundValue(devicemotion[2]);

      accelerationXRaw.textContent = roundValue(devicemotion[3]);
      accelerationYRaw.textContent = roundValue(devicemotion[4]);
      accelerationZRaw.textContent = roundValue(devicemotion[5]);

      rotationRateAlphaRaw.textContent = roundValue(devicemotion[6]);
      rotationRateBetaRaw.textContent = roundValue(devicemotion[7]);
      rotationRateGammaRaw.textContent = roundValue(devicemotion[8]);
    });
  }
}

function displayOrientation(module) {
  if (module.isValid) {
    input.addListener('orientation', (orientation) => {
      orientationAlphaUnified.textContent = roundValue(orientation[0]);
      orientationBetaUnified.textContent = roundValue(orientation[1]);
      orientationGammaUnified.textContent = roundValue(orientation[2]);
    });
  }
}

function displayAccelerationIncludingGravity(module) {
  if (module.isValid) {
    input.addListener('accelerationIncludingGravity', (accelerationIncludingGravity) => {
      accelerationIncludingGravityXUnified.textContent = roundValue(accelerationIncludingGravity[0]);
      accelerationIncludingGravityYUnified.textContent = roundValue(accelerationIncludingGravity[1]);
      accelerationIncludingGravityZUnified.textContent = roundValue(accelerationIncludingGravity[2]);
    });
  }
}

function displayAcceleration(module) {
  if (module.isValid) {
    input.addListener('acceleration', (acceleration) => {
      accelerationXUnified.textContent = roundValue(acceleration[0]);
      accelerationYUnified.textContent = roundValue(acceleration[1]);
      accelerationZUnified.textContent = roundValue(acceleration[2]);
    });
  }
}

function displayRotationRate(module) {
  if (module.isValid) {
    input.addListener('rotationRate', (rotationRate) => {
      rotationRateAlphaUnified.textContent = roundValue(rotationRate[0]);
      rotationRateBetaUnified.textContent = roundValue(rotationRate[1]);
      rotationRateGammaUnified.textContent = roundValue(rotationRate[2]);
    });
  }
}

(function() {
  input.init('orientation', 'devicemotion', 'accelerationIncludingGravity', 'acceleration', 'rotationRate')
    .then((modules) => {
      const [orientation, devicemotion, accelerationIncludingGravity, acceleration, rotationRate] = modules;

      displayProvidedSensors(modules);
      displayDevicemotionRaw(devicemotion);
      displayOrientation(orientation)
      displayAccelerationIncludingGravity(accelerationIncludingGravity);
      displayAcceleration(acceleration);
      displayRotationRate(rotationRate);
    });

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
}());