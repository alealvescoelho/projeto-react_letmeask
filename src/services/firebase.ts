/* nota:
 a partir da versão 9 do firebase, os imports devem conter o 'compat':

 ANTES: import firebase from 'firebase/app';
 AGORA: import firebase from 'firebase/compat/app';

*/

import firebase from 'firebase/compat/app';

import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
  };

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

export { firebase, auth, database };

