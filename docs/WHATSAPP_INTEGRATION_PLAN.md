# WhatsApp Integration Plan for SimpleOutings

## Overview
Enable property owners to receive booking inquiries and guest messages directly via WhatsApp, providing instant notification and easy communication.

---

## Use Cases

### 1. **Instant Inquiry Notifications**
- When a guest submits an inquiry form, property owner receives WhatsApp message
- Message contains guest details, dates, and inquiry text
- Owner can respond directly via WhatsApp

### 2. **Booking Confirmation Requests**
- When a guest requests a booking, owner gets WhatsApp notification
- Includes room type, dates, number of guests, and special requests
- Quick approve/reject workflow

### 3. **Direct WhatsApp Button**
- "Chat on WhatsApp" button on property website
- Allows guests to start conversation directly
- Pre-filled message template

---

## Technical Requirements

### Option 1: WhatsApp Business API (Official - Recommended)
**Pros:**
- Official Meta/WhatsApp solution
- Automated messages allowed
- Multi-device support
- Business verification badge
- Templates for automated messages

**Cons:**
- Requires Meta Business verification
- Monthly costs (varies by volume)
- Complex setup process
- Template approval needed for automated messages

**Requirements:**
1. Meta Business Manager account
2. WhatsApp Business Account
3. Business verification documents
4. Phone number dedicated to business
5. API access approval from Meta

**Cost:**
- Conversation-based pricing
- Free tier: 1,000 conversations/month
- After free tier: ~$0.005-$0.09 per conversation (varies by country)
- Sri Lanka pricing: ~$0.016 per business-initiated conversation

### Option 2: WhatsApp Business App + Click-to-Chat (Simple)
**Pros:**
- Free to use
- No API setup required
- Works immediately
- Easy for property owners

**Cons:**
- Manual messaging only
- No automated notifications
- Single device only
- Not scalable for multiple properties

**Requirements:**
1. WhatsApp Business App installed on owner's phone
2. Business phone number
3. Property profile setup

### Option 3: Third-Party Services (Twilio, MessageBird, etc.)
**Pros:**
- Easier setup than official API
- Good documentation
- Developer-friendly

**Cons:**
- Monthly subscription costs
- Additional layer of dependency
- Twilio WhatsApp: $0.005-$0.09 per message

---

## Recommended Implementation Strategy

### Phase 1: Click-to-Chat Button (Immediate - Free)
**Implementation:**
1. Add WhatsApp phone number field to property settings
2. Create "Chat on WhatsApp" button component
3. Generate WhatsApp deep link with pre-filled message
4. Place button in:
   - Contact section
   - Booking form (alternative to form submission)
   - Header (floating button)

**Code Example:**
```
https://wa.me/94771234567?text=Hi%2C%20I'm%20interested%20in%20booking%20at%20YourProperty
```

**Database Changes:**
- Add `whatsappNumber` field to Property table
- Format: Country code + number (e.g., "94771234567")

**Effort:** 2-3 hours
**Cost:** Free

---

### Phase 2: Manual Notifications via Click-to-Chat (Short-term)
**Implementation:**
1. When inquiry is submitted, show success message with:
   - "We've received your inquiry!"
   - "Click here to chat directly with the owner on WhatsApp"
   - WhatsApp button with pre-filled message including inquiry details

**Message Template:**
```
Hi, I just submitted an inquiry on your website!

Name: John Doe
Email: john@example.com
Phone: +94771234567
Message: I'm interested in booking from Jan 15-18...

Looking forward to hearing from you!
```

**Effort:** 1-2 hours
**Cost:** Free

---

### Phase 3: Automated Notifications via WhatsApp Business API (Long-term)
**Implementation:**

#### 3.1 Setup Requirements
1. Create Meta Business Manager account
2. Apply for WhatsApp Business API access
3. Complete business verification
4. Set up webhook endpoint
5. Create and submit message templates for approval

#### 3.2 Database Changes
```sql
-- Add WhatsApp settings to Property table
ALTER TABLE "Property"
ADD COLUMN "whatsappNumber" text,
ADD COLUMN "whatsappEnabled" boolean DEFAULT false,
ADD COLUMN "whatsappNotifications" boolean DEFAULT true;

-- Track WhatsApp message delivery
CREATE TABLE "WhatsAppMessage" (
  "id" text PRIMARY KEY,
  "propertyId" text NOT NULL REFERENCES "Property"("id"),
  "recipientNumber" text NOT NULL,
  "messageType" text NOT NULL, -- 'inquiry', 'booking', 'reminder'
  "templateName" text,
  "status" text DEFAULT 'pending', -- pending, sent, delivered, read, failed
  "messageId" text, -- WhatsApp message ID
  "errorMessage" text,
  "metadata" jsonb,
  "createdAt" timestamp DEFAULT now(),
  "sentAt" timestamp,
  "deliveredAt" timestamp,
  "readAt" timestamp
);
```

#### 3.3 Message Templates (Need Meta Approval)

**Template 1: New Inquiry**
```
Hello {{owner_name}},

You have a new inquiry from {{guest_name}}!

📅 Check-in: {{checkin_date}}
📅 Check-out: {{checkout_date}}
👥 Guests: {{num_guests}}

Message: {{inquiry_message}}

📧 Email: {{guest_email}}
📱 Phone: {{guest_phone}}

Reply to this message to contact the guest directly.
```

**Template 2: Booking Request**
```
Hello {{owner_name}},

New booking request for {{property_name}}!

👤 Guest: {{guest_name}}
📅 Dates: {{checkin_date}} to {{checkout_date}}
🛏️ Room: {{room_type}}
👥 Guests: {{num_guests}}
💰 Total: LKR {{total_price}}

Special requests: {{special_requests}}

Log in to approve: {{dashboard_link}}
```

#### 3.4 Integration Flow
```
1. Guest submits inquiry/booking
   ↓
2. Save to database
   ↓
3. Trigger WhatsApp notification function
   ↓
4. Call WhatsApp API with approved template
   ↓
5. Log message status in WhatsAppMessage table
   ↓
6. Update status via webhook when delivered/read
```

#### 3.5 API Integration
**Service Provider Options:**

**Option A: Meta Cloud API (Direct)**
- Endpoint: `https://graph.facebook.com/v18.0/{phone_number_id}/messages`
- Authentication: Access token
- Free tier: 1,000 conversations/month
- Best for: Long-term, official solution

**Option B: Twilio WhatsApp API**
- Endpoint: Twilio's WhatsApp API
- Authentication: Account SID + Auth Token
- Pricing: $0.005 per message
- Best for: Easier setup, faster deployment

**Option C: MessageBird**
- Similar to Twilio
- Competitive pricing
- Good documentation

**Effort:** 20-30 hours (including verification wait time)
**Cost:**
- Development: Free (if done in-house)
- Monthly: $0-50/month (depending on volume)
- Per message: $0.005-$0.016 per notification

---

## Feature Breakdown

### Settings Page (Property Owner)
```
WhatsApp Integration
├── WhatsApp Business Number: [+94 77 123 4567]
├── ☑ Enable WhatsApp chat button on website
├── ☑ Receive inquiry notifications via WhatsApp
├── ☑ Receive booking notifications via WhatsApp
└── Test Connection [Button]
```

### Frontend Components

**1. WhatsApp Floating Button**
```tsx
// Floating button in bottom-right corner
<WhatsAppFloatingButton phoneNumber={property.whatsappNumber} />
```

**2. Click-to-Chat in Contact Section**
```tsx
// Next to "Send Inquiry" button
<Button variant="outline" onClick={openWhatsApp}>
  <WhatsAppIcon /> Chat on WhatsApp
</Button>
```

**3. Quick Contact in Booking Form**
```tsx
// Alternative to form submission
<div className="text-center">
  <p>Prefer to chat directly?</p>
  <Button variant="ghost" onClick={openWhatsApp}>
    Message us on WhatsApp
  </Button>
</div>
```

---

## Implementation Roadmap

### Week 1: Phase 1 (Click-to-Chat)
- [ ] Add `whatsappNumber` field to Property schema
- [ ] Add WhatsApp settings to admin settings page
- [ ] Create WhatsApp button components
- [ ] Add floating WhatsApp button to tenant sites
- [ ] Add WhatsApp option in contact section
- [ ] Test on multiple devices

### Week 2: Phase 2 (Manual Notifications)
- [ ] Update inquiry success message
- [ ] Pre-fill WhatsApp message with inquiry details
- [ ] Update booking success message
- [ ] Pre-fill WhatsApp message with booking details
- [ ] Test user flow

### Week 3-4: Research & Setup (Phase 3)
- [ ] Research best WhatsApp API provider
- [ ] Create Meta Business Manager account
- [ ] Apply for WhatsApp Business API access
- [ ] Submit business verification documents
- [ ] Wait for approval (can take 1-2 weeks)

### Week 5-6: Phase 3 Implementation
- [ ] Set up API credentials
- [ ] Create message templates
- [ ] Submit templates for approval
- [ ] Implement API integration
- [ ] Create WhatsAppMessage table
- [ ] Build notification service
- [ ] Set up webhook endpoint
- [ ] Implement retry logic
- [ ] Add delivery tracking
- [ ] Build admin dashboard for message logs

### Week 7: Testing & Launch
- [ ] Test all notification types
- [ ] Test message delivery tracking
- [ ] Monitor webhook events
- [ ] Load testing
- [ ] Create user documentation
- [ ] Launch to beta users
- [ ] Collect feedback
- [ ] Production rollout

---

## Cost Estimate

### Development Cost
- Phase 1: 3 hours
- Phase 2: 2 hours
- Phase 3: 30 hours
- **Total Development:** ~35 hours

### Ongoing Costs (Phase 3)
**Scenario: 10 properties, 50 inquiries/bookings per month**
- WhatsApp messages sent: ~50/month
- Cost at $0.016/message: **$0.80/month**

**Scenario: 100 properties, 500 inquiries/bookings per month**
- WhatsApp messages sent: ~500/month
- Cost at $0.016/message: **$8/month**

**Benefits:**
- Within free tier (1,000 conversations/month)
- Minimal cost even at scale
- High ROI (faster response = more bookings)

---

## Security Considerations

### 1. Phone Number Validation
- Validate format (country code + number)
- Sanitize input to prevent injection
- Test number before going live

### 2. Rate Limiting
- Prevent spam/abuse
- Max 1 notification per inquiry
- Throttle API calls

### 3. Data Privacy
- Don't log message content
- Encrypt WhatsApp numbers in database
- GDPR compliance for guest data

### 4. API Key Security
- Store in environment variables
- Never commit to git
- Rotate keys periodically

---

## Success Metrics

### KPIs to Track
1. **Adoption Rate**
   - % of properties with WhatsApp enabled
   - Target: 80% within 3 months

2. **Usage Rate**
   - WhatsApp button clicks per property
   - Target: 30% of visitors

3. **Notification Delivery Rate**
   - % of messages successfully delivered
   - Target: 99%

4. **Response Time**
   - Time from inquiry to owner response
   - Target: <30 minutes (vs 2-4 hours via email)

5. **Conversion Rate**
   - % of WhatsApp conversations leading to bookings
   - Hypothesis: 2x higher than email

---

## Alternatives to Consider

### 1. Telegram Integration
- Similar to WhatsApp
- Easier API (no approval needed)
- Less popular in Sri Lanka

### 2. SMS Notifications
- More reliable delivery
- Higher cost per message
- Less interactive

### 3. Email + WhatsApp Combo
- Email as primary
- WhatsApp as instant notification
- Best of both worlds

---

## Recommended Next Steps

### Immediate (This Week)
1. ✅ Implement Phase 1 (Click-to-Chat button)
2. Test with 1-2 property owners
3. Gather feedback

### Short-term (Next 2 Weeks)
1. Implement Phase 2 (Manual notifications via click-to-chat)
2. Document user guide for property owners
3. Monitor usage analytics

### Long-term (Next 1-2 Months)
1. Research and select WhatsApp API provider
2. Complete Meta business verification
3. Implement Phase 3 if demand justifies it

---

## Questions to Answer Before Implementation

1. **User Research**
   - Do property owners use WhatsApp for business?
   - What % of guests prefer WhatsApp over email?
   - Are owners comfortable sharing WhatsApp numbers publicly?

2. **Business Model**
   - Will this be a premium feature?
   - Charge per message or flat subscription?
   - Include in all plans or upsell?

3. **Technical**
   - Self-host API or use third-party?
   - Which message templates are most valuable?
   - How to handle multi-property owners (1 number vs multiple)?

4. **Support**
   - How to onboard owners to WhatsApp Business?
   - Documentation needed?
   - Support process for failed messages?

---

## Conclusion

**Recommendation:** Start with Phase 1 (Click-to-Chat) immediately. It's:
- Zero cost
- Quick to implement (2-3 hours)
- Provides immediate value
- No ongoing maintenance
- Gauges user demand

Monitor usage for 2-4 weeks. If click-to-chat shows high engagement (>20% of visitors), proceed with Phase 3 (automated notifications).

**Expected Timeline:**
- Phase 1: This week
- Phase 2: Next week
- Phase 3: Month 2 (if validated)

**Total Investment:**
- Development: 35 hours
- Monthly cost: $0-10 (within free tier initially)
- Expected ROI: Higher conversion rates, faster responses, better guest satisfaction
