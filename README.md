# Emoji Genie

Emoji Genie is a fun app that lets you create customized emoji and sticker characters, then use them in a game! Design your perfect character and put it to the test in an addictive gameplay experience!  

![](/public/screenshots/01.jpeg)

## ✨ Features  
  
### Character Customization  
- **Two Character Types**: Choose between Emoji or Sticker character styles  
- **Extensive Customization Options**:  
  - Select different parts (head, eyes, mouth, etc.)  
  - Adjust position, rotation, and size  
  - Change colors for most elements  
  - Mix and match from a gallery of models  
- **Real-time Preview**: See your changes instantly on the canvas  
  
### Retro Game  
- **Play with Your Creation**: Export your custom character to use in the game  
- **Multiple Difficulty Levels**: Choose between Easy, Normal, and Hard speeds  
- **Score Tracking**: Keep track of your high scores  
- **Simple Controls**
## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript 5.7.2  
- **Build Tool**: Vite 6.3.1  
- **Styling**: Tailwind CSS 4.1.4  
- **Canvas Rendering**: Konva.js (konva 9.3.20, react-konva 19.0.3)  
- **State Management**: React Context API  
- **Icons**: Lucide React 

## 🛠️ Getting Started 

### Prerequisites

- Node.js (latest LTS version recommended)  
- npm or yarn  

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/adelansari/emoji-genie.git
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

## 🎮 How to Use

1. Start in the "Customize" tab (default)
2. Toggle between Emoji and Sticker modes
3. Select different parts to customize (head, eyes, mouth, etc.)
4. Use the controls to:
   * Move parts with the position joystick
   * Rotate elements with the rotation joystick
   * Adjust size with the size slider
   * Change colors with the color picker
5. Export your character to use in the game

## 📸 Screenshots
![](/public/screenshots/02.jpeg)
![](/public/screenshots/03.jpeg)
![](/public/screenshots/04.jpeg)
![](/public/screenshots/05.jpeg)

## 🧩 Application Architecture

### High-Level Architecture

The Emoji Genie application follows a component-based architecture built with React and TypeScript. The application is structured around two main features:

1. **Character Customization System**: Allows users to create and customize emoji/sticker characters
2. **Game Component**: A Flappy Bird-style game that uses the customized character

![](/public/screenshots/architectureEmojiGenie.png)


### Data Flow

The application follows a unidirectional data flow pattern:

```
┌─────────────────────────────────────────────────────┐
│               EmojiCustomizationContext             │
│                                                     │
│  ┌─────────┐    ┌──────────────┐    ┌────────────┐  │
│  │ State   │───▶│ Context API  │───▶│ Components │  │
│  └─────────┘    └──────────────┘    └────────────┘  │
│       ▲                                    │        │
│       └────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘
```

1. User interactions trigger state changes in the Context
2. State changes flow down to components through the Context
3. Components render based on the current state
4. Character customizations are persisted and can be exported to the game

### System Architecture Overview

```
┌───────────────────────────────────────────────────┐
│                   Components                      │
├───────────┬───────────────┬──────────┬───────────┤
│   Shared  │     Emoji     │  Sticker │   Game    │
│Components │  Components   │Components│Components │
└─────┬─────┴───────┬───────┴────┬─────┴─────┬─────┘
      │             │            │           │
      v             v            v           v
┌─────────────────────────────────────────────────┐
│                    Context                      │
│         (EmojiCustomizationContext)             │
└────────────────────┬────────────────────────────┘
                    │
                    v
┌─────────────────────────────────────────────────┐
│                 Data Models                     │
├────────────────────┬────────────────────────────┤
│    Emoji Models    │      Sticker Models       │
└────────────────────┴────────────────────────────┘
```

### Key Component Structure

1. **Shared Components**:
   - `src/components/shared/CustomizationMenuBase.tsx`: Base for all customization menus
   - `src/components/shared/ModelGalleryBase.tsx`: Displays model options for selection
   - `src/components/shared/KonvaSvgRenderer.tsx`: Renders SVG components on Konva canvas

2. **Model System**:
   - Models defined in `src/data/emoji/emojiModels.ts` and `src/data/sticker/stickerModels.ts`
   - Each model represents a customizable part with an SVG component

3. **Game Component**:
   - `src/components/game/FlappyGame.tsx`: Implements game mechanics
   - Uses Konva.js for rendering game elements and character

### State Management Architecture

The application uses React Context API for state management:

```
┌─────────────────────────────────────────────────┐
│          EmojiCustomizationContext              │
├─────────────────────────────────────────────────┤
│ - Selected emoji/sticker parts                  │
│ - Current customization mode                    │
│ - Multi-select mode status                      │
│ - Position, rotation, and size settings         │
│ - Color selections                              │
└─────────────────┬───────────────────────────────┘
                  │
                  v
┌─────────────────────────────────────────────────┐
│               useEmojiCustomization Hook        │
└─────────────────────────────────────────────────┘
```

State management features:
- Centralized state for both emoji and sticker customization
- Persistence of customizations in local storage
- Export of customized characters as images for use in the game
- Stateful UI components that react to state changes

### Asset Management

SVG assets are organized by component type and loaded dynamically:
- Emoji assets: `src/assets/head`, etc.
- Sticker assets: `src/assets/stickerCharacter/face/shape`, etc.

The application uses Vite's `import.meta.glob` for efficient dynamic loading of SVG components, which are then rendered through the Konva canvas system.

## License

Distributed under the MIT License. See `LICENSE` for more information. (Assuming MIT based on common practice, please update if incorrect).