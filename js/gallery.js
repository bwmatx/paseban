/**
 * GALLERY & LIGHTBOX CONTROLLER — PASEBAN TEMPURAN
 * Komunitas Pemuda Dusun Krajan II, Desa Jatigunung
 */

let activeLightboxImages = [];
let currentLightboxIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  initGalleryPage();
  setupLightboxListeners();
});

/* ==========================================================================
   1. GALLERY PAGE INITIALIZATION
   ========================================================================== */
function initGalleryPage() {
  const galleryGrid = document.getElementById('gallery-items-grid');
  if (!galleryGrid) return;

  // Collect all gallery items from DOM or dataset
  const cards = galleryGrid.querySelectorAll('.gallery-card');
  if (cards.length === 0) return;

  const images = [];
  cards.forEach((card, index) => {
    const img = card.querySelector('img');
    const captionEl = card.querySelector('.gallery-card-caption');
    const src = img ? img.getAttribute('src') : '';
    const caption = captionEl ? captionEl.textContent.trim() : (img ? img.getAttribute('alt') : '');
    
    images.push({ src, caption });

    card.addEventListener('click', () => {
      openLightboxWithImages(images, index);
    });

    // Keyboard accessibility for card
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightboxWithImages(images, index);
      }
    });
  });
}

/* ==========================================================================
   2. LIGHTBOX CORE FUNCTIONS
   ========================================================================== */
function openLightboxWithImages(images, startIndex = 0) {
  if (!images || images.length === 0) return;

  activeLightboxImages = images;
  currentLightboxIndex = startIndex;

  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;

  updateLightboxContent();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('lightbox-close');
  if (closeBtn) closeBtn.focus();
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateLightboxContent() {
  if (activeLightboxImages.length === 0) return;

  const current = activeLightboxImages[currentLightboxIndex];
  const imgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  const counterEl = document.getElementById('lightbox-counter');

  if (imgEl) {
    imgEl.src = current.src;
    imgEl.alt = current.caption || 'Foto Dokumentasi Paseban Tempuran';
  }

  if (captionEl) {
    captionEl.textContent = current.caption || '';
  }

  if (counterEl) {
    counterEl.textContent = `${currentLightboxIndex + 1} / ${activeLightboxImages.length}`;
  }
}

function nextLightboxImage() {
  if (activeLightboxImages.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % activeLightboxImages.length;
  updateLightboxContent();
}

function prevLightboxImage() {
  if (activeLightboxImages.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + activeLightboxImages.length) % activeLightboxImages.length;
  updateLightboxContent();
}

/* ==========================================================================
   3. LIGHTBOX EVENT LISTENERS
   ========================================================================== */
function setupLightboxListeners() {
  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close');
  const nextBtn = document.getElementById('lightbox-next');
  const prevBtn = document.getElementById('lightbox-prev');

  if (!modal) return;

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', nextLightboxImage);
  if (prevBtn) prevBtn.addEventListener('click', prevLightboxImage);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-container')) {
      closeLightbox();
    }
  });

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextLightboxImage();
    } else if (e.key === 'ArrowLeft') {
      prevLightboxImage();
    }
  });
}
