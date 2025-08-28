const db = require('../models/queries');

async function fetchFeed(req, res){
  try {
    const { rows } = await db.getAllPosts();
    return rows
  } catch (err) {
    console.error(err);
  }
}

async function makePost(req, res){
  const { username, title, content } = req.body;
  const { id } = req.user;

  await db.createPost(id, title, content);

  res.redirect('/dashboard');
}

async function deletePost(req, res){
  const { id } = req.body;
  console.log('id on controller:', req.body);
  try {
    await db.deletePost(id);

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
  }
}

async function searchByAuthor(req, res){
  const { author_id } = req.body;

  try {
    const feed = await db.queryByAuthor(author_id);
    res.render('searchResult', {
      title: `Search by author (${author_id})`,
      user: req.user,
      feed
    })
  } catch (err) {
    console.error(err);
  }
}

async function searchByTitle(req, res){
  const { title } = req.body;

  try {
    const feed = await db.queryByPostTitle(title);
    res.render('searchResult', {
      title: `Search by title (${title})`,
      user: req.user,
      feed
    })
  } catch (err) {
    console.error(err);
  }
}

async function searchByPostDate(req, res){
  const { date, precision } = req.body;

  try {
    const feed = await db.queryByPostDate(precision, date);
    res.render('searchResult', {
      title: `Search by date (${date})`,
      user: req.user,
      feed
    })
  } catch(err) {
    console.error(err);
  }
}


const mainCtrl = {
  makePost,
  fetchFeed,
  deletePost,
  searchByAuthor,
  searchByTitle,
  searchByPostDate
}

module.exports = mainCtrl 