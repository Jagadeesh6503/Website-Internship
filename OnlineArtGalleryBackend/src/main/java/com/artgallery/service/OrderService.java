package com.artgallery.service;

import com.artgallery.dto.OrderResponse;
import com.artgallery.exception.BadRequestException;
import com.artgallery.exception.ResourceNotFoundException;
import com.artgallery.model.*;
import com.artgallery.model.enums.ArtworkStatus;
import com.artgallery.model.enums.OrderStatus;
import com.artgallery.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository   orderRepository;
    private final CartRepository    cartRepository;
    private final UserRepository    userRepository;
    private final ArtworkRepository artworkRepository;

    /** Customer: view their orders */
    public Page<OrderResponse> getMyOrders(String email, int page, int size) {
        User user = findUser(email);
        return orderRepository.findByUserId(user.getId(), PageRequest.of(page, size, Sort.by("createdAt").descending()))
                              .map(this::toResponse);
    }

    /** Checkout: convert cart to an order */
    @Transactional
    public OrderResponse checkout(String email, String shippingAddr) {
        User user = findUser(email);
        Cart cart = cartRepository.findByUserId(user.getId())
            .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty — add artworks before checkout");
        }

        // Validate availability
        for (CartItem ci : cart.getItems()) {
            Artwork art = ci.getArtwork();
            if (!art.isAvailable() || art.getStatus() != ArtworkStatus.ACTIVE) {
                throw new BadRequestException("Artwork '" + art.getTitle() + "' is no longer available");
            }
        }

        // Calculate total
        BigDecimal total = cart.getItems().stream()
            .map(ci -> ci.getArtwork().getPrice())
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Build order
        String orderNum = "ORD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        Order order = Order.builder()
            .orderNumber(orderNum)
            .user(user)
            .totalAmount(total)
            .status(OrderStatus.PENDING)
            .shippingAddr(shippingAddr)
            .shippingName(user.getFullName())
            .shippingEmail(user.getEmail())
            .paymentStatus("PAID")
            .build();

        // Build order items, mark artworks as sold
        for (CartItem ci : cart.getItems()) {
            Artwork art = ci.getArtwork();
            OrderItem oi = OrderItem.builder()
                .order(order).artwork(art).price(art.getPrice())
                .build();
            order.getItems().add(oi);
            art.setAvailable(false);
            art.setStatus(ArtworkStatus.SOLD);
            artworkRepository.save(art);
        }

        orderRepository.save(order);

        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return toResponse(order);
    }

    /** Admin: update order status */
    @Transactional
    public OrderResponse updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(status);
        return toResponse(orderRepository.save(order));
    }

    /** Admin: all orders paginated */
    public Page<OrderResponse> getAllOrders(int page, int size) {
        return orderRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()))
                              .map(this::toResponse);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private OrderResponse toResponse(Order o) {
        List<OrderResponse.OrderItemResponse> items = o.getItems().stream()
            .map(oi -> OrderResponse.OrderItemResponse.builder()
                .artworkId(oi.getArtwork().getId())
                .artworkTitle(oi.getArtwork().getTitle())
                .artworkImage(oi.getArtwork().getImageUrl())
                .price(oi.getPrice())
                .build())
            .toList();

        return OrderResponse.builder()
            .id(o.getId())
            .orderNumber(o.getOrderNumber())
            .userId(o.getUser().getId())
            .customerName(o.getUser().getFullName())
            .totalAmount(o.getTotalAmount())
            .status(o.getStatus().name())
            .paymentStatus(o.getPaymentStatus())
            .shippingAddr(o.getShippingAddr())
            .createdAt(o.getCreatedAt())
            .items(items)
            .build();
    }
}
