const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');

class HandlerGenerator {
  login (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    // user would be fetched from db here...
    let mockUsername = 'admin';
    let mockPassword = 'password';

    // would use some kind of crypto here...
    if (username && password) {
      if (username === mockUsername && password === mockPassword) {
        let token = jwt.sign({ username },
          config.secret,
          { expiresIn: '24h' }
        );

        // return JWT token for future API calls
        res.json({
          success: true,
          message: 'Authentication successful!',
          token
        });
      } else {
        res.send(403).json({
          success: false,
          message: 'Incorrect username or password'
        });
      }
    } else {
      res.send(400).json({
        success: false,
        message: 'Authentication failed, please check the request'
      });
    }
  }

  index (req, res) {
    res.json({
      success: true,
      message: 'Index page'
    });
  }
}

// Server starting point
function main () {
  let app = express();
  let handlers = new HandlerGenerator();
  const port = process.env.PORT || 8000;

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  // Routes and handlers
  app.post('/login', handlers.login);
  app.get('/', middleware.checkToken, handlers.index);

  app.listen(port, () => console.log(`Server is listening on port ${port}`));
}

main();
