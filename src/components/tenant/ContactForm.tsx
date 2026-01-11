"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { createInquiry } from "@/lib/inquiry-actions";
import GoogleMap from "./GoogleMap";

interface ContactFormProps {
  propertyId: string;
  propertyEmail?: string | null;
  propertyPhone?: string | null;
  propertyAddress?: string | null;
  connectTitle?: string | null;
  connectDescription?: string | null;
  locationAddress?: string | null;
}

export default function ContactForm({
  propertyId,
  propertyEmail,
  propertyPhone,
  propertyAddress,
  connectTitle,
  connectDescription,
  locationAddress
}: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(createInquiry, { success: false });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success("Inquiry sent!", {
        description: state.message || "We will get back to you shortly.",
      });
      formRef.current?.reset();
    } else if (state.error) {
      toast.error("Error", {
        description: state.error,
      });
    }
  }, [state]);

  return (
    <section id="contact" className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-stone-400 mb-4 block">Connect</span>
          <h2 className="text-5xl font-serif text-stone-900 mb-8">
            {connectTitle || "Plan Your Escape"}
          </h2>
          <p className="text-stone-600 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            {connectDescription || "Whether you have a specific request or just want to say hello, we'd love to hear from you."}
          </p>
        </div>

        {/* Contact Info Section */}
        <div className="flex flex-wrap justify-center gap-8 mb-16 pb-16 border-b border-stone-100">
          {propertyAddress && (
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-stone-400" />
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-widest text-stone-400 mb-1">Location</h4>
                <p className="text-stone-900 font-light">{propertyAddress}</p>
              </div>
            </div>
          )}

          {propertyPhone && (
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-stone-400" />
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-widest text-stone-400 mb-1">Call Us</h4>
                <p className="text-stone-900 font-light">{propertyPhone}</p>
              </div>
            </div>
          )}

          {propertyEmail && (
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-stone-400" />
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-widest text-stone-400 mb-1">Email</h4>
                <p className="text-stone-900 font-light">{propertyEmail}</p>
              </div>
            </div>
          )}
        </div>

        {/* Two Column Layout: Map & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Google Map */}
          {locationAddress ? (
            <div>
              <GoogleMap address={locationAddress} />
            </div>
          ) : (
            <div className="hidden lg:block"></div>
          )}

          {/* Right Column - Contact Form */}
          <div className="bg-stone-50 p-10 lg:p-16 border border-stone-100">
            <form ref={formRef} action={formAction} className="space-y-8">
              <input type="hidden" name="propertyId" value={propertyId} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-stone-400">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    className="bg-transparent border-0 border-b border-stone-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-stone-900 transition-colors h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-stone-400">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="bg-transparent border-0 border-b border-stone-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-stone-900 transition-colors h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-stone-400">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+94 77 123 4567"
                  className="bg-transparent border-0 border-b border-stone-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-stone-900 transition-colors h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-[10px] uppercase tracking-widest text-stone-400">Your Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your plans..."
                  required
                  className="bg-transparent border-0 border-b border-stone-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-stone-900 min-h-[120px] resize-none transition-colors py-4"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-stone-900 text-white hover:bg-stone-800 rounded-none h-14 uppercase tracking-[0.3em] text-xs transition-all"
              >
                {isPending ? "Sending..." : "Send Inquiry"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
