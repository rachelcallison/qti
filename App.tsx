
import React, { useState, useCallback } from 'react';
import { generateQtiZip } from './services/qtiService';
import { Instructions } from './components/Instructions';
import { DownloadIcon, LoaderIcon, AlertTriangleIcon } from './components/icons';

const App: React.FC = () => {
    const [text, setText] = useState('');
    const [bankTitle, setBankTitle] = useState('My Question Bank');
    const [isLoadingZip, setIsLoadingZip] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateZip = useCallback(async () => {
        if (!text.trim()) {
            setError('Please enter your questions before generating a ZIP file.');
            return;
        }
        if (!bankTitle.trim()) {
            setError('Please provide a title for the question bank.');
            return;
        }
        setIsLoadingZip(true);
        setError(null);
        try {
            await generateQtiZip(text, bankTitle);
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Failed to generate QTI ZIP file. ${errorMessage}`);
        } finally {
            setIsLoadingZip(false);
        }
    }, [text, bankTitle]);

    const placeholderText = `What must be true about debits and credits in every journal entry?
correct: Debits must equal credits in each entry
incorrect: Credits must be larger than debits
This is not required. The text states that debits must equal credits in each entry to maintain balance in the accounting system.
incorrect: Credits are optional in journal entries
Credits are required in every journal entry. The text states that every entry must have both a debit amount and a credit amount.

How many accounts must be affected in every journal entry?
correct: At least two accounts
incorrect: Exactly two accounts
Some transactions affect more than two accounts.
`;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        QTI Question Bank Generator
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">Convert plain text to a Canvas-ready question bank with feedback.</p>
                </header>

                <main className="space-y-6">
                    <Instructions />

                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center" role="alert">
                            <AlertTriangleIcon className="h-5 w-5 mr-3" />
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="raw-text" className="font-semibold text-gray-300">1. Your Formatted Questions</label>
                        <textarea
                            id="raw-text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={placeholderText}
                            className="w-full h-80 p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-200 resize-y"
                            disabled={isLoadingZip}
                        />
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
                        <div className="flex-grow">
                             <label htmlFor="bank-title" className="block text-sm font-medium text-gray-300 mb-1">2. Question Bank Title</label>
                            <input
                                id="bank-title"
                                type="text"
                                value={bankTitle}
                                onChange={(e) => setBankTitle(e.target.value)}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                placeholder="e.g., Chapter 1 Review"
                                disabled={isLoadingZip}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-2 md:pt-0">
                            <button
                                onClick={handleGenerateZip}
                                disabled={isLoadingZip || !text}
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-900 bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400 disabled:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoadingZip ? <LoaderIcon className="h-5 w-5" /> : <DownloadIcon className="h-5 w-5 mr-2" />}
                                {isLoadingZip ? 'Generating...' : 'Generate QTI ZIP'}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;