"use client";

import Image from "next/image";
import { useState } from "react";
import { X, Users, DollarSign } from "lucide-react";

interface Room {
  id: string;
  type: string;
  description: string | null;
  priceLKR: number;
  capacity: number;
  image: string | null;
  features: string[] | null;
}

interface RoomGalleryProps {
  rooms: Room[];
}

export default function RoomGallery({ rooms }: RoomGalleryProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  return (
    <>
    <section id="accommodation" className="py-12 bg-stone-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.4em] text-stone-400 mb-4 block">Accommodation</span>
            <h2 className="text-5xl font-serif text-stone-900 mb-6">Designed for Serenity</h2>
            <p className="text-stone-600 text-lg font-light leading-relaxed">
              Every detail is chosen to create an atmosphere of tranquility. From the soft linen to the curated art, your comfort is our priority.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-40 h-px bg-stone-200" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div key={room.id} className="group cursor-pointer" onClick={() => setSelectedRoom(room)}>
                <div className="relative aspect-[4/5] overflow-hidden mb-8 bg-stone-200 transition-all duration-700 ease-out group-hover:shadow-2xl">
                  {room.image ? (
                    <>
                      <Image
                        src={room.image}
                        alt={room.type}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/0 transition-colors duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-stone-900/20 backdrop-blur-[2px]">
                        <span className="text-white text-xs uppercase tracking-[0.2em] border border-white/40 px-6 py-3">View Details</span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
                      <span className="text-stone-400 text-sm">No image</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-serif text-stone-900 mb-1">{room.type}</h3>
                      <p className="text-stone-400 text-sm font-light uppercase tracking-widest">{room.capacity} Guests</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium text-stone-900">LKR {room.priceLKR.toLocaleString()}</p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-tighter">per night</p>
                    </div>
                  </div>
                  {room.description && (
                    <p className="text-stone-600 text-sm font-light leading-relaxed">{room.description}</p>
                  )}
                  {room.features && room.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-stone-200 rounded-lg">
              <p className="text-stone-400 font-light italic">More rooms coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </section>

    {/* Room Details Modal */}
    {selectedRoom && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm"
        onClick={() => setSelectedRoom(null)}
      >
        <div
          className="relative bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedRoom(null)}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-stone-900" />
          </button>

          {/* Room Image */}
          {selectedRoom.image && (
            <div className="relative h-96 w-full">
              <Image
                src={selectedRoom.image}
                alt={selectedRoom.type}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Room Details */}
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-4xl font-serif text-stone-900 mb-2">
                {selectedRoom.type}
              </h2>
              <div className="flex items-center gap-6 text-stone-600">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Up to {selectedRoom.capacity} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-semibold text-stone-900">
                    LKR {selectedRoom.priceLKR.toLocaleString()}
                  </span>
                  <span className="text-sm">/ night</span>
                </div>
              </div>
            </div>

            {selectedRoom.description && (
              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-3">
                  Description
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {selectedRoom.description}
                </p>
              </div>
            )}

            {selectedRoom.features && selectedRoom.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-3">
                  Room Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedRoom.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-stone-900 rounded-full" />
                      <span className="text-stone-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Button */}
            <div className="pt-6 border-t border-stone-200">
              <a
                href="#contact"
                onClick={() => setSelectedRoom(null)}
                className="block w-full text-center px-8 py-4 bg-stone-900 text-white font-medium rounded-none hover:bg-stone-800 transition-colors tracking-wide uppercase"
              >
                Book This Room
              </a>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
