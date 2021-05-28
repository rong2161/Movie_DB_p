const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
   Title: {
     type: String,
     required: true
   },
   Year: {
     type: String
   },
   Rated: {
     type: String
   },
   Released: {
     type: String
   },
   Runtime: {
     type: String
   },
   Genre: {
     type: [{type:String, trim:true}]
   },
   Director: {
     type: [{type:String, trim:true}],
     required: true
   },
   Writer: {
     type: [{type:String, trim:true}],
     required: true
   },
   Actors: {
     type: [{type:String, trim:true}],
     required: true
   },
   Plot: {
     type: String
   },
   Language: {
     type: [String]
   },
   Country: {
     type: [String]
   },
   Awards: {
     type: String
   },
   Poster: {
     type: String
   },
   Ratings: {
    type: [{
      Source: String,
      Value: String
    }]
   },
   Metascore: {
     type: String
   },
   imdbRating: {
     type: String
   },
   imdbVotes: {
     type: String
   },
   imdbID: {
     type: String
   },
   Type: {
     type: [String]
   },
   DVD: {
     type: String
   },
   BoxOffice: {
     type: String
   },
   Production: {
     type: [String]
   },
   Website: {
     type: String
   },
   Response: {
     type: String
   }
});

movieSchema.methods.getAveRating = function(){
  if(!this.Ratings){return 0;}
  let total = 0;
  this.Ratings.forEach((r, i) => {
    if(r.Source == "Internet Movie Database"){
      total += eval(r.Value);
    }
    else if(r.Source == "Rotten Tomatoes"){
      total += eval(r.Value.replace(/%/g,"/100"));
    }
    else if(r.Source == "Metacritic"){
      total += eval(r.Value);
    }
    else {
      total += 0;
    }
  });
  return ((total/this.Ratings.length)*100).toFixed(0);
}


//similar movies with similar genre, director, actors, writers
// movieSchema.methods.getSimilarMovies = function(name){
//
// }



const MovieModel = mongoose.model("Movie", movieSchema);

module.exports = MovieModel;
