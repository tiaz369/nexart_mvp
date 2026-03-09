// NexArt MVP - Main JavaScript File

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // Change icon between hamburger and X
            if (navMenu.classList.contains('active')) {
                mobileMenuToggle.textContent = '✕';
            } else {
                mobileMenuToggle.textContent = '☰';
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.textContent = '☰';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.textContent = '☰';
            }
        });
    }

    // Waitlist Form Handler with Google Sheets Integration
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

            // REPLACE WITH YOUR GOOGLE SHEETS WEB APP URL
            // Get this URL from: Extensions > Apps Script > Deploy > Web app
            const googleSheetsURL = 'YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE';

            // If no Google Sheets URL is set, just show local success message
            if (googleSheetsURL === 'YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE') {
                console.log('Waitlist Form Submitted (Local Only):', formData);
                waitlistMessage.textContent = '🎉 Success! You\'re on the waitlist.';
                waitlistMessage.style.display = 'block';
                waitlistMessage.style.color = '#10b981';
                waitlistForm.reset();

                setTimeout(function() {
                    waitlistMessage.style.display = 'none';
                }, 5000);
                return;
            }

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
                console.error('Error submitting to Google Sheets:', error);
                // Still show success to user (no-cors mode doesn't return errors)
                waitlistMessage.textContent = '🎉 Success! You\'re on the waitlist.';
                waitlistMessage.style.display = 'block';
                waitlistMessage.style.color = '#10b981';
                waitlistForm.reset();
            });

            // Hide message after 5 seconds
            setTimeout(function() {
                waitlistMessage.style.display = 'none';
            }, 5000);
        });
    }

    // Coming Soon Form Handler
    const comingSoonForm = document.getElementById('comingSoonForm');
    const formMessage = document.getElementById('formMessage');

    if (comingSoonForm && formMessage) {
        comingSoonForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                interest: document.getElementById('interest').value
            };

            // Simulate form submission
            console.log('Coming Soon Form Submitted:', formData);

            // Show success message
            formMessage.textContent = '✅ Thank you! We\'ll keep you updated on our progress.';
            formMessage.style.display = 'block';
            formMessage.style.color = '#10b981';

            // Reset form
            comingSoonForm.reset();

            // Hide message after 5 seconds
            setTimeout(function() {
                formMessage.style.display = 'none';
            }, 5000);
        });
    }

    // Home Page Waitlist Form Handler
    const homeWaitlistForm = document.getElementById('homeWaitlistForm');
    const homeFormMessage = document.getElementById('homeFormMessage');

    if (homeWaitlistForm && homeFormMessage) {
        homeWaitlistForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                email: document.getElementById('homeEmail').value
            };

            console.log('Home Waitlist Form Submitted:', formData);

            homeFormMessage.textContent = '✅ Thank you! You\'re on the waitlist.';
            homeFormMessage.style.display = 'block';
            homeFormMessage.style.color = '#10b981';

            homeWaitlistForm.reset();

            setTimeout(function() {
                homeFormMessage.style.display = 'none';
            }, 5000);
        });
    }

    // Artists Page Waitlist Form Handler
    const artistsWaitlistForm = document.getElementById('artistsWaitlistForm');
    const artistsFormMessage = document.getElementById('artistsFormMessage');

    if (artistsWaitlistForm && artistsFormMessage) {
        artistsWaitlistForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                email: document.getElementById('artistsEmail').value
            };

            console.log('Artists Waitlist Form Submitted:', formData);

            artistsFormMessage.textContent = '✅ Subscribed! We\'ll keep you updated.';
            artistsFormMessage.style.display = 'block';
            artistsFormMessage.style.color = '#10b981';

            artistsWaitlistForm.reset();

            setTimeout(function() {
                artistsFormMessage.style.display = 'none';
            }, 5000);
        });
    }

    // Add click handlers to "View Details" buttons in gallery
    const nftDetailsButtons = document.querySelectorAll('.nft-details-btn');
    nftDetailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Available at launch. Join our waitlist to be notified when the marketplace goes live!');
        });
    });

    // Footer links are now functional - privacy.html and terms.html exist
    // No need to prevent default - links work normally

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add animation on scroll for feature cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards, artist cards, and NFT cards
    const animatedElements = document.querySelectorAll('.feature-card, .artist-card, .nft-card');
    animatedElements.forEach(el => observer.observe(el));

    // Add active state to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage ||
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === '/' && linkPage === 'index.html')) {
            link.style.borderBottom = '2px solid white';
            link.style.paddingBottom = '4px';
        }
    });

    // Only prevent disabled social links (Instagram and Discord with "Soon" label)
    // X (Twitter) link should work normally
    const disabledSocialLinks = document.querySelectorAll('.social-links a[onclick="return false;"]');
    disabledSocialLinks.forEach(link => {
        // These links already have onclick="return false;" in HTML
        // No additional JavaScript needed - they're already disabled
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        hero.style.transform = 'translateY(' + (scrolled * parallaxSpeed) + 'px)';
    }
});

// Console welcome message
console.log('%c🎨 Welcome to Nexart!', 'font-size: 24px; color: #7C3AED; font-weight: bold;');
console.log('%cEmpowering Female Artists in Web3', 'font-size: 14px; color: #2563EB;');
console.log('%cJoin our waitlist: ' + window.location.origin + '/waitlist.html', 'font-size: 12px; color: #666;');
