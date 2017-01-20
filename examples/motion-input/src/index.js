import motionInput from '../../../dist/index';

// Sensor support DOM elements
const accelerationIncludingGravityProvided = document.querySelector('#accelerationIncludingGravityProvided');
const accelerationProvided = document.querySelector('#accelerationProvided');
const rotationRateProvided = document.querySelector('#rotationRateProvided');
const orientationProvided = document.querySelector('#orientationProvided');

// Acceleration including gravity DOM elements
const accelerationIncludingGravityXRaw = document.querySelector('#accelerationIncludingGravityXRaw');
const accelerationIncludingGravityYRaw = document.querySelector('#accelerationIncludingGravityYRaw');
const accelerationIncludingGravityZRaw = document.querySelector('#accelerationIncludingGravityZRaw');

const accelerationIncludingGravityXUnified = document.querySelector('#accelerationIncludingGravityXUnified');
const accelerationIncludingGravityYUnified = document.querySelector('#accelerationIncludingGravityYUnified');
const accelerationIncludingGravityZUnified = document.querySelector('#accelerationIncludingGravityZUnified');

// Acceleration DOM elements
const accelerationXRaw = document.querySelector('#accelerationXRaw');
const accelerationYRaw = document.querySelector('#accelerationYRaw');
const accelerationZRaw = document.querySelector('#accelerationZRaw');

const accelerationXUnified = document.querySelector('#accelerationXUnified');
const accelerationYUnified = document.querySelector('#accelerationYUnified');
const accelerationZUnified = document.querySelector('#accelerationZUnified');

// Rotation rate DOM elements
const rotationRateAlphaRaw = document.querySelector('#rotationRateAlphaRaw');
const rotationRateBetaRaw = document.querySelector('#rotationRateBetaRaw');
const rotationRateGammaRaw = document.querySelector('#rotationRateGammaRaw');

const rotationRateAlphaUnified = document.querySelector('#rotationRateAlphaUnified');
const rotationRateBetaUnified = document.querySelector('#rotationRateBetaUnified');
const rotationRateGammaUnified = document.querySelector('#rotationRateGammaUnified');

// Orientation DOM elements
const orientationAlphaRaw = document.querySelector('#orientationAlphaRaw');
const orientationBetaRaw = document.querySelector('#orientationBetaRaw');
const orientationGammaRaw = document.querySelector('#orientationGammaRaw');

const orientationAlphaUnified = document.querySelector('#orientationAlphaUnified');
const orientationBetaUnified = document.querySelector('#orientationBetaUnified');
const orientationGammaUnified = document.querySelector('#orientationGammaUnified');

// Orientation (Alternative) DOM elements
const orientationAltAlpha = document.querySelector('#orientationAltAlpha');
const orientationAltBeta = document.querySelector('#orientationAltBeta');
const orientationAltGamma = document.querySelector('#orientationAltGamma');

// Energy DOM elements
const energy = document.querySelector('#energy');

function roundValue(input) {
  if (input === undefined)
    return 'undefined';
  if (input === null)
    return 'null';

  return Math.round(input * 100) / 100;
}

function displayProvidedSensors(modules) {
  const devicemotion = modules[0];
  const accelerationIncludingGravity = modules[1];
  const acceleration = modules[2];
  const rotationRate = modules[3];
  const deviceorientation = modules[4];
  const orientation = modules[5];
  const orientationAlt = modules[6];
  const energy = modules[7];

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
    module.addListener((val) => {
      orientationAlphaRaw.textContent = roundValue(val[0]);
      orientationBetaRaw.textContent = roundValue(val[1]);
      orientationGammaRaw.textContent = roundValue(val[2]);
    });
  }
}

function displayDevicemotionRaw(module) {
  if (module.isValid) {
    module.addListener((val) => {
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
    module.addListener((val) => {
      accelerationIncludingGravityXUnified.textContent = roundValue(val[0]);
      accelerationIncludingGravityYUnified.textContent = roundValue(val[1]);
      accelerationIncludingGravityZUnified.textContent = roundValue(val[2]);
    });
  }
}

function displayAcceleration(module) {
  if (module.isValid) {
    module.addListener((val) => {
      accelerationXUnified.textContent = roundValue(val[0]);
      accelerationYUnified.textContent = roundValue(val[1]);
      accelerationZUnified.textContent = roundValue(val[2]);
    });
  }
}

function displayRotationRate(module) {
  if (module.isValid) {
    module.addListener((val) => {
      rotationRateAlphaUnified.textContent = roundValue(val[0]);
      rotationRateBetaUnified.textContent = roundValue(val[1]);
      rotationRateGammaUnified.textContent = roundValue(val[2]);
    });
  }
}

function displayOrientation(module) {
  if (module.isValid) {
    module.addListener((val) => {
      orientationAlphaUnified.textContent = roundValue(val[0]);
      orientationBetaUnified.textContent = roundValue(val[1]);
      orientationGammaUnified.textContent = roundValue(val[2]);
    });
  }
}

function displayOrientationAlt(module) {
  if (module.isValid) {
    module.addListener((val) => {
      orientationAltAlpha.textContent = roundValue(val[0]);
      orientationAltBeta.textContent = roundValue(val[1]);
      orientationAltGamma.textContent = roundValue(val[2]);
    });
  }
}

function displayEnergy(module) {
  if (module.isValid) {
    module.addListener((val) => {
      energy.textContent = roundValue(val);
    });
  }
}

motionInput.init([
  'devicemotion',
  'accelerationIncludingGravity',
  'acceleration',
  'rotationRate',
  'deviceorientation',
  'orientation',
  'orientationAlt',
  'energy'
]).then(function(modules) {
  const devicemotion = modules[0];
  const accelerationIncludingGravity = modules[1];
  const acceleration = modules[2];
  const rotationRate = modules[3];
  const deviceorientation = modules[4];
  const orientation = modules[5];
  const orientationAlt = modules[6];
  const energy = modules[7];

  displayProvidedSensors(modules);
  displayDevicemotionRaw(devicemotion);
  displayAccelerationIncludingGravity(accelerationIncludingGravity);
  displayAcceleration(acceleration);
  displayRotationRate(rotationRate);
  displayDeviceorientationRaw(deviceorientation);
  displayOrientation(orientation);
  displayOrientationAlt(orientationAlt);
  displayEnergy(energy);

}).catch((err) => console.error(err.stack));

