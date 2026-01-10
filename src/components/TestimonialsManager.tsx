"use client";

import { useState, useActionState, useEffect } from "react";
import { createTestimonial, deleteTestimonial, TestimonialActionState } from "@/lib/testimonial-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Quote, Trash2, Plus, X } from "lucide-react";

interface Testimonial {
  id: string;
  content: string;
  author: string;
  location: string | null;
}

interface TestimonialsManagerProps {
  propertyId: string;
  testimonials: Testimonial[];
}

export function TestimonialsManager({ propertyId, testimonials: initialTestimonials }: TestimonialsManagerProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [showForm, setShowForm] = useState(false);

  const createAction = createTestimonial.bind(null, propertyId);
  const [createState, createFormAction, isCreating] = useActionState(createAction, { success: false });

  useEffect(() => {
    if (createState.success) {
      toast.success("Testimonial added successfully!");
      setShowForm(false);
      window.location.reload();
    } else if (createState.error) {
      toast.error(createState.error);
    }
  }, [createState]);

  const handleDelete = async (testimonialId: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    const result = await deleteTestimonial(testimonialId);
    if (result.success) {
      toast.success("Testimonial deleted!");
      setTestimonials(testimonials.filter(t => t.id !== testimonialId));
    } else {
      toast.error(result.error || "Failed to delete testimonial");
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Testimonials */}
      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border-stone-200 bg-stone-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Quote className="w-8 h-8 text-stone-300 mb-3" />
                  <p className="text-stone-700 italic mb-4 leading-relaxed">&quot;{testimonial.content}&quot;</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-stone-900">{testimonial.author}</span>
                    {testimonial.location && (
                      <>
                        <span className="text-stone-300">•</span>
                        <span className="text-stone-500">{testimonial.location}</span>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(testimonial.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials.length === 0 && !showForm && (
        <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-lg">
          <Quote className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-400 mb-4">No testimonials added yet</p>
          <Button onClick={() => setShowForm(true)} className="bg-stone-900 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Testimonial
          </Button>
        </div>
      )}

      {/* Add New Testimonial Form */}
      {showForm ? (
        <Card className="border-stone-300 bg-stone-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-stone-900">Add New Testimonial</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <form action={createFormAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Testimonial Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  placeholder="What did the guest say about their stay?" 
                  rows={4}
                  required 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Guest Name</Label>
                  <Input id="author" name="author" placeholder="e.g. John Smith" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input id="location" name="location" placeholder="e.g. London, UK" />
                </div>
              </div>

              <Button type="submit" disabled={isCreating} className="w-full bg-stone-900 text-white">
                {isCreating ? "Adding..." : "Add Testimonial"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : testimonials.length > 0 && (
        <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Another Testimonial
        </Button>
      )}
    </div>
  );
}
