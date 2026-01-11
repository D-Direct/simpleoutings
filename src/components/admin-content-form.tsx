"use client";

import { useActionState, useEffect, useState } from "react";
import { updateProperty, ActionState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Globe, Info, LayoutTemplate, Share2, Upload, Image as ImageIcon, Sparkles, Quote, Images, BedDouble, CalendarDays, MessageSquare } from "lucide-react";
import { AmenitiesManager } from "@/components/AmenitiesManager";
import { TestimonialsManager } from "@/components/TestimonialsManager";
import { GalleryManager } from "@/components/GalleryManager";
import { RoomsManager } from "@/components/RoomsManager";
import { BookingsManager } from "@/components/BookingsManager";
import { InquiriesManager } from "@/components/InquiriesManager";

interface AdminContentFormProps {
  property: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    description: string | null;
    heroTitle: string | null;
    heroSubtitle: string | null;
    heroImage: string | null;
    aboutTitle: string | null;
    aboutContent: string | null;
    aboutImage: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    whatsappNumber: string | null;
    footerBio: string | null;
    connectTitle: string | null;
    connectDescription: string | null;
    locationAddress: string | null;
    latitude: number | null;
    longitude: number | null;
    amenities: Array<{
      id: string;
      name: string;
      icon: string | null;
      description: string | null;
    }> | undefined;
    testimonials: Array<{
      id: string;
      content: string;
      author: string;
      location: string | null;
    }> | undefined;
    galleryImages: Array<{
      id: string;
      url: string;
      alt: string | null;
    }> | undefined;
    rooms: Array<{
      id: string;
      type: string;
      description: string | null;
      priceLKR: number;
      capacity: number;
      image: string | null;
      features: string[] | null;
    }> | undefined;
    bookings: Array<{
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
    }> | undefined;
    inquiries: Array<{
      id: string;
      guestName: string;
      guestEmail: string;
      guestPhone: string | null;
      message: string;
      status: string;
      createdAt: Date;
    }> | undefined;
  };
}

export function AdminContentForm({ property }: AdminContentFormProps) {
  const [state, formAction, isPending] = useActionState(updateProperty, { success: false });

  // Get initial tab from localStorage or URL hash
  const getInitialTab = () => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) return hash;
      return localStorage.getItem(`activeTab-${property.id}`) || "general";
    }
    return "general";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Form state
  const [formData, setFormData] = useState({
    name: property.name,
    description: property.description || "",
    email: property.email || "",
    phone: property.phone || "",
    address: property.address || "",
    whatsappNumber: property.whatsappNumber || "",
    heroTitle: property.heroTitle || "",
    heroSubtitle: property.heroSubtitle || "",
    aboutTitle: property.aboutTitle || "",
    aboutContent: property.aboutContent || "",
    footerBio: property.footerBio || "",
    connectTitle: property.connectTitle || "",
    connectDescription: property.connectDescription || "",
    locationAddress: property.locationAddress || "",
  });

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`activeTab-${property.id}`, activeTab);
      window.location.hash = activeTab;
    }
  }, [activeTab, property.id]);

  // Update form data when property changes (after save)
  useEffect(() => {
    setFormData({
      name: property.name,
      description: property.description || "",
      email: property.email || "",
      phone: property.phone || "",
      address: property.address || "",
      whatsappNumber: property.whatsappNumber || "",
      heroTitle: property.heroTitle || "",
      heroSubtitle: property.heroSubtitle || "",
      aboutTitle: property.aboutTitle || "",
      aboutContent: property.aboutContent || "",
      footerBio: property.footerBio || "",
      connectTitle: property.connectTitle || "",
      connectDescription: property.connectDescription || "",
      locationAddress: property.locationAddress || "",
    });
  }, [property]);

  useEffect(() => {
    if (state.success) {
      toast.success("Changes saved successfully!");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Determine if current tab needs the save button
  const showSaveButton = ["general", "hero", "about", "social"].includes(activeTab);

  return (
    <div className="space-y-8">
      {showSaveButton && (
        <div className="flex justify-between items-center bg-white p-4 border rounded-xl shadow-sm sticky top-20 z-20">
          <div>
            <h2 className="text-xl font-bold font-serif">{formData.name || property.name}</h2>
            <p className="text-stone-500 text-sm">Property ID: {property.id}</p>
          </div>
          <Button 
            disabled={isPending} 
            className="bg-stone-900 text-white rounded-full px-8"
            form="property-form"
            type="submit"
          >
            {isPending ? "Saving..." : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}

      {!showSaveButton && (
        <div className="flex justify-between items-center bg-white p-4 border rounded-xl shadow-sm sticky top-20 z-20">
          <div>
            <h2 className="text-xl font-bold font-serif">{formData.name || property.name}</h2>
            <p className="text-stone-500 text-sm">Property ID: {property.id}</p>
          </div>
        </div>
      )}

      <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-stone-100 p-1 rounded-full mb-8">
          <TabsTrigger value="general" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Globe className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="hero" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <LayoutTemplate className="w-4 h-4 mr-2" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="about" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Info className="w-4 h-4 mr-2" />
            About
          </TabsTrigger>
          <TabsTrigger value="amenities" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Amenities
          </TabsTrigger>
          <TabsTrigger value="rooms" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <BedDouble className="w-4 h-4 mr-2" />
            Rooms
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Quote className="w-4 h-4 mr-2" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Images className="w-4 h-4 mr-2" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="bookings" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <CalendarDays className="w-4 h-4 mr-2" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Inquiries
          </TabsTrigger>
          <TabsTrigger value="social" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Share2 className="w-4 h-4 mr-2" />
            Connect
          </TabsTrigger>
        </TabsList>

        <form id="property-form" action={formAction}>
          <input type="hidden" name="propertyId" value={property.id} />
          
          <TabsContent value="general">
            <Card className="border-stone-200">
              <CardHeader>
                <CardTitle className="font-serif">General Information</CardTitle>
                <CardDescription>Basic details about your property that appear across the site.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="logo">Property Logo</Label>
                  <Input
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/*"
                  />
                  {property.logo && (
                    <div className="mt-2">
                      <p className="text-xs text-stone-500 mb-2">Current logo:</p>
                      <img
                        src={property.logo}
                        alt="Current logo"
                        className="h-16 object-contain bg-stone-50 p-2 rounded border"
                      />
                    </div>
                  )}
                  <p className="text-xs text-stone-500">Upload your property logo. If no logo is uploaded, your property name will be displayed as text.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Property Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Main Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange}
                    rows={4} 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Public Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@yourproperty.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+94 77 123 4567"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp Number (with country code)</Label>
                  <Input
                    id="whatsappNumber"
                    name="whatsappNumber"
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    placeholder="94771234567"
                  />
                  <p className="text-xs text-stone-500">Format: Country code + number without + or spaces (e.g., 94771234567 for Sri Lanka)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Physical Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street, Kandy, Sri Lanka"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero">
            <Card className="border-stone-200">
              <CardHeader>
                <CardTitle className="font-serif">Hero Section</CardTitle>
                <CardDescription>The first thing guests see when they visit your site.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Hero Headline</Label>
                  <Input 
                    id="heroTitle" 
                    name="heroTitle" 
                    value={formData.heroTitle} 
                    onChange={handleChange}
                    placeholder="e.g. Your Private Sanctuary in Kandy" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Input 
                    id="heroSubtitle" 
                    name="heroSubtitle" 
                    value={formData.heroSubtitle} 
                    onChange={handleChange}
                    placeholder="e.g. Experience the mountain mist at your doorstep." 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroImage">Hero Background Image</Label>
                  {property.heroImage && (
                    <div className="relative w-full h-48 mb-2 rounded-lg overflow-hidden border border-stone-200">
                      <img src={property.heroImage} alt="Current hero image" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs text-stone-600 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        Current Image
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input 
                      id="heroImage" 
                      name="heroImage" 
                      type="file" 
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="cursor-pointer"
                    />
                    <Upload className="w-4 h-4 text-stone-400" />
                  </div>
                  <p className="text-xs text-stone-500">Upload a new image to replace the current one. Max 5MB. JPEG, PNG, or WebP.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card className="border-stone-200">
              <CardHeader>
                <CardTitle className="font-serif">About Section</CardTitle>
                <CardDescription>Tell the story of your homestay.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="aboutTitle">About Headline</Label>
                  <Input 
                    id="aboutTitle" 
                    name="aboutTitle" 
                    value={formData.aboutTitle} 
                    onChange={handleChange}
                    placeholder="e.g. More Than Just a Stay" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutContent">About Narrative</Label>
                  <Textarea 
                    id="aboutContent" 
                    name="aboutContent" 
                    value={formData.aboutContent} 
                    onChange={handleChange}
                    rows={8} 
                    placeholder="Describe the history, the vibe, and what makes your place special." 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutImage">About Section Image</Label>
                  {property.aboutImage && (
                    <div className="relative w-full h-48 mb-2 rounded-lg overflow-hidden border border-stone-200">
                      <img src={property.aboutImage} alt="Current about image" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs text-stone-600 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        Current Image
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input 
                      id="aboutImage" 
                      name="aboutImage" 
                      type="file" 
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="cursor-pointer"
                    />
                    <Upload className="w-4 h-4 text-stone-400" />
                  </div>
                  <p className="text-xs text-stone-500">Upload a new image to replace the current one. Max 5MB. JPEG, PNG, or WebP.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <div className="space-y-6">
              <Card className="border-stone-200">
                <CardHeader>
                  <CardTitle className="font-serif">Contact Section</CardTitle>
                  <CardDescription>Customize the text in the contact/inquiry section.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="connectTitle">Contact Headline</Label>
                    <Input
                      id="connectTitle"
                      name="connectTitle"
                      value={formData.connectTitle}
                      onChange={handleChange}
                      placeholder="e.g. Plan Your Escape"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="connectDescription">Contact Description</Label>
                    <Textarea
                      id="connectDescription"
                      name="connectDescription"
                      value={formData.connectDescription}
                      onChange={handleChange}
                      rows={3}
                      placeholder="e.g. Whether you have a specific request or just want to say hello, we'd love to hear from you."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-stone-200">
                <CardHeader>
                  <CardTitle className="font-serif">Location & Map</CardTitle>
                  <CardDescription>Add your property location to display a map on the contact section.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="locationAddress">Full Address for Google Maps</Label>
                    <Textarea
                      id="locationAddress"
                      name="locationAddress"
                      value={formData.locationAddress}
                      onChange={handleChange}
                      rows={2}
                      placeholder="e.g. 123 Hill Street, Kandy 20000, Sri Lanka"
                    />
                    <p className="text-xs text-stone-500">This address will be used to display your property on Google Maps. Be as specific as possible.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-stone-200">
                <CardHeader>
                  <CardTitle className="font-serif">Footer Bio</CardTitle>
                  <CardDescription>Short bio that appears in the website footer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="footerBio">Footer Bio</Label>
                    <Textarea
                      id="footerBio"
                      name="footerBio"
                      value={formData.footerBio}
                      onChange={handleChange}
                      rows={3}
                      placeholder="A short 2-3 sentence bio for the footer."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </form>

        <TabsContent value="amenities">
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="font-serif">Amenities</CardTitle>
              <CardDescription>Highlight what makes your property special.</CardDescription>
            </CardHeader>
            <CardContent>
              <AmenitiesManager propertyId={property.id} amenities={property.amenities || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms">
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="font-serif">Accommodation</CardTitle>
              <CardDescription>Add and manage different room types with pricing and features.</CardDescription>
            </CardHeader>
            <CardContent>
              <RoomsManager propertyId={property.id} rooms={property.rooms || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials">
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="font-serif">Testimonials</CardTitle>
              <CardDescription>Share what your guests are saying.</CardDescription>
            </CardHeader>
            <CardContent>
              <TestimonialsManager propertyId={property.id} testimonials={property.testimonials || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery">
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="font-serif">Photo Gallery</CardTitle>
              <CardDescription>Showcase your property with beautiful images.</CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryManager propertyId={property.id} images={property.galleryImages || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="font-serif">Bookings & Reservations</CardTitle>
              <CardDescription>Manage booking requests from your guests.</CardDescription>
            </CardHeader>
            <CardContent>
              <BookingsManager propertyId={property.id} bookings={property.bookings || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inquiries">
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="font-serif">Guest Inquiries</CardTitle>
              <CardDescription>View and manage inquiries from potential guests.</CardDescription>
            </CardHeader>
            <CardContent>
              <InquiriesManager propertyId={property.id} inquiries={property.inquiries || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

