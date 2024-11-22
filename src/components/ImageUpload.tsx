import React from 'react';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageUpload(base64String);
        // Store in localStorage for persistence
        localStorage.setItem('agentSmithAvatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <label className="cursor-pointer bg-green-500/20 hover:bg-green-500/30 text-green-500 px-4 py-2 rounded transition-colors">
        <span>Upload Agent Smith Avatar</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};