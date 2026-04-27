package com.artgallery.controller;

import com.artgallery.dto.*;
import com.artgallery.model.enums.ArtworkStatus;
import com.artgallery.service.ArtworkService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

/**
 * REST endpoints for artwork management
 *
 * GET    /api/artworks              — paginated list (public)
 * GET    /api/artworks/search       — search & filter (public)
 * GET    /api/artworks/{id}         — single artwork (public)
 * POST   /api/artworks              — create (ARTIST / ADMIN)
 * PUT    /api/artworks/{id}         — update (ARTIST / ADMIN)
 * DELETE /api/artworks/{id}         — delete (ARTIST / ADMIN)
 * PATCH  /api/artworks/{id}/status  — approve/reject (ADMIN)
 */
@RestController
@RequestMapping("/api/artworks")
@RequiredArgsConstructor
public class ArtworkController {

    private final ArtworkService artworkService;

    // ── Public ──────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<Page<ArtworkResponse>> list(
            @RequestParam(defaultValue = "0")       int    page,
            @RequestParam(defaultValue = "12")      int    size,
            @RequestParam(defaultValue = "newest")  String sort) {
        return ResponseEntity.ok(artworkService.getActiveArtworks(page, size, sort));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ArtworkResponse>> search(
            @RequestParam(required = false) String     q,
            @RequestParam(required = false) Long       categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0")          int    page,
            @RequestParam(defaultValue = "12")         int    size,
            @RequestParam(defaultValue = "newest")     String sort) {
        return ResponseEntity.ok(artworkService.search(q, categoryId, minPrice, maxPrice, page, size, sort));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtworkResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(artworkService.getById(id));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ARTIST','ADMIN')")
    public ResponseEntity<Page<ArtworkResponse>> getMyArtworks(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(artworkService.getMyArtworks(principal.getUsername(), page, size));
    }


    // ── Artist / Admin ───────────────────────────────────────────

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ARTIST','ADMIN')")
    public ResponseEntity<ArtworkResponse> create(
            @RequestParam String title,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String medium,
            @RequestParam(required = false) String dimensions,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Long   category,
            @RequestParam(defaultValue = "true") boolean available,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails principal) {
        ArtworkRequest req = buildRequest(title, price, description, medium, dimensions, year, category, available);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(artworkService.create(principal.getUsername(), req, image));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ARTIST','ADMIN')")
    public ResponseEntity<ArtworkResponse> update(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String medium,
            @RequestParam(required = false) String dimensions,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Long   category,
            @RequestParam(defaultValue = "true") boolean available,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails principal) {
        ArtworkRequest req = buildRequest(title, price, description, medium, dimensions, year, category, available);
        return ResponseEntity.ok(artworkService.update(id, principal.getUsername(), req, image));
    }

    private ArtworkRequest buildRequest(String title, BigDecimal price, String desc,
                                        String medium, String dimensions, Integer year,
                                        Long categoryId, boolean available) {
        ArtworkRequest req = new ArtworkRequest();
        req.setTitle(title);
        req.setPrice(price);
        req.setDescription(desc);
        req.setMedium(medium);
        req.setDimensions(dimensions);
        req.setYearCreated(year);
        req.setCategoryId(categoryId);
        req.setAvailable(available);
        return req;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ARTIST','ADMIN')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        artworkService.delete(id, principal.getUsername());
        return ResponseEntity.noContent().build();
    }

    // ── Admin only ───────────────────────────────────────────────

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ArtworkResponse> setStatus(
            @PathVariable Long id,
            @RequestParam ArtworkStatus status) {
        return ResponseEntity.ok(artworkService.setStatus(id, status));
    }
}

