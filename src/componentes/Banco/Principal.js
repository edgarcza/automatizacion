import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import Turno from './Turno';
import QR from './QR';

export class Principal extends React.Component {
	static navigationOptions = {
			headerTransparent: true,
	};

	constructor(props) {
		super(props);
		console.log(props.navigation.getParam('banco'))
	}

  state = {
    index: 0,
    routes: [
      { key: 'banco', title: 'QR', icon: 'code', banco: this.props.navigation.getParam('banco'), clave: this.props.navigation.getParam('clave') },
      { key: 'turno', title: 'Turno', icon: 'chevron-right', banco: this.props.navigation.getParam('banco'), clave: this.props.navigation.getParam('clave') },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    turno: Turno,
    banco: QR
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

export default withNavigation(Principal);