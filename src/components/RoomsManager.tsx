"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { createRoom, updateRoom, deleteRoom, RoomActionState } from "@/lib/room-actions";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Users, DollarSign, Upload, X } from "lucide-react";

interface Room {
  id: string;
  type: string;
  description: string | null;
  priceLKR: number;
  capacity: number;
  image: string | null;
  features: string[] | null;
}

interface RoomsManagerProps {
  propertyId: string;
  rooms: Room[];
}

export function RoomsManager({ propertyId, rooms }: RoomsManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    setDeleteId(roomId);
    const result = await deleteRoom(roomId);

    if (result.success) {
      toast.success("Room deleted successfully");
      window.location.reload();
    } else {
      toast.error(result.error || "Failed to delete room");
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-stone-500">
          Manage your accommodation options. Add different room types with pricing and features.
        </p>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-stone-900 hover:bg-stone-800"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      {/* Add Room Form */}
      {isAdding && (
        <RoomForm
          propertyId={propertyId}
          onCancel={() => setIsAdding(false)}
          isNew
        />
      )}

      {/* Rooms List */}
      <div className="grid grid-cols-1 gap-4">
        {rooms.length === 0 && !isAdding && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-stone-100 p-3 mb-4">
                <Users className="w-6 h-6 text-stone-400" />
              </div>
              <p className="text-stone-500 text-sm mb-4">No rooms added yet</p>
              <Button
                onClick={() => setIsAdding(true)}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Room
              </Button>
            </CardContent>
          </Card>
        )}

        {rooms.map((room) =>
          editingId === room.id ? (
            <RoomForm
              key={room.id}
              propertyId={propertyId}
              room={room}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <Card key={room.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Room Image */}
                  <div className="w-full md:w-48 h-48 bg-stone-100 flex-shrink-0">
                    {room.image ? (
                      <img
                        src={room.image}
                        alt={room.type}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <Upload className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Room Details */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-stone-900">{room.type}</h3>
                        <p className="text-sm text-stone-500 mt-1">{room.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setEditingId(room.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(room.id)}
                          variant="outline"
                          size="sm"
                          disabled={deleteId === room.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-6 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-stone-400" />
                        <span className="font-semibold text-stone-900">
                          LKR {room.priceLKR.toLocaleString()}
                        </span>
                        <span className="text-stone-500">/ night</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-stone-400" />
                        <span className="text-stone-600">Up to {room.capacity} guests</span>
                      </div>
                    </div>

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
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

function RoomForm({
  propertyId,
  room,
  onCancel,
  isNew = false,
}: {
  propertyId: string;
  room?: Room;
  onCancel: () => void;
  isNew?: boolean;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(room?.image || null);

  const createAction = createRoom.bind(null, propertyId);
  const updateAction = room ? updateRoom.bind(null, room.id) : null;

  const [createState, createFormAction, createPending] = useActionState(createAction, {});
  const [updateState, updateFormAction, updatePending] = useActionState(
    updateAction || createAction,
    {}
  );

  const state = isNew ? createState : updateState;
  const formAction = isNew ? createFormAction : updateFormAction;
  const isPending = isNew ? createPending : updatePending;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (state.success) {
    toast.success(isNew ? "Room created successfully" : "Room updated successfully");
    setTimeout(() => window.location.reload(), 500);
  }

  if (state.error) {
    toast.error(state.error);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-stone-900">
            {isNew ? "Add New Room" : "Edit Room"}
          </h3>
          <Button onClick={onCancel} variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Room Type *</Label>
              <Input
                id="type"
                name="type"
                placeholder="e.g., Deluxe Room, Suite"
                defaultValue={room?.type}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (Guests) *</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                placeholder="2"
                defaultValue={room?.capacity}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceLKR">Price per Night (LKR) *</Label>
            <Input
              id="priceLKR"
              name="priceLKR"
              type="number"
              step="0.01"
              min="0"
              placeholder="5000"
              defaultValue={room?.priceLKR}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe this room type..."
              rows={3}
              defaultValue={room?.description || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Input
              id="features"
              name="features"
              placeholder="King Bed, Ocean View, Private Balcony, Mini Bar"
              defaultValue={room?.features?.join(", ") || ""}
            />
            <p className="text-xs text-stone-500">Separate features with commas</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Room Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" onClick={onCancel} variant="outline" disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" className="bg-stone-900 hover:bg-stone-800" disabled={isPending}>
              {isPending ? "Saving..." : isNew ? "Create Room" : "Update Room"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
