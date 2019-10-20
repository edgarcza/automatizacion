import React from 'react';
import { StyleSheet, Text, View, YellowBox  } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Principal from './src/componentes/Principal';
import { createAppContainer, } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import BancoPrincipal from './src/componentes/Banco/Principal';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00aaff',
    accent: '#f5fafc',
  }
};

const AppNavigator = createStackNavigator({
  Principal: { screen: Principal },
  BancoPrincipal: { screen: BancoPrincipal },
});
const AppContainer = createAppContainer(AppNavigator);

export default function App() {
  YellowBox.ignoreWarnings(['Setting a timer']);
  return (
    <PaperProvider theme={theme}>
      {/* <Principal></Principal> */}
      <AppContainer style={{flex: 1, backgroundColor: '#000'}} />
    </PaperProvider>
  );
}
