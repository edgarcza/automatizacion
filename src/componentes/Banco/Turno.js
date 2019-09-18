import * as React from 'react';
import { Button, withTheme, Snackbar } from 'react-native-paper';
import { View, StyleSheet, Text } from 'react-native';
import { DB } from '../../Config'

export class Turno extends React.Component {
  state = {
		sb_visible: false,
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
    });
	}

  render() {
    return (
      <View style={styles.div}>				
				<View style={styles.datos}>
					<Text style={styles.dato}>Capacidad actual: {this.state.banco.dentro} / {this.state.banco.capacidad}</Text>
					<Text style={styles.dato}>Turno actual: {this.state.banco.turno - 1}</Text>
				</View>

        <Button style={styles.input} mode="contained" onPress={() => this.Liberar()}>
					Liberar turno
        </Button>

        <Button style={styles.input} mode="contained" onPress={() => this.Restaurar()}>
					Restaurar turnos
        </Button>

        <Snackbar
          visible={this.state.sb_visible}
          onDismiss={() => this.setState({ sb_visible: false })}
          duration={2000}
          style={{backgroundColor: '#00aaff'}}
        >
          Información actualizada
        </Snackbar>
      </View>
    );
	}
	
	Liberar() {
		const {clave} = this.props.route;
		DB.collection("bancos").doc(clave).get()
		.then((querySnapshot) => {
			let doc = querySnapshot.data();
			if(doc.dentro > 0) {
				DB.collection("bancos").doc(clave).update({dentro: doc.dentro - 1})
				.then((asd) => {
					this.setState({sb_visible: true})
				});
			}
			else
				this.setState({sb_visible: true})
			// });
		});
	}
	
	Restaurar() {
		const {clave} = this.props.route;
		DB.collection("bancos").doc(clave).get()
		.then((querySnapshot) => {
			let doc = querySnapshot.data();
			DB.collection("bancos").doc(clave).update({turno: 1})
			.then((asd) => {
				this.setState({sb_visible: true})
			});
		});
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

export default withTheme(Turno);