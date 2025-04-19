import { useState } from "react";
import JoystickController from "./JoystickController";
import ModelGallery from "./ModelGallery";

type CustomizationMenuProps = {
  setPosition: (position: { x: number; y: number }) => void;
  position: {
    x: number;
    y: number;
  };
};

type EditMode = "none" | "position" | "size" | "rotation" | "color";

export default function CustomizationMenu(props: CustomizationMenuProps) {
  const [mode, setMode] = useState<EditMode>("none");

  return (
    <div className="flex-shrink-0">
      <nav>
        <ul className="flex gap-4">
          <li>
            Head
          </li>
          <li>
            Hat
          </li>
          <li>
            Eyes
          </li>
          <li>
            Mouth
          </li>
        </ul>
      </nav>
      <div>
        <ModelGallery />
      </div>
      <div>
        <button onClick={() => setMode("position")}>Position</button>
        <button onClick={() => setMode("size")}>Size</button>
        <button onClick={() => setMode("rotation")}>Rotation</button>
        <button onClick={() => setMode("color")}>Color</button>
      </div>
      {
        mode === "position" && <JoystickController setPosition={props.setPosition} position={props.position} />
      }
      {
        mode === "size" && (
          <div>
            <h2>Size</h2>
            <p>Use the slider to change the size of the emoji.</p>
          </div>
        )
      }
      {
        mode === "rotation" && (
          <div>
            <h2>Rotation</h2>
            <p>Use the slider to change the rotation of the emoji.</p>
          </div>
        )
      }
      {
        mode === "color" && (
          <div>
            <h2>Color</h2>
            <p>Use the color picker to change the color of the emoji.</p>
          </div>
        )
      }
    </div>
  )
}
