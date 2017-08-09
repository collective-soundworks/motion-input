import * as lfo from 'waves-lfo/core';

const definitions = {
  factor: {
    type: 'float',
    min: -Infinity,
    max: +Infinity,
    default: 1,
  }
};

class Scaler extends lfo.BaseLfo {
  constructor(options) {
    super(definitions, options);
  }

  inputVector(data) {
    const output = this.frame.data;
    const frameSize = this.streamParams.frameSize;
    const factor = this.params.get('factor');

    for (let i = 0; i < frameSize; i++)
      output[i] = data[i] * factor;

    return output;
  }

  processVector(frame) {
    this.frame.data = this.inputVector(frame.data);
  }

  inputSignal(data) {
    const output = this.frame.data;
    const frameSize = this.streamParams.frameSize;
    const factor = this.params.get('factor');

    for (let i = 0; i < frameSize; i++)
      output[i] = data[i] * factor;

    return output;
  }

  processSignal(frame) {
    this.frame.data = this.inputSignal(frame.data);
  }
}

export default Scaler;
