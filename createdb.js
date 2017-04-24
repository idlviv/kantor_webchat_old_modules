var User = require('models/user').User;

var user = new User({
  username: 'Tester2',
  password: 'secret'
});

user.save(function(err, user, affected) {
  if (err) {
    throw err;
  } else {
    User.findOne({username: 'Tester'}, function(err, tester) {
      console.log(tester);
    });
  }
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
