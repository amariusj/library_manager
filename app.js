//Requires Express
const express = require('express');
const app = express();

const routes = require('./routes/index');
const books = require('./routes/books');
const sequelize = require('./models').sequelize;

//Requiring body parser middleware used for post method
const bodyParser = require('body-parser');

//Using a static route for static files
app.use('/static', express.static('public'));

//Sets view engine for templates
app.set('view engine', 'pug');

//Using body-parser inside express
app.use(bodyParser.urlencoded({ extended: false}));

app.use('/', routes);
app.use('/books', books);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Error Handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('page-not-found', {
    message: err.message,
    error: {
      status: err.status,
      stack: err.stack
    }
  });
});


//Listens to the port
sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000);
});
