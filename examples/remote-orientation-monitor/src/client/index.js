import * as lfo from 'waves-lfo/client';
import Merger from './lib/Merger';
import Scaler from './lib/Scaler';


const socketReceive = new lfo.source.SocketReceive({ port: 5010 });
socketReceive.processStreamParams({
  frameType: 'vector',
  frameSize: 3,
  frameRate: 0,
});

const logger = new lfo.sink.Logger({ time: false, data: true });

const scaler = new lfo.operator.Scaler({ factor: [
  1 / 360,
  1 / 360,
  1 / 360,
]});

socketReceive.connect(scaler);
// scaler.connect(logger);

// alpha
const alphaRawSelect = new lfo.operator.Select({ index: 0 });
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
const betaRawSelect = new lfo.operator.Select({ index: 1 });
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
const gammaRawSelect = new lfo.operator.Select({ index: 2 });
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

