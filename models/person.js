const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {type: String},
  role: [{type: String}],
  work: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

personSchema.methods.findAllWork = function(callback){
  this.model("Movie")
  .find({$or: [{"Director": this.name}, {"Writer": this.name}, {"Actors": this.name}]})
  .populate("_id")
  .exec(callback);
}

const PersonModel = mongoose.model("Person", personSchema);

module.exports = PersonModel;
