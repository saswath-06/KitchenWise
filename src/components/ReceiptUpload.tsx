'use client';
import React, { useState } from 'react';
import { Receipt } from '../types';
import apiService from '../services/api';
import Button from './ui/Button';
import Card from './ui/Card';

const ReceiptUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Please select an image file');
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await apiService.uploadReceipt(selectedFile);
      console.log('Receipt processed:', response);
      setSuccess(true);
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('receipt-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload receipt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Receipt</h2>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input
            id="receipt-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label
            htmlFor="receipt-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="mt-2 text-gray-600">
              {selectedFile ? selectedFile.name : 'Click to select a receipt image'}
            </span>
          </label>
        </div>

        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-600 bg-green-50 p-3 rounded-lg">
            Receipt processed successfully!
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          isLoading={isLoading}
          className="w-full"
        >
          Upload Receipt
        </Button>
      </div>
    </Card>
  );
};

export default ReceiptUpload;