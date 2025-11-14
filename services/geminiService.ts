
import { GoogleGenAI } from "@google/genai";

const formatQuizPrompt = (rawText: string): string => {
    return `You are an expert in formatting quiz questions for QTI import. Your task is to convert the following raw text into a standardized, clean format.

**Formatting Rules:**
1. Each question must start with a number followed by a period (e.g., "1.", "2.").
2. Each answer choice must start with a letter followed by a parenthesis (e.g., "a)", "b)").
3. The single correct answer for each question MUST be prefixed with an asterisk (*). For example, "*c)". If multiple answers seem correct, pick the most likely one. Every question must have exactly one correct answer marked.
4. Separate each complete question block (question and its answers) with a single blank line.
5. Remove any extraneous text, instructions, or comments that are not part of the questions or answers.
6. Do not add any introductory text, explanations, or summaries. Only output the formatted questions.

**Example Input:**
Capital of France?
Paris
London
Berlin
Correct is Paris

What is 2+2?
The options are 3, 4, and 5. The right answer is 4.

**Example Output:**
1. Capital of France?
*a) Paris
b) London
c) Berlin

2. What is 2+2?
a) 3
*b) 4
c) 5

**Now, please format the following text:**
---
${rawText}
---
`;
};

export const formatTextWithAI = async (rawText: string): Promise<string> => {
    // FIX: Per coding guidelines, initialize GoogleGenAI directly with process.env.API_KEY and remove manual API key check.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formatQuizPrompt(rawText),
    });

    return response.text.trim();
};
