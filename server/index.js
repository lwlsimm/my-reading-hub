const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const PORT = process.env.PORT || 5500;


//Middleware//
  //Cors allows cross-origin resoucres
app.use(cors());
  //Json parses the body
app.use(express.json({limit: '50mb'}));



const apiRouter = require('./serverFiles/api')
app.use('/api', apiRouter)

//Listener
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});