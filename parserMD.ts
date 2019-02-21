import recast from 'recast';
import { readFileSync } from 'fs';
const tsParser = require('recast/parsers/typescript');
const marked = require('marked');

// first: get md ast
const md = readFileSync('./test.md', 'UTF8');
const tokens = marked.lexer(md);

// second: md ast change into typescript ast and format to interface.ts






// third: parse to interface.ts

