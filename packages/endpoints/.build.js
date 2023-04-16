const fs = require('fs');

try {
  fs.rmSync('./lib', { recursive: true, });
} catch (error) {
  // Already deleted.
}

const ts = require('typescript');
const path = require('path');
const configFileName = path.resolve(__dirname, 'tsconfig.json');
const { config } = ts.readConfigFile(configFileName, ts.sys.readFile);
const compilerOptions = ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(configFileName)).options;

const program = ts.createProgram(['./src/index.ts'], compilerOptions);

const emitResult = program.emit();

if (emitResult.emitSkipped) {
  const message = emitResult.diagnostics
    .map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    .join('\n');
  console.log(message);
  process.exit(1);
}

console.log('Built TS.');