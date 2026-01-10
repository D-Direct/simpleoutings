# Fixing Old Image Paths

## The Problem

After migrating to Cloudinary, your database still contains old image paths like `/uploads/1767618355025-pap9igx8ynr.jpg`. These paths point to the local filesystem and cause errors on the tenant site:

```
Error: The requested resource isn't a valid image for /uploads/... received null
```

## What Was Fixed

1. **✅ Hero Image Field** - Changed from `property.images[0]` to `property.heroImage` in [src/app/[domain]/page.tsx:62](src/app/[domain]/page.tsx#L62)
2. **✅ Next.js Image Config** - Added Cloudinary domain to allowed remote patterns in [next.config.ts:4-11](next.config.ts#L4-L11)

## Solution: Clear Old Images

You have **two options**:

---

### Option 1: Re-upload Manually (Recommended for Small Projects)

1. **Restart your dev server** to apply Next.js config changes:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Go to admin panel:**
   - Visit: `http://app.localhost:3000`
   - Click on your property

3. **Re-upload images:**
   - **Hero tab**: Upload a new hero image → Goes to Cloudinary ✅
   - **About tab**: Upload a new about image → Goes to Cloudinary ✅
   - **Gallery tab**: Upload gallery images → Goes to Cloudinary ✅

4. **Verify on tenant site:**
   - Visit: `http://[your-property-slug].localhost:3000`
   - Images should load without errors
   - Check browser DevTools → Network tab → Images should load from `res.cloudinary.com`

---

### Option 2: Run Migration Script (Faster for Multiple Properties)

**This script will clear all old `/uploads/` paths from your database.**

1. **Install tsx** (TypeScript executor):
   ```bash
   npm install -D tsx
   ```

2. **Run the migration script:**
   ```bash
   npx tsx scripts/clear-old-images.ts
   ```

   This will:
   - Find all properties with `/uploads/` paths
   - Clear `heroImage` and `aboutImage` fields
   - Delete old gallery images
   - Show you which properties were affected

3. **Re-upload images** via admin panel (as described in Option 1)

---

## Verification Checklist

After clearing old images and re-uploading:

- [ ] Dev server restarted
- [ ] Hero image uploaded via admin panel
- [ ] About image uploaded via admin panel
- [ ] Gallery images uploaded via admin panel
- [ ] Tenant site loads without image errors
- [ ] Browser DevTools shows images loading from `res.cloudinary.com`
- [ ] Images display correctly (no broken images)

---

## Technical Details

### What Changed in Code

**1. Fixed Hero Image Source** ([src/app/[domain]/page.tsx](src/app/[domain]/page.tsx))
```typescript
// Before (WRONG - uses images array)
image={property.images?.[0] ?? undefined}

// After (CORRECT - uses heroImage field)
image={property.heroImage ?? undefined}
```

**2. Added Cloudinary to Next.js Config** ([next.config.ts](next.config.ts))
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      pathname: '/**',
    },
  ],
}
```

This tells Next.js Image component to allow images from Cloudinary.

### Database Schema

Your database fields for images:
- `properties.heroImage` → Hero section (text)
- `properties.aboutImage` → About section (text)
- `galleryImages.url` → Gallery photos (text)

**Old values:** `/uploads/filename.jpg` ❌
**New values:** `https://res.cloudinary.com/dh45fufyq/image/upload/...` ✅

---

## Why This Happened

When you first built the project, images were saved locally to `public/uploads/`. After integrating Cloudinary:
- ✅ New uploads go to Cloudinary
- ❌ Old database records still had `/uploads/` paths
- ❌ Hero image was using wrong field (`images[0]` instead of `heroImage`)

Now both issues are fixed! 🎉

---

## Troubleshooting

### Issue: Images still not loading after re-upload

**Check 1:** Did you restart the dev server?
```bash
# Stop with Ctrl+C, then:
npm run dev
```

**Check 2:** Check the database value
```sql
-- In your database (Supabase dashboard or psql):
SELECT name, hero_image, about_image FROM property;
```

The URLs should start with `https://res.cloudinary.com/`

**Check 3:** Check browser console
- Open DevTools (F12)
- Go to Console tab
- Look for errors related to images
- Check Network tab → Filter by "Img" → See which URLs are being loaded

### Issue: "Invalid src prop" error

This means Next.js doesn't recognize the domain. Make sure:
1. ✅ [next.config.ts](next.config.ts) has the Cloudinary remote pattern
2. ✅ You restarted the dev server after changing config
3. ✅ The image URL is from `https://res.cloudinary.com/`

---

## Prevention for Future

**Always use Cloudinary for new uploads:**
- All image uploads now automatically use Cloudinary
- No more local filesystem storage
- Images are automatically optimized
- Works in production (Vercel/Netlify)

**Avoid:**
- Don't manually save files to `public/uploads/`
- Don't use `fs.writeFile()` for images
- Always use the `uploadToCloudinary()` function in [src/lib/cloudinary.ts](src/lib/cloudinary.ts)

---

## Summary

✅ **Fixed:** Hero image now uses correct database field
✅ **Fixed:** Next.js config allows Cloudinary images
✅ **Created:** Migration script to clear old paths
📝 **Action Required:** Re-upload images via admin panel

After re-uploading, your tenant sites will load images from Cloudinary with automatic optimization! 🚀
