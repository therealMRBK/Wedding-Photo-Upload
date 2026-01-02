
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MediaItem } from '../types';

interface Props {
  items: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}

const Lightbox: React.FC<Props> = ({ items, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const item = items[currentIndex];

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hochzeit_${item.id}.${item.type === 'image' ? 'jpg' : 'mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download fehlgeschlagen:', err);
      const link = document.createElement('a');
      link.href = item.url;
      link.download = `hochzeit_${item.id}`;
      link.target = "_blank";
      link.click();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/98 backdrop-blur-md animate-in fade-in duration-300 overflow-hidden"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Desktop Navigation */}
      <button 
        onClick={handlePrev}
        className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 text-black p-4 hover:bg-black hover:text-white transition-all duration-300 z-[60]"
        aria-label="Vorheriges"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        onClick={handleNext}
        className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 text-black p-4 hover:bg-black hover:text-white transition-all duration-300 z-[60]"
        aria-label="Nächstes"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Schließen Button */}
      <button 
        onClick={onClose}
        className="fixed top-6 right-6 text-black p-2 hover:bg-black hover:text-white transition-all duration-300 z-[60]"
        aria-label="Schließen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Media Content */}
      <div 
        ref={containerRef}
        className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center px-4" 
        onClick={(e) => e.stopPropagation()}
      >
        <div key={item.id} className="w-full h-full flex items-center justify-center animate-in zoom-in-95 fade-in duration-500">
          {item.type === 'image' ? (
            <img 
              src={item.url} 
              alt="Moment" 
              className="max-w-full max-h-full object-contain shadow-2xl select-none"
              draggable={false}
            />
          ) : (
            <video 
              key={item.id}
              src={item.url} 
              className="max-w-full max-h-full object-contain shadow-2xl" 
              controls 
              autoPlay
            />
          )}
        </div>
      </div>

      {/* Info & Footer */}
      <div className="mt-8 text-center space-y-4 max-w-xl w-full px-6 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-1">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] font-light">Geteilt von <span className="font-bold">{item.guestName}</span></p>
          <p className="text-[10px] uppercase tracking-[0.1em] text-gray-300">{currentIndex + 1} von {items.length}</p>
        </div>
        
        <div className="pt-2">
          <button 
            onClick={handleDownload}
            className="inline-flex items-center space-x-3 px-10 py-4 border border-black text-xs uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Herunterladen</span>
          </button>
        </div>

        <p className="md:hidden text-[9px] text-gray-300 uppercase tracking-widest pt-4">
          ← Wischen zum Navigieren →
        </p>
      </div>
    </div>
  );
};

export default Lightbox;
