/* ==========================================================================
   Udula Institute - Premium Notices Page Script (SaaS & EdTech Redesign)
   ========================================================================== */

'use strict';

// ---- Fallback notices array in case JSON fetch fails ----
const fallbackNotices = [
  {
    "id": 1,
    "date": "2026-06-01",
    "title": "O/L Mathematics Seminar – June 15",
    "category": "Seminars",
    "content": "A special O/L Mathematics Seminar targeting the upcoming term test and final exam structure will be conducted on June 15, 2026, from 8:00 AM to 2:00 PM. Led by our expert panel, the session will cover essential theorems, equation shortcuts, and past paper analysis. All Grade 10 and 11 students are required to attend.",
    "important": true
  },
  {
    "id": 2,
    "date": "2026-05-25",
    "title": "New Grade 10 Science Batch Commencing",
    "category": "New Batches",
    "content": "A brand new Science batch for Grade 10 students (English and Sinhala mediums) will commence on June 10, 2026. The class will be conducted by Mr. Ruwan Jayasinghe every Wednesday from 3:30 PM to 6:30 PM. Focus will be placed on base concepts, practical experiments, and interactive assessments. Enroll now to secure your seat.",
    "important": true
  },
  {
    "id": 3,
    "date": "2026-05-18",
    "title": "Vesak Holiday Notice",
    "category": "Holidays",
    "content": "Please note that all regular classes at Udula Institute will be suspended on June 1 and June 2, 2026, in observance of the Vesak festival. Normal class schedules will resume on Wednesday, June 3. We wish all our students and parents a peaceful and blessed Vesak season.",
    "important": false
  },
  {
    "id": 4,
    "date": "2026-05-15",
    "title": "Monthly Practice Exam Schedule",
    "category": "Exams",
    "content": "The monthly practice exam schedule for June 2026 has been finalized. Mathematics and Science exams will take place on Saturday, June 13, and English and History exams will be held on Sunday, June 14. These papers are designed to simulate final O/L exam conditions. Attendance is mandatory for performance indexing.",
    "important": true
  },
  {
    "id": 5,
    "date": "2026-05-10",
    "title": "ICT Practical Workshop",
    "category": "Classes",
    "content": "A hands-on ICT Practical Workshop will be held on Sunday, July 5, 2026, in the main computer lab. Students will get direct practice with flowcharts, spreadsheet operations, and database creation. Due to lab seating capacity, registration is limited to the first 40 applicants. Registrations open on June 1.",
    "important": false
  },
  {
    "id": 6,
    "date": "2026-05-02",
    "title": "Monthly Tuition Fee Reminder",
    "category": "Fees",
    "content": "This is a reminder that tuition fees for the month of June 2026 should be settled on or before June 10. Digital receipts will be sent to parents' registered WhatsApp numbers upon successful payment. A late fee of Rs. 200 will be added from June 11 onwards. Thank you for your cooperation.",
    "important": false
  }
];

// ---- Global State Variables ----
let allNotices = [];
let filteredNotices = [];
let currentFilter = 'All';
let searchQuery = '';

// ---- Helper Functions ----
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// Date formatter
function formatNoticeDate(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleString('en', { month: 'short' });
  const year = d.getFullYear();
  return { day, month, year, full: `${day} ${month} ${year}` };
}

// Map Category to Badge Styles
function getCategoryBadgeClass(category) {
  const norm = category.toLowerCase().replace(' ', '');
  if (norm.includes('exam')) return 'badge-exams';
  if (norm.includes('newbatch')) return 'badge-newbatches';
  if (norm.includes('holiday')) return 'badge-holidays';
  if (norm.includes('fee')) return 'badge-fees';
  if (norm.includes('class')) return 'badge-classes';
  if (norm.includes('seminar')) return 'badge-seminars';
  return 'badge-classes';
}

// Map Category to Emojis
function getCategoryEmoji(category) {
  const norm = category.toLowerCase().replace(' ', '');
  if (norm.includes('exam')) return '📝';
  if (norm.includes('newbatch')) return '🆕';
  if (norm.includes('holiday')) return '🗓️';
  if (norm.includes('fee')) return '💰';
  if (norm.includes('class')) return '📚';
  if (norm.includes('seminar')) return '🎓';
  return '📢';
}

// Normalizer for category matching
function normalizeCategory(cat) {
  return cat.toLowerCase().replace(' ', '');
}

// ---- Initialization ----
document.addEventListener('DOMContentLoaded', () => {
  initHeroParticles();
  initNoticesPageData();
  setupEventListeners();
  initScrollObservers();
  setupTypingEffect();
});

// 1. Generate Floating Particles in Hero Background
function initHeroParticles() {
  const container = qs('.hero-particle-container');
  if (!container) return;

  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    
    // Random position and timing
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 8}s`;
    particle.style.animationDuration = `${5 + Math.random() * 6}s`;
    
    // Scale variability
    const scale = 0.5 + Math.random() * 1.5;
    particle.style.transform = `scale(${scale})`;
    
    container.appendChild(particle);
  }
}

// 2. Load Notices with Loading Skeletons
async function initNoticesPageData() {
  const container = qs('#noticesContainer');
  if (!container) return;

  // Show Loading Skeletons for 700ms for premium fluid transition feel
  renderSkeletons(container);
  
  await new Promise(resolve => setTimeout(resolve, 700));

  try {
    const response = await fetch('data/announcements.json');
    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }
    allNotices = await response.json();
    
    // Validate announcements and filter out empty arrays
    if (!allNotices || !Array.isArray(allNotices) || allNotices.length === 0) {
      throw new Error("Announcements JSON is empty or malformed");
    }
  } catch (err) {
    console.warn("Fetch failed, loading fallback local notices array. Error details:", err.message);
    allNotices = [...fallbackNotices];
  }

  // Pre-sort notices (important announcements on top, then descending by date)
  allNotices.sort((a, b) => {
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  filteredNotices = [...allNotices];
  
  // Render components
  renderFeaturedNotice();
  renderSidebarEvents();
  applyFiltersAndSearch();
}

// Render loading skeletons
function renderSkeletons(container) {
  let html = '';
  for (let i = 0; i < 4; i++) {
    html += `
      <div class="skeleton-card">
        <div class="skeleton-date skeleton-pulse"></div>
        <div>
          <div class="skeleton-title skeleton-pulse"></div>
          <div class="skeleton-text skeleton-pulse"></div>
          <div class="skeleton-text skeleton-pulse"></div>
          <div class="skeleton-text short skeleton-pulse"></div>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}

// Render the Featured Notice Widget
function renderFeaturedNotice() {
  const container = qs('#featuredNoticeContainer');
  if (!container) return;

  // Find the first important notice or fallback to the latest notice
  const featured = allNotices.find(n => n.important) || allNotices[0];
  if (!featured) {
    container.style.display = 'none';
    return;
  }

  const dateInfo = formatNoticeDate(featured.date);
  const badgeClass = getCategoryBadgeClass(featured.category);
  const emoji = getCategoryEmoji(featured.category);

  container.innerHTML = `
    <div class="featured-notice-card" data-id="${featured.id}">
      <span class="featured-label-badge">★ Highlighted Announcement</span>
      <div class="featured-date-badge">
        <div class="featured-day">${dateInfo.day}</div>
        <div class="featured-month">${dateInfo.month}</div>
        <div class="featured-year">${dateInfo.year}</div>
      </div>
      <div class="featured-info">
        <div class="featured-meta">
          <span class="featured-chip">${emoji} ${featured.category}</span>
        </div>
        <h3 class="card-title-text">${featured.title}</h3>
        <p>${featured.content.substring(0, 160)}...</p>
        <button class="featured-read-btn" onclick="openNoticeDetails(${featured.id})">
          Read Announcement Detail <span>➔</span>
        </button>
      </div>
    </div>
  `;
}

// Render Sidebar events
function renderSidebarEvents() {
  const container = qs('#sidebarEventsList');
  if (!container) return;

  // Filter dynamic events from data (Seminars, Exams, Holidays)
  const events = allNotices.filter(n => {
    const norm = normalizeCategory(n.category);
    return norm.includes('seminar') || norm.includes('exam') || norm.includes('holiday');
  }).slice(0, 4);

  if (events.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:0.8rem;">No upcoming events listed.</p>';
    return;
  }

  container.innerHTML = events.map(ev => {
    const emoji = getCategoryEmoji(ev.category);
    const dateInfo = formatNoticeDate(ev.date);
    return `
      <div class="upcoming-event-item" onclick="openNoticeDetails(${ev.id})" style="cursor:pointer;">
        <div class="event-dot-box">
          <span class="event-dot-icon">${emoji}</span>
        </div>
        <div class="event-detail">
          <h4>${ev.title}</h4>
          <p>📅 ${dateInfo.full}</p>
        </div>
      </div>
    `;
  }).join('');
}

// 3. Dynamic DOM Render of Notices
function renderNoticesGrid() {
  const container = qs('#noticesContainer');
  if (!container) return;

  if (filteredNotices.length === 0) {
    renderEmptyState(container);
    return;
  }

  container.innerHTML = filteredNotices.map(notice => {
    const dateInfo = formatNoticeDate(notice.date);
    const badgeClass = getCategoryBadgeClass(notice.category);
    const emoji = getCategoryEmoji(notice.category);

    return `
      <div class="premium-notice-card ${notice.important ? 'important-alert' : ''}" data-id="${notice.id}">
        <div class="card-date-box">
          <span class="card-day">${dateInfo.day}</span>
          <span class="card-month">${dateInfo.month}</span>
        </div>
        <div class="card-content-area">
          <div class="card-top-meta">
            <span class="card-badge-category ${badgeClass}">${emoji} ${notice.category}</span>
            ${notice.important ? `
              <span class="important-label">
                <span class="important-pulse-dot"></span>IMPORTANT
              </span>
            ` : ''}
          </div>
          <h3 class="card-title-text">${notice.title}</h3>
          <p class="card-description-text">${notice.content.substring(0, 120)}...</p>
          <div class="card-bottom-actions">
            <div class="card-author-info">
              <span class="card-author-icon">🎓</span>
              <span>Udula O/L Academics</span>
            </div>
            <button class="premium-read-more-btn" onclick="openNoticeDetails(${notice.id})">
              Read Detail 
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Apply entrance scroll reveals to the newly rendered cards
  triggerEntranceAnimations();
}

// Render empty search/filter results
function renderEmptyState(container) {
  container.innerHTML = `
    <div class="premium-empty-state">
      <div class="empty-state-icon-wrap">🔍</div>
      <h3>No Notices Found</h3>
      <p>We couldn't find any announcements matching "${searchQuery}" in the "${currentFilter}" category. Try adjusting your filters or search term.</p>
      <button class="reset-search-btn" id="resetNoticesBtn">Reset Search Filters</button>
    </div>
  `;
  
  // Attach reset listener
  const resetBtn = qs('#resetNoticesBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetSearchFilters);
  }
}

function resetSearchFilters() {
  const searchInput = qs('#noticeSearch');
  if (searchInput) searchInput.value = '';
  searchQuery = '';
  
  // Reset active filter button states
  currentFilter = 'All';
  qsa('.premium-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === 'All');
  });

  applyFiltersAndSearch();
}

// 4. Client-side Search and Filter Engine
function applyFiltersAndSearch() {
  filteredNotices = allNotices.filter(notice => {
    // 1. Category Filter
    let matchesCategory = false;
    if (currentFilter === 'All') {
      matchesCategory = true;
    } else {
      const normNotice = normalizeCategory(notice.category);
      const normFilter = normalizeCategory(currentFilter);
      
      // Handle synonyms or matches (e.g. "New Batch" vs "New Batches")
      if (normFilter === 'newbatches' && normNotice === 'newbatch') {
        matchesCategory = true;
      } else if (normFilter === 'seminars' && normNotice === 'seminar') {
        matchesCategory = true;
      } else if (normFilter === 'exams' && normNotice === 'exam') {
        matchesCategory = true;
      } else if (normFilter === 'holidays' && normNotice === 'holiday') {
        matchesCategory = true;
      } else {
        matchesCategory = normNotice === normFilter;
      }
    }

    // 2. Live Search Match
    let matchesSearch = true;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = notice.title.toLowerCase().includes(q);
      const contentMatch = notice.content.toLowerCase().includes(q);
      const categoryMatch = notice.category.toLowerCase().includes(q);
      matchesSearch = titleMatch || contentMatch || categoryMatch;
    }

    return matchesCategory && matchesSearch;
  });

  renderNoticesGrid();
}

// 5. Setup Listeners
function setupEventListeners() {
  // Category tabs click
  qsa('.premium-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      qsa('.premium-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      applyFiltersAndSearch();
    });
  });

  // Search input events
  const searchInput = qs('#noticeSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      applyFiltersAndSearch();
    });
  }

  // Sticky navbar effects scroll listener
  window.addEventListener('scroll', () => {
    const nav = qs('.navbar');
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }
  });

  // Scroll down indicator click
  const scrollDown = qs('#scrollDownIndicator');
  if (scrollDown) {
    scrollDown.addEventListener('click', () => {
      const filterSection = qs('#noticesFilterBar');
      if (filterSection) {
        filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Hamburger collapsible mobile menu (if hamburger elements exist on page)
  const burger = qs('#hamburger');
  const mobileMenu = qs('#mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }

  // Close modals clicking outside wrapper
  const modal = qs('#noticeDetailModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeNoticeModal();
      }
    });
  }
}

// 6. Intersection Observer - Animations & Live Counters
function initScrollObservers() {
  // Counter Animate Observer
  const counterCards = qsa('.stat-number-display');
  if (counterCards.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animateCounterCount(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    
    counterCards.forEach(c => counterObserver.observe(c));
  }
}

// Animate single counter
function animateCounterCount(element, targetValue) {
  let currentVal = 0;
  const duration = 1500; // ms
  const stepTime = Math.max(Math.floor(duration / targetValue), 10);
  const increment = Math.ceil(targetValue / (duration / stepTime));

  const timer = setInterval(() => {
    currentVal += increment;
    if (currentVal >= targetValue) {
      element.textContent = targetValue + (element.dataset.suffix || '');
      clearInterval(timer);
    } else {
      element.textContent = currentVal + (element.dataset.suffix || '');
    }
  }, stepTime);
}

// Entrance reveal scroll triggers
function triggerEntranceAnimations() {
  const cards = qsa('.premium-notice-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, idx * 60); // stagger entries
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  cards.forEach(card => cardObserver.observe(card));
}

// 7. Modal Detail Operations
window.openNoticeDetails = function(noticeId) {
  const notice = allNotices.find(n => n.id === noticeId);
  if (!notice) return;

  const modal = qs('#noticeDetailModal');
  const modalTitle = qs('#modalNoticeTitle');
  const modalMeta = qs('#modalNoticeMeta');
  const modalBody = qs('#modalNoticeBody');
  const modalActionBtn = qs('#modalActionBtn');

  if (!modal || !modalTitle || !modalMeta || !modalBody) return;

  const dateInfo = formatNoticeDate(notice.date);
  const badgeClass = getCategoryBadgeClass(notice.category);
  const emoji = getCategoryEmoji(notice.category);

  modalTitle.textContent = notice.title;
  modalBody.textContent = notice.content;
  
  modalMeta.innerHTML = `
    <span class="card-badge-category ${badgeClass}" style="margin:0">${emoji} ${notice.category}</span>
    <span style="color:var(--text-muted);font-size:0.75rem;">📅 Posted on ${dateInfo.full}</span>
  `;

  // Customize dynamic CTAs
  const normCat = normalizeCategory(notice.category);
  if (normCat.includes('newbatch') || normCat.includes('seminar') || normCat.includes('class')) {
    modalActionBtn.style.display = 'block';
    modalActionBtn.textContent = 'Register / Enroll Now';
    modalActionBtn.onclick = () => handleNoticeEnrollment(notice.title);
  } else {
    modalActionBtn.style.display = 'none';
  }

  // Open modal
  modal.classList.add('open');
  document.body.style.overflow = 'hidden'; // prevent background scrolling
};

window.closeNoticeModal = function() {
  const modal = qs('#noticeDetailModal');
  if (modal) {
    modal.classList.remove('open');
  }
  document.body.style.overflow = '';
};

// Modal action success triggers
function handleNoticeEnrollment(announcementTitle) {
  alert(`🎉 Registration request submitted successfully for: "${announcementTitle}"!\nOur student relations desk will contact you via WhatsApp shortly to coordinate details.`);
  closeNoticeModal();
}

// Typing Reveal animation for subtitle
function setupTypingEffect() {
  const sub = qs('.typing-sub');
  if (!sub) return;

  const text = sub.textContent;
  sub.textContent = '';
  sub.style.opacity = '1';

  let i = 0;
  const speed = 25; // ms speed of typing
  
  function typeWriter() {
    if (i < text.length) {
      sub.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }

  // Start typewriter with delay
  setTimeout(typeWriter, 500);
}
