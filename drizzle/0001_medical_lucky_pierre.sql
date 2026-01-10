CREATE TABLE "Inquiry" (
	"id" text PRIMARY KEY NOT NULL,
	"propertyId" text NOT NULL,
	"guestName" text NOT NULL,
	"guestEmail" text NOT NULL,
	"guestPhone" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'unread' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Payment" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"amount" double precision NOT NULL,
	"currency" text DEFAULT 'LKR' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"paymentMethod" text,
	"paymentDate" timestamp,
	"periodStart" timestamp NOT NULL,
	"periodEnd" timestamp NOT NULL,
	"referenceNumber" text,
	"notes" text,
	"recordedBy" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SubscriptionPlan" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"priceMonthly" double precision NOT NULL,
	"currency" text DEFAULT 'LKR' NOT NULL,
	"features" jsonb,
	"maxProperties" integer DEFAULT 1 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Superadmin" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Superadmin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_propertyId_Property_id_fk";
--> statement-breakpoint
ALTER TABLE "Booking" ADD COLUMN "guestEmail" text;--> statement-breakpoint
ALTER TABLE "Booking" ADD COLUMN "numberOfGuests" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "Booking" ADD COLUMN "roomId" text;--> statement-breakpoint
ALTER TABLE "Booking" ADD COLUMN "specialRequests" text;--> statement-breakpoint
ALTER TABLE "Booking" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "subscriptionStatus" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "subscriptionPlanId" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "subscriptionStartDate" timestamp;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "subscriptionEndDate" timestamp;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "nextPaymentDue" timestamp;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_propertyId_Property_id_fk" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_recordedBy_Superadmin_id_fk" FOREIGN KEY ("recordedBy") REFERENCES "public"."Superadmin"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_Room_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_propertyId_Property_id_fk" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_subscriptionPlanId_SubscriptionPlan_id_fk" FOREIGN KEY ("subscriptionPlanId") REFERENCES "public"."SubscriptionPlan"("id") ON DELETE no action ON UPDATE no action;