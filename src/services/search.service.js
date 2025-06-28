const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

const searchSongsAndUsers = async (query) => {
  if (!query) return { songs: [], users: [] };

  const songs = await prisma.song.findMany({
    where: {
      status: 'approved',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { artist: { contains: query, mode: 'insensitive' } },
        { genre: { name: { contains: query, mode: 'insensitive' } } }
      ]
    },
    include: { genre: true }
  });

  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive"
      }
    },
    select: { id: true, name: true }
  });

  return { songs, users };
}

module.exports = { searchSongsAndUsers };
