import React from 'react';

interface BannerAdProps {
  slotId: string;
}

export const BannerAd: React.FC<BannerAdProps> = ({ slotId }) => {
  return (
    <div className="bg-slate-200 dark:bg-slate-700 text-center py-2 shrink-0">
      <p className="text-sm text-slate-500 dark:text-slate-400">Advertisement</p>
      {/* In a real implementation, you would use your ad provider's script here */}
      <div className="text-xs text-slate-400 dark:text-slate-500">Slot ID: {slotId}</div>
    </div>
  );
};

interface PopupAdProps {
  slotId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PopupAd: React.FC<PopupAdProps> = ({ slotId, isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        aria-modal="true"
        role="dialog"
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-md relative">
        <button 
            onClick={onClose} 
            className="absolute top-2 right-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            aria-label="Close ad"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Advertisement</h2>
            <div className="bg-slate-200 dark:bg-slate-700 p-8 min-h-[250px] flex items-center justify-center rounded">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Pop-up Ad Content</p>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">Slot ID: {slotId}</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
