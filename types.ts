
export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

export interface Question {
  id: string;
  title: string;
  text: string;
  answers: Answer[];
}

// Declarations for libraries loaded from CDN
// FIX: Wrap declarations in `declare global` to make them globally available.
// This is necessary because the `export` keyword turns this file into a module,
// scoping declarations locally by default. This fixes errors like "Cannot find name 'uuid'".
declare global {
  const JSZip: any;
  const saveAs: (blob: Blob, filename: string) => void;
  const uuid: { v4: () => string; };
}
