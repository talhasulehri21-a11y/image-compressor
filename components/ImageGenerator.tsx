
import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';

const Spinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="mt-4 text-slate-500 dark:text-slate-400">Gemini is creating your image...</p>
  </div>
);

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('A photorealistic image of a cat wearing a spacesuit, high resolution');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate an image.');
      return;
    }
    setIsLoading(true);
    setError('');
    setImageUrl('');
    try {
      const result = await generateImage(prompt);
      setImageUrl(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to generate image: ${err.message}`);
      } else {
        setError('An unknown error occurred during image generation.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Image Generator</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Create stunning visuals with Gemini's image generation model.</p>
      </header>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
        {/* Input column */}
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col">
              <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Your Prompt
              </label>
              <textarea
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A photorealistic image of a cat wearing a spacesuit on Mars"
                className="flex-1 w-full p-3 font-sans text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md resize-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={5}
              />
            </div>
            <div className="mt-4">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Generating...' : 'Generate Image'}
              </button>
            </div>
        </div>

        {/* Output column */}
        <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/70 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 p-4">
          {isLoading && <Spinner />}
          {error && (
             <div className="text-center text-red-500">
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 rounded-md p-4">
                  <p className="font-semibold">An Error Occurred</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
          )}
          {!isLoading && !error && imageUrl && (
            <img src={imageUrl} alt={prompt} className="max-w-full max-h-full object-contain rounded-md" />
          )}
          {!isLoading && !error && !imageUrl && (
            <div className="text-center text-slate-500 dark:text-slate-400">
                <p>Your generated image will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
