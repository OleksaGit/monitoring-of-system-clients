import dgram from 'dgram'
const host = 'localhost';
const port = 2222;
const interval = 6000;
const delay = 0
const amountOfClient = 10000

const messages = createMessages(amountOfClient)
console.log('Create message complete')

//for testing, uncomment the desired function call from the list below

// sending messages distributed in time
// await sendTimeDistributedQueries(messages, delay)


// sending messages in batch
setInterval(() => sendBatchQueries(messages), interval);


// sending messages of batch distributed in time and repeat of batch
// setInterval(() => sendTimeDistributedQueries(messages, delay), interval);


/**
 * sending messages in batch
 * @messages - arr of message
 * @returns {Promise<void>}
 */

async function sendBatchQueries(messages) {
  const promises = [];
  messages.forEach(message => {
      const buffer = Buffer.from(message);
      const promise = new Promise((resolve, reject) => {
          const client = dgram.createSocket('udp4');
          client.send(buffer, 0, buffer.length, port, host, err => {
              if (err) {
                  reject(err);
              } else {
                  // console.info(`Send data`);
                  resolve();
          }
          client.close();
          });
      });
      promises.push(promise);
  });

    console.log('Start of sending')
    await Promise.all(promises);
    console.log('Sending complete')

}

/**
 * sending single message
 * @message - message
 * @port - destination port
 */
function sendOneQuire (port, message) {
    const buffer = Buffer.from(message);
    const client = dgram.createSocket('udp4');
    client.send(buffer, 0, buffer.length, port, host )
    console.info(`Send data`);
    client.close();
}


/**
 * sending messages distributed in time
 * @messages - arr of message
 * @delay - delay between messages
 * @returns {Promise<void>}
 */
async function sendTimeDistributedQueries(messages, delay) {
    const arrMessages = Array.from(messages)
    const promises = [];

    for (let i = 0; i < arrMessages.length; i++) {
          const promise = new Promise(() => {
              setTimeout(() => sendOneQuire(port, arrMessages[i]), delay * i)
        })
        promises.push(promise)
    }
    await Promise.all(promises)
}

function createMessages(numMessage) {
    const messages = new Set();

    for (let i = 0; i < numMessage; i++) {
        messages.add(generateRandomString(5));
    }
    return messages
}

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
