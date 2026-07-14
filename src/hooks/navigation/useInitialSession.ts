import { useState } from 'react';

export const useInitialSession = () => {
  const [isReady] = useState(true);
  return { isReady };
};
