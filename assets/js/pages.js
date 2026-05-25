/* =====================================================
   Udula Institute - Page-specific scripts
   Handles dynamic data loading for each page
   ===================================================== */

'use strict';

// ======================================================
// TEACHERS PAGE
// ======================================================
async function initTeachersPage() {
  const container = document.getElementById('teachersContainer');
  if (!container) return;

  const data = await UdulaUtils.fetchJSON('data/teachers.json');
  if (!data) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">😞</div><p>Could not load teacher data.</p></div>';
    return;
  }

  function renderTeachers(teachers) {
    if (!teachers.length) return '<div class="empty-state"><p>No teachers found.</p></div>';
    return teachers.map(UdulaUtils.buildTeacherCard).join('');
  }

  // Tab switching
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const tab = btn.dataset.tab;
    const grid = document.getElementById('teacherGrid');
    if (!grid) return;

    if (tab === 'al') grid.innerHTML = renderTeachers(data.al);
    else grid.innerHTML = renderTeachers(data.ol);

    // Re-trigger animations
    requestAnimationFrame(() => {
      UdulaUtils.$$('.teacher-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.animation = `fadeInUp 0.4s ease ${i * 0.06}s forwards`;
      });
    });
  });

  // Initial render
  const grid = document.getElementById('teacherGrid');
  if (grid) grid.innerHTML = renderTeachers(data.al);
}

// ======================================================
// TIMETABLE PAGE
// ======================================================
async function initTimetablePage() {
  const container = document.getElementById('timetableContainer');
  if (!container) return;

  const data = await UdulaUtils.fetchJSON('data/timetable.json');
  if (!data) {
    container.innerHTML = '<div class="empty-state"><p>Could not load timetable data.</p></div>';
    return;
  }

  function buildTimetableRow(cls) {
    const medium = cls.medium === 'Sinhala' ? 'medium-sinhala' : 'medium-english';
    return `
      <tr>
        <td class="tt-day">${cls.day}</td>
        <td><span>${cls.time}</span></td>
        <td class="tt-subject">${cls.subject}</td>
        <td class="tt-teacher">${cls.teacher}</td>
        <td class="tt-hall">${cls.hall}</td>
        <td><span class="medium-badge ${medium}">${cls.medium}</span></td>
      </tr>
    `;
  }

  function buildGroupHeader(name) {
    return `<tr class="group-header"><td colspan="6">📚 ${name}</td></tr>`;
  }

  // A/L Timetable
  const alContainer = document.getElementById('alTimetableBody');
  if (alContainer && data.al) {
    let html = '';
    for (const [stream, classes] of Object.entries(data.al)) {
      html += buildGroupHeader(stream);
      html += classes.map(buildTimetableRow).join('');
    }
    alContainer.innerHTML = html;
  }

  // O/L Timetable
  const olContainer = document.getElementById('olTimetableBody');
  if (olContainer && data.ol) {
    olContainer.innerHTML = data.ol.map(cls => {
      const medium = cls.medium === 'Sinhala' ? 'medium-sinhala' : 'medium-english';
      return `
        <tr>
          <td class="tt-day">${cls.day}</td>
          <td>${cls.time}</td>
          <td class="tt-subject">${cls.subject}</td>
          <td class="tt-teacher">${cls.teacher}</td>
          <td class="tt-hall">${cls.hall}</td>
          <td><span class="grade-badge">${cls.grade}</span></td>
          <td><span class="medium-badge ${medium}">${cls.medium}</span></td>
        </tr>
      `;
    }).join('');
  }
}

// ======================================================
// FEES PAGE
// ======================================================
async function initFeesPage() {
  const container = document.getElementById('feesContainer');
  if (!container) return;

  const data = await UdulaUtils.fetchJSON('data/fees.json');
  if (!data) {
    container.innerHTML = '<div class="empty-state"><p>Could not load fees data.</p></div>';
    return;
  }

  function buildFeeRow(fee, index) {
    const total = fee.monthly_fee + fee.paper_fee;
    return `
      <tr>
        <td>${index + 1}</td>
        <td class="tt-subject">${fee.subject}</td>
        <td>${fee.stream || fee.grade || '—'}</td>
        <td>${fee.teacher}</td>
        <td style="font-weight:700;color:var(--primary)">Rs. ${fee.monthly_fee.toLocaleString()}</td>
        <td>Rs. ${fee.registration_fee.toLocaleString()}</td>
        <td>Rs. ${fee.paper_fee.toLocaleString()}</td>
        <td style="font-weight:700;color:var(--success)">Rs. ${total.toLocaleString()}</td>
        <td>${fee.notes ? `<small style="color:var(--text-muted)">${fee.notes}</small>` : '—'}</td>
      </tr>
    `;
  }

  const alBody = document.getElementById('alFeesBody');
  if (alBody && data.al) alBody.innerHTML = data.al.map(buildFeeRow).join('');

  const olBody = document.getElementById('olFeesBody');
  if (olBody && data.ol) olBody.innerHTML = data.ol.map(buildFeeRow).join('');

  // Payment info
  const pi = data.payment_info;
  if (pi) {
    const dueEl = document.getElementById('payDueDate');
    if (dueEl) dueEl.textContent = pi.due_date;

    const lateFeeEl = document.getElementById('payLateFee');
    if (lateFeeEl) lateFeeEl.textContent = pi.late_fee;

    const discountEl = document.getElementById('payDiscount');
    if (discountEl) discountEl.textContent = pi.discount;

    const methodsEl = document.getElementById('payMethods');
    if (methodsEl) methodsEl.innerHTML = pi.methods.map(m => `<li>• ${m}</li>`).join('');

    const bankEl = document.getElementById('bankDetails');
    if (bankEl) {
      const b = pi.bank_details;
      bankEl.innerHTML = `
        <li>Bank: ${b.bank}</li>
        <li>Branch: ${b.branch}</li>
        <li>Account: ${b.account_name}</li>
        <li>Account No: ${b.account_number}</li>
      `;
    }
  }
}

// ======================================================
// HOLIDAYS PAGE
// ======================================================
async function initHolidaysPage() {
  const container = document.getElementById('holidaysContainer');
  if (!container) return;

  const data = await UdulaUtils.fetchJSON('data/holidays.json');
  if (!data) {
    container.innerHTML = '<div class="empty-state"><p>Could not load holiday data.</p></div>';
    return;
  }

  const today = new Date();

  function buildHolidayCard(h) {
    const date = UdulaUtils.formatDate(h.date);
    const isPast = new Date(h.date) < today;
    const typeMap = {
      'Public Holiday': 'type-public',
      'Poya Holiday': 'type-poya'
    };
    const typeClass = typeMap[h.type] || 'type-poya';

    return `
      <div class="holiday-card ${isPast ? 'opacity-60' : ''}">
        <div class="holiday-date-box">
          <div class="hd-day">${date.day}</div>
          <div class="hd-month">${date.month}</div>
        </div>
        <div class="holiday-info">
          <div class="holiday-name">${h.name}</div>
          <span class="holiday-type-badge ${typeClass}">${h.type}</span>
          <div class="holiday-note">${h.note}</div>
        </div>
      </div>
    `;
  }

  function buildTermBreakCard(tb) {
    const start = UdulaUtils.formatDate(tb.start);
    const end = UdulaUtils.formatDate(tb.end);
    return `
      <div class="term-break-card">
        <div>
          <div class="tb-name">${tb.name}</div>
          <div class="tb-note">${tb.note}</div>
        </div>
        <div>
          <div class="tb-dates">${start.day} ${start.month} – ${end.day} ${end.month} ${end.year}</div>
        </div>
      </div>
    `;
  }

  const holidayGrid = document.getElementById('holidayGrid');
  if (holidayGrid) holidayGrid.innerHTML = data.holidays.map(buildHolidayCard).join('');

  const termGrid = document.getElementById('termBreakGrid');
  if (termGrid) termGrid.innerHTML = data.term_holidays.map(buildTermBreakCard).join('');

  // Show year in heading
  const yearEl = document.getElementById('holidayYear');
  if (yearEl) yearEl.textContent = data.year;
}

// ======================================================
// HOMEPAGE ANNOUNCEMENTS
// ======================================================
async function initHomepageAnnouncements() {
  const container = document.getElementById('announcementsContainer');
  if (!container) return;

  const data = await UdulaUtils.fetchJSON('data/announcements.json');
  if (!data) return;

  // Show only latest 4
  const latest = data.slice(0, 4);
  container.innerHTML = latest.map(UdulaUtils.buildAnnouncementCard).join('');
}

// ======================================================
// NOTICES PAGE (all announcements)
// ======================================================
async function initNoticesPage() {
  const container = document.getElementById('noticesContainer');
  if (!container) return;

  const data = await UdulaUtils.fetchJSON('data/announcements.json');
  if (!data) {
    container.innerHTML = '<div class="empty-state"><p>Could not load notices.</p></div>';
    return;
  }

  // Filter functionality
  const filterBtns = UdulaUtils.$$('.filter-btn');
  function renderNotices(filter = 'All') {
    const filtered = filter === 'All' ? data : data.filter(a => a.category === filter);
    container.innerHTML = filtered.length
      ? filtered.map(UdulaUtils.buildAnnouncementCard).join('')
      : '<div class="empty-state"><p>No notices in this category.</p></div>';
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderNotices(btn.dataset.filter);
    });
  });

  renderNotices();
}

// ======================================================
// Auto-Initialize Based on Page
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  switch (page) {
    case 'teachers': initTeachersPage(); break;
    case 'timetable': initTimetablePage(); break;
    case 'fees': initFeesPage(); break;
    case 'holidays': initHolidaysPage(); break;
    case 'home': initHomepageAnnouncements(); break;
    case 'notices': initNoticesPage(); break;
  }
});
