const seedGenres = async (prisma) => {
  const genres = [
    { name: 'Pop' },
    { name: 'Rock' },
    { name: 'Ballad' },
    { name: 'Rap' },
    { name: 'R&B' },
    { name: 'Indie' },
    { name: 'EDM' },
    { name: 'Dance' },
    { name: 'Acoustic' },
    { name: 'Jazz' },
    { name: 'Hip Hop' },
    { name: 'Classical' },
    { name: 'Country' },
    { name: 'Lo-fi' },
    { name: 'Chill' }
  ];

  await prisma.genre.createMany({
    data: genres
  });

  const allGenres = await prisma.genre.findMany();
  return allGenres;
};

module.exports = seedGenres;
