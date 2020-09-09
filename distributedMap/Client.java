import org.jgroups.JChannel;
import org.jgroups.Message;
import org.jgroups.ReceiverAdapter;
import org.jgroups.View;
import org.jgroups.protocols.*;
import org.jgroups.protocols.pbcast.*;
import org.jgroups.stack.ProtocolStack;
import org.jgroups.util.Util;

import java.io.*;
import java.util.Arrays;


public class Client extends ReceiverAdapter {
    private DistributedMap distributedMap;
    private JChannel channel;

    public static void main(String[] args) throws Exception {
        Client client = new Client();
        client.start();
    }


    private void start() throws Exception {
        distributedMap = new DistributedMap();
        configureCommunication();
        startCommunication();
        channel.close();
    }


    private void configureCommunication() {
        this.channel = null;
        try {
            channel = new JChannel();
        } catch (Exception e) {
            e.printStackTrace();
        }
        channel.setReceiver(this);
        ProtocolStack stack = new ProtocolStack();
        channel.setProtocolStack(stack);
        stack.addProtocol(new UDP())
                .addProtocol(new PING())
                .addProtocol(new MERGE3())
                .addProtocol(new FD_SOCK())
                .addProtocol(new FD_ALL()
                        .setValue("timeout", 12000)
                        .setValue("interval", 3000))
                .addProtocol(new VERIFY_SUSPECT())
                .addProtocol(new BARRIER())
                .addProtocol(new NAKACK2())
                .addProtocol(new UNICAST3())
                .addProtocol(new STABLE())
                .addProtocol(new GMS())
                .addProtocol(new UFC())
                .addProtocol(new MFC())
                .addProtocol(new FRAG2())
                .addProtocol(new SEQUENCER())
                .addProtocol(new FLUSH())
                .addProtocol(new STATE_TRANSFER());
        try {
            stack.init();
            channel.connect("hashmap");
            channel.getState(null, 10000);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private void startCommunication() {

        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));

        while (true) {
            try {
                System.out.print("> ");
                System.out.flush();
                String line = in.readLine();
                if (line.startsWith("quit") || line.startsWith("exit"))
                    break;
                String[] toSend = line.split("\\s");
                String message_type = toSend[0];
                if (OperationTypes.GET.name().equals(message_type)) {
                    System.out.println(distributedMap.get(toSend[1]));
                } else if (OperationTypes.CONTAINS_KEY.name().equals(message_type)) {
                    System.out.println(distributedMap.containsKey(toSend[1]));
                } else if (OperationTypes.REMOVE.name().equals(message_type)) {
                    Message msg = new Message(null, null, line);
                    channel.send(msg);
                } else if (OperationTypes.PRINT.name().equals(message_type)) {
                    Message msg = new Message(null, null, line);
                    channel.send(msg);
                } else if (OperationTypes.PUT.name().equals(message_type)) {
                    Message msg = new Message(null, null, line);
                    channel.send(msg);
                } else {
                    System.out.println("Wrong input");
                }
            } catch (Exception ignored) {
            }
        }
    }

    public void viewAccepted(View newView) {
        System.out.println("View: " + newView + "\n");
    }


    public void receive(Message msg) {
        String[] recv;
        String line = msg.getSrc() + ": " + msg.getObject();
        recv = line.split("\\s");
        String message_type = recv[1];
        if (OperationTypes.PUT.name().equals(message_type)) {
            synchronized (distributedMap) {
                distributedMap.put(recv[3], Integer.parseInt(recv[2]));
            }
        } else if (OperationTypes.PRINT.name().equals(message_type)) {
            System.out.println(this.distributedMap.toString());
        } else if (OperationTypes.REMOVE.name().equals(message_type)) {
            synchronized (distributedMap) {
                distributedMap.remove(recv[2]);
            }
        }
    }


    public void getState(OutputStream output) throws Exception {
        synchronized (distributedMap) {
            Util.objectToStream(distributedMap, new DataOutputStream(output));
        }
    }

    public void setState(InputStream input) throws Exception {
        DistributedMap distributedMap = (DistributedMap) Util.objectFromStream(new DataInputStream(input));
        synchronized (this.distributedMap) {
            this.distributedMap.clear();
            this.distributedMap.putAll(distributedMap);
        }
        System.out.println(distributedMap);
    }
}
