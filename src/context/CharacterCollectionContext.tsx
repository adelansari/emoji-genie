import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { EmojiType } from './EmojiCustomizationContext';

// Character model
export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  type: EmojiType;
  createdAt: number;
  isImported?: boolean; // Flag for imported images
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
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);

  // Load saved characters from localStorage on mount
  useEffect(() => {
    try {
      const savedCharacters = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedCharacters) {
        setCharacters(JSON.parse(savedCharacters));
      }

      const savedActiveId = localStorage.getItem(ACTIVE_CHARACTER_KEY);
      if (savedActiveId) {
        setActiveCharacterId(savedActiveId);
      }
    } catch (error) {
      console.error('Error loading characters from localStorage:', error);
    }
  }, []);

  // Save characters to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(characters));
    } catch (error) {
      console.error('Error saving characters to localStorage:', error);
    }
  }, [characters]);

  // Save active character ID to localStorage
  useEffect(() => {
    if (activeCharacterId) {
      localStorage.setItem(ACTIVE_CHARACTER_KEY, activeCharacterId);
    } else {
      localStorage.removeItem(ACTIVE_CHARACTER_KEY);
    }
  }, [activeCharacterId]);

  // Generate a unique ID for characters
  const generateId = () => {
    return `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Add a new character to the collection
  const addCharacter = (characterData: Omit<Character, 'id' | 'createdAt'>) => {
    const newCharacter: Character = {
      ...characterData,
      id: generateId(),
      createdAt: Date.now()
    };

    setCharacters(prev => [...prev, newCharacter]);
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
    setCharacters(prev => 
      prev.map(char => 
        char.id === id ? { ...char, ...updates } : char
      )
    );
  };

  // Delete a character from the collection
  const deleteCharacter = (id: string) => {
    setCharacters(prev => prev.filter(char => char.id !== id));
    
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