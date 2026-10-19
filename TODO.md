# Guthli Foundation - Fixes & Improvements

## ✅ Completed Steps

- [x] **Upload Folder Structure** - Created `uploads/`, `uploads/logos/`, `uploads/images/` directories with `.gitkeep` files
- [x] **Fixed Smooth Scrolling** - Updated Lenis config:
  - Enabled `smoothTouch: true` with `touchMultiplier: 1.2` for smooth mobile scrolling
  - Added `wheelMultiplier: 0.8` for smoother desktop wheel scrolling
  - Added `lerp: 0.08` for smoother interpolation
  - Added window resize handler for Lenis recalculation
- [x] **Removed Conflicting CSS** - Deleted `scroll-behavior: smooth` from `<html>` that conflicted with Lenis
- [x] **Optimized GSAP Integration** - Reordered `gsap.ticker.lagSmoothing(0)` before ticker add for better initialization
- [x] **Fixed Popup / Apply Modal Not Appearing**
  - Root cause: a `TypeError` in `themeToggle.init()` because `#themeToggle` doesn't exist in the HTML, which halted the init chain before `applyModal.init()` ran.
  - Added a null-guard in `themeToggle.init()`.
  - Wrapped every feature's `init()` in a safe `run()` helper so one failure no longer blocks the others.
  - `applyModal.init()` now always executes, wiring up the "Apply Now" / "Become a Volunteer" buttons so the popup appears.
- [x] **Added Event Registration Modal**
  - Added `#eventModal` markup in `index.html` with fields for name, email, phone, event selection, people count, and message.
  - Wired the event registration links to open this modal and submit through EmailJS in `app.js`.
  - Registrations are sent via EmailJS to `guthlifoundation2026@gmail.com`.
  - Removed `.event-register` from the `applyModal` triggers so event links open only the event modal.
- [x] **Updated Events Section to Two Events Only**
  - Replaced the 4 placeholder events (Independence Day, Tree Plantation, Career Guidance, Blood Donation) with only two real upcoming events:
    1. **Interactive Session with ISRO Ex-Intern** — Online/virtual session to get to know the ex-intern and the culture inside ISRO (with Q&A).
  2. **Plantation Drive** — Offline drive expected in September–October 2026.
  - Updated the event registration modal's "Select Event" dropdown to match these two events with correct labels.

## ⚠️ Manual Step Required (EmailJS Dashboard)

**Why the application email is missing "Application For" and "Submitted On"**

Both the **Volunteer/Apply form** (`applyModal`) and the **Event Registration form** (`eventModal`) currently share the **same** EmailJS template ID: `template_vrt6ibc`.

- This template was originally created for the **event** form and only contains event placeholders (`{{event}}`, `{{count}}`).
- It does **not** contain the application placeholders (`{{application_type}}`, `{{time}}`).

The JavaScript in `app.js` **already sends** these values:
- `application_type` → the selected Role/Position (e.g. "Community Coordinator")
- `time` → `new Date().toLocaleString()` (the "Submitted On" timestamp)

**Fix (Option B chosen):** Edit the existing `template_vrt6ibc` template in your EmailJS dashboard
(EmailJS → Email Templates → `template_vrt6ibc` → Edit) so its subject/body includes these placeholders:

```
Subject: New Application from {{name}}

Body:
  Name            : {{name}}
  Email           : {{email}}
  Phone           : {{phone}}
  Application For : {{application_type}}
  Submitted On    : {{time}}
  Message         : {{message}}

  Reply-To        : {{email}}
```

> Note: Using one shared template means the event email and the application email will render together. If you later want them fully separate, create a new template for the application form and update the application template ID in `app.js`.

## Redesign notes

- The current site is a static HTML, CSS, and JavaScript page. `redesign.css` and `app.js` are the active frontend files; no package manager or build configuration is present.
- Application and event forms retain their existing EmailJS IDs and field payloads. Newsletter collection has no backend integration; the UI now says so instead of showing a false subscription success.

