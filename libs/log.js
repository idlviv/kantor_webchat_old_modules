var winston = require('winston'); //замість console.log
var ENV = process.env.NODE_ENV;

// can be much more flexible than that O_o
function getLogger(module) {

  var path = module.filename.split('\\').slice(-2).join('\\');
  //якщо девелопмент виводить дебаг і вище, якщо продакшн або тестінг то еррор
  return new winston.Logger({
    transports: [
      new winston.transports.Console({
        colorize: true,
        level: (ENV == 'development') ? 'debug' : 'error',
        label: path
      })
    ]
  });
}

module.exports = getLogger;
