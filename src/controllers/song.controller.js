const songService = require('../services/song.service');

const getAllSongs = async (req, res) => {
    try {
        const songs = await songService.getAllSongs();
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getSongLyrics = async (req, res) => {
    try {
        const songId = req.params.id;
        const song = await songService.getSongLyrics(songId);
        res.status(200).json(song);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getSongsByStatus = async(req, res) => {
    try {
        const { status } = req.params;
        if (!genreId) return res.status(400).json({ error: 'Status is required' });
        const songs = await songService.getSongsByStatus(status);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getSongsByGenre = async (req, res) => {
  try {
    const { genreId } = req.query;
    if (!genreId) return res.status(400).json({ error: 'genreId is required' });

    const songs = await songService.getSongsByGenre(genreId);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const downloadSong = async (req, res) => {
    try {
        const songId = req.params.id;
        const song = await songService.getSongById(songId);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }
        const filePath = path.join(__dirname, "..", "..", song.fileUrl);

        res.download(filePath, `${song.title}.mp3`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const uploadSong = async (req, res) => {
    try {
        const { title, genreId, lyrics, fileUrl, songImage, artist } = req.body;
        if (!title || !artist || !genreId || !fileUrl) {
            return res.status(400).json({ error: "Not enough song information" });
        }
        const song = await songService.uploadSong({title, artist, genreId, lyrics, fileUrl, songImage, userId: req.user.id});
        if (!song) {
            return res.status(500).json({ error: "Failed to upload song" });
        }

        res.status(201).json({ message: "Song uploaded, wait for approval", song });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const likeSong = async (req, res) => {
    try {
        const { id: songId } = req.params;
        const userId = req.user.id;
        console.log(userId);
        if (!songId) {
            return res.status(400).json({ error: "Song ID is required" });
        }
        const like = await songService.likeSong(songId, userId);
        res.status(200).json({ message: "Song liked successfully", like });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const reportSong = async (req, res) => {
    try {
        const { id: songId } = req.params;
        const { reason } = req.body;
        const userId = req.user.id;
        if (!reason) return res.status(400).json({ error: "Please enter your reason to report this song" });
        const report = await songService.reportSong(userId, songId, reason);
        res.json({ message: "Song reported", report });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getTopSongs = async (req, res) => {
    try {
        const topSongs = await songService.getTopSongs();
        res.status(200).json(topSongs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getRecommendedSongs = async (req, res, next) => {
  try {
    const songs = await songService.getRecommendedSongs(req.user.id);
    res.json(songs);
  } catch (err) {
    next(err);
  }
};

const getPendingSongs = async (req, res) => {
    try {
        const pendingSongs = await songService.getPendingSongs();
        res.status(200).json(pendingSongs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const approveSong = async (req, res) => {
    try {
        const { id } = req.params;
        await songService.updateSongStatus(id, 'approved');
        res.status(200).json({ message: "Song approved" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const rejectSong = async(req, res) => {
    try {
        const { id } = req.params;
        await songService.updateSongStatus(id, 'rejected');
        res.status(200).json({ message: "Song rejected" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateSong = async(req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedSong = await songService.updateSong(id, data);
        res.status(200).json({ message: "Song updated successfully", song: updatedSong });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteSong = async (req, res) => {
    try {
        const { id } = req.params;
        await songService.deleteSong(id);
        res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getAllSongs, getSongsByGenre, getSongsByStatus, getSongLyrics, downloadSong, uploadSong, likeSong, reportSong, getTopSongs, getRecommendedSongs, getPendingSongs, approveSong, rejectSong, updateSong, deleteSong };
