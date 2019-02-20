import recast from 'recast';
import { readFileSync } from 'fs';
const tsParser = require('recast/parsers/typescript');
const marked = require('marked');
const md = readFileSync('./test.md', 'UTF8');
const tokens = marked.lexer(md);
console.log(tokens);

