import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import CodeReviewer from './components/CodeReviewer';
import ImageGenerator from './components/ImageGenerator';
import ImageCompressor from './components/ImageCompressor';
import DocumentSummarizer from './components/DocumentSummarizer';
import UnitConverter from './components/UnitConverter';
import JsonFormatter from './components/JsonFormatter';
import RegexTester from './components/RegexTester';
import PasswordGenerator from './components/PasswordGenerator';
import { BannerAd, PopupAd } from './components/Ads';
import { adsConfig } from './adsConfig';

const POPUP_AD_TRIGGER_COUNT = 3;

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTool, setActiveTool] = useState('Code Reviewer');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [navigationCount, setNavigationCount] = useState(0);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleNavClick = useCallback((toolName: string) => {
    setActiveTool(toolName);
    const newNavCount = navigationCount + 1;
    setNavigationCount(newNavCount);

    if (newNavCount >= POPUP_AD_TRIGGER_COUNT) {
      setPopupVisible(true);
      setNavigationCount(0);
    }
  }, [navigationCount]);

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  const renderTool = () => {
    switch (activeTool) {
      case 'Code Reviewer':
        return <CodeReviewer />;
      case 'Image Generator':
        return <ImageGenerator />;
      case 'Image Compressor':
          return <ImageCompressor />;
      case 'Document Summarizer':
        return <DocumentSummarizer />;
      case 'Unit Converter':
          return <UnitConverter />;
      case 'JSON Formatter':
          return <JsonFormatter />;
      case 'Regex Tester':
          return <RegexTester />;
      case 'Password Generator':
          return <PasswordGenerator />;
      default:
        const oldToolMapping: { [key: string]: string } = {
          'Image Tools': 'Image Generator',
          'Document & PDF': 'Document Summarizer',
          'Calculator Suite': 'Unit Converter',
          'Text & Data': 'JSON Formatter',
          'Developer Tools': 'Regex Tester',
          'Miscellaneous Tools': 'Password Generator',
        };
        const newTool = oldToolMapping[activeTool];
        if (newTool) {
          setActiveTool(newTool);
          return null;
        }
        return <CodeReviewer />;
    }
  };

  return (
    <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="p-4">
        <Sidebar 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          activeTool={activeTool} 
          onNavClick={handleNavClick} 
        />
      </div>
      <main className="flex-1 flex flex-col p-8 overflow-hidden">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex-1 flex flex-col overflow-hidden">
          <BannerAd slotId={adsConfig.topBanner} />
          <div className="flex-1 p-8 overflow-hidden flex flex-col">
            {renderTool()}
          </div>
          <BannerAd slotId={adsConfig.bottomBanner} />
        </div>
      </main>
      <PopupAd 
        slotId={adsConfig.popup} 
        isOpen={isPopupVisible} 
        onClose={handleClosePopup} 
      />
    </div>
  );
}