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

if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'production-test' ) {
  app.use(express.static(path.join(__dirname, "client/build")));
};

const apiRouter = require('./serverFiles/api')
app.use('/api', apiRouter);

//Listener
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});