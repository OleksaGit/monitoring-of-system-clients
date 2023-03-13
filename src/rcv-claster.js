import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import process from 'node:process';
import dgram from "dgram";

const numCPUs = availableParallelism();
const port = 2222;
const timeout = 60000;

if (cluster.isMaster) {
	const workers = [];

	for (let i = 0; i < numCPUs; i++) {
		const worker = cluster.fork();
		workers.push(worker);
	}

	const clientsMap = new Map();

	workers.forEach(worker => {
		worker.on('message', message => {
			if (message.type === 'data') {
				clientsMap.set(message.key, message.value);
			}
		});
	});

	setInterval(() => {
		console.log(clientsMap.size)
		const now = Date.now();
		for (const [clientKey, lastActive] of clientsMap) {
			if (now - lastActive > timeout) {
				console.log(`нет связи с скриптом "trni.js. ${clientKey}`);
			}
		}
	}, timeout / 4);

} else {
	const server = dgram.createSocket('udp4');
	server.on('listening', () => {
		const address = server.address();
		console.log(`Server start at ${address.port} port`);
	});

	server.on('message', (message) => {
		const keyClient = message.toString()
		process.send({
			type: 'data',
			key: keyClient,
			value: Date.now(),
		});
		// console.log(`${process.pid} received data and send to main process`)
	});
	server.bind(port);
}