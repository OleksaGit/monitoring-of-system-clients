import dgram from 'dgram'
const server = dgram.createSocket('udp4');

const port = 2222;
const timeout = 60000;
let clientsMap = new Map;

server.on('listening', () => {
	const address = server.address();
	console.log(`Server start at ${address.port}`);
});

server.on('message', (message) => {
	const keyClient = message.toString()
	clientsMap.set(keyClient, Date.now());
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

server.bind(port);

