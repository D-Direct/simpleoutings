import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  name: string;
  description: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  image?: string;
}

export default function HeroSection({ name, description, heroTitle, heroSubtitle, image }: HeroSectionProps) {
  const displayTitle = heroTitle || name;
  const displaySubtitle = heroSubtitle || description;
  return (
    <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover brightness-75"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-stone-900" />
      )}

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h1 className="text-5xl md:text-8xl font-serif mb-6 tracking-tight">
          {displayTitle}
        </h1>
        <div className="w-24 h-px bg-white/40 mx-auto mb-8" />
        <p className="text-xl md:text-2xl font-light mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
          {displaySubtitle}
        </p>
        <div>
          <Button
            size="lg"
            className="bg-white text-stone-900 hover:bg-stone-100 rounded-none px-10 py-7 text-sm font-medium tracking-[0.2em] uppercase transition-all shadow-xl"
            asChild
          >
            <a href="#accommodation">Explore Rooms</a>
          </Button>
        </div>
      </div>

      {/* Decorative Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950/20 pointer-events-none" />
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-12 bg-white/30" />
      </div>
    </section>
  );
}
