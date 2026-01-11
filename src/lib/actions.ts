"use server";

import { db } from "@/db";
import { properties, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "./auth";

export type ActionState = {
    error?: string;
    success?: boolean;
};

export async function createProperty(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const slug = formData.get("slug") as string;

    if (!name || !slug) {
        return { error: "Name and subdomain are required.", success: false };
    }

    try {
        // Get authenticated user
        const user = await requireAuth();

        // 1. Check if slug is taken
        const existing = await db.query.properties.findFirst({
            where: eq(properties.slug, slug),
        });

        if (existing) {
            return { error: "Subdomain is already taken.", success: false };
        }

        // 2. Create Property
        await db.insert(properties).values({
            name,
            description,
            slug,
            ownerId: user.id,
        });

    } catch (error) {
        console.error(error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return { error: "You must be logged in to create a property.", success: false };
        }
        return { error: "Failed to create property.", success: false };
    }

    revalidatePath("/app");
    redirect("/app");
}
export async function updateProperty(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const propertyId = formData.get("propertyId") as string;

    if (!propertyId) {
        return { error: "Property ID is required.", success: false };
    }

    try {
        // Get authenticated user
        const user = await requireAuth();

        // Verify property belongs to user
        const property = await db.query.properties.findFirst({
            where: eq(properties.id, propertyId),
        });

        if (!property) {
            return { error: "Property not found.", success: false };
        }

        if (property.ownerId !== user.id) {
            return { error: "You don't have permission to edit this property.", success: false };
        }

        // Import Cloudinary upload utility
        const { uploadToCloudinary } = await import("./cloudinary");

        // Handle image uploads
        let logoUrl: string | undefined;
        let heroImageUrl: string | undefined;
        let aboutImageUrl: string | undefined;

        const logoFile = formData.get("logo") as File | null;
        const heroImageFile = formData.get("heroImage") as File | null;
        const aboutImageFile = formData.get("aboutImage") as File | null;

        if (logoFile && logoFile.size > 0) {
            const uploadResult = await uploadToCloudinary(formData, "logo", "homestay-saas/logos");
            if (uploadResult.success && uploadResult.url) {
                logoUrl = uploadResult.url;
            } else if (uploadResult.error) {
                return { error: `Logo upload failed: ${uploadResult.error}`, success: false };
            }
        }

        if (heroImageFile && heroImageFile.size > 0) {
            const uploadResult = await uploadToCloudinary(formData, "heroImage", "homestay-saas/hero");
            if (uploadResult.success && uploadResult.url) {
                heroImageUrl = uploadResult.url;
            } else if (uploadResult.error) {
                return { error: `Hero image upload failed: ${uploadResult.error}`, success: false };
            }
        }

        if (aboutImageFile && aboutImageFile.size > 0) {
            const uploadResult = await uploadToCloudinary(formData, "aboutImage", "homestay-saas/about");
            if (uploadResult.success && uploadResult.url) {
                aboutImageUrl = uploadResult.url;
            } else if (uploadResult.error) {
                return { error: `About image upload failed: ${uploadResult.error}`, success: false };
            }
        }

        // Build update data object - only include fields that have values
        const data: Partial<typeof properties.$inferInsert> = {};

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const heroTitle = formData.get("heroTitle") as string;
        const heroSubtitle = formData.get("heroSubtitle") as string;
        const aboutTitle = formData.get("aboutTitle") as string;
        const aboutContent = formData.get("aboutContent") as string;
        const address = formData.get("address") as string;
        const phone = formData.get("phone") as string;
        const email = formData.get("email") as string;
        const whatsappNumber = formData.get("whatsappNumber") as string;
        const footerBio = formData.get("footerBio") as string;
        const connectTitle = formData.get("connectTitle") as string;
        const connectDescription = formData.get("connectDescription") as string;
        const locationAddress = formData.get("locationAddress") as string;

        if (name) data.name = name;
        if (description !== null) data.description = description || null;
        if (heroTitle !== null) data.heroTitle = heroTitle || null;
        if (heroSubtitle !== null) data.heroSubtitle = heroSubtitle || null;
        if (aboutTitle !== null) data.aboutTitle = aboutTitle || null;
        if (aboutContent !== null) data.aboutContent = aboutContent || null;
        if (address !== null) data.address = address || null;
        if (phone !== null) data.phone = phone || null;
        if (email !== null) data.email = email || null;
        if (whatsappNumber !== null) data.whatsappNumber = whatsappNumber || null;
        if (footerBio !== null) data.footerBio = footerBio || null;
        if (connectTitle !== null) data.connectTitle = connectTitle || null;
        if (connectDescription !== null) data.connectDescription = connectDescription || null;
        if (locationAddress !== null) data.locationAddress = locationAddress || null;

        // Only update image fields if new images were uploaded
        if (logoUrl) {
            data.logo = logoUrl;
        }
        if (heroImageUrl) {
            data.heroImage = heroImageUrl;
        }
        if (aboutImageUrl) {
            data.aboutImage = aboutImageUrl;
        }

        await db.update(properties)
            .set(data)
            .where(eq(properties.id, propertyId));

        revalidatePath(`/app/properties/${propertyId}`);
        revalidatePath("/"); // Also revalidate tenant sites if needed

        return { success: true };
    } catch (error) {
        console.error("Update property error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return { error: "You must be logged in to update properties.", success: false };
        }
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return { error: `Failed to update property: ${errorMessage}`, success: false };
    }
}


