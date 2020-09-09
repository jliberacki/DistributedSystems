#include "tokenRing.h"

int multicastSocket = -1;

void initMulticast() {
    if ((multicastSocket = socket(AF_INET, SOCK_DGRAM, 0)) < 0) {
        perror("init_multicast(), socket() ERROR");
        exit(EXIT_FAILURE);
    }
}

void sendMulticast(void *message, int size) {
    struct sockaddr_in addr;

    struct sockaddr_in multicasAdress =
            {
                    .sin_family = AF_INET,
                    .sin_port = htons(MULTICAST_PORT),
            };

    if (inet_pton(AF_INET, MULTICAST_GROUP_ADRESS, &multicasAdress.sin_addr.s_addr) <= 0) {
        perror("send_multicast(), inet_pton() ERROR");
        exit(EXIT_FAILURE);
    }
    if ((sendto(multicastSocket, message, size, 0, (struct sockaddr *) &multicasAdress, sizeof(multicasAdress))) < 0) {
        perror("send_multicast(), sendto() ERROR:");
        exit(EXIT_FAILURE);
    }
}

void printToken(Token token) {
    printf("============[ TOKEN ]============\n");
    printf("ID      : '%s'\n", token.ID);
    printf("SRC     : '%s'\n", token.source);
    printf("DST     : '%s'\n", token.destination);
    printf("FLAG    : '%s'\n", &token.newMember);
    printf("MEMBERS : '%s'\n", token.members);
    printf("------------[ DATA  ]-------------\n");
    fwrite(token.data, 1024, 1, stdout);
    printf("'\n");
}
