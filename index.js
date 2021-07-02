const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5500;
const pool = require('./server/db')

//Middleware//
  //Cors allows cross-origin resoucres
app.use(cors());
  //Json parses the body
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello')
})

const apiRouter = require('./server/api')
app.use('/api', apiRouter)

//Listener
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});