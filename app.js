var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('libs/log')(module);

var app = express();

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
// app.use(express.bodyParser);
//парсить cookie, дані в req.cookies
app.use(express.cookieParser('secret here'));

app.use(app.router);

app.get('/', function(req, res, next) {
  res.render('index', {
    body: '<b>Hello</b>',
    title: '<b>Title</b>',
  });
});

app.use(express.static(path.join(__dirname, 'public')));

// якщо десь помилка або throw то керування зразу сюда
// знає, що це обробчик помилок, бо передається 4 аргумента
app.use(function(err, req, res, next) {
  // якщо NODE_ENV немаэ, то по замовч development
  // при development видає стек помилки
  // для цього є вбудований app.use(express.errorHandler()
  // при production те що має побачити користувач
  if (app.get('env') === 'development') {
    var errorHandler = express.errorHandler();
    errorHandler(err, req, res, next);
  } else {
    res.send(500, 'error');
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
