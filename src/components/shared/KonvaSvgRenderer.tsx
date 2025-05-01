import { useState, useEffect, useRef } from 'react';
import { Image } from 'react-konva';
import ReactDOMServer from 'react-dom/server';
import { canvasConfig } from '../../utils/canvasConfig';

interface KonvaSvgRendererProps {
  svgComponent: React.FC<any>;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  fill?: string;
  zIndex?: number;
  canvasSize: number; // Now required to properly calculate adaptive sizing
}

/**
 * Renders SVG components in Konva by converting them to Image objects
 * Automatically handles proper positioning and centering with adaptive sizing
 */
const KonvaSvgRenderer: React.FC<KonvaSvgRendererProps> = ({
  svgComponent: SvgComponent,
  x,
  y,
  rotation,
  scaleX,
  scaleY,
  fill,
  zIndex = 1,
  canvasSize
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  
  // Use the base SVG size from the centralized config
  const originalSize = canvasConfig.baseSvgSize;
  const halfOriginalSize = originalSize / 2;
  
  // Create a ref to store the image dimensions after loading
  const imageDimensionsRef = useRef({ width: originalSize, height: originalSize });
  
  useEffect(() => {
    // Create an in-memory SVG and convert it to an image
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", originalSize.toString());
    svg.setAttribute("height", originalSize.toString());
    svg.setAttribute("viewBox", `0 0 ${originalSize} ${originalSize}`);
    
    // Only pass fill if it's not the default white color
    const svgProps = fill && fill !== canvasConfig.defaultColor ? { fill } : {};
    const svgString = ReactDOMServer.renderToString(<SvgComponent {...svgProps} />);
    svg.innerHTML = svgString;
    
    // Convert SVG to image
    const xml = new XMLSerializer().serializeToString(svg);
    const dataUrl = `data:image/svg+xml;base64,${btoa(xml)}`;
    
    const img = new window.Image();
    img.onload = () => {
      // Store actual dimensions
      imageDimensionsRef.current = {
        width: img.naturalWidth || originalSize,
        height: img.naturalHeight || originalSize
      };
      setImage(img);
    };
    img.onerror = (err) => {
      console.error("Failed to load SVG image:", err);
    };
    img.src = dataUrl;
  }, [SvgComponent, fill, originalSize]);
  
  return image ? (
    <Image
      image={image}
      x={x}
      y={y}
      offsetX={halfOriginalSize} // Center horizontally
      offsetY={halfOriginalSize} // Center vertically
      rotation={rotation}
      scaleX={scaleX}
      scaleY={scaleY}
    />
  ) : null;
};

export default KonvaSvgRenderer;