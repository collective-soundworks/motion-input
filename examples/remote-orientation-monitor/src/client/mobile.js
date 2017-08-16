import * as lfo from 'waves-lfo/client';
import motionInput from '../../../../dist/index';

const eventIn = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 3,
  frameRate: 0,
});

const socketSend = new lfo.sink.SocketSend({
  port: 5000,
});

eventIn.connect(socketSend);

Promise.all([
  motionInput.init(['orientation']),
  eventIn.init()
]).then(([[orientation]]) => {

  const $feedback = document.querySelector('#feedback')

  $feedback.innerHTML = `
    initialized
    <br />
    orientation: ${orientation.isValid}
  `;

  eventIn.start();

  if (orientation.isValid) {
    let data = [];

    orientation.addListener(([alpha, beta, gamma]) => {
      data[0] = alpha;
      data[1] = beta;
      data[2] = gamma;

      eventIn.process(null, data);
    });
  }
});
