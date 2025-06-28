const seedSongs = async (prisma, users, genres) => {
  const pop = genres.find(g => g.name === 'Pop');
  const song1 = await prisma.song.create({
    data: {
      title: 'Người ấy',
      artist: 'Trịnh Thăng Bình',
      fileUrl: 'uploads/nguoi-ay.mp3',
      songImage: 'uploads/nguoi-ay.jpg',
      genreId: pop.id,
      userId: users.user1.id,
      status: 'approved'
    }
  });

  const song2 = await prisma.song.create({
    data: {
      title: 'Chạy ngay đi',
      artist: 'Sơn Tùng M-TP',
      fileUrl: 'uploads/chay-ngay-di.mp3',
      songImage: 'uploads/chay-ngay-di.jpg',
      genreId: pop.id,
      userId: users.user1.id,
      status: 'approved'
    }
  });

  return { song1, song2 };
};

module.exports = seedSongs;
