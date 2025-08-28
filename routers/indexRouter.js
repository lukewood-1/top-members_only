const indexController = require("../controllers/indexController");
const {getUser, isAuth} = require('../models/passportUtils');
const { Router } = require("express");

const indexRouter = Router();

indexRouter.get('/settings', [isAuth, indexController.settingsGet]);
indexRouter.get('/dashboard', [isAuth, indexController.loggedInGet])
indexRouter.get('/', indexController.indexGet);

module.exports = indexRouter