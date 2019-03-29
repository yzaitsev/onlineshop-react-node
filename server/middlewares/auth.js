const { User } = require('../models/user');

const auth = (req, res, next) => {
  const token = req.cookies.w_auth;
  
  User.findByToken(token, (err, userDoc) => {
    if (err) throw err;
    if (!userDoc) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = userDoc;
    next();
  });
};


module.exports = { auth };