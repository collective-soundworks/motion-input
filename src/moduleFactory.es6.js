var classes = {};
var modules = {};

function register(eventType, moduleClass) {
  classes[eventType] = moduleClass;
}

function get(eventType) {
  let module = modules[eventType];

  if(module)
    return module;

  module = new classes[className]();
  modules[eventType] = module;

  return module;
}

function require(eventType) {
  let module = get(eventType);

  if(!module.promise)
    module.init();
}

module.exports = {
  register: register,
  get: get,
  require: require
}
