// src/components/admin/ExportReportsModal.tsx
import React, { useState } from 'react';
import { X, Download, FileText, Calendar, Users, TrendingUp } from 'lucide-react';

interface ExportReportsModalProps {
  onClose: () => void;
}

export const ExportReportsModal: React.FC<ExportReportsModalProps> = ({ onClose }) => {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('last30');
  const [format, setFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);

  const reportTypes = [
    { id: 'users', label: 'User Report', icon: Users, description: 'All user data and activity' },
    { id: 'leads', label: 'Leads Report', icon: TrendingUp, description: 'Lead pipeline and conversion data' },
    { id: 'territories', label: 'Territory Report', icon: FileText, description: 'Territory assignments and performance' },
    { id: 'activities', label: 'Activity Report', icon: Calendar, description: 'All meetings and activities' }
  ];

  const handleExport = async () => {
    if (selectedReports.length === 0) {
      alert('Please select at least one report to export');
      return;
    }

    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real implementation, this would generate and download the reports
    alert(`Exported ${selectedReports.length} report(s) successfully!`);
    
    setIsExporting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Download className="h-6 w-6 mr-3 text-green-400" />
            Export Reports
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Selection */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Select Reports</h3>
            <div className="space-y-3">
              {reportTypes.map((report) => (
                <label key={report.id} className="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReports(prev => [...prev, report.id]);
                      } else {
                        setSelectedReports(prev => prev.filter(id => id !== report.id));
                      }
                    }}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 mr-3"
                  />
                  <report.icon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-white font-medium">{report.label}</p>
                    <p className="text-gray-400 text-sm">{report.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="last7">Last 7 days</option>
                <option value="last30">Last 30 days</option>
                <option value="last90">Last 90 days</option>
                <option value="thisYear">This year</option>
                <option value="allTime">All time</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel</option>
                <option value="pdf">PDF</option>
              </select>
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
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white transition-colors disabled:opacity-50"
            >
              {isExporting ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isExporting ? 'Exporting...' : 'Export Reports'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
