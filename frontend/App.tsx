import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { ThemeProvider } from './src/context/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <RootNavigator />
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
