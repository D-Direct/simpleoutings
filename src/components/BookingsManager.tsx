"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Check, X, Trash2, User, Phone, Mail, Users, MessageSquare } from "lucide-react";
import { updateBookingStatus, deleteBooking } from "@/lib/booking-actions";
import { toast } from "sonner";

interface Booking {
  id: string;
  checkIn: Date;
  checkOut: Date;
  guestName: string;
  guestEmail: string | null;
  guestPhone: string;
  numberOfGuests: number;
  specialRequests: string | null;
  status: string;
  createdAt: Date;
  room: {
    id: string;
    type: string;
  } | null;
}

interface BookingsManagerProps {
  propertyId: string;
  bookings: Booking[];
}

export function BookingsManager({ propertyId, bookings }: BookingsManagerProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status.toLowerCase() === filter;
  });

  const handleStatusChange = async (bookingId: string, status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED") => {
    const result = await updateBookingStatus(bookingId, status);
    if (result.success) {
      toast.success(`Booking ${status.toLowerCase()}`);
      window.location.reload();
    } else {
      toast.error(result.error || "Failed to update booking");
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    const result = await deleteBooking(bookingId);
    if (result.success) {
      toast.success("Booking deleted");
      window.location.reload();
    } else {
      toast.error(result.error || "Failed to delete booking");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "CONFIRMED":
        return "bg-green-50 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      case "COMPLETED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-stone-50 text-stone-700 border-stone-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className="rounded-full"
        >
          All ({bookings.length})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("pending")}
          className="rounded-full"
        >
          Pending ({bookings.filter(b => b.status === "PENDING").length})
        </Button>
        <Button
          variant={filter === "confirmed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("confirmed")}
          className="rounded-full"
        >
          Confirmed ({bookings.filter(b => b.status === "CONFIRMED").length})
        </Button>
        <Button
          variant={filter === "cancelled" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("cancelled")}
          className="rounded-full"
        >
          Cancelled ({bookings.filter(b => b.status === "CANCELLED").length})
        </Button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-xl">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-stone-300" />
          <p className="text-stone-500 font-light">No bookings {filter !== "all" ? `with status "${filter}"` : "yet"}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-stone-900">{booking.guestName}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-stone-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</span>
                    </div>
                    {booking.room && (
                      <div className="flex items-center gap-2">
                        <span className="text-stone-400">•</span>
                        <span>{booking.room.type}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{booking.numberOfGuests} {booking.numberOfGuests === 1 ? "guest" : "guests"}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {booking.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => handleStatusChange(booking.id, "CONFIRMED")}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleStatusChange(booking.id, "CANCELLED")}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                )}
                {booking.status === "CONFIRMED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(booking.id, "COMPLETED")}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>

              {/* Guest Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 pt-4 border-t border-stone-100">
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${booking.guestPhone}`} className="hover:text-stone-900 underline">
                    {booking.guestPhone}
                  </a>
                </div>
                {booking.guestEmail && (
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${booking.guestEmail}`} className="hover:text-stone-900 underline">
                      {booking.guestEmail}
                    </a>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              {booking.specialRequests && (
                <div className="bg-stone-50 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 mt-0.5 text-stone-500" />
                    <div>
                      <p className="font-medium text-stone-700 mb-1">Special Requests:</p>
                      <p className="text-stone-600">{booking.specialRequests}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Button */}
              <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                <p className="text-xs text-stone-400">
                  Booked on {formatDate(booking.createdAt)}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(booking.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
