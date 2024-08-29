import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


import postRoutes from './routes/posts.js';

dotenv.config();
// sets up a non mutable express server
// this server will listen to the specified port and perform DB updates 
const app = express(); 

app.get('/', (req, res) =>{
    res.send("Entered the API");
});
// this is the root for the API and is used when we access the API main page on heroku


// tells the express app how to parse incoming requests from client
app.use(bodyParser.json({limit: "30mb", extended: true})) 
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
// enables the front and back end domains to interact as they are hosted on different domains usually
app.use(cors());

// database: mongDB
// we can now connect our backend to an actual database
// we use the mongoDB atlas hosting service 
// we can create a free cluster

// conver to env var later, this is the connection url to our cluster instance
// const CONNECTION_URL = "mongodb+srv://sanidhyasingh2016:ieihzXsIrfoyES67@cluster0.9256z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const PORT = process.env.PORT || 5000; // port selector for dynamic port (when deployed) or just 5000 for local testing
// heroku automatically populates the process.env.PORT

// this function actually attempts to connect to the DB
// the other params passed to connect essentially tell the DB how to parse the data and are used to prevent warnings
// if connection to DB == succesful, we start up the app->server connection and the app listens on PORT
// otherwise, we throw an error
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => app.listen(PORT, () => console.log(`Serve running on port: ${PORT}`)))
.catch((error) => console.log(error.message));




// mapping front end HTML queries to routes

// all posts related queries will map to postRoutes
// anything after /posts in the query is handled by postRoutes
app.use('/posts', postRoutes);
