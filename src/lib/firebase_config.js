const firebaseConfig = {

    apiKey: "AIzaSyDKTHyrzjrAL2hQshKiIELpKPD92evALnA",

    authDomain: "rentals-manager-1e88f.firebaseapp.com",

    projectId: "rentals-manager-1e88f",

    storageBucket: "rentals-manager-1e88f.appspot.com",

    messagingSenderId: "516133871814",

    appId: "1:516133871814:web:5ef259c651d6dfa54737c7",

    measurementId: "G-92CRB0J8Z3"

};

import { initializeApp } from 'firebase/app';

const app = initializeApp(firebaseConfig);



export {
    app,
    firebaseConfig
}