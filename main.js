const {program} = require('commander');
const http = require('http');
const fs = require('fs').promises;

program
	.requiredOption('-i, --input <path>', 'path to input file')
	.requiredOption('-h, --host <addres>', 'server address')
	.requiredOption('-p, --port <port>', 'server port');

program.parse(process.argv);

const options = program.opts();

try { 
fs.access(options.input); } 
catch { 
console.error ('Cannot find input file');
process.exit(1); }

let server = http.createServer();
server.listen(options.port, options.host, callback);
