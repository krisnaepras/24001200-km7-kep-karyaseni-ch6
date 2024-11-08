require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./routes/index');

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

const { PORT = 3000} = process.env;
app.listen(PORT, () => console.log('Server running on port', PORT));
