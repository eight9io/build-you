/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import RootNavigation from './navigation';
import { MenuProvider } from 'react-native-popup-menu';

import './i18n';

export const App = () => {
  return (
    <MenuProvider>
      <RootNavigation />
    </MenuProvider>
  );
};

export default App;