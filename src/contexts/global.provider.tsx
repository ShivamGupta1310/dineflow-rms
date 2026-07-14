import React, {ReactNode, useEffect, useMemo} from 'react';
import {createContext} from 'react';
import { LanguagesTypes } from '@appTypes';
import { getItem, setItem } from '@utils/storage';
import { StorageKeys } from '@utils/constants';

interface ProviderWrapperProps {
  children: ReactNode;
}


export interface GlobalContextType {
  language: LanguagesTypes;
  setLanguage: (lang: LanguagesTypes) => void;
  isRTL: boolean;
  setIsRTL: (isRTL: boolean) => void;
}

export const globalConfig: Record<
  string,
  {fn: keyof GlobalContextType; defaultValue: any}
> = {
  language: {fn: 'setLanguage', defaultValue: LanguagesTypes.en},
  isRTL: {fn: 'setIsRTL', defaultValue: false},
};

export const GlobalContext = createContext<GlobalContextType | null>(null);

const getStoredContext = () => {
  const stored = getItem(StorageKeys.GLOBAL_CONTEXT) as any;
  return {
    masterObj: stored?.masterObj ?? null,
    language: Object.values(LanguagesTypes).includes(stored?.language)
      ? stored.language
      : LanguagesTypes.en,
    isRTL: typeof stored?.isRTL === 'boolean' ? stored.isRTL : false,
    isLoggedInOnce:
      typeof stored?.isLoggedInOnce === 'boolean' ? stored.isLoggedInOnce : false,
  };
};

const GlobalProvider: React.FC<ProviderWrapperProps> = ({children}) => {
  const stored = getStoredContext();
  const [language, setLanguage] = React.useState<LanguagesTypes>(
    stored.language,
  );
  const [isRTL, setIsRTL] = React.useState<boolean>(stored.isRTL);
  const contextValue: GlobalContextType = useMemo(
    () => ({
      language,
      setLanguage,
      isRTL,
      setIsRTL,
    }),
    [
      language,
      isRTL,
    ],
  );

  useEffect(() => {
    setItem(StorageKeys.GLOBAL_CONTEXT, {
      language,
      isRTL,
    });
  }, [language, isRTL]);

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
