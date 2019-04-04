var express = require('express');
var router = express.Router();

//Requires the Book Model generated with sequel
const Book = require('../models').Book;

//Routes /books and renders All Books
router.get('/', (req, res, next) => {
  Book.findAll({order: [["createdAt", "DESC"]]}).then(function(books){
    res.render('index', {books: books, title: "Library Manager"});
  }).catch(function(error){
    res.send(500, error);
  });
});

//Routes /books/new and renders the new book page
router.get('/new', (req, res, next) => {
  res.render('new-book', {book: Book.build(), title: "Create New Book"});
});

//Posts the new book data back to the /books render page
router.post('/new', (req, res, next) => {
  Book.create(req.body).then(function(book){
    res.redirect(`/books/${book.id}`);
  }).catch(function(error){
    if (error.name === "SequelizeValidationError") {
      res.render('new-book', {
        book: Book.build(req.body),
        title: "Create New Book",
        errors: error.errors
      });
    } else {
      throw error;
    }
  }).catch(function(error) {
    res.send(500, error);
  });
});

//Renders book information page
router.get('/:id', (req, res, next) => {
  Book.findByPk(req.params.id).then(function(book) {
    if (book) {
      res.render('update-book', {book: book, title: book.title});
    } else {
      res.sendStatus(404);
    }
  }).catch(function(error){
    res.send(500, error);
  });
});

//Updates the book information
router.post('/:id', (req, res, next) => {
  Book.findByPk(req.params.id).then(function(book) {
    if (book) {
      return book.update(req.body);
    } else {
      res.sendStatus(404);
    }
  }).then(function(book){
    res.redirect(`/books/${book.id}`);
  }).catch(function(error){
    if (error.name = "SequelizeValidationError") {
      const book =  Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', {
        book: Book.build(req.body),
        title: book.title,
        errors: error.errors
      });
    } else {
      throw error;
    }
  }).catch(function(error) {
    res.send(500, error);
  });
});

//Deletes the book
router.post('/:id/delete', (req, res, next) => {
  Book.findByPk(req.params.id).then(function(book) {
    if (book) {
      return book.destroy();
    } else {
      res.sendStatus(404);
    }
  }).then(function(){
    res.redirect(`/books`);
  }).catch(function(error){
    res.send(500, error);
  });
});

module.exports = router;
