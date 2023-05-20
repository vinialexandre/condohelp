import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'; 
import 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBwij-AG1891RkguGZYbBicGmnvSel73fI",
  authDomain: "condohelp-97f20.firebaseapp.com",
  projectId: "condohelp-97f20",
  storageBucket: "condohelp-97f20.appspot.com",
  messagingSenderId: "397879648581",
  appId: "1:397879648581:web:b8d1ac4cb3cf78bd775e2c",
  measurementId: "G-TRQEE4D9YD"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
