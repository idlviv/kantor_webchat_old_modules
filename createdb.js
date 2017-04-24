var mongoose = require('./libs/mongoose');
var async = require('async');
var User = require('./models/user').User;

mongoose.connection.on('open', function() {
  var db = mongoose.connection.db;
  db.dropDatabase(function(err) {
    if (err) {
      throw err;
    } else {
      async.parallel([
        function(callback) {
          var vasya = new User({username: 'Vasya', password: 'v'});
          vasya.save(function(err) {
            callback(err, vasya);
          });
        },
        function(callback) {
          var petya = new User({username: 'Petya', password: 'p'});
          petya.save(function(err) {
            callback(err, petya);
          });
        },
        function(callback) {
          var admin = new User({username: 'Admin', password: 'a'});
          admin.save(function(err) {
            callback(err, admin);
          });
        }
      ], function(err, results) {
        console.log(arguments);
        mongoose.disconnect();
      });

    }
  });
});





// var schema = mongoose.Schema({
//   name: String
// });
// schema.methods.meao = function() {
//   console.log('Meao');
// };
//
// var Cat = mongoose.model('Cat', schema);
//
// var kitty = new Cat({
//   name: 'Zildji'
// });
//
// kitty.save(function(err, kitty, affected) {
//   // kitty в callback той самий обєкт, що перед крапкою
//   // affected к-ть змінених записів
//   if (err) {
//     console.log(err);
//   } else {
//     kitty.meao();
//   }
// });
