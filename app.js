const express = require('express');
const app = express();
const sequelize = require('./models').sequelize;
const Book = require('./models').Book;

app.set('view engine', 'pug');

app.use('/static', express.static('public'));

const bodyParser = require('body-parser');

const books = [
  {
    id: 1,
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    genre: "Non Fiction",
    year: 1988
  },
  {
    id: 2,
    title: "Armada",
    author: "Ernes Cline",
    genre: "Science Fiction",
    year: 2015
  },
  {
    id: 3,
    title: "The Collapse",
    author: "John Barrye",
    genre: "Political Science",
    year: 1995
  }
]

const find = (id) => {
  var matchedBooks = books.filter((book) => { return book.id == id; });
  return matchedBooks[0];
}

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res, next) => {
  res.redirect('/books');
});

app.get('/books', (req, res, next) => {
  Book.findAll({order: [["createdAt", "DESC"]]}).then((books) => {
    res.render('index', {books: books, title: "Library Manager"});
  });
});

app.get('/books/new', (req, res, next) => {
  res.render('new-book', {book: Book.build(), title: "Create New Book"});
});

app.post('/books/new', (req, res, next) => {
  Book.create(req.body).then((book) => {
    res.redirect(`/books/${book.id}`);
  }).catch((err) => {
    if(err.name === "SequelizeValidationError") {
      res.render('new-book', {
        book: Book.build(req.body),
        title: "Create New Book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  });
});

app.get('/books/:id', (req, res, next) => {
  Book.findByPk(req.params.id).then((book) => {
    if (book) {
      res.render('update-book', {book: book, title: book.title});
    } else {
      let err = new Error('Not Found');
      err.status =  404;
      next(err);
    }
  });
});

app.post('/books/:id', (req, res, next) => {
  Book.findByPk(req.params.id).then((book) => {
    if (book) {
      return book.update(req.body);
    } else {
      let err = new Error('Not Found');
      err.status =  404;
      next(err);
    }
  }).then((book) => {
    res.redirect(`/books/${book.id}`);
  }).catch((err) => {
    if(err.name === "SequelizeValidationError") {
      let book = Book.build(req.body);
      book.id = req.params.id;

      res.render('update-book', {
        book: book,
        title: book.title,
        errors: err.errors
      });
    } else {
      throw err;
    }
  });
});

app.post('/books/:id/delete', (req, res, next) => {
  Book.findByPk(req.params.id).then((book) => {
    if (book) {
      return book.destroy();
    } else {
      let err = new Error('Not Found');
      err.status =  404;
      next(err);
    }
  }).then(() => {
    res.redirect('/books');
  });
});

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('page-not-found', {
    message: err.message,
    error: err
  })
})

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000);
});
