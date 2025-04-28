import html2canvas from 'html2canvas-pro';
import Konva from 'konva';

const HIDE_ATTR = 'data-export';
const HIDE_CLASS = 'export-ignore';

function hideOptOut(root: HTMLElement): () => void {
  const hidden: HTMLElement[] = [];
  root.querySelectorAll<HTMLElement>(`[${HIDE_ATTR}="false"], .${HIDE_CLASS}`)
    .forEach(el => {
      if (getComputedStyle(el).visibility !== 'hidden') {
        hidden.push(el);
        el.style.visibility = 'hidden';
      }
    });
  return () => hidden.forEach(el => el.style.visibility = '');
}

function findStage(root: HTMLElement): Konva.Stage | undefined {
  return Konva.stages.find(stage => root.contains(stage.container()));
}

/**
 * Export inline SVG elements by wrapping them in a single <svg> and rasterizing.
 */
async function exportSvgContainer(root: HTMLElement, pixelRatio: number): Promise<string> {
  const rootRect = root.getBoundingClientRect();
  const width = rootRect.width;
  const height = rootRect.height;

  const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  wrapper.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  wrapper.setAttribute('width', width.toString());
  wrapper.setAttribute('height', height.toString());

  const svgs = Array.from(root.querySelectorAll<SVGSVGElement>('svg'));
  if (!svgs.length) throw new Error('No SVG elements to export');

  svgs.forEach(svg => {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    const svgRect = svg.getBoundingClientRect();
    const x = svgRect.left - rootRect.left;
    const y = svgRect.top - rootRect.top;
    clone.setAttribute('x', x.toString());
    clone.setAttribute('y', y.toString());
    clone.setAttribute('width', svgRect.width.toString());
    clone.setAttribute('height', svgRect.height.toString());
    const style = getComputedStyle(svg);
    if (style.transform && style.transform !== 'none') {
      clone.setAttribute('transform', style.transform);
    }
    wrapper.appendChild(clone);
  });

  const xml = new XMLSerializer().serializeToString(wrapper);
  const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const image = new Image();
    image.onload = () => res(image);
    image.onerror = rej;
    image.src = url;
  });
  URL.revokeObjectURL(url);

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  const ctx = canvas.getContext('2d')!;
  ctx.scale(pixelRatio, pixelRatio);
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/png');
}

export async function exportElementAsImage(
  elementId: string,
  pixelRatio = 3
): Promise<string> {
  const root = document.getElementById(elementId);
  if (!root) throw new Error(`Element "${elementId}" not found`);

  const restore = hideOptOut(root);
  try {
    const stage = findStage(root);
    if (stage) {
      const size = stage.size();
      if (size.width <= 0 || size.height <= 0) {
        const rect = stage.container().getBoundingClientRect();
        stage.size({ width: rect.width || 1, height: rect.height || 1 });
      }
      return stage.toDataURL({ pixelRatio, mimeType: 'image/png' });
    }

    // fallback for inline SVGs
    if (root.querySelector('svg')) {
      return await exportSvgContainer(root, pixelRatio);
    }

    // final fallback to html2canvas for any other content
    const canvas = await html2canvas(root, {
      scale: pixelRatio,
      backgroundColor: null,
      useCORS: true,
      logging: false,
    });
    return canvas.toDataURL('image/png');
  } finally {
    restore();
  }
}

export function downloadImage(dataUrl: string, filename = 'export.png'): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function saveImageToLocalStorage(dataUrl: string, key: string): void {
  try {
    localStorage.setItem(key, dataUrl);
  } catch {
    console.warn('localStorage quota exceeded');
  }
}

export function loadImageFromLocalStorage(key: string): string | null {
  return localStorage.getItem(key);
}