/**
 * MAIN JAVASCRIPT — PASEBAN TEMPURAN
 * Komunitas Pemuda Dusun Krajan II, Desa Jatigunung
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initContactForm();
  initHeroSlideshow();
  initMobileDropdown();
  initSocialSwitcher();
});

/* ==========================================================================
   1. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-backdrop');
  const closeBtn = document.getElementById('mobile-close');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   2. HEADER SCROLL SHADOW
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 16px rgba(15, 23, 42, 0.08)';
    } else {
      header.style.boxShadow = 'var(--shadow-xs)';
    }
  }, { passive: true });
}

/* ==========================================================================
   3. CONTACT FORM SUBMISSION (STATIC FRIENDLY)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('community-contact-form');
  const feedback = document.getElementById('form-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = form.querySelector('[name="nama"]');
    const msgInput = form.querySelector('[name="pesan"]');

    if (!nameInput.value.trim() || !msgInput.value.trim()) {
      alert('Mohon lengkapi nama dan pesan Anda.');
      return;
    }

    if (feedback) {
      feedback.style.display = 'block';
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    form.reset();
  });
}

/* ==========================================================================
   4. HERO BACKGROUND SLIDESHOW
   ========================================================================== */
function initHeroSlideshow() {
  const slideshow = document.querySelector('.hero-bg-slideshow');
  if (!slideshow) return;

  const slides = slideshow.querySelectorAll('.hero-slide');
  if (slides.length <= 1) return;

  let currentSlide = 0;
  const displayDuration = 5000;
  const fadeDuration = 1200;

  function showNextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  setInterval(showNextSlide, displayDuration);
}

/* ==========================================================================
   5. MOBILE NAVIGATION DROPDOWN
   ========================================================================== */
function initMobileDropdown() {
  const triggers = document.querySelectorAll('.mobile-dropdown-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const menu = trigger.nextElementSibling;
      const isOpen = menu.classList.contains('open');

      // Close all other dropdowns
      document.querySelectorAll('.mobile-dropdown-menu.open').forEach(m => {
        if (m !== menu) m.classList.remove('open');
      });
      document.querySelectorAll('.mobile-dropdown-trigger[aria-expanded="true"]').forEach(t => {
        if (t !== trigger) t.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      menu.classList.toggle('open');
      trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });
}

/* ==========================================================================
   6. SOCIAL MEDIA PLATFORM SWITCHER
   ========================================================================== */
function initSocialSwitcher() {
  const buttons = document.querySelectorAll('.social-switcher-btn');
  const panels = document.querySelectorAll('.social-panel');
  if (!buttons.length || !panels.length) return;

  let tiktokLoaded = false;
  let tiktokFailed = false;

  function loadTikTokEmbed() {
    if (tiktokLoaded || tiktokFailed) return;
    tiktokLoaded = true;

    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    script.onerror = () => {
      tiktokFailed = true;
      showTikTokFallback();
    };
    document.body.appendChild(script);

    // Fallback timeout — if embed doesn't render within 8s, show fallback
    setTimeout(() => {
      if (tiktokFailed) return;
      const container = document.getElementById('tiktok-container');
      if (!container) return;
      const iframe = container.querySelector('iframe');
      const blockquote = container.querySelector('.tiktok-embed');
      // If no iframe appeared and blockquote is still plain text, embed likely failed
      if (!iframe && blockquote && blockquote.querySelector('section a')) {
        // Check if overload-protect text appeared
        if (blockquote.textContent.includes('overload') || blockquote.textContent.includes('protect')) {
          tiktokFailed = true;
          showTikTokFallback();
        }
      }
    }, 8000);
  }

  function showTikTokFallback() {
    const container = document.getElementById('tiktok-container');
    const fallback = document.getElementById('tiktok-fallback');
    if (container) container.style.display = 'none';
    if (fallback) fallback.style.display = 'block';
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.getAttribute('data-platform');

      // Update buttons
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update panels
      panels.forEach(p => {
        const panelId = p.id;
        if (panelId === 'panel-' + platform) {
          p.removeAttribute('hidden');
        } else {
          p.setAttribute('hidden', '');
        }
      });

      // Lazy-load TikTok embed when tab is activated
      if (platform === 'tiktok') {
        loadTikTokEmbed();
      }
    });
  });

  // Load TikTok on initial page load since it's the default active tab
  loadTikTokEmbed();
}
