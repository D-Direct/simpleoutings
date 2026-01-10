"use server";

import { db } from "@/db";
import { bookings, properties } from "@/db/schema";
import { eq, and, gte, lte, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAuth } from "./auth";

export type BookingActionState = {
  error?: string;
  success?: boolean;
};

// Create a new booking (from tenant site - no auth required)
export async function createBooking(
  prevState: BookingActionState,
  formData: FormData
): Promise<BookingActionState> {
  try {
    const propertyId = formData.get("propertyId") as string;
    const checkIn = formData.get("checkIn") as string;
    const checkOut = formData.get("checkOut") as string;
    const guestName = formData.get("guestName") as string;
    const guestEmail = formData.get("guestEmail") as string;
    const guestPhone = formData.get("guestPhone") as string;
    const numberOfGuests = parseInt(formData.get("numberOfGuests") as string);
    const roomId = formData.get("roomId") as string | null;
    const specialRequests = formData.get("specialRequests") as string;

    if (!propertyId || !checkIn || !checkOut || !guestName || !guestPhone) {
      return { error: "Please fill in all required fields", success: false };
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return { error: "Check-out date must be after check-in date", success: false };
    }

    if (checkInDate < new Date()) {
      return { error: "Check-in date cannot be in the past", success: false };
    }

    // Check for overlapping bookings
    const overlappingBookings = await db.query.bookings.findMany({
      where: and(
        eq(bookings.propertyId, propertyId),
        roomId ? eq(bookings.roomId, roomId) : undefined,
        or(
          and(
            gte(bookings.checkIn, checkInDate),
            lte(bookings.checkIn, checkOutDate)
          ),
          and(
            gte(bookings.checkOut, checkInDate),
            lte(bookings.checkOut, checkOutDate)
          ),
          and(
            lte(bookings.checkIn, checkInDate),
            gte(bookings.checkOut, checkOutDate)
          )
        ),
        eq(bookings.status, "CONFIRMED")
      ),
    });

    if (overlappingBookings.length > 0) {
      return { error: "Selected dates are not available", success: false };
    }

    await db.insert(bookings).values({
      propertyId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guestName,
      guestEmail: guestEmail || null,
      guestPhone,
      numberOfGuests: numberOfGuests || 1,
      roomId: roomId || null,
      specialRequests: specialRequests || null,
      status: "PENDING",
    });

    revalidatePath(`/app/properties/${propertyId}`);
    return { success: true };
  } catch (error) {
    console.error("Create booking error:", error);
    return { error: "Failed to create booking", success: false };
  }
}

// Update booking status (owner only)
export async function updateBookingStatus(
  bookingId: string,
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
): Promise<BookingActionState> {
  try {
    const user = await requireAuth();

    // Get booking and verify ownership through property
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
      with: {
        property: true,
      },
    });

    if (!booking) {
      return { error: "Booking not found", success: false };
    }

    if (booking.property.ownerId !== user.id) {
      return { error: "You don't have permission to update this booking", success: false };
    }

    await db.update(bookings)
      .set({ status })
      .where(eq(bookings.id, bookingId));

    revalidatePath(`/app/properties/${booking.propertyId}`);
    return { success: true };
  } catch (error) {
    console.error("Update booking status error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "You must be logged in to update bookings", success: false };
    }
    return { error: "Failed to update booking status", success: false };
  }
}

// Delete booking (owner only)
export async function deleteBooking(bookingId: string): Promise<BookingActionState> {
  try {
    const user = await requireAuth();

    // Get booking and verify ownership through property
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
      with: {
        property: true,
      },
    });

    if (!booking) {
      return { error: "Booking not found", success: false };
    }

    if (booking.property.ownerId !== user.id) {
      return { error: "You don't have permission to delete this booking", success: false };
    }

    await db.delete(bookings).where(eq(bookings.id, bookingId));

    revalidatePath(`/app/properties/${booking.propertyId}`);
    return { success: true };
  } catch (error) {
    console.error("Delete booking error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "You must be logged in to delete bookings", success: false };
    }
    return { error: "Failed to delete booking", success: false };
  }
}

// Check availability for date range
export async function checkAvailability(
  propertyId: string,
  checkIn: string,
  checkOut: string,
  roomId?: string
): Promise<{ available: boolean; message?: string }> {
  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const overlappingBookings = await db.query.bookings.findMany({
      where: and(
        eq(bookings.propertyId, propertyId),
        roomId ? eq(bookings.roomId, roomId) : undefined,
        or(
          and(
            gte(bookings.checkIn, checkInDate),
            lte(bookings.checkIn, checkOutDate)
          ),
          and(
            gte(bookings.checkOut, checkInDate),
            lte(bookings.checkOut, checkOutDate)
          ),
          and(
            lte(bookings.checkIn, checkInDate),
            gte(bookings.checkOut, checkOutDate)
          )
        ),
        eq(bookings.status, "CONFIRMED")
      ),
    });

    if (overlappingBookings.length > 0) {
      return {
        available: false,
        message: "Selected dates are not available"
      };
    }

    return { available: true };
  } catch (error) {
    console.error("Check availability error:", error);
    return {
      available: false,
      message: "Error checking availability"
    };
  }
}
