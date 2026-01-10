"use server";

import { db } from "@/db";
import { galleryImages, properties } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary, deleteFromCloudinary } from "./cloudinary";
import { requireAuth } from "./auth";

export type GalleryActionState = {
    error?: string;
    success?: boolean;
};

export async function uploadGalleryImage(
    propertyId: string,
    prevState: GalleryActionState,
    formData: FormData
): Promise<GalleryActionState> {
    const alt = formData.get("alt") as string;

    try {
        // Get authenticated user
        const user = await requireAuth();

        // Verify property belongs to user
        const property = await db.query.properties.findFirst({
            where: eq(properties.id, propertyId),
        });

        if (!property) {
            return { error: "Property not found", success: false };
        }

        if (property.ownerId !== user.id) {
            return { error: "You don't have permission to add images to this property", success: false };
        }

        const uploadResult = await uploadToCloudinary(formData, "image", "homestay-saas/gallery");

        if (!uploadResult.success || !uploadResult.url) {
            return { error: uploadResult.error || "Failed to upload image", success: false };
        }

        await db.insert(galleryImages).values({
            url: uploadResult.url,
            alt: alt || null,
            propertyId,
        });

        revalidatePath(`/app/properties/${propertyId}`);
        return { success: true };
    } catch (error) {
        console.error(error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return { error: "You must be logged in to upload images", success: false };
        }
        return { error: "Failed to upload gallery image.", success: false };
    }
}

export async function deleteGalleryImage(imageId: string): Promise<GalleryActionState> {
    try {
        // Get authenticated user
        const user = await requireAuth();

        // Get the image and verify ownership through property
        const image = await db.query.galleryImages.findFirst({
            where: eq(galleryImages.id, imageId),
            with: {
                property: true,
            },
        });

        if (!image) {
            return { error: "Image not found", success: false };
        }

        if (image.property.ownerId !== user.id) {
            return { error: "You don't have permission to delete this image", success: false };
        }

        if (image && image.url.includes("cloudinary.com")) {
            // Only delete from Cloudinary if it's a Cloudinary URL
            await deleteFromCloudinary(image.url);
        }

        await db.delete(galleryImages).where(eq(galleryImages.id, imageId));
        revalidatePath("/app/properties");
        return { success: true };
    } catch (error) {
        console.error(error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return { error: "You must be logged in to delete images", success: false };
        }
        return { error: "Failed to delete gallery image.", success: false };
    }
}
