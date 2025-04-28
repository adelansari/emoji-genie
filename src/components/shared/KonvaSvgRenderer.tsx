import { useState, useEffect } from 'react';
import { Image } from 'react-konva';
import ReactDOMServer from 'react-dom/server';

interface KonvaSvgRendererProps {
  svgComponent: React.FC<any>;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  fill?: string;
  zIndex?: number;
}

/**
 * Renders SVG components in Konva by converting them to Image objects
 */
const KonvaSvgRenderer: React.FC<KonvaSvgRendererProps> = ({
  svgComponent: SvgComponent,
  x,
  y,
  rotation,
  scaleX,
  scaleY,
  fill,
  zIndex = 1
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  
  useEffect(() => {
    // Create an in-memory SVG and convert it to an image
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");
    
    const svgString = ReactDOMServer.renderToString(<SvgComponent fill={fill} />);
    svg.innerHTML = svgString;
    
    // Convert SVG to image
    const xml = new XMLSerializer().serializeToString(svg);
    const dataUrl = `data:image/svg+xml;base64,${btoa(xml)}`;
    
    const img = new window.Image();
    img.onload = () => {
      setImage(img);
    };
    img.src = dataUrl;
  }, [SvgComponent, fill]);
  
  return image ? (
    <Image
      image={image}
      x={x}
      y={y}
      offsetX={50} // Half of the original SVG size (100px)
      offsetY={50} // Half of the original SVG size (100px)
      rotation={rotation}
      scaleX={scaleX}
      scaleY={scaleY}
    />
  ) : null;
};

export default KonvaSvgRenderer;