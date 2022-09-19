  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
  import * as rtdb from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD3lTbWlC8B8IIlQeYjxdIZE5ha8sI_BDI",
    authDomain: "cisc472-website-security.firebaseapp.com",
    projectId: "cisc472-website-security",
    storageBucket: "cisc472-website-security.appspot.com",
    messagingSenderId: "373027781816",
    appId: "1:373027781816:web:e619bbe640134df875c84d"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  let db = rtdb.getDatabase(app);
  let TitleDBR = rtdb.ref(db, "title");

document.getElementById("testing").addEventListener("click", function (event){
  alert (document.getElementById("testing").innerHTML);
});

rtdb.onValue(TitleDBR, ss=>{
  document.getElementById("title").innerHTML = ss.val();
});

document.getElementById("intro").addEventListener("keyup", function(event){
  let UpdatedTitle = document.getElementById("intro").value;
  rtdb.set(TitleDBR, UpdatedTitle);
});