# Waitlist Email Collection Setup

## Option 1: Google Sheets (Recommended - FREE)

### Step 1: Create Google Sheet
1. Go to https://sheets.google.com
2. Create new sheet named "NexArt Waitlist"
3. Add headers in Row 1:
   - Column A: Timestamp
   - Column B: Full Name
   - Column C: Email
   - Column D: Role
   - Column E: Interests
   - Column F: Newsletter

### Step 2: Deploy as Web App
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code and paste this:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.fullName,
      data.email,
      data.role,
      data.interests || '',
      data.newsletter || false
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Deploy** → **New deployment**
4. Type: **Web app**
5. Execute as: **Me**
6. Who has access: **Anyone**
7. Click **Deploy**
8. Copy the **Web App URL** (looks like: https://script.google.com/macros/s/AKfycby.../exec)

### Step 3: Update waitlist.html

Replace the form submission JavaScript in `js/main.js` (around line 42-74):

```javascript
// Waitlist Form Handler
const waitlistForm = document.getElementById('waitlistForm');
const waitlistMessage = document.getElementById('waitlistMessage');

if (waitlistForm && waitlistMessage) {
    waitlistForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('emailAddress').value,
            role: document.getElementById('role').value,
            interests: document.getElementById('interests').value,
            newsletter: document.getElementById('newsletter').checked
        };

        // YOUR GOOGLE SHEETS WEB APP URL HERE
        const googleSheetsURL = 'PASTE_YOUR_WEB_APP_URL_HERE';

        // Send to Google Sheets
        fetch(googleSheetsURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(() => {
            // Show success message
            waitlistMessage.textContent = '🎉 Success! You\'re on the waitlist. Check your email for confirmation.';
            waitlistMessage.style.display = 'block';
            waitlistMessage.style.color = '#10b981';

            // Reset form
            waitlistForm.reset();

            // Track in Google Analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'waitlist_signup', {
                    'event_category': 'engagement',
                    'event_label': formData.role
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            waitlistMessage.textContent = '❌ Oops! Something went wrong. Please try again.';
            waitlistMessage.style.display = 'block';
            waitlistMessage.style.color = '#ef4444';
        });

        // Hide message after 5 seconds
        setTimeout(function() {
            waitlistMessage.style.display = 'none';
        }, 5000);
    });
}
```

### Step 4: Test
1. Submit the waitlist form on your website
2. Check your Google Sheet - new row should appear!

---

## Option 2: Mailchimp (FREE up to 500 contacts)

### Step 1: Create Mailchimp Account
1. Go to https://mailchimp.com
2. Sign up for free account
3. Create audience named "NexArt Waitlist"

### Step 2: Create Signup Form
1. Go to **Audience** → **Signup forms**
2. Click **Embedded forms**
3. Customize fields to match your form
4. Copy the form code

### Step 3: Integrate
1. Replace your current waitlist form with Mailchimp's embedded form
2. Or use Mailchimp's API (more complex but cleaner)

**Pros**: Built-in email automation
**Cons**: 500 contact limit on free tier

---

## Option 3: Formspree (Simplest)

### Setup
1. Go to https://formspree.io
2. Sign up (free: 50 submissions/month)
3. Create new form
4. Get form endpoint URL

### Update HTML
In waitlist.html, change form tag:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Pros**: Easiest setup
**Cons**: Only 50 submissions/month on free tier

---

## My Recommendation

**Use Google Sheets** for now because:
- ✅ Completely FREE
- ✅ Unlimited submissions
- ✅ You own your data
- ✅ Easy to export to Mailchimp later
- ✅ Can see data in real-time

Once you reach 500+ subscribers, migrate to Mailchimp for email automation.
