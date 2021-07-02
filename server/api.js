const express = require('express');
const apiRouter = express.Router();
const pool = require('./database/db');
const cors = require('cors');

apiRouter.use(cors())
apiRouter.use(express.json())

//Routes
const userRouter = require('./routes/user');
apiRouter.use('/user',userRouter)
const verifyRouter = require('./routes/verify');
apiRouter.use('/verify',verifyRouter)
const registerRouter = require('./routes/register');
apiRouter.use('/register',registerRouter)

module.exports = apiRouter;