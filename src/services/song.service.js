const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

const getAllSongs = async () => {
    return await prisma.song.findMany({
        where: {
            status: 'approved'
        },
        include: {
            genre: true,
            user: {
                select: { id: true, name: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

const uploadSong = async (data) => {
    return await prisma.song.create({
        data: {
            title: data.title,
            artist: data.artist,
            genreId: data.genreId,
            userId: data.userId,
            lyrics: data.lyrics,
            fileUrl: data.fileUrl,
            songImage: data.songImage,
            status: 'pending'
        }
    })
};

const getSongLyrics = async (songId) => {
    const song = await prisma.song.findUnique({
        where: { id: songId, status: 'approved' },
        select: { id: true, title: true, lyrics: true }
    });

    if (!song) {
        throw new Error('Song not found');
    }
    return song;
}

const getSongById = async (songId) => {
    const song = await prisma.song.findUnique({
        where: { id: songId, status: 'approved' },
        include: {
            genre: true, title: true,
            user: {
                select: { id: true, name: true }
            }
        }
    });
    return song;
}

const likeSong = async (songId, userId) => {
    return await prisma.like.create({
        data: {
            songId: songId,
            userId: userId
        }
    });
}

const getSongsByGenre = async (genreId) => {
  return await prisma.song.findMany({
    where: {
      genreId,
      status: 'approved'
    },
    include: {
      genre: true,
      user: {
        select: { id: true, name: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const getSongsByStatus = async (status) => {
  return await prisma.song.findMany({
    where: {
      status
    },
    include: {
      genre: true,
      user: {
        select: { id: true, name: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const reportSong = async (songId, userId, reason) => {
    return await prisma.report.create({
        data: {
            songId,
            userId,
            reason
        }
    });
}

const getTopSongs = async () => {
    return await prisma.song.findMany({
        where: { status: 'approved' },
        orderBy: {
            likes: {
                _count: 'desc'
            }
        },
        include: {
            select: { id: true, title: true, artist: true, fileUrl: true, songImage: true },
            genre: true,
            user: {
                select: { id: true, name: true }
            },
            _count: {
                select: { likes: true }
            }
        },
        take: 10
    })
}

const getRecommendedSongs = async (userId) => {
    const topLike = await prisma.like.findFirst({
        where: { userId },
        orderBy: {
            createdAt: 'desc'
        }
    });

    if (!topLike) {
        return await prisma.song.findMany({
            where: { status: 'approved' },
            take: 5
        });
    }

    const likedSong = await prisma.song.findUnique({
        where: { id: topLike.songId }
    });

    return await prisma.song.findMany({
        where: {
            status: 'approved',
            genreId: likedSong.genreId,
            NOT: { id: likedSong.id }
        },
        take: 5
    });
};

const getPendingSongs = async () => {
  return await prisma.song.findMany({
    where: { status: 'pending' },
    include: {
      genre: true,
      user: {
        select: { id: true, name: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

const updateSongStatus = async (songId, status) => {
  const song = await prisma.song.findUnique({ where: { id: songId}});
  if (!song) {
    throw new Error('Song not found');
  }
  return await prisma.song.update({
    where: { id: songId },
    data: { status }
  });
}

const updateSong = async (id, data) => {
  const song = await prisma.song.findUnique({ where: { id }});
  if (!song) {
    throw new Error('Song not found');
  }
  return await prisma.song.update({
    where: { id },
    data
  });
}

const deleteSong = async (id) => {
  const song = await prisma.song.findUnique({ where: { id }});
  if (!song) {
    throw new Error('Song not found');
  }
  return await prisma.song.delete({
    where: { id }
  })
}

module.exports = { uploadSong, getSongsByStatus, getSongsByGenre, getAllSongs, getSongLyrics, getSongById, likeSong, reportSong, getTopSongs, getRecommendedSongs, getPendingSongs, updateSongStatus, updateSong, deleteSong };
