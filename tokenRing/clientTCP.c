#include "tokenRing.h"


u_int16_t inPort = 0;
int inSocket = -1;
u_int16_t outPort = 0;
int outSocket = -1;
int haveToken = 0;
char clientIP[16];
int activeInSocket = -1;
char tokenID[8];
char Id[64];
char newPrevId[64];
char prevId[64];
int canSend = 1;
Token token;
char destination[64];
char message[1024];
pthread_mutex_t lock;
pthread_t console;


void parseArguments(int argc, char *argv[]) {
    if (argc != 6) {
        printf("Wrong number of arguments.1. program-id 2. inPort, 3.ip, 4.outPort, 5. haveToken");
        exit(EXIT_FAILURE);
    }

    strcpy(Id, argv[1]);

    inPort = (u_int16_t) strtol(argv[2], 0, 10);

    outPort = (u_int16_t) strtol(argv[4], 0, 10);


    if (inPort == 0 || outPort == 0) {
        printf("Wrong port number");
        exit(EXIT_FAILURE);
    }
    strcpy(clientIP, argv[3]);

    haveToken = (int) strtol(argv[5], 0, 10);

}

int generateRandomId() {
    srand(time(0));
    return rand() % 10000000;
}

void *consoleThread() {
    while (1) {
        printf("UserId to sent: \n");
        fgets(destination, 128, stdin);
        destination[strlen(destination) - 1] = '\0';
        printf("Message: \n");
        fgets(message, 1024, stdin);
        message[strlen(message) - 1] = '\0';
        pthread_mutex_lock(&lock);
        printf("Please wait \n");
    }
}

void startConsoleThread() {
    if (pthread_create(&console, NULL, consoleThread, NULL) != 0) {
        perror("startConsoleThread(), pthread_create() ERROR");
        exit(EXIT_FAILURE);
    }
}

void sigInitHandler() {
    if (outSocket > 0 && !shutdown(outSocket, SHUT_RDWR)) {
        perror("shutdown() on outSocket ERROR");
    };

    if (inSocket > 0 && !shutdown(inSocket, SHUT_RDWR)) {
        perror("shutdown() on inScoket ERROR");
    };
    pthread_mutex_destroy(&lock);
    printf("\nClosed successfully \n");
    exit(EXIT_SUCCESS);
}

void unblockSocket(int sockfd) {
    if (fcntl(sockfd, F_SETFL, O_NONBLOCK) < 0) {
        perror("createInSocket(), fcntl() ERROR\n");
        exit(EXIT_FAILURE);
    }
}

int createOutSocket(struct sockaddr_in sockaddr_out) {
    sockaddr_out.sin_family = AF_INET;
    bzero(sockaddr_out.sin_zero, sizeof(sockaddr_out.sin_zero));

    int sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd == -1) {
        perror("createOutSocket(), socket() ERROR\n");
        exit(EXIT_FAILURE);
    }
    if (connect(sockfd, (struct sockaddr *) &sockaddr_out, sizeof(sockaddr_out)) != 0) {
        perror("createOutSocket(),  connect() ERROR\n");
        exit(0);
    }

    printf("outSocket successfully created\n");

    initMessage initMessage = {
            .port = inPort
    };
    strcpy(initMessage.Id, Id);
    if (write(sockfd, &initMessage, sizeof(initMessage)) != sizeof(initMessage)) {
        perror("handelNewNode(), write() ERROR");
        exit(EXIT_FAILURE);
    }
    return sockfd;
}

int createOutSocketPortIp(u_int16_t port, char *ip_address) {
    struct sockaddr_in sockaddr_out =
            {
                    .sin_family = AF_INET,
                    .sin_port = htons(port),
            };
    if (inet_pton(AF_INET, ip_address, &sockaddr_out.sin_addr) <= 0) {
        perror("createOutSocket(), inet_pton() ERROR");
        exit(EXIT_FAILURE);
    }
    return createOutSocket(sockaddr_out);
}

int createInSocket(u_int16_t port) {
    struct sockaddr_in sockaddrIn =
            {
                    .sin_family = AF_INET,
                    .sin_port = htons(port),
                    .sin_addr = INADDR_ANY
            };

    int sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd == -1) {
        perror("createInSocket(), socket() ERROR\n");
        exit(EXIT_FAILURE);
    }

    if (setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &(int) {1}, sizeof(int)) < 0) {
        perror("createInSocket(), setsockopt() ERROR\n");
        exit(EXIT_FAILURE);
    }
    if (bind(sockfd, (struct sockaddr *) &sockaddrIn, sizeof(sockaddrIn)) < 0) {
        perror("createInSocket(), bind() ERROR\n");
        exit(EXIT_FAILURE);
    }


    if (listen(sockfd, MAX_CONNECTION)) {
        perror("createInSocket(), listen() ERROR\n");
        exit(EXIT_FAILURE);
    };
    printf("inSocket successfully created\n");

    return sockfd;
}

int acceptNewConnection(struct sockaddr_in *newNodeAdress) {

    int sockaddr_in_size = sizeof(&newNodeAdress);
    int newActiveSocket = accept(inSocket, (struct sockaddr *) newNodeAdress, (socklen_t *) &sockaddr_in_size);

    if (newActiveSocket < 0) {
        if (errno != EWOULDBLOCK) {
            perror("acceptNewConnection(), accept() ERROR: ");
        }
    } else {
        initMessage initMessage;

        if (read(newActiveSocket, &initMessage, sizeof(initMessage)) != sizeof(initMessage)) {
            perror("acceptNewConnection(), read() ERROR");
            return -1;
        }
        stpcpy(newPrevId, initMessage.Id);
        newNodeAdress->sin_port = htons(initMessage.port);
    }
    return newActiveSocket;

}

void clearToken(Token *token) {
    bzero(token->destination, sizeof(token->destination));
    bzero(token->source, sizeof(token->source));
    bzero(token->data, sizeof(token->data));
    bzero(token->TTL, sizeof(token->TTL));
    bzero(&token->newMember, sizeof(char));
}

void handelMessage(Token *token) {
    if (strcmp(&token->newMember, "") != 0) {
        struct sockaddr_in *newNodeAdress = (struct sockaddr_in *) token->data;
        shutdown(outSocket, SHUT_RDWR);
        outSocket = createOutSocket(*newNodeAdress);
        int members = (int) strtol(token->members, 0, 10) + 1;
        sprintf(token->members, "%d", members);
    } else {
        printf("Message: ");
        fwrite(token->data, 1024, 1, stdout);
        printf("\n");
    }

}

int getToken(Token *token) {
    clearToken(token);
    if (read(activeInSocket, token, sizeof(*token)) != sizeof(*token)) {
        perror("getToken(), read() ERROR");
        exit(EXIT_FAILURE);
    }
    char message[48];
    sprintf(message, "Client with Id: %s received token", Id);
    sendMulticast(message, sizeof(message));
    if ((strcmp(tokenID, "")) == 0) {
        strcpy(tokenID, token->ID);
    } else if (strcmp(tokenID, token->ID) != 0) {
        return 0;
    }
    if (!strcmp(token->destination, Id)) {
        handelMessage(token);
        clearToken(token);
        if (canSend) return 1;
        canSend = 1;
        return 0;
    }

    if (!(strcmp(token->destination, ""))) {
        if (!canSend) {
            canSend = 1;
            return 0;
        }
        return 1;
    }

    if (!strcmp(token->source, Id)) {
        clearToken(token);
        printf("Token made a loop\n");
        if (canSend) return 1;
        canSend = 1;
        return 0;
    } else if (!strcmp(token->TTL, "0")) {
        clearToken(token);
    }

    int TTL = (int) strtol(token->TTL, 0, 10) - 1;
    sprintf(token->TTL, "%d", TTL);

    return 0;
}

void sendToken(Token *token) {
    if (!strcmp(token->source, Id)) {
        canSend = 0;
    }

    if (write(outSocket, token, sizeof(*token)) != sizeof(*token)) {
        perror("sendToken(), write() ERROR");
        exit(EXIT_FAILURE);
    }
}

void signToken(Token *token) {
    strcpy(token->source, Id);
    strcpy(token->TTL, token->members);
}

int handelNewNode(Token *token) {
    struct sockaddr_in newNodeAdress;

    int newInSocket = acceptNewConnection(&newNodeAdress);

    if (newInSocket > 0) {
        stpcpy(token->destination, prevId);
        memcpy(token->data, &newNodeAdress, sizeof(newNodeAdress));

        strcpy(&token->newMember, "a");
        strcpy(prevId, newPrevId);
        signToken(token);
        shutdown(activeInSocket, SHUT_RDWR);
        activeInSocket = newInSocket;
        return 1;
    }
    return 0;

}

void handelUserMessage(Token *token) {
    if (strcmp(destination, "") != 0 && strcmp(message, "") != 0) {
        signToken(token);
        strcpy(token->data, message);
        strcpy(token->destination, destination);
        strcpy(token->TTL, token->members);
        strcpy(message, "");
        strcpy(destination, "");
        pthread_mutex_unlock(&lock);
    }

}

int main(int argc, char *argv[]) {
    struct sockaddr_in newNodeAdress;
    bzero(&token, sizeof(token));
    bzero(tokenID, sizeof(tokenID));
    bzero(Id, sizeof(Id));
    bzero(newPrevId, sizeof(newPrevId));
    bzero(prevId, sizeof(prevId));
    parseArguments(argc, argv);
    signal(SIGINT, sigInitHandler);
    atexit(sigInitHandler);
    if (pthread_mutex_init(&lock, NULL) != 0) {
        perror("pthread_mutex_init() ERROR:");
        exit(EXIT_FAILURE);
    }
    initMulticast();
    inSocket = createInSocket(inPort);
    if (haveToken) {
        activeInSocket = acceptNewConnection(&newNodeAdress);
        outSocket = createOutSocket(newNodeAdress);
        int ID = generateRandomId();
        sprintf(token.ID, "%d", ID);
        strcpy(token.members, "2");
        strcpy(token.data, "");
        sendToken(&token);
    } else {
        outSocket = createOutSocketPortIp(outPort, clientIP);
        activeInSocket = acceptNewConnection(&newNodeAdress);

    }
    unblockSocket(inSocket);

    strcpy(prevId, newPrevId);
    startConsoleThread();
    while (1) {
        if (getToken(&token)) {
            if (!handelNewNode(&token)) {
                handelUserMessage(&token);
            }

        }
        sleep(1);
        sendToken(&token);
    }
    return 0;
}
