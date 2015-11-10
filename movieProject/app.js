var express = require('express');
var path= require('path');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(express);

var port = process.env.PORT || 3000
var fs = require('fs');
var app = express();

var dbUrl = 'mongodb://localhost/imooc';
mongoose.connect(dbUrl);

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.multipart());
app.use(express.session({
  secret: 'imooc',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}))

if('development' === app.get('env')) {
  app.set('showStackError', true);
  app.use(express.logger(':method :url :status'));
  app.locals.pretty = true;
  mongoose.set('debug', true);
}

require('./config/routes')(app);

app.listen(port);
// app.use(express.bodyParser());
app.locals.moment = require('moment');
app.use(express.static(path.join(__dirname, 'public')));

console.log('immoc started on port ' + port);

