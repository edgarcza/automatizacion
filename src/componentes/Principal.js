import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import Turno from './Turno';
import Banco from './Banco';

export default class Principal extends React.Component {
  static navigationOptions = {
    headerTransparent: true,
  };

  state = {
    index: 0,
    routes: [
      { key: 'turno', title: 'Turno', icon: 'chevron-right' },
      { key: 'banco', title: 'Banco', icon: 'business' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    turno: Turno,
    banco: Banco
  });

  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
        activeColor="#fff"
        inactiveColor="#acd7e8"
      />
    );
  }
}