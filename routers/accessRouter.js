const accessCtrl = require('../controllers/accessController');
const { Router } = require("express");
const passport = require('passport');

const accessRouter = Router();

accessRouter.post('/account/update', accessCtrl.updateAccSettings);
accessRouter.get('/account/become-admin', accessCtrl.toSwitchPage_admin);
accessRouter.get('/account/become-member', accessCtrl.toSwitchPage_member);
accessRouter.post('/account/is_admin', accessCtrl.switchIsAdmin);
accessRouter.post('/account/is_member', accessCtrl.switchIsMember);
accessRouter.post('/log-in', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/access/log-in',
}));
accessRouter.post('/sign-up', accessCtrl.signUpPost);
accessRouter.get('/log-out', accessCtrl.logOutGet);
accessRouter.get('/sign-up', accessCtrl.signUpGet);
accessRouter.get('/log-in', accessCtrl.logInGet);

module.exports = accessRouter