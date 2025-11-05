// src/store/providers/ReduxProvider.tsx
'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;
