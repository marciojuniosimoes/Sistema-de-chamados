import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDsh8O-Slnx5eUzDFCKdDbyOlG-1vLNjcU',
  authDomain: 'sistema-de-chamados-e440c.firebaseapp.com',
  projectId: 'sistema-de-chamados-e440c',
  storageBucket: 'sistema-de-chamados-e440c.appspot.com',
  messagingSenderId: '129839260531',
  appId: '1:129839260531:web:ff1fadb23d130398f65b06',
  measurementId: 'G-8DV0XHCBW3',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
