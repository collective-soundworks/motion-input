/**
 * `InputModule` class.
 * The `InputModule` class allows to instantiate modules that are part of the
 * motion input module, and that provide values (for instance, `deviceorientation`,
 * `acceleration`, `energy`).
 *
 * @class InputModule
 */
class InputModule {

  /**
   * Creates an `InputModule` module instance.
   *
   * @constructor
   * @param {string} eventType - Name of the module / event (*e.g.* `deviceorientation, 'acceleration', 'energy').
   */
  constructor(eventType) {

    /**
     * Event type of the module.
     *
     * @this InputModule
     * @type {string}
     * @constant
     */
    this.eventType = eventType;

    /**
     * Array of listeners attached to this module / event.
     *
     * @this InputModule
     * @type {Set<Function>}
     */
    this.listeners = new Set();

    /**
     * Event sent by this module.
     *
     * @this InputModule
     * @type {number|number[]}
     * @default null
     */
    this.event = null;

    /**
     * Module promise (resolved when the module is initialized).
     *
     * @this InputModule
     * @type {Promise}
     * @default null
     */
    this.promise = null;

    /**
     * Indicates if the module's event values are calculated from parent modules / events.
     *
     * @this InputModule
     * @type {bool}
     * @default false
     */
    this.isCalculated = false;

    /**
     * Indicates if the module's event values are provided by the device's sensors.
     * (*I.e.* indicates if the `'devicemotion'` or `'deviceorientation'` events provide the required raw values.)
     *
     * @this InputModule
     * @type {bool}
     * @default false
     */
    this.isProvided = false;

    /**
     * Period at which the module's events are sent (`undefined` if the events are not sent at regular intervals).
     *
     * @this InputModule
     * @type {number}
     * @default undefined
     */
    this.period = undefined;

    this.emit = this.emit.bind(this);
  }

  /**
   * Indicates whether the module can provide values or not.
   *
   * @type {bool}
   * @readonly
   */
  get isValid() {
    return (this.isProvided || this.isCalculated);
  }

  /**
   * Initializes the module.
   *
   * @param {function} promiseFun - Promise function that takes the `resolve` and `reject` functions as arguments.
   * @return {Promise}
   */
  init(promiseFun) {
    this.promise = new Promise(promiseFun);
    return this.promise;
  }

  /**
   * Adds a listener to the module.
   *
   * @param {function} listener - Listener to add.
   */
  addListener(listener) {
    this.listeners.add(listener);
  }

  /**
   * Removes a listener from the module.
   *
   * @param {function} listener - Listener to remove.
   */
  removeListener(listener) {
    this.listeners.delete(listener);
  }

  /**
   * Propagates an event to all the module's listeners.
   *
   * @param {number|number[]} [event=this.event] - Event values to propagate to the module's listeners.
   */
  emit(event = this.event) {
    this.listeners.forEach(listener => listener(event));
  }
}

export default InputModule;
