const bcrypt = require('bcrypt');

const seedUsers = async (prisma) => {
  const passwordHash = await bcrypt.hash('Minh123456', 10);

  const user1 = await prisma.user.create({
    data: {
      name: 'Minh',
      email: 'minh@gmail.com',
      password: passwordHash,
      role: 'user'
    }
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: passwordHash,
      role: 'admin'
    }
  });

  return { user1, admin };
}

module.exports = seedUsers;
