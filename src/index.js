  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
  import * as rtdb from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  //Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD3lTbWlC8B8IIlQeYjxdIZE5ha8sI_BDI",
    authDomain: "cisc472-website-security.firebaseapp.com",
    projectId: "cisc472-website-security",
    storageBucket: "cisc472-website-security.appspot.com",
    messagingSenderId: "373027781816",
    appId: "1:373027781816:web:e619bbe640134df875c84d"
  };

  //Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = rtdb.getDatabase(app);
  const TweetDBR = rtdb.ref(db, "/Tweets");
  const UserDBR = rtdb.ref(db, "/Users");

//this this appends the tweet on the left side and creates the html with the proper information
let renderTweets = (tweetObject, TweetID)=>{
  document.getElementById("insertTweets").insertAdjacentHTML("beforeend",(`
      <div id = "insertTweets"> </div>
      <!-- start of the tweetcard -->
      <div class = "tweetcard" id = "${TweetID}">
        <div class="row g-0">
          <div class="col-md-4">
            <img src=${tweetObject.Author.picture} class="img-fluid rounded-start" alt="...">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title" id = "testing">${tweetObject.title}</h5>
              <p class="card-text">${tweetObject.Author.handle}</p>
              <p class="card-text">${tweetObject.content}</p>
              <p class="card-text"><small class="text-muted">${tweetObject.timestamp} likes: ${tweetObject.like}</small></p>
            </div>
          </div>
        </div>
      </div>
    `))
};

let AddClickEventListener = (originalTweet, id)=>{
  document.getElementById(id).addEventListener("click", function(event){
    let temp = {};
    originalTweet.like += 1; 
    temp[id] = originalTweet
    rtdb.update(TweetDBR, temp);
  });
}

//reads the databse for tweets and fires the renderTweet with the data it gets
rtdb.onChildAdded(TweetDBR, (ss)=>{
  let tempTweet = ss.val();
  renderTweets(tempTweet, ss.key);
  AddClickEventListener(tempTweet, ss.key);
});

//this gets the data from the form and adds the tweet into the Tweets JSON 
document.getElementById("FormSubmit").addEventListener("click", function(event){
  let tempTitle = document.getElementById("NewTitle").value;
  let tempHandle = document.getElementById("UserHandle").value;
  let tempAuthorPicture = document.getElementById("Author.picture").value;
  let tempContent = document.getElementById("Content").value;
  let newKey = rtdb.push(rtdb.child(rtdb.ref(db),'posts')).key;

  //this creates a noew json object with all of the information for the new tweets
  let newTweet = {
    Author: {
      handle: tempHandle,
      picture: tempAuthorPicture
    },
    content: tempContent,
    title: tempTitle,
    like: 0
  };

  //this is the dynamic way of defining the json object defined below
  let NewJSONTweet= {};
  NewJSONTweet[newKey] = newTweet;
  rtdb.update(TweetDBR, NewJSONTweet);
});

/* document.getElementById("testing").addEventListener("click", function (event){
  alert (document.getElementById("testing").innerHTML);
}); */

//this reads from the database
/* rtdb.onValue(TweetDBR, ss=>{
  document.getElementById("").innerHTML = ss.val();
}); */

//this updates the database based on the input from the users
/* document.getElementById("").addEventListener("keyup", function(event){
  let UpdatedTitle = document.getElementById("intro").value;
  rtdb.set(TweetDBR, UpdatedTitle);
}); */