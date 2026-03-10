const {program} = require('commander');
const http = require('http');

program
	.requiredoption('-i, --input <path>', 'path to input file')
	.requiredoption('-h, --host <addres>', 'server address')
	.requiredoption('-p, --port <port>', 'server port');

program.parse(process.argv);

const options = program.opts();

