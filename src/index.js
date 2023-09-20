const { promises, readFileSync, writeFileSync } = require("fs");
const { dirname, basename, join } = require("path");
const parser = require("@babel/parser");
const { default: traverse } = require("@babel/traverse");
function mainTemplate(entryName, modules) {
  return `((modules) => {
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
  
      return require('${entryName}');
  })({
    ${Object.entries(modules)
      .map(([filename, code]) => {
        return `'${filename}': ${moduleTemplate(code)}`;
      })
      .join(",")}
  })`;
}

function moduleTemplate(code) {
  return `function(module, exports, require) {
  ${code}
    }`;
}
async function main({ entry, output }) {
  const file = await promises.readFile(entry, "utf8");
  const basePath = dirname(entry);
  const entryName = basename(entry);

  const res = {};
  res[entryName] = file;

  walk(file);
  function walk(code) {
    const ast = parser.parse(code);
    traverse(ast, {
      CallExpression({ node }) {
        if (
          node.callee.name === "require" &&
          node.callee.type === "Identifier"
        ) {
          const key = node.arguments[0].value;
          const code = readFileSync(join(basePath, key), "utf8");
          res[key] = code;
          walk(code);
        }
      },
    });
    const dist = mainTemplate(entryName, res);
    writeFileSync(output, dist);
  }
}

module.exports = { main };
