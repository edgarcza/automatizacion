import * as Firebase from 'firebase';
import 'firebase/firestore';
let config = {
    apiKey: "AIzaSyAXArob-1Esc_wJO3FSheqNzgI2U5FFX9U",
    authDomain: "automatizacion-85281.firebaseapp.com",
    databaseURL: "https://automatizacion-85281.firebaseio.com",
    projectId: "automatizacion-85281",
    storageBucket: "automatizacion-85281.appspot.com",
    messagingSenderId: "985091268252",
    appId: "1:985091268252:web:81254bde6c5e16e6539759"
};
let app = Firebase.initializeApp(config);
export const DB = Firebase.firestore();

export var Lugares = [
    'Elegir lugar...',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
]