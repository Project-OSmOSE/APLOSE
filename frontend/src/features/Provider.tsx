import React, { type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { AppStore } from './store';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Provider store={ AppStore } children={ children }/>
)
