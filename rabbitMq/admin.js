const amqp = require('amqplib');
const readline = require('readline');

const workers = 'Workers';
const admin = 'Admin';

async function main() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertExchange(admin, 'fanout', { durable: false });
  await channel.assertExchange(workers, 'fanout', { durable: false });
  const adminQueue = await channel.assertQueue('', { exclusive: true });

  channel.bindQueue(adminQueue.queue, admin, '');
  channel.consume(adminQueue.queue, (message) => {
    if (message.content) {
      console.log(message.content.toString());
    }
  }, { noAck: true });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', input => channel.publish(workers, '', Buffer.from(input)));

  console.log('Alert all');
}


main().catch(console.log);
