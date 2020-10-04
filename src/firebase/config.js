import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDXMa9vxHULALyO_VUDrxB_s9a218_sP9A",
  authDomain: "bookspokedex-dev.firebaseapp.com",
  databaseURL: "https://bookspokedex-dev.firebaseio.com",
  projectId: "bookspokedex-dev",
  storageBucket: "bookspokedex-dev.appspot.com",
  messagingSenderId: "1037107596623",
  appId: "1:1037107596623:web:a2f1831a585b55ad51493a",
  measurementId: "G-KXX28XTJM3",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };