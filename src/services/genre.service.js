const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

const getAllGenres = async () => {
    return await prisma.genre.findMany({
        orderBy: {
            name: 'asc'
        }
    });
}
const getGenreById = async (id) => {
    const genre = await prisma.genre.findUnique({
      where: { id }
    });
    if (!genre) throw new Error('Genre not found');
    return genre;
  }

const createGenre = async (data) => {
    const existingGenre = await prisma.genre.findUnique({
        where: { name: data.name }
    });
    if (existingGenre) {
        throw new Error('Genre already exists');
    }
    return await prisma.genre.create({
        data
    })
}

const updateGenre = async (id, data) => {
  const genre = await prisma.genre.findUnique({ where: { id } });
  if (!genre) throw new Error('Genre not found');
  return await prisma.genre.update({ where: { id }, data });
};

const deleteGenre = async (id) => {
  const genre = await prisma.genre.findUnique({ where: { id } });
  if (!genre) throw new Error('Genre not found');
  return await prisma.genre.delete({ where: { id } });
};

module.exports = { getGenreById, getAllGenres, createGenre, updateGenre, deleteGenre };
