const mainCtrl = require('../controllers/mainController');
const { isAuth } = require('../models/passportUtils');
const { Router } = require('express');

const feedRouter = Router();

feedRouter.post('/search/title', isAuth, mainCtrl.searchByTitle);
feedRouter.post('/search/date', isAuth, mainCtrl.searchByPostDate);
feedRouter.post('/search/author', isAuth, mainCtrl.searchByAuthor)
feedRouter.post('/create', isAuth, mainCtrl.makePost);
feedRouter.post('/delete', isAuth, mainCtrl.deletePost);

module.exports = feedRouter