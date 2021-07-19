const axios = require('axios');
require('dotenv').config();
const searchRouter = require('express').Router();
module.exports = searchRouter;

searchRouter.post('/', async(req, res) => {
  try {
    const { title, author } = req.body;
    const apiKey = process.env.GOOGLE_API;
    const path = `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&key=${apiKey}&maxResults=25`;
    const serverData = await axios.get(path);
    res.send(await serverData.data.items)
  } catch (error) {
    res.send()
  }
})