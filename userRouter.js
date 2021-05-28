const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const User = require("./models/user");
const express = require('express');

let router = express.Router();

router.get("/", queryParser, loadUserDB, respondUsers);

router.get("/:id", getUserByID);


router.param("id", function(req, res, next, value){
  let oid;
  console.log("Finding user by ID: " + value);
  try {
    oid = new ObjectId(value);
  }catch(err){
    res.status(404).send("User ID " + value + " does not exist.");
    return;
  }

  User.findById(value, function(err, result){
    if(err){
      console.log(err);
      res.status(500).send("Error reading user.");
      return;
    }

    if(!result){
      res.status(404).send("User ID " + value + " does not exist.");
      return;
    }

    req.user = result;
    console.log("User: " + result);
    next();
  });
});



function getUserByID(req, res, next){
  res.format({
    "application/json": function(){
      res.status(200).json(req.user);
    },
    "text/html": () => {res.render("user.pug", {user: req.user, session: req.session});}
  });
  next();
}


function queryParser(req, res, next){
	const MAX_USER = 50;

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
		if(req.query.limit > MAX_USER){
			req.query.limit = MAX_USER;
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

	if(!req.query.username){
		req.query.username = "?";
	}

	next();
}

function loadUserDB(req, res, next){
	let startIndex = ((req.query.page-1) * req.query.limit);
	let amount = req.query.limit;

	User.find()
	//.where("price").gte(req.query.minprice).lte(req.query.maxprice)
	.where("username").regex(new RegExp(".*" + req.query.username + ".*", "i"))
  .limit(amount)
	.skip(startIndex)
	.exec(function(err, results){
		if(err){
			res.status(500).send("Error reading users.");
			console.log(err);
			return;
		}
		console.log("Found " + results.length + " matching users.");
		res.users = results;
		next();
		return;
	})
}

function respondUsers(req, res, next){
	res.format({
		"text/html": () => {res.render("users.pug", {users: res.users, qstring: req.qstring, current: req.query.page, session: req.session } )},
		"application/json": () => {res.status(200).json(res.users)}
	});
	next();
}

module.exports = router;
