import { Wifi, Car, Waves, Coffee, Wind, Tv, UtensilsCrossed, Dumbbell } from "lucide-react";

interface Amenity {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
}

interface AmenitiesSectionProps {
  amenities: Amenity[];
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  car: Car,
  waves: Waves,
  coffee: Coffee,
  wind: Wind,
  tv: Tv,
  utensils: UtensilsCrossed,
  dumbbell: Dumbbell,
};

export default function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  if (!amenities || amenities.length === 0) return null;

  const getIconComponent = (iconValue: string | null) => {
    if (!iconValue) return Wifi;
    return ICON_MAP[iconValue] || Wifi;
  };

  return (
    <section id="amenities" className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-stone-400 mb-4 block">Amenities</span>
          <h2 className="text-5xl font-serif text-stone-900 mb-6">Everything You Need</h2>
          <div className="w-16 h-px bg-stone-200 mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {amenities.map((amenity) => {
            const IconComponent = getIconComponent(amenity.icon);
            return (
              <div key={amenity.id} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-stone-900 transition-colors duration-300">
                  <IconComponent className="w-7 h-7 text-stone-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-medium text-stone-900 mb-1">{amenity.name}</h3>
                {amenity.description && (
                  <p className="text-sm text-stone-500 font-light">{amenity.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
