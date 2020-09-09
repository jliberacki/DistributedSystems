const thrift = require('thrift');
const CurrencyService = require('./currencyService');
const Validator = require('./validators');

const { Processor: AccountManagement } = require('../gen-nodejs/AccountManagement');
const { Processor: AccountService } = require('../gen-nodejs/AccountService');
const { Processor: PremiumAccountService } = require('../gen-nodejs/PremiumAccountService');
const {
  Account,
  LoanCosts,
  AccountDetails,
  LoanParameters,
} = require('../gen-nodejs/bank_types');


const defaultSettings = {
  PREMIUM_THRESHOLD: 10000,
  COMMISION: 0.001,
  CREDIT_RATE: 0.05,
};

const accounts = {};
let validator = {};

async function createAccount(account) {
  console.log('Received request for createAccount with parameters:\n', account);

  const accountObject = new Account(account);
  await validator.validateAccount(accountObject);

  const premiumThreshold = defaultSettings.PREMIUM_THRESHOLD;
  const isPremium = accountObject.incomeThreshold
    * CurrencyService.currencyRates[accountObject.currency.toUpperCase()] > premiumThreshold;
  accounts[accountObject.pesel] = Object.assign(accountObject, { balance: 0, isPremium });
  console.log(accounts);
  console.log('Created account', accounts[accountObject.pesel]);
  return new AccountDetails(accounts[accountObject.pesel]);
}

async function getLoanDetails(identifier, parameters) {
  console.log('Received request for loanDetails with parameters: \n', identifier, parameters);
  const loanParameters = new LoanParameters(parameters);
  const { moneyAmount, years, currency } = loanParameters;

  await validator.authenticate(identifier);
  await validator.validateLoan(loanParameters, identifier);

  console.log('Calculating loanCosts');
  const account = accounts[identifier];
  const commisionCosts = moneyAmount * defaultSettings.COMMISION;
  const rates = moneyAmount * defaultSettings.CREDIT_RATE * years;
  console.log({ rates, moneyAmount, commisionCosts });
  const requestedCurrencyCost = moneyAmount + rates + commisionCosts;
  const nativeCurrencyCost = requestedCurrencyCost / CurrencyService.currencyRates[account.currency]
    * CurrencyService.currencyRates[currency.toUpperCase()];

  const loanCosts = new LoanCosts({ requestedCurrencyCost, nativeCurrencyCost });
  console.log('LoanCosts calculated: ', loanCosts);

  return loanCosts;
}

async function getAccountDetails(identifier) {
  console.log('Received request for accountDetails with GUID: \n', identifier);
  await validator.authenticate(identifier);

  return new AccountDetails(accounts[identifier]);
}

const accountManagement = new AccountManagement({
  createAccount,
});

const premiumAccountService = new PremiumAccountService({
  getLoanDetails,
  getAccountDetails,
});

const accountService = new AccountService({
  getAccountDetails,
});

async function startBankService(port) {
  const multiplexedProcessor = new thrift.MultiplexedProcessor();
  multiplexedProcessor.registerProcessor('AccountManagement', accountManagement);
  multiplexedProcessor.registerProcessor('AccountService', accountService);
  multiplexedProcessor.registerProcessor('PremiumAccountService', premiumAccountService);
  const server = thrift.createMultiplexServer(multiplexedProcessor);
  console.log(`Starting server on port ${port}`);
  server.listen(port);
  console.log('Bank service started');
}

async function main(port) {
  await CurrencyService.init();
  validator = new Validator(CurrencyService, accounts);
  startBankService(port);
}

const port = parseInt(process.argv[2], 10) || 9090;

main(port);
