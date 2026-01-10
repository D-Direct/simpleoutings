"use server";

import { db } from "@/db";
import { inquiries, properties } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { render } from "@react-email/components";
import InquiryNotificationEmail from "@/lib/email/templates/inquiry-notification";
import InquiryAutoResponseEmail from "@/lib/email/templates/inquiry-auto-response";
import { requireAuth } from "@/lib/auth";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface InquiryActionState {
  success: boolean;
  message?: string;
  error?: string;
}

// Create a new inquiry (guest-facing, no auth required)
export async function createInquiry(
  prevState: InquiryActionState,
  formData: FormData
): Promise<InquiryActionState> {
  try {
    const propertyId = formData.get("propertyId") as string;
    const guestName = formData.get("name") as string;
    const guestEmail = formData.get("email") as string;
    const guestPhone = (formData.get("phone") as string) || undefined;
    const message = formData.get("message") as string;

    // Validate required fields
    if (!propertyId || !guestName || !guestEmail || !message) {
      return {
        success: false,
        error: "Please fill in all required fields.",
      };
    }

    // Get property details for email
    const property = await db.query.properties.findFirst({
      where: eq(properties.id, propertyId),
      with: {
        owner: true,
      },
    });

    if (!property) {
      return {
        success: false,
        error: "Property not found.",
      };
    }

    // Create inquiry in database
    const [inquiry] = await db
      .insert(inquiries)
      .values({
        propertyId,
        guestName,
        guestEmail,
        guestPhone,
        message,
        status: "unread",
      })
      .returning();

    // Send email notification to property owner
    try {
      const ownerEmailHtml = await render(
        InquiryNotificationEmail({
          propertyName: property.name,
          guestName,
          guestEmail,
          guestPhone,
          message,
        })
      );

      await resend.emails.send({
        from: "SimpleOutings <inquiries@simpleoutings.com>",
        to: property.owner.email,
        subject: `New Inquiry for ${property.name}`,
        html: ownerEmailHtml,
      });
    } catch (emailError) {
      console.error("Failed to send owner notification email:", emailError);
      // Don't fail the inquiry creation if email fails
    }

    // Send auto-response to guest
    try {
      const guestEmailHtml = await render(
        InquiryAutoResponseEmail({
          guestName,
          propertyName: property.name,
          propertyEmail: property.email || undefined,
          propertyPhone: property.phone || undefined,
        })
      );

      await resend.emails.send({
        from: "SimpleOutings <noreply@simpleoutings.com>",
        to: guestEmail,
        subject: `Thank you for your inquiry - ${property.name}`,
        html: guestEmailHtml,
      });
    } catch (emailError) {
      console.error("Failed to send guest auto-response email:", emailError);
      // Don't fail the inquiry creation if email fails
    }

    return {
      success: true,
      message: "Thank you for your inquiry! We'll get back to you soon.",
    };
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return {
      success: false,
      error: "Failed to submit inquiry. Please try again.",
    };
  }
}

// Update inquiry status (owner only)
export async function updateInquiryStatus(
  inquiryId: string,
  status: "unread" | "read" | "replied"
): Promise<InquiryActionState> {
  try {
    const user = await requireAuth();

    // Get inquiry and verify ownership
    const inquiry = await db.query.inquiries.findFirst({
      where: eq(inquiries.id, inquiryId),
      with: {
        property: true,
      },
    });

    if (!inquiry) {
      return {
        success: false,
        error: "Inquiry not found.",
      };
    }

    if (inquiry.property.ownerId !== user.id) {
      return {
        success: false,
        error: "Unauthorized.",
      };
    }

    // Update status
    await db
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, inquiryId));

    return {
      success: true,
      message: "Inquiry status updated.",
    };
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return {
      success: false,
      error: "Failed to update inquiry status.",
    };
  }
}

// Delete inquiry (owner only)
export async function deleteInquiry(inquiryId: string): Promise<InquiryActionState> {
  try {
    const user = await requireAuth();

    // Get inquiry and verify ownership
    const inquiry = await db.query.inquiries.findFirst({
      where: eq(inquiries.id, inquiryId),
      with: {
        property: true,
      },
    });

    if (!inquiry) {
      return {
        success: false,
        error: "Inquiry not found.",
      };
    }

    if (inquiry.property.ownerId !== user.id) {
      return {
        success: false,
        error: "Unauthorized.",
      };
    }

    // Delete inquiry
    await db.delete(inquiries).where(eq(inquiries.id, inquiryId));

    return {
      success: true,
      message: "Inquiry deleted.",
    };
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return {
      success: false,
      error: "Failed to delete inquiry.",
    };
  }
}
