import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCNycfjbGiPDVXjXzQlbzX8IZMQ7XPiDu0",
  authDomain: "real-time-database-examp-750c6.firebaseapp.com",
  databaseURL: "https://real-time-database-examp-750c6-default-rtdb.firebaseio.com",
  projectId: "real-time-database-examp-750c6",
  storageBucket: "real-time-database-examp-750c6.appspot.com",
  messagingSenderId: "351951626584",
  appId: "1:351951626584:web:cbcde35964936ed4b5c52d",
  measurementId: "G-Z3PMKBJD7N"
};

const app = initializeApp(firebaseConfig);