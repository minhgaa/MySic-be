const express = require("express");
const router = express.Router();
const GenreController = require("../controllers/genre.controller");
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.get("/", GenreController.getGenres);

router.get('/', verifyToken, isAdmin, GenreController.getGenres)
      .post('/', verifyToken, isAdmin, GenreController.createGenre)
      .put('/:id', verifyToken, isAdmin, GenreController.updateGenre)
      .delete('/:id', verifyToken, isAdmin, GenreController.deleteGenre);

module.exports = router;
