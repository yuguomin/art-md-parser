import recast from 'recast';
import { appendFileSync } from 'fs';
import { findAllIndex, firstWordUpperCase, flattenArray, objDeepCopy, toHump } from './utils/tools';
import { TypeAnnotations } from './ast/typeAnnotationsMap';
import ExportInterfaceAst from './ast/TSExample/exportInterfaceAst';
import isCutOut from './art.config';

// 当前的一个interface命名保存数组
const interfaceNameArr = [];
// 生成最终的一个interface名字
export const createInterfaceName = (detailTable: any) => {
  let resultStr: string = '';
  let urlStr: string = '';
  const tableCells = flattenArray(detailTable.cells);
  tableCells.find((value, index) => {
    if (value === 'request-url') {
      urlStr = tableCells[index + 1];
    }
  });
  urlStr = isCutOut ? urlStr.replace(/\/\w+/, '') : urlStr;
  resultStr = 'I' + toHump(urlStr, '/');
  return resultStr;
};

// 生成interface的body部分
export const createInterfaceBody = (explainTable: any, currentParent, prefixName?: any) => {
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
      ExportInterfaceAst.body.body[0]
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
      createChildrenInterface(childrenChunk, value[parentsIndex] + '.' +  value[nameIndex], childrenName, prefixName);
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
const createChildrenInterface = (childrenBody, parentName, finalName, prefixName) => {
  // prefixName = prefixName + firstWordUpperCase(parentName.replace(/\./g,'));
  prefixName = prefixName + toHump(firstWordUpperCase(parentName), '.');
  appendInterfaceTofile(parentName, createInterfaceBody(childrenBody, parentName, prefixName), finalName)
}

const getTypeAnnotation = (type, name) => {
  const anntationTpl = objDeepCopy(ExportInterfaceAst.body.body[0].typeAnnotation) as any;
  anntationTpl.typeAnnotation.type = TypeAnnotations[type];
  if (type === 'array') {
    anntationTpl.typeAnnotation.elementType.typeName.name = name;
  }
  if (type === 'object') {
    anntationTpl.typeAnnotation.typeName.name = name;
  }
  return anntationTpl;
}

interface interfaceAstReuslt {
  type: string;
  declaration?: any;
}

export const appendInterfaceTofile = (interfaceName, interfaceBody, finalName?: string) => {
  const singleChunk = objDeepCopy(ExportInterfaceAst) as any;
  singleChunk.id.name = finalName || interfaceName;
  singleChunk.body.body = interfaceBody;
  let result:interfaceAstReuslt = {
    type: 'ExportNamedDeclaration'
  }
  result.declaration = singleChunk
  appendFileSync(
    './result/test.ts',
    `\n${recast.print(result).code}`,
    'utf8'
  );
}