import * as React from 'react';
import { Button, withTheme, Snackbar } from 'react-native-paper';
import { View, StyleSheet, Text } from 'react-native';
import { DB } from '../../Config'

export class Pantalla extends React.Component {
  state = {
		turno_actual: '',
		banco: {}
  };

	constructor(props) {
		super(props);
		console.log(props)
	}

	componentDidMount() {
		DB.collection("bancos").doc(this.props.route.clave)
    .onSnapshot((doc) => {
			this.setState({banco: doc.data()});
			console.log("Current data: ", doc.data());

			if(this.state.banco.turno_lugar !== "") {
				this.setState({turno_actual: `${this.state.banco.turno_numero} - ${this.state.banco.turno_lugar}`});
			}
			else {
				this.setState({turno_actual: 'Sin turno'});
			}
    });
	}

  render() {
    return (
      <View style={styles.div}>
				<Text style={{fontSize: 20}}>Turno actual:</Text>
				<Text style={{fontWeight: 'bold', fontSize: 35, textTransform: 'uppercase'}}>{this.state.turno_actual}</Text>
      </View>
    );
	}
}

const styles = StyleSheet.create({
  div: {
    flex: 1,
    alignItems: 'center',
		justifyContent: 'center',
		padding: 10
	},
	input: {
		margin: 10,
	},
	datos: {
		margin: 25,
		borderRadius: 5,
		backgroundColor: '#d4d4d4',
		padding: 10,
	},
	dato: {
		fontSize: 20,
		textAlign: 'center',
	}
});

export default withTheme(Pantalla);