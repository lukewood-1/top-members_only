const db = require('../models/queries');

async function indexGet(req, res){
  const feed = await db.getAllPosts();
  console.log('user: ', req.user);

  res.render('index', {
    user: req.user,
    feed
  })
};

async function signUpGet(req, res){
  res.render('sign-up')
}

async function logInGet(req, res){
  res.render('log-in')
}

async function loggedInGet(req, res){
  const feed = await db.getAllPosts();

  res.render('index', {
    user: req.user,
    feed
  })
}

const settingsGet = async (req, res) => {
  res.render('settings', {
    user: req.user
  });
}

const indexController = {
  indexGet,
  signUpGet,
  logInGet,
  loggedInGet,
  settingsGet
}

module.exports = indexController