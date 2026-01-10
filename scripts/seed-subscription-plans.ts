import { db } from "../src/db";
import { subscriptionPlans } from "../src/db/schema";

async function seedSubscriptionPlans() {
    console.log("🌱 Seeding subscription plans...");

    try {
        const plans = await db.insert(subscriptionPlans).values([
            {
                name: "Basic",
                description: "Perfect for small homestays getting started",
                priceMonthly: 2500, // LKR
                currency: "LKR",
                maxProperties: 1,
                features: JSON.parse(JSON.stringify([
                    "1 Property Website",
                    "Unlimited Rooms",
                    "Booking Management",
                    "Contact Forms",
                    "Email Notifications",
                    "Image Gallery",
                    "Mobile Responsive"
                ])),
                isActive: true,
            },
            {
                name: "Pro",
                description: "For growing businesses with multiple properties",
                priceMonthly: 5000, // LKR
                currency: "LKR",
                maxProperties: 3,
                features: JSON.parse(JSON.stringify([
                    "Up to 3 Property Websites",
                    "Unlimited Rooms",
                    "Priority Support",
                    "Custom Domain Support",
                    "Advanced Analytics",
                    "Custom Branding",
                    "All Basic Features"
                ])),
                isActive: true,
            },
            {
                name: "Enterprise",
                description: "For large hotel chains and property managers",
                priceMonthly: 10000, // LKR
                currency: "LKR",
                maxProperties: 999,
                features: JSON.parse(JSON.stringify([
                    "Unlimited Properties",
                    "Dedicated Account Manager",
                    "White Label Solution",
                    "API Access",
                    "Custom Integrations",
                    "24/7 Premium Support",
                    "All Pro Features"
                ])),
                isActive: true,
            },
        ]).returning();

        console.log(`✅ Created ${plans.length} subscription plans:`);
        plans.forEach(plan => {
            console.log(`   - ${plan.name}: ${plan.priceMonthly} ${plan.currency}/month`);
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding subscription plans:", error);
        process.exit(1);
    }
}

seedSubscriptionPlans();
