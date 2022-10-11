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
firebase.initializeApp(firebaseConfig);
const TweetDBR = firebase.database().ref("/Tweets");
const ArchieveDBR  = firebase.database().ref("/Archieved");
const UserDBR = firebase.database().ref("/Users");
let provider = new firebase.auth.GoogleAuthProvider();

  //this is a helper function that does wraps the object into a new object and saves it into the database 
let UpdateData = (placement, id, content) => {
  firebase.database().ref(placement).child(id).update(content).catch((error) => {alert(error);});;
}

//this gets the form data and formats into a tweet that will be saved within the database
function SubmitHelper(id, CreatingNew, userUID, tempContent){
  let newKey = id;
  if(CreatingNew){
    newKey = firebase.database().ref(TweetDBR).push('posts').key;
    let temp = {content: tempContent}
    firebase.database().ref(UserDBR).child(userUID).child("TweetID").child(newKey).update(temp);
  }
  let TweetTimeStamp = new Date().getTime();
  let newTweet = {
    uid: userUID,
    content: tempContent,
    like: 0,
    timestamp: TweetTimeStamp,
  };
  UpdateData(TweetDBR, newKey, newTweet);
}

  //this is the helper function that appends the form to edit/create a new tweet and attaches the sumbit function to the submit button
  let insertForm = (id, creating, userUID) => {
    document.getElementById("insert-form").innerHTML = "";
    document.getElementById("insert-form").insertAdjacentHTML("beforeend", (`
    <form id = "Creating-Tweet">
      <label>Content:</label><br>
      <textarea type = "text" id = "Content" placeholder = "Content" rows = "4" cols = "50%" required ></textarea><br>
      <label> Tweet: </label>
      <input type = "submit"></input>
    </form>`));
    document.getElementById("Creating-Tweet").onsubmit = function(){SubmitTweets(id, creating, userUID);};
  }

//this this appends the tweet on the left side and creates the html with the proper information
let renderTweets = (tweetObject, TweetID, userObj, placement, sameUser)=>{
  document.getElementById(placement).insertAdjacentHTML("beforeend",(`
      <div id = "insertTweets"> </div>
      <!-- start of the tweetcard -->
      <div class = "tweetcard" id = "${TweetID}">
        <div class="row g-0">
          <div class="col-md-4">
            <img src=${userObj.picture} class="img-fluid rounded-start" alt="...">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <p class="card-text"><small class="text-muted" id = "Handle-${TweetID}" >${userObj.username}</small></p>
              <p class="card-text" id  = "Content-${TweetID}">${tweetObject.content}</p>
              <p class="card-text"><small class="text-muted" id = "timestamp-${TweetID}" >${new Date(tweetObject.timestamp).toLocaleString()}</small></p>
              <div class = "btn-group">
                <button class = "Button" id = "Likes-${TweetID}"><small>likes: ${tweetObject.like}</small></button>
                ${sameUser ? `<button class = "Button" id = "delete-${TweetID}"><small>Delete</small></button>
                <button class = "Button" id = "Edits-${TweetID}"><small>edit</small></button>`: `<button class = "Button" id = "Retweet-${TweetID}"><small>Retweet</small></button>`}
              </div>
            </div>
          </div>
        </div>
      </div>
    `));
};

//this updates the like field and updates it on the html
let LikeListener = (originalTweet, tweetId, userUID)=>{
  document.getElementById(`Likes-${tweetId}`).addEventListener("click", function(event){
    firebase.database().ref(UserDBR).child(userUID).child("Like").once("value").then( function(ss){
      //this the dislike functionality
      if(ss.child(tweetId).exists()){
        firebase.database().ref(UserDBR).child(userUID).child("Like").child(tweetId).remove();
        originalTweet.like -= 1;
      }
      //this is the like functionaility
      else{
        let temp = {CreatorUID: originalTweet.uid};
        firebase.database().ref(UserDBR).child(userUID).child("Like").child(tweetId).update(temp);
        originalTweet.like += 1; 
      }
      UpdateData(TweetDBR, tweetId, originalTweet);
      document.getElementById(`Likes-${tweetId}`).innerHTML = `<small>likes: ${originalTweet.like}</small>`;
    }).catch((error) => {alert(error);});
  });
}

//toggles the deleted field to true or false and removes it from the page if it is deleted
let Deletelistener = (originalTweet, id, userUID) =>{
  document.getElementById(`delete-${id}`).addEventListener("click", function(event){
    let reference = document.getElementById(id);
    reference.removeEventListener("click", LikeListener);
    reference.removeEventListener("click", Deletelistener);
    reference.removeEventListener("click", EditListener);
    firebase.database().ref(UserDBR).child(userUID).child("TweetID").child(id).remove();
    firebase.database().ref(ArchieveDBR).push(originalTweet);
    firebase.database().ref(TweetDBR).child(id).remove();
    reference.remove();
  });
}

function SubmitTweets(id, creatingNew, userUID){
  let tempContent = document.getElementById("Content").value;
  SubmitHelper(id, creatingNew, userUID, tempContent);
}

let retweetListener = (tempTweet, tweetID, userUID) => {
  document.getElementById(`Retweet-${tweetID}`).addEventListener("click" , function(event){
    let tempContent = tempTweet.content;
    SubmitHelper(0, true, userUID, tempContent);
  });
}

//this injects the id into the submit function and updates the information inside of the ID
let EditListener = (originalTweet, id, userUID ) =>{
  document.getElementById(`Edits-${id}`).onclick = function(event){
    event.preventDefault();
    insertForm(id, false, userUID);
    document.getElementById("Content").value = originalTweet.content;
  };
}

let twitterLogin = () => {
  document.getElementById("insert-form").innerHTML = "";
  document.getElementById("insert-form").insertAdjacentHTML("beforeend", (`
    <form id = "loginForm">
      <label>Author:</label><br>
      <input type = "text" id = "newHandle" placeholder = "Author.handle" required></input><br>
      <label>Picture</label><br>
      <input type = " text" id = "newPicture" placeholder = "Author.picture" value = "https://www.svg.com/img/gallery/the-scariest-games-markiplier-has-ever-played/intro-1659295045.jpg" required ></input><br>
      <label> Account: </label>
      <input type = "submit"></input>
    </form>`));
  document.getElementById("loginForm").onsubmit = (e) => {
    e.preventDefault();
    firebase.auth().signInWithPopup(provider).then((result) => {
      firebase.database().ref( UserDBR).once("value").then( (ss) => {
        if(!ss.child(result.user.uid).exists()){
          let newHandle = document.getElementById("newHandle").value;
          let newPicture = document.getElementById("newPicture").value;
          let newUser = {
            username: newHandle,
            picture: newPicture,
            email: result.user.email
          };         
          UpdateData(UserDBR, result.user.uid, newUser);
        }
      });

    }).catch((error) => {alert(error);});
  };
}

//this is the start of the whole program since almost everything is now attached to a uid
firebase.auth().onAuthStateChanged(user=>{
  let loginReference = document.getElementById("login");
  if(user){
    //this reads and shows all of the teeks that are current stored
    TweetDBR.on("child_added" , (ss) =>{
      let tempTweet = ss.val();
      firebase.database().ref(UserDBR).child(tempTweet.uid).get().then( (TweetUserObj) =>{
        let sameUser = (tempTweet.uid === user.uid);
        if(sameUser){
          renderTweets(tempTweet, ss.key, TweetUserObj.val(), "YourTweets", sameUser);
          Deletelistener(tempTweet, ss.key, user.uid);
          EditListener(tempTweet, ss.key, user.uid);
        }
        else{
          renderTweets(tempTweet, ss.key, TweetUserObj.val(), "insertTweets", sameUser);
          retweetListener(tempTweet, ss.key, user.uid);
        }
        LikeListener(tempTweet, ss.key, user.uid);
      });
    });

    //this addes the form to after logged in
    document.getElementById("Writing-Tweets").innerHTML = "Create Tweet";
    document.getElementById("Writing-Tweets").onclick = function(event){
      event.preventDefault();
      insertForm(0, true, user.uid);
    }

    loginReference.innerHTML = "Sign Out";
    loginReference.onclick = function(){
      document.getElementById("insertTweets").innerHTML = ``;
      document.getElementById("YourTweets").innerHTML = ``;
      document.getElementById("insert-form").innerHTML = ``;
      firebase.auth().signOut();
    };
  }
  else{
    document.getElementById("Writing-Tweets").innerHTML = "Log in";
    //this prevents the create tweet button from adding the form and alert the user to login
    document.getElementById("Writing-Tweets").onclick = function(event){
      event.preventDefault();
      firebase.auth().signInWithPopup(provider).then((result) => {
        firebase.database().ref(UserDBR).once("value").then( (ss) => {
          if(!ss.child(result.user.uid).exists()){
              alert("This account does not exist");
              firebase.auth().signOut();
            }
           });
      
        }).catch((error) => {alert(error);});
    }
    loginReference.innerHTML = "Sign in";
    loginReference.onclick = function(event){
      twitterLogin();
    };
  }
});