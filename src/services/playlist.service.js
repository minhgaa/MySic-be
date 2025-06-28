const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();


const getPlaylistByUser = async (userId) => {
    return await prisma.playlist.findMany({
        where: {
            userId: userId
        },
        include: {
            songs: {
                include: {
                    song: true
                }
            },
            user: {
                select: { id: true, name: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

const getPlaylistDetail = async (playlistId) => {
    // Lấy thông tin playlist
    const playlist = await prisma.playlist.findUnique({
        where: { id: playlistId },
    });

    if (!playlist) {
        throw new Error("Playlist not found");
    }

    // Lấy các bài hát thuộc playlist đó
    const playlistSongs = await prisma.playlistSong.findMany({
        where: { playlistId },
        include: { song: true }, // include full song info
    });

    return {
        id: playlist.id,
        name: playlist.name,
        userId: playlist.userId,
        songs: playlistSongs.map(ps => ps.song), // chỉ lấy thông tin bài hát
    };
};


const createPlaylist = async (data) => {
    return await prisma.playlist.create({
        data: {
            name: data.name,
            userId: data.userId,
        }
    });
}

const addSongToPlaylist = async (playlistId, songId) => {
    // Kiểm tra xem bài hát đã tồn tại trong playlist chưa
    const existing = await prisma.playlistSong.findFirst({
        where: {
            playlistId,
            songId
        }
    });

    if (existing) {
        throw new Error("Song already exists in the playlist");
    }

    // Nếu chưa có, thì thêm mới
    return await prisma.playlistSong.create({
        data: {
            playlistId,
            songId,
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

const removePlaylist = async (playlistId) => {
    // Xóa các bản ghi liên quan trong playlistSong trước
    await prisma.playlistSong.deleteMany({
        where: { playlistId },
    });

    // Sau đó mới xóa playlist chính
    await prisma.playlist.deleteMany({
        where: { id: playlistId },
    });
}

module.exports = { removePlaylist, getPlaylistDetail, getPlaylistByUser, createPlaylist, addSongToPlaylist, removeSongFromPlaylist };
