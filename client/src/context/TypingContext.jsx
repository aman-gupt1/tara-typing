import { createContext, useContext, useState } from 'react';

const TypingContext = createContext(null);

export const TypingProvider = ({ children }) => {
  const [testConfig, setTestConfig] = useState({
    duration: 30,
    mode: 'words', // 'words' | 'quote' | 'custom'
    wordCount: 50,
    customText: '',
    isDailyChallenge: false,
  });

  const [lastResult, setLastResult] = useState(null);

  const configureTest = (config) => {
    setTestConfig((prev) => ({ ...prev, ...config }));
  };

  return (
    <TypingContext.Provider
      value={{
        testConfig,
        setTestConfig,
        configureTest,
        lastResult,
        setLastResult,
      }}
    >
      {children}
    </TypingContext.Provider>
  );
};

export const useTyping = () => {
  const context = useContext(TypingContext);
  if (!context) {
    throw new Error('useTyping must be used within a TypingProvider');
  }
  return context;
};

export const useTypingContext = useTyping;
export default TypingContext;
