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
      <div className="bg-white rounded-lg border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Upload className="h-6 w-6 mr-2 text-blue-600" />
            Import CSV Data
          </h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Import Type */}
          <div>
            <label className="block text-gray-900 font-medium mb-2">Import Type</label>
            <select
              value={importType}
              onChange={(e) => setImportType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900"
            >
              <option value="leads">Leads</option>
              <option value="users">Users</option>
              <option value="territories">Territories</option>
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-900 font-medium mb-2">CSV File</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
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
                  <FileText className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-gray-900 font-medium">{file.name}</p>
                    <p className="text-gray-600 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 mb-2">Click to select CSV file</p>
                  <p className="text-gray-600 text-sm">or drag and drop your file here</p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-900">Uploading...</span>
                <span className="text-blue-900">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Format Information */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-gray-900 font-medium mb-2">CSV Format Requirements</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• First row must contain column headers</li>
                  <li>• Use comma-separated values format</li>
                  <li>• Ensure all required fields are included</li>
                  <li>• Maximum file size: 10MB</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-colors border border-gray-300"
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
