import React, { useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string;
  onClose: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`relative inline-block ${isExpanded ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/90' : ''}`}>
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={toggleExpand}
          className="bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
        >
          {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
        <button
          onClick={onClose}
          className="bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      <a 
        href={imageUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block"
        onClick={isExpanded ? (e) => e.preventDefault() : undefined}
      >
        <img
          src={imageUrl}
          alt="Generated Matrix-themed image"
          className={`
            ${isExpanded 
              ? 'max-w-[90vw] max-h-[90vh] w-auto h-auto' 
              : 'w-[200px] h-[200px] object-cover'
            }
            rounded-lg border border-green-500/30 hover:border-green-500/60 transition-colors
          `}
        />
      </a>
    </div>
  );
};