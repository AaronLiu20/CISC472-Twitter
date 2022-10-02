  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
  import * as rtdb from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";

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
  const ArchieveDBR  = rtdb.ref(db, "/Archieved");
  const UserDBR = rtdb.ref(db, "/Users");

  //this is a helper function that does wraps the object into a new object and saves it into the database 
  let UpdateData = (originalTweet, id) => {
    let tempTweet = {};
    tempTweet[id] = originalTweet;
    rtdb.update(TweetDBR, tempTweet);
  }

//this this appends the tweet on the left side and creates the html with the proper information
let renderTweets = (tweetObject, TweetID, placement)=>{
  document.getElementById(placement).insertAdjacentHTML("beforeend",(`
      <div id = "insertTweets"> </div>
      <!-- start of the tweetcard -->
      <div class = "tweetcard" id = "${TweetID}">
        <div class="row g-0">
          <div class="col-md-4">
            <img src=${tweetObject.Author.picture} class="img-fluid rounded-start" alt="...">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <p class="card-text"><small class="text-muted" id = "Handle-${TweetID}" >${tweetObject.Author.handle}</small></p>
              <p class="card-text" id  = "Content-${TweetID}">${tweetObject.content}</p>
              <p class="card-text"><small class="text-muted" id = "timestamp-${TweetID}" >${new Date(tweetObject.timestamp).toLocaleString()}</small></p>
              <div class = "btn-group">
                <button class = "Likes" id = "Likes-${TweetID}"><small>likes: ${tweetObject.like}</small></button>
                <button class = "Delete" id = "delete-${TweetID}"><small>Delete</small></button>
                <button class = "Edit" id = "Edits-${TweetID}"><small>edit</small></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `));
};

//this updates the like field and updates it on the html
let LikeListener = (originalTweet, id)=>{
  document.getElementById(`Likes-${id}`).addEventListener("click", function(event){
    originalTweet.like += 1; 
    UpdateData(originalTweet, id);
    document.getElementById(`Likes-${id}`).innerHTML = `<small>likes: ${originalTweet.like}</small>`;
  });
}

//toggles the deleted field to true or false and removes it from the page if it is deleted
let Deletelistener = (originalTweet, id) =>{
  document.getElementById(`delete-${id}`).addEventListener("click", function(event){
    let idividualTweet = rtdb.ref(db, `Tweets/${id}`);
    let reference = document.getElementById(id);
    reference.removeEventListener("click", LikeListener);
    reference.removeEventListener("click", Deletelistener);
    reference.removeEventListener("click", EditListener);
    rtdb.push(ArchieveDBR, originalTweet);
    rtdb.remove(idividualTweet);
  });
}

function SubmitTweets(id){
  let tempHandle = document.getElementById("UserHandle").value;
  let tempAuthorPicture = document.getElementById("Author.picture").value;
  let tempContent = document.getElementById("Content").value;
  let newKey = id;
  if(id == 0){ newKey = rtdb.push(TweetDBR,'posts').key;}
  let TweetTimeStamp = new Date().getTime();

  //this creates a new json object with all of the information for the new tweets
  let newTweet = {
    Author: {
      handle: tempHandle,
      picture: tempAuthorPicture
    },
    content: tempContent,
    like: 0,
    timestamp: TweetTimeStamp,
  };
  UpdateData(newTweet, newKey);
}

let EditListener = (originalTweet, id) =>{
  document.getElementById(`Edits-${id}`).addEventListener("click", function(event){
    document.getElementById("UserHandle").value = originalTweet.Author.handle;
    document.getElementById("Author.picture").value = originalTweet.Author.picture;
    document.getElementById("Content").value = originalTweet.content;
    document.getElementById("FormSubmit").onclick = function(){SubmitTweets(id);};
  });
}

//reads the databse for tweets and fires the renderTweet with the data it gets*/
rtdb.onChildAdded(TweetDBR, (ss) =>{
  let tempTweet = ss.val();
  renderTweets(tempTweet, ss.key, "insertTweets");
  LikeListener(tempTweet, ss.key);
  Deletelistener(tempTweet, ss.key);
  EditListener(tempTweet, ss.key);
});

document.getElementById("Writing-Tweets").addEventListener("click", function(event){
  document.getElementById("insert-form").innerHTML = "";
  document.getElementById("insert-form").insertAdjacentHTML("beforeend", (`
  <form id = "tweetForm">
    <label>Author:</label><br>
    <input type = "text" id = "UserHandle" placeholder = "Author.handle"></input><br>
    <label>Picture</label><br>
    <input type = " text" id = "Author.picture" placeholder = "Author.picture" value = "https://www.svg.com/img/gallery/the-scariest-games-markiplier-has-ever-played/intro-1659295045.jpg"></input><br>
    <label>Content:</label><br>
    <textarea type = "text" id = "Content" placeholder = "Content" rows = "4" cols = "50%"></textarea><br>
    <label> Tweet: </label>
    <button id = "FormSubmit">Submit</button>
  </form>`));
});

//this gets the data from the form and adds the tweet into the Tweets JSON 
document.getElementById("FormSubmit").addEventListener("click", function(event){
  SubmitTweets(0);
});