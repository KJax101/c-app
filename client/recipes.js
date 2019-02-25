/** 
 * Recipe management code
 */


/**
 * Get the given number of random recipes.
 * @param {*} n 
 */
async function getRandomRecipes(n) {
  const recipesSnapshot = await firebase.firestore().collection("recipes").get();

  // associate recipes with user
  recipesSnapshot.forEach(function (doc) {
    // TODO: not done yet!
  });
}

async function getHighestRecipeIndex() {
  const snapshot = await firebase.firestore().collection("recipes").orderBy("index", 'desc').limit(1).get();

  if (snapshot.docs.length) {
    return snapshot.docs[0].data().index || 0;
  }
  return 0; // no recipe yet
}

async function debugAddRecipes(n) {
  // get currently highest index (and keep adding to that index)
  let lastIndex = await getHighestRecipeIndex();

  // add recipes
  const promises = [];
  
  for (let i = 0; i < n; ++i) {
    const index = ++lastIndex;
    promises.push(firebase.firestore().collection("recipes").add({
      title: 'recipe-' + index,
      index
    }));
  }

  // wait until all recipes have been added  
  const results = await Promise.all(promises);
  console.log('added ' + n + ' recipes.');
  return results;
}

// WARNING: Dangerous! Just deletes all recipes! Also is ATOMIC, and might thus result in problems when used in production.
// see docs: https://firebase.google.com/docs/firestore/manage-data/delete-data
async function debugDeleteAllRecipes() {
  $('#debug-recipe-status').text('Deleting (can take a while)...');
  const recipesSnapshot = await firebase.firestore().collection("recipes").get();

  const promises = [];
  recipesSnapshot.forEach(function (doc) {
    promises.push(doc.ref.delete());
  });

  await Promise.all(promises); // wait for all promises to finish
  $('#debug-recipe-status').text('Deleted all recipes!');
}