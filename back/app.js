require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoute');
const cors = require('cors');

const app = express();
app.use(express.json());

//CORS
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
  }));
  
  const port=process.env.PORT || 3000;

//connect with DB
const connectWithDB = require('./config/db');
connectWithDB();


app.get('/', (req, res) => {
    res.send('Hello World!');
    });



app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
    }
);

app.use('/api/users', userRoutes);

