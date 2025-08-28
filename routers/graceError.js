const graceError = (err, req, res, next) => {
  console.error(err);
  // res.send('An error occurred, and this is a placeholder for a better error handling endpoint')
  res.send(err);
}

module.exports = graceError