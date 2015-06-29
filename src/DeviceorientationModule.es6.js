const InputModule = require('./InputModule');

class DeviceorientationModule extends InputModule {
  constructor() {
    super('orientation');

    this.numListeners = 0;

    this._deviceorientationCheck = this._deviceorientationCheck.bind(this);
    this._deviceorientationListener = this._deviceorientationListener.bind(this);

    this._promiseResolve  = null;
  }

  init() {
    return super.init((resolve, reject) => {
      this._promiseResolve = resolve;

      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', this._deviceorientationCheck, false);
      } else {
        resolve(this);
      }
    });
  }

  start() {
    window.addEventListener('deviceorientation', this._deviceorientationListener, false);
  }

  stop() {
    window.removeEventListener('deviceorientation', this._deviceorientationListener, false);
  }

  _deviceorientationListener(e) {
    if (this.isValid) {
      let outEvent = this.event;

      outEvent[0] = e.alpha;
      outEvent[1] = e.beta;
      outEvent[2] = e.gamma;

      // TODO: unify

      this.emit(outEvent);
    }
  }

  _deviceorientationCheck(e) {
    this.isProvided = (
      (typeof e.alpha === 'number') && 
      (typeof e.beta === 'number') && 
      (typeof e.gamma === 'number')
    );

    // TODO: get pseudo-period
    // TODO: check absolute / webkitCompassHeading / webkitCompassAccuracy

    window.removeEventListener('deviceorientation', this._deviceorientationCheck);
    this._promiseResolve(this);
  }
}

module.exports = new DeviceorientationModule();
