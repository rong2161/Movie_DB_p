const mongoose = require('mongoose');
const movieData = require ("./myDB/moviedata")
const ObjectId= require('mongoose').Types.ObjectId
const Movie = require("./models/movie");
const People = require("./models/person")
const Users = require("./models/user")
const express = require('express');



//premade account list
let userList = [
  {
    username: "admin",
    password: "admin",
    admin: true
  },
  {
    username: "user1",
    password: "user1",
  },
 {
    username: "user2",
    password: "user2",
  }
];

let userListDB = []
let movieListDB = [];
let directorSet= new Set();
let writerSet= new Set();
let actorsSet = new Set();


userList.forEach(user => {
  let u = new Users();
  u.username = user.username;
  u.password = user.password;
  if(user.admin)
    u.admin = user.admin;
  userListDB.push(u);
});


movieData.forEach(movie => {
  let m = new Movie();
  m.Title = movie.Title;
  m.Year = movie.Year;
  m.Rated = movie.Rated;
  m.Released = movie.Released;
  m.Runtime = movie.Runtime;
  m.Genre = movie.Genre.split(',');
  m.Director = movie.Director.replace(/\((.*?)\)/gi, " ").split(',');
  m.Writer = movie.Writer.replace(/\((.*?)\)/gi, " ").split(',');
  m.Actors = movie.Actors.replace(/\((.*?)\)/gi, " ").split(',');
  m.Plot = movie.Plot;
  m.Language = movie.Language;
  m.Country = movie.Country;
  m.Awards = movie.Awards;
  m.Poster = movie.Poster;
  m.Ratings = movie.Ratings;
  m.Metascore = movie.Metascore;
  m.imdbRating = movie.imdbRating;
  m.imdbVotes = movie.imdbVotes;
  m.imdbID = movie.imdbID;
  m.Type = movie.Type;
  m.DVD = movie.DVD;
  m.BoxOffice = movie.BoxOffice;
  m.Production = movie.Production;
  m.Website = movie.Website;
  m.Response = movie.Response;
  movieListDB.push(m);

  m.Director.forEach(d => {
    directorSet.add(d);
  });

  m.Writer.forEach(w => {
    writerSet.add(w);
  });

  m.Actors.forEach(a => {
    actorsSet.add(a);
  });

});

let directorArray = Array.from(directorSet);
//console.log(directorArray);

let writerArray = Array.from(writerSet);
//console.log(writerArray);

let actorsArray = Array.from(actorsSet);
//console.log(actorsArray);


//mongoose People Object array
let dPList = [];

//create new people object role as director and push it into People list
directorArray.forEach(director => {
  let d = new People();
  d.name = director;
  d.role.push("Director");
  dPList.push(d);
  if(directorArray.length <= dPList.length){
    console.log("director loading Done...wait for writer loading...");
  }
});

//create new people object role as writer and put it into People list
writerArray.forEach((writer, i) => {
  if (directorSet.has(writer)){
    dPList.forEach((person, i) => {
      if(person.name == writer){
        dPList[i].role.push("Writer");
      }
    });

  }else{
    let w = new People();
    w.name = writer;
    w.role.push("Writer");
    dPList.push(w);
  }

});
console.log("writer loading Done...wait for actors loading...");

//create new people object role as actors and push it into People list
actorsArray.forEach((actor, i) => {
  if(directorSet.has(actor) || writerSet.has(actor)){
    dPList.forEach((person, i) => {
      if(person.name == actor){
        dPList[i].role.push("Actor");
      }
    });

  }else{
    let a = new People();
    a.name = actor;
    a.role.push("Actors");
    dPList.push(a);
  }
});
console.log("actor loading Done...wait for dropping DB");




mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/myDB', {useNewUrlParser: true});


//Get the default Mongoose connection (can then be shared across multiple files)
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  mongoose.connection.db.dropDatabase(function(err, result){
  if(err){
    console.log("Error dropping database:");
    console.log(err);
    return;
  }
  console.log("Dropped database. Starting re-creation.");



  let completedUser = 0;
  let completedMovie = 0;
  let completePeople = 0;

  movieListDB.forEach(movie => {
    movie.save(function(err,result){
      if(err) throw err;
      completedMovie++;
      if(completedMovie>=movieListDB.length){
        console.log("All movies saved.");
        console.log("All Loading Complete");
      }
    });
  });


  dPList.forEach(person => {
    person.save(function(err,result){
      if(err) throw err;
      completePeople++;
      if(completePeople>=dPList.length){
        console.log("All people saved.");
      }
    })
  });

  userListDB.forEach(user => {
    user.save(function(err,result){
      if(err) throw err;
      completedUser++;
      if(completedUser>=userList.length){
        console.log("All users saved.");
      }
    });
  });

});

});
