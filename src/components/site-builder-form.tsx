"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProperty, type ActionState } from "@/lib/actions";
import { toast } from "sonner";
import { useEffect } from "react";

const initialState: ActionState = {
  error: "",
  success: false,
};

export function SiteBuilderForm() {
  const [state, formAction, isPending] = useActionState(createProperty, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success("Site created successfully!", {
        description: "You can now visit your new site.",
      });
    } else if (state.error) {
      toast.error("Failed to create site", {
        description: state.error,
      });
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6 max-w-xl mx-auto p-6 border rounded-lg shadow-sm bg-white dark:bg-zinc-950">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Create Your Site</h2>
        <p className="text-gray-500">Enter your homestay details below.</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Property Name</Label>
        <Input id="name" name="name" placeholder="e.g. Misty Heaven" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="Describe your property..." required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Subdomain (slug)</Label>
        <div className="flex items-center space-x-2">
          <Input id="slug" name="slug" placeholder="misty-heaven" required />
          <span className="text-gray-500">.staylaunch.lk</span>
        </div>
        <p className="text-xs text-gray-400">This will be your unique website address.</p>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating..." : "Launch Site"}
      </Button>
    </form>
  );
}
