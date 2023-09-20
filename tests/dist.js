((modules) => {
      const installedModules = {};
      function require(moduleName) {
        if(installedModules[moduleName]) {
          return installedModules[moduleName].exports;
        }
  
        installedModules[moduleName] = {exports: {}};
        const module = installedModules[moduleName];
        modules[moduleName](module, module.exports, require);
  
        return module.exports;
      }
  
      return require('index.js');
  })({
    'index.js': function(module, exports, require) {
  const { hello } = require("./module.js");
hello();

    },'./module.js': function(module, exports, require) {
  const { goodMorning } = require("./module2.js");
function hello() {
  goodMorning("kaitoyokohamaa");
}
module.exports = { hello };

    },'./module2.js': function(module, exports, require) {
  function goodMorning(name) {
  console.log(`goodMorning ${name}`);
}

module.exports = { goodMorning };

    }
  })