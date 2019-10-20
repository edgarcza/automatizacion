import * as React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { withTheme, Button, ActivityIndicator, Snackbar, Dialog, Portal, RadioButton } from 'react-native-paper';

import { DB } from '../Config'

import { BarCodeScanner } from 'expo-barcode-scanner';

export class Turno extends React.Component {
	state = {
		hasCameraPermission: null,
		scanned: false,
		cargando: false,
		dialogo: false,
		sb_visible: false,
		hay_banco: false,
		codigo: null,
		va_a: 1,
		banco: {}
		// hay_banco: true,
		// banco: {turno: 1}
	};

	constructor(props) {
		super(props);

		// console.log(props);
	}

	async componentDidMount() {
		this.getPermissionsAsync();
		// DB.collection("bancos").doc('ILXENM7FPNU1K27NCqif').get().then((doc) => {
		// 	// console.log(doc);
		// 	if(doc.exists) {
		// 		console.log(doc.data());
		// 	}
		// }).catch(function(error) {
		// 	console.log("Error getting document:", error);
		// });
	}

	getPermissionsAsync = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ hasCameraPermission: status === 'granted' });
	};

	render() {
		const { hasCameraPermission, scanned, cargando, hay_banco, banco } = this.state;

		if (hasCameraPermission === null) {
			return (
				<View style={styles.div}>
					<ActivityIndicator animating={true} />
				</View>
			);
		}
		if (hasCameraPermission === false) {
			return (
				<View style={styles.div}>
					<Text style={styles.texto}>No hay permiso para usar la cámara</Text>
				</View>
			);
		}

		return (
			<View style={styles.div}>
				{!cargando && !scanned && (<BarCodeScanner
					onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
					style={{ height: '65%', width: '65%', borderWidth: 10, borderColor: this.props.theme.colors.primary }}
				/>)}

				{cargando && (<ActivityIndicator animating={true} size={140} />)}

				{hay_banco && (
					<Text
						style={{ fontSize: 40, fontWeight: '500' }}
					>
						TURNO {banco.turno + 1}
					</Text>
				)}

				<Portal>
					<Dialog
						visible={this.state.dialogo}
						onDismiss={() => this.setState({ scanned: false, dialogo: false })}>
						<Dialog.Title>Voy...</Dialog.Title>
						<Dialog.Content>
							<View>
								<RadioButton.Group
									onValueChange={value => this.setState({ va_a: value })}
									value={this.state.va_a}
								>
									<TouchableHighlight onPress={() => { this.setState({ va_a: 1 }) }} underlayColor='#ededed'>
										<View style={{ flexDirection: "row" }}>
											<RadioButton color={this.props.theme.colors.primary} value={1} />
											<Text style={{ paddingTop: 6, fontSize: 17, fontWeight: 'bold' }}>A caja</Text>
										</View>
									</TouchableHighlight>
									<TouchableHighlight onPress={() => { this.setState({ va_a: 2 }) }} underlayColor='#ededed'>
										<View style={{ flexDirection: "row" }}>
											<RadioButton color={this.props.theme.colors.primary} value={2} />
											<Text style={{ paddingTop: 6, fontSize: 17, fontWeight: 'bold' }}>Con ejecutivo</Text>
										</View>
									</TouchableHighlight>
								</RadioButton.Group>
							</View>
						</Dialog.Content>
						<Dialog.Actions>
							<Button onPress={() => this.buscarBanco()}>PEDIR TURNO</Button>
						</Dialog.Actions>
					</Dialog>
				</Portal>

				{scanned && (
					<Button style={{ marginTop: 50 }}
						icon="refresh" mode="contained" onPress={() => this.setState({ scanned: false, cargando: false, hay_banco: false })}>
						Escanear otra vez
					</Button>
				)}

				<Snackbar
					visible={this.state.sb_visible}
					onDismiss={() => this.setState({ sb_visible: false })}
					duration={5000}
					style={{ backgroundColor: '#eb5f3f' }}
				>
					El banco está lleno
        </Snackbar>
			</View>
		);
	}

	async buscarBanco() {
		this.setState({ dialogo: false, cargando: true });
		console.log(this.state.codigo);

		try {
			const Documento = await DB.collection("bancos").doc(this.state.codigo).get();
			if(Documento.exists) {
				if(Documento.data().dentro < Documento.data().capacidad) {
					this.setState({banco: Documento.data()});
					try {
						const Update = await Documento.ref.update({dentro: Documento.data().dentro + 1, turno: Documento.data().turno + 1});
						const UpTurno = await Documento.ref.collection('turnos').doc((Documento.data().turno + 1).toString()).set({tipo: this.state.va_a, turno: Documento.data().turno + 1})
						console.log(Update);
						this.setState({ cargando: false, hay_banco: true })
					} catch(error) {
						console.log(error)
					}
				}
			}
		} catch(error) {
			console.log(error)
		}
		
	}

	handleBarCodeScanned = ({ type, data }) => {
		this.setState({ scanned: true, codigo: data, dialogo: true });
		// 	DB.collection("bancos").doc(data).get().then((doc) => {
		// 		// console.log(doc);
		// 		if (doc.exists) {
		// 			let banco = doc.data();
		// 			console.log(banco);
		// 			if (banco.dentro < banco.capacidad) {
		// 				this.setState({ hay_banco: true, banco: banco });

		// 				DB.collection("bancos").doc(data).update({ dentro: banco.dentro + 1, turno: banco.turno + 1 })
		// 					.then((asd) => {

		// 					});

		// 			}
		// 			else {
		// 				// alert("El banco está lleno");
		// 				this.setState({ sb_visible: true })
		// 			}
		// 		}
		// 		this.setState({ cargando: false })
		// 	}).catch(function (error) {
		// 		console.log("Error getting document:", error);
		// 		this.setState({ cargando: false })
		// 	});
	};

}

const styles = StyleSheet.create({
	div: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	texto: {
		fontSize: 20,
		fontWeight: '500',
		letterSpacing: 0.5,
	}
});

export default withTheme(Turno);