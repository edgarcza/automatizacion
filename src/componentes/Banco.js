import * as React from 'react';
import { withTheme, TextInput, Menu, Button } from 'react-native-paper';
import { View, Text, StyleSheet, Picker } from 'react-native';

export class Principal extends React.Component {

	state = {
		contrasena: '',
		clave: '',
	};
	
  render() {
    return (
      <View style={styles.div}>

				<TextInput
					style={styles.input}
					mode='outlined'
					label='Clave del banco'
					value={this.state.clave}
					onChangeText={text => this.setState({ clave: text })}
				/>

				<TextInput
					style={styles.input}
					mode='outlined'
					label='Contraseña'
					value={this.state.contrasena}
					onChangeText={text => this.setState({ contrasena: text })}
					secureTextEntry={true}
				/>
				
				<Button style={styles.input} mode="contained" onPress={() => console.log('Pressed')}>
					Ingresar
				</Button>
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

export default withTheme(Principal);