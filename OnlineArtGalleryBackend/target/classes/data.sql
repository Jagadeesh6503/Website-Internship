-- ================================================================
--  Online Art Gallery — MySQL Seed Data
-- ================================================================

-- ADMIN USER (password: Admin@123)
INSERT IGNORE INTO users (id,first_name,last_name,email,password,role,country,bio) VALUES
(1,'Admin','User','admin@artvault.com','$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE36mggNv14K/NZCK','ADMIN','India','Platform Administrator'),
(2,'Priya','Sharma','priya@artvault.com','$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE36mggNv14K/NZCK','ARTIST','India','Impressionist painter with 15 years of experience. Known for vibrant landscapes and portraits.'),
(3,'Arjun','Mehta','arjun@artvault.com','$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE36mggNv14K/NZCK','ARTIST','India','Digital artist and illustrator. Creating immersive digital worlds since 2015.'),
(4,'Kavya','Nair','kavya@artvault.com','$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE36mggNv14K/NZCK','ARTIST','India','Award-winning photographer capturing the essence of urban life and human emotion.'),
(5,'Rohan','Das','rohan@artvault.com','$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE36mggNv14K/NZCK','ARTIST','India','Sculptor working in bronze and marble. Classical training with a contemporary vision.'),
(6,'Demo','Collector','demo@artvault.com','$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE36mggNv14K/NZCK','COLLECTOR','India','Art enthusiast and collector.'),
(7,'Meena','Pillai','meena@artvault.com','$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE36mggNv14K/NZCK','ARTIST','India','Watercolor artist inspired by nature and Indian mythology.'),
(8,'Sanjay','Kumar','sanjay@artvault.com','$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE36mggNv14K/NZCK','ARTIST','India','Abstract expressionist pushing the boundaries of color and form.');

-- CATEGORIES
INSERT IGNORE INTO categories (id,name,description) VALUES
(1,'Painting','Original paintings in various styles and mediums'),
(2,'Sculpture','Three-dimensional artworks in various materials'),
(3,'Photography','Fine art photography prints and limited editions'),
(4,'Digital Art','Computer-generated and digital illustrations'),
(5,'Watercolor','Delicate watercolor paintings on paper'),
(6,'Abstract','Non-representational abstract artworks'),
(7,'Prints','Limited edition prints and lithographs');

-- ARTWORKS
INSERT IGNORE INTO artworks (id,title,description,artist_id,category_id,medium,style,width_cm,height_cm,year_created,price,image_url,tags,listing_type,status,is_featured,view_count) VALUES
(1,'Sunset Reverie','A breathtaking impressionist painting capturing the golden hour over the Ganges river. Oil paint applied in thick, expressive strokes that evoke warmth and tranquility.',2,1,'Oil on Canvas','Impressionism',80,60,2024,45000,'https://picsum.photos/seed/art10/400/500','nature,landscape,impressionism,golden','SALE','APPROVED',TRUE,1234),
(2,'Digital Cosmos','An immersive digital artwork exploring the vastness of the universe through geometric patterns and vibrant nebula colors.',3,4,'Digital','Abstract',NULL,NULL,2024,22500,'https://picsum.photos/seed/art11/400/600','digital,space,abstract,colorful','SALE','APPROVED',TRUE,892),
(3,'Urban Soul','A series of photographs capturing the raw energy and beauty of Mumbai street life at dawn.',4,3,'Digital Photography','Contemporary',NULL,NULL,2023,18000,'https://picsum.photos/seed/art12/400/450','photography,urban,street,mumbai','SALE','APPROVED',FALSE,645),
(4,'Ancient Whispers','A monumental bronze sculpture depicting the interplay between ancient wisdom and modern chaos. Cast using traditional lost-wax technique.',5,2,'Bronze','Realism',45,80,2023,120000,'https://picsum.photos/seed/art13/400/520','sculpture,bronze,classical,india','SALE','APPROVED',TRUE,2341),
(5,'Monsoon Dreams','Delicate watercolor washes capturing the first monsoon rains over Kerala backwaters. A study in blues and greens.',7,5,'Watercolor','Impressionism',50,35,2024,12000,'https://picsum.photos/seed/art14/400/480','watercolor,monsoon,kerala,nature','SALE','APPROVED',FALSE,421),
(6,'Abstract Pulse','An energetic abstract canvas exploring rhythm through bold color blocks and gestural marks. Inspired by Indian classical music.',8,6,'Acrylic','Abstract',100,120,2024,35000,'https://picsum.photos/seed/art15/400/560','abstract,music,bold,colorful','AUCTION','APPROVED',TRUE,1567),
(7,'Temple Echoes','A realistic painting of the Brihadeeswarar Temple at sunrise, capturing the interplay of ancient stone and morning light.',2,1,'Oil on Canvas','Realism',90,70,2023,68000,'https://picsum.photos/seed/art16/400/510','temple,india,heritage,realistic','SALE','APPROVED',FALSE,789),
(8,'Neon Jungle','A vibrant digital illustration merging urban cityscape with tropical jungle elements in a neon cyberpunk aesthetic.',3,4,'Digital','Contemporary',NULL,NULL,2025,15000,'https://picsum.photos/seed/art17/400/490','digital,neon,cyberpunk,nature','SALE','APPROVED',FALSE,334),
(9,'Coastal Serenity','An acrylic painting of the Goa coastline during golden hour, with warm tones and visible brushwork.',2,1,'Acrylic','Impressionism',70,50,2024,28000,'https://picsum.photos/seed/art18/400/540','coastal,goa,beach,golden','SALE','APPROVED',FALSE,956),
(10,'Fractured Light','A large-scale mixed media piece exploring how light fractures through prisms of modern life.',8,6,'Mixed Media','Abstract',150,100,2024,52000,'https://picsum.photos/seed/art19/400/470','abstract,light,mixed-media,large','AUCTION','APPROVED',TRUE,1123),
(11,'Village Morning','A warm, realistic painting of a rural Indian village waking up to the morning sun.',2,1,'Oil on Canvas','Realism',60,45,2023,39000,'https://picsum.photos/seed/art20/400/520','village,india,rural,morning','SALE','APPROVED',FALSE,567),
(12,'Cyber Dreams','A digital artwork exploring the intersection of human consciousness and artificial intelligence.',3,4,'Digital','Contemporary',NULL,NULL,2025,17500,'https://picsum.photos/seed/art21/400/490','digital,ai,cyberpunk,consciousness','SALE','APPROVED',FALSE,834);

-- EXHIBITIONS
INSERT IGNORE INTO exhibitions (id,title,description,location,start_date,end_date,capacity,registered_count,ticket_price,status) VALUES
(1,'Colors of India','A vibrant showcase of traditional and modern Indian art forms celebrating the diversity of our cultural heritage.','Mumbai Gallery','2025-06-15','2025-06-20',200,145,0,'UPCOMING'),
(2,'Abstract Dimensions','Explore the boundaries of abstract expressionism with 40 international artists in an immersive virtual and physical exhibition.','Virtual + Delhi','2025-05-01','2025-05-30',500,380,500,'ONGOING'),
(3,'Digital Frontier','Where technology meets art — an immersive digital art experience featuring interactive installations.','Bangalore Convention Center','2025-07-10','2025-07-15',350,92,300,'UPCOMING'),
(4,'Sculpted Visions','A retrospective of Indian sculpture from classical to contemporary, featuring 60+ artists.','Chennai National Museum','2025-02-10','2025-03-10',200,200,200,'PAST');

-- AUCTIONS
INSERT IGNORE INTO auctions (id,artwork_id,start_price,current_bid,min_increment,start_time,end_time,status,bid_count) VALUES
(1,6,25000,52000,500,'2025-04-27 09:00:00','2025-04-27 21:00:00','LIVE',14),
(2,10,40000,67000,1000,'2025-04-27 08:00:00','2025-04-28 08:00:00','LIVE',21),
(3,4,100000,145000,2000,'2025-04-28 10:00:00','2025-04-29 10:00:00','UPCOMING',0);

-- WORKSHOPS
INSERT IGNORE INTO workshops (id,title,description,instructor_id,instructor_name,category,level,duration,schedule,mode,location,total_seats,enrolled_count,price,rating) VALUES
(1,'Oil Painting Masterclass','Learn professional oil painting techniques from composition to finishing.',2,'Priya Sharma','Painting','INTERMEDIATE','8 Weeks','Sat & Sun 10AM-1PM','IN_PERSON','Mumbai Studio',20,14,8500,4.9),
(2,'Digital Art Fundamentals','Start your digital art journey with industry-standard tools and techniques.',3,'Arjun Mehta','Digital','BEGINNER','4 Weeks','Mon, Wed, Fri 6PM','ONLINE','Zoom',30,28,4200,4.7),
(3,'Portrait Photography','Master the art of portrait photography — lighting, composition, and post-processing.',4,'Kavya Nair','Photography','BEGINNER','2 Days','June 14-15, 9AM-5PM','IN_PERSON','Bangalore',15,9,5000,4.8);

-- NEWSLETTER SUBSCRIBERS
INSERT IGNORE INTO newsletter_subscribers (email,name) VALUES
('art@example.com','Art Lover'),
('collector@example.com','Jane Collector');
