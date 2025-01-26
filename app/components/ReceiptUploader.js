import React, { useState } from 'react';

const ReceiptUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) onUpload(file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="receipt">Upload Receipt:</label>
      <input
        type="file"
        id="receipt"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit">Upload</button>
    </form>
  );
};

export default ReceiptUploader;
