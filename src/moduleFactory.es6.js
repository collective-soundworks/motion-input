var moduleClasses = {};
var modules = {};

function register(eventType, moduleClass) {
  moduleClasses[eventType] = moduleClass;
}

function get(eventType) {
  let module = modules[eventType];

  if(module)
    return module;

  module = new moduleClasses[className]();
  modules[eventType] = module;

  return module;
}

function require(eventType) {
  let module = get(eventType);
  return module.init();
}

module.exports = {
  register: register,
  get: get,
  require: require
}
