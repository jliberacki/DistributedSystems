namespace java bank

typedef string PESEL
typedef string Currency

struct Account {
    1: PESEL pesel,
    2: string firstname,
    3: string lastname,
    4: double incomeThreshold,
    5: Currency currency,
}

struct AccountDetails {
    1: double balance,
    2: Currency currency,
    3: bool isPremium,
}

struct LoanCosts {
    1: double nativeCurrencyCost,
    2: double requestedCurrencyCost,
}

struct LoanParameters {
    1: Currency currency,
    2: double moneyAmount,
    3: double years,
}

exception AuthorizationException {
    1: string reason
}

exception InvalidArgumentException {
    1: string reason
}

exception MissingArgumentException {
    1: string reason
}


service AccountManagement {
    AccountDetails createAccount(1: Account account) throws (
    1: InvalidArgumentException invalidArgumentException,
    2: MissingArgumentException missingArgumentException,
    ),
}

service AccountService {
    AccountDetails getAccountDetails(1: PESEL pesel) throws (
    1: AuthorizationException authorizationException,
    2: MissingArgumentException missingArgumentException,
),
}

service PremiumAccountService extends AccountService {
    LoanCosts getLoanDetails(1: PESEL pesel, 2: LoanParameters loanParameters) throws (
        1: AuthorizationException authorizationException,
        2: InvalidArgumentException invalidArgumentException,
        3: MissingArgumentException missingArgumentException,
    ),
}

