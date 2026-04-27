package com.artgallery.service;

import com.artgallery.dto.ArtworkRequest;
import com.artgallery.dto.ArtworkResponse;
import com.artgallery.exception.BadRequestException;
import com.artgallery.exception.ResourceNotFoundException;
import com.artgallery.model.*;
import com.artgallery.model.enums.ArtworkStatus;
import com.artgallery.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.UUID;

/**
 * Business logic for artworks — CRUD, file upload, search/filter, pagination
 */
@Service
@RequiredArgsConstructor
public class ArtworkService {

    private final ArtworkRepository  artworkRepository;
    private final UserRepository     userRepository;
    private final CategoryRepository categoryRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    // ── Public: browse / search / paginate ──────────────────────

    public Page<ArtworkResponse> getActiveArtworks(int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);
        return artworkRepository.findByStatus(ArtworkStatus.ACTIVE, pageable)
                                .map(this::toResponse);
    }

    public Page<ArtworkResponse> getMyArtworks(String artistEmail, int page, int size) {
        User artist = userRepository.findByEmail(artistEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Pageable pageable = PageRequest.of(page, Math.min(size, 50), Sort.by("createdAt").descending());
        return artworkRepository.findByArtistId(artist.getId(), pageable)
                                .map(this::toResponse);
    }


    public Page<ArtworkResponse> search(String q, Long categoryId,
                                         BigDecimal minPrice, BigDecimal maxPrice,
                                         int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);
        return artworkRepository.search(q, categoryId, minPrice, maxPrice, pageable)
                                .map(this::toResponse);
    }

    public ArtworkResponse getById(Long id) {
        Artwork art = findOrThrow(id);
        // Increment view count (fire-and-forget update)
        art.setViewCount(art.getViewCount() + 1);
        artworkRepository.save(art);
        return toResponse(art);
    }

    // ── Artist: create / update / delete ────────────────────────

    @Transactional
    public ArtworkResponse create(String artistEmail, ArtworkRequest req, MultipartFile image) {
        User artist = userRepository.findByEmail(artistEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Artwork art = Artwork.builder()
            .title(req.getTitle())
            .description(req.getDescription())
            .price(req.getPrice())
            .medium(req.getMedium())
            .dimensions(req.getDimensions())
            .yearCreated(req.getYearCreated())
            .isAvailable(req.isAvailable())
            .status(ArtworkStatus.PENDING)    // Admin must approve
            .artist(artist)
            .build();

        if (req.getCategoryId() != null) {
            Category cat = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            art.setCategory(cat);
        }

        if (image != null && !image.isEmpty()) {
            art.setImageUrl(saveImage(image));
        }

        return toResponse(artworkRepository.save(art));
    }

    @Transactional
    public ArtworkResponse update(Long id, String artistEmail, ArtworkRequest req, MultipartFile image) {
        Artwork art = findOrThrow(id);
        if (!art.getArtist().getEmail().equals(artistEmail)) {
            throw new BadRequestException("You are not the owner of this artwork");
        }

        art.setTitle(req.getTitle());
        art.setDescription(req.getDescription());
        art.setPrice(req.getPrice());
        art.setMedium(req.getMedium());
        art.setDimensions(req.getDimensions());
        art.setYearCreated(req.getYearCreated());
        art.setAvailable(req.isAvailable());

        if (req.getCategoryId() != null) {
            categoryRepository.findById(req.getCategoryId())
                .ifPresent(art::setCategory);
        }

        if (image != null && !image.isEmpty()) {
            art.setImageUrl(saveImage(image));
        }

        return toResponse(artworkRepository.save(art));
    }

    @Transactional
    public void delete(Long id, String artistEmail) {
        Artwork art = findOrThrow(id);
        if (!art.getArtist().getEmail().equals(artistEmail)
                && !userRepository.findByEmail(artistEmail)
                    .map(u -> u.getRole().name().equals("ADMIN")).orElse(false)) {
            throw new BadRequestException("Unauthorized to delete this artwork");
        }
        artworkRepository.delete(art);
    }

    // ── Admin: approve / reject ──────────────────────────────────

    @Transactional
    public ArtworkResponse setStatus(Long id, ArtworkStatus status) {
        Artwork art = findOrThrow(id);
        art.setStatus(status);
        return toResponse(artworkRepository.save(art));
    }

    // ── File upload ──────────────────────────────────────────────

    private String saveImage(MultipartFile file) {
        try {
            Path dir = Paths.get(uploadDir);
            Files.createDirectories(dir);
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), dir.resolve(filename),
                       StandardCopyOption.REPLACE_EXISTING);
            return "/" + uploadDir + "/" + filename;
        } catch (IOException e) {
            throw new BadRequestException("Failed to save image: " + e.getMessage());
        }
    }

    // ── Helpers ─────────────────────────────────────────────────

    private Artwork findOrThrow(Long id) {
        return artworkRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Artwork not found with id: " + id));
    }

    private Pageable buildPageable(int page, int size, String sort) {
        Sort s = switch (sort) {
            case "price_asc"  -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "popular"    -> Sort.by("viewCount").descending();
            default           -> Sort.by("createdAt").descending();
        };
        return PageRequest.of(page, Math.min(size, 50), s);
    }

    /** Map Artwork entity → ArtworkResponse DTO */
    public ArtworkResponse toResponse(Artwork a) {
        return ArtworkResponse.builder()
            .id(a.getId())
            .title(a.getTitle())
            .description(a.getDescription())
            .price(a.getPrice())
            .medium(a.getMedium())
            .dimensions(a.getDimensions())
            .yearCreated(a.getYearCreated())
            .imageUrl(a.getImageUrl())
            .status(a.getStatus())
            .available(a.isAvailable())
            .viewCount(a.getViewCount())
            .averageRating(a.getAverageRating())
            .reviewCount(a.getReviews() != null ? a.getReviews().size() : 0)
            .artistId(a.getArtist().getId())
            .artistName(a.getArtist().getFullName())
            .categoryId(a.getCategory() != null ? a.getCategory().getId() : null)
            .categoryName(a.getCategory() != null ? a.getCategory().getName() : null)
            .createdAt(a.getCreatedAt())
            .build();
    }
}
