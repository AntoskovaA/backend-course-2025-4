const { program } = require('commander');
const http = require('http');
const fs = require('fs').promises;
const url = require('url');

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
		res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
		//res.end("Server is alive");
		const fileContent = await fs.readFile(options.input, 'utf8');
		const banks = JSON.parse(fileContent);
		const parsed_url = url.parse(req.url, true);
		const query = parsed_url.query;
		let result = banks;

		if (query.normal === 'true') {
			result = banks.filter(b => b.COD_STATE === 1);
		}

		res.end(JSON.stringify(result));

	});
	server.listen(options.port, options.host, () => console.log("Server is listening"));
}

Start_server().catch(err => console.error("error starting server", err));