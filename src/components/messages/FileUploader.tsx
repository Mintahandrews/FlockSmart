import { useState } from 'react';
import { Paperclip, Upload, X } from 'lucide-react';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  onCancel: () => void;
  selectedFile: File | null;
}

const FileUploader = ({ onFileSelected, onCancel, selectedFile }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // If a file is selected, show its preview
  if (selectedFile) {
    return (
      <div className="mt-2 p-3 border border-indigo-200 bg-indigo-50 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Paperclip size={16} className="text-indigo-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-700 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <button 
            onClick={onCancel} 
            className="text-gray-400 hover:text-gray-600"
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }
  
  // Otherwise, show the upload area
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mt-2 p-4 border-2 border-dashed rounded-md text-center cursor-pointer transition-colors ${
        isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300'
      }`}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        onChange={handleFileInput}
        className="hidden"
      />
      <Upload size={24} className={`mx-auto mb-2 ${isDragging ? 'text-indigo-500' : 'text-gray-400'}`} />
      <p className="text-sm text-gray-500">
        {isDragging ? 'Drop file here' : 'Click or drag file to upload'}
      </p>
    </div>
  );
};

export default FileUploader;
