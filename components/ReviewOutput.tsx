
import React from 'react';

interface ReviewOutputProps {
  review: string;
  isLoading: boolean;
  error: string;
}

const Spinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="mt-4 text-slate-500 dark:text-slate-400">Gemini is reviewing your code...</p>
  </div>
);

const ReviewOutput: React.FC<ReviewOutputProps> = ({ review, isLoading, error }) => {
  const parseMarkdownToHTML = (text: string) => {
    // Basic sanitizer
    let sanitized = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Split by code blocks to handle them separately
    const parts = sanitized.split(/(`{3}[\s\S]*?`{3})/g);

    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const langMatch = part.match(/^`{3}(\w*)\n/);
        const language = langMatch ? langMatch[1] : '';
        const code = part.replace(/^`{3}\w*\n/, '').replace(/`{3}$/, '');
        return `<pre class="bg-slate-200 dark:bg-slate-900 rounded-md p-4 text-sm overflow-x-auto my-4"><code class="language-${language}">${code}</code></pre>`;
      } else {
        return part
          .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-4 mb-2 dark:text-white">$1</h3>')
          .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 border-b pb-2 dark:text-white dark:border-slate-600">$1</h2>')
          .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4 border-b-2 pb-2 dark:text-white dark:border-slate-500">$1</h1>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/^\s*[-*] (.*)/gim, '<li class="ml-6 list-disc">$1</li>')
          .replace(/<\/li>\n<li/g, '</li><li') // Group list items
          .replace(/<li>/g, '<ul><li>') // Wrap list items
          .replace(/<\/li>(?!\s*<li)/g, '</li></ul>')
          .replace(/\n/g, '<br />'); // Handle newlines
      }
    }).join('');
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-center text-red-500">
        <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 rounded-md p-4">
          <p className="font-semibold">An Error Occurred</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <p className="text-slate-500 dark:text-slate-400">Your code review feedback will appear here.</p>
      </div>
    );
  }

  return (
    <div 
      className="prose prose-slate dark:prose-invert max-w-none" 
      dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(review) }} 
    />
  );
};

export default ReviewOutput;
