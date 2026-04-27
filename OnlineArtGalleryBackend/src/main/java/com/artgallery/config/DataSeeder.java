package com.artgallery.config;

import com.artgallery.model.*;
import com.artgallery.model.enums.*;
import com.artgallery.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Seeds default users and artworks with properly BCrypt-encoded passwords on first run.
 * Runs AFTER schema.sql / data.sql so categories are already seeded.
 */
@Slf4j
@Component
@Order(2)
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final UserRepository     userRepository;
    private final ArtworkRepository  artworkRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder    passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        // 1. Seed users
        User admin  = seedUser("admin@artgallery.com",  "Admin",  "User",    Role.ADMIN,    "Platform administrator");
        User elena  = seedUser("elena@artgallery.com",  "Elena",  "Vasquez", Role.ARTIST,   "Passionate oil painter from Barcelona");
        User marcus = seedUser("marcus@artgallery.com", "Marcus", "Chen",    Role.ARTIST,   "Digital illustrator and concept artist");
        User sofia  = seedUser("sofia@artgallery.com",  "Sofia",  "Larsson", Role.ARTIST,   "Portrait and street photographer");
        User john   = seedUser("john@example.com",      "John",   "Doe",     Role.CUSTOMER, "Art collector and enthusiast");
                      seedUser("jane@example.com",      "Jane",   "Smith",   Role.CUSTOMER, null);
        log.info("✅ DataSeeder: Users seeded (password='password123')");

        // 2. Seed artworks only if none exist yet
        if (artworkRepository.count() == 0) {
            seedArtworks(elena, marcus, sofia);
            log.info("✅ DataSeeder: Sample artworks seeded");
        }
    }

    private User seedUser(String email, String first, String last, Role role, String bio) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = User.builder()
                .email(email)
                .firstName(first)
                .lastName(last)
                .password(passwordEncoder.encode("password123"))
                .role(role)
                .bio(bio)
                .isActive(true)
                .build();
            User saved = userRepository.save(user);
            log.info("  → Created user: {} ({})", email, role);
            return saved;
        });
    }

    private void seedArtworks(User elena, User marcus, User sofia) {
        Category painting    = cat(1L);
        Category digitalArt  = cat(2L);
        Category photography = cat(3L);
        Category abstractCat = cat(4L);
        Category sculpture   = cat(5L);
        Category portrait    = cat(7L);
        Category watercolor  = cat(8L);

        saveArt("Golden Horizon",  "A breathtaking oil painting capturing the golden hues of a Mediterranean sunset.",   new BigDecimal("1200.00"), "Oil on Canvas",       "24x36 in",  2023, "https://picsum.photos/seed/art1/800/600", true,  142, elena,  painting);
        saveArt("Digital Dreams",  "A vivid digital illustration exploring the boundary between reality and dreams.",     new BigDecimal("450.00"),  "Digital Print",        "20x28 in",  2024, "https://picsum.photos/seed/art2/800/600", true,   89, marcus, digitalArt);
        saveArt("Urban Echoes",    "Award-winning street photography series capturing the soul of New York City.",        new BigDecimal("800.00"),  "Photography",          "16x20 in",  2023, "https://picsum.photos/seed/art3/800/600", true,   77, sofia,  photography);
        saveArt("Abstract Force",  "Powerful acrylic expressionism exploring chaos, order, and raw emotion.",            new BigDecimal("2200.00"), "Acrylic",              "30x40 in",  2022, "https://picsum.photos/seed/art4/800/600", true,  201, elena,  abstractCat);
        saveArt("Serene Waters",   "Delicate watercolor depicting a still lake at dawn — peace captured in pigment.",    new BigDecimal("950.00"),  "Watercolor",           "18x24 in",  2024, "https://picsum.photos/seed/art5/800/600", false,  56, elena,  watercolor);
        saveArt("The Wanderer",    "A compelling oil portrait of a lone traveler against a stormy mountainscape.",       new BigDecimal("1800.00"), "Oil on Canvas",        "26x32 in",  2023, "https://picsum.photos/seed/art6/800/600", true,   98, elena,  portrait);
        saveArt("Neon Nights",     "Cyberpunk-inspired digital art blending neon cityscapes with surreal figures.",      new BigDecimal("380.00"),  "Digital Illustration", "14x20 in",  2024, "https://picsum.photos/seed/art7/800/600", true,   67, marcus, digitalArt);
        saveArt("Clay Soul",       "Expressive clay sculpture evoking the complexity of the human inner world.",         new BigDecimal("3200.00"), "Clay",                 "12x8x8 in", 2022, "https://picsum.photos/seed/art8/800/600", true,   34, sofia,  sculpture);
    }

    private Category cat(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    private void saveArt(String title, String desc, BigDecimal price, String medium,
                         String dims, int year, String imageUrl,
                         boolean available, int views, User artist, Category cat) {
        Artwork art = Artwork.builder()
            .title(title)
            .description(desc)
            .price(price)
            .medium(medium)
            .dimensions(dims)
            .yearCreated(year)
            .imageUrl(imageUrl)
            .status(ArtworkStatus.ACTIVE)
            .isAvailable(available)
            .viewCount(views)
            .artist(artist)
            .category(cat)
            .build();
        artworkRepository.save(art);
    }
}
