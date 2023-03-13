import dgram from 'dgram'
const client = dgram.createSocket('udp4');

const host = 'localhost';
const port = 2222;
const interval = 6000;
const nameControlPoint = 'Ivan Ivanovych Ivaschenko'

/**
 * send message
 * @param msg
 * @returns {Promise<void>}
 */
async function sendMessage(msg) {
	const message = Buffer.from(msg);
	client.send(message, 0, message.length, port, host, (err) => {
		if (err) console.error(err);
		console.info(`Data send: ${nameControlPoint}`);
	});
}


setInterval(() => sendMessage(nameControlPoint), interval);


