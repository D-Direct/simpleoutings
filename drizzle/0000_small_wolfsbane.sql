CREATE TABLE "Amenity" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"description" text,
	"propertyId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Booking" (
	"id" text PRIMARY KEY NOT NULL,
	"checkIn" timestamp NOT NULL,
	"checkOut" timestamp NOT NULL,
	"guestName" text NOT NULL,
	"guestPhone" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"propertyId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "GalleryImage" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"alt" text,
	"propertyId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Property" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"customDomain" text,
	"description" text,
	"heroTitle" text,
	"heroSubtitle" text,
	"heroImage" text,
	"aboutTitle" text,
	"aboutContent" text,
	"aboutImage" text,
	"address" text,
	"phone" text,
	"email" text,
	"footerBio" text,
	"socialLinks" jsonb,
	"logo" text,
	"images" text[],
	"ownerId" text NOT NULL,
	"themeConfig" jsonb,
	CONSTRAINT "Property_slug_unique" UNIQUE("slug"),
	CONSTRAINT "Property_customDomain_unique" UNIQUE("customDomain")
);
--> statement-breakpoint
CREATE TABLE "Room" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"priceLKR" double precision NOT NULL,
	"capacity" integer NOT NULL,
	"image" text,
	"features" text[],
	"propertyId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Testimonial" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"author" text NOT NULL,
	"location" text,
	"propertyId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "Amenity" ADD CONSTRAINT "Amenity_propertyId_Property_id_fk" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_propertyId_Property_id_fk" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_propertyId_Property_id_fk" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_User_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Room" ADD CONSTRAINT "Room_propertyId_Property_id_fk" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_propertyId_Property_id_fk" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "property_slug_idx" ON "Property" USING btree ("slug");