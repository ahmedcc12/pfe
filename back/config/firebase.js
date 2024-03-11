const fs = require('fs');
require('firebase/compat/storage');
const firebase = require('firebase/compat/app');


const firebaseConfig = {
  apiKey: "AIzaSyB4HiV3TIdfiVcmzqAPGGVCVUsBZxg5Mos",
  authDomain: "pfeproject-ca214.firebaseapp.com",
  projectId: "pfeproject-ca214",
  storageBucket: "pfeproject-ca214.appspot.com",
  messagingSenderId: "9904460083",
  appId: "1:9904460083:web:34e9bb10cd9a4d3eaf6e46"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

module.exports = storage;