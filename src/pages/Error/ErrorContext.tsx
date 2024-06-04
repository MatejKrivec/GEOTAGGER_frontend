import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ErrorContextProps {
  errorMessage: string;
  showError: boolean;
  setShowError: React.Dispatch<React.SetStateAction<boolean>>;
  displayError: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextProps>({} as ErrorContextProps);

export const useError = () => useContext(ErrorContext);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const displayError = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
  };

  return (
    <ErrorContext.Provider value={{ errorMessage, showError, setShowError, displayError }}>
      {children}
    </ErrorContext.Provider>
  );
};