let jwt = require('jsonwebtoken');

// this just contains the secret key
const config = require('./config.js');

// following the standard express middleware procedure
let checkToken = (req, res, next) => {
  // express headers are converted to lowercase...
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (token.startsWith('Bearer ')) {
    // Remove 'Bearer ' from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is invalid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token was not supplied'
    });
  }
};

module.exports = { checkToken };
