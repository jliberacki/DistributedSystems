const amqp = require('amqplib');
const readline = require('readline');

const workers = 'Workers';
const hospital = 'Hospital';
const admin = 'Admin';

async function main() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertExchange(hospital, 'topic', { durable: false });
  await channel.assertExchange(admin, 'fanout', { durable: false });
  await channel.assertExchange(workers, 'fanout', { durable: false });

  const q = await channel.assertQueue('');
  channel.bindQueue(q.queue, workers, '');
  channel.consume(q.queue, (message) => {
    if (message.content) {
      console.log(message.content.toString());
    }
  }, { noAck: true });
  channel.prefetch(1);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', (input) => {
    const [patient, injury] = input.split(' ');
    if (!(patient && injury)) {
      return console.log('Wrong input');
    }
    const message = Buffer.from(input);
    channel.publish(admin, '', message);
    return channel.publish(hospital, injury, message, { replyTo: q.queue });
  });

  console.log('Insert patient and disease ');
}


main().catch(console.log);
