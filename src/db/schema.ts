import { pgTable, text, timestamp, doublePrecision, integer, jsonb, uniqueIndex, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Superadmin users (separate from tenant owners)
export const superadmins = pgTable("Superadmin", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull().unique(),
    name: text("name"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Regular tenant owner users
export const users = pgTable("User", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull().unique(),
    name: text("name"),
    phone: text("phone"),
    // Subscription and status
    subscriptionStatus: text("subscriptionStatus").default("active").notNull(), // active, suspended, cancelled
    subscriptionPlanId: text("subscriptionPlanId").references(() => subscriptionPlans.id),
    subscriptionStartDate: timestamp("subscriptionStartDate"),
    subscriptionEndDate: timestamp("subscriptionEndDate"),
    nextPaymentDue: timestamp("nextPaymentDue"),
    // Notes from superadmin
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// Subscription plans (monthly pricing tiers)
export const subscriptionPlans = pgTable("SubscriptionPlan", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(), // e.g., "Basic", "Pro", "Enterprise"
    description: text("description"),
    priceMonthly: doublePrecision("priceMonthly").notNull(),
    currency: text("currency").default("LKR").notNull(),
    features: jsonb("features"), // Array of feature strings
    maxProperties: integer("maxProperties").default(1).notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Payment records
export const payments = pgTable("Payment", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    amount: doublePrecision("amount").notNull(),
    currency: text("currency").default("LKR").notNull(),
    status: text("status").default("pending").notNull(), // pending, completed, failed, refunded
    paymentMethod: text("paymentMethod"), // bank_transfer, card, cash, etc.
    paymentDate: timestamp("paymentDate"),
    periodStart: timestamp("periodStart").notNull(),
    periodEnd: timestamp("periodEnd").notNull(),
    referenceNumber: text("referenceNumber"),
    notes: text("notes"),
    recordedBy: text("recordedBy").references(() => superadmins.id), // Which admin recorded it
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
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

    // Connect Section (on contact page)
    connectTitle: text("connectTitle"),
    connectDescription: text("connectDescription"),

    // Location for Google Maps
    locationAddress: text("locationAddress"), // Full address for Google Maps
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),

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
export const superadminsRelations = relations(superadmins, ({ many }) => ({
    paymentsRecorded: many(payments),
}));

export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
    users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
    properties: many(properties),
    payments: many(payments),
    subscriptionPlan: one(subscriptionPlans, {
        fields: [users.subscriptionPlanId],
        references: [subscriptionPlans.id],
    }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
    user: one(users, {
        fields: [payments.userId],
        references: [users.id],
    }),
    recordedByAdmin: one(superadmins, {
        fields: [payments.recordedBy],
        references: [superadmins.id],
    }),
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
