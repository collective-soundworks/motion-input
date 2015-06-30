const DOMEventSubmodule = require('./DOMEventSubmodule');
const EulerAngle = require('./EulerAngle');
const InputModule = require('./InputModule');
const platform = require('platform');
const RotationMatrix = require('./RotationMatrix');

class DeviceorientationModule extends InputModule {
  constructor() {
    super('deviceorientation');

    this.event[0] = undefined;
    this.event[1] = undefined;
    this.event[2] = undefined;

    this.orientation = new DOMEventSubmodule(this, 'orientation');
    // this.orientationAlt = new DOMEventSubmodule(this, 'orientationAlt'); // TODO

    this.required = {
      orientation: false
    };

    this._deviceorientationCheck = this._deviceorientationCheck.bind(this);
    this._deviceorientationListener = this._deviceorientationListener.bind(this);

    this._numListeners = 0;
    this._promiseResolve  = null;
  }

  _deviceorientationCheck(e) {
    this.isProvided = true;

    this.orientation.isProvided = (
      (typeof e.alpha === 'number') && 
      (typeof e.beta === 'number') && 
      (typeof e.gamma === 'number')
    );

    // TODO: get pseudo-period
    // TODO: check absolute / webkitCompassHeading / webkitCompassAccuracy

    window.removeEventListener('deviceorientation', this._deviceorientationCheck);
    this._promiseResolve(this);
  }
  
  _deviceorientationListener(e) {
    let outEvent = this.event;
    
    outEvent[0] = e.alpha;
    outEvent[1] = e.beta;
    outEvent[2] = e.gamma;
    
    this.emit(outEvent);

    if (this.required.orientation && this.orientation.isValid) {
      let outEvent = this.orientation.event;

      outEvent[0] = e.alpha;
      outEvent[1] = e.beta;
      outEvent[2] = e.gamma;

      // if (platform.os.family === 'iOS') {
        // TODO: find a better / more efficient way to manage the conversions
        let euler = new EulerAngle(outEvent[0], outEvent[1], outEvent[2]);
        let matrix = new RotationMatrix();
        matrix.setFromEulerAngles(euler);
        euler.setFromRotationMatrix(matrix);

        outEvent[0] = euler.values[0];
        outEvent[1] = euler.values[1];
        outEvent[2] = euler.values[2];
      // }

      this.orientation.emit(outEvent);
    }
  }

  _addListener() {
    this._numListeners++;

    if (this._numListeners === 1)
      window.addEventListener('deviceorientation', this._deviceorientationListener, false);
  }

  _removeListener() {
    this._numListeners--;

    if (this._numListeners === 0)
      window.removeEventListener('deviceorientation', this._deviceorientationListener, false);
  }

  init() {
    return super.init((resolve, reject) => {
      this._promiseResolve = resolve;

      if (window.DeviceOrientationEvent)
        window.addEventListener('deviceorientation', this._deviceorientationCheck, false);
      else
        resolve(this);
    });
  }

  addListener(listener) {
    super.addListener(listener);
    this._addListener();
  }

  removeListener(listener) {
    super.removeListener(listener);
    this._removeListener();
  }
}

module.exports = new DeviceorientationModule();
