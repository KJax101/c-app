// ################################################################################################
// Setup + Configuration
// ################################################################################################

const config = {
  apiKey: "AIzaSyA1W6fgbxENa7AbChzrZuKVRFSiQwBauLg",
  authDomain: "cproject-9bb5f.firebaseapp.com",
  databaseURL: "https://cproject-9bb5f.firebaseio.com",
  projectId: "cproject-9bb5f",
  storageBucket: "cproject-9bb5f.appspot.com",
  messagingSenderId: "926906729227"
}
firebase.initializeApp(config);

// ################################################################################################
// Auth + basic user setup
// ################################################################################################

firebase.auth().onAuthStateChanged(renderUser);

// ################################################################################################
// Additional user data
// ################################################################################################

function renderUser(user) {
  if (user) {
    // User is signed in.
    const { uid, displayName, email } = user;
    $('#user-name').text(displayName + ' (' + email + ')');

    //   firebase.firestore().doc("users/id").get().then(user => {
    //     if (!user.exists) {
    //       return;
    //     }
    //     const userData = user.data();
    //   })

    //   firebase.firestore().collection("users").limit(4).get().then(users => {
    //     if (!users.empty) {
    //       const userData = users.docs[0].data();

    //       console.log("Got user:", userData);
    //       const userDataDiv = document.getElementById('userData');
    //       userDataDiv.innerHTML = JSON.stringify(userData.email);
    //     }
    //   }).catch(err => {
    //     console.error(err);
    //   });
    // } else {
    //   console.error("No user found");
    //   // User is signed out.
    //   // ...
  }
}



// ################################################################################################
// Recipe Debugging
// ################################################################################################

// "Add recipes" button
$('#debug-btn-add-recipes').click(async (evt) => {
  const n = 100;

  // add 100 recipes
  const promises = [];
  for (let i = 0; i < n; ++i) {
    firebase.firestore().collection("recipes").add({
      title: 'recipe-' + i
    });
  }

  const results = await Promise.all(promises);  // wait until all recipes have been added  
  console.log('added ' + n + ' recipes.');
});


// "all recipes" list
// see basic example in official documentation: https://firebase.google.com/docs/firestore/query-data/get-data
const $recipeList = $('#debug-recipe-list');
$recipeList.text('loading...');
firebase.firestore().collection("recipes").get().then(function(querySnapshot) {
  $recipeList.empty(); // clear list

  // add all recipes
  querySnapshot.forEach(function(doc) {
      const id = doc.id;
      const recipe = doc.data();
      const $recipeEl = $(`<li id="recipe-${id}">${recipe.title}</li>`);
      $recipeList.append($recipeEl);
  });
});

