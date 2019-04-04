var express = require('express');
var router = express.Router();

//Redirects from home route to books route
router.get('/', (req, res, next) => {
  res.redirect('/books');
});

module.exports = router;
