import * as lfo from 'waves-lfo/client';
import motionInput from 'motion-input';

const eventIn = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 6,
  frameRate: 0,
});

const socketSend = new lfo.sink.SocketSend({
  port: 5000,
});

eventIn.connect(socketSend);

Promise.all([
  motionInput.init(['accelerationIncludingGravity', 'rotationRate']),
  eventIn.init()
]).then(([[accelerationIncludingGravity, rotationRate]]) => {

  const $feedback = document.querySelector('#feedback')

  $feedback.innerHTML = `
    initialized
    <br />
    accelerationIncludingGravity: ${accelerationIncludingGravity.isValid}
    <br />
    rotationRate: ${rotationRate.isValid}
  `;

  eventIn.start();

  if (accelerationIncludingGravity.isValid && rotationRate.isValid) {
    let data = [];

    accelerationIncludingGravity.addListener(([x, y, z]) => {
      data[0] = x;
      data[1] = y;
      data[2] = z;
    });

    rotationRate.addListener(([alpha, beta, gamma]) => {
      data[3] = alpha;
      data[4] = beta;
      data[5] = gamma;

      eventIn.process(null, data);
    });
  } else if (accelerationIncludingGravity.isValid) {
    accelerationIncludingGravity.addListener(([x, y, z]) => {
      data[0] = x;
      data[1] = y;
      data[2] = z;
      data[3] = 0;
      data[4] = 0;
      data[5] = 0;

      eventIn.process(null, data);
    });
  }
});
