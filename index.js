const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5500;
const path = require('path');
require('dotenv').config()

//Middleware//
  //Cors allows cross-origin resoucres
app.use(cors());
  //Json parses the body
app.use(express.json({limit: '50mb'}));

if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test' ) {
  app.use(express.static(path.join(__dirname, "client/build")));
};

const apiRouter = require('./serverFiles/api')
app.use('/api', apiRouter);


//Redirections for specific pages.

//plan redirect
app.use('/plan/*', (req, res) => {
  const url = req.url;
  res.redirect(`/?redir=plan/${url}`);
});

//all other redirects
app.use('*', (req,res) => {
  const url = req.url;
  
  switch(url) {
    case '/verificationsuccess':
      res.redirect('/?redir=verificationsuccess');
    break;
    case '/verificationfail':
      res.redirect('/?redir=verificationfail');
    break;
    default:
      res.redirect(`/?display=${url}`);
  }
});

//Listener
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});