/**
 * `MotionInput` singleton.
 * The `MotionInput` singleton allows to initialize motion events
 * and to listen to them.
 *
 * @class MotionInput
 */
class MotionInput {

  /**
   * Creates the `MotionInput` module instance.
   *
   * @constructor
   */
  constructor() {

    /**
     * Pool of all available modules.
     *
     * @this MotionInput
     * @type {object}
     * @default {}
     */
    this.modules = {};
  }

  /**
   * Adds a module to the `MotionInput` module.
   *
   * @param {string} eventType - Name of the event type.
   * @param {InputModule} module - Module to add to the `MotionInput` module.
   */
  addModule(eventType, module) {
    this.modules[eventType] = module;
  }

  /**
   * Gets a module.
   *
   * @param {string} eventType - Name of the event type (module) to retrieve.
   * @return {InputModule}
   */
  getModule(eventType) {
    return this.modules[eventType];
  }

  /**
   * Requires a module.
   * If the module has been initialized alread, returns its promise. Otherwise,
   * initializes the module.
   *
   * @param {string} eventType - Name of the event type (module) to require.
   * @return {Promise}
   */
  requireModule(eventType) {
    let module = this.getModule(eventType);

    if(module.promise)
      return module.promise;

    return module.init();
  }

  /**
   * Initializes the `MotionInput` module.
   *
   * @param {string[]} ...eventTypes - Array of the event types to initialize.
   * @return {Promise}
   */
  init(...eventTypes) {
    let modulePromises = eventTypes.map((value) => {
      let module = this.getModule(value);
      return module.init();
    });

    return Promise.all(modulePromises);
  }

  /**
   * Adds a listener.
   *
   * @param {string} eventType - Name of the event type (module) to add a listener to.
   * @param {function} listener - Listener to add.
   */
  addListener(eventType, listener) {
    let module = this.getModule(eventType);
    module.addListener(listener);
  }

  /**
   * Removes a listener.
   *
   * @param {string} eventType - Name of the event type (module) to add a listener to.
   * @param {function} listener - Listener to remove.
   */
  removeListener(eventType, listener) {
    let module = this.getModule(eventType);
    module.removeListener(listener);
  }
}

export default new MotionInput();
