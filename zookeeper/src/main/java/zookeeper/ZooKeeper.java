package zookeeper;

import org.apache.zookeeper.KeeperException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;


public class ZooKeeper {
    private static ZKManager zkManager;

    public static void main(String[] args) throws IOException {
        String[] appArgs = {"notepad"};
        zkManager = new ZKManager("localhost:2181,localhost:2182,localhost:2183", "/z", 3000, appArgs);
        zkManager.run();
        loop();
    }

    private static void loop() throws IOException {
        System.out.println("ZooKeeper");

        try (BufferedReader br = new BufferedReader(new InputStreamReader(System.in))) {
            br.lines()
                    .forEach(line -> {
                        if (line.equals("quit")) {
                            zkManager.close();
                            System.exit(0);
                        } else if (line.equals("print")) {
                            try {
                                zkManager.printTree();
                            } catch (KeeperException | InterruptedException e) {
                                e.printStackTrace();
                            }
                        }
                    });
        }
    }
}