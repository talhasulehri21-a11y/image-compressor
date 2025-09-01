import React, { useState, useMemo } from 'react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b');
  const [flags, setFlags] = useState({ g: true, i: true, m: false });
  const [testString, setTestString] = useState('Contact us at support@example.com or sales@example.org for more info.');
  
  const handleFlagChange = (flag: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [], error: null };
    try {
      const flagsString = Object.keys(flags).filter(f => flags[f as keyof typeof flags]).join('');
      const regex = new RegExp(pattern, flagsString);
      const allMatches = Array.from(testString.matchAll(regex));
      return { matches: allMatches, error: null };
    } catch (e: any) {
      return { matches: [], error: e.message };
    }
  }, [pattern, flags, testString]);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Regex Tester</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Test your regular expressions in real-time.</p>
      </header>
      <div className="flex-1 flex flex-col overflow-hidden gap-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="pattern" className="text-sm font-medium text-slate-700 dark:text-slate-300">Regular Expression</label>
            <input
              id="pattern"
              type="text"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              className={`w-full p-2 mt-1 font-mono text-sm bg-slate-50 dark:bg-slate-700 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
            />
          </div>
          <div className="flex items-end gap-4">
            {Object.keys(flags).map(flag => (
              <label key={flag} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags[flag as keyof typeof flags]}
                  onChange={() => handleFlagChange(flag as keyof typeof flags)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-mono text-sm">{flag}</span>
              </label>
            ))}
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label htmlFor="testString" className="text-sm font-medium text-slate-700 dark:text-slate-300">Test String</label>
          <textarea
            id="testString"
            value={testString}
            onChange={e => setTestString(e.target.value)}
            className="w-full p-2 mt-1 font-mono text-sm bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md resize-y focus:ring-indigo-500 focus:border-indigo-500 h-32"
          />
        </div>
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900/70 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
            Matches ({matches.length})
          </h2>
          <div className="flex-1 overflow-y-auto p-4">
            {matches.length > 0 ? (
              <ul className="space-y-2">
                {matches.map((match, i) => (
                  <li key={i} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <span className="font-mono text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-1 py-0.5 rounded">{match[0]}</span>
                    <span className="text-xs text-slate-500 ml-2">(index: {match.index})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center">No matches found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
