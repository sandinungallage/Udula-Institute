/* =====================================================
   Udula Institute - Main JavaScript
   ===================================================== */

'use strict';

// ---- Utility Functions ----
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const el = (tag, attrs = {}, ...children) => {
  const e = document.createElement(tag);
  Object.assign(e, attrs);
  for (const k in attrs) {
    if (k.startsWith('data-')) e.setAttribute(k, attrs[k]);
    else if (k === 'class') e.className = attrs[k];
    else e[k] = attrs[k];
  }
  children.flat().forEach(c => {
    if (typeof c === 'string') e.insertAdjacentHTML('beforeend', c);
    else if (c) e.appendChild(c);
  });
  return e;
};

// ---- Theme Management ----
const ThemeManager = (() => {
  const KEY = 'udula-theme';
  let current = localStorage.getItem(KEY) || 'light';

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    current = theme;
    localStorage.setItem(KEY, theme);
    $$('.theme-toggle').forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  }

  function toggle() { apply(current === 'dark' ? 'light' : 'dark'); }
  function init() {
    apply(current);
    $$('.theme-toggle').forEach(btn => btn.addEventListener('click', toggle));
  }

  return { init, toggle, get: () => current };
})();

// ---- Navbar ----
const NavbarManager = (() => {
  function init() {
    const navbar = $('.navbar');
    const hamburger = $('.hamburger');
    const mobileMenu = $('.mobile-menu');

    // Scroll effect
    function onScroll() {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Hamburger toggle
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
      });

      // Close on link click
      $$('.nav-link', mobileMenu).forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
        });
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
        }
      });
    }

    // Active link highlighting
    const page = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  return { init };
})();

// ---- Scroll-to-Top Button ----
const ScrollTop = (() => {
  function init() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.setAttribute('title', 'Scroll to top');
    btn.id = 'scrollTopBtn';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  return { init };
})();

// ---- FAQ Accordion ----
const FAQ = (() => {
  function init() {
    $$('.faq-item').forEach(item => {
      const question = $('.faq-question', item);
      const answer = $('.faq-answer', item);

      if (!question) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all
        $$('.faq-item').forEach(i => {
          i.classList.remove('open');
          const a = $('.faq-answer', i);
          if (a) a.style.maxHeight = null;
        });

        // Open clicked
        if (!isOpen) {
          item.classList.add('open');
          if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }
  return { init };
})();

// ---- Tab System ----
const Tabs = (() => {
  function init() {
    $$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('[data-tabs]') || btn.closest('.tabs-container') || btn.parentElement.parentElement;
        const target = btn.dataset.tab;

        // Deactivate all buttons & contents in same group
        const allBtns = $$('.tab-btn', btn.parentElement);
        allBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Switch content
        const wrapper = group || document;
        $$('.tab-content').forEach(tc => {
          if (tc.dataset.tab === target) {
            tc.classList.add('active');
          } else {
            tc.classList.remove('active');
          }
        });
      });
    });
  }
  return { init };
})();

// ---- Intersection Observer Animations ----
const AnimateOnScroll = (() => {
  function init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.5s ease forwards';
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    $$('.teacher-card, .quick-link-card, .announcement-card, .holiday-card, .resource-card, .faq-item').forEach((elem, i) => {
      elem.style.opacity = '0';
      elem.style.animationDelay = `${i * 0.05}s`;
      observer.observe(elem);
    });
  }
  return { init };
})();

// ---- Counter Animation ----
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const CounterManager = (() => {
  function init() {
    const counters = $$('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count);
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }
  return { init };
})();

// ---- Fetch Helper ----
async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Failed to load ${url}:`, err);
    return null;
  }
}

// ---- Date Formatting ----
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: d.toLocaleString('en', { month: 'short' }),
    year: d.getFullYear(),
    full: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    weekday: d.toLocaleDateString('en', { weekday: 'long' }),
    iso: dateStr
  };
}

// ---- Build Teacher Card ----
function buildTeacherCard(teacher) {
  const initials = teacher.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  const gradients = [
    'linear-gradient(135deg,#1a4fd6,#3b6fe8)',
    'linear-gradient(135deg,#7c3aed,#9f67fa)',
    'linear-gradient(135deg,#0891b2,#06b6d4)',
    'linear-gradient(135deg,#059669,#10b981)',
    'linear-gradient(135deg,#d97706,#f59e0b)',
    'linear-gradient(135deg,#dc2626,#ef4444)',
  ];
  const bg = gradients[teacher.id % gradients.length];
  const streamClass = teacher.stream === 'A/L' ? 'stream-badge-al' : 'stream-badge-ol';

  return `
    <div class="teacher-card" data-id="${teacher.id}">
      <div class="teacher-card-top" style="background:${bg}20">
        <div class="teacher-avatar" style="background:${bg}">
          ${initials}
        </div>
      </div>
      <div class="teacher-card-body">
        <div class="teacher-name">${teacher.name}</div>
        <span class="teacher-subject ${streamClass}">${teacher.subject}</span>
        <div class="teacher-qual">🎓 ${teacher.qualification}</div>
        <div class="teacher-exp">⏱️ ${teacher.experience} experience</div>
        <p class="teacher-bio">${teacher.bio}</p>
      </div>
    </div>
  `;
}

// ---- Build Announcement Card ----
function buildAnnouncementCard(ann) {
  const date = formatDate(ann.date);
  const badgeMap = {
    'Exam': 'badge-exam',
    'Holiday': 'badge-holiday',
    'Fees': 'badge-fees',
    'Classes': 'badge-classes',
    'Facilities': 'badge-facilities',
    'New Batch': 'badge-new'
  };
  const badgeClass = badgeMap[ann.category] || 'badge-classes';

  return `
    <div class="announcement-card ${ann.important ? 'important' : ''}">
      <div class="ann-date">
        <div class="ann-day">${date.day}</div>
        <div class="ann-month">${date.month}</div>
        <div class="ann-year">${date.year}</div>
      </div>
      <div class="ann-divider"></div>
      <div class="ann-body">
        ${ann.important ? '<span style="font-size:0.78rem;font-weight:700;color:var(--secondary);">🔴 IMPORTANT</span><br>' : ''}
        <div class="ann-title">${ann.title}</div>
        <div class="ann-text">${ann.content}</div>
        <span class="ann-badge ${badgeClass}">${ann.category}</span>
      </div>
    </div>
  `;
}

// ---- Contact Form ----
const ContactForm = (() => {
  function init() {
    const form = $('#contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const originalText = btn.innerHTML;

      btn.innerHTML = '⏳ Sending...';
      btn.disabled = true;

      // Simulate form submission
      setTimeout(() => {
        btn.innerHTML = '✅ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

        setTimeout(() => {
          form.reset();
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      }, 1500);
    });
  }
  return { init };
})();

// ---- Initialize All ----
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  NavbarManager.init();
  ScrollTop.init();
  FAQ.init();
  Tabs.init();
  CounterManager.init();
  ContactForm.init();

  // Small delay for animation observer to avoid layout thrash
  requestAnimationFrame(() => {
    AnimateOnScroll.init();
  });

  // Add page-fade class to main content
  const main = document.querySelector('main') || document.querySelector('.main-content');
  if (main) main.classList.add('page-fade');
});

// ---- Export utilities for page-specific scripts ----
window.UdulaUtils = {
  fetchJSON,
  formatDate,
  buildTeacherCard,
  buildAnnouncementCard,
  $,
  $$
};
