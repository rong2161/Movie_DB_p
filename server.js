const express = require ('express');
const session = require ('express-session');
const UserDB = require('./models/user');
const MovieDB = require('./models/movie');
const PeopleDB = require('./models/person')
const mongoose = require('./myDB');
const app = express();

app.set("view engine", "pug");
app.use(express.urlencoded({extended: true}));
app.use(session({
  cookie: {
    maxAge: 3600000 //1 hour
  },
  secret: 'Movie Database', //seed
  resave: true,
  saveUninitialized: true
}));

let logInRouter = require("./logInRouter");
app.use("/", logInRouter);

let accountRouter = require("./accountRouter");
app.use("/account", accountRouter);

let movieRouter = require("./movieRouter");
app.use("/movies", movieRouter);

let userRouter = require("./userRouter");
app.use("/users", userRouter);
//separate server and database using router.
//let userRouter = require("./router/user-router")
let peopleRouter = require("./peopleRouter");
app.use("/people", peopleRouter);

//app.use("/", userRouter);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){




  app.listen(3000);
  console.log("Server listening at http://localhost:3000");
})
