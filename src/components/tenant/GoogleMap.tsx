"use client";

interface GoogleMapProps {
  address: string;
}

export default function GoogleMap({ address }: GoogleMapProps) {
  // Encode the address for use in Google Maps URL
  const encodedAddress = encodeURIComponent(address);

  // Google Maps Embed URL (no API key required for basic embedding)
  const mapUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-stone-200 shadow-lg">
      <iframe
        title="Property Location"
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
