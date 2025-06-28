const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

const createReport = async (data) => {
  return await prisma.report.create({ data });
};

const getReports = async () => {
    return await prisma.report.findMany({
        include: {
            song: { select: { id: true, title: true, artist: true} },
            user: { select: { id: true, name: true, email: true }}
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

const deleteReport = async (id) => {
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) throw new Error('Report không tồn tại');
  return await prisma.report.delete({ where: { id } });
};

module.exports = { createReport, getReports, deleteReport};
