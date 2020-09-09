const readline = require('readline');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = `${__dirname}/../../../protos/currencies.proto`;

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
class CurrencyService {
  constructor() {
    this.currencyRates = {};
    this.currenciesSupported = [];
  }

  async init() {
    const { currencyService } = grpc.loadPackageDefinition(packageDefinition);
    const currencyServiceStub = new currencyService.CurrencyService('localhost:50051', grpc.credentials.createInsecure());

    const avalibleCurrencies = currencyService.Currency.type.value.map(obj => obj.name);

    return new Promise((resolve) => {
      rl.question(`This are all available currencies: ${avalibleCurrencies}
         Please give list of supported currencies separated by commas (eg. "USD, GBP")\n`, (givenCurrencies) => {
        const currencies = givenCurrencies.split(',').map(
          currency => currency.trim().toUpperCase(),
        );
        const call = currencyServiceStub.getCurrencyRates({ currencies });

        call.on('data', (data) => {
          console.log(data.currencyRates);
          data.currencyRates.forEach(
            (currency) => {
              if (!this.currencyRates[currency.currency]) {
                this.currenciesSupported.push(currency.currency);
              }
              this.currencyRates[currency.currency] = currency.rate;
            },
          );
          resolve();
        });

        rl.close();
      });
    });
  }

  isSupported(currency) {
    return Object.keys(this.currencyRates).includes(currency.toUpperCase());
  }
}

module.exports = new CurrencyService();
