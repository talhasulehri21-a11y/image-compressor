import React, { useState, useCallback, useRef } from 'react';

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function ImageCompressor() {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
    const [compressedImageUrl, setCompressedImageUrl] = useState<string>('');
    const [quality, setQuality] = useState(75);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            return;
        }
        setError('');
        setOriginalImage(file);
        setOriginalSize(file.size);
        setOriginalImageUrl(URL.createObjectURL(file));
        setCompressedImageUrl('');
        setCompressedSize(0);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImageChange(e.target.files[0]);
        }
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageChange(e.dataTransfer.files[0]);
        }
    };

    const handleCompress = useCallback(() => {
        if (!originalImage) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (blob) {
                        setCompressedImageUrl(URL.createObjectURL(blob));
                        setCompressedSize(blob.size);
                    }
                }, 'image/jpeg', quality / 100);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(originalImage);
    }, [originalImage, quality]);
    
    const handleDownload = () => {
        if (!compressedImageUrl) return;
        const a = document.createElement('a');
        a.href = compressedImageUrl;
        a.download = `compressed-${originalImage?.name.replace(/\.[^/.]+$/, "")}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleReset = () => {
        setOriginalImage(null);
        setOriginalImageUrl('');
        setCompressedImageUrl('');
        setQuality(75);
        setOriginalSize(0);
        setCompressedSize(0);
        setError('');
        if(fileInputRef.current) fileInputRef.current.value = '';
    }

    return (
        <>
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Image Compressor</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Reduce image file sizes without compromising quality.</p>
            </header>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
                {/* Input column */}
                <div className="flex flex-col h-full">
                    {!originalImage ? (
                        <div 
                            className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                            <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4H7z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v4m0 0l-2-2m2 2l2-2"></path></svg>
                            <p className="text-slate-500 dark:text-slate-400">Drag & Drop Image Here</p>
                            <p className="text-sm text-slate-400 dark:text-slate-500">or Click to Browse</p>
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="relative mb-4 flex-1 flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-lg p-2">
                               <img src={originalImageUrl} alt="Original" className="max-w-full max-h-full object-contain rounded-md" />
                            </div>
                            <div className="text-sm text-center mb-4">Original Size: <strong>{formatBytes(originalSize)}</strong></div>

                            <div className="mb-4">
                                <label htmlFor="quality" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quality: {quality}</label>
                                <input type="range" id="quality" min="1" max="100" value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                            </div>
                             <button onClick={handleCompress} className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                Compress
                            </button>
                        </div>
                    )}
                </div>

                {/* Output column */}
                 <div className="flex flex-col bg-slate-50 dark:bg-slate-900/70 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
                        Result
                    </h2>
                    <div className="flex-1 flex flex-col items-center justify-center p-4">
                       {compressedImageUrl ? (
                           <>
                                <div className="relative mb-4 flex-1 flex items-center justify-center w-full">
                                    <img src={compressedImageUrl} alt="Compressed" className="max-w-full max-h-full object-contain rounded-md" />
                                </div>
                                <div className="text-center mb-4">
                                    <p>Compressed Size: <strong className="text-green-500">{formatBytes(compressedSize)}</strong></p>
                                    <p>Reduction: <strong className="text-green-500">{(((originalSize - compressedSize) / originalSize) * 100).toFixed(2)}%</strong></p>
                                </div>
                                <div className="w-full flex gap-4">
                                    <button onClick={handleDownload} className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                        Download
                                    </button>
                                    <button onClick={handleReset} className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                        Reset
                                    </button>
                                </div>
                           </>
                       ) : (
                           <p className="text-slate-500 dark:text-slate-400 text-center">Your compressed image will appear here.</p>
                       )}
                    </div>
                </div>
            </div>
        </>
    );
}
