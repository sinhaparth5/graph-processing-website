import React, { useState } from "react";
import { Upload } from "lucide-react";

const GraphUploadForm = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
            setIsUploading(true);
            setError(null);

            const formData = new FormData();
            formData.append('file', file);

            // CSRF Token
            // @ts-ignore
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            const response = await fetch('/graphs/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Upload failed');
            const result = await response.json();
            window.location.href = `/graphs/${result.id}`;
        } catch (err) {
            setError('Failed to upload file. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };
    return (
        <div className="max-w-xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-4">Upload Graph Data</h1>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <label className="block mt-4">
                        <span className="text-gray-700">Upload a JSON or CSV file containing graph data.</span>
                        <input
                            type="file"
                            className="mt-1 block w-full"
                            accept=".json,.csv"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">Supported formats: JSON, CSV</p>
                </div>
                {isUploading && <div className="mt-4 text-center text-gray-600">Uploading and processing file...</div>}
                {error && <div className="mt-4 text-center text-red-600">{error}</div>}
            </div>
        </div>
    )
}

export default GraphUploadForm;