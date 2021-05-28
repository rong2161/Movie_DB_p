const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const User = require("./models/user");
const express = require('express');

let router = express.Router();

router.get("/", (req, res)=> {res.redirect("/logIn")});

router.get('/logIn', logInPage);
router.get('/signUp', signUpPage);
router.get('/logOut', logOut);

router.post('/logInUser', logInUser);
router.post('/signUpUser', signUp, logInUser);


function logInPage(req, res){
  res.render("logIn.pug");
}

function signUpPage(req, res){
  res.render("signUp.pug");
}

function logOut(req, res){
  req.session.destroy();
  res.redirect('/logIn');
}

function logInUser(req, res){
  let reqUser = req.body;
  User.findOne({username: reqUser.username, password:reqUser.password },
    function(err, result){
      if(err) throw err;

      if (result != null && req.session != null){
        req.session.uID = result._id;
        req.session.loggedin = true;
        req.session.user = result.username;
        req.session.admin = result.admin;
        res.status(200).redirect(`/account/${result._id}`);
      }
      else {
        res.status(401).send("Incorrect ID/Password.");
      }
  });
}

function signUp(req, res, next){
  let newUser = req.body;

  User.findOne({username: newUser.username},
    function(err, result){
      if(err) throw err;
      if(result != null){
        res.status(401).send("User already exist.");
      }
      else {
        let tempUser = new User();
        tempUser.username = newUser.username;
        tempUser.password = newUser.password;
        tempUser.save(function(err, result){
          if(err){
            console.log(err);
            res.status(500).send("Error: Sign up new user.");
            return;
          };
          next();
        });
      }
    });
}

module.exports = router;
