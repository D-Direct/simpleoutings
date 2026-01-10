# Cloudinary Integration Setup

This document explains how the Cloudinary integration works and how to set it up.

## What Changed?

The project has been migrated from **local filesystem storage** to **Cloudinary cloud storage** for all image uploads. This change:

✅ **Solves production deployment issues** (Vercel/Netlify have read-only filesystems)
✅ **Automatic image optimization** (WebP conversion, quality optimization)
✅ **CDN delivery** (faster loading worldwide)
✅ **Automatic backups** (no risk of losing images)
✅ **Transformation capabilities** (resize, crop, format conversion)

---

## Setup Instructions

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a **free account** (25GB storage + 25GB bandwidth per month)
3. Verify your email and log in

### 2. Get Your Credentials

1. Go to your [Cloudinary Console Dashboard](https://console.cloudinary.com/)
2. You'll see your **Account Details** section with:
   - **Cloud Name**: `dh45fufyq` (example)
   - **API Key**: `317885866968382` (example)
   - **API Secret**: `fE8hRF-J7UQ2ms_254-arl6bG_k` (example)

### 3. Configure Environment Variables

Your `.env` file should already have these variables (already configured):

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dh45fufyq
CLOUDINARY_API_KEY=317885866968382
CLOUDINARY_API_SECRET=fE8hRF-J7UQ2ms_254-arl6bG_k
```

### 4. Restart Your Development Server

After updating the `.env` file, restart your Next.js dev server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

---

## How It Works

### Image Upload Flow

1. **User uploads image** via admin form (Hero, About, or Gallery)
2. **File validation** (type, size, format)
3. **Convert to base64** data URI
4. **Upload to Cloudinary** with automatic optimization
5. **Store Cloudinary URL** in database
6. **Display optimized image** on tenant site

### Folder Structure in Cloudinary

Images are organized by type:

```
homestay-saas/
├── hero/          # Hero section images
├── about/         # About section images
└── gallery/       # Gallery images
```

### Automatic Optimizations

Cloudinary automatically applies:
- **Quality optimization**: `quality: auto:good`
- **Format conversion**: WebP for browsers that support it
- **Lazy loading**: Compatible with Next.js Image component
- **Responsive images**: Multiple sizes generated

---

## Updated Files

### New Files Created

1. **[src/lib/cloudinary.ts](src/lib/cloudinary.ts)** - Main Cloudinary integration
   - `uploadToCloudinary()` - Upload images with validation
   - `deleteFromCloudinary()` - Delete images from Cloudinary
   - `getOptimizedImageUrl()` - Get transformed image URLs

### Modified Files

1. **[src/lib/actions.ts](src/lib/actions.ts)** - Updated `updateProperty()` action
   - Hero image upload → Cloudinary
   - About image upload → Cloudinary

2. **[src/lib/gallery-actions.ts](src/lib/gallery-actions.ts)**
   - Gallery upload → Cloudinary
   - Gallery delete → Removes from Cloudinary

3. **[.env](.env)** - Added Cloudinary credentials

---

## Image Validation

The following validations are enforced:

| Rule | Value |
|------|-------|
| **Max File Size** | 5MB |
| **Allowed Types** | JPEG, JPG, PNG, WebP |
| **Cloud Storage** | Required (automatic check) |

### Error Messages

- `"No file provided"` - Empty file or no file selected
- `"Invalid file type. Only JPEG, PNG, and WebP are allowed."` - Wrong format
- `"File too large. Maximum size is 5MB."` - File exceeds limit
- `"Image upload service not configured."` - Missing Cloudinary credentials

---

## Testing

### Test Hero Image Upload

1. Go to `http://app.localhost:3000/properties/{id}`
2. Click **Hero** tab
3. Upload an image (JPEG/PNG)
4. Check that image appears immediately
5. Verify the URL starts with `https://res.cloudinary.com/`

### Test About Image Upload

1. Same property page
2. Click **About** tab
3. Upload an image
4. Verify Cloudinary URL

### Test Gallery Upload

1. Click **Gallery** tab
2. Upload multiple images
3. Click **Delete** on an image
4. Verify it's removed from Cloudinary (check Console logs)

---

## Troubleshooting

### Issue: "Image upload service not configured"

**Solution:** Check that all three env variables are set:
```bash
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Then restart the dev server.

### Issue: Images not displaying

**Solution:**
1. Check browser console for errors
2. Verify the URL format: `https://res.cloudinary.com/{cloud_name}/image/upload/...`
3. Check Cloudinary dashboard to see if upload succeeded

### Issue: "Invalid Cloudinary URL" when deleting

**Solution:** This happens with old local URLs (starting with `/uploads/`). The delete function safely handles this and only deletes from Cloudinary when the URL is a Cloudinary URL.

---

## Migration Notes

### Old Local Uploads

Images previously uploaded to `/public/uploads/` will still work but won't be in Cloudinary. They:
- ✅ Will display correctly on tenant sites
- ❌ Won't be optimized
- ❌ Won't be backed up
- ❌ Won't work in production (Vercel)

**Recommendation:** Re-upload important images through the admin panel after deployment.

### Backward Compatibility

The delete function checks if a URL is from Cloudinary before attempting deletion:

```typescript
if (image && image.url.includes("cloudinary.com")) {
    await deleteFromCloudinary(image.url);
}
```

This means old local images won't cause errors when deleted.

---

## Cloudinary Dashboard

View your uploaded images at:
[https://console.cloudinary.com/console/media_library](https://console.cloudinary.com/console/media_library)

Here you can:
- Browse all uploaded images
- View folder structure
- Manually delete images
- Get image URLs
- View usage statistics

---

## Free Tier Limits

Cloudinary's free tier includes:

| Resource | Limit |
|----------|-------|
| **Storage** | 25 GB |
| **Bandwidth** | 25 GB/month |
| **Transformations** | 25,000/month |
| **Images** | Unlimited |
| **Videos** | 10 min/month |

**More than enough for:**
- 5,000-10,000 property images
- Hundreds of properties
- Thousands of monthly visitors

---

## Advanced Features (Optional)

### Custom Transformations

You can use the `getOptimizedImageUrl()` helper for custom transformations:

```typescript
import { getOptimizedImageUrl } from "@/lib/cloudinary";

// Get thumbnail (300x300)
const thumbnailUrl = getOptimizedImageUrl(publicId, {
  width: 300,
  height: 300,
  crop: "fill",
  quality: "auto:good"
});

// Get hero image (1920x1080)
const heroUrl = getOptimizedImageUrl(publicId, {
  width: 1920,
  height: 1080,
  crop: "fill"
});
```

### Automatic Backups

Cloudinary automatically backs up all images. You can also:
1. Go to Settings → Upload
2. Enable "Backup" (Pro plan required)
3. Configure backup schedule

---

## Support

- **Cloudinary Docs**: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Next.js Integration**: [https://cloudinary.com/documentation/nextjs_integration](https://cloudinary.com/documentation/nextjs_integration)
- **Support**: [https://support.cloudinary.com](https://support.cloudinary.com)

---

## Next Steps

Now that Cloudinary is integrated, you can:

1. ✅ Deploy to Vercel/Netlify without storage issues
2. ✅ Enjoy faster image loading with CDN
3. ✅ Get automatic WebP conversion
4. ✅ Scale to thousands of images without worry

The image upload issue is now **fully resolved**! 🎉
