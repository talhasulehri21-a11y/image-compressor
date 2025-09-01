import React from 'react';
import { NavItem } from '../types';
import LogoIcon from './icons/LogoIcon';
import CodeIcon from './icons/CodeIcon';
import DocumentIcon from './icons/DocumentIcon';
import CalculatorIcon from './icons/CalculatorIcon';
import TextIcon from './icons/TextIcon';
import DeveloperIcon from './icons/DeveloperIcon';
import ToolsIcon from './icons/ToolsIcon';
import CompressIcon from './icons/CompressIcon';

interface SidebarProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  activeTool: string;
  onNavClick: (toolName: string) => void;
}

const navItems: NavItem[] = [
  { name: 'Code Reviewer', icon: CodeIcon },
  { name: 'Image Generator', icon: DocumentIcon },
  { name: 'Image Compressor', icon: CompressIcon },
  { name: 'Document Summarizer', icon: DocumentIcon },
  { name: 'Unit Converter', icon: CalculatorIcon },
  { name: 'JSON Formatter', icon: TextIcon },
  { name: 'Regex Tester', icon: DeveloperIcon },
  { name: 'Password Generator', icon: ToolsIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ isDarkMode, setIsDarkMode, activeTool, onNavClick }) => {
  return (
    <aside className="w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex flex-col p-4 h-full">
      <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-700">
        <LogoIcon className="w-8 h-8 text-indigo-600" />
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">OmniTools</h1>
      </div>
      <nav className="flex-1 mt-4 overflow-y-auto">
        <ul>
          {navItems.map((item) => {
            const isActive = item.name === activeTool;
            return (
              <li key={item.name}>
                <button 
                  onClick={() => onNavClick(item.name)} 
                  className={`flex items-center gap-3 px-4 py-2 my-1 rounded-lg transition-colors w-full text-left ${
                    isActive 
                    ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && <div className="w-1 h-4 bg-indigo-500 rounded-full ml-auto"></div>}
                </button>
              </li>
            )}
          )}
        </ul>
      </nav>
      <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Dark Mode</span>
          <button onClick={() => setIsDarkMode(!isDarkMode)} aria-pressed={isDarkMode} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'
          }`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isDarkMode ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
