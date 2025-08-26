document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-menu a');
  let firstFocusableElement;
  let lastFocusableElement;

  if (mobileMenu && mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
      const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
      mobileMenuButton.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('active');

      // Focus Trap
      const focusableElements = mobileMenu.querySelectorAll('a[href], button, input, select, textarea');
      firstFocusableElement = focusableElements[0];
      lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (mobileMenu.classList.contains('active')) {
        firstFocusableElement.focus(); // Focus on the first element when opening
        document.addEventListener('keydown', trapFocus);
      } else {
        document.removeEventListener('keydown', trapFocus);
      }
    });

    // Close Menu on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        mobileMenuButton.setAttribute('aria-expanded', false);
        mobileMenuButton.focus(); // Return focus to the button
        document.removeEventListener('keydown', trapFocus);
      }
    });

    // Close Menu on Link Click (optional)
      menuLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
          mobileMenuButton.setAttribute('aria-expanded', false);
        });
      });

    // Focus Trap Function
    function trapFocus(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    }
  }

  // Smooth Scroll and Back to Top
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const backToTopButton = document.querySelector('.back-to-top');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });

    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Testimonial Slider
  const sliderContainer = document.querySelector('.testimonial-slider');
  if (sliderContainer) {
    const slides = sliderContainer.querySelectorAll('.testimonial-slide');
    const prevButton = sliderContainer.querySelector('.testimonial-prev');
    const nextButton = sliderContainer.querySelector('.testimonial-next');
    let currentSlide = 0;
    let intervalId;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    }

    function startSlider() {
      intervalId = setInterval(nextSlide, 5000);
    }

    function stopSlider() {
      clearInterval(intervalId);
    }

    if (prevButton && nextButton) {
      prevButton.addEventListener('click', () => {
        stopSlider();
        prevSlide();
        startSlider();
      });

      nextButton.addEventListener('click', () => {
        stopSlider();
        nextSlide();
        startSlider();
      });
    }

    showSlide(currentSlide);
    startSlider();

    sliderContainer.addEventListener('mouseenter', stopSlider);
    sliderContainer.addEventListener('mouseleave', startSlider);
  }


  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-content').setAttribute('aria-hidden', 'true');
          otherItem.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      item.classList.toggle('open');
      content.setAttribute('aria-hidden', !isOpen);
      header.setAttribute('aria-expanded', !isOpen);
    });
  });


  // Email Capture Validation
  const emailForm = document.querySelector('.email-capture-form');
  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = emailForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      console.log('Email submitted:', email);
      // You'd typically send this to a server here.
      emailInput.value = ''; // Clear the input
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // UTM-aware CTA click logging
  const ctaButtons = document.querySelectorAll('.cta-button');

  ctaButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const utmParams = new URLSearchParams(window.location.search);
      const utmSource = utmParams.get('utm_source');
      const utmMedium = utmParams.get('utm_medium');
      const utmCampaign = utmParams.get('utm_campaign');
      const destinationUrl = button.href; // or button.dataset.url, etc.
        // Prevent default navigation for logging
        event.preventDefault();

      console.log('CTA Clicked:', {
        destination: destinationUrl,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign
      });

        // Redirect after logging (using try/catch to handle potential errors gracefully).
        try {
            window.location.href = destinationUrl;
        } catch (error) {
            console.error("Error redirecting:", error);
            // Optionally, display an error message to the user.
        }
    });
  });


  // Defer other work. For example, loading external scripts/data.
  setTimeout(() => {
      // Load analytics scripts, etc.
      // This will happen after the main content is loaded and interactive.
      console.log('Deferred tasks executed');
  }, 0);
});