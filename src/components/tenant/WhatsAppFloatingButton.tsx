"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppFloatingButtonProps {
  phoneNumber: string;
  propertyName?: string;
}

export default function WhatsAppFloatingButton({ phoneNumber, propertyName }: WhatsAppFloatingButtonProps) {
  const handleClick = () => {
    const message = propertyName
      ? `Hi, I'm interested in ${propertyName}. I'd like to know more about availability and booking.`
      : "Hi, I'm interested in your property. I'd like to know more about availability and booking.";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-stone-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat on WhatsApp
      </span>
    </button>
  );
}
