const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  admin: {type: Boolean, default: false},
  userfollowed: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  personfollowed: [{type: mongoose.Schema.Types.ObjectId, ref: 'Person'}]
});

userSchema.methods.followUser = function(id){
  let accountUser = this;
  this.model("User").findById(id, function(err, result){
    if(err) throw err;
    if(!result){return false;}
    if(accountUser.userfollowed.includes(result._id)){
      console.log("person already followed!");
      return false;
    }
    else {
      accountUser.userfollowed.push(result._id);
      accountUser.save();
      console.log("user added.");
      return true;
    }
  })
  return false;
}

userSchema.methods.followPerson = function(id){
  let accountUser = this;
  this.model("Person").findById(id, function(err, result){
    if(err) throw err;
    if(!result){return false;}
    if(accountUser.personfollowed.includes(result._id)){
      console.log("person already followed!");
      return false;
    }
    else {
      accountUser.personfollowed.push(result._id);
      accountUser.save();
      return true;
    }
  })
  return false;
}


userSchema.methods.unFollowUser = function(id){
  let accountUser = this;

  this.model("User").findById(id, function(err, result){
    if(err) throw err;
    if(!result){return false;}
    if(accountUser.userfollowed.includes(result._id)){
      accountUser.userfollowed.forEach((userID, i) => {
        if(userID==id){
          accountUser.userfollowed.splice(i,1);
          accountUser.save();
          return true;
        }
      });
    }
    else {
      console.log("user does not exist!");
      return false;
    }
  })
  return false;
}

userSchema.methods.unFollowPerson = function(id){
  let accountUser = this;
  this.model("Person").findById(id, function(err, result){
    if(err) throw err;
    if(!result){return false;}
    if(accountUser.accountUser.includes(result._id)){
      accountUser.accountUser.forEach((personID, i) => {
        if(personID==id){
          accountUser.accountUser.splice(i,1);
          accountUser.save();
          return true;
        }
      });
    }
    else {
      console.log("person does not exist!");
      return false;
    }
  })
  return false;
}

userSchema.methods.userList = function() {
  console.log(this.userfollowed);
  return  this.userfollowed;
}

userSchema.methods.peopleList = function() {
  console.log(this.personfollowed);
  return this.personfollowed;
}

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
