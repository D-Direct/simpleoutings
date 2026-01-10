import { pgTable, text, timestamp, doublePrecision, integer, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("User", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull().unique(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const properties = pgTable("Property", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    customDomain: text("customDomain").unique(),
    description: text("description"),

    // Hero Section
    heroTitle: text("heroTitle"),
    heroSubtitle: text("heroSubtitle"),
    heroImage: text("heroImage"),

    // About Section
    aboutTitle: text("aboutTitle"),
    aboutContent: text("aboutContent"),
    aboutImage: text("aboutImage"),

    // Contact & Footer
    address: text("address"),
    phone: text("phone"),
    email: text("email"),
    footerBio: text("footerBio"),
    socialLinks: jsonb("socialLinks"), // { facebook: string, instagram: string, x: string }

    logo: text("logo"),
    images: text("images").array(),
    ownerId: text("ownerId").notNull().references(() => users.id),
    themeConfig: jsonb("themeConfig"),
}, (table) => {
    return [
        uniqueIndex("property_slug_idx").on(table.slug),
    ];
});

export const amenities = pgTable("Amenity", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    icon: text("icon"), // String identifier for lucide icons
    description: text("description"),
    propertyId: text("propertyId").notNull().references(() => properties.id),
});

export const testimonials = pgTable("Testimonial", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    content: text("content").notNull(),
    author: text("author").notNull(),
    location: text("location"),
    propertyId: text("propertyId").notNull().references(() => properties.id),
});

export const galleryImages = pgTable("GalleryImage", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    url: text("url").notNull(),
    alt: text("alt"),
    propertyId: text("propertyId").notNull().references(() => properties.id),
});

export const rooms = pgTable("Room", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    type: text("type").notNull(), // e.g., "Deluxe Room", "Standard Room", "Suite"
    description: text("description"), // Room description/features
    priceLKR: doublePrecision("priceLKR").notNull(),
    capacity: integer("capacity").notNull(), // Number of guests
    image: text("image"), // Room image URL (Cloudinary)
    features: text("features").array(), // ["King Bed", "Ocean View", "Private Balcony"]
    propertyId: text("propertyId").notNull().references(() => properties.id, { onDelete: "cascade" }),
});

export const bookings = pgTable("Booking", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    checkIn: timestamp("checkIn").notNull(),
    checkOut: timestamp("checkOut").notNull(),
    guestName: text("guestName").notNull(),
    guestEmail: text("guestEmail"),
    guestPhone: text("guestPhone").notNull(),
    numberOfGuests: integer("numberOfGuests").default(1).notNull(),
    roomId: text("roomId").references(() => rooms.id),
    specialRequests: text("specialRequests"),
    status: text("status").default("PENDING").notNull(), // PENDING, CONFIRMED, CANCELLED, COMPLETED
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    propertyId: text("propertyId").notNull().references(() => properties.id, { onDelete: "cascade" }),
});

export const inquiries = pgTable("Inquiry", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    propertyId: text("propertyId").notNull().references(() => properties.id, { onDelete: "cascade" }),
    guestName: text("guestName").notNull(),
    guestEmail: text("guestEmail").notNull(),
    guestPhone: text("guestPhone"),
    message: text("message").notNull(),
    status: text("status").notNull().default("unread"), // "unread" | "read" | "replied"
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    properties: many(properties),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
    owner: one(users, {
        fields: [properties.ownerId],
        references: [users.id],
    }),
    rooms: many(rooms),
    bookings: many(bookings),
    inquiries: many(inquiries),
    amenities: many(amenities),
    testimonials: many(testimonials),
    galleryImages: many(galleryImages),
}));

export const amenitiesRelations = relations(amenities, ({ one }) => ({
    property: one(properties, {
        fields: [amenities.propertyId],
        references: [properties.id],
    }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
    property: one(properties, {
        fields: [testimonials.propertyId],
        references: [properties.id],
    }),
}));

export const galleryImagesRelations = relations(galleryImages, ({ one }) => ({
    property: one(properties, {
        fields: [galleryImages.propertyId],
        references: [properties.id],
    }),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
    property: one(properties, {
        fields: [rooms.propertyId],
        references: [properties.id],
    }),
    bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
    property: one(properties, {
        fields: [bookings.propertyId],
        references: [properties.id],
    }),
    room: one(rooms, {
        fields: [bookings.roomId],
        references: [rooms.id],
    }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
    property: one(properties, {
        fields: [inquiries.propertyId],
        references: [properties.id],
    }),
}));
