# Emoji Genie

A fun and interactive web application that allows users to create and customize their own emojis on a canvas. Adjust position, rotation, size, and choose different head shapes to design unique emojis.


![](/public/screenshots/01.png)


## Features

*   **Interactive Canvas:** Uses Konva.js via `react-konva` for a smooth drawing experience.
*   **Customization Controls:**
    *   Move the emoji using a joystick controller (`JoystickController`).
    *   Rotate the emoji using a dedicated joystick (`RotationJoystick`) or slider (`RotationSlider`).
    *   Adjust the size (`SizeControlSimple`).
    *   Select different head shapes (`ModelGallery`).
    *   (Potentially) Pick colors (`ColorPicker`).
*   **Real-time Updates:** Changes are reflected instantly on the canvas.

## Tech Stack

*   **Frontend:** React 19, TypeScript V4
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Canvas:** Konva.js (`konva`, `react-konva`)
*   **Icons:** Lucide React

## Getting Started

### Prerequisites

*   Node.js (version recommended by Vite/React)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd emoji-genie
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

This will start the Vite development server, typically at `http://localhost:5173`. Open this URL in your browser to see the application.

### Building for Production

```bash
npm run build
# or
yarn build
```

This command compiles the TypeScript code and bundles the application for production in the `dist` folder.

## Usage

1.  Launch the application.
2.  Use the controls in the customization menu to modify the emoji on the canvas:
    *   Drag the position joystick to move the emoji.
    *   Use the rotation joystick or slider to rotate it.
    *   Adjust the size controls.
    *   Click on a model in the gallery to change the head shape.

![](/public/screenshots/02.png)
![](/public/screenshots/03.png)
![](/public/screenshots/04.png)

## License

Distributed under the MIT License. See `LICENSE` for more information. (Assuming MIT based on common practice, please update if incorrect).