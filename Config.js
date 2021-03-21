import firebase from 'firebase';
require ('@firebase/firestore')

const firebaseConfig = {
    apiKey: "AIzaSyDPXhhbpTdHxtfBIMvzZQm0AMkbjZM_D7k",
    authDomain: "wireless-library-a4938.firebaseapp.com",
    projectId: "wireless-library-a4938",
    storageBucket: "wireless-library-a4938.appspot.com",
    messagingSenderId: "936577672836",
    appId: "1:936577672836:web:9361c13c323c3b747284d1"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();