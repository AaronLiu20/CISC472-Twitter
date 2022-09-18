  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);


document.getElementById("testing").addEventListener("click", function (event){
  alert (document.getElementById("testing").innerHTML);
});
