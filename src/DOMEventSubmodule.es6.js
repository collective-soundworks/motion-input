/**
 * @fileoverview `DOMEventSubmodule` module
 * @author <a href='mailto:sebastien@robaszkiewicz.com'>Sébastien Robaszkiewicz</a>, <a href='mailto:Norbert.Schnell@ircam.fr'>Norbert Schnell</a>
 */

'use strict';

const InputModule = require('./InputModule');

/**
 * `DOMEventSubmodule` class.
 * The `DOMEventSubmodule` class allows to instantiate modules that provide
 * unified values (such as `AccelerationIncludingGravity`, `Acceleration`,
 * `RotationRate`, `Orientation`, `OrientationAlt) from the `devicemotion`
 * or `deviceorientation` DOM events.
 *
 * @class DOMEventSubmodule
 * @extends InputModule
 */
class DOMEventSubmodule extends InputModule {

  /**
   * Creates a `DOMEventSubmodule` module instance.
   *
   * @constructor
   * @param {DeviceMotionModule|DeviceOrientationModule} DOMEventModule - The parent DOM event module.
   * @param {string} eventType - The name of the submodule / event (*e.g.* 'acceleration' or 'orientationAlt').
   * @see DeviceMotionModule
   * @see DeviceOrientationModule
   */
  constructor(DOMEventModule, eventType) {
    super(eventType);

    /**
     * The DOM event parent module from which this module gets the raw values.
     *
     * @this DOMEventSubmodule
     * @type {DeviceMotionModule|DeviceOrientationModule}
     * @constant
     */
    this.DOMEventModule = DOMEventModule;

    /**
     * Raw values coming from the `devicemotion` event sent by this module.
     *
     * @this DOMEventSubmodule
     * @type {number[]}
     * @default [0, 0, 0]
     */
    this.event = [0, 0, 0];

    /**
     * Compass heading reference (iOS devices only, `Orientation` and `OrientationAlt` submodules only).
     *
     * @this DOMEventSubmodule
     * @type {number}
     * @default null
     */
    this._webkitCompassHeadingReference = null;
  }

  /**
   * Starts the module.
   */
  start() {
    this.DOMEventModule._addListener();
  }

  /**
   * Stops the module.
   */
  stop() {
    this.DOMEventModule._removeListener();
  }

  /**
   * Initializes of the module.
   *
   * @return {Promise}
   */
  init() {
    // Indicate to the parent module that this event is required
    this.DOMEventModule.required[this.eventType] = true;

    // If the parent event has not been initialized yet, initialize it
    let DOMEventPromise = this.DOMEventModule.promise;
    if (!DOMEventPromise)
      DOMEventPromise = this.DOMEventModule.init();

    return DOMEventPromise.then((module) => this);
  }
}

module.exports = DOMEventSubmodule;