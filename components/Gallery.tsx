
import React from 'react';
import { MediaItem } from '../types';

interface Props {
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
  onDelete: (id: string) => void;
}

const Gallery: React.FC<Props> = ({ items, onItemClick, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="serif italic">Noch keine Momente in der Galerie...</p>
      </div>
    );
  }

  return (
    <div className="masonry-grid">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="masonry-item group relative bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          {/* Delete Button - High priority z-index and explicit click target */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="absolute top-3 right-3 z-[30] p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 text-gray-400 hover:text-red-600 hover:bg-white transition-all duration-200 active:scale-90"
            aria-label="Löschen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <div onClick={() => onItemClick(item)} className="cursor-pointer">
            {item.type === 'image' ? (
              <img 
                src={item.url} 
                alt="Hochzeitsfoto" 
                className="w-full h-auto block transition-transform duration-500 ease-in-out hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="relative">
                {item.thumbnail ? (
                  <img 
                    src={item.thumbnail} 
                    alt="Video Vorschau" 
                    className="w-full h-auto block transition-transform duration-500 ease-in-out hover:scale-[1.03]"
                  />
                ) : (
                  <video 
                    src={item.url} 
                    className="w-full h-auto block" 
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-transparent transition-colors">
                   <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-black border-b-[10px] border-b-transparent ml-1"></div>
                   </div>
                </div>
              </div>
            )}
            
            <div className="p-4 bg-white border-t border-gray-50">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.25em] text-gray-600">
                <span className="font-bold tracking-[0.3em]">{item.guestName}</span>
                <span className="text-gray-300 font-light">{new Date(item.timestamp).toLocaleDateString('de-DE')}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
