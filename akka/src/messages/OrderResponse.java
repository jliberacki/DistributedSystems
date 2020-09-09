package messages;

public class OrderResponse {

    private String title;

    private boolean isOrder;

    public OrderResponse(String title, boolean isOrder) {
        this.title = title;
        this.isOrder = isOrder;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isOrder() {
        return isOrder;
    }

    public void setOrder(boolean order) {
        isOrder = order;
    }
}
