import { useState } from 'react';
import { fetchAPI } from '../utils/api';

export default function UploadReceipt() {
  const [file, setFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const response = await fetchAPI('/receipts/upload', {
        method: 'POST',
        body: formData,
      });
      alert('Receipt uploaded successfully!');
      console.log(response);
    } catch (err) {
      console.error(err);
      alert('Failed to upload receipt.');
    }
  }

  return (
    <div>
      <h1>Upload Receipt</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
