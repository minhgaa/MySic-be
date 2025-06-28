const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

const createPlaylist = async (data) => {
    return await prisma.playlist.create({
        data: {
            name: data.name,
            userId: data.userId,
        }
    });
}

const addSongToPlaylist = async (playlistId, songId) => {
    return await prisma.playlistSong.create({
        data: {
            playlistId: playlistId,
            songId: songId,
        }
    });
}

const removeSongFromPlaylist = async (playlistId, songId) => {
    return await prisma.playlistSong.deleteMany({
        where: {
            playlistId: playlistId,
            songId: songId
        }
    });
}

module.exports = { createPlaylist, addSongToPlaylist, removeSongFromPlaylist };
