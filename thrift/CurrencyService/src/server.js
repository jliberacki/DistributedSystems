const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = `${__dirname}/../../protos/currencies.proto`;
const defaultSettings = {
  currencyChangeInterval: 5000, // in mili seconds
  port: 50051,
};
// Suggested options for similarity to existing grpc.load behavior
const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
);

const currenciesSet = {};
let defaultCurrency = '';
let id = 0;

function setCurrencies(currencies) {
  const keys = currencies.map(obj => obj.name);
  [defaultCurrency] = keys;
  console.log(`Default currency is ${defaultCurrency}\n All available currencies: ${keys}`);
  keys.forEach((currency) => {
    currenciesSet[currency] = { rate: 1, subscribers: [] };
  });
}

function getCurrencies(currencies) {
  return currencies.map(currency => ({ currency, rate: currenciesSet[currency].rate }));
}

function removeSubscriber(subscriber) {
  Object.keys(currenciesSet).forEach((key) => {
    currenciesSet[key].subscribers = currenciesSet[key].subscribers[key]
      .filter(sub => sub !== subscriber);
  });
}

function addSubscriberToCurrencies(subscriber, currencies) {
  currencies.forEach((currency) => {
    currenciesSet[currency].subscribers.push(subscriber);
  });
}

function getCurrencyRates(call) {
  id += 1;
  const bankId = id + 1;
  console.log(`Bank ${bankId} is subscribing to currency rates`);

  const { currencies } = call.request;

  if (!(currencies || currencies.every(currency => currenciesSet[currency]))) {
    id -= 1;
    console.log(`Bank ${bankId} has given wrong arguments`);
    return;
  }

  call.write({ currencyRates: getCurrencies(currencies) });
  addSubscriberToCurrencies(call, currencies);

  call.on('end', () => {
    console.log(`Bank ${bankId} disconnected`);
    removeSubscriber(call);
  });
}

function notifySubscribers(currency) {
  console.log(`Notifying subscribers about ${currency} rate changed`);
  currenciesSet[currency].subscribers.forEach((subscriber) => {
    try {
      subscriber.write({
        currencyRates:
          [{ rate: currenciesSet[currency].rate, currency }],
      });
    } catch (_) {
      console.log('Error while sending message to bank. Removing it from subscribers');
      removeSubscriber(subscriber);
    }
  });
}

function simulateCurrenciesRates() {
  const interval = defaultSettings.currencyChangeInterval;
  console.log(`Initiating currency changing with interval ${interval} ms`);
  setInterval(() => {
    Object.entries(currenciesSet).forEach(([currency, { rate }]) => {
      if (currency === defaultCurrency) return;
      if (Math.random() > 0.5) {
        currenciesSet[currency].rate = Math.abs(rate + (Math.random() - 0.5));
        notifySubscribers(currency);
      }
    });
  }, interval);
}

function startServer() {
  // The protoDescriptor object has the full package hierarchy
  const { currencyService } = grpc.loadPackageDefinition(packageDefinition);
  setCurrencies(currencyService.Currency.type.value);
  const server = new grpc.Server();
  server.addService(currencyService.CurrencyService.service, { getCurrencyRates });
  server.bind(`0.0.0.0:${defaultSettings.port}`, grpc.ServerCredentials.createInsecure());
  server.start();
}

startServer();
simulateCurrenciesRates();
