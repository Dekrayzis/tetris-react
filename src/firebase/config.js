import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAB4qyJzmAxX-8z9f0pkqf5MOTFOfhBeak",
    authDomain: "tetrisdb-5c73e.firebaseapp.com",
    databaseURL: "https://tetrisdb-5c73e.firebaseio.com",
    projectId: "tetrisdb-5c73e",
    storageBucket: "tetrisdb-5c73e.appspot.com",
    messagingSenderId: "871992542032",
    appId: "1:871992542032:web:ef2ea4956a9a55d78da255",
    measurementId: "G-NRFL14MGMV"
};

// Initialize Firebase
firebase.initializeApp(config);

export default firebase;