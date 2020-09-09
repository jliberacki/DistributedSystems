#ifndef BORKOWSKI_SZYMON_1_TOKENRING_H
#define BORKOWSKI_SZYMON_1_TOKENRING_H

#include <pthread.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <zconf.h>
#include <sys/socket.h>
#include <arpa/inet.h>

#include <netinet/in.h>
#include <sys/fcntl.h>
#include <errno.h>
#include <signal.h>
#include <time.h>
#include <unistd.h>

#define MULTICAST_GROUP_ADRESS "239.1.1.1"
#define MULTICAST_PORT 9999
#define MAX_CONNECTION 10

struct initMessage{
    char Id[124];
    u_int16_t port;
};

typedef struct initMessage initMessage;

struct Token {
    char ID[8];
    char members[8];
    char newMember;
    char TTL[8];
    char destination[64];
    char source[64];
    char data[1024];
};
typedef struct Token Token;

void parseArguments(int argc, char *argv[]);

void initMulticast();

void sendMulticast(void *message, int size);

void printToken(Token token);

#endif //BORKOWSKI_SZYMON_1_TOKENRING_H

