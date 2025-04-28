import html2canvas from 'html2canvas';
import Konva from 'konva';

/**
 * Utility functions for exporting emoji/sticker designs as images
 */

/**
 * Helper function to convert modern color formats to compatible rgb/rgba
 * @param element - The DOM element to process
 * @returns The cloned element that was prepared for capture
 */
const prepareElementForCapture = (element: HTMLElement): HTMLElement => {
  // Deep clone the element to avoid modifying the original
  const clonedElement = element.cloneNode(true) as HTMLElement;
  clonedElement.id = 'capture-clone';
  clonedElement.style.position = 'absolute';
  clonedElement.style.left = '-9999px';
  clonedElement.style.top = '0';
  
  // Add the cloned element to the document temporarily
  document.body.appendChild(clonedElement);
  
  // Process all elements including the root
  const allElements = [clonedElement, ...Array.from(clonedElement.querySelectorAll('*'))];
  
  allElements.forEach(el => {
    if (el instanceof HTMLElement || el instanceof SVGElement) {
      // Get computed style
      const computedStyle = window.getComputedStyle(el);
      
      // Create clean inline styles with rgb values only
      const inlineStyles: Record<string, string> = {};
      
      // Handle background color - force to RGB
      const bgColor = computedStyle.backgroundColor;
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        // Create a temporary div to convert color format
        const tempDiv = document.createElement('div');
        tempDiv.style.backgroundColor = bgColor;
        document.body.appendChild(tempDiv);
        const convertedBgColor = window.getComputedStyle(tempDiv).backgroundColor;
        document.body.removeChild(tempDiv);
        
        inlineStyles.backgroundColor = convertedBgColor;
      } else {
        // Use a default background for transparent elements
        inlineStyles.backgroundColor = 'rgba(255, 255, 255, 0)';
      }
      
      // Handle text color - force to RGB
      const textColor = computedStyle.color;
      if (textColor) {
        const tempDiv = document.createElement('div');
        tempDiv.style.color = textColor;
        document.body.appendChild(tempDiv);
        const convertedTextColor = window.getComputedStyle(tempDiv).color;
        document.body.removeChild(tempDiv);
        
        inlineStyles.color = convertedTextColor;
      }
      
      // Handle SVG fill
      if (el instanceof SVGElement) {
        const fill = computedStyle.fill;
        if (fill && fill !== 'none') {
          const tempDiv = document.createElement('div');
          tempDiv.style.color = fill;
          document.body.appendChild(tempDiv);
          const convertedFill = window.getComputedStyle(tempDiv).color;
          document.body.removeChild(tempDiv);
          
          el.setAttribute('fill', convertedFill);
        }
      }
      
      // Apply the inline styles
      Object.keys(inlineStyles).forEach(prop => {
        (el as HTMLElement).style[prop as any] = inlineStyles[prop];
      });
    }
  });
  
  return clonedElement;
};

/**
 * Helper function to clean up after capture
 * @param clonedElement - The cloned element to remove
 */
const cleanupAfterCapture = (clonedElement: HTMLElement | null): void => {
  if (clonedElement && clonedElement.parentNode) {
    clonedElement.parentNode.removeChild(clonedElement);
  }
};

/**
 * Exports the contents of a canvas element as a data URL
 * @param elementId - The ID of the canvas or SVG element to export
 * @returns A Promise that resolves to the image data URL
 */
export const exportElementAsImage = async (elementId: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    let clonedElement: HTMLElement | null = null;
    
    try {
      const element = document.getElementById(elementId);
      
      if (!element) {
        reject(new Error(`Element with id ${elementId} not found`));
        return;
      }
      
      // Check if there's a Konva stage in this element
      const konvaStage = element.querySelector('.konvajs-content canvas');
      
      if (konvaStage) {
        // If we found a Konva canvas, use Konva's toDataURL method
        try {
          // Find the Konva.Stage instance
          const stageInstance = Konva.stages.find(stage => 
            stage.container().parentElement === element || 
            element.contains(stage.container())
          );
          
          if (stageInstance) {
            // Use Konva's native export method
            const dataURL = stageInstance.toDataURL({
              pixelRatio: 2, // Higher quality export
              mimeType: 'image/png'
            });
            resolve(dataURL);
            return;
          }
        } catch (konvaError) {
          console.warn('Failed to export directly from Konva stage:', konvaError);
          // Fall through to the html2canvas approach
        }
      }

      try {
        // Create a clone with properly converted colors
        clonedElement = prepareElementForCapture(element);
        
        // Use html2canvas on the prepared clone with safe colors
        const canvas = await html2canvas(clonedElement, {
          backgroundColor: '#555', // Default background
          useCORS: true, // Enable CORS for images
          scale: 2, // Higher quality
          logging: false, // Disable logging
          allowTaint: true, // Allow tainted canvas
          foreignObjectRendering: false, // Disable foreignObject to avoid color issues
        });
        
        // Convert to data URL
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } catch (error) {
        console.error('Failed to capture with html2canvas:', error);
        
        // Fall through to the fallback approach
        tryFallbackCapture(element, resolve, reject);
      }
    } catch (error) {
      console.error('Failed to capture element:', error);
      reject(error);
    } finally {
      // Always clean up the cloned element
      cleanupAfterCapture(clonedElement);
    }
  });
};

/**
 * Try fallback capture method when html2canvas fails
 */
const tryFallbackCapture = async (
  element: HTMLElement, 
  resolve: (value: string | PromiseLike<string>) => void,
  reject: (reason?: any) => void
) => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }
    
    // Set dimensions
    canvas.width = element.clientWidth || 600;
    canvas.height = element.clientHeight || 600;
    
    // Draw background
    ctx.fillStyle = '#555';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Try to capture contents
    const konvaCanvas = element.querySelector('.konvajs-content canvas');
    if (konvaCanvas instanceof HTMLCanvasElement) {
      // If we have a Konva canvas, draw it directly
      ctx.drawImage(konvaCanvas, 0, 0, canvas.width, canvas.height);
    } else {
      // Use the actual DOM content
      const svgElements = element.querySelectorAll('svg');
      if (svgElements.length > 0) {
        // If we have SVG elements, try to draw them
        const svgData = new XMLSerializer().serializeToString(svgElements[0]);
        const img = new Image();
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        
        // Wait for image to load
        await new Promise((res) => {
          img.onload = res;
          img.src = url;
        });
        
        // Draw the image with the same transforms
        const svgStyle = window.getComputedStyle(svgElements[0]);
        const transform = svgStyle.transform;
        
        ctx.save();
        // Apply transform if available
        if (transform && transform !== 'none') {
          ctx.translate(canvas.width/2, canvas.height/2);
          // Simple rotation extraction (basic)
          const rotMatch = transform.match(/rotate\(([^)]+)deg\)/);
          if (rotMatch) {
            ctx.rotate(parseFloat(rotMatch[1]) * Math.PI / 180);
          }
          ctx.translate(-canvas.width/2, -canvas.height/2);
        }
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        URL.revokeObjectURL(url);
      } else {
        // Fallback to a colored rectangle
        ctx.fillStyle = '#FACC15';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const dataURL = canvas.toDataURL('image/png');
    resolve(dataURL);
  } catch (fallbackError) {
    console.error('Final fallback failed:', fallbackError);
    reject(fallbackError);
  }
};

/**
 * Saves an image to local storage
 * @param dataUrl - The data URL of the image
 * @param key - The key to save the image under in localStorage
 */
export const saveImageToLocalStorage = (dataUrl: string, key: string): void => {
  try {
    localStorage.setItem(key, dataUrl);
  } catch (error) {
    console.error('Failed to save image to localStorage:', error);
    // If the data URL is too large for localStorage, try to compress it
    const compressedDataUrl = compressDataUrl(dataUrl);
    try {
      localStorage.setItem(key, compressedDataUrl);
    } catch (compressError) {
      console.error('Failed to save compressed image to localStorage:', compressError);
    }
  }
};

/**
 * Loads an image from local storage
 * @param key - The key the image was saved under
 * @returns The data URL of the image, or null if not found
 */
export const loadImageFromLocalStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};

/**
 * Basic compression for data URLs to fit in localStorage
 * @param dataUrl - The data URL to compress
 * @returns A compressed version of the data URL
 */
const compressDataUrl = (dataUrl: string): string => {
  // Simple compression approach: reduce quality
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    return dataUrl;
  }
  
  const image = new Image();
  image.src = dataUrl;
  
  // Reduce dimensions to save space
  const maxDimension = 200; // Small enough for localStorage
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  
  canvas.width = image.width * scale;
  canvas.height = image.height * scale;
  
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
  // Lower quality for smaller size
  return canvas.toDataURL('image/jpeg', 0.7);
};

/**
 * Downloads an image from a data URL
 * @param dataUrl - The data URL of the image
 * @param filename - The filename to save the image as
 */
export const downloadImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};