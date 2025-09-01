import React, { useState, useMemo } from 'react';

const conversions = {
  length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    mile: 1609.34,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,
  },
  mass: {
    gram: 1,
    kilogram: 1000,
    milligram: 0.001,
    pound: 453.592,
    ounce: 28.3495,
  },
  temperature: {
    celsius: (c: number) => c,
    fahrenheit: (f: number) => (f - 32) * 5/9,
    kelvin: (k: number) => k - 273.15,
  },
};

const tempOutputConversions = {
    celsius: (c: number) => c,
    fahrenheit: (c: number) => (c * 9/5) + 32,
    kelvin: (c: number) => c + 273.15,
};

type Category = 'length' | 'mass' | 'temperature';

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('length');
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as Category;
    setCategory(newCategory);
    const units = Object.keys(conversions[newCategory]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setInputValue('1');
  };

  const outputValue = useMemo(() => {
    const inputNum = parseFloat(inputValue);
    if (isNaN(inputNum)) return '';

    if (category === 'temperature') {
      const from = fromUnit as keyof typeof conversions.temperature;
      const to = toUnit as keyof typeof tempOutputConversions;
      const baseValue = conversions.temperature[from](inputNum);
      const result = tempOutputConversions[to](baseValue);
      return result.toFixed(2);
    } else {
      const from = fromUnit as keyof typeof conversions.length; // works for mass too
      const to = toUnit as keyof typeof conversions.length;
      const categoryUnits = conversions[category] as Record<string, number>;
      const baseValue = inputNum * categoryUnits[from];
      const result = baseValue / categoryUnits[to];
      return result.toFixed(5);
    }
  }, [inputValue, fromUnit, toUnit, category]);
  
  const units = Object.keys(conversions[category]);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Unit Converter</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Quickly convert between different units.</p>
      </header>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg p-8 space-y-6 bg-slate-50 dark:bg-slate-900/70 rounded-lg border border-slate-200 dark:border-slate-700">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
            <select id="category" value={category} onChange={handleCategoryChange} className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 capitalize">
              {Object.keys(conversions).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="fromUnit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">From</label>
              <select id="fromUnit" value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 capitalize">
                {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="toUnit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">To</label>
              <select id="toUnit" value={toUnit} onChange={e => setToUnit(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 capitalize">
                {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
              </select>
            </div>
          </div>
          
          <div>
              <label htmlFor="inputValue" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Input</label>
              <input type="number" id="inputValue" value={inputValue} onChange={e => setInputValue(e.target.value)} className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <div>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Result:</p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 break-all">{outputValue}</p>
          </div>
        </div>
      </div>
    </>
  );
}
