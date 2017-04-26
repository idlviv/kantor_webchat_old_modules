var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('libs/log')(module);
var mongoose = require('libs/mongoose');
var HttpError = require('error').HttpError;
var bodyParser = require('body-parser')

var app = express();
// ф-ли з розширенням ejs обробляти движком ejs-locals
app.engine('ejs', require('ejs-locals'));

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

app.use(express.favicon());
// логування
if (app.get('env') === 'development') {
  app.use(express.logger('dev'));
} else {
  app.use(express.logger('default'));
}

//читає форми прислані POST, JSON дані (розбирає тіло запроса), дані доступні в req.body..
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

//парсить cookie, дані в req.cookies
app.use(express.cookieParser('secret here'));

var MongoStore = require('connect-mongo')(express);

app.use(express.session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

// app.use(function(req, res, next) {
//   req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
//   res.send("Visits: " + req.session.numberOfVisits);
// });

app.use(require('middleware/sendHttpError'));

app.use(app.router);

require('routes')(app);

app.use(express.static(path.join(__dirname, 'public')));

// якщо десь помилка або throw то керування зразу сюда
// знає, що це обробчик помилок, бо передається 4 аргумента
app.use(function(err, req, res, next) {
  // якщо NODE_ENV немаэ, то по замовч development
  // при development видає стек помилки
  // для цього є вбудований app.use(express.errorHandler()
  // при production те що має побачити користувач
  console.log(err);
  if (typeof err == 'number') {
    err = new HttpError(err);
  }
  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') === 'development') {
      express.errorHandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});

// var routes = require('./routes');
// var user = require('./routes/user');
// // development only
//
// app.get('/', routes.index);
// app.get('/users', user.list);

http.createServer(app).listen(config.get('port'), function() {
  log.info('Express server listening on port ' + config.get('port'));
});
