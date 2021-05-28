const mongoose = require("mongoose");
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/myDB',{useNewUrlParser: true});

module.exports = mongoose;
