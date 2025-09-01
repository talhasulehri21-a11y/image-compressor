import React, { useState, useEffect, useCallback } from 'react';

const charset = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
};

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let availableChars = charset.lowercase;
    if (options.uppercase) availableChars += charset.uppercase;
    if (options.numbers) availableChars += charset.numbers;
    if (options.symbols) availableChars += charset.symbols;

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += availableChars[Math.floor(Math.random() * availableChars.length)];
    }
    setPassword(newPassword);
    setCopied(false);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [length, options, generatePassword]);
  
  const handleOptionChange = (option: keyof typeof options) => {
      setOptions(prev => ({...prev, [option]: !prev[option]}));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Password Generator</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Create strong, secure, and random passwords.</p>
      </header>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg p-8 space-y-6 bg-slate-50 dark:bg-slate-900/70 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="relative">
            <input
              type="text"
              value={password}
              readOnly
              className="w-full p-4 font-mono text-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md pr-24"
              aria-label="Generated Password"
            />
            <button onClick={handleCopy} className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="length" className="font-medium">Password Length</label>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{length}</span>
            </div>
            <input
              id="length"
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={e => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md cursor-pointer">
              <input type="checkbox" checked={options.uppercase} onChange={() => handleOptionChange('uppercase')} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
              <span>Uppercase</span>
            </label>
             <label className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md cursor-pointer">
              <input type="checkbox" checked={options.numbers} onChange={() => handleOptionChange('numbers')} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
              <span>Numbers</span>
            </label>
             <label className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md cursor-pointer">
              <input type="checkbox" checked={options.symbols} onChange={() => handleOptionChange('symbols')} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
              <span>Symbols</span>
            </label>
          </div>
          
           <button
              onClick={generatePassword}
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Generate New Password
            </button>
        </div>
      </div>
    </>
  );
}
