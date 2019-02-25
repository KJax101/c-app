console.log("Profile is working");

console.log("firebase:", firebase.firestore)

const config = {
  apiKey: "AIzaSyA1W6fgbxENa7AbChzrZuKVRFSiQwBauLg",
  authDomain: "cproject-9bb5f.firebaseapp.com",
  databaseURL: "https://cproject-9bb5f.firebaseio.com",
  projectId: "cproject-9bb5f",
  storageBucket: "cproject-9bb5f.appspot.com",
  messagingSenderId: "926906729227"
}
firebase.initializeApp(config);

//firebase.auth().onAuthStateChanged(function(user) {
  const uidObj = JSON.parse(localStorage.getItem("currentUserUID"));
  if (uidObj.uid) {
    // User is signed in.
    console.log("User is logged in with uid:", uidObj);
    firebase.firestore().doc("users/id").get().then(user => {
      if(!user.exists) {
        return;
      }
      const userData = user.data();
    })

    firebase.firestore().collection("users").limit(4).get().then(users => {
      if (!users.empty) {
        const userData = users.docs[0].data();

        console.log("Got user:", userData);
        const userDataDiv = document.getElementById('userData');
        userDataDiv.innerHTML = JSON.stringify(userData.email);
      }
    }).catch(err => {
      console.error(err);
    });
  } else {
    console.error("No user found");
    // User is signed out.
    // ...
  }
//});
