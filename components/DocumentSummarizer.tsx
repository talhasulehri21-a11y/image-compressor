import React, { useState, useCallback } from 'react';
import { summarizeText } from '../services/geminiService';
import ReviewOutput from './ReviewOutput'; // Reusing ReviewOutput for display

export default function DocumentSummarizer() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSummary('');
    try {
      const result = await summarizeText(text);
      setSummary(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to get summary: ${err.message}`);
      } else {
        setError('An unknown error occurred during summarization.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [text]);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Document Summarizer</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Get a concise summary of any text using Gemini.</p>
      </header>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
        {/* Input column */}
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col">
            <label htmlFor="text-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Your Text
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your document or text here..."
              className="flex-1 w-full p-3 font-sans text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md resize-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mt-4">
            <button
              onClick={handleSummarize}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Summarizing...' : 'Summarize Text'}
            </button>
          </div>
        </div>

        {/* Output column */}
        <div className="flex flex-col bg-slate-50 dark:bg-slate-900/70 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
            Summary
          </h2>
          <div className="flex-1 overflow-y-auto p-4">
            <ReviewOutput review={summary} isLoading={isLoading} error={error} />
          </div>
        </div>
      </div>
    </>
  );
}
