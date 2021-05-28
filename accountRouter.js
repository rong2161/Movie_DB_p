const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const User = require("./models/user");
const Movie = require("./models/movie")
const People = require("./models/person")
const express = require('express');

let router = express.Router();



router.get('/:uid', getAcctByID);

router.post('/statuschange', changeStatus);

router.post('/follow/:id', followUser);
router.post('/unfollow/:id', unFollowUser);

router.post('/followP/:id', followPerson);
//router.post('/unfollowP/:id', unFollowPerson);

router.param("uid", function(req, res, next, value){
  let oid;
  console.log("Finding user by ID: " + value);
  try {
    oid = new ObjectId(value);
  }catch(err){
    res.status(404).send("User ID " + value + " does not exist.");
    return;
  }
  if (req.session.loggedin && req.session.uID == value){
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

      req.account = result;
      next();
    });
  }
  else {
    res.status(401).send("Invalid access to Account.")
  }
});



function getAcctByID(req, res){
  res.format({
    "application/json": function(){
      res.status(200).json(req.account);
    },
    "text/html": () => {res.render("account.pug", {user: req.account , session: req.session});}
  });

}

function changeStatus(req, res){
  if(req.session.loggedin){
    User.findOne({_id: req.session.uID}, function (err, result){
      if(err) throw err;
      result.admin = result.admin ? false : true;
      result.save(function(err, result){
        if(err) throw err;
        req.session.admin = result.admin;
        res.status(200).render("account.pug", {user: result , session: req.session})
      })
    })
  }
  else {
    res.status(401).send("Opps! Invalid Access to this account!")
  }
}


function followUser(req, res) {

  if (req.params.id == req.session.uID){
    res.status(404).send("You can't follow yourself.")
  }
  else {
    User.findById(req.session.uID, function (err, result){
      if (err) throw err;
      if (!result) {
        res.status(404).send("The Account is no longer exist!")
      }
      else{
        const followed = result.followUser(req.params.id);
        if(followed){
          res.status(200).redirect(`/users/${req.params.id}`);
        }
        else {
          res.status(404).send("user already followed!")
        }
      }
    })

  }
}


function followPerson(req, res) {

  if (req.params.id == req.session.uID){
    res.status(404).send("You can't follow yourself.")
  }
  else {
    People.findById(req.session.uID, function (err, result){
      if (err) throw err;
      if (!result) {
        res.status(404).send("The Account is no longer exist!")
      }
      else{
        const followed = result.followPerson(req.params.id);
        if(followed){
          res.status(200).redirect(`/people/${req.params.id}`);
        }
        else {
          res.status(404).send("Person already followed!")
        }
      }
    })

  }
}


function unFollowUser(req, res) {

  if (req.params.id == req.session.uID){
    res.status(404).send("You can't Unfollow yourself.")
  }
  else {
    User.findById(req.session.uID, function (err, result){
      if (err) throw err;
      if (!result) {
        res.status(404).send("The Account is no longer exist!")
      }
      else{
        const followed = result.unFollowUser(req.params.id);
        if(followed){
          res.status(200).redirect(`/users/${req.params.id}`);
        }
        else {
          res.status(404).send("Person already unfollowed!")
        }
      }
    })

  }
}



module.exports = router;
