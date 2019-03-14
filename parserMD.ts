import recast from "recast";
import { readFileSync, appendFile, appendFileSync } from "fs";
const tsParser = require("recast/parsers/typescript");
const marked = require("marked");

const interfaceAst = require("./ast/TSExample/exportInterfaceAst");

const isCutOut = require("./art.config").isCutOut;

enum TypeAnnotations {
  int = "TSNumberKeyword",
  string = "TSStringKeyword",
  boolean = "TSBooleanKeyword",
  array = "TSArrayType",
  object = "TSTypeReference"
}

// 当前的一个interface命名保存数组
const interfaceNameArr = [];

// first: get md ast
const md = readFileSync("./test.md", "UTF8");
const tokens = marked.lexer(md);

// second: md ast change into typescript ast and format to interface.ts
const extractAllInterfaceChunk = (mdAst): never[] => {
  // extract every interface detail and explain add to an Object and push an Array
  const interfaceGather = [];
  let chunkStart = 0;
  mdAst.forEach((value, index) => {
    if (value.type === "list_start" && index) {
      const chunkData = mdAst.slice(chunkStart, index);
      interfaceGather.push(extractUseTables(
        ["detail", "explain"],
        chunkData
      ) as never);
    }
    if (value.type === "list_start") {
      chunkStart = index;
    }
    if (index === mdAst.length - 1) {
      const chunkData = mdAst.slice(chunkStart, index);
      interfaceGather.push(extractUseTables(
        ["detail", "explain"],
        chunkData
      ) as never);
    }
  });
  return interfaceGather;
};

const extractUseTables = (findTableType: string[], chunkData: any[]) => {
  const userTables = {};
  findTableType.forEach(v => {
    userTables[v] = extractChooseTable(v, chunkData);
  });
  return userTables;
};

const extractChooseTable = (tableText: string, chunkData: any[]) => {
  let result = {};
  chunkData.forEach((value, index) => {
    // confirm right table chunk
    if (
      value.type === "heading" &&
      value.depth === 4 &&
      value.text === tableText
    ) {
      result =
        chunkData.find((tableValue, tableIndex) => {
          if (tableIndex > index && tableValue.type === "table") {
            return tableValue;
          }
        }) || {};
    }
  });
  return result;
};

// 生成最终的一个interface名字
const createInterfaceName = (detailTable: any) => {
  let resultStr: string = "";
  let urlStr: string = "";
  const tableCells = flattenArray(detailTable.cells);
  tableCells.find((value, index) => {
    if (value === "request-url") {
      urlStr = tableCells[index + 1];
    }
  });
  urlStr = isCutOut ? urlStr.replace(/\/\w+/, "") : urlStr;
  console.log(urlStr)
  resultStr =
    "I" +
    // TODO: 需要解决三级的时候名字带.问题 ，写一个共同方法
    // urlStr.replace(/\/(\w)/g, (all, letter) => {
    //   return letter.toUpperCase();
    // });
    toHump(urlStr, '/')
  return resultStr;
};

// 生成interface的body部分
const highestNode = 'data';
const createInterfaceBody = (explainTable: any, currentParent, prefixName?: any) => {
  // 获取对应的参数名，类型，说明，parents, 示例的index
  const [
    nameIndex,
    typeIndex,
    explainIndex,
    parentsIndex,
    exampleIndex
  ] = findAllIndex(
    ['参数名', '类型', '说明', 'parents', '示例'],
    explainTable.header
  );
  const result = [];
  explainTable.cells.forEach((value, index) => {
    const bodyTemplate = objDeepCopy(
      interfaceAst.ExportInterfaceAst.body.body[0]
      ) as any;
    if (value[parentsIndex] === currentParent) {
      bodyTemplate.key.name = value[nameIndex];
      // bodyTemplate.typeAnnotation.typeAnnotation.type = TypeAnnotations[value[typeIndex]];
      bodyTemplate.typeAnnotation = getTypeAnnotation(value[typeIndex], value[nameIndex]);
      result.push(bodyTemplate as never);
    };
    if (value[parentsIndex] === currentParent && ['array', 'object'].includes(value[typeIndex])) {
      const childrenChunk = {} as any;
      const formatName = firstWordUpperCase(value[nameIndex]);
      let childrenName = `I${formatName}`;
      if (value[typeIndex] === 'array') {
        (<any>result[result.length - 1]).typeAnnotation.typeAnnotation.elementType.typeName.name = childrenName =
        `${isRepeatName(value[nameIndex] as never) ? prefixName : 'I'}${formatName}`;
        childrenChunk.header = explainTable.header;
      }
      if (value[typeIndex] === 'object') {
        (<any>result[result.length - 1]).typeAnnotation.typeAnnotation.typeName.name = childrenName =
        `${isRepeatName(value[nameIndex] as never) ? prefixName : 'I'}${formatName}`;
        childrenChunk.header = explainTable.header;
      }
      // 这里三级嵌套没有生成的原因主要是因为二级的table已经只包含父级为子interface的，再在其中找就没了
      // childrenChunk.cells = explainTable.cells.filter(cell => cell[parentsIndex] === value[nameIndex]);
      let childrenNameGather = [value[nameIndex]];
      childrenChunk.cells = explainTable.cells.filter(cell => {
        // 这里先找到符合该项的每一个子集，如果子集是对象，再把该对象子集找到
        if (['array', 'object'].includes(cell[typeIndex])) {
          childrenNameGather.push(cell[parentsIndex] + '.' + cell[nameIndex]);
        }
        if (childrenNameGather.includes(cell[parentsIndex])) {
          return cell;
        }
      });

      // childrenChunk.cells = explainTable.cells;
      createChildrenInterface(value, childrenChunk, value[parentsIndex] + '.' +  value[nameIndex], childrenName, prefixName);
    };
  });
  return result;
};

const isRepeatName = (interfaceName: never) => {
  if (interfaceNameArr.includes(interfaceName)) {
    return true;
  } else {
    interfaceNameArr.push(interfaceName)
    return false;
  }
}

/** 
 * 当父节点不为data && 其类型为array或者object时需要创建一个interface
 * 当需要创建的时候可以把其他父节点为其值的创建body
 */
const createChildrenInterface = (singleCell, childrenBody, parentName, finalName, prefixName) => {
  // prefixName = prefixName + firstWordUpperCase(parentName.replace(/\./g,""));
  prefixName = prefixName + toHump(firstWordUpperCase(parentName), '.');
  appendInterfaceTofile(parentName, createInterfaceBody(childrenBody, parentName, prefixName), finalName)
}

const getTypeAnnotation = (type, name) => {
  const anntationTpl = objDeepCopy(interfaceAst.ExportInterfaceAst.body.body[0].typeAnnotation) as any;
  anntationTpl.typeAnnotation.type = TypeAnnotations[type];
  if (type === 'array') {
    anntationTpl.typeAnnotation.elementType.typeName.name = name;
  }
  if (type === 'object') {
    anntationTpl.typeAnnotation.typeName.name = name;
  }
  return anntationTpl;
}

// third: parse to interface.ts
const replaceTsAst = () => {
  let result = [];
  const interfaceGather = extractAllInterfaceChunk(tokens);
  interfaceGather.forEach((value, index) => {
    /**
     * body.body是一个数组，每一个索引值就是一个annotation,其中的key.name为属性，typeAnnotation.typeAnnotation.type为类型
     * 此处需要处理就是在每一个属性table中找到对应的每一个返回参数，分别加入body中，然后最终append
     */
    const interfaceName = createInterfaceName((<any>value).detail);
    const interfaceBody = createInterfaceBody((<any>value).explain, 'data', interfaceName);
    appendInterfaceTofile(interfaceName, interfaceBody);
  });
};

const appendInterfaceTofile = (interfaceName, interfaceBody, finalName?: string) => {
  const singleChunk = objDeepCopy(interfaceAst) as any;
  singleChunk.ExportInterfaceAst.id.name = finalName || interfaceName;
  singleChunk.ExportInterfaceAst.body.body = interfaceBody;
  appendFileSync(
    "./result/test.ts",
    `\n${recast.print(singleChunk.ExportInterfaceAst as never).code}`,
    "utf8"
  );
}

/** 
 * 深拷贝
*/
const objDeepCopy = source => {
  var sourceCopy = source instanceof Array ? [] : {};
  for (var item in source) {
    sourceCopy[item] =
      typeof source[item] === "object"
        ? objDeepCopy(source[item])
        : source[item];
  }
  return sourceCopy;
};

/** 
 * 数组扁平化
*/
const flattenArray = arr => {
  return arr.reduce((prev, next) => {
    return prev.concat(Array.isArray(next) ? flattenArray(next) : next);
  }, []);
};

/** 
 * 找到对应index
*/
const findAllIndex = (findArr, TargetArr) => {
  const indexGather = [];
  findArr.forEach(value => {
    indexGather.push(TargetArr.indexOf(value) as never);
  });
  return indexGather;
};

/** 
 * 字符串首字母大写
*/
const firstWordUpperCase = (str) => {
  return str.toLowerCase().replace(/(\s|^)[a-z]/g, function(char){
      return char.toUpperCase();
  });
}

/** 
 * 转驼峰
*/
const toHump = (name, symbol = '/') => {
  const reg = new RegExp(`\\${symbol}(\\w)`, 'g')
  return name.replace(reg, function(all, letter){
      return letter.toUpperCase();
  });
}
replaceTsAst();
