import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Globe, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  accept?: string;
  maxSizeBytes?: number;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label,
  placeholder = "Drop image here or click to upload",
  accept = "image/*",
  maxSizeBytes = 5 * 1024 * 1024, // 5MB default
  className = ""
}) => {
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (file.size > maxSizeBytes) {
      setError(`File size must be less than ${Math.round(maxSizeBytes / 1024 / 1024)}MB`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onChange(result.url || result.path);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const clearImage = () => {
    onChange('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#7A6A5E]">{label}</label>
        <div className="flex bg-[#F5F2EC] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setUploadMode('file')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              uploadMode === 'file'
                ? 'bg-white text-[#8A5A36] shadow-sm'
                : 'text-[#7A6A5E] hover:text-[#8A5A36]'
            }`}
          >
            <Upload className="w-3 h-3 inline mr-1" />
            Upload
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              uploadMode === 'url'
                ? 'bg-white text-[#8A5A36] shadow-sm'
                : 'text-[#7A6A5E] hover:text-[#8A5A36]'
            }`}
          >
            <Globe className="w-3 h-3 inline mr-1" />
            URL
          </button>
        </div>
      </div>

      {uploadMode === 'file' ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-[#8A5A36] bg-[#FAF8F5]'
              : 'border-[#E3DCCE] hover:border-[#D5C2B0]'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {value ? (
            <div className="space-y-2">
              <div className="relative inline-block">
                <img
                  src={value}
                  alt="Uploaded"
                  className="h-16 w-16 object-cover rounded-lg border border-[#E3DCCE]"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-[#7A6A5E]">Click to change image</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-[#F5F2EC] rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-[#8A5A36]" />
              </div>
              <div>
                <p className="text-sm text-[#2D2723] font-medium">{placeholder}</p>
                <p className="text-xs text-[#7A6A5E] mt-0.5">
                  PNG, JPG, WEBP up to {Math.round(maxSizeBytes / 1024 / 1024)}MB
                </p>
              </div>
            </div>
          )}
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            Select File
          </button>
          
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-lg p-3 shadow-lg">
                <div className="w-6 h-6 border-2 border-[#8A5A36] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full border border-[#E3DCCE] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8A5A36]/30"
          />
          {value && (
            <div className="relative inline-block">
              <img
                src={value}
                alt="Preview"
                className="h-12 w-12 object-cover rounded border border-[#E3DCCE]"
                onError={() => setError('Invalid image URL')}
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-2 h-2" />
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-xs">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};