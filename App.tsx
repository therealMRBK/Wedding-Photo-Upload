
import React, { useState, useEffect, useCallback } from 'react';
import { MediaItem } from './types';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';

const STORAGE_KEY = 'schupka_wedding_gallery_v1';

const App: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Load from simulated server storage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setMediaItems(parsed);
      } catch (e) {
        console.error("Fehler beim Laden der Galerie", e);
      }
    } else {
      // Demo image for first-time visitors
      const mockData: MediaItem[] = [
        {
          id: 'welcome-1',
          url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
          type: 'image',
          caption: '',
          guestName: 'Hochzeits-Team',
          timestamp: Date.now()
        }
      ];
      setMediaItems(mockData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    }
  }, []);

  const handleUpload = useCallback((newItem: MediaItem) => {
    setMediaItems(prev => {
      const updated = [newItem, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    // Explicitly handle the prompt
    const password = window.prompt("Admin-Passwort zum Löschen erforderlich (6666):");
    
    if (password === '6666') {
      setMediaItems(prev => {
        const filtered = prev.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return filtered;
      });
      // Close lightbox if the deleted item was open
      setSelectedIndex(null);
    } else if (password !== null) {
      alert("Falsches Passwort.");
    }
  }, []);

  const handleItemClick = (item: MediaItem) => {
    const index = mediaItems.findIndex(i => i.id === item.id);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
        <section className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-light tracking-widest uppercase mb-2">Unsere Momente</h2>
          <p className="text-gray-500 italic max-w-lg mx-auto serif">
            Teilt eure schönsten Fotos und Videos von unserem Tag mit uns.
          </p>
        </section>

        <UploadSection 
          onUpload={handleUpload} 
          setIsUploading={setIsUploading} 
          isUploading={isUploading} 
        />

        <div className="mt-20">
          <Gallery 
            items={mediaItems} 
            onItemClick={handleItemClick} 
            onDelete={handleDelete}
          />
        </div>
      </main>

      {selectedIndex !== null && (
        <Lightbox 
          items={mediaItems}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)} 
        />
      )}

      <Footer />
    </div>
  );
};

export default App;
