import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode';

export default class QR extends React.Component {

	constructor(props) {
		super(props);
		console.log(props)
	}

  render() {
    return (
      <View style={styles.div}>
        <QRCode
          value={this.props.route.clave}
          size={320}
          bgColor='#00aaff'
          fgColor='white'/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  div: {
    flex: 1,
    // alignItems: 'center',
		justifyContent: 'center',
		padding: 20
	},
	input: {
		margin: 10
	}
});