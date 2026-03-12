const { program } = require('commander');
const http = require('http');
const fs = require('fs').promises;

program
	.requiredOption('-i, --input <path>', 'path to input file')
	.requiredOption('-h, --host <addres>', 'server address')
	.requiredOption('-p, --port <port>', 'server port', parseInt);

program.parse(process.argv);

const options = program.opts();

async function Check_file(path) {
	try {
		await fs.access(path);
	}
	catch {
		console.error('Cannot find input file');
		process.exit(1);
	}
}

async function Start_server() {
	await Check_file(options.input);
	let server = http.createServer(async (req, res) => {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end("Server is alive");
	});
	server.listen(options.port, options.host, ()=> console.log("Server is listening"));
}

Start_server().catch(err => console.error("error starting server", err));