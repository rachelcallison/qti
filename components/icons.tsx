
import React from 'react';

type IconProps = {
    className?: string;
};

export const MagicWandIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.25278V4.85278C12 4.27048 12.4705 3.8 13.0528 3.8L14.4528 3.8C15.0351 3.8 15.5056 4.27048 15.5056 4.85278V6.25278M9.54722 9.74722L8.14722 8.34722C7.68837 7.88837 7.68837 7.11163 8.14722 6.65278L9.54722 5.25278C10.0061 4.79393 10.7828 4.79393 11.2417 5.25278L12.6417 6.65278C13.1005 7.11163 13.1005 7.88837 12.6417 8.34722L11.2417 9.74722M18.1929 13.3458L17.5 12.6528M12 17.7472V19.1472C12 19.7295 11.5295 20.2 10.9472 20.2H9.54722C8.96492 20.2 8.49444 19.7295 8.49444 19.1472V17.7472M14.4528 14.2528L15.8528 15.6528C16.3116 16.1116 16.3116 16.8884 15.8528 17.3472L14.4528 18.7472C13.9939 19.2061 13.2172 19.2061 12.7583 18.7472L11.3583 17.3472C10.9 16.8884 10.9 16.1116 11.3583 15.6528L12.7583 14.2528M5.80711 10.6542L6.5 11.3472" />
    </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const LoaderIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v3m0 12v3m9-9h-3m-12 0H3m16.657-6.657l-2.122 2.122m-11.314 0l-2.122-2.122m11.314 11.314l2.122-2.122m-11.314 0l2.122 2.122" />
    </svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);
