# 🎨 Online Art Gallery — Full-Stack Application

A complete full-stack art gallery platform built with **HTML/CSS/JavaScript** (frontend) and **Java Spring Boot** (backend) with **MySQL** database.

---

## 🗂️ Project Structure

```
Product website/
├── OnlineArtGallery/              ← Frontend (open index.html in browser)
│   ├── index.html                 ← Home page
│   ├── gallery.html               ← Art collection with filters
│   ├── categories.html            ← Browse by category
│   ├── exhibition.html            ← Exhibitions
│   ├── workshop.html              ← Workshops
│   ├── about.html                 ← About + Contact
│   ├── login.html                 ← Login
│   ├── register.html              ← Register
│   ├── dashboard.html             ← User dashboard (orders, wishlist, cart)
│   ├── artist-upload.html         ← Artist artwork upload
│   ├── admin.html                 ← Admin control panel
│   ├── css/
│   │   ├── style.css              ← Global design system
│   │   ├── home.css
│   │   ├── gallery.css
│   │   ├── auth.css
│   │   ├── about.css
│   │   └── dashboard.css
│   └── js/
│       ├── main.js                ← Core: auth helpers, API fetch, toast, mock data
│       ├── home.js
│       ├── gallery.js
│       ├── auth.js
│       ├── dashboard.js
│       ├── artist.js
│       └── admin.js
│
└── OnlineArtGalleryBackend/       ← Spring Boot Backend
    ├── pom.xml
    └── src/main/java/com/artgallery/
        ├── ArtGalleryApplication.java
        ├── config/                ← SecurityConfig, WebConfig
        ├── controller/            ← REST endpoints
        ├── service/               ← Business logic
        ├── repository/            ← JPA repositories
        ├── model/                 ← JPA entities
        ├── dto/                   ← Request/response DTOs
        ├── security/              ← JWT: token provider, filter, UserDetailsService
        └── exception/             ← Global exception handler
```

---

## 🚀 Quick Start

### 1. Database Setup (MySQL)

```sql
CREATE DATABASE art_gallery_db;
```

### 2. Configure Backend

Edit `OnlineArtGalleryBackend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/art_gallery_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE
```

### 3. Run Backend

```bash
cd OnlineArtGalleryBackend
mvn spring-boot:run
```

The API will start at: **http://localhost:8080**

### 4. Run Frontend

Open `OnlineArtGallery/index.html` in your browser, or serve with VS Code Live Server (port 5500).

---

## 🔐 Default Test Accounts

| Role     | Email                     | Password      |
|----------|---------------------------|---------------|
| Admin    | admin@artgallery.com      | password123   |
| Artist   | elena@artgallery.com      | password123   |
| Artist   | marcus@artgallery.com     | password123   |
| Customer | john@example.com          | password123   |
| Customer | jane@example.com          | password123   |

---

## 📡 REST API Endpoints

### Authentication
| Method | Endpoint             | Description         | Auth  |
|--------|----------------------|---------------------|-------|
| POST   | /api/auth/register   | Register new user   | None  |
| POST   | /api/auth/login      | Login → JWT token   | None  |

### Artworks
| Method | Endpoint                    | Description              | Auth         |
|--------|-----------------------------|--------------------------|--------------|
| GET    | /api/artworks               | List (paginated)         | None         |
| GET    | /api/artworks/search        | Search & filter          | None         |
| GET    | /api/artworks/{id}          | Get single artwork       | None         |
| POST   | /api/artworks               | Create artwork           | Artist/Admin |
| PUT    | /api/artworks/{id}          | Update artwork           | Artist/Admin |
| DELETE | /api/artworks/{id}          | Delete artwork           | Artist/Admin |
| PATCH  | /api/artworks/{id}/status   | Approve/Reject           | Admin only   |

### Cart & Orders
| Method | Endpoint              | Description          | Auth     |
|--------|-----------------------|----------------------|----------|
| GET    | /api/cart             | Get cart             | User     |
| POST   | /api/cart/{id}        | Add to cart          | User     |
| DELETE | /api/cart/{id}        | Remove from cart     | User     |
| POST   | /api/orders/checkout  | Checkout             | User     |
| GET    | /api/orders           | My orders            | User     |

### Wishlist
| Method | Endpoint                | Auth |
|--------|-------------------------|------|
| GET    | /api/wishlist           | User |
| POST   | /api/wishlist/{id}      | User |
| DELETE | /api/wishlist/{id}      | User |

### Reviews
| Method | Endpoint                       | Auth |
|--------|--------------------------------|------|
| GET    | /api/reviews/artwork/{id}      | None |
| POST   | /api/reviews                   | User |
| DELETE | /api/reviews/{id}              | User |

### Admin
| Method | Endpoint                     | Description           |
|--------|------------------------------|-----------------------|
| GET    | /api/admin/stats             | Dashboard stats       |
| GET    | /api/admin/users             | All users             |
| PATCH  | /api/admin/users/{id}/activate | Toggle user status  |
| GET    | /api/admin/artworks/pending  | Pending artworks      |
| PATCH  | /api/admin/artworks/{id}/approve | Approve artwork   |
| PATCH  | /api/admin/artworks/{id}/reject  | Reject artwork    |
| GET    | /api/admin/orders            | All orders            |
| PATCH  | /api/admin/orders/{id}/status | Update order status  |

---

## 🎨 UI Pages & Features

| Page              | Features |
|-------------------|----------|
| **Home**          | Hero + search, featured artworks, categories strip, exhibitions preview, stats counter |
| **Gallery**       | Grid/list view, sidebar filters (category, price, medium), pagination, artwork detail modal |
| **Categories**    | Category cards, click to browse artworks in that category |
| **Exhibition**    | Filter by status (upcoming/ongoing/past), registration |
| **Workshop**      | Workshop listings, booking, level filtering |
| **About**         | About content, team, vision, contact form |
| **Login**         | JWT auth, demo fallback mode |
| **Register**      | Validation, role selection (collector/artist) |
| **Dashboard**     | Orders, wishlist, cart, reviews (star rating), profile |
| **Artist Upload** | Drag-and-drop image upload, artwork form, my artworks table |
| **Admin**         | Stats, revenue chart, artwork approval, user/order management |

---

## ⚙️ Technology Stack

**Frontend**
- HTML5 + Vanilla CSS (CSS variables, grid, flex)
- Vanilla JavaScript (ES6+ modules, fetch API)
- Google Fonts (Inter + Outfit)
- LocalStorage for cart/wishlist (until backend connected)

**Backend**
- Java 17
- Spring Boot 3.2
- Spring Security (JWT via JJWT 0.12)
- Spring Data JPA + Hibernate
- MySQL 8
- Lombok
- Maven

---

## 📝 Notes

- The frontend works **standalone** with mock data even without the backend running
- To connect frontend → backend, ensure CORS `app.cors.allowed-origins` includes your frontend URL
- Image uploads are stored locally at `uploads/artworks/` in the backend directory
- For production, switch `spring.jpa.hibernate.ddl-auto=validate` and use cloud storage for images
