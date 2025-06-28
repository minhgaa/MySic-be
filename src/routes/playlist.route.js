const express = require("express");
const router = express.Router();
const PlaylistController = require("../controllers/playlist.controller");
const { verifyToken, isUser } = require("../middlewares/auth.middleware");

router.get("/user/:id", verifyToken, isUser, PlaylistController.getPlaylistByUser)
      .get("/:id", verifyToken, isUser, PlaylistController.getPlaylistDetail)
      .post("/", verifyToken, isUser, PlaylistController.createPlaylist)
      .post("/:id/songs", verifyToken, isUser, PlaylistController.addSong)
      .delete("/:id/songs/:songId", verifyToken, isUser, PlaylistController.removeSong)
      .delete("/:id", verifyToken,isUser, PlaylistController.removePlaylist);

module.exports = router;
