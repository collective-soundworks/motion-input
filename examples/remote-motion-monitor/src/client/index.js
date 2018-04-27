import * as lfo from 'waves-lfo/client';

/**
 * -----------------------------------------------------
 * lfo chain
 * -----------------------------------------------------
 */

const socketReceive = new lfo.source.SocketReceive({ port: 5010 });
socketReceive.processStreamParams({
  frameType: 'vector',
  frameSize: 6,
  frameRate: 0,
});

const scaler = new lfo.operator.Multiplier({ factor: [
  1 / 9.81,
  1 / 9.81,
  1 / 9.81,
  1 / 360,
  1 / 360,
  1 / 360,
]});

const logger = new lfo.sink.Logger({ time: false, data: true });

socketReceive.connect(scaler);

// x axis
const xAccRawSelect = new lfo.operator.Select({ index: 0 });
const xDisplay = new lfo.sink.BpfDisplay({
  canvas: '#x-display',
  min: -1,
  max: 1,
  duration: 5,
  width: 300,
  height: 150,
  colors: ['blue'],
});

scaler.connect(xAccRawSelect);
xAccRawSelect.connect(xDisplay);

// y axis
const yAccRawSelect = new lfo.operator.Select({ index: 1 });
const yDisplay = new lfo.sink.BpfDisplay({
  canvas: '#y-display',
  min: -1,
  max: 1,
  duration: 5,
  width: 300,
  height: 150,
  colors: ['orange'],
});

scaler.connect(yAccRawSelect);
yAccRawSelect.connect(yDisplay);

// z axis
const zAccRawSelect = new lfo.operator.Select({ index: 2 });
const zDisplay = new lfo.sink.BpfDisplay({
  canvas: '#z-display',
  min: -1,
  max: 1,
  duration: 5,
  width: 300,
  height: 150,
  colors: ['green'],
});

scaler.connect(zAccRawSelect);
zAccRawSelect.connect(zDisplay);

// alpha
const alphaRawSelect = new lfo.operator.Select({ index: 3 });
const alphaDisplay = new lfo.sink.BpfDisplay({
  canvas: '#alpha-display',
  min: -1,
  max: 1,
  duration: 5,
  width: 300,
  height: 150,
  colors: ['blue'],
});

scaler.connect(alphaRawSelect);
alphaRawSelect.connect(alphaDisplay);

// beta
const betaRawSelect = new lfo.operator.Select({ index: 4 });
const betaDisplay = new lfo.sink.BpfDisplay({
  canvas: '#beta-display',
  min: -1,
  max: 1,
  duration: 5,
  width: 300,
  height: 150,
  colors: ['orange'],
});

scaler.connect(betaRawSelect);
betaRawSelect.connect(betaDisplay);

// gamma
const gammaRawSelect = new lfo.operator.Select({ index: 5 });
const gammaDisplay = new lfo.sink.BpfDisplay({
  canvas: '#gamma-display',
  min: -1,
  max: 1,
  duration: 5,
  width: 300,
  height: 150,
  colors: ['green'],
});

scaler.connect(gammaRawSelect);
gammaRawSelect.connect(gammaDisplay);

