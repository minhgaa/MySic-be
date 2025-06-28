const genreService = require('../services/genre.service');

const getGenres = async (req, res) => {
    try {
        const genres = await genreService.getAllGenres();
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getGenreById = async (req, res) => {
    try {
      const { id } = req.params;
      const genre = await genreService.getGenreById(id);
      res.status(200).json(genre);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

const createGenre = async(req, res) => {
    try {
        const data = req.body;
        const genre = await genreService.createGenre(data);
        res.status(201).json({ message: "Genre created successfully", genre });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateGenre = async(req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updateGenre = await genreService.updateGenre(id, data);
        res.status(200).json({ message: "Genre updated successfully", genre: updateGenre });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteGenre = async(req, res) => {
    try {
        const { id } = req.params;
        await genreService.deleteGenre(id);
        res.status(200).json({ message: "Genre deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getGenreById, getGenres, createGenre, updateGenre, deleteGenre };
