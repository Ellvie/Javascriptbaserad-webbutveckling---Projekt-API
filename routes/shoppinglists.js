var express = require('express');
var router = express.Router();




/*Database connection*/
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shoppinglists', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise; // Global use of mongoose

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  console.log("Connected to db");

  // Create a db-schema
  var shoppinglistSchema = mongoose.Schema({
    id: String,
    name: String,
    items: [String]
  });

  // Create a model
  var Shoppinglist = mongoose.model('Shoppinglist', shoppinglistSchema)






  /* GET shoppinglist. */
  router.get('/', function (req, res, next) {

    // Read from database
    Shoppinglist.find(function (err, shoppinglists) {
      if (err) return console.error(err);


      let jsonObj = JSON.stringify(shoppinglists);
      res.contentType('application/json');
      res.send(jsonObj);

      console.log(shoppinglists);
    });
  });


  /*GET shoppinglist by id*/
  router.get('/:id', function (req, res, next) {

    let id = req.params.id;
    let ind = -1;

    // Read from database
    Shoppinglist.find(function (err, shoppinglists) {
      if (err) return console.error(err);


      for (let i = 0; i < shoppinglists.length; i++) {
        if (shoppinglists[i]._id == id) ind = i; //Find the array index with the right id
      }
      console.log(shoppinglists[ind]);
      res.contentType('application/json');
      res.send(ind >= 0 ? shoppinglists[ind] : '{}'); //If id exists return object otherwise return empty object


      console.log(shoppinglists);
    });


  });


  /* ADD shoppinglist */
  router.post('/', function (req, res, next) {

    // Create new shoppinglist
    var shoppinglist = new Shoppinglist({
      name: req.body.name,
      items: req.body.items
    });

    // Save new shoppinglist to db
    shoppinglist.save(function (err) {
      if (err) return console.error(err);
    });


    var jsonObj = JSON.stringify(shoppinglist);
    res.contentType('application/json');
    res.send(jsonObj);
  });



  /* UPDATE shoppinglist */
  router.put('/:id', function (req, res, next) {

    let id = req.params.id;

    // Create new shoppinglist
      var shoppinglist = new Shoppinglist({
      name: req.body.name,
      items: req.body.items
    });


    // Save new shoppinglist to db
    Shoppinglist.findByIdAndUpdate({ "_id": id }, {"name": req.body.name,"items": req.body.items },function (err) {
      if (err) return console.error(err);
    });


    var jsonObj = JSON.stringify(shoppinglist);
    res.contentType('application/json');
    res.send(jsonObj);
  });




  /* DELETE shoppinglist by id*/
  router.delete('/:id', function (req, res, next) {
    let id = req.params.id;

    // Delete user _id from db
    Shoppinglist.deleteOne({ "_id": id }, function (err) {
      if (err) return handleError(err);
    });
    
    res.contentType('application/json');
    res.send();
  });
});

module.exports = router;
