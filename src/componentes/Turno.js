import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { withTheme, Button, ActivityIndicator, Snackbar } from 'react-native-paper';

import { DB } from '../Config'

import { BarCodeScanner } from 'expo-barcode-scanner';

export class Turno extends React.Component {
	state = {
		hasCameraPermission: null,
		scanned: false,
		cargando: false,
		sb_visible: false,
		hay_banco: false,
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
					style={{height: '65%', width: '65%', borderWidth: 10, borderColor: this.props.theme.colors.primary}}
				/>)}
				
        {hay_banco && (					
					<Text
						style={{fontSize: 40, fontWeight: '500'}}
					>
						TURNO {banco.turno}
					</Text>
				)}

				{cargando && (<ActivityIndicator animating={true} size={140}/>)}
        {scanned && (					
					<Button style={{marginTop: 50}}
						icon="refresh" mode="contained" onPress={() => this.setState({ scanned: false, cargando: false, hay_banco: false })}>
						Escanear otra vez
					</Button>
				)}
				
        <Snackbar
          visible={this.state.sb_visible}
          onDismiss={() => this.setState({ sb_visible: false })}
          duration={5000}
          style={{backgroundColor: '#eb5f3f'}}
        >
          El banco está lleno
        </Snackbar>
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true, cargando: true });	
		DB.collection("bancos").doc(data).get().then((doc) => {
			// console.log(doc);
			if(doc.exists) {
				let banco = doc.data();
				console.log(banco);
				if(banco.dentro < banco.capacidad) {
					this.setState({hay_banco: true, banco: banco});

					DB.collection("bancos").doc(data).update({dentro: banco.dentro + 1, turno: banco.turno + 1})
					.then((asd) => {
						
					});
					
				} 
				else {
					// alert("El banco está lleno");
					this.setState({sb_visible: true})
				}
			}
			this.setState({cargando: false})
		}).catch(function(error) {
			console.log("Error getting document:", error);
			this.setState({cargando: false})
		});
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