import { extractAllInterfaceChunk } from './extractData';
import { createInterfaceName, createInterfaceBody } from '../parserMD';
import { highestParent } from '../ast/typeAnnotationsMap';
import {appendInterfaceTofile} from './appendFile';

const createInterface = (tokens) => {
  const interfaceGather = extractAllInterfaceChunk(tokens);
  interfaceGather.forEach(value => {
    const interfaceName = createInterfaceName((<any>value).detail);
    const interfaceBody = createInterfaceBody((<any>value).explain, highestParent, interfaceName);
    appendInterfaceTofile(interfaceName, interfaceBody);
  });
};

export default createInterface;