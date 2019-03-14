import { extractAllInterfaceChunk, createInterfaceName, createInterfaceBody, appendInterfaceTofile } from '../parserMD';
import { highestParent } from 'ast/typeAnnotationsMap';

const createInterface = (tokens) => {
  const interfaceGather = extractAllInterfaceChunk(tokens);
  interfaceGather.forEach(value => {
    const interfaceName = createInterfaceName((<any>value).detail);
    const interfaceBody = createInterfaceBody((<any>value).explain, highestParent, interfaceName);
    appendInterfaceTofile(interfaceName, interfaceBody);
  });
};

export default createInterface;