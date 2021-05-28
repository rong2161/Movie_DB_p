const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const Movie = require("./models/movie");
const express = require('express');

let router = express.Router();


router.get("/", queryParser, loadMovieDB, respondMovies);

router.get("/:id", getMovieByID);



router.param("id", function(req, res, next, value){
  let oid;
  console.log("Finding movie by ID: " + value);
  try {
    oid = new ObjectId(value);
  }catch(err){
    res.status(404).send("Movie ID " + value + " does not exist.");
    return;
  }

  Movie.findById(value, function(err, result){
    if(err){
      console.log(err);
      res.status(500).send("Error reading product.");
      return;
    }

    if(!result){
      res.status(404).send("Movie ID " + value + " does not exist.");
      return;
    }

    req.movie = result;
    console.log("Movie: " + result);
    next();
  });
});

function getMovieByID(req, res, next){
  res.format({
    "application/json": function(){
      res.status(200).json(req.movie);
    },
    "text/html": () => {res.render("movie.pug", {movie: req.movie, session: req.session});}
  });
  next();
}

function queryParser(req, res, next){
	const MAX_MOVIES = 50;

	//build a query string to use for pagination later
	let params = [];
	for(prop in req.query){
		if(prop == "page"){
			continue;
		}

		params.push(prop + "=" + req.query[prop]);

	}
	req.qstring = params.join("&");

	try{
		req.query.limit = req.query.limit || 10;
		req.query.limit = Number(req.query.limit);
		if(req.query.limit > MAX_MOVIES){
			req.query.limit = MAX_MOVIES;
		}
	}catch{
		req.query.limit = 10;
	}

	try{
		req.query.page = req.query.page || 1;
		req.query.page = Number(req.query.page);
		if(req.query.page < 1){
			req.query.page = 1;
		}
	}catch{
		req.query.page = 1;
	}

	// try{
	// 	req.query.minprice = req.query.minprice || 0;
	// 	req.query.minprice = Number(req.query.minprice);
	// }catch(err){
	// 	req.query.minprice = 0;
	// }
  //
	// try{
	// 	req.query.maxprice = req.query.maxprice || Number.MAX_SAFE_INTEGER;
	// 	req.query.maxprice = Number(req.query.maxprice);
	// }catch{
	// 	req.query.maxprice = Number.MAX_SAFE_INTEGER;
	// }

	if(!req.query.title){
		req.query.title = "?";
	}

  if(!req.query.year){
    req.query.year = "?";
  }

  if(!req.query.genre){
    req.query.genre = "?"
  }

	next();
}

function loadMovieDB(req, res, next){
	let startIndex = ((req.query.page-1) * req.query.limit);
	let amount = req.query.limit;

	Movie.find()
	//.where("price").gte(req.query.minprice).lte(req.query.maxprice)
	.where("Title").regex(new RegExp(".*" + req.query.title + ".*", "i"))
  .where("Year").regex(new RegExp(".*" + req.query.year + ".*", "i"))
  .where("Genre").regex(new RegExp(".*" + req.query.genre + ".*", "i"))
  .limit(amount)
	.skip(startIndex)
	.exec(function(err, results){
		if(err){
			res.status(500).send("Error reading movies.");
			console.log(err);
			return;
		}
		console.log("Found " + results.length + " matching movies.");
		res.movies = results;
		next();
		return;
	})
}


function respondMovies(req, res, next){
	res.format({
		"text/html": () => {res.render("movies.pug", {movies: res.movies, qstring: req.qstring, current: req.query.page, session: req.session } )},
		"application/json": () => {res.status(200).json(res.movies)}
	});
	next();
}




module.exports = router;
