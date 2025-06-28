const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

const getUsers = async() => {
    return await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, avatarUrl: true, email: true, role: true, createdAt: true }
    })
}

const getUserById = async (id) => {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true
      }
    });
  };

const updateUser = async(userId, data) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    return await prisma.user.update({
        where: { id: userId },
        data
    })
}

const deleteUser = async(userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    return await prisma.user.delete({ where: { id: userId } });
}

module.exports = { getUserById, getUsers, updateUser, deleteUser };
