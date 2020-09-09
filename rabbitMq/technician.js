const amqp = require('amqplib');

const fields = process.argv.slice(2);
console.log();
if (fields.length !== 2) {
  console.log('Pleasae provide 2 specs');
  process.exit(1);
}

const workers = 'Workers';
const hospital = 'Hospital';
const admin = 'Admin';

async function main() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertExchange(admin, 'fanout', { durable: false });
  await channel.assertExchange(workers, 'fanout', { durable: false });
  await channel.assertExchange(hospital, 'topic', { durable: false });

  const workersQueue = await channel.assertQueue('', { exclusive: true });
  channel.bindQueue(workersQueue.queue, workers, '');
  channel.consume(workersQueue.queue, (message) => {
    if (message.content) {
      console.log(message.content.toString());
    }
  }, { noAck: true });

  fields.forEach((field) => {
    const key = `#.${field}.#`;
    channel.assertQueue(field);
    channel.bindQueue(field, hospital, key);
    channel.consume(field, (message) => {
      if (message.content) {
        const [patient, injury] = message.content.toString().split(' ');
        console.log(`Patient: ${patient}, injury: ${injury}`);
        const reply = Buffer.from(`${message.content.toString()} done`);
        channel.sendToQueue(message.properties.replyTo, reply);
        channel.publish(admin, '', reply);
        channel.ack(message);
      }
    });
  });
  channel.prefetch(1);
}


main().catch(console.log);
