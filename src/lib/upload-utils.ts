"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function uploadImage(formData: FormData, fieldName: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        const file = formData.get(fieldName) as File | null;

        console.log(`Upload attempt for field: ${fieldName}`);
        console.log(`File object:`, file);
        console.log(`File size:`, file?.size);
        console.log(`File type:`, file?.type);

        if (!file || file.size === 0) {
            console.log("No file provided or empty file");
            return { success: false, error: "No file provided" };
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            console.log(`Invalid file type: ${file.type}`);
            return { success: false, error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." };
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            console.log(`File too large: ${file.size} bytes`);
            return { success: false, error: "File too large. Maximum size is 5MB." };
        }

        // Ensure upload directory exists
        if (!existsSync(UPLOAD_DIR)) {
            console.log(`Creating upload directory: ${UPLOAD_DIR}`);
            await mkdir(UPLOAD_DIR, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = file.name.split(".").pop();
        const filename = `${timestamp}-${randomString}.${extension}`;

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filepath = join(UPLOAD_DIR, filename);

        console.log(`Saving file to: ${filepath}`);
        await writeFile(filepath, buffer);
        console.log(`File saved successfully`);

        // Return public URL path
        const publicUrl = `/uploads/${filename}`;
        console.log(`Public URL: ${publicUrl}`);
        return { success: true, url: publicUrl };

    } catch (error) {
        console.error("Upload error:", error);
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: `Failed to upload file: ${errorMsg}` };
    }
}

export async function deleteImage(url: string): Promise<{ success: boolean; error?: string }> {
    try {
        if (!url || !url.startsWith("/uploads/")) {
            return { success: false, error: "Invalid URL" };
        }

        const filename = url.replace("/uploads/", "");
        const filepath = join(UPLOAD_DIR, filename);

        if (existsSync(filepath)) {
            const { unlink } = await import("fs/promises");
            await unlink(filepath);
        }

        return { success: true };
    } catch (error) {
        console.error("Delete error:", error);
        return { success: false, error: "Failed to delete file" };
    }
}
