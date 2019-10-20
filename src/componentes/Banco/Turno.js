import * as React from 'react';
import { Button, withTheme, Snackbar, Divider } from 'react-native-paper';
import { View, StyleSheet, Text, Picker } from 'react-native';
import { DB, Lugares } from '../../Config'

export class Turno extends React.Component {
	state = {
		sb_visible: false,
		banco: {},
		m_visible: false,
		lugar: 0,
		tipo: 0,
		sb_mensaje: 'Información actualizada',
	};

	lugares = Lugares;

	constructor(props) {
		super(props);
		console.log(props)
	}

	componentDidMount() {
		DB.collection("bancos").doc(this.props.route.clave)
			.onSnapshot((doc) => {
				this.setState({ banco: doc.data() });
				console.log("Current data: ", doc.data());
			});
	}

	render() {
		return (
			<View style={styles.div}>

				<View style={{ width: '100%', backgroundColor: '#ededed', borderWidth: 1, borderColor: this.props.theme.colors.primary }}>
					<Picker
						selectedValue={this.state.tipo}
						style={{ height: 50, width: '100%' }}
						onValueChange={(itemValue, itemIndex) => this.setState({ tipo: itemIndex })}
					>
						<Picker.Item label={'Soy...'} value={0} />
						<Picker.Item label={'Cajero'} value={1} />
						<Picker.Item label={'Ejecutivo'} value={2} />
					</Picker>
				</View>

				<View style={{ width: '100%', backgroundColor: '#ededed', borderWidth: 1, borderColor: this.props.theme.colors.primary, marginTop: 10 }}>
					<Picker
						selectedValue={this.state.lugar}
						style={{ height: 50, width: '100%' }}
						onValueChange={(itemValue, itemIndex) =>
							this.setState({ lugar: itemIndex })
						}>
						{
							this.lugares.map((lugar, i) => {
								return (<Picker.Item key={i} label={lugar} value={i} />)
							})
						}
					</Picker>
				</View>

				<View style={[styles.datos, { backgroundColor: this.props.theme.colors.primary }]}>
					<Text style={[styles.dato, { marginVertical: 5 }]}>Capacidad actual: {this.state.banco.dentro} de {this.state.banco.capacidad}</Text>
					<Divider></Divider>
					<Text style={[styles.dato, { marginVertical: 5 }]}>Turno actual: {this.state.banco.turno}</Text>
				</View>

				<Button style={styles.input} mode="contained" onPress={() => this.Pedir()}>
					Pedir turno
        </Button>

				{/* <Button style={styles.input} mode="contained" onPress={() => this.Liberar()}>
					Liberar turno
        </Button> */}

				<Button style={styles.input} mode="contained" onPress={() => this.Restaurar()}>
					Restaurar turnos
        </Button>

				<Snackbar
					visible={this.state.sb_visible}
					onDismiss={() => this.setState({ sb_visible: false })}
					duration={2000}
					style={{ backgroundColor: '#00aaff' }}
				>
					{this.state.sb_mensaje}
        </Snackbar>
			</View>
		);
	}

	Liberar() {
		const { clave } = this.props.route;
		DB.collection("bancos").doc(clave).get()
			.then((querySnapshot) => {
				let doc = querySnapshot.data();
				if (doc.dentro > 1) {
					DB.collection("bancos").doc(clave).update({ dentro: doc.dentro - 1 })
						.then((asd) => {
							this.setState({ sb_visible: true, sb_mensaje: 'Lugar liberado' })
						});
				}
				else
					this.setState({ sb_visible: true, sb_mensaje: 'No hay lugares que liberar' })
				// });
			});
	}

	Restaurar() {
		const { clave } = this.props.route;
		DB.collection("bancos").doc(clave).get()
			.then((querySnapshot) => {
				let doc = querySnapshot.data();
				DB.collection("bancos").doc(clave).update({ turno: 0, turno_numero: 0, turno_lugar: '', turno_pantalla: '' })
					.then((asd) => {
						this.setState({ sb_visible: true,  sb_mensaje: 'Restaurado' })
					});
			});
	}

	async Pedir() {
		const { lugar, tipo } = this.state;
		const { clave } = this.props.route;
		console.log(lugar);
		if (lugar == 0 || tipo == 0) return this.setState({sb_visible: true, sb_mensaje: 'Seleccionar lugar y tipo'});

		try {
			const Banco = await DB.collection("bancos").doc(clave).get();
			if (Banco.data().dentro >= 1) {
				try {
					const Turno = await Banco.ref.collection('turnos').where('tipo', '==', this.state.tipo).orderBy('turno').limit(1).get();
					if (!Turno.empty) {
						let TurnoDatos = Turno.docs[0].data();
						console.log(Turno.docs[0].data());
						let Que = (this.state.tipo == 1) ? 'CAJA' : 'EJECUTIVO';
						Banco.ref.update({ dentro: Banco.data().dentro - 1, turno_pantalla: `TURNO ${TurnoDatos.turno} a ${Que} ${this.state.lugar}` });
						this.setState({ sb_visible: true, sb_mensaje: 'Turno pedido' });
						Turno.docs[0].ref.delete();
					}
					else {
						this.setState({ sb_visible: true, sb_mensaje: 'No hay turnos para el tipo solicitado' });
					}
				} catch (error) {
					console.log(error);
				}
			}
			else {
				this.setState({ sb_visible: true, sb_mensaje: 'No hay turnos en espera' });
			}
		} catch (error) {
			console.log(error);
		}

		// 	DB.collection("bancos").doc(clave).get()
		// 		.then((querySnapshot) => {
		// 			let doc = querySnapshot.data();
		// 			if (doc.dentro >= 1) {
		// 				DB.collection("bancos").doc(clave).update({
		// 					dentro: doc.dentro - 1,
		// 					turno_lugar: this.lugares[lugar],
		// 					turno_numero: doc.turno_numero + 1,
		// 				})
		// 					.then((asd) => {
		// 						this.setState({ sb_visible: true })
		// 					});
		// 			}
		// 			else
		// 				this.setState({ sb_visible: true })
		// 			// });
		// 		});
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
		marginVertical: 10,
		width: '100%'
	},
	datos: {
		margin: 25,
		borderRadius: 5,
		padding: 10,
		width: '100%'
	},
	dato: {
		fontSize: 20,
		textAlign: 'center',
		color: '#fff'
	}
});

export default withTheme(Turno);