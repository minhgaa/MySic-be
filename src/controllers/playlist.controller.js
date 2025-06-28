const playlistService = require('../services/playlist.service');


const getPlaylistByUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const playlists = await playlistService.getPlaylistByUser(userId);
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPlaylistDetail = async (req, res) => {
    try {
        const playlistId = req.params.id;
        const playlist = await playlistService.getPlaylistDetail(playlistId);
        res.status(200).json(playlist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


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
        const { id: playlistId } = req.params;

        if (!playlistId || !songId) {
            return res.status(400).json({ error: "Playlist ID and Song ID are required" });
        }

        const song = await playlistService.addSongToPlaylist(playlistId, songId);

        res.status(200).json({ message: "Song added to playlist successfully", song });
    } catch (err) {
        if (err.message === "Song already exists in the playlist") {
            return res.status(409).json({ error: err.message });
        }

        res.status(500).json({ error: err.message });
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

const removePlaylist = async (req, res) => {
    try {
        const { id: playlistId } = req.params;

        if (!playlistId) {
            return res.status(400).json({ error: "Playlist ID is required" });
        }

        await playlistService.removePlaylist(playlistId); // Gọi service đã xử lý toàn bộ logic xóa

        res.status(200).json({ message: "Remove playlist successfully" });
    } catch (err) {
        console.error("Error deleting playlist:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { removePlaylist, getPlaylistDetail,getPlaylistByUser, createPlaylist, addSong, removeSong };
