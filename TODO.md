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

