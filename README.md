# 🎓 Udula Institute Website

**A/L & O/L Tuition Institute | Horana, Sri Lanka**

A modern, responsive, fully static website for Udula Institute — built with pure HTML5, CSS3, and Vanilla JavaScript. No frameworks, no backend. 100% GitHub Pages compatible.

---

## 📁 Project Structure

```
/
├── index.html              # Homepage (hero, quick links, announcements, FAQ)
├── about.html              # About page (history, mission, facilities, timeline)
├── teachers.html           # Teachers page (dynamic cards from JSON)
├── timetable.html          # Timetable page (dynamic table from JSON)
├── fees.html               # Fees page (fee tables + payment info from JSON)
├── holidays.html           # Holiday schedule (from JSON)
├── notices.html            # Announcements (filterable, from JSON)
├── contact.html            # Contact page (form UI + map placeholder)
├── resources.html          # Study materials (download links)
├── gallery.html            # Photo gallery (lightbox + filter)
├── .nojekyll               # GitHub Pages config
├── assets/
│   ├── css/
│   │   ├── style.css       # Main design system & all component styles
│   │   └── animations.css  # Animations & additional utilities
│   ├── js/
│   │   ├── main.js         # Core: theme, navbar, FAQ, scroll, tabs
│   │   └── pages.js        # Page-specific JSON data loading
│   └── images/
│       └── favicon.svg     # Site favicon
└── data/
    ├── teachers.json       # Teacher profiles (A/L & O/L)
    ├── timetable.json      # Weekly class schedule
    ├── fees.json           # Fee structure + payment info
    ├── announcements.json  # Notices & announcements
    └── holidays.json       # 2025 public holidays & term breaks
```

---

## ✨ Features

- 🌙 **Dark / Light Mode** – Persistent theme toggle
- 📱 **Mobile-First** – Fully responsive with hamburger menu
- 🔄 **JSON Data** – All dynamic content loaded via `fetch()`
- 🎨 **Modern UI** – Glassmorphism, gradient hero, smooth animations
- 📊 **Dynamic Tables** – Timetable & fee tables rendered from JSON
- 🔍 **Filterable Content** – Gallery and notices with category filters
- 💡 **FAQ Accordion** – Smooth open/close with CSS transitions
- 🖼️ **Gallery Lightbox** – Click to expand images
- 🔢 **Counter Animations** – Stats animate on scroll
- ⬆️ **Scroll-to-Top** – Button appears after scrolling

---

## 🚀 GitHub Pages Deployment

### Step 1: Initialize Git
```bash
cd /path/to/Udula-Institute
git init
git add .
git commit -m "Initial project setup and folder structure"
```

### Step 2: Create GitHub Repository
- Go to [github.com](https://github.com) → New Repository
- Name: `udula-institute` (or your preferred name)
- Public repository
- Do NOT initialize with README (you already have one)

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/udula-institute.git
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages
- Go to your repository → **Settings** → **Pages**
- Source: **Deploy from branch**
- Branch: **main** / **root**
- Click **Save**

### Step 5: Access Your Site
Your site will be live at:
```
https://YOUR_USERNAME.github.io/udula-institute/
```

---

## 📝 10 Git Commit Plan

```bash
# 1. Initial project setup
git commit -m "feat: initial project setup and folder structure"

# 2. Homepage layout
git commit -m "feat: homepage layout with hero section and navbar"

# 3. About page
git commit -m "feat: about page with history, mission, and facilities"

# 4. Teachers page
git commit -m "feat: teachers page with JSON data rendering"

# 5. Timetable page
git commit -m "feat: timetable page with dynamic table rendering"

# 6. Fees page
git commit -m "feat: fees page with structured pricing layout and payment info"

# 7. Holidays page
git commit -m "feat: holidays page with JSON integration and term breaks"

# 8. Contact page
git commit -m "feat: contact page UI with form and location details"

# 9. Styling improvements
git commit -m "style: responsive improvements, dark mode, animations polish"

# 10. Final optimization
git commit -m "chore: final optimization and GitHub Pages deployment readiness"
```

---

## 🛠️ Customization Guide

### Update Institute Name
- Replace all `Udula Institute` text in HTML files
- Update the `nav-logo-name` spans

### Update Contact Details
- Edit phone, address, and email in each HTML file's footer and contact page
- Replace `info@udulainstitute.lk` with your actual email

### Add Teachers
- Edit `data/teachers.json` — add objects following the same schema
- Images: put photos in `assets/images/` and update the `image` field

### Add Timetable Entries
- Edit `data/timetable.json` — add entries to `al` streams or `ol` array

### Embed Real Google Map
- In `contact.html`, replace the map placeholder div with:
```html
<iframe 
  src="https://www.google.com/maps/embed?pb=YOUR_MAP_EMBED_URL"
  width="100%" height="280" style="border:0;" loading="lazy">
</iframe>
```

### Add Real Resources (PDFs)
- Upload PDFs to `assets/resources/` folder
- Update `href` attributes in `resources.html` to point to the PDF paths

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Blue | `#1a4fd6` |
| Secondary Orange | `#f97316` |
| Accent Cyan | `#06b6d4` |
| Font Heading | Poppins |
| Font Body | Inter |
| Border Radius | 6px / 12px / 20px / 28px |

---

## 📄 License

© 2025 Udula Institute, Horana. All rights reserved.
