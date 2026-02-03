// Helper functions for subscription tier checks
// These are pure functions and don't need to be server actions

import type { getCurrentUser } from "./auth";

// Helper function to check if user can create more properties based on their tier
export function canCreateProperty(
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>,
  currentPropertyCount: number
): boolean {
  if (!user?.subscriptionPlan) return false;
  return currentPropertyCount < user.subscriptionPlan.maxProperties;
}

// Helper function to determine if badge should be shown based on plan
export function shouldShowBadge(
  plan: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>["subscriptionPlan"]
): boolean {
  // Show badge ONLY for Free tier (or no plan)
  // Hide badge for Starter, Pro, and Max tiers
  return !plan || plan.name === "Free";
}
