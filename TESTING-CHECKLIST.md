# Testing Checklist for NexArt MVP

Complete this checklist before launching your website to production.

## ✅ Pre-Launch Checklist

### Firebase Configuration

- [ ] Firebase project created
- [ ] Web app registered in Firebase
- [ ] Firebase config updated in `js/firebase-config.js` (replace placeholders)
- [ ] Email/Password authentication enabled
- [ ] Firestore database created
- [ ] Firebase Storage enabled
- [ ] Admin email configured in `js/admin.js` (line 14)
- [ ] Security rules updated for production (before public launch)

### Authentication & User Management

#### Sign Up
- [ ] Users can sign up as Artist
- [ ] Users can sign up as Viewer
- [ ] User data saved to Firestore `/users` collection
- [ ] Display name, email, role saved correctly
- [ ] Error messages display correctly (weak password, email in use, etc.)
- [ ] Success message and redirect to dashboard

#### Login
- [ ] Existing users can log in
- [ ] Correct email/password combination works
- [ ] Wrong password shows error message
- [ ] Non-existent email shows error message
- [ ] Successful login redirects to dashboard

#### Logout
- [ ] Logout button visible when logged in
- [ ] Logout redirects to home page
- [ ] User session cleared after logout

#### Navigation State
- [ ] "Login" button visible when logged out
- [ ] "Dashboard" button visible when logged in
- [ ] "Admin" button visible only for admin users
- [ ] "Logout" button visible when logged in
- [ ] Navigation state persists on page refresh

### Artist Dashboard

- [ ] Artist can access dashboard
- [ ] Artist sees "Upload New Artwork" button
- [ ] Artist can view their profile link
- [ ] Artist can see all their artworks
- [ ] Published/Draft status shows correctly
- [ ] Artist can edit profile (display name, bio)
- [ ] Artist can add social links (Twitter, Instagram, Website)
- [ ] Profile changes save successfully
- [ ] Profile update success message displays

### Artwork Upload (Artist Only)

- [ ] Upload page accessible only to artists
- [ ] Viewers redirected if they try to access upload page
- [ ] Image file selector works
- [ ] Drag & drop image upload works
- [ ] File size validation (max 5MB)
- [ ] File type validation (JPG, PNG, GIF, WEBP)
- [ ] Image preview displays correctly
- [ ] Remove image button works
- [ ] Title field required (max 100 chars)
- [ ] Description field required (max 500 chars)
- [ ] Character counters update correctly
- [ ] Year field accepts valid years (1900-2026)
- [ ] Medium dropdown works
- [ ] Publish checkbox works (default checked)
- [ ] Upload progress bar displays
- [ ] Upload success message displays
- [ ] Image uploaded to Firebase Storage
- [ ] Artwork data saved to Firestore
- [ ] Redirect to dashboard after success

### Artwork Detail Page

- [ ] Artwork detail page loads correctly
- [ ] Artwork image displays at full size
- [ ] Artwork title, description, year, medium display correctly
- [ ] Artist information displays
- [ ] "View Artist Profile" link works
- [ ] Save button works for logged-in users
- [ ] Save button prompts login for guests
- [ ] Saved state persists across pages
- [ ] Share on Twitter button works
- [ ] Copy link button works and copies correct URL

### Gallery Page

- [ ] Gallery displays all published artworks
- [ ] Sample artworks visible initially
- [ ] Firebase-loaded artworks display after authentication
- [ ] Artist name clickable and links to profile
- [ ] Artwork images clickable and link to detail page
- [ ] Save button works for logged-in users
- [ ] Save button prompts login for guests
- [ ] Saved artworks show heart icon
- [ ] Empty state shows when no artworks exist

### Artists List Page

- [ ] Artists list displays correctly
- [ ] Sample artists visible initially
- [ ] Application banner displays
- [ ] "Apply Here" link works
- [ ] Firebase-loaded artists display
- [ ] Artist avatar/placeholder displays
- [ ] Artist bio truncates correctly (120 chars)
- [ ] Artwork count displays correctly
- [ ] Social media links work (Twitter, Instagram)
- [ ] "View Profile" button links to artist profile
- [ ] Empty state shows when no artists exist

### Artist Profile Page

- [ ] Artist profile loads correctly
- [ ] Artist avatar displays (or placeholder with initial)
- [ ] Artist name, bio, social links display
- [ ] Artwork count correct
- [ ] All published artworks display in grid
- [ ] Artwork cards link to detail pages
- [ ] Save button works on artwork cards
- [ ] Empty state shows if artist has no published works

### Viewer Dashboard

- [ ] Viewer can access dashboard
- [ ] "Explore Gallery" button works
- [ ] "Discover Artists" button works
- [ ] Saved artworks section displays
- [ ] All saved artworks load correctly
- [ ] Artwork cards link to detail pages
- [ ] Profile editing works (display name, bio)
- [ ] Empty state shows if no saved artworks

### Artist Application

- [ ] Apply page accessible to all users
- [ ] Full name field required
- [ ] Email field required and validates format
- [ ] Portfolio URL field required and validates URL
- [ ] Artist statement required
- [ ] Word count displays correctly (0 words initially)
- [ ] Word count updates as user types
- [ ] Word count shows red if < 200 or > 500 words
- [ ] Word count shows green if 200-500 words
- [ ] Form validates min 200 words
- [ ] Form validates max 500 words
- [ ] Instagram field optional
- [ ] Twitter field optional
- [ ] Submit button disabled during submission
- [ ] Application saved to Firestore `/applications`
- [ ] Success message displays
- [ ] Form hides after successful submission
- [ ] "Return to Home" button works

### Admin Panel

- [ ] Admin panel accessible only to admin user
- [ ] Non-admin users redirected to home
- [ ] Tab switching works (Users, Artworks, Applications)
- [ ] Users tab displays all registered users
- [ ] User email, name, role, created date display
- [ ] Role badges display correct colors
- [ ] Artworks tab displays all artworks
- [ ] Artwork thumbnail displays
- [ ] Publish/Unpublish button works
- [ ] Artwork status updates in Firestore
- [ ] Delete artwork button works
- [ ] Delete confirmation dialog shows
- [ ] Applications tab displays all applications
- [ ] Application status displays (pending/reviewed)
- [ ] "View Details" opens modal with full application
- [ ] Artist statement displays in modal
- [ ] "Mark as Reviewed" button works
- [ ] Application status updates in Firestore

### Mobile Responsiveness

- [ ] Website displays correctly on mobile (375px width)
- [ ] Navigation menu works on mobile
- [ ] All forms usable on mobile
- [ ] Image upload works on mobile
- [ ] Artwork grid adjusts to single column on mobile
- [ ] Dashboard readable on mobile
- [ ] Admin panel tables scrollable on mobile

### Browser Compatibility

- [ ] Works on Chrome (latest)
- [ ] Works on Firefox (latest)
- [ ] Works on Safari (latest)
- [ ] Works on Edge (latest)
- [ ] Works on mobile Chrome (Android)
- [ ] Works on mobile Safari (iOS)

### Performance

- [ ] Page load time < 3 seconds
- [ ] Images load progressively (lazy loading)
- [ ] No console errors on any page
- [ ] Firebase queries optimized (no large collection reads)
- [ ] Image file sizes reasonable (< 5MB uploads)

### Security

- [ ] Firebase security rules tested
- [ ] Users can only edit their own data
- [ ] Artists can only edit their own artworks
- [ ] Admin access properly restricted
- [ ] No sensitive data exposed in console
- [ ] XSS vulnerabilities checked (user-generated content escaped)

### Google Analytics (Optional)

- [ ] Google Analytics GA4 account created
- [ ] Measurement ID added to all HTML files
- [ ] Replace `G-XXXXXXXXXX` placeholder
- [ ] Test pageview tracking
- [ ] Test event tracking (waitlist signup)

### Content & Copy

- [ ] All placeholder text replaced
- [ ] All sample content has disclaimers
- [ ] Contact email correct (nexartlimited@gmail.com)
- [ ] Privacy policy email correct
- [ ] Terms of service email correct
- [ ] Timeline consistent across pages (Q3-Q4 2026)
- [ ] Social media links correct (Twitter/X)
- [ ] No broken links
- [ ] No "Lorem ipsum" or placeholder text

### Before Public Launch

- [ ] **Update Firestore security rules to production rules**
- [ ] **Update Storage security rules to production rules**
- [ ] Admin email configured correctly
- [ ] Google Analytics tracking code updated
- [ ] All Firebase placeholders replaced
- [ ] Test mode expiry dates removed
- [ ] SSL certificate active (HTTPS)
- [ ] Custom domain connected (if using)
- [ ] Backup Firebase data

## 🔥 Critical Issues (Fix Before Launch)

1. **Firebase Security Rules** - Currently in test mode! Update before launch
2. **Admin Email** - Replace placeholder in `js/admin.js`
3. **Firebase Config** - Replace all placeholders in `js/firebase-config.js`
4. **Google Analytics** - Replace `G-XXXXXXXXXX` if using analytics

## 🧪 Testing Tips

### Test User Accounts

Create these test accounts:

1. **Admin User**
   - Email: your-admin-email@example.com
   - Role: (manually set in Firestore)

2. **Test Artist**
   - Email: test.artist@example.com
   - Role: artist

3. **Test Viewer**
   - Email: test.viewer@example.com
   - Role: viewer

### Common Bugs to Check

- [ ] Login redirect loop
- [ ] Infinite Firebase reads (check quotas)
- [ ] Images not loading (CORS, Storage rules)
- [ ] Save button not working (authentication required)
- [ ] Dashboard blank (Firestore permissions)
- [ ] Upload fails (Storage permissions, file size)

### Performance Testing

- [ ] Test with slow 3G connection
- [ ] Test with multiple artworks (50+)
- [ ] Test with multiple users
- [ ] Check Firebase console for quota usage

## 📊 Post-Launch Monitoring

After launch, monitor:

1. **Firebase Console → Usage**
   - Authentication usage
   - Firestore reads/writes
   - Storage usage

2. **Firebase Console → Authentication → Users**
   - New user signups
   - User growth

3. **Firebase Console → Firestore → Data**
   - Artworks uploaded
   - Applications received

4. **Google Analytics** (if enabled)
   - Page views
   - User flow
   - Conversion rate

## 🚀 Launch Checklist

- [ ] All tests above completed and passed
- [ ] Firebase production security rules deployed
- [ ] Admin access verified
- [ ] Test transactions completed successfully
- [ ] Mobile testing completed
- [ ] Browser compatibility verified
- [ ] Performance optimized
- [ ] Backup created
- [ ] Launch announcement prepared
- [ ] Support email monitored (nexartlimited@gmail.com)

---

**Good luck with your launch! 🎨**
