import { db } from "../src/db";
import { subscriptionPlans } from "../src/db/schema";

async function seedSubscriptionPlans() {
    console.log("🌱 Seeding subscription plans...");

    try {
        const plans = await db.insert(subscriptionPlans).values([
            {
                name: "Free",
                description: "Forever free",
                priceMonthly: 0, // LKR
                currency: "LKR",
                maxProperties: 1,
                features: JSON.parse(JSON.stringify([
                    "Site under subdomain",
                    "\"Built with SimpleOutings\" badge",
                    "Single property"
                ])),
                isActive: true,
            },
            {
                name: "Starter",
                description: "For individual properties",
                priceMonthly: 1240, // LKR
                currency: "LKR",
                maxProperties: 1,
                features: JSON.parse(JSON.stringify([
                    "Custom domain support",
                    "No branding badge",
                    "Single site"
                ])),
                isActive: true,
            },
            {
                name: "Pro",
                description: "For growing businesses",
                priceMonthly: 2490, // LKR
                currency: "LKR",
                maxProperties: 999, // Multiple sites
                features: JSON.parse(JSON.stringify([
                    "All Starter features",
                    "Multiple sites under one domain",
                    "Priority support"
                ])),
                isActive: true,
            },
            {
                name: "Max",
                description: "For property managers",
                priceMonthly: 4990, // LKR
                currency: "LKR",
                maxProperties: 999, // Unlimited
                features: JSON.parse(JSON.stringify([
                    "All Pro features",
                    "Unlimited sites",
                    "WhatsApp integration"
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
