module.exports = (req, res, next) => {
  if (!req.user){
    return res.status(401).send({
      error: 'you must log in!'
    });
  }

  //continue if user is logged in
  next();
};