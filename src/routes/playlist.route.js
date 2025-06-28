const express = require("express");
const router = express.Router();
const PlaylistController = require("../controllers/playlist.controller");
const { verifyToken, isUser } = require("../middlewares/auth.middleware");

router.post("/", verifyToken, isUser, PlaylistController.createPlaylist)
      .post("/:id/songs", verifyToken, isUser, PlaylistController.addSong)
      .delete("/:id/songs/:songId", verifyToken, isUser, PlaylistController.removeSong);

module.exports = router;
