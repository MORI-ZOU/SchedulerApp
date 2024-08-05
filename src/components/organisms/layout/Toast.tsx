import React, { FC } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  type: 'success' | 'error' | 'warning';
  message: string;
}

export const Toast: FC<ToastProps> = ({ type, message }) => {
  const typeClasses = {
    success:
      'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200',
    error: 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200',
    warning:
      'text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200',
  };

  const iconPaths = {
    success:
      'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z',
    error:
      'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 1 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414...',
    warning:
      'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z',
  };

  return createPortal(
    <div
      className={`flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 fixed bottom-4 ${typeClasses[type]}`}
    >
      <div
        className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${typeClasses[type]}`}
      >
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d={iconPaths[type]} />
        </svg>
        <span className="sr-only">Icon</span>
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
    </div>,
    document.body
  );
};
