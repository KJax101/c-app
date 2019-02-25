const config = {
      apiKey: "AIzaSyA1W6fgbxENa7AbChzrZuKVRFSiQwBauLg",
      authDomain: "cproject-9bb5f.firebaseapp.com",
      databaseURL: "https://cproject-9bb5f.firebaseio.com",
      projectId: "cproject-9bb5f",
      storageBucket: "cproject-9bb5f.appspot.com",
      messagingSenderId: "926906729227"
  }
  firebase.initializeApp(config);

var btnSignup = document.getElementById('btnSignup');
var txtEmail = document.getElementById('txtEmail');
var txtPassword = document.getElementById('txtPassword');

// Registration-btnSignup
btnSignup.addEventListener('click', function(e){
    var email = txtEmail.value;
    var password = txtPassword.value;
    var auth = firebase.auth();
    const fName = document.getElementById('fname').value;
    const lName = document.getElementById('lname').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    //const fs = new firebase.firestore.Firestore;
    console.log("fName:", fName);
    console.log("lName:", lName);
    console.log("phoneNumber:", phoneNumber);
    auth.createUserWithEmailAndPassword(email, password).then(async (user) => {
      localStorage.setItem("currentUserUID", JSON.stringify({uid: user.user.uid})); 

      // get 4 random recipes
      const randomRecipeIds = await getRandomRecipeIds(4);

      firebase.firestore().collection("users").add({
        "email": email || "",
        "firstname": fName || "",
        "lastname": lName || "",
        "phone": phoneNumber || "",
        "userUID": user.user.uid,
        recipes: randomRecipeIds
      }).then(() => {
        console.log("User saved");
        window.location.href = '/client/profilepage.html';
      }).catch(console.error);
      console.log("user:", user);
    }).catch(console.error);
});

// Login
var btnLogin = document.getElementById('btnLogin');
var txtLoginEmail = document.getElementById('txtLoginEmail');
var txtLoginPassword = document.getElementById('txtLoginPassword');

btnLogin.addEventListener('click', function(e){
  var email = txtLoginEmail.value;
  var password = txtLoginPassword.value;
  var auth = firebase.auth();
  auth.signInWithEmailAndPassword(email, password)
  .then(user => {
    localStorage.setItem("currentUserUID", JSON.stringify({uid: user.user.uid})); 
    window.location.href = '/client/profilepage.html';
  })
  .catch(function(){
    alert('Wrong Email or Password');
  });
})

var btnLogin2 = document.getElementById('btnLogin2');
var txtLoginEmail2 = document.getElementById('txtLoginEmail2');
var txtLoginPassword2 = document.getElementById('txtLoginPassword2');

btnLogin2.addEventListener('click', function(e){
  var email = txtLoginEmail2.value;
  var password = txtLoginPassword2.value;
  var auth = firebase.auth();
  auth.signInWithEmailAndPassword(email, password)
  .then(user => {
    localStorage.setItem("currentUserUID", JSON.stringify({uid: user.user.uid})); 
    window.location.href = '/client/profilepage.html';
  })
  .catch(function(){
    alert('Wrong Email or Password');
  });
})

var btnForgotPassword = document.getElementById('btnForgotPassword');
btnForgotPassword.addEventListener('click', function(e){
  var auth = firebase.auth();
  auth.sendPasswordResetEmail();
})

$('.join').on('click', function(event) {
  console.log('clicked')
  event.preventDefault();

  window.scrollTo(0, $('#register').offset().top - 70);

  return false;
});

// API Call
// $("button").click(function(){
//   $.ajax({url: "https://jobs.github.com/positions.json?description=python&location=new+york", 
//   type:"GET", 
//   contentType: "application/x-www-form-urlencoded",
//   success: function(result){
//     $("#jobdataTest").html(result);
//   }});
// });


// Opens curtains
$('.learn-more').on('click', function(event) {
  // Add class to open the curtain with CSS
  $('.curtain footer').fadeOut(function() {
    $('body').addClass('loaded');
    
    // Removes the curtain after 1 second
    setTimeout(function() {
      $('.curtain').remove();
    }, 1000);
  });
});

