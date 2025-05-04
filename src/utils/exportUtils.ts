import Konva from 'konva';

/**
 * Export a Konva stage as an image, tightly cropped to non‑transparent pixels.
 * @param elementId ID of the container div holding the Konva stage
 * @param pixelRatio multiplier for higher resolution
 */
export async function exportElementAsImage(
  elementId: string,
  pixelRatio = 4
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const root = document.getElementById(elementId);
      if (!root) throw new Error(`Element "${elementId}" not found`);

      // find stage
      const stage = Konva.stages.find(s => root.contains(s.container()));
      if (!stage) throw new Error(`Konva Stage not found in "${elementId}"`);

      // hide background layer
      const layers = stage.getLayers();
      if (layers.length < 2) throw new Error('Need at least 2 layers');
      const bg = layers[0], contentLayer = layers[1];
      const bgWasVisible = bg.isVisible();
      bg.hide();

      // draw entire stage to offscreen canvas
      const fullCanvas: HTMLCanvasElement = stage.toCanvas({ pixelRatio });
      const w = fullCanvas.width, h = fullCanvas.height;
      const ctx = fullCanvas.getContext('2d')!;
      const imgData = ctx.getImageData(0, 0, w, h).data;

      // find trim bounds
      let minX = w, minY = h, maxX = 0, maxY = 0;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const alpha = imgData[(y * w + x) * 4 + 3];
          if (alpha > 0) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      // if no content, just export full
      if (maxX < minX || maxY < minY) {
        const fallback = fullCanvas.toDataURL('image/png');
        if (bgWasVisible) bg.show();
        return resolve(fallback);
      }

      // crop to bounds
      const cropW = maxX - minX + 1;
      const cropH = maxY - minY + 1;
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = cropW;
      cropCanvas.height = cropH;
      const cropCtx = cropCanvas.getContext('2d')!;
      cropCtx.drawImage(fullCanvas,
        minX, minY, cropW, cropH,
        0, 0, cropW, cropH
      );
      const trimmed = cropCanvas.toDataURL('image/png');

      // restore background
      if (bgWasVisible) bg.show();
      resolve(trimmed);

    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

/**
 * Convert an SVG data URL to a PNG data URL
 * This helps prevent corruption with SVG content containing special characters
 * @param svgDataUrl The SVG data URL to convert
 * @param width Optional width for the output image
 * @param height Optional height for the output image
 */
export function convertSvgToPng(svgDataUrl: string, width = 200, height = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw with white background to preserve transparency
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, width, height);
        
        // Center the image
        const scale = Math.min(width / img.width, height / img.height);
        const x = (width - img.width * scale) / 2;
        const y = (height - img.height * scale) / 2;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        resolve(canvas.toDataURL('image/png'));
      };
      
      img.onerror = (err) => {
        console.error('Error loading SVG:', err);
        reject(err);
      };
      
      img.src = svgDataUrl;
    } catch (err) {
      console.error('Error converting SVG to PNG:', err);
      reject(err);
    }
  });
}

/**
 * Save an image data URL to local storage
 */
export function saveImageToLocalStorage(dataUrl: string, key: string): void {
  try {
    localStorage.setItem(key, dataUrl);
  } catch (error) {
    console.error('Error saving image to localStorage:', error);
    throw error;
  }
}

/**
 * Download an image from a data URL
 */
export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Load an image from local storage
 */
export function loadImageFromLocalStorage(key: string): string | null {
  return localStorage.getItem(key);
}