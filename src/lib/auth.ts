"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { users, subscriptionPlans } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return null;
  }

  // Get or create user in our database (WITH subscription plan)
  let dbUser = await db.query.users.findFirst({
    where: eq(users.email, authUser.email!),
    with: {
      subscriptionPlan: true, // Include plan details
    },
  });

  if (!dbUser) {
    try {
      // Get the Free plan to assign to new users
      const freePlan = await db.query.subscriptionPlans.findFirst({
        where: eq(subscriptionPlans.name, "Free"),
      });

      console.log("Free plan found:", freePlan);

      // Create user in our database with Free plan
      const [newUser] = await db
        .insert(users)
        .values({
          id: authUser.id,
          email: authUser.email!,
          subscriptionPlanId: freePlan?.id,
          subscriptionStatus: "active",
          subscriptionStartDate: new Date(),
        })
        .returning();

      console.log("New user created:", newUser);

      // Fetch the newly created user WITH subscription plan
      dbUser = await db.query.users.findFirst({
        where: eq(users.id, newUser.id),
        with: {
          subscriptionPlan: true,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      throw error;
    }
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
