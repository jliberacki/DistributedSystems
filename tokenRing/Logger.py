import socket
import struct
import datetime

multicastPort = 9999
MulticastIp4 = '239.1.1.1'
loggerSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
loggerSocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
loggerSocket.bind((MulticastIp4, multicastPort))
mreq = struct.pack("4sl", socket.inet_aton(MulticastIp4), socket.INADDR_ANY)
loggerSocket.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

buff = []

file = 'log.txt'

while True:
    buff, address = loggerSocket.recvfrom(1024)
    print("%s : %s\n" % (str(datetime.datetime.now()), buff))
    with open("log.txt", "w+") as log_file:
        log_file.write("%s : %s\n" % (str(datetime.datetime.now()), buff))
