"use client";

import { useActionState, useState } from "react";
import { createBooking, BookingActionState } from "@/lib/booking-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Users, Send } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

interface Room {
  id: string;
  type: string;
  priceLKR: number;
  capacity: number;
}

interface BookingFormProps {
  propertyId: string;
  rooms?: Room[];
}

export default function BookingForm({ propertyId, rooms }: BookingFormProps) {
  const [state, formAction, isPending] = useActionState(createBooking, { success: false });
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  useEffect(() => {
    if (state.success) {
      toast.success("Booking Request Sent!", {
        description: "The property owner will contact you shortly to confirm your booking.",
      });
      // Reset form
      (document.getElementById("booking-form") as HTMLFormElement)?.reset();
      setSelectedRoom("");
    } else if (state.error) {
      toast.error("Booking Failed", {
        description: state.error,
      });
    }
  }, [state]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="booking" className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.4em] text-stone-400 mb-4 block">Reserve Your Stay</span>
          <h2 className="text-5xl font-serif text-stone-900 mb-6">Request a Booking</h2>
          <div className="w-16 h-px bg-stone-200 mx-auto mb-6" />
          <p className="text-stone-600 text-lg font-light max-w-2xl mx-auto">
            Fill out the form below and we'll get back to you within 24 hours to confirm your reservation.
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 md:p-12">
          <form id="booking-form" action={formAction} className="space-y-6">
            <input type="hidden" name="propertyId" value={propertyId} />

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="checkIn" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Check-in Date
                </Label>
                <Input
                  id="checkIn"
                  name="checkIn"
                  type="date"
                  min={today}
                  required
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Check-out Date
                </Label>
                <Input
                  id="checkOut"
                  name="checkOut"
                  type="date"
                  min={today}
                  required
                  className="bg-white"
                />
              </div>
            </div>

            {/* Room Selection */}
            {rooms && rooms.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="roomId">Select Room Type (Optional)</Label>
                <select
                  id="roomId"
                  name="roomId"
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900"
                >
                  <option value="">Any Available Room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.type} - LKR {room.priceLKR.toLocaleString()} per night (Up to {room.capacity} guests)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Guest Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="guestName">Your Name *</Label>
                <Input
                  id="guestName"
                  name="guestName"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfGuests" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Number of Guests *
                </Label>
                <Input
                  id="numberOfGuests"
                  name="numberOfGuests"
                  type="number"
                  min="1"
                  max="20"
                  defaultValue="2"
                  required
                  className="bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="guestPhone">Phone Number *</Label>
                <Input
                  id="guestPhone"
                  name="guestPhone"
                  type="tel"
                  placeholder="+94 77 123 4567"
                  required
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestEmail">Email Address</Label>
                <Input
                  id="guestEmail"
                  name="guestEmail"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-white"
                />
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests or Notes</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                rows={4}
                placeholder="Any special requirements, dietary restrictions, or requests..."
                className="bg-white resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white h-12 text-base rounded-full"
            >
              {isPending ? (
                "Sending Request..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Booking Request
                </>
              )}
            </Button>

            <p className="text-xs text-stone-500 text-center">
              By submitting this form, you agree to be contacted by the property owner regarding your booking request.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
