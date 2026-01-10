"use server";

import { db } from "@/db";
import { amenities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type AmenityActionState = {
    error?: string;
    success?: boolean;
};

export async function createAmenity(
    propertyId: string,
    prevState: AmenityActionState,
    formData: FormData
): Promise<AmenityActionState> {
    const name = formData.get("name") as string;
    const icon = formData.get("icon") as string;
    const description = formData.get("description") as string;

    if (!name) {
        return { error: "Amenity name is required.", success: false };
    }

    try {
        await db.insert(amenities).values({
            name,
            icon: icon || null,
            description: description || null,
            propertyId,
        });

        revalidatePath(`/app/properties/${propertyId}`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "Failed to create amenity.", success: false };
    }
}

export async function updateAmenity(
    amenityId: string,
    prevState: AmenityActionState,
    formData: FormData
): Promise<AmenityActionState> {
    const name = formData.get("name") as string;
    const icon = formData.get("icon") as string;
    const description = formData.get("description") as string;

    if (!name) {
        return { error: "Amenity name is required.", success: false };
    }

    try {
        await db.update(amenities)
            .set({
                name,
                icon: icon || null,
                description: description || null,
            })
            .where(eq(amenities.id, amenityId));

        revalidatePath("/app/properties");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "Failed to update amenity.", success: false };
    }
}

export async function deleteAmenity(amenityId: string): Promise<AmenityActionState> {
    try {
        await db.delete(amenities).where(eq(amenities.id, amenityId));
        revalidatePath("/app/properties");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "Failed to delete amenity.", success: false };
    }
}
