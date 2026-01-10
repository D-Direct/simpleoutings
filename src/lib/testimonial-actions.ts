"use server";

import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type TestimonialActionState = {
    error?: string;
    success?: boolean;
};

export async function createTestimonial(
    propertyId: string,
    prevState: TestimonialActionState,
    formData: FormData
): Promise<TestimonialActionState> {
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;
    const location = formData.get("location") as string;

    if (!content || !author) {
        return { error: "Content and author name are required.", success: false };
    }

    try {
        await db.insert(testimonials).values({
            content,
            author,
            location: location || null,
            propertyId,
        });

        revalidatePath(`/app/properties/${propertyId}`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "Failed to create testimonial.", success: false };
    }
}

export async function deleteTestimonial(testimonialId: string): Promise<TestimonialActionState> {
    try {
        await db.delete(testimonials).where(eq(testimonials.id, testimonialId));
        revalidatePath("/app/properties");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "Failed to delete testimonial.", success: false };
    }
}
