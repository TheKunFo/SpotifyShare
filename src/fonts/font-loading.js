/**
 * Font Loading Strategy
 *
 * This file provides utilities for optimal font loading and performance.
 * It includes font loading detection, fallback strategies, and performance optimization.
 */

/**
 * Preload critical fonts for better performance
 * Add these link tags to your index.html <head> section:
 *
 * <link rel="preload" href="path/to/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>
 * <link rel="preload" href="path/to/Inter-Medium.woff2" as="font" type="font/woff2" crossorigin>
 * <link rel="preload" href="path/to/Poppins-SemiBold.woff2" as="font" type="font/woff2" crossorigin>
 */

/**
 * Check if fonts are loaded and available
 */
export const checkFontLoaded = (
  fontFamily,
  weight = "400",
  style = "normal"
) => {
  if (!document.fonts) {
    return Promise.resolve(false);
  }

  return document.fonts.check(`${weight} ${style} 12px "${fontFamily}"`);
};

/**
 * Load fonts with fallback
 */
export const loadFontsWithFallback = async () => {
  const fonts = [
    { family: "Inter", weight: "400" },
    { family: "Inter", weight: "500" },
    { family: "Inter", weight: "600" },
    { family: "Poppins", weight: "500" },
    { family: "Poppins", weight: "600" },
    { family: "Roboto", weight: "400" },
  ];

  const fontPromises = fonts.map(async ({ family, weight }) => {
    try {
      if (document.fonts && document.fonts.load) {
        await document.fonts.load(`${weight} 12px "${family}"`);
        return { family, weight, loaded: true };
      }
      return { family, weight, loaded: false };
    } catch (error) {
      console.warn(`Failed to load font ${family} ${weight}:`, error);
      return { family, weight, loaded: false };
    }
  });

  const results = await Promise.allSettled(fontPromises);
  return results
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter(Boolean);
};

/**
 * Apply font loading class to body
 */
export const applyFontLoadingState = () => {
  // Add loading class
  document.body.classList.add("fonts-loading");

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      document.body.classList.remove("fonts-loading");
      document.body.classList.add("fonts-loaded");
    });
  } else {
    // Fallback timeout
    setTimeout(() => {
      document.body.classList.remove("fonts-loading");
      document.body.classList.add("fonts-loaded");
    }, 3000);
  }
};

/**
 * Get optimal font stack based on availability
 */
export const getOptimalFontStack = (primaryFont) => {
  const fontStacks = {
    Inter: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Helvetica Neue",
      "sans-serif",
    ],
    Poppins: [
      "Poppins",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Helvetica Neue",
      "sans-serif",
    ],
    Roboto: [
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Helvetica Neue",
      "sans-serif",
    ],
  };

  return fontStacks[primaryFont] || fontStacks["Inter"];
};

/**
 * Initialize font loading optimization
 * Call this in your main application entry point
 */
export const initializeFontLoading = () => {
  // Apply loading state
  applyFontLoadingState();

  // Load fonts with performance monitoring
  loadFontsWithFallback().then((results) => {
    console.log("Font loading results:", results);

    // Dispatch custom event when fonts are ready
    const event = new CustomEvent("fontsReady", { detail: results });
    document.dispatchEvent(event);
  });
};

/**
 * Font display CSS for different loading states
 * Add this to your CSS:
 *
 * .fonts-loading {
 *   font-display: swap;
 * }
 *
 * .fonts-loaded {
 *   font-display: auto;
 * }
 */
