// src/store/ReduxProvider.tsx

'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

/**
 * Redux Provider Component
 * Wrap your app with this component to provide Redux store
 */

interface ReduxProviderProps {
    children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps): React.ReactElement {
    return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;