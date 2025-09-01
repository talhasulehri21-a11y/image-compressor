
import React, { useState, useCallback } from 'react';
import ReviewOutput from './ReviewOutput';
import { reviewCode } from '../services/geminiService';

const languages = [
  "javascript", "python", "java", "csharp", "php", "cpp", "typescript", "go", "ruby", "swift", "kotlin", "rust", "sql", "html", "css"
];

export default function CodeReviewer() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReview = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to review.');
      return;
    }
    setIsLoading(true);
    setError('');
    setReview('');
    try {
      const result = await reviewCode(code, language);
      setReview(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to get review: ${err.message}`);
      } else {
        setError('An unknown error occurred during the code review.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [code, language]);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Code Reviewer</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Get instant feedback on your code from Gemini.</p>
      </header>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
        {/* Input column */}
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <label htmlFor="language-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Language
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang} className="capitalize">{lang}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 flex flex-col">
            <label htmlFor="code-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Your Code
            </label>
            <textarea
              id="code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="flex-1 w-full p-3 font-mono text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md resize-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mt-4">
            <button
              onClick={handleReview}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Reviewing...' : 'Review Code'}
            </button>
          </div>
        </div>

        {/* Output column */}
        <div className="flex flex-col bg-slate-50 dark:bg-slate-900/70 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
            Review Feedback
          </h2>
          <div className="flex-1 overflow-y-auto p-4">
            <ReviewOutput review={review} isLoading={isLoading} error={error} />
          </div>
        </div>
      </div>
    </>
  );
}
