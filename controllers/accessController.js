const { body, validationResult } = require("express-validator");
const db = require("../models/queries");
const bcrypt = require('bcrypt');

// Error messages for the validation chains
const alphaNumErr = field => `${field} must contain only letters and numbers`;
const alphaErr = field => `${field} must contain only letters`;
const lengthErr = (field, min, max) => `${field} must be between ${min} and ${max} characters long`;

// custom validators
const hasLowercase =  value => {
  if(!/[a-z]/.test(value)) {
    throw new Error('password must contain at least one lowercase letter.');
  }
  return true
};
const hasUppercase =  value => {
  if(!/[A-Z]/.test(value)) {
    throw new Error('password must have at least one uppercase letter');
  }
  return true
};
const hasNumber =  value => {
  if(!/[0-9]/.test(value)){
    throw new Error('password must have at least one number');
  }
  return true
};
const doPasswordsMatch = (value, {req}) => {
  if(value !== req.body.confirmPassword){
    throw new Error('the passwords do not match')
  };

  return true
}

const validate = [
  body('firstName').trim()
  .isAlpha().withMessage(alphaErr('first name')),
  body('lastName').trim()
  .isAlpha().withMessage(alphaErr('last name')),
  body('username').trim()
  .notEmpty()
  .isAlphanumeric().withMessage(alphaNumErr('username'))
  .isLength({min: 5, max: 20}).withMessage(lengthErr('username', 5, 20)),
  body('password').trim()
  .notEmpty()
  .isAlphanumeric().withMessage(alphaNumErr('password'))
  .isLength({min: 8, max: 15}).withMessage(lengthErr('password', 8, 15))
  .custom(hasLowercase)
  .custom(hasUppercase)
  .custom(hasNumber),
  body('confirmPassword')
  .custom(doPasswordsMatch)
]

const signUpPost = [
  validate, 
  async (req, res) => {
    const { firstName, lastName, nickname, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        res.render('sign-up', {errors: errors.array()});
        return 
      };
      await db.createUser(firstName, lastName, nickname, username, hashedPassword);

      res.redirect('/access/log-in');
    } catch (e) {
      console.error(e);
      next(new Error(e))
    }
  }
]

async function logOutGet(req, res, next){
  req.logout( err => {
    if(err){
      return next(err)
    }

    res.redirect('/');
  })
}

// GET calls

const signUpGet = async (req, res) => {
  res.render('sign-up');
};

const logInGet = async (req, res) => {
  res.render('log-in');
}

async function switchIsMember(req, res){
  const { id } = req.body;

  try {
    await db.switchIsMember(id)

    res.redirect('/settings');
  } catch (err) {
    console.error(err)
  }
}

async function switchIsAdmin(req, res){
  const { id } = req.body;

  try {
    await db.switchIsAdmin(id);

    res.redirect('/settings')
  } catch (err) {
    console.error(err);
  }
}

async function toSwitchPage_member(req, res){
  const salt = (await bcrypt.genSalt(10)).slice(2, 12);

  res.render('acc_status_change', {
    passcode: salt,
    user: req.user,
    acc_status: 'member'
  })
};

async function toSwitchPage_admin(req, res){
  const salt = (await bcrypt.genSalt(10)).slice(2,12);

  res.render('acc_status_change', {
    passcode: salt,
    user: req.user,
    acc_status: 'admin',
    errors: []
  })
}

const updateAccSettings = [validate, async function (req, res){
  const { id, firstName, lastName, handle, username, password, confirm_password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const customErrors = [];
  const genError = field => {
    return {msg: `the ${field} you typed in is taken already`};
  };

  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.render('settings', {
        errors: errors.array(),
        user: req.user,
      });
      return;
    };

    const checkHandle = await db.verifyDuplicate_handle('@'+handle);
    const checkUsername = await db.verifyDuplicate_username(username);
    const checkPassword = await db.verifyDuplicate_password(hashedPassword);

    if(checkHandle.length > 0){
      customErrors.push(genError('handle'));
    }
    if(checkUsername.length > 0){
      customErrors.push(genError('username'));
    }
    if(checkPassword.length > 0){
      customErrors.push(genError('password'));
    }
    
    if(customErrors.length > 0){
      res.render('settings', {
        user: req.user,
        errors: customErrors
      });
      return;
    }

    await db.updateUser(id, firstName, lastName, handle, username, hashedPassword);

    res.redirect('/settings');
  } catch (err) {
    console.error(err);
  }
}]

const accessCtrl = {
  signUpPost,
  signUpGet,
  logInGet,
  logOutGet,
  switchIsMember,
  switchIsAdmin,
  toSwitchPage_member,
  toSwitchPage_admin,
  updateAccSettings
}

module.exports = accessCtrl