import React, { useState, useCallback } from 'react';

export default function JsonFormatter() {
  const [jsonInput, setJsonInput] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [error, setError] = useState('');

  const handleFormat = useCallback(() => {
    if (!jsonInput.trim()) {
      setError('Please enter some JSON to format.');
      setFormattedJson('');
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      setError('');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`Invalid JSON: ${e.message}`);
      } else {
        setError('An unknown error occurred while parsing JSON.');
      }
      setFormattedJson('');
    }
  }, [jsonInput]);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">JSON Formatter</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Paste your JSON data to validate and format it instantly.</p>
      </header>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
        {/* Input column */}
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col">
            <label htmlFor="json-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Your JSON
            </label>
            <textarea
              id="json-input"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{ "key": "value", "nested": { "number": 123 } }'
              className="flex-1 w-full p-3 font-mono text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md resize-none focus:ring-indigo-500 focus:border-indigo-500"
              spellCheck="false"
            />
          </div>
          <div className="mt-4">
            <button
              onClick={handleFormat}
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Format JSON
            </button>
          </div>
        </div>

        {/* Output column */}
        <div className="flex flex-col bg-slate-50 dark:bg-slate-900/70 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
            Formatted Output
          </h2>
          <div className="flex-1 overflow-auto p-4">
            {error && (
              <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 rounded-md p-4">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {!error && formattedJson && (
              <pre className="text-sm font-mono whitespace-pre-wrap break-all"><code>{formattedJson}</code></pre>
            )}
            {!error && !formattedJson && (
              <p className="text-slate-500 dark:text-slate-400 text-center">Your formatted JSON will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
