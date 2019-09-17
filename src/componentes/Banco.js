import * as React from 'react';
import { withTheme, TextInput, Menu, Button } from 'react-native-paper';
import { View, Text, StyleSheet, Picker } from 'react-native';
import { withNavigation } from 'react-navigation';
import { DB } from '../Config'
import QRCode from 'react-native-qrcode';

export class Principal extends React.Component {

  // constructor(props) {
  //   super(props);
	// 	// this.buttonPress = this.buttonPress.bind(this);
	// 	console.log("a", props)
  // }

	state = {
		contrasena: '1',
		clave: '1',
		cargando: false,
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
				
				<Button style={styles.input} mode="contained" onPress={() => this.Ingresar()} disabled={this.state.cargando}>
					Ingresar
				</Button>
				
      </View>
    );
	}
	
	Ingresar() {
		this.setState({cargando: true});
		if(this.state.clave !== "" && this.state.contrasena !== "") {
			console.log("sda")
			DB.collection("bancos").doc(this.state.clave).get().then((doc) => {
				this.setState({cargando: false});
				if(doc.exists && doc.data().contrasena === this.state.contrasena) {
					console.log("sad");
					this.props.navigation.navigate('BancoPrincipal', {banco: doc.data(), clave: this.state.clave});
				}
			}).catch((err) => {
				alert("Error al iniciar sesión");
				this.setState({cargando: false});
			});
		}
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

export default withNavigation(withTheme(Principal));