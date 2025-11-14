
import React from 'react';

export const Instructions: React.FC = () => {
    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold text-cyan-400 mb-3">How It Works</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Write your questions and answers in the text box below.</li>
                <li>Start each answer on a new line, prefixed with <strong>Correct:</strong> or <strong>Incorrect:</strong>.</li>
                <li>To add feedback for an <strong>incorrect</strong> answer, simply write it on the line(s) immediately following that answer.</li>
                <li>Click <strong>Generate QTI ZIP</strong> to download the file for Canvas.</li>
            </ol>
            <div className="mt-4 p-3 bg-gray-900/50 rounded-md border border-gray-600">
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Example Format:</h3>
                <pre className="text-xs text-gray-400 whitespace-pre-wrap mt-1">
{`What is the capital of France?
Correct: Paris
Incorrect: London
This is incorrect because London is the capital of the UK.
This is a second line of feedback.`}
                </pre>
            </div>
            <p className="text-xs text-gray-500 mt-4">Note: Blank lines between questions are optional. Feedback is only supported for answers marked as "Incorrect:".</p>
        </div>
    );
};