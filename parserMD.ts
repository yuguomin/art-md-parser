import recast from 'recast';
import { readFileSync } from 'fs';
const tsParser = require('recast/parsers/typescript');
const marked = require('marked');

// first: get md ast
const md = readFileSync('./test.md', 'UTF8');
const tokens = marked.lexer(md);


// second: md ast change into typescript ast and format to interface.ts
const extractInterfaceChunk = (mdAst): never[] => {
  const interfaceGather = [];
  let chunkStartIndex: number = 0;
  let chunkEndIndex: number = 0;
  mdAst.forEach((v, i) => {
    if (v.type === 'list_start') {
      // console.log(v);
      chunkEndIndex = i;
      if (chunkStartIndex !== chunkEndIndex) {
        let chunk = tokens.slice(chunkStartIndex, chunkEndIndex)
        interfaceGather.push(chunk as never)
      }
    }
  })
  return interfaceGather;
}
const extractInterfaceDetail = (chunkName: string, chunkData: [object]) => {

}

const result = extractInterfaceChunk(tokens)
console.log(result);
// third: parse to interface.ts

