# SimpleOutings Deployment Guide

## 🚀 Deploy to Vercel (Production)

### Prerequisites
- GitHub account
- Vercel account (free tier is sufficient)
- Domain `simpleoutings.com` ready to configure

---

## Step 1: Push Code to GitHub

### 1.1 Create a new GitHub repository
1. Go to https://github.com/new
2. Repository name: `simpleoutings`
3. Description: "Multi-tenant SaaS platform for Sri Lankan homestays"
4. Keep it **Private** (recommended for production apps)
5. Do NOT initialize with README (we already have code)
6. Click "Create repository"

### 1.2 Push your code
```bash
cd "d:\Projects\HomestaySaas"

# Configure git (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Commit your code
git add .
git commit -m "Initial commit - SimpleOutings platform"

# Add remote and push (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/simpleoutings.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### 2.1 Import Project to Vercel
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your `simpleoutings` repository from GitHub
4. Vercel will auto-detect Next.js settings

### 2.2 Configure Environment Variables
Before clicking "Deploy", add these environment variables:

```bash
# Database
DATABASE_URL=postgresql://postgres.voyuwjtiejimbgxfwzox:k6NGrCypIcbmCa9W@aws-1-ap-south-1.pooler.supabase.com:6543/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://voyuwjtiejimbgxfwzox.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZveXV3anRpZWppbWJneGZ3em94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MDU5MDgsImV4cCI6MjA4MzA4MTkwOH0.TwZKHcb6gxSxE2xcZrD5FUrWzwKfHs-pAfWYBXUop5M

# Cloudinary
CLOUDINARY_CLOUD_NAME=dh45fufyq
CLOUDINARY_API_KEY=317885866968382
CLOUDINARY_API_SECRET=fE8hRF-J7UQ2ms_254-arl6bG_k

# Resend Email
RESEND_API_KEY=re_MVvVR1B9_8wbEdDznZakUGZMzveXkxsSq
```

### 2.3 Deploy
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. You'll get a temporary Vercel URL: `https://simpleoutings.vercel.app`

---

## Step 3: Configure Custom Domain

### 3.1 Add Domain to Vercel
1. In your Vercel project, go to "Settings" → "Domains"
2. Add the following domains:
   - `simpleoutings.com` (root domain - landing page)
   - `www.simpleoutings.com` (redirect to root)
   - `app.simpleoutings.com` (admin dashboard)
   - `*.simpleoutings.com` (wildcard for tenant sites)

### 3.2 Configure DNS Records
Go to your domain registrar (Namecheap, GoDaddy, etc.) and add these DNS records:

**For Root Domain (simpleoutings.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com.
TTL: Auto
```

**For Admin Dashboard (app.simpleoutings.com):**
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com.
TTL: Auto
```

**For Wildcard Tenants (*.simpleoutings.com):**
```
Type: CNAME
Name: *
Value: cname.vercel-dns.com.
TTL: Auto
```

### 3.3 Verify Domain
- Wait 5-10 minutes for DNS propagation
- Vercel will automatically verify and issue SSL certificates
- All domains will be secured with HTTPS

---

## Step 4: Configure Resend Email Domain

### 4.1 Verify Domain in Resend
1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter: `simpleoutings.com`
4. Add the DNS records shown by Resend to your domain registrar

**Typical Resend DNS Records:**
```
Type: TXT
Name: @
Value: resend=xxxxx...

Type: MX
Name: @
Value: mx.resend.com
Priority: 10

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none;
```

### 4.2 Wait for Verification
- DNS propagation takes 5-60 minutes
- Resend will verify automatically
- Once verified, emails will work from `@simpleoutings.com`

---

## Step 5: Test Your Deployment

### 5.1 Test Landing Page
- Visit: `https://simpleoutings.com`
- Should see SimpleOutings landing page

### 5.2 Test Admin Dashboard
- Visit: `https://app.simpleoutings.com`
- Should redirect to login if not authenticated
- Sign up with a new account
- Create a test property with slug "test"

### 5.3 Test Tenant Site
- Visit: `https://test.simpleoutings.com`
- Should see your test property website
- Test the booking form
- Test the contact form (should send email)

### 5.4 Test Email Functionality
1. Submit a contact inquiry from tenant site
2. Check that property owner receives email
3. Check that guest receives auto-response
4. Check admin dashboard → Inquiries tab

---

## Step 6: Production Checklist

### Security
- [ ] All environment variables added to Vercel
- [ ] `.env` file is in `.gitignore` (never committed)
- [ ] Database password is strong
- [ ] Supabase RLS policies configured (if needed)

### Email
- [ ] Resend domain verified
- [ ] Test emails being sent successfully
- [ ] SPF/DKIM records configured for deliverability

### DNS & Domains
- [ ] Root domain working (`simpleoutings.com`)
- [ ] WWW redirect working
- [ ] Admin dashboard working (`app.simpleoutings.com`)
- [ ] Wildcard tenants working (`*.simpleoutings.com`)
- [ ] SSL certificates active (HTTPS)

### Testing
- [ ] Sign up flow works
- [ ] Login flow works
- [ ] Property creation works
- [ ] Tenant sites render correctly
- [ ] Booking form saves to database
- [ ] Contact form sends emails
- [ ] Image uploads work (Cloudinary)
- [ ] Admin dashboard accessible

---

## Troubleshooting

### Issue: Domain not working
**Solution:** Wait 5-60 minutes for DNS propagation. Use https://dnschecker.org to verify DNS records.

### Issue: Emails not sending
**Solution:**
1. Check Resend domain verification status
2. Verify `RESEND_API_KEY` is correct in Vercel
3. Check Resend dashboard for error logs

### Issue: "This Serverless Function has crashed"
**Solution:**
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Check database connection string is correct

### Issue: Subdomain tenants not working
**Solution:**
1. Ensure wildcard CNAME (`*`) is configured
2. Wait for DNS propagation
3. Check Vercel domains settings

### Issue: Images not uploading
**Solution:**
1. Verify Cloudinary credentials in Vercel
2. Check Cloudinary dashboard for upload errors
3. Ensure unsigned uploads are enabled in Cloudinary settings

---

## Monitoring & Maintenance

### Vercel Dashboard
- Monitor deployments
- Check function logs
- View analytics

### Supabase Dashboard
- Monitor database usage
- Check auth logs
- View user activity

### Resend Dashboard
- Monitor email delivery
- Check bounce rates
- View sent email logs

---

## Updating Your Site

Whenever you make code changes:

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build your app
3. Deploy to production
4. Zero downtime deployment

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Resend Docs:** https://resend.com/docs
- **Cloudinary Docs:** https://cloudinary.com/documentation

---

## 🎉 You're Live!

Once all steps are complete, your platform will be live at:
- **Landing Page:** https://simpleoutings.com
- **Admin Dashboard:** https://app.simpleoutings.com
- **Tenant Sites:** https://{property-slug}.simpleoutings.com

Congratulations on launching SimpleOutings! 🚀