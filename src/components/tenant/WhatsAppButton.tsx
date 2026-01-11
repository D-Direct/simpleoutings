"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  propertyName?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function WhatsAppButton({
  phoneNumber,
  message,
  propertyName,
  variant = "outline",
  size = "lg",
  className = ""
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const defaultMessage = propertyName
      ? `Hi, I'm interested in ${propertyName}. I'd like to know more about availability and booking.`
      : "Hi, I'm interested in your property. I'd like to know more about availability and booking.";

    const finalMessage = message || defaultMessage;
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`bg-[#25D366] hover:bg-[#20BA5A] text-white border-[#25D366] ${className}`}
    >
      <MessageCircle className="w-5 h-5 mr-2" />
      Chat on WhatsApp
    </Button>
  );
}
