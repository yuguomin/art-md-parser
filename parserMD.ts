import recast from 'recast';
import { readFileSync } from 'fs';
const tsParser = require('recast/parsers/typescript');
const marked = require('marked');

const interfaceAst = require('./ast/TSExample/exportInterfaceAst');

const isCutOut = require('./art.config').isCutOut;

// first: get md ast
const md = readFileSync('./test.md', 'UTF8');
const tokens = marked.lexer(md);


// second: md ast change into typescript ast and format to interface.ts
const extractAllInterfaceChunk = (mdAst): never[] => {
  // extract every interface detail and explain add to an Object and push an Array
  const interfaceGather = [];
  let chunkStart = 0;
  mdAst.forEach((value, index) => {
    if (value.type === 'list_start' && index) {
      const chunkData = mdAst.slice(chunkStart, index);
      interfaceGather.push(extractUseTables(['detail', 'explain'] ,chunkData) as never);
    }
    if (value.type === 'list_start') {
      chunkStart = index
    }
    if (index === mdAst.length - 1) {
      const chunkData = mdAst.slice(chunkStart, index);
      interfaceGather.push(extractUseTables(['detail', 'explain'] ,chunkData) as never);
    }
  })
  return interfaceGather;
}

const extractUseTables = (findTableType: string[], chunkData: any[]) => {
  const userTables = {};
  findTableType.forEach(v => {
    userTables[v] = extractChooseTable(v, chunkData);
  })
  return userTables;
}


const extractChooseTable = (tableText: string, chunkData: any[]) => {
  let result = {};
  chunkData.forEach((value, index) => {
    // confirm right table chunk
    if (value.type === 'heading' && value.depth === 4 && value.text === tableText) {
        result = chunkData.find((tableValue, tableIndex) => {
        if (tableIndex > index && tableValue.type === 'table') {
          return tableValue;
        }
      }) || {};
    }
  })
  return result;
}

const createInterfaceName = (detailTable: any) => {
  let resultStr: string = '';
  let urlStr: string = '';
  const tableCells = flattenArray(detailTable.cells);
  tableCells.find((value, index) => {
    if (value === 'request-url') {
      urlStr = tableCells[index + 1];
    }
  })
  
  urlStr = isCutOut ? urlStr.replace(/\/\w+/, '') : urlStr

  resultStr = 'I' + urlStr.replace(/\/(\w)/g, (all, letter) => {
    return letter.toUpperCase();
  })

  console.log(resultStr);
  return tableCells;
}


const flattenArray = (arr) => {
  return arr.reduce((prev, next) => {
    return prev.concat(Array.isArray(next) ? flattenArray(next) : next)
  }, [])
}

// third: parse to interface.ts
const replaceTsAst = () => {
  const result = extractAllInterfaceChunk(tokens)
  result.forEach((value, index) => {
    createInterfaceName((<any>value).detail);
  })
}

replaceTsAst();