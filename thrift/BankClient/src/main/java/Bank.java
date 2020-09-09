import bank.*;
import org.apache.thrift.TException;
import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TMultiplexedProtocol;
import org.apache.thrift.protocol.TProtocol;
import org.apache.thrift.transport.TSocket;
import org.apache.thrift.transport.TTransport;
import org.apache.thrift.transport.TTransportException;

import java.io.BufferedInputStream;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;

public class Bank {
    private List<String> premiumAccountsIds = new LinkedList<>();
    private List<String> standardAccountsIds = new LinkedList<>();

    private AccountManagement.Client accountManagement;
    private AccountService.Client accountService;
    private PremiumAccountService.Client premiumAccountService;

    public Bank(int port) throws TTransportException {
        String host = "localhost";

        TProtocol protocol;
        TTransport transport;

        transport = new TSocket(host, port);
        protocol = new TBinaryProtocol(transport, true, true);

        accountManagement = new AccountManagement
                .Client(new TMultiplexedProtocol(protocol, "AccountManagement"));
        accountService = new AccountService
                .Client(new TMultiplexedProtocol(protocol, "AccountService"));
        premiumAccountService = new PremiumAccountService
                .Client(new TMultiplexedProtocol(protocol, "PremiumAccountService"));

        transport.open();
    }

    public void runApp() {
        Scanner scanner = new Scanner(new BufferedInputStream(System.in));
        String command;
        String currency, id, pesel, firstname, lastname;
        float moneyAmount, years, incomeThreshold;
        printMenu();

        while (!(command = scanner.nextLine()).equals("/q")) {
            try {
                switch (command.trim().toLowerCase()) {
                    case "getbalance":
                        System.out.print("ID: ");
                        id = scanner.nextLine().trim();
                        if (standardAccountsIds.contains(id)) {
                            System.out.println(accountService.getAccountDetails(id));
                        } else if (premiumAccountsIds.contains(id)) {
                            System.out.println(premiumAccountService.getAccountDetails(id));
                        } else {
                            AccountDetails accountDetails = accountService.getAccountDetails(id);
                            if (accountDetails.isPremium) {
                                premiumAccountsIds.add(id);
                            } else {
                                standardAccountsIds.add(id);
                            }
                            System.out.println(accountDetails);
                        }
                        break;
                    case "getloan":
                        System.out.print("ID: ");
                        id = scanner.nextLine().trim();
                        System.out.print("Currency: ");
                        currency = scanner.nextLine().trim();
                        System.out.print("Money amount: ");
                        moneyAmount = Float.parseFloat(scanner.nextLine());
                        System.out.print("Years: ");
                        years = Float.parseFloat(scanner.nextLine());
                        System.out.println(premiumAccountService.getLoanDetails(
                                id,
                                new LoanParameters(currency, moneyAmount, years)
                        ));
                        break;
                    case "create":
                        System.out.print("PESEL: ");
                        pesel = scanner.nextLine().trim();
                        System.out.print("Currency: ");
                        currency = scanner.nextLine().trim().toUpperCase();
                        System.out.print("Income threshold: ");
                        incomeThreshold = Float.parseFloat(scanner.nextLine());
                        System.out.print("Firstname: ");
                        firstname = scanner.nextLine().trim();
                        System.out.print("Lastname: ");
                        lastname = scanner.nextLine().trim();
                        AccountDetails accountDetails = accountManagement.createAccount(new Account(
                                pesel,
                                firstname,
                                lastname,
                                incomeThreshold,
                                currency
                        ));
                        System.out.println(accountDetails);
                        break;
                    default:
                        printMenu();
                }
            } catch (InvalidArgumentException e) {
                System.out.println("InvalidArgumentException: " + e.reason);
            } catch (AuthorizationException e) {
                System.out.println("AuthorizationException: " + e.reason);
            } catch (MissingArgumentException e) {
                System.out.println("MissingArgumentException: " + e.reason);
            } catch (TException e) {
                e.printStackTrace();
            }
        }
    }

    private void printMenu() {
        System.out.println("getBalance - starts getting account details process");
        System.out.println("getLoan - starts getting loan details process");
        System.out.println("create - starts creating account process");
        System.out.println("/q - closes");
    }

}
