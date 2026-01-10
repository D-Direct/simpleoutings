import Image from "next/image";

interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
}

interface GallerySectionProps {
  images: GalleryImage[];
}

export default function GallerySection({ images }: GallerySectionProps) {
  if (!images || images.length === 0) return null;

  return (
    <section id="gallery" className="py-12 bg-stone-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-stone-400 mb-4 block">Gallery</span>
          <h2 className="text-5xl font-serif text-stone-900 mb-6">A Visual Journey</h2>
          <div className="w-16 h-px bg-stone-200 mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div 
              key={image.id} 
              className={`relative overflow-hidden group cursor-pointer ${
                index % 7 === 0 ? 'md:col-span-2 md:row-span-2' : 'aspect-square'
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || `Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
