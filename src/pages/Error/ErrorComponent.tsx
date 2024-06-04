// ErrorComponent.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { useError } from './ErrorContext';

const ErrorComponent: React.FC = () => {
  const { errorMessage, showError, setShowError } = useError();

  const handleClose = () => {
    setShowError(false); // Close the modal
  };

  if (!showError) {
    return null;
  }

  return ReactDOM.createPortal(
    (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-4 md:p-6 rounded-md w-full max-w-sm md:max-w-md">
          <div className='flex flex-col'>
            <div className="flex justify-start mb-2">
              <h1 className=' text:black text-2xl'>Error</h1>
            </div>
            <div className="flex justify-start">
              <p>{errorMessage}</p>
            </div>
            <div className="flex justify-end">
              <button
                className="text-green-400 hover:bg-green-400 hover:text-white mr-3 md:mr-4 rounded-lg px-4 py-2"
                onClick={handleClose}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    document.body // Append the modal to the body element
  );
};

export default ErrorComponent;
