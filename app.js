const path = require('path');
const express = require('express');
const indexRouter = require('./routers/indexRouter');
const graceError = require('./routers/graceError');
const accessRouter = require('./routers/accessRouter');
const feedRouter = require('./routers/feedRouter');
const {setUpAuth, serialize, deserialize, getUser} = require('./models/passportUtils');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
setUpAuth(app);

app.use('/feed', feedRouter);
app.use('/access', accessRouter);
app.use('/', indexRouter);
app.use(graceError);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log('Listening on port ', PORT);
});