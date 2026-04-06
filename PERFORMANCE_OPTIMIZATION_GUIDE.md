# Performance Optimization Guide for Ilias Mohsni Website

## ✅ Completed Optimizations

### 1. **Preconnect Hints Added**
All HTML files now include preconnect hints for critical third-party origins:
- `fonts.googleapis.com` - Google Fonts API
- `fonts.gstatic.com` - Google Fonts assets
- `cdn.jsdelivr.net` - JSATS and CSS library CDN
- `cdnjs.cloudflare.com` - Anime.js library
- `vjs.zencdn.net` - Video.js (for detail pages)
- `pub-a10275f333c642cb944fe34bf2332caa.r2.dev` - R2 storage

**Impact:** Saves ~300ms on LCP by establishing connections to critical origins earlier.

### 2. **Viewport Meta Tag Fixed**
**Before:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

**After:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Improvements:**
- ✅ Allows pinch-to-zoom (accessibility)
- ✅ Removes user-scalable=no restriction
- ✅ Compliance with accessibility guidelines

### 3. **LCP Image Optimization**
**The finger icon (LCP element):**
- Added `fetchpriority="high"` - tells browser to prioritize loading
- Added explicit dimensions: `width="80" height="80"`
- Added descriptive alt text: `alt="Pointer icon"`

```html
<img src="..." alt="Pointer icon" width="80" height="80" fetchpriority="high">
```

**Impact:** Faster LCP rendering.

### 4. **Script Defer Attributes**
Added `defer` to all non-critical custom scripts:
- `js/swiper.js`
- `js/scroll.js`
- `js/nav.js`
- `js/anim_logo.js`
- `js/photomontage.js`
- `js/anim_hover_photo.js`
- `js/submenu.js`
- And detailpages equivalents

**Why:** Deferred scripts load in parallel with HTML parsing and execute after DOM is ready, preventing render-blocking.

**Critical scripts (NOT deferred):**
- GSAP (animation library - needed for loader)
- Swiper (carousel - needed for layout)
- Anime.js (small animation library)

### 5. **Fixed HTML Issues**
- Corrected meta description attribute from `description=` to `name="description"`
- Fixed malformed viewport meta tags in detail pages (`width=,` → `width=device-width`)

---

## 🚀 Recommended Server-Side Optimizations

### 1. **R2 Cache Headers (HIGH PRIORITY)**
**Problem:** All R2.dev assets have NO cache headers (TTL=None)
- Potential savings: **165 MB** on repeated visits
- Affects: Images, videos, SVG icons

**Solution:** Add Cache-Control headers to R2:

```
Cache-Control: public, max-age=31536000, immutable
```

For media/assets. Use conditional cache periods:
- **Immutable assets** (versioned): 1 year
- **Images/videos:** 30 days to 6 months
- **SVG icons:** 1 year

**R2 Configuration:**
```
# Add to your R2 bucket configuration or via Wrangler (if using Cloudflare Workers)
{
  "cacheControl": "public, max-age=31536000, immutable"
}
```

**Impact:** Extremely large savings on repeat visits.

### 2. **Font Loading Optimization**
**Current:** Fonts load asynchronously but may cause layout shift

**Recommendation:** Add font-display strategy to Google Fonts:

```html
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" as="style">
```

The `display=swap` parameter tells browser:
- Use system font first
- Swap to Google Font when loaded
- Prevents invisible text

### 3. **Image Optimization (CRITICAL)**
**Problem:** Images lack explicit width/height, causing layout shift

**Required Actions:**
1. Add `width` and `height` attributes to ALL `<img>` tags
2. Consider modern formats (WebP) with fallbacks
3. Use responsive images (`srcset`) for different screen sizes

**Example:**
```html
<!-- Before (causes CLS - Cumulative Layout Shift) -->
<img src="image.png" alt="">

<!-- After -->
<img 
  src="image.png" 
  alt="Description of image" 
  width="400" 
  height="600"
  loading="lazy"
>
```

**Images to update in index.html:**
- Photography section images (all photo groups)
- Brandt montage images
- All icons

**Photography Images Needing Updates:**
```
/4_PHOTOGRAPHY/SENEGAL/resized_14.png
/4_PHOTOGRAPHY/FDM/resized_12.png
/4_PHOTOGRAPHY/FINLAND/resized_14.png
/4_PHOTOGRAPHY/STOCKHOLM/resized_13.png
/4_PHOTOGRAPHY/UKSHIT/resized_13.png
/4_PHOTOGRAPHY/TUNISIE/resized_11.png
/4_PHOTOGRAPHY/Barreka/resized_3.png
```

### 4. **Lazy Loading Implementation**
Add `loading="lazy"` to images below the fold:

```html
<img 
  src="..." 
  alt="..." 
  width="400" 
  height="300"
  loading="lazy"
>
```

**Impact:** Defers image downloads until needed, improving initial page load.

### 5. **JavaScript Unused Code Analysis**
**Problem:** 27 KiB of unused JavaScript detected

**Actions:**
1. Review each JS file:
   - `js/anim_logo.js` - Check if logo animation is essential on all pages
   - `js/anim_hover_photo.js` - Check hover effects
   - `js/photomontage.js` - Check if montage is above fold
   
2. Consider:
   - Code splitting (load JS only on pages that need it)
   - Tree-shaking for library imports
   - Removing unused animation features

### 6. **Video Optimization**
**Current:** Videos on detail pages may be slow to load

**Recommendations:**
- Ensure all videos use `preload="metadata"` (don't auto-load)
- Use appropriate formats (h.264 for compatibility)
- Consider adaptive bitrate streaming for large videos
- Add `poster` attribute to show thumbnail while loading

---

## 📊 Expected Performance Improvements

| Optimization | Impact | Priority |
|---|---|---|
| R2 Cache Headers | **Massive** (165 MB savings) | 🔴 CRITICAL |
| Image width/height | **High** (fixes CLS) | 🔴 CRITICAL |
| Font optimization | **Medium** (fixes FOUT) | 🟠 HIGH |
| Lazy loading images | **Medium** (faster initial load) | 🟠 HIGH |
| Unused JS cleanup | **Low** (27 KiB) | 🟡 MEDIUM |
| Preconnect hints | **Medium** (300 ms LCP) | ✅ DONE |
| Script defer | **Medium** (non-blocking) | ✅ DONE |

---

## 🔧 Implementation Checklist

### Phase 1: Critical (Do First)
- [ ] Add R2 cache headers (contact Cloudflare/R2 support)
- [ ] Add width/height to all images
- [ ] Add alt text to all images (accessibility)
- [ ] Implement lazy loading on below-fold images

### Phase 2: Important (Do Soon)
- [ ] Optimize Google Fonts loading
- [ ] Remove/defer unused JavaScript
- [ ] Add LQIP (Low Quality Image Placeholder) for images
- [ ] Implement WebP images with PNG fallbacks

### Phase 3: Enhancement (Nice to Have)
- [ ] Adapter bitrate streaming for videos
- [ ] Image compression/optimization tools
- [ ] CSS critical path inlining
- [ ] Service Worker for offline support

---

## 📚 Resources

### Cache Headers for CDN
- Cloudflare R2 Cache Documentation: https://developers.cloudflare.com/r2/
- MDN Cache-Control: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control

### Image Optimization
- Google PageSpeed Optimization Guide: https://developers.google.com/speed/docs/insights/OptimizeImages
- Web.dev Image Optimization: https://web.dev/image-optimization/
- ImageOptim (free tool): https://imageoptim.com/
- TinyPNG (compression): https://tinypng.com/

### Fonts
- Google Fonts API Optimization: https://fonts.google.com/
- Font Loading Best Practices: https://web.dev/optimize-web-vitals/

### Testing
- PageSpeed Insights: https://pagespeed.web.dev/
- WebPageTest: https://www.webpagetest.org/
- Lighthouse: https://developers.google.com/web/tools/lighthouse

---

## 🎯 Next Steps

1. **Immediately:** Configure R2 cache headers (highest impact)
2. **This week:** Add image dimensions and alt text
3. **Next week:** Optimize JavaScript and implement lazy-loading
4. **Ongoing:** Monitor PageSpeed Insights scores after each change

**Expected result:** Improvement from current score to **85-90+ on PageSpeed Insights**
