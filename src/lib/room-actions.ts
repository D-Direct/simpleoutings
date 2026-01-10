"use server";

import { db } from "@/db";
import { rooms, properties } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary } from "./cloudinary";
import { requireAuth } from "./auth";

export type RoomActionState = {
  error?: string;
  success?: boolean;
};

export async function createRoom(
  propertyId: string,
  prevState: RoomActionState,
  formData: FormData
): Promise<RoomActionState> {
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
      return { error: "You don't have permission to add rooms to this property", success: false };
    }

    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const priceLKR = parseFloat(formData.get("priceLKR") as string);
    const capacity = parseInt(formData.get("capacity") as string);
    const featuresString = formData.get("features") as string;

    if (!type || !priceLKR || !capacity) {
      return { error: "Room type, price, and capacity are required", success: false };
    }

    // Parse features from comma-separated string
    const features = featuresString
      ? featuresString.split(",").map((f) => f.trim()).filter(Boolean)
      : [];

    // Handle image upload
    let imageUrl: string | null = null;
    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 0) {
      const uploadResult = await uploadToCloudinary(formData, "image", "homestay-saas/rooms");
      if (uploadResult.success && uploadResult.url) {
        imageUrl = uploadResult.url;
      } else if (uploadResult.error) {
        return { error: `Image upload failed: ${uploadResult.error}`, success: false };
      }
    }

    await db.insert(rooms).values({
      type,
      description: description || null,
      priceLKR,
      capacity,
      image: imageUrl,
      features,
      propertyId,
    });

    revalidatePath(`/app/properties/${propertyId}`);
    return { success: true };
  } catch (error) {
    console.error("Create room error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "You must be logged in to create rooms", success: false };
    }
    return { error: "Failed to create room", success: false };
  }
}

export async function updateRoom(
  roomId: string,
  prevState: RoomActionState,
  formData: FormData
): Promise<RoomActionState> {
  try {
    // Get authenticated user
    const user = await requireAuth();

    // Get room and verify ownership through property
    const room = await db.query.rooms.findFirst({
      where: eq(rooms.id, roomId),
      with: {
        property: true,
      },
    });

    if (!room) {
      return { error: "Room not found", success: false };
    }

    if (room.property.ownerId !== user.id) {
      return { error: "You don't have permission to edit this room", success: false };
    }

    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const priceLKR = parseFloat(formData.get("priceLKR") as string);
    const capacity = parseInt(formData.get("capacity") as string);
    const featuresString = formData.get("features") as string;

    if (!type || !priceLKR || !capacity) {
      return { error: "Room type, price, and capacity are required", success: false };
    }

    // Parse features from comma-separated string
    const features = featuresString
      ? featuresString.split(",").map((f) => f.trim()).filter(Boolean)
      : [];

    // Build update data
    const updateData: any = {
      type,
      description: description || null,
      priceLKR,
      capacity,
      features,
    };

    // Handle image upload if new image provided
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const uploadResult = await uploadToCloudinary(formData, "image", "homestay-saas/rooms");
      if (uploadResult.success && uploadResult.url) {
        updateData.image = uploadResult.url;
      } else if (uploadResult.error) {
        return { error: `Image upload failed: ${uploadResult.error}`, success: false };
      }
    }

    await db.update(rooms).set(updateData).where(eq(rooms.id, roomId));

    revalidatePath("/app/properties");
    return { success: true };
  } catch (error) {
    console.error("Update room error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "You must be logged in to update rooms", success: false };
    }
    return { error: "Failed to update room", success: false };
  }
}

export async function deleteRoom(roomId: string): Promise<RoomActionState> {
  try {
    // Get authenticated user
    const user = await requireAuth();

    // Get room and verify ownership through property
    const room = await db.query.rooms.findFirst({
      where: eq(rooms.id, roomId),
      with: {
        property: true,
      },
    });

    if (!room) {
      return { error: "Room not found", success: false };
    }

    if (room.property.ownerId !== user.id) {
      return { error: "You don't have permission to delete this room", success: false };
    }

    await db.delete(rooms).where(eq(rooms.id, roomId));
    revalidatePath("/app/properties");
    return { success: true };
  } catch (error) {
    console.error("Delete room error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "You must be logged in to delete rooms", success: false };
    }
    return { error: "Failed to delete room", success: false };
  }
}
