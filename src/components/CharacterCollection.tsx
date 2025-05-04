import { useState, useRef, ChangeEvent } from 'react';
import { useCharacterCollection, Character } from '../context/CharacterCollectionContext';
import { useEmojiCustomization } from '../context/EmojiCustomizationContext';
import { useGame } from '../context/GameContext';
import { Download, Trash2, Plus, Upload, Edit, Check, Star } from 'lucide-react';
import { downloadImage } from '../utils/exportUtils';

type FilterTab = 'all' | 'emoji' | 'sticker' | 'imported';

export const CharacterCollection = () => {
  const { characters, activeCharacterId, addCharacter, importCharacter, deleteCharacter, setActiveCharacter, updateCharacter } = useCharacterCollection();
  const { emojiType } = useEmojiCustomization();
  const { setCharacterImageUrl } = useGame();
  
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importName, setImportName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter characters based on active tab
  const filteredCharacters = (() => {
    switch (activeTab) {
      case 'all':
        return characters;
      case 'imported':
        return characters.filter(char => char.isImported);
      case 'emoji':
        return characters.filter(char => char.type === 'emoji' && !char.isImported);
      case 'sticker':
        return characters.filter(char => char.type === 'sticker' && !char.isImported);
      default:
        return characters;
    }
  })();

  // Sort characters by creation date (newest first)
  const sortedCharacters = [...filteredCharacters].sort((a, b) => b.createdAt - a.createdAt);

  // Handle selecting a character for the game
  const handleSelectCharacter = (character: Character) => {
    setActiveCharacter(character.id);
    setCharacterImageUrl(character.imageUrl);
  };

  // Start editing a character name
  const handleStartEdit = (character: Character) => {
    setEditingCharacterId(character.id);
    setEditName(character.name);
  };

  // Save character name edit
  const handleSaveEdit = () => {
    if (editingCharacterId && editName.trim()) {
      updateCharacter(editingCharacterId, { name: editName.trim() });
      setEditingCharacterId(null);
      setEditName('');
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCharacterId(null);
    setEditName('');
  };

  // Start import process
  const handleImportClick = () => {
    setIsImporting(true);
    setImportName('');
  };

  // Handle file selection for import
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      if (imageUrl) {
        const id = importCharacter(importName || `Imported ${new Date().toLocaleDateString()}`, imageUrl);
        setActiveCharacter(id);
        setCharacterImageUrl(imageUrl);
        setIsImporting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle downloading a character image
  const handleDownloadCharacter = (character: Character) => {
    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    const characterType = getCharacterTypeLabel(character).toLowerCase();
    const filename = `${characterType}-${character.name}-${date}.png`;
    
    downloadImage(character.imageUrl, filename);
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Get character type label for display
  const getCharacterTypeLabel = (character: Character) => {
    if (character.isImported) {
      return 'Imported';
    }
    return character.type.charAt(0).toUpperCase() + character.type.slice(1);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl overflow-hidden">
      <div className="p-6">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Character Collection</h2>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button
              onClick={handleImportClick}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center gap-2"
            >
              <Upload size={16} /> Import Image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Display import UI when importing */}
        {isImporting && (
          <div className="bg-gray-700 p-4 rounded-lg mb-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Character name"
                value={importName}
                onChange={(e) => setImportName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-600 text-white rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center gap-2"
              >
                <Plus size={16} /> Select Image
              </button>
              <button
                onClick={() => setIsImporting(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="mb-6 bg-gray-700 rounded-md inline-flex p-1 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-1 px-4 rounded ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('emoji')}
            className={`py-1 px-4 rounded ${activeTab === 'emoji' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
          >
            Emoji
          </button>
          <button
            onClick={() => setActiveTab('sticker')}
            className={`py-1 px-4 rounded ${activeTab === 'sticker' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
          >
            Sticker
          </button>
          <button
            onClick={() => setActiveTab('imported')}
            className={`py-1 px-4 rounded ${activeTab === 'imported' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
          >
            Imported
          </button>
        </div>

        {/* Character grid */}
        {sortedCharacters.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sortedCharacters.map((character) => (
              <div 
                key={character.id} 
                className={`bg-gray-700 rounded-lg overflow-hidden border-2 transition-all ${
                  character.id === activeCharacterId 
                    ? 'border-yellow-500 ring-2 ring-yellow-500 transform scale-[1.02] z-10 shadow-lg' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="relative">
                  {/* Character image */}
                  <div 
                    className="h-24 flex items-center justify-center overflow-hidden bg-gray-900 cursor-pointer"
                    onClick={() => handleSelectCharacter(character)}
                  >
                    <img 
                      src={character.imageUrl} 
                      alt={character.name} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {/* Active indicator */}
                  {character.id === activeCharacterId && (
                    <div className="absolute top-1 left-1 bg-yellow-500 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center">
                      <Star size={14} fill="currentColor" />
                    </div>
                  )}
                  
                  {/* Imported badge */}
                  {character.isImported && (
                    <div className="absolute top-1 right-1 bg-purple-500 text-white text-xs py-0.5 px-2 rounded-full">
                      Imported
                    </div>
                  )}
                </div>

                <div className="p-2">
                  {/* Character name - editable or display */}
                  {editingCharacterId === character.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-grow px-2 py-1 bg-gray-600 rounded text-sm border border-gray-500"
                        autoFocus
                      />
                      <button onClick={handleSaveEdit} className="text-green-500">
                        <Check size={16} />
                      </button>
                      <button onClick={handleCancelEdit} className="text-gray-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white">{character.name}</h3>
                        <p className="text-xs text-gray-400">
                          {getCharacterTypeLabel(character)}
                          {' · '}
                          {formatDate(character.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleDownloadCharacter(character)} 
                          className="p-1 text-green-400 hover:text-green-300"
                          title="Download character"
                        >
                          <Download size={14} />
                        </button>
                        <button 
                          onClick={() => handleStartEdit(character)} 
                          className="p-1 text-blue-400 hover:text-blue-300"
                          title="Edit name"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => deleteCharacter(character.id)} 
                          className="p-1 text-red-400 hover:text-red-300"
                          title="Delete character"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-700 p-6 rounded-lg text-center">
            <p className="text-gray-400 mb-2">No characters found{activeTab !== 'all' ? ` for ${activeTab} type` : ''}.</p>
            {activeTab !== 'all' ? (
              <button 
                onClick={() => setActiveTab('all')} 
                className="text-blue-400 hover:text-blue-300"
              >
                View all characters
              </button>
            ) : (
              <p className="text-gray-400">
                Create characters by customizing in the "Customize" tab<br />or import an image using the "Import Image" button.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};