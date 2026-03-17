const { program } = require('commander');
const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const { XMLBuilder } = require('fast-xml-parser');

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
		res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
		//res.end("Server is alive");
		const fileContent = await fs.readFile(options.input, 'utf8');
		const banks = JSON.parse(fileContent);
		const parsed_url = url.parse(req.url, true);
		let result = banks;

		if (parsed_url.query.normal === 'true') {
			result = banks.filter(b => b.COD_STATE === 1);
		}
		const bankList = result.map((bank) => {
			const entry = {};

			if (parsed_url.query.mfo === 'true') {
				entry.mfo_code = bank.MFO;
			}
			entry.name = bank.SHORTNAME;
			entry.state_code = bank.COD_STATE;
			return entry;
		});
		const builder = new XMLBuilder({ arrayNodeName: 'bank', format: true});
		const xml = builder.build({ banks: { bank: bankList } });

		res.end(xml);
	});
	server.listen(options.port, options.host, () => console.log("Server is listening"));
}

Start_server().catch(err => console.error("error starting server", err));