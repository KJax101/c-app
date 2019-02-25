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

async function renderUser(user) {
  if (user) {
    // User is signed in.
    const { uid, displayName, email } = user;
    $('#user-name').text(displayName + ' (' + email + ')');

    const snap = await firebase.firestore().collection('users').where(firebase.firestore.FieldPath.documentId(), '==', uid).get();
    if (!snap.docs.length) {
      alert('something went wrong. this user has no entry in `users` collection!');
    }
    
    showUserRecipes(snap.docs[0].data());
  }
  else {
    $('#user-name').text('<anonymous>');
  }
}

// ################################################################################################
// Additional user data
// ################################################################################################


async function showUserRecipes(user) {
  const recipeIds = user.recipes;
  if (recipeIds) {
    const recipes = await getRecipesById(recipeIds);
    if (recipes) {
      $('#user-recipes-count').text(recipes.length);
      const $list = $('#user-recipes');
      $list.empty();     // clear list
      recipes.forEach(recipe => {
        const $li = $(`<li>${recipe.title}</li>`);
        $list.append($li);
      });
    }
  }
}
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
  $('#debug-random-recipes').text('loading...');

  // get recipe ids
  const ids = await getRandomRecipeIds(n);
  const recipes = await getRecipesById(ids);
  $('#debug-random-recipes').text(recipes.map(r => r && r.title || '<not found>').join('\n'));
}