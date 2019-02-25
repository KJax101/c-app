/** 
 * Recipe management code.
 * TODO: This code ideally should not contain any jquery ($) or other UI-interactions.
 */

/**
 * Utility function to generate a random int in given range
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/**
 * Get the given number of random recipes.
 * @param {*} n 
 */
async function getRandomRecipeIds(n) {
  const maxIndex = await getHighestRecipeIndex();

  // don't try to get more than "maxIndex" recipes (no point in that anyway)
  n = Math.min(n, maxIndex);

  // let's try to get some of those random recipes!
  // TODO: This is very slow, but can be sped up quite a bit :)
  const ids = [];
  for (let i = 0; i < 3 * n; ++i) { // try at most 3 * n times
    const rand = getRandomInt(0, maxIndex);
    const snap = await firebase.firestore().collection("recipes").where('index', '>=', rand).limit(1).get();

    if (snap.docs.length) {
      const { id } = snap.docs[0];
      ids.push(id);
      if (ids.length >= n) {
        // we found enough!
        break;
      }
    }
  }
  return ids;
}

async function getRecipesById(ids) {
  const recipeColl = firebase.firestore().collection("recipes");

  // get all recipe data of given ids
  return await Promise.all(ids.map(async id => {
    const snap = await recipeColl.where(firebase.firestore.FieldPath.documentId(), '==', id).get();
    if (snap.docs.length) {
      return snap.docs[0].data();
    }
    return null;    // id does not exist (anymore)
  }));
}

async function getHighestRecipeIndex() {
  const snap = await firebase.firestore().collection("recipes").orderBy("index", 'desc').limit(1).get();

  if (snap.docs.length) {
    return snap.docs[0].data().index || 0;
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