import Image from "next/image";

interface AboutSectionProps {
  title: string | null;
  content: string | null;
  image?: string | null;
}

export default function AboutSection({ title, content, image }: AboutSectionProps) {
  if (!content) return null;

  return (
    <section id="about" className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
            {image ? (
              <Image 
                src={image} 
                alt={title || "About Us"} 
                fill 
                className="object-cover"
              />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                    <span className="text-sm uppercase tracking-widest font-serif">A Little Piece of Heaven</span>
                </div>
            )}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-stone-50 -z-10" />
          </div>
          
          <div className="space-y-8">
            <div className="max-w-md">
              <span className="text-xs uppercase tracking-[0.4em] text-stone-400 mb-4 block">The Story</span>
              <h2 className="text-5xl font-serif text-stone-900 mb-8 leading-tight">
                {title || "Crafting Memories in the Hills"}
              </h2>
              <div className="w-16 h-px bg-stone-200 mb-8" />
              <div className="text-stone-600 text-lg font-light leading-relaxed space-y-6">
                {content.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
