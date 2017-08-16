import { BaseLfo } from 'waves-lfo/core';

const parameters = {
  interval: {
    type: 'float',
    min: 0,
    max: +Infinity,
    default: 1,
  },
};

class Integrator extends BaseLfo {
  constructor(options) {
    super(parameters, options);
  }

  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);
    this.propagateStreamParams();
  }

  processVector(frame) {
    this.inputVector(frame.data);
  }

  inputVector(data) {
    const output = this.frame.data;
    const frameSize = this.streamParams.frameSize;
    const interval = this.params.get('interval');

    for (let i = 0; i < frame.size; i++)
      output[i] += data[i] * interval;

    return output;
  }
}

export default Integrator;
