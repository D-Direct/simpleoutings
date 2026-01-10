"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();

      toast.success("Logged out successfully");
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="text-stone-600 hover:text-stone-900"
      size="sm"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
}
