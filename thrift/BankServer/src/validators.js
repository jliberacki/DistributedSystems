const {
  AuthorizationException,
  InvalidArgumentException,
  MissingArgumentException,
} = require('../gen-nodejs/bank_types');

const peselRegexp = new RegExp('[0-9]{11}');

async function validatePresenc(parameter, parameterName) {
  if (!parameter) {
    console.log(`Missing ${parameterName}`);
    throw new MissingArgumentException({ reason: `Missing ${parameterName}` });
  }
}

async function validateNumber(number, parameterName) {
  await validatePresenc(number, parameterName);

  if (!number > 0) {
    console.log(`Invalid ${parameterName} value`);
    throw new InvalidArgumentException({ reason: `Invalid ${parameterName} value` });
  }
}

class Validator {
  constructor(currencyService, accounts) {
    this.currencyService = currencyService;
    this.accounts = accounts;
  }

  async authenticate(identifier) {
    await validatePresenc(identifier, 'identifier');

    if (!this.accounts[identifier]) {
      console.log('Account does not exist');
      throw new AuthorizationException({ reason: 'Authorization failure, wrong identifier' });
    }
  }

  async validateCurrency(currency, parameterName) {
    await validatePresenc(currency, parameterName);

    if (!this.currencyService.isSupported(currency)) {
      console.log('Currency not supported');
      throw new InvalidArgumentException(
        { reason: `Currency not supported, supported currencies: ${this.currencyService.currenciesSupported}` },
      );
    }
  }

  async validateAccount(accountObject) {
    const {
      firstname, lastname, pesel, incomeThreshold, currency,
    } = accountObject;

    await Promise.all([
      validatePresenc(firstname, 'firstname'),
      validatePresenc(lastname, 'lastname'),
      validatePresenc(pesel, 'PESEL'),
      validateNumber(incomeThreshold, 'incomeThreshold'),
      this.validateCurrency(currency, 'currency'),
    ]);

    if (!peselRegexp.test(pesel)) {
      console.log('Wrong PESEL format');
      throw new InvalidArgumentException({ reason: 'Wrong PESEL format' });
    }
  }

  async validateLoan(parameters, identifier) {
    const { moneyAmount, years, currency } = parameters;

    if (!this.accounts[identifier].isPremium) {
      console.log('Expected premium account, received standard account');
      throw new AuthorizationException({ reason: 'Account is not a premium account' });
    }

    await Promise.all([validateNumber(moneyAmount, 'moneyAmount'),
      validateNumber(years, 'years'),
      this.validateCurrency(currency, 'currency'),
    ]);
  }
}

module.exports = Validator;
