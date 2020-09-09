import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class DistributedMap implements SimpleStringMap, Serializable {
	private Map<String, Integer> map = new HashMap<>();

    @Override
    public boolean containsKey(String key) {
    	return map.containsKey(key);
    }

    @Override
    public Integer get(String key) {
    	return map.get(key);
    }

    @Override
    public void put(String key, Integer value) {
    	map.put(key, value);
    }

    @Override
    public Integer remove(String key) {
    	Integer removedElement = map.remove(key);
        return removedElement;
    }

    public void clear() {
        map.clear();
    }

    public void putAll(DistributedMap distributedMap) {
        map.putAll(distributedMap.getMap());
    }

    public Map getMap() {
        return this.map;
    }

    @Override
    public String toString() {
    	String mapToString = "";
        for (String key : map.keySet()) {
            mapToString += key + " -> " + map.get(key) + "\n";
        }

        return mapToString;
    }
}
