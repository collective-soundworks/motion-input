import * as lfo from 'waves-lfo/client';
import Merger from './lib/Merger';
import Scaler from './lib/Scaler';

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

const logger = new lfo.sink.Logger({ time: false, data: true });

// x axis
const xDisplay = new lfo.sink.BpfDisplay({
  canvas: '#x-display',
  min: -1,
  max: 1,
  duration: 5,
  width: 300,
  height: 150,
  colors: ['blue'],
});

const xAccRawSelect = new lfo.operator.Select({ index: 0 });
const xAccRawScaler = new Scaler({ factor: 1 / 9.81 }); // normalize

socketReceive.connect(xAccRawSelect);
xAccRawSelect.connect(xAccRawScaler);
xAccRawScaler.connect(xDisplay);

// y axis
const yDisplay = new lfo.sink.BpfDisplay({
  canvas: '#y-display',
  min: -1,
  max: 1,
  duration: 5,
  width: 300,
  height: 150,
  colors: ['orange'],
});

const yAccRawSelect = new lfo.operator.Select({ index: 1 });
const yAccRawScaler = new Scaler({ factor: 1 / 9.81 }); // normalize

socketReceive.connect(yAccRawSelect);
yAccRawSelect.connect(yAccRawScaler);
yAccRawScaler.connect(yDisplay);

// z axis
const zDisplay = new lfo.sink.BpfDisplay({
  canvas: '#z-display',
  min: -1,
  max: 1,
  duration: 5,
  width: 300,
  height: 150,
  colors: ['green'],
});

const zAccRawSelect = new lfo.operator.Select({ index: 2 });
const zAccRawScaler = new Scaler({ factor: 1 / 9.81 }); // normalize

socketReceive.connect(zAccRawSelect);
zAccRawSelect.connect(zAccRawScaler);
zAccRawScaler.connect(zDisplay);


// alpha
const alphaDisplay = new lfo.sink.BpfDisplay({
  canvas: '#alpha-display',
  min: -1,
  max: 1,
  duration: 5,
  width: 300,
  height: 150,
  colors: ['blue'],
});

const alphaRawSelect = new lfo.operator.Select({ index: 3 });
const alphaRawScaler = new Scaler({ factor: 1 / 360 }); // normalize

socketReceive.connect(alphaRawSelect);
alphaRawSelect.connect(alphaRawScaler);
alphaRawScaler.connect(alphaDisplay);

// beta
const betaDisplay = new lfo.sink.BpfDisplay({
  canvas: '#beta-display',
  min: -1,
  max: 1,
  duration: 5,
  width: 300,
  height: 150,
  colors: ['orange'],
});

const betaRawSelect = new lfo.operator.Select({ index: 4 });
const betaRawScaler = new Scaler({ factor: 1 / 360 }); // normalize

socketReceive.connect(betaRawSelect);
betaRawSelect.connect(betaRawScaler);
betaRawScaler.connect(betaDisplay);

// gamma
const gammaDisplay = new lfo.sink.BpfDisplay({
  canvas: '#gamma-display',
  min: -1,
  max: 1,
  duration: 5,
  width: 300,
  height: 150,
  colors: ['green'],
});

const gammaRawSelect = new lfo.operator.Select({ index: 5 });
const gammaRawScaler = new Scaler({ factor: 1 / 360 }); // normalize

socketReceive.connect(gammaRawSelect);
gammaRawSelect.connect(gammaRawScaler);
gammaRawScaler.connect(gammaDisplay);

