# Font System Documentation

This project uses a comprehensive font loading system with `@font-face` declarations for optimal performance and user experience.

## Font Structure

```
src/fonts/
├── index.css          # Main font declarations and CSS variables
├── local-fonts.css    # Template for local font files
├── font-loading.js    # Font loading utilities and performance optimization
├── files/             # Directory for local font files (when needed)
└── README.md          # This documentation
```

## Current Font Setup

### Primary Fonts

- **Inter**: Primary body text font (300, 400, 500, 600, 700 weights)
- **Poppins**: Heading font (300, 400, 500, 600, 700 weights)
- **Roboto**: Secondary/alternative font (300, 400, 500, 700 weights)

### Font Loading Strategy

Currently using optimized `@font-face` declarations that load fonts from Google Fonts CDN with:

- `font-display: swap` for better perceived performance
- Proper fallback font stacks
- Performance optimizations (preloading, loading states)

## CSS Variables

Use these CSS custom properties in your components:

```css
/* Font families */
--font-primary: "Inter", fallbacks...
--font-secondary: "Roboto", fallbacks...
--font-heading: "Poppins", fallbacks...

/* Font weights */
--font-weight-light: 300
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

## Utility Classes

```css
/* Font families */
.font-primary     /* Apply Inter font */
/* Apply Inter font */
.font-secondary   /* Apply Roboto font */
.font-heading     /* Apply Poppins font */

/* Font weights */
.font-light       /* 300 weight */
.font-normal      /* 400 weight */
.font-medium      /* 500 weight */
.font-semibold    /* 600 weight */
.font-bold; /* 700 weight */
```

## Usage Examples

### In CSS

```css
.my-component {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-medium);
}

.heading {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-semibold);
}
```

### In JSX with utility classes

```jsx
<h1 className="font-heading font-semibold">Page Title</h1>
<p className="font-primary font-normal">Body text</p>
<span className="font-secondary font-medium">Secondary text</span>
```

## Switching to Local Fonts

To use local font files instead of CDN:

1. **Download font files** (preferably .woff2 format for best compression)
2. **Place files** in `src/fonts/files/` directory:

   ```
   src/fonts/files/
   ├── inter/
   │   ├── Inter-Light.woff2
   │   ├── Inter-Regular.woff2
   │   ├── Inter-Medium.woff2
   │   ├── Inter-SemiBold.woff2
   │   └── Inter-Bold.woff2
   ├── poppins/
   └── roboto/
   ```

3. **Update font declarations** in `src/fonts/local-fonts.css`:

   ```css
   @font-face {
     font-family: "Inter";
     src: url("./files/inter/Inter-Regular.woff2") format("woff2");
     font-weight: 400;
     font-style: normal;
     font-display: swap;
   }
   ```

4. **Import local fonts** in `src/fonts/index.css`:

   ```css
   @import "./local-fonts.css";
   ```

5. **Comment out** the CDN-based `@font-face` declarations

## Performance Features

- **Font preloading**: Add preload hints in `index.html`
- **Loading states**: Visual feedback during font loading
- **Fallback fonts**: System fonts used until custom fonts load
- **Optimal compression**: WOFF2 format with fallbacks
- **Font display swap**: Prevents invisible text during loading

## Font Loading Events

The system dispatches a `fontsReady` event when fonts are loaded:

```javascript
document.addEventListener("fontsReady", (event) => {
  console.log("Fonts loaded:", event.detail);
});
```

## Browser Support

- **Modern browsers**: Full support with WOFF2
- **Older browsers**: Automatic fallback to system fonts
- **Font loading API**: Enhanced experience where supported

## Best Practices

1. **Use CSS variables** for consistent font application
2. **Leverage utility classes** for quick styling
3. **Test font loading** on slow connections
4. **Monitor performance** with browser dev tools
5. **Consider font subsetting** for better performance if using many languages/characters
