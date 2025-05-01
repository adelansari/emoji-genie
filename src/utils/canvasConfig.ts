/**
 * Centralized configuration for canvas-related settings
 */

// Configuration for canvas sizing
export const canvasConfig = {
  // SVG content should take up this percentage of the canvas size (0-100)
  contentSizePercent: 80,
  
  // Default base size for SVG rendering (used as a baseline)
  baseSvgSize: 100,
  
  // Default white color - components can check against this to preserve original colors
  defaultColor: "#FFFFFF"
};

/**
 * Calculate how much an SVG should be scaled to take up the specified percentage of the canvas
 * @param canvasSize The current canvas size in pixels
 * @returns The scale factor to apply to the SVG
 */
export function getAdaptiveScale(canvasSize: number): number {
  // Calculate desired size based on percentage of canvas
  const desiredSize = (canvasSize * canvasConfig.contentSizePercent) / 100;
  
  // Calculate how much to scale the base SVG size to reach the desired size
  return desiredSize / canvasConfig.baseSvgSize;
}