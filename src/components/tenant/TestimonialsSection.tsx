import { Quote } from "lucide-react";

interface Testimonial {
  id: string;
  content: string;
  author: string;
  location: string | null;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-12 bg-stone-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-stone-400 mb-4 block">Testimonials</span>
          <h2 className="text-5xl font-serif text-stone-900 mb-6">Guest Experiences</h2>
          <div className="w-16 h-px bg-stone-200 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 border border-stone-100 hover:shadow-lg transition-shadow duration-300">
              <Quote className="w-10 h-10 text-stone-200 mb-6" />
              <p className="text-stone-700 font-light leading-relaxed mb-6 italic">
                &quot;{testimonial.content}&quot;
              </p>
              <div className="pt-4 border-t border-stone-100">
                <p className="font-medium text-stone-900">{testimonial.author}</p>
                {testimonial.location && (
                  <p className="text-sm text-stone-500 mt-1">{testimonial.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
