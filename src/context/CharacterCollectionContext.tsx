import { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import { EmojiType } from './EmojiCustomizationContext';
import { createDefaultCharacters } from '../data/defaults/defaultCharacters';

// Character model
export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  type: EmojiType;
  createdAt: number;
  isImported?: boolean; // Flag for imported images
  isDefault?: boolean; // Flag for default base characters
}

interface CharacterCollectionContextType {
  characters: Character[];
  activeCharacterId: string | null;
  addCharacter: (character: Omit<Character, 'id' | 'createdAt'>) => string;
  importCharacter: (name: string, imageUrl: string) => string;
  updateCharacter: (id: string, updates: Partial<Omit<Character, 'id' | 'createdAt'>>) => void;
  deleteCharacter: (id: string) => void;
  setActiveCharacter: (id: string | null) => void;
  getActiveCharacter: () => Character | null;
  getCharactersByType: (type: EmojiType) => Character[];
}

const LOCAL_STORAGE_KEY = 'emoji-genie-character-collection';
const ACTIVE_CHARACTER_KEY = 'emoji-genie-active-character';

const CharacterCollectionContext = createContext<CharacterCollectionContextType>(null!);

export const useCharacterCollection = () => {
  const context = useContext(CharacterCollectionContext);
  if (!context) {
    throw new Error('useCharacterCollection must be used within a CharacterCollectionProvider');
  }
  return context;
};

interface CharacterCollectionProviderProps {
  children: ReactNode;
}

export const CharacterCollectionProvider: React.FC<CharacterCollectionProviderProps> = ({ children }) => {
  const [userCharacters, setUserCharacters] = useState<Character[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get default characters that will always be present
  const defaultCharacters = useMemo(() => createDefaultCharacters(), []);

  // Combine user's characters with default characters
  const characters = useMemo(() => {
    // Filter out any user characters that have the same name as default characters
    // (prevents duplicate defaults if old data has them)
    const filteredUserChars = userCharacters.filter(
      char => !char.isDefault && !defaultCharacters.some(def => def.name === char.name)
    );
    
    // Combine default characters with user characters
    return [...defaultCharacters, ...filteredUserChars];
  }, [userCharacters, defaultCharacters]);

  // Load saved characters from localStorage on mount
  useEffect(() => {
    try {
      const savedCharacters = localStorage.getItem(LOCAL_STORAGE_KEY);
      
      if (savedCharacters) {
        const parsedData = JSON.parse(savedCharacters);
        // Validate parsed data is an array
        if (Array.isArray(parsedData)) {
          // Filter out any old default characters from stored data
          const nonDefaultCharacters = parsedData.filter(char => !char.isDefault);
          setUserCharacters(nonDefaultCharacters);
          console.log('Loaded user characters from localStorage:', nonDefaultCharacters.length);
        } else {
          console.error('Saved characters is not an array:', parsedData);
        }
      } else {
        console.log('No saved characters found in localStorage');
      }

      const savedActiveId = localStorage.getItem(ACTIVE_CHARACTER_KEY);
      if (savedActiveId) {
        setActiveCharacterId(savedActiveId);
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading characters from localStorage:', error);
      setIsInitialized(true);
    }
  }, []);

  // Save characters to localStorage whenever they change
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      // Only save user characters to localStorage, not default ones
      const userOnlyCharacters = characters.filter(char => !char.isDefault);
      const serializedData = JSON.stringify(userOnlyCharacters);
      localStorage.setItem(LOCAL_STORAGE_KEY, serializedData);
      console.log('Saved user characters to localStorage:', userOnlyCharacters.length);
    } catch (error) {
      console.error('Error saving characters to localStorage:', error);
      
      // If we're getting a quota exceeded error, try to save without the image data
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        try {
          // Create a copy with placeholder images
          const userOnlyCharacters = characters.filter(char => !char.isDefault);
          const minimalCharacters = userOnlyCharacters.map(char => ({
            ...char,
            imageUrl: char.imageUrl.length > 1000 ? `${char.imageUrl.substring(0, 64)}...` : char.imageUrl
          }));
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(minimalCharacters));
          console.warn('Saved characters with truncated images due to storage limits');
        } catch (innerError) {
          console.error('Failed to save even with truncated images:', innerError);
        }
      }
    }
  }, [characters, isInitialized]);

  // Save active character ID to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      if (activeCharacterId) {
        localStorage.setItem(ACTIVE_CHARACTER_KEY, activeCharacterId);
      } else {
        localStorage.removeItem(ACTIVE_CHARACTER_KEY);
      }
    } catch (error) {
      console.error('Error saving active character ID:', error);
    }
  }, [activeCharacterId, isInitialized]);

  // Generate a unique ID for characters
  const generateId = () => {
    return `char_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

  // Add a new character to the collection
  const addCharacter = (characterData: Omit<Character, 'id' | 'createdAt'>) => {
    const newCharacter: Character = {
      ...characterData,
      id: generateId(),
      createdAt: Date.now()
    };

    setUserCharacters(prev => [...prev, newCharacter]);
    return newCharacter.id;
  };

  // Import a character from an external image
  const importCharacter = (name: string, imageUrl: string) => {
    return addCharacter({
      name,
      imageUrl,
      type: 'emoji', // Default to emoji type for imported characters
      isImported: true
    });
  };

  // Update an existing character
  const updateCharacter = (id: string, updates: Partial<Omit<Character, 'id' | 'createdAt'>>) => {
    // Don't allow updating default characters
    if (defaultCharacters.some(char => char.id === id)) {
      console.warn('Cannot update default characters');
      return;
    }

    setUserCharacters(prev => 
      prev.map(char => 
        char.id === id ? { ...char, ...updates } : char
      )
    );
  };

  // Delete a character from the collection
  const deleteCharacter = (id: string) => {
    // Don't allow deleting default characters
    if (defaultCharacters.some(char => char.id === id)) {
      console.warn('Cannot delete default characters');
      return;
    }

    setUserCharacters(prev => prev.filter(char => char.id !== id));
    
    // If the active character was deleted, clear the active ID
    if (activeCharacterId === id) {
      setActiveCharacterId(null);
    }
  };

  // Set the active character
  const setActiveCharacter = (id: string | null) => {
    setActiveCharacterId(id);
  };

  // Get the currently active character
  const getActiveCharacter = () => {
    return characters.find(c => c.id === activeCharacterId) || null;
  };

  // Get characters filtered by type
  const getCharactersByType = (type: EmojiType) => {
    return characters.filter(c => c.type === type);
  };

  const value = {
    characters,
    activeCharacterId,
    addCharacter,
    importCharacter,
    updateCharacter,
    deleteCharacter,
    setActiveCharacter,
    getActiveCharacter,
    getCharactersByType
  };

  return (
    <CharacterCollectionContext.Provider value={value}>
      {children}
    </CharacterCollectionContext.Provider>
  );
};