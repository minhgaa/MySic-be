const playlistService = require('../services/playlist.service');

const createPlaylist = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Name is required" });
        const userId = req.user.id;
        const playlist = await playlistService.createPlaylist({ name, userId });
        res.status(201).json({ message: "Playlist created successfully", playlist});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const addSong = async (req, res) => {
    try {
        const { songId } = req.body;
        const {id: playlistId} = req.params;
        if (!playlistId || !songId) return res.status(400).json({ error: "Playlist ID and Song ID are required" });
        const song = await playlistService.addSongToPlaylist(playlistId, songId);
        res.status(200).json({ message: "Song added to playlist successfully", song });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const removeSong = async (req, res) => {
    try {
        const { id: playlistId, songId } = req.params;
        if (!playlistId || !songId) return res.status(400).json({ error: "Playlist ID and Song ID are required" });
        await playlistService.removeSongFromPlaylist(playlistId, songId);
        res.status(200).json({ message: "Song removed from playlist successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { createPlaylist, addSong, removeSong };
