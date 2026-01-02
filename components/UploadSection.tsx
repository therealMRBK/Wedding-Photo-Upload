
import React, { useRef, useState } from 'react';
import { MediaItem } from '../types';

interface Props {
  onUpload: (item: MediaItem) => void;
  isUploading: boolean;
  setIsUploading: (val: boolean) => void;
}

const UploadSection: React.FC<Props> = ({ onUpload, isUploading, setIsUploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [guestName, setGuestName] = useState('');

  const generateThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      video.src = URL.createObjectURL(file);
      
      video.onloadeddata = () => {
        video.currentTime = Math.min(video.duration, 1);
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          URL.revokeObjectURL(video.src);
          resolve(dataUrl);
        } else {
          reject('Could not get canvas context');
        }
      };

      video.onerror = () => reject('Video error');
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!guestName.trim()) {
      alert('Bitte gib zuerst deinen Namen ein.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    const file = files[0];
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      alert('Bitte nur Fotos oder Videos hochladen.');
      setIsUploading(false);
      return;
    }

    try {
      let thumbnail: string | undefined;
      if (isVideo) {
        try {
          thumbnail = await generateThumbnail(file);
        } catch (err) {
          console.warn('Could not generate thumbnail:', err);
        }
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;

        const newItem: MediaItem = {
          id: Math.random().toString(36).substr(2, 9),
          url: result,
          thumbnail: thumbnail,
          type: isImage ? 'image' : 'video',
          caption: '', // Text generation removed per request
          guestName: guestName.trim(),
          timestamp: Date.now()
        };

        onUpload(newItem);
        setIsUploading(false);
        setGuestName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-8 rounded-sm border border-gray-100 max-w-2xl mx-auto shadow-sm">
      <h3 className="text-xl mb-6 text-center font-light uppercase tracking-widest">Moment teilen</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Dein Name</label>
          <input 
            type="text" 
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Wer lädt hoch?"
            className="w-full border-b border-gray-300 bg-transparent py-2 px-1 focus:border-black outline-none transition-colors text-sm"
          />
        </div>

        <div className="pt-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`w-full py-4 px-6 border border-black uppercase tracking-[0.2em] text-sm hover:bg-black hover:text-white transition-all duration-300 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? 'Verarbeitung...' : 'Foto oder Video wählen'}
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
