# Google Analytics Setup Instructions

## Step 1: Create Google Analytics Account

1. Go to https://analytics.google.com/
2. Click "Start measuring"
3. Enter account name: "NexArt"
4. Configure data sharing settings (recommended: all checked)
5. Click "Next"

## Step 2: Set Up Property

1. Property name: "NexArt Website"
2. Reporting time zone: "United Kingdom"
3. Currency: "British Pound (£)"
4. Click "Next"

## Step 3: Add Data Stream

1. Select "Web"
2. Website URL: "https://nexartlimited.com"
3. Stream name: "NexArt Main Site"
4. Click "Create stream"

## Step 4: Get Your Measurement ID

1. After creating the stream, you'll see a **Measurement ID** like `G-XXXXXXXXXX`
2. Copy this ID

## Step 5: Update Website Code

1. In all HTML files, find this line:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```

2. Replace **both instances** of `G-XXXXXXXXXX` with your actual Measurement ID:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-ABC123XYZ');  <!-- Replace this too! -->
   </script>
   ```

3. Files to update:
   - index.html
   - about.html
   - artists.html
   - gallery.html
   - waitlist.html
   - coming-soon.html
   - contact.html
   - privacy.html
   - terms.html

## Step 6: Test

1. Deploy your website to Vercel
2. Visit your website
3. Go to Google Analytics → Reports → Realtime
4. You should see yourself as a visitor

## What You Can Track

- **Visitors**: How many people visit your site
- **Page views**: Which pages are most popular
- **Traffic sources**: Where visitors come from (X, direct, etc.)
- **Location**: Where your visitors are from
- **Devices**: Desktop vs Mobile usage
- **Conversion**: Waitlist signups (we'll set this up later)

## Privacy Compliance

✅ Already compliant - Your Privacy Policy mentions analytics
✅ GA4 is GDPR-compliant by default
✅ No cookie banner needed for basic analytics in UK
