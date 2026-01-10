"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return null;
  }

  // Get or create user in our database
  let dbUser = await db.query.users.findFirst({
    where: eq(users.email, authUser.email!),
  });

  if (!dbUser) {
    // Create user in our database if they don't exist
    const [newUser] = await db
      .insert(users)
      .values({
        id: authUser.id,
        email: authUser.email!,
      })
      .returning();
    dbUser = newUser;
  }

  return dbUser;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
