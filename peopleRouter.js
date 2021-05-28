const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const People = require("./models/person");
const express = require('express');

let router = express.Router();

router.get("/", queryParser, loadPeopleDB, respondPeople);

//router.get("/:name", getPersonByName);
router.get("/name/:name", getPersonByName);

router.get("/:id", getPersonByID);

router.param("id", function(req, res, next, value){
  let oid;
  console.log("Finding person by ID: " + value);
  try {
    oid = new ObjectId(value);
  }catch(err){
    res.status(404).send("Person ID " + value + " does not exist.");
    return;
  }

  People.findById(value, function(err, result){
    if(err){
      console.log(err);
      res.status(500).send("Error reading product.");
      return;
    }

    if(!result){
      res.status(404).send("Person ID " + value + " does not exist.");
      return;
    }

    req.person = result;
    console.log("Person: " + result);


    result.findAllWork(function(err, result){
      if(err){
        console.log(err);
        next();
        return;
      }
      console.log(result);
      req.person.work = result;

      next();
    })

  });
});

router.param("name", function(req, res, next, value){


  People.findOne()
  .where("name").regex(new RegExp(".*" + value + ".*", "i"))
  .exec(function(err, result){
    if(err){
      console.log(err);
      res.status(500).send("Error loading People DB.");
      return;
    }

    if(!result){
      res.status(404).send("Person Name [" + value + "] does not exist.");
      return;
    }
    req.person = result;
    console.log("Preson: " + result._id);
    next();
  });
});

function getPersonByName(req, res, next){
  res.format({
    "application/json": function(){
      console.log("app/json: " + req.person);
      res.status(200).json(req.person);
    },
    "text/html": () => {
      console.log("text/html: " + req.person);
      //res.render("person.pug", {person: req.person});}
      res.redirect('/people/'+req.person._id);}
  });
  next();
}


function getPersonByID(req, res, next){
  res.format({
    "application/json": function(){
      res.status(200).json(req.person);
    },
    "text/html": () => {res.render("person.pug", {person: req.person,session: req.session});}
  });
  next();
}

function queryParser(req, res, next){
	const MAX_PEOPLE = 50;

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
		if(req.query.limit > MAX_PEOPLE){
			req.query.limit = MAX_PEOPLE;
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

	if(!req.query.name){
		req.query.name = "?";
	}

	next();
}

function loadPeopleDB(req, res, next){
	let startIndex = ((req.query.page-1) * req.query.limit);
	let amount = req.query.limit;

	People.find()
	//.where("price").gte(req.query.minprice).lte(req.query.maxprice)
	.where("name").regex(new RegExp(".*" + req.query.name + ".*", "i"))
  .limit(amount)
	.skip(startIndex)
	.exec(function(err, results){
		if(err){
			res.status(500).send("Error reading people DB.");
			console.log(err);
			return;
		}
		console.log("Found " + results.length + " matching Person.");
		res.people = results;
		next();
		return;
	})
}

function respondPeople(req, res, next){
	res.format({
		"text/html": () => {res.render("people.pug", {people: res.people, qstring: req.qstring, current: req.query.page, session: req.session } )},
		"application/json": () => {res.status(200).json(res.people)}
	});
	next();
}








module.exports = router;
