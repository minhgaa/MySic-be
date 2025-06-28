const express = require("express");
const router = express.Router();
const SongController = require("../controllers/song.controller");
const { verifyToken, isAdmin, isUser } = require("../middlewares/auth.middleware");

router.get("/", SongController.getAllSongs);

router.get("/:id/lyrics", verifyToken, isUser, SongController.getSongLyrics)
      .get("/:id/download", verifyToken, isUser, SongController.downloadSong)
      .post("/", verifyToken, isUser, SongController.uploadSong)
      .post("/:id/like", verifyToken, isUser, SongController.likeSong)
      .post("/:id/report", verifyToken, isUser, SongController.reportSong)
      .get("/top", SongController.getTopSongs)
      .get("/recommended", verifyToken, isUser, SongController.getRecommendedSongs);

router.get('/by-genre', SongController.getSongsByGenre)
      .get('/by-status', SongController.getSongsByStatus);

router.get('/pending', verifyToken, isAdmin, SongController.getPendingSongs)
      .patch('/:id/approve', verifyToken, isAdmin, SongController.approveSong)
      .patch('/:id/reject', verifyToken, isAdmin, SongController.rejectSong)
      .put('/:id', verifyToken, isAdmin, SongController.updateSong)
      .delete('/:id', verifyToken, isAdmin, SongController.deleteSong);

module.exports = router;
