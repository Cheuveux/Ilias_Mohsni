# Image Optimization Task List

This document lists all images in index.html that need dimension attributes and alt text.

## Photography Section Images (Priority: HIGH)

These images in the photography gallery need width, height, and better alt text:

### Photo Group 1 (top-left)
```html
<a href="details/photo-stockholm.html" class="photo-album photo-stockholm">
    <img src="https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/4_PHOTOGRAPHY/STOCKHOLM/resized_13.png" 
         alt="Photography series from Stockholm, Sweden" 
         width="300" height="400" loading="lazy">
    <h2>STOCKHOLM</h2>
</a>

<a href="details/photo-finlande.html" class="photo-album photo-finlande">
    <img src="https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/4_PHOTOGRAPHY/FINLAND/resized_14.png" 
         alt="Photography series from Finland" 
         width="300" height="400" loading="lazy">
    <h2>FINLAND</h2>
</a>
```

### Photo Group 2 (top-right)
```html
<a href="details/photo-tunisia.html" class="photo-album photo-tunisia">
    <img src="https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/4_PHOTOGRAPHY/TUNISIE/resized_11.png" 
         alt="Photography series from Tunisia, North Africa" 
         width="300" height="400" loading="lazy">
    <h2>TUNISIA</h2>
</a>

<a href="details/photo-UKSHIT.html" class="photo-album photo-ukshit">
    <img src="https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/4_PHOTOGRAPHY/UKSHIT/resized_13.png" 
         alt="Photography series from UK" 
         width="300" height="400" loading="lazy">
    <h2>UKSHIT</h2>
</a>
```

### Photo Group 3 (bottom-left)
```html
<a href="details/photo-senegal.html" class="photo-album photo-senegal">
    <img src="https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/4_PHOTOGRAPHY/SENEGAL/resized_14.png" 
         alt="Photography series from Senegal, West Africa" 
         width="300" height="400" loading="lazy">
    <h2>SENEGAL</h2>
</a>

<a href="details/photo-FDM2025.html" class="photo-album photo-fdm">
    <img src="https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/4_PHOTOGRAPHY/FDM/resized_12.png" 
         alt="Festival des Mondes 2025 gallery photos" 
         width="300" height="400" loading="lazy">
    <h2>FDM 2025</h2>
</a>
```

### Photo Group 4 (bottom-right)
```html
<a href="details/photo-barreka.html" class="photo-album photo-barreka">
    <img src="https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/4_PHOTOGRAPHY/Barreka/resized_3.png" 
         alt="Barreka photography collection" 
         width="300" height="400" loading="lazy">
    <h2>BARREKA</h2>
</a>
```

## Video Production Section Icons (Priority: MEDIUM)

The finger pointer icons in video details need attributes:
```html
<img class="clickable-link-icon" 
     src="https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/icons/gros%20doigt.svg" 
     alt="Click to view video details" 
     width="30" height="30">
```

**Locations:**
- NASS - DON PAPA (video slide 1)
- NASS - SLAHI OMAR M'A TUÉ (video slide 2)
- Other video production slides

## Montage Section Images (Priority: MEDIUM)

Brandt Mobile montage images in swiper slides need dimensions:
```html
<div class="img-lines">
    <img src="https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/1_PHOTOMONTAGE/LIGNES%20BRANDT/mobile-format/..." 
         alt="Lignes Brandt design series - image [number]" 
         width="100%" height="auto">
</div>
```

**Note:** These are aspect-ratio dependent, so width="100%" with proper CSS aspect-ratio is preferred.

---

## Implementation Steps

1. **Copy the exact HTML above** into index.html replacing the corresponding sections
2. **Verify dimensions**: The provided widths/heights (300x400) are estimates - adjust based on actual image sizes
3. **Test responsive behavior**: Ensure images still scale properly on mobile
4. **Run PageSpeed Insights** after updating to verify CLS score improves
5. **Consider image formats**: Check if WebP versions exist on R2 and use with PNG fallback

---

## Image Dimensions Notes

For responsive images where dimensions vary:
- Use CSS `aspect-ratio: property (e.g., `aspect-ratio: 3/4` for portrait photos)
- Add `widthwidth="100%"` and remove explicit height
- Let CSS aspect-ratio maintain proportions

Example:
```html
<img src="..." 
     alt="..." 
     width="100%" 
     height="auto"
     style="aspect-ratio: 3/4;">
```

---

## Accessibility Checklist

- [ ] All images have descriptive alt text (not empty)
- [ ] Alt text describes the image content/purpose
- [ ] Decorative-only images can have empty alt: `alt=""`
- [ ] Context-dependent images have meaningful descriptions
- [ ] Link images describe the destination: `alt="View [album name] gallery"`

---

## Performance Checklist

- [ ] All images have width and height (prevents CLS)
- [ ] Images below fold have `loading="lazy"`
- [ ] Images use appropriate formats (WebP with PNG fallback)
- [ ] Images are compressed appropriately
- [ ] No inline dimension styles (use CSS or attributes)

---

## Tools for Getting Exact Image Dimensions

1. **Browser DevTools:**
   - Right-click image → Inspect
   - Check computed width/height in Elements panel

2. **Command Line (if you have access):**
   ```bash
   file image.png  # Shows basic info
   identify image.png  # Shows dimensions (requires ImageMagick)
   ```

3. **Online Tools:**
   - Use your browser's Network tab to download and inspect images
   - Right-click → Properties → Details

---

## Notes on Actual Image Sizes

The images on R2 appear to be resized versions (resized_3.png, resized_12.png, etc.). Typical aspect ratios observed:
- Photography gallery: **3:4** (portrait) or **4:3** (landscape)
- Montage images: **Variable** (check actual files)
- Icons: **30x30 to 80x80** (square)

Recommend checking R2 CDN or dev tools to get exact pixel dimensions before finalizing.
