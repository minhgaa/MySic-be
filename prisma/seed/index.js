const { PrismaClient } = require('../../src/generated/prisma/client');
const prisma = new PrismaClient();

const seedGenres = require('./genres.seed');
const seedSongs = require('./songs.seed');
const seedUsers = require('./users.seed');

const runSeed = async () => {
  try {
    await prisma.user.deleteMany();
    await prisma.song.deleteMany();
    await prisma.genre.deleteMany();
    const users = await seedUsers(prisma);
    const genres = await seedGenres(prisma);
    const songs = await seedSongs(prisma, users, genres);

    console.log('✅ Seed data thành công!');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

runSeed();
