import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function verifyTables() {
    console.log("🔍 Checking database tables...\n");

    try {
        // Check if Superadmin table exists
        const superadminCheck = await db.execute(sql`
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'Superadmin'
            );
        `);

        const superadminExists = superadminCheck.rows[0]?.exists;

        console.log(`Superadmin table: ${superadminExists ? '✅ EXISTS' : '❌ MISSING'}`);

        // Check if SubscriptionPlan table exists
        const planCheck = await db.execute(sql`
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'SubscriptionPlan'
            );
        `);

        const planExists = planCheck.rows[0]?.exists;

        console.log(`SubscriptionPlan table: ${planExists ? '✅ EXISTS' : '❌ MISSING'}`);

        // Check if Payment table exists
        const paymentCheck = await db.execute(sql`
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'Payment'
            );
        `);

        const paymentExists = paymentCheck.rows[0]?.exists;

        console.log(`Payment table: ${paymentExists ? '✅ EXISTS' : '❌ MISSING'}`);

        // Check if User table has new columns
        const userColumnsCheck = await db.execute(sql`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'User'
            AND column_name IN ('subscriptionStatus', 'subscriptionPlanId', 'nextPaymentDue');
        `);

        const hasNewColumns = userColumnsCheck.rows.length === 3;

        console.log(`User table new columns: ${hasNewColumns ? '✅ EXISTS' : '❌ MISSING'}`);

        if (!superadminExists || !planExists || !paymentExists || !hasNewColumns) {
            console.log("\n⚠️  Some tables are missing!");
            console.log("\n📝 To fix this, run:");
            console.log("   npx drizzle-kit push");
            process.exit(1);
        } else {
            console.log("\n✅ All superadmin tables exist!");

            // Count superadmins
            const adminCount = await db.execute(sql`SELECT COUNT(*) FROM "Superadmin";`);
            console.log(`\n👤 Superadmins: ${adminCount.rows[0]?.count || 0}`);

            // Count subscription plans
            const planCount = await db.execute(sql`SELECT COUNT(*) FROM "SubscriptionPlan";`);
            console.log(`📋 Subscription plans: ${planCount.rows[0]?.count || 0}`);
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error checking tables:", error);
        process.exit(1);
    }
}

verifyTables();