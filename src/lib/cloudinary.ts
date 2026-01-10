"use server";

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export type UploadResult = {
  success: boolean;
  url?: string;
  error?: string;
};

/**
 * Upload an image to Cloudinary
 * @param formData - FormData containing the image file
 * @param fieldName - Name of the form field containing the file
 * @param folder - Optional folder in Cloudinary (default: "homestay-saas")
 * @returns Upload result with URL or error
 */
export async function uploadToCloudinary(
  formData: FormData,
  fieldName: string,
  folder: string = "homestay-saas"
): Promise<UploadResult> {
  try {
    const file = formData.get(fieldName) as File | null;

    console.log(`Cloudinary upload attempt for field: ${fieldName}`);
    console.log(`File size:`, file?.size);
    console.log(`File type:`, file?.type);

    // Validate file exists
    if (!file || file.size === 0) {
      console.log("No file provided or empty file");
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      console.log(`Invalid file type: ${file.type}`);
      return {
        success: false,
        error: "Invalid file type. Only JPEG, PNG, and WebP are allowed.",
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.log(`File too large: ${file.size} bytes`);
      return {
        success: false,
        error: "File too large. Maximum size is 5MB.",
      };
    }

    // Validate Cloudinary configuration
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Cloudinary credentials not configured");
      return {
        success: false,
        error: "Image upload service not configured. Please contact administrator.",
      };
    }

    // Convert file to base64 data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");
    const mimeType = file.type;
    const dataURI = `data:${mimeType};base64,${base64Data}`;

    console.log(`Uploading to Cloudinary folder: ${folder}`);

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: "image",
      transformation: [
        {
          quality: "auto:good", // Automatic quality optimization
          fetch_format: "auto", // Automatic format selection (WebP when supported)
        },
      ],
    });

    console.log(`Upload successful. Public ID: ${uploadResponse.public_id}`);
    console.log(`Cloudinary URL: ${uploadResponse.secure_url}`);

    return {
      success: true,
      url: uploadResponse.secure_url,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    const errorMsg =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `Failed to upload image: ${errorMsg}`,
    };
  }
}

/**
 * Delete an image from Cloudinary
 * @param imageUrl - Full Cloudinary URL of the image
 * @returns Delete result
 */
export async function deleteFromCloudinary(
  imageUrl: string
): Promise<UploadResult> {
  try {
    // Validate URL is from Cloudinary
    if (!imageUrl || !imageUrl.includes("cloudinary.com")) {
      return {
        success: false,
        error: "Invalid Cloudinary URL",
      };
    }

    // Extract public_id from URL
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
    const urlParts = imageUrl.split("/upload/");
    if (urlParts.length < 2) {
      return {
        success: false,
        error: "Could not parse Cloudinary URL",
      };
    }

    // Get the part after /upload/ and extract public_id (remove version and extension)
    const pathAfterUpload = urlParts[1];
    const pathParts = pathAfterUpload.split("/").filter((part) => !part.startsWith("v")); // Remove version numbers
    const publicIdWithExt = pathParts.join("/");
    const publicId = publicIdWithExt.substring(
      0,
      publicIdWithExt.lastIndexOf(".")
    );

    console.log(`Attempting to delete from Cloudinary. Public ID: ${publicId}`);

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    console.log(`Delete result:`, result);

    if (result.result === "ok" || result.result === "not found") {
      return { success: true };
    } else {
      return {
        success: false,
        error: "Failed to delete image from Cloudinary",
      };
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    const errorMsg =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `Failed to delete image: ${errorMsg}`,
    };
  }
}

/**
 * Get optimized image URL with transformations
 * This is a utility function, not a server action, so it can be sync
 * @param publicId - Cloudinary public ID
 * @param options - Transformation options (width, height, crop, etc.)
 * @returns Optimized image URL
 */
export async function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  }
): Promise<string> {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: options?.width,
        height: options?.height,
        crop: options?.crop || "fill",
        quality: options?.quality || "auto:good",
        fetch_format: "auto",
      },
    ],
  });
}
