const express = require("express");
const router = express.Router();
const multer = require("multer");
const SongController = require("../controllers/song.controller");
const { verifyToken, isAdmin, isUser } = require("../middlewares/auth.middleware");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // Tăng lên 100MB
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "audioFile") {
      const allowed = [
        "audio/mpeg",
        "audio/mp3",
        "audio/webm",
        "video/webm"
      ];
      return allowed.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Unsupported audio format"));
    }

    if (file.fieldname === "songImage") {
      return file.mimetype.startsWith("image/")
        ? cb(null, true)
        : cb(new Error("Invalid image"));
    }

    cb(null, true);
  }
});

/* ===== ROUTE TĨNH TRƯỚC ===== */
router.get("/top", SongController.getTopSongs);
router.get("/recommended", verifyToken, isUser, SongController.getRecommendedSongs);
router.get("/by-genre", SongController.getSongsByGenre);
router.get("/by-status", SongController.getSongsByStatus);
router.get("/by-user", SongController.getSongsByUser);
router.get("/pending", verifyToken, isAdmin, SongController.getPendingSongs);

router.get("/", SongController.getAllSongs);

/* ===== UPLOAD ===== */
router.post(
  "/",
  verifyToken,
  isUser,
  upload.fields([{ name: "audioFile", maxCount: 1 }]),
  SongController.uploadSong
);

/* ===== SYNC STATUS ===== */
router.put("/sync-status", SongController.syncSongStatus);

/* ===== ROUTE ĐỘNG ===== */
router.get("/:id/lyrics", verifyToken, isUser, SongController.getSongLyrics);
router.get("/:id/download", SongController.downloadSong);
router.get("/:id/like", verifyToken, isUser, SongController.getLikeCount);
router.post("/:id/like", verifyToken, isUser, SongController.likeSong);
router.post("/:id/report", verifyToken, isUser, SongController.reportSong);
router.get("/:id", verifyToken, isUser, SongController.getSongById);

router.patch("/:id/approve", verifyToken, isAdmin, SongController.approveSong);
router.patch("/:id/reject", verifyToken, isAdmin, SongController.rejectSong);
router.put("/:id", verifyToken, isAdmin, SongController.updateSong);
router.delete("/:id", verifyToken, isAdmin, SongController.deleteSong);

module.exports = router;