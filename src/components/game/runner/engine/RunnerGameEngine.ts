import { GameSpeed, ObstacleType, BackgroundElementType } from '../types';

// Game constants
export const BASE_SPEED = 5;
export const GRAVITY = 1.2;
export const JUMP_FORCE = -18;
export const GROUND_HEIGHT = 40;
export const CHARACTER_SIZE = 50;

export class RunnerGameEngine {
  // Game state
  private time: number = 0;
  private lastFrameTime: number = 0;
  private lastScoreTime: number = 0;
  private gameSpeed: number;
  private canvasWidth: number;
  private canvasHeight: number;

  // Character state
  private characterPos: { x: number; y: number };
  private characterVelocity: number = 0;
  private isJumping: boolean = false;
  
  // Game elements
  private obstacles: Array<{
    x: number;
    width: number;
    height: number;
    type: ObstacleType;
  }> = [];
  
  private backgroundElements: Array<{
    x: number;
    y: number;
    type: BackgroundElementType;
    scale: number;
  }> = [];

  // Callbacks
  private onScoreIncrement: () => void;
  private onGameOver: () => void;
  private onUpdateState: (state: {
    characterPos: {x: number, y: number};
    characterVelocity: number;
    isJumping: boolean;
    obstacles: Array<any>;
    backgroundElements: Array<any>;
  }) => void;

  constructor(
    gameSpeed: GameSpeed, 
    canvasWidth: number,
    canvasHeight: number,
    onScoreIncrement: () => void,
    onGameOver: () => void,
    onUpdateState: (state: any) => void
  ) {
    this.gameSpeed = gameSpeed;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.characterPos = { 
      x: canvasWidth * 0.2, 
      y: canvasHeight - GROUND_HEIGHT - CHARACTER_SIZE/2 
    };
    this.onScoreIncrement = onScoreIncrement;
    this.onGameOver = onGameOver;
    this.onUpdateState = onUpdateState;
    
    // Generate initial background elements
    this.backgroundElements = this.generateInitialBackgroundElements();
  }
  
  // Initialize a new game session
  public initGame(gameSpeed: GameSpeed, canvasWidth: number, canvasHeight: number): void {
    this.gameSpeed = gameSpeed;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.time = 0;
    this.lastScoreTime = 0;
    this.lastFrameTime = 0;
    this.characterPos = { 
      x: canvasWidth * 0.2, 
      y: canvasHeight - GROUND_HEIGHT - CHARACTER_SIZE/2 
    };
    this.characterVelocity = 0;
    this.isJumping = false;
    this.obstacles = [];
    this.backgroundElements = this.generateInitialBackgroundElements();
    
    // Update state
    this.notifyStateChange();
  }

  // Main game loop - returns true if game should continue, false if game over
  public update(timestamp: number): boolean {
    // First frame initialization
    if (!this.lastFrameTime) {
      this.lastFrameTime = timestamp;
      return true;
    }
    
    // Calculate delta time for consistent movement regardless of frame rate
    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    this.time += deltaTime;
    
    // Update character position with physics
    this.updateCharacter(deltaTime);
    
    // Update obstacles
    this.updateObstacles(deltaTime);
    
    // Update background elements for parallax effect
    this.updateBackground(deltaTime);
    
    // Check collisions
    if (this.checkCollisions()) {
      this.onGameOver();
      return false;
    }
    
    // Increase score over time
    if (this.time - this.lastScoreTime > 1000) {
      this.onScoreIncrement();
      this.lastScoreTime = this.time;
    }
    
    // Notify state changes
    this.notifyStateChange();
    
    return true;
  }
  
  // Handle player jump action
  public handleJump(): void {
    // Only allow jumping when on or near the ground
    if (this.characterPos.y >= this.canvasHeight - GROUND_HEIGHT - CHARACTER_SIZE/2 - 5) {
      this.characterVelocity = JUMP_FORCE;
      this.isJumping = true;
    }
  }

  // Apply gravity and update character position
  private updateCharacter(deltaTime: number): void {
    // Apply gravity
    const newVelocity = this.characterVelocity + GRAVITY;
    let newY = this.characterPos.y + newVelocity;
    
    // Check ground collision
    const groundY = this.canvasHeight - GROUND_HEIGHT - CHARACTER_SIZE/2;
    if (newY >= groundY) {
      newY = groundY;
      this.characterVelocity = 0;
      this.isJumping = false;
    } else {
      this.characterVelocity = newVelocity;
    }
    
    // Update position
    this.characterPos = {
      x: this.characterPos.x,
      y: newY
    };
  }

  // Update obstacle positions and create new ones
  private updateObstacles(deltaTime: number): void {
    // Calculate obstacle speed based on game speed
    const obstacleSpeed = BASE_SPEED * this.gameSpeed * (deltaTime / 16);
    
    // Update existing obstacles
    let updatedObstacles = this.obstacles.map(obstacle => ({
      ...obstacle,
      x: obstacle.x - obstacleSpeed
    }));
    
    // Remove obstacles that are off-screen
    updatedObstacles = updatedObstacles.filter(
      obstacle => obstacle.x + obstacle.width/2 > 0
    );
    
    // Add new obstacles periodically based on game speed and randomness
    const spacing = this.canvasWidth * (0.6 - (this.gameSpeed - 1) * 0.1);
    if (updatedObstacles.length === 0 || 
       (updatedObstacles[updatedObstacles.length - 1].x < this.canvasWidth - spacing)) {
      // Increase chance of harder obstacles as game progresses
      updatedObstacles.push(this.generateObstacle());
    }
    
    // Update state
    this.obstacles = updatedObstacles;
  }

  // Update background elements for parallax effect
  private updateBackground(deltaTime: number): void {
    // Base speed scaled by game speed
    const baseSpeed = BASE_SPEED * this.gameSpeed * (deltaTime / 16);
    
    // Update each element based on its type (determines parallax layer)
    const updatedBackground = this.backgroundElements.map(el => {
      // Different speeds for different elements
      const speedFactor = el.type === 'cloud' ? 0.2 : 
                         el.type === 'mountain' ? 0.5 : 
                         el.type === 'hill' ? 0.7 : 0.3;
      
      let newX = el.x - baseSpeed * speedFactor;
      
      // Loop elements when they go off screen
      if (newX + (el.type === 'cloud' ? 100 : 200) < 0) {
        newX = this.canvasWidth + Math.random() * 100;
      }
      
      return {
        ...el,
        x: newX
      };
    });
    
    this.backgroundElements = updatedBackground;
  }

  // Check for collisions between character and obstacles
  private checkCollisions(): boolean {
    // Create character hitbox (slightly smaller than character for better gameplay)
    const characterLeft = this.characterPos.x - CHARACTER_SIZE/2;
    const characterRight = this.characterPos.x + CHARACTER_SIZE/2;
    const characterTop = this.characterPos.y - CHARACTER_SIZE/2;
    const characterBottom = this.characterPos.y + CHARACTER_SIZE/2;
    
    const hitboxReduction = CHARACTER_SIZE * 0.2;
    const hitboxLeft = characterLeft + hitboxReduction;
    const hitboxRight = characterRight - hitboxReduction;
    const hitboxTop = characterTop + hitboxReduction;
    const hitboxBottom = characterBottom - hitboxReduction;
    
    // Check collision with each obstacle
    for (const obstacle of this.obstacles) {
      const obstacleLeft = obstacle.x - obstacle.width/2;
      const obstacleRight = obstacle.x + obstacle.width/2;
      const obstacleTop = this.canvasHeight - GROUND_HEIGHT - obstacle.height;
      const obstacleBottom = this.canvasHeight - GROUND_HEIGHT;
      
      // Special collision for pit type obstacles
      if (obstacle.type === 'pit') {
        if (!this.isJumping && 
            hitboxRight > obstacleLeft && 
            hitboxLeft < obstacleRight) {
          return true; // Collision detected
        }
      } 
      // Regular collision for other obstacles
      else if (hitboxRight > obstacleLeft && 
               hitboxLeft < obstacleRight && 
               hitboxBottom > obstacleTop && 
               hitboxTop < obstacleBottom) {
        return true; // Collision detected
      }
    }
    
    return false; // No collision
  }
  
  // Generate a new random obstacle
  private generateObstacle(): any {
    const types: ObstacleType[] = ['cactus', 'rock', 'pit', 'bird'];
    const weightedTypes = [...types]; // Base types
    
    // Add more challenging obstacles as the game progresses
    if (this.time > 20000) { // After 20 seconds
      weightedTypes.push('bird', 'cactus'); // More birds and cacti
    }
    if (this.time > 40000) { // After 40 seconds
      weightedTypes.push('pit', 'pit'); // More pits
    }
    
    const type = weightedTypes[Math.floor(Math.random() * weightedTypes.length)];
    
    // Different dimensions based on obstacle type
    let width: number, height: number, y: number = 0;
    
    switch (type) {
      case 'cactus':
        width = 20 + Math.random() * 20;
        height = 50 + Math.random() * 40;
        break;
      case 'rock':
        width = 40 + Math.random() * 20;
        height = 20 + Math.random() * 30;
        break;
      case 'pit':
        width = 50 + Math.random() * 50;
        height = 20;
        break;
      case 'bird':
        width = 40;
        height = 30;
        // Birds appear at different heights
        y = this.canvasHeight - GROUND_HEIGHT - CHARACTER_SIZE - Math.random() * 50;
        break;
      default:
        width = 30;
        height = 30;
    }
    
    return {
      x: this.canvasWidth + width/2,
      width,
      height,
      type,
      y: y || undefined, // Only used for flying obstacles
    };
  }
  
  // Generate initial background elements for parallax effect
  private generateInitialBackgroundElements(): Array<any> {
    const elements = [];
    
    // Add clouds
    for (let i = 0; i < 4; i++) {
      elements.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * (this.canvasHeight * 0.5),
        type: 'cloud' as BackgroundElementType,
        scale: 0.5 + Math.random() * 0.5,
      });
    }
    
    // Add mountains
    for (let i = 0; i < 3; i++) {
      elements.push({
        x: (i * this.canvasWidth/2) + Math.random() * (this.canvasWidth/4),
        y: this.canvasHeight - GROUND_HEIGHT - 50 - Math.random() * 40,
        type: 'mountain' as BackgroundElementType,
        scale: 0.7 + Math.random() * 0.3,
      });
    }
    
    // Add hills
    for (let i = 0; i < 4; i++) {
      elements.push({
        x: (i * this.canvasWidth/3) + Math.random() * (this.canvasWidth/6),
        y: this.canvasHeight - GROUND_HEIGHT - 20 - Math.random() * 20,
        type: 'hill' as BackgroundElementType,
        scale: 0.6 + Math.random() * 0.4,
      });
    }
    
    return elements;
  }
  
  // Notify state changes to update the UI
  private notifyStateChange(): void {
    this.onUpdateState({
      characterPos: this.characterPos,
      characterVelocity: this.characterVelocity,
      isJumping: this.isJumping,
      obstacles: this.obstacles,
      backgroundElements: this.backgroundElements
    });
  }
  
  // Get current game state (useful for serialization/save functionality)
  public getState() {
    return {
      time: this.time,
      characterPos: this.characterPos,
      characterVelocity: this.characterVelocity,
      obstacles: this.obstacles,
      backgroundElements: this.backgroundElements
    };
  }
}