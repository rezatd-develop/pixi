require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth/app');
const productsRouter = require('./routes/products/app');
const db = require('./config/db');

const app = express();

app.use(express.json());

const cors = require('cors');

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  exposedHeaders: ['Authorization'],
}));

app.use((req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'Authorization');
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

db.connect();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
