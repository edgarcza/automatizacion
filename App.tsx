import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Principal from './src/componentes/Principal';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00aaff',
    accent: '#f5fafc',
  }
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <Principal></Principal>
    </PaperProvider>
  );
}
