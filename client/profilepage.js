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

$('#user-name').text('(loading...)');
firebase.auth().onAuthStateChanged(renderUser);

function renderUser(user) {
  if (user) {
    // User is signed in.
    const { uid, displayName, email } = user;
    $('#user-name').text(displayName + ' (' + email + ')');
  }
  else {
    $('#user-name').text('<anonymous>');
  }
}

// ################################################################################################
// Additional user data
// ################################################################################################


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




// ################################################################################################
// Recipe Debugging
// ################################################################################################

// maintain the "all recipes" list
// see basic example in official documentation: https://firebase.google.com/docs/firestore/query-data/get-data
const $recipeList = $('#debug-recipe-list');
$recipeList.text('loading...');
firebase.firestore().collection("recipes").onSnapshot(function (querySnapshot) {
  $recipeList.empty(); // clear list

  // set count
  $('#debug-recipes-count').text(querySnapshot.size);

  // add all recipes
  querySnapshot.forEach(function (doc) {
    const id = doc.id;
    const recipe = doc.data();
    const $recipeEl = $(`<li id="recipe-${id}">${recipe.title}</li>`);
    $recipeList.append($recipeEl);
  });
});


async function debugShowRandomRecipes(n) {
  const recipeColl = firebase.firestore().collection("recipes");

  $('#debug-random-recipes').text('loading...');

  // get recipe ids
  const ids = await getRandomRecipeIds(n);

  // get all recipe data of given ids
  const recipes = await Promise.all(ids.map(async id => {
    const snap = await recipeColl.where(firebase.firestore.FieldPath.documentId(), '==', id).get();
    if (snap.docs.length) {
      return snap.docs[0].data();
    }
    return null;    // id does not exist (anymore)
  }));

  $('#debug-random-recipes').text(recipes.map(r => r && r.title || '<not found>').join('\n'));
}