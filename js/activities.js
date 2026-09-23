/**
 * ACTIVITIES CONTROLLER — PASEBAN TEMPURAN
 * Render data kegiatan, pencarian, filter kategori, dan halaman detail
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if we are on homepage
  const recentContainer = document.getElementById('recent-activities-container');
  if (recentContainer && typeof activitiesData !== 'undefined') {
    renderRecentActivities(recentContainer);
  }

  // Check if we are on homepage category section
  const categoryContainer = document.getElementById('category-activities-container');
  if (categoryContainer && typeof activitiesData !== 'undefined') {
    renderCategoryActivities(categoryContainer);
  }

  // Check if we are on kegiatan archive page
  const archiveContainer = document.getElementById('activities-archive-container');
  if (archiveContainer && typeof activitiesData !== 'undefined') {
    initActivitiesArchive(archiveContainer);
  }

  // Check if we are on activity detail page
  const detailContainer = document.getElementById('activity-detail-container');
  if (detailContainer && typeof activitiesData !== 'undefined') {
    initActivityDetail(detailContainer);
  }
});

/* ==========================================================================
   1. HOMEPAGE RECENT ACTIVITIES
   ========================================================================== */
function renderRecentActivities(container) {
  const recentItems = activitiesData.slice(0, 3);
  container.innerHTML = recentItems.map(item => createActivityCardHTML(item)).join('');
}

/* ==========================================================================
   1B. HOMEPAGE CATEGORY ACTIVITIES
   ========================================================================== */
function renderCategoryActivities(container) {
  const categories = [
    { name: 'Aksi Sosial', slug: 'sosial' },
    { name: 'Event Paseban', slug: 'event' },
    { name: 'Kemerdekaan', slug: 'kemerdekaan' }
  ];

  const categoryMap = {
    'sosial': 'Aksi Sosial',
    'event': 'Event Paseban',
    'kemerdekaan': 'Kemerdekaan'
  };

  container.innerHTML = categories.map(cat => {
    const items = activitiesData.filter(item => {
      if (cat.slug === 'sosial') {
        return item.categorySlug === 'sosial' || item.category === 'Aksi Sosial';
      }
      if (cat.slug === 'event') {
        return item.categorySlug === 'event' || item.category === 'Event Paseban';
      }
      if (cat.slug === 'kemerdekaan') {
        return item.categorySlug === 'kemerdekaan' || item.category === 'Kemerdekaan' || item.category === 'Kebudayaan';
      }
      return false;
    });

    let itemsHTML;
    if (items.length > 0) {
      itemsHTML = `<div class="activities-grid">${items.map(item => createActivityCardHTML(item)).join('')}</div>`;
    } else {
      itemsHTML = `<p class="category-empty-state">Belum ada kegiatan.</p>`;
    }

    return `
      <div class="category-group">
        <h3 class="category-group-title">${cat.name}</h3>
        ${itemsHTML}
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   2. ACTIVITIES ARCHIVE (KEGIATAN.HTML)
   ========================================================================== */
function initActivitiesArchive(container) {
  const searchInput = document.getElementById('activity-search');
  const categoryPills = document.querySelectorAll('.category-pill');
  const resultsCount = document.getElementById('results-count');

  let currentCategory = 'all';
  let currentSearch = '';

  function filterAndRender() {
    let filtered = activitiesData.filter(item => {
      const matchCategory = currentCategory === 'all' || item.categorySlug === currentCategory;
      const query = currentSearch.toLowerCase();
      const matchSearch = item.title.toLowerCase().includes(query) ||
                          item.summary.toLowerCase().includes(query) ||
                          item.location.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });

    if (resultsCount) {
      resultsCount.textContent = `Menampilkan ${filtered.length} kegiatan`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <h3 class="empty-state-title">Kegiatan Tidak Ditemukan</h3>
          <p class="empty-state-text">Coba gunakan kata kunci pencarian lain atau pilih kategori kegiatan yang berbeda.</p>
        </div>
      `;
    } else {
      container.innerHTML = filtered.map(item => createActivityCardHTML(item)).join('');
    }
  }

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      filterAndRender();
    });
  }

  // Category pill listeners
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category');
      filterAndRender();
    });
  });

  // Initial render
  filterAndRender();
}

/* ==========================================================================
   3. ACTIVITY CARD HTML GENERATOR
   ========================================================================== */
function createActivityCardHTML(item) {
  return `
    <article class="activity-card">
      <a href="kegiatan-detail.html?id=${encodeURIComponent(item.id)}" class="activity-thumb-wrapper" tabindex="-1" aria-hidden="true">
        <img src="${item.coverImage}" alt="${item.title}" loading="lazy">
        <span class="activity-category-badge">${item.category}</span>
      </a>
      <div class="activity-body">
        <div class="activity-meta">
          <span class="activity-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <line x1="16" x2="16" y1="2" y2="6"/>
              <line x1="8" x2="8" y1="2" y2="6"/>
              <line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
            ${item.date}
          </span>
          <span>•</span>
          <span class="activity-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${item.location}
          </span>
        </div>
        <h3 class="activity-title">
          <a href="kegiatan-detail.html?id=${encodeURIComponent(item.id)}">${item.title}</a>
        </h3>
        <p class="activity-excerpt">${item.summary}</p>
        <a href="kegiatan-detail.html?id=${encodeURIComponent(item.id)}" class="activity-footer-link">
          Lihat Dokumentasi Lengkap
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </a>
      </div>
    </article>
  `;
}

/* ==========================================================================
   4. ACTIVITY DETAIL CONTROLLER (KEGIATAN-DETAIL.HTML)
   ========================================================================== */
function initActivityDetail(container) {
  const urlParams = new URLSearchParams(window.location.search);
  const activityId = urlParams.get('id');

  let activity = null;
  if (activityId) {
    activity = getActivityById(activityId);
  }

  // Fallback to first item if ID not specified or not found
  if (!activity && activitiesData.length > 0) {
    activity = activitiesData[0];
  }

  if (!activity) {
    container.innerHTML = '<p>Data kegiatan tidak tersedia.</p>';
    return;
  }

  // Update Page Title
  document.title = `${activity.title} — Paseban Tempuran`;

  // Update Breadcrumb Current Title
  const breadcrumbCurrent = document.getElementById('breadcrumb-current');
  if (breadcrumbCurrent) {
    breadcrumbCurrent.textContent = activity.title;
  }

  // Render detail contents
  const galleryHTML = activity.gallery && activity.gallery.length > 0 ? `
    <section class="detail-gallery-section">
      <h3 class="section-title" style="font-size: 1.5rem; margin-bottom: 0.5rem;">Dokumentasi Foto Lapangan</h3>
      <p class="section-subtitle" style="font-size: 0.9375rem; margin-bottom: 1.5rem;">Klik foto untuk melihat dalam ukuran penuh.</p>
      <div class="detail-gallery-grid">
        ${activity.gallery.map((img, idx) => `
          <div class="detail-gallery-item" data-index="${idx}" data-img-src="${img.url}" data-img-caption="${img.caption || activity.title}">
            <img src="${img.url}" alt="${img.caption || activity.title}" loading="lazy">
          </div>
        `).join('')}
      </div>
    </section>
  ` : '';

  container.innerHTML = `
    <header class="detail-header">
      <div class="detail-meta-row">
        <span class="activity-category-badge" style="position:static;">${activity.category}</span>
        <span class="activity-meta-item" style="color: var(--color-muted);">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
          </svg>
          ${activity.date}
        </span>
        <span class="activity-meta-item" style="color: var(--color-muted);">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          ${activity.location}
        </span>
      </div>
      <h1 class="detail-title">${activity.title}</h1>
    </header>

    <div class="detail-cover-card">
      <img src="${activity.coverImage}" alt="${activity.title}">
    </div>

    <div class="detail-content-body">
      ${activity.description}
    </div>

    ${galleryHTML}

    <div class="detail-actions-bar">
      <a href="kegiatan.html" class="btn-secondary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Kembali ke Semua Kegiatan
      </a>
      <a href="galeri.html" class="btn-primary">
        Buka Galeri Foto Dusun
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14"/>
          <path d="m12 5 7 7-7 7"/>
        </svg>
      </a>
    </div>
  `;

  // Hook gallery click to open lightbox if lightbox available
  const galleryItems = container.querySelectorAll('.detail-gallery-item');
  if (galleryItems.length > 0 && typeof openLightboxWithImages === 'function') {
    const imagesList = activity.gallery.map(g => ({
      src: g.url,
      caption: g.caption || activity.title
    }));

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        openLightboxWithImages(imagesList, index);
      });
    });
  }
}
