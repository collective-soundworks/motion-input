import * as lfo from 'waves-lfo/core';

const definitions = {
  // array defining the frameSizes of the input streamss
  // e.g. if [3, 2, 1], we wait for 3 different sources of respective 3, 2, 1 frameSizes
  frameSizes: {
    type: 'any',
    default: null,
    constant: true,
  }
}

class Merger extends lfo.BaseLfo {
  constructor(options) {
    super(definitions, options);
  }

  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    // ...
    const frameSizes = this.params.get('frameSizes');
    const numSources = frameSizes.length;

    let frameSize = 0;
    for (let i = 0; i < numSources; i++)
      frameSize += frameSizes[i];


    this.streamParams.frameSize = frameSize;
    this.numSources = numSources;
    this.sourceIndex = 0;

    this.propagateStreamParams();
  }

  processVector() {}
  // processSignal() {} // makes no sens to merge signals (maybe MUX / DEMUX)

  processFrame(frame) {
    const currentIndex = this.sourceIndex;
    const frameSizes = this.params.get('frameSizes');
    const numSources = frameSizes.length;
    const input = frame.data;
    const output = this.frame.data;

    // first source define time
    if (currentIndex === 0)
      this.frame.time = frame.time;

    const currentFrameSize = frameSizes[currentIndex];
    let offset = 0;

    for (let i = 0; i < currentIndex; i++)
      offset += frameSizes[i];

    // copy data
    for (let i = 0; i < currentFrameSize; i++)
      output[offset + i] = input[i];

    this.sourceIndex = (this.sourceIndex + 1) % numSources;

    // we just received the last input, output the frame
    if (this.sourceIndex === 0)
      this.propagateFrame();
  }
}

export default Merger;
