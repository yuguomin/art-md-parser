import { readFileSync } from "fs";
const source = readFileSync('./interface.ts', 'UTF8');

import recast from 'recast';
const tsParser = require("recast/parsers/typescript")
const ast = recast.parse(source, {
  parser: tsParser
});

let node;
var cache = [];
recast.visit(ast, {
  visitExportNamedDeclaration: function(this, nodePath) {
    if (!nodePath.node.declaration) { return this.traverse(nodePath) }
    node = nodePath;
    node.node.declaration.id.name = 'Guomin';
    // circular Object to JSON
    // console.log(JSON.stringify(nodePath, function(key, value: never) {
    //   if (typeof value === 'object' && value !== null) {
    //       if (cache.indexOf(value) !== -1) {
    //           // Circular reference found, discard key
    //           return;
    //       }
    //       // Store value in our collection
    //       cache.push(value);
    //   }
      // return value;
  // }));
    return this.traverse(nodePath);
  }
});
// console.log(node.value.declaration);
// console.log(recast.print(node.value.declaration.body).code);


// console.log(`
// CODE: 

// ${source}

// AST: 

// ${JSON.stringify(ast)}
// `);