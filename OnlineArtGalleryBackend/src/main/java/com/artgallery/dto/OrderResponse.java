package com.artgallery.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** Order summary response */
@Data @Builder
public class OrderResponse {
    private Long   id;
    private String orderNumber;
    private Long   userId;
    private String customerName;
    private BigDecimal totalAmount;
    private String status;
    private String paymentStatus;
    private String shippingAddr;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;

    @Data @Builder
    public static class OrderItemResponse {
        private Long   artworkId;
        private String artworkTitle;
        private String artworkImage;
        private BigDecimal price;
    }
}
