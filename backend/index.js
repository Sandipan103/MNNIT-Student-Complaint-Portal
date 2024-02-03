

// required dependency
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors');
require('dotenv').config();


// required env string
const PORT = process.env.PORT;



// 
app.use(cors());
app.use(cookieParser());
app.use(express.json());


// connect with db
const dbConnect = require('./config/database');
dbConnect();


// routing
const testingRoutes = require('./routes/testingRoutes');
app.use('/api/v1' , testingRoutes);


// start server
app.listen(PORT, ()=>{
    console.log(`app is running on ${PORT}`);
})
