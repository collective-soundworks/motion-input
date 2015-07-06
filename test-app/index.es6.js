'use strict';
require('babel/polyfill');

const input = require('../src');

// Sensor support DOM elements
var accelerationIncludingGravityProvided = document.getElementById('accelerationIncludingGravityProvided');
var accelerationProvided = document.getElementById('accelerationProvided');
var rotationRateProvided = document.getElementById('rotationRateProvided');
var orientationProvided = document.getElementById('orientationProvided');

// Acceleration including gravity DOM elements
var accelerationIncludingGravityXRaw = document.getElementById('accelerationIncludingGravityXRaw');
var accelerationIncludingGravityYRaw = document.getElementById('accelerationIncludingGravityYRaw');
var accelerationIncludingGravityZRaw = document.getElementById('accelerationIncludingGravityZRaw');

var accelerationIncludingGravityXUnified = document.getElementById('accelerationIncludingGravityXUnified');
var accelerationIncludingGravityYUnified = document.getElementById('accelerationIncludingGravityYUnified');
var accelerationIncludingGravityZUnified = document.getElementById('accelerationIncludingGravityZUnified');

// Acceleration DOM elements
var accelerationXRaw = document.getElementById('accelerationXRaw');
var accelerationYRaw = document.getElementById('accelerationYRaw');
var accelerationZRaw = document.getElementById('accelerationZRaw');

var accelerationXUnified = document.getElementById('accelerationXUnified');
var accelerationYUnified = document.getElementById('accelerationYUnified');
var accelerationZUnified = document.getElementById('accelerationZUnified');

// Rotation rate DOM elements
var rotationRateAlphaRaw = document.getElementById('rotationRateAlphaRaw');
var rotationRateBetaRaw = document.getElementById('rotationRateBetaRaw');
var rotationRateGammaRaw = document.getElementById('rotationRateGammaRaw');

var rotationRateAlphaUnified = document.getElementById('rotationRateAlphaUnified');
var rotationRateBetaUnified = document.getElementById('rotationRateBetaUnified');
var rotationRateGammaUnified = document.getElementById('rotationRateGammaUnified');

// Orientation DOM elements
var orientationAlphaRaw = document.getElementById('orientationAlphaRaw');
var orientationBetaRaw = document.getElementById('orientationBetaRaw');
var orientationGammaRaw = document.getElementById('orientationGammaRaw');

var orientationAlphaUnified = document.getElementById('orientationAlphaUnified');
var orientationBetaUnified = document.getElementById('orientationBetaUnified');
var orientationGammaUnified = document.getElementById('orientationGammaUnified');

// Orientation (Alternative) DOM elements
var orientationAltAlpha = document.getElementById('orientationAltAlpha');
var orientationAltBeta = document.getElementById('orientationAltBeta');
var orientationAltGamma = document.getElementById('orientationAltGamma');

// Energy DOM elements
var energyFast = document.getElementById('energyFast');
var energySlow = document.getElementById('energySlow');

function roundValue(input) {
  if (input === undefined)
    return 'undefined';
  if (input === null)
    return 'null';

  return Math.round(input * 100) / 100;
}

function displayProvidedSensors(modules) {
  const [
    devicemotion,
    accelerationIncludingGravity,
    acceleration,
    rotationRate,
    deviceorientation,
    orientation,
    orientationAlt,
    energy
  ] = modules;

  if (accelerationIncludingGravity.isProvided) {
    accelerationIncludingGravityProvided.textContent = 'Yes';
    accelerationIncludingGravityProvided.classList.add('success');
    accelerationIncludingGravityProvided.classList.remove('danger');
  }

  if (acceleration.isProvided) {
    accelerationProvided.textContent = 'Yes';
    accelerationProvided.classList.add('success');
    accelerationProvided.classList.remove('danger');
  }

  if (rotationRate.isProvided) {
    rotationRateProvided.textContent = 'Yes';
    rotationRateProvided.classList.add('success');
    rotationRateProvided.classList.remove('danger');
  }

  if (orientation.isProvided) {
    orientationProvided.textContent = 'Yes';
    orientationProvided.classList.add('success');
    orientationProvided.classList.remove('danger');
  }
}

function displayDeviceorientationRaw(module) {
  if (module.isValid) {
    input.addListener('deviceorientation', (val) => {
      orientationAlphaRaw.textContent = roundValue(val[0]);
      orientationBetaRaw.textContent = roundValue(val[1]);
      orientationGammaRaw.textContent = roundValue(val[2]);
    });
  }
}

function displayDevicemotionRaw(module) {
  if (module.isValid) {
    input.addListener('devicemotion', (val) => {
      accelerationIncludingGravityXRaw.textContent = roundValue(val[0]);
      accelerationIncludingGravityYRaw.textContent = roundValue(val[1]);
      accelerationIncludingGravityZRaw.textContent = roundValue(val[2]);

      accelerationXRaw.textContent = roundValue(val[3]);
      accelerationYRaw.textContent = roundValue(val[4]);
      accelerationZRaw.textContent = roundValue(val[5]);

      rotationRateAlphaRaw.textContent = roundValue(val[6]);
      rotationRateBetaRaw.textContent = roundValue(val[7]);
      rotationRateGammaRaw.textContent = roundValue(val[8]);
    });
  }
}

function displayAccelerationIncludingGravity(module) {
  if (module.isValid) {
    input.addListener('accelerationIncludingGravity', (val) => {
      accelerationIncludingGravityXUnified.textContent = roundValue(val[0]);
      accelerationIncludingGravityYUnified.textContent = roundValue(val[1]);
      accelerationIncludingGravityZUnified.textContent = roundValue(val[2]);
    });
  }
}

function displayAcceleration(module) {
  if (module.isValid) {
    input.addListener('acceleration', (val) => {
      accelerationXUnified.textContent = roundValue(val[0]);
      accelerationYUnified.textContent = roundValue(val[1]);
      accelerationZUnified.textContent = roundValue(val[2]);
    });
  }
}

function displayRotationRate(module) {
  if (module.isValid) {
    input.addListener('rotationRate', (val) => {
      rotationRateAlphaUnified.textContent = roundValue(val[0]);
      rotationRateBetaUnified.textContent = roundValue(val[1]);
      rotationRateGammaUnified.textContent = roundValue(val[2]);
    });
  }
}

function displayOrientation(module) {
  if (module.isValid) {
    input.addListener('orientation', (val) => {
      orientationAlphaUnified.textContent = roundValue(val[0]);
      orientationBetaUnified.textContent = roundValue(val[1]);
      orientationGammaUnified.textContent = roundValue(val[2]);
    });
  }
}

function displayOrientationAlt(module) {
  if (module.isValid) {
    input.addListener('orientationAlt', (val) => {
      orientationAltAlpha.textContent = roundValue(val[0]);
      orientationAltBeta.textContent = roundValue(val[1]);
      orientationAltGamma.textContent = roundValue(val[2]);
    });
  }
}

function displayEnergy(module) {
  if (module.isValid) {
    input.addListener('energy', (val) => {
      energy.textContent = roundValue(val);
    });
  }
}

(function() {
  input.init(
    'devicemotion',
    'accelerationIncludingGravity',
    'acceleration',
    'rotationRate',
    'deviceorientation',
    'orientation',
    'orientationAlt',
    'energy'
  ).then((modules) => {
    const [
      devicemotion,
      accelerationIncludingGravity,
      acceleration,
      rotationRate,
      deviceorientation,
      orientation,
      orientationAlt,
      energy
    ] = modules;

    displayProvidedSensors(modules);
    displayDevicemotionRaw(devicemotion);
    displayAccelerationIncludingGravity(accelerationIncludingGravity);
    displayAcceleration(acceleration);
    displayRotationRate(rotationRate);
    displayDeviceorientationRaw(deviceorientation);
    displayOrientation(orientation);
    displayOrientationAlt(orientationAlt);
    displayEnergy(energy);
  });
}());