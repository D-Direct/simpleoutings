/**
 * Script to clear old local image paths from the database
 * Run this after migrating to Cloudinary to remove broken image references
 *
 * Usage: npx tsx scripts/clear-old-images.ts
 */

import { db } from "../src/db";
import { properties, galleryImages } from "../src/db/schema";
import { like, sql } from "drizzle-orm";

async function clearOldImages() {
  console.log("🔍 Checking for old local image paths...\n");

  try {
    // Find properties with /uploads/ images
    const propertiesWithOldImages = await db
      .select()
      .from(properties)
      .where(
        sql`${properties.heroImage} LIKE '/uploads/%' OR ${properties.aboutImage} LIKE '/uploads/%'`
      );

    console.log(`Found ${propertiesWithOldImages.length} properties with old image paths`);

    if (propertiesWithOldImages.length > 0) {
      console.log("\nProperties affected:");
      propertiesWithOldImages.forEach((prop) => {
        console.log(`  - ${prop.name} (ID: ${prop.id})`);
        if (prop.heroImage?.includes("/uploads/")) {
          console.log(`    Hero image: ${prop.heroImage}`);
        }
        if (prop.aboutImage?.includes("/uploads/")) {
          console.log(`    About image: ${prop.aboutImage}`);
        }
      });

      console.log("\n⚠️  These images will be cleared. You'll need to re-upload them via the admin panel.");
      console.log("📸 New uploads will automatically go to Cloudinary.\n");

      // Clear hero images
      const heroResult = await db
        .update(properties)
        .set({ heroImage: null })
        .where(like(properties.heroImage, "/uploads/%"));

      // Clear about images
      const aboutResult = await db
        .update(properties)
        .set({ aboutImage: null })
        .where(like(properties.aboutImage, "/uploads/%"));

      console.log("✅ Cleared old hero and about images");
    }

    // Find gallery images with /uploads/ paths
    const oldGalleryImages = await db
      .select()
      .from(galleryImages)
      .where(like(galleryImages.url, "/uploads/%"));

    console.log(`\nFound ${oldGalleryImages.length} gallery images with old paths`);

    if (oldGalleryImages.length > 0) {
      // Delete old gallery images
      const deleteResult = await db
        .delete(galleryImages)
        .where(like(galleryImages.url, "/uploads/%"));

      console.log("✅ Deleted old gallery images");
    }

    console.log("\n✨ Migration complete!");
    console.log("📋 Next steps:");
    console.log("   1. Go to your admin panel (http://app.localhost:3000)");
    console.log("   2. Re-upload Hero and About images");
    console.log("   3. Re-upload gallery images");
    console.log("   4. New uploads will automatically use Cloudinary");

  } catch (error) {
    console.error("❌ Error clearing old images:", error);
    process.exit(1);
  }

  process.exit(0);
}

clearOldImages();
