// src/components/admin/ImportCSVModal.tsx
import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface ImportCSVModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const ImportCSVModal: React.FC<ImportCSVModalProps> = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState('leads');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert('Please select a file to import');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      alert(`Successfully imported ${importType} from ${file.name}`);
      onSuccess();
      onClose();
    } catch (error) {
      alert('Error importing file. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Upload className="h-6 w-6 mr-3 text-blue-400" />
            Import CSV Data
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Import Type */}
          <div>
            <label className="block text-white font-medium mb-2">Import Type</label>
            <select
              value={importType}
              onChange={(e) => setImportType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            >
              <option value="leads">Leads</option>
              <option value="users">Users</option>
              <option value="territories">Territories</option>
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-white font-medium mb-2">CSV File</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {file ? (
                <div className="flex items-center justify-center">
                  <FileText className="h-8 w-8 text-green-400 mr-3" />
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-white mb-2">Click to select CSV file</p>
                  <p className="text-gray-400 text-sm">or drag and drop your file here</p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">Uploading...</span>
                <span className="text-white">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium mb-2">CSV Format Requirements</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• First row must contain column headers</li>
                  <li>• Use comma-separated values format</li>
                  <li>• Ensure all required fields are included</li>
                  <li>• Maximum file size: 10MB</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!file || isUploading}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {isUploading ? 'Importing...' : 'Import Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
