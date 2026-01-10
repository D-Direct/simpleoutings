"use client";

import { useState, useActionState, useEffect } from "react";
import { uploadGalleryImage, deleteGalleryImage, GalleryActionState } from "@/lib/gallery-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ImagePlus, Trash2, Upload, X } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
}

interface GalleryManagerProps {
  propertyId: string;
  images: GalleryImage[];
}

export function GalleryManager({ propertyId, images: initialImages }: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [showForm, setShowForm] = useState(false);

  const uploadAction = uploadGalleryImage.bind(null, propertyId);
  const [uploadState, uploadFormAction, isUploading] = useActionState(uploadAction, { success: false });

  useEffect(() => {
    if (uploadState.success) {
      toast.success("Image uploaded successfully!");
      setShowForm(false);
      window.location.reload();
    } else if (uploadState.error) {
      toast.error(uploadState.error);
    }
  }, [uploadState]);

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    const result = await deleteGalleryImage(imageId);
    if (result.success) {
      toast.success("Image deleted!");
      setImages(images.filter(img => img.id !== imageId));
    } else {
      toast.error(result.error || "Failed to delete image");
    }
  };

  return (
    <div className="space-y-6">
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group aspect-square overflow-hidden rounded-lg border border-stone-200">
            <img 
              src={image.url} 
              alt={image.alt || "Gallery image"} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(image.id)}
                className="text-white hover:text-red-500 hover:bg-white/20"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
            {image.alt && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
                {image.alt}
              </div>
            )}
          </div>
        ))}
      </div>

      {images.length === 0 && !showForm && (
        <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-lg">
          <ImagePlus className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-400 mb-4">No gallery images yet</p>
          <Button onClick={() => setShowForm(true)} className="bg-stone-900 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload Your First Image
          </Button>
        </div>
      )}

      {/* Upload Form */}
      {showForm ? (
        <Card className="border-stone-300 bg-stone-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-stone-900">Upload Gallery Image</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <form action={uploadFormAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Select Image</Label>
                <Input 
                  id="image" 
                  name="image" 
                  type="file" 
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  required
                  className="cursor-pointer"
                />
                <p className="text-xs text-stone-500">Max 5MB. JPEG, PNG, or WebP.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alt">Image Description (Optional)</Label>
                <Input 
                  id="alt" 
                  name="alt" 
                  placeholder="e.g. Mountain view from balcony" 
                />
              </div>

              <Button type="submit" disabled={isUploading} className="w-full bg-stone-900 text-white">
                {isUploading ? "Uploading..." : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : images.length > 0 && (
        <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
          <ImagePlus className="w-4 h-4 mr-2" />
          Add More Images
        </Button>
      )}
    </div>
  );
}
