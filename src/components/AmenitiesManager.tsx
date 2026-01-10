"use client";

import { useState, useActionState } from "react";
import { createAmenity, deleteAmenity, AmenityActionState } from "@/lib/amenity-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Wifi, Car, Waves, Coffee, Wind, Tv, UtensilsCrossed, Dumbbell, Trash2, Plus, X } from "lucide-react";
import { useEffect } from "react";

interface Amenity {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
}

interface AmenitiesManagerProps {
  propertyId: string;
  amenities: Amenity[];
}

const ICON_OPTIONS = [
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "car", label: "Parking", icon: Car },
  { value: "waves", label: "Pool", icon: Waves },
  { value: "coffee", label: "Breakfast", icon: Coffee },
  { value: "wind", label: "AC", icon: Wind },
  { value: "tv", label: "TV", icon: Tv },
  { value: "utensils", label: "Restaurant", icon: UtensilsCrossed },
  { value: "dumbbell", label: "Gym", icon: Dumbbell },
];

export function AmenitiesManager({ propertyId, amenities: initialAmenities }: AmenitiesManagerProps) {
  const [amenities, setAmenities] = useState<Amenity[]>(initialAmenities);
  const [showForm, setShowForm] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("wifi");

  const createAction = createAmenity.bind(null, propertyId);
  const [createState, createFormAction, isCreating] = useActionState(createAction, { success: false });

  useEffect(() => {
    if (createState.success) {
      toast.success("Amenity added successfully!");
      setShowForm(false);
      // Refresh the page to get updated amenities
      window.location.reload();
    } else if (createState.error) {
      toast.error(createState.error);
    }
  }, [createState]);

  const handleDelete = async (amenityId: string) => {
    if (!confirm("Are you sure you want to delete this amenity?")) return;

    const result = await deleteAmenity(amenityId);
    if (result.success) {
      toast.success("Amenity deleted!");
      setAmenities(amenities.filter(a => a.id !== amenityId));
    } else {
      toast.error(result.error || "Failed to delete amenity");
    }
  };

  const getIconComponent = (iconValue: string | null) => {
    const iconOption = ICON_OPTIONS.find(opt => opt.value === iconValue);
    return iconOption ? iconOption.icon : Wifi;
  };

  return (
    <div className="space-y-6">
      {/* Existing Amenities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {amenities.map((amenity) => {
          const IconComponent = getIconComponent(amenity.icon);
          return (
            <Card key={amenity.id} className="border-stone-200">
              <CardContent className="p-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900">{amenity.name}</h4>
                    {amenity.description && (
                      <p className="text-sm text-stone-500 mt-1">{amenity.description}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(amenity.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {amenities.length === 0 && !showForm && (
        <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-lg">
          <p className="text-stone-400 mb-4">No amenities added yet</p>
          <Button onClick={() => setShowForm(true)} className="bg-stone-900 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Amenity
          </Button>
        </div>
      )}

      {/* Add New Amenity Form */}
      {showForm ? (
        <Card className="border-stone-300 bg-stone-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-stone-900">Add New Amenity</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <form action={createFormAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Amenity Name</Label>
                <Input id="name" name="name" placeholder="e.g. Free WiFi" required />
              </div>
              
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="grid grid-cols-4 gap-2">
                  {ICON_OPTIONS.map((option) => {
                    const IconComp = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedIcon(option.value)}
                        className={`p-3 border rounded-lg flex flex-col items-center gap-1 transition-colors ${
                          selectedIcon === option.value
                            ? "border-stone-900 bg-stone-900 text-white"
                            : "border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                        <span className="text-xs">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" name="icon" value={selectedIcon} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" name="description" placeholder="Brief description..." rows={2} />
              </div>

              <Button type="submit" disabled={isCreating} className="w-full bg-stone-900 text-white">
                {isCreating ? "Adding..." : "Add Amenity"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : amenities.length > 0 && (
        <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Another Amenity
        </Button>
      )}
    </div>
  );
}
