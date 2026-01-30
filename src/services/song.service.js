const { PrismaClient } = require('../generated/prisma/client');
const { uploadFile, deleteFile } = require('./s3.service');
const fs = require('fs').promises;
const path = require('path');
const prisma = new PrismaClient();
const axios = require('axios');
const FormData = require('form-data');



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

const uploadSong = async (data, files) => {
    try {
        // Lưu file tạm thời vào local storage
        const uploadDir = path.join(__dirname, '../../uploads/temp');
        await fs.mkdir(uploadDir, { recursive: true });

        let tempAudioPath = null;

        if (files.audioFile) {
            const audioFileName = `${Date.now()}-${files.audioFile[0].originalname}`;
            tempAudioPath = path.join(uploadDir, audioFileName);
            await fs.writeFile(tempAudioPath, files.audioFile[0].buffer);
        }


        return await prisma.song.create({
            data: {
                title: data.title,
                artist: data.artist,
                genreId: data.genreId,
                userId: data.userId,
                lyrics: data.lyrics,
                fileUrl: tempAudioPath, // Lưu đường dẫn tạm
                songImage: data.songImage, 
                status: 'pending'
            }
        });
    } catch (error) {
        throw error;
    }
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
  return await prisma.song.findFirst({
    where: {
      id: songId,
      status: 'approved'
    },
    include: {
      genre: true,
      user: {
        select: { id: true, name: true }
      }
    }
  });
};

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

const getSongsByUser = async (userId) => {
  return await prisma.song.findMany({
    where: {
      userId
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
  console.log(`[START] updateSongStatus | SongId: ${songId} | Status: ${status}`);
  
  const song = await prisma.song.findUnique({ where: { id: songId } });
  if (!song) {
    console.error(`[ERROR] Song not found | SongId: ${songId}`);
    throw new Error('Song not found');
  }

  let fileUrl = song.fileUrl;
  let currentStep = 'INIT'; // Biến để theo dõi tiến trình

  // ======================
  // APPROVE
  // ======================
  if (status === 'approved') {
    try {
      currentStep = 'VALIDATE_FILE_PATH';
      if (!song.fileUrl || song.fileUrl.startsWith('http')) {
        throw new Error(`Invalid local audio file path: ${song.fileUrl}`);
      }

      // 1️⃣ Read mp3 file
      currentStep = 'READ_LOCAL_FILE';
      console.log(`[INFO] Reading file: ${song.fileUrl}`);
      const audioBuffer = await fs.readFile(song.fileUrl);

      // 2️⃣ Call BE audio (send mp3)
      currentStep = 'CALL_AUDIO_SERVICE';
      const formData = new FormData();
      formData.append('songId', song.id);
      formData.append('title', song.title);
      formData.append('artist', song.artist);
      formData.append('audio', audioBuffer, {
        filename: path.basename(song.fileUrl),
        contentType: 'audio/mpeg'
      });

      const audioServiceUrl = 'http://host.docker.internal:3000/api/audio/add-song';
      console.log(`[INFO] Calling Audio Service: ${audioServiceUrl}`);

      await axios.post(audioServiceUrl, formData, {
        headers: { ...formData.getHeaders() },
        maxBodyLength: Infinity
      });

      // 3️⃣ Upload S3
      currentStep = 'UPLOAD_S3';
      console.log(`[INFO] Uploading to S3...`);
      const audioFile = {
        buffer: audioBuffer,
        originalname: path.basename(song.fileUrl),
        mimetype: 'audio/mpeg'
      };

      fileUrl = await uploadFile(audioFile, 'songs');
      console.log(`[INFO] Uploaded S3 success: ${fileUrl}`);

      // 4️⃣ Delete local temp file
      currentStep = 'CLEANUP_LOCAL_FILE';
      await fs.unlink(song.fileUrl).catch((err) => {
        // Log warning thôi, không throw lỗi vì quy trình chính đã xong
        console.warn(`[WARN] Failed to clean up file: ${song.fileUrl}`, err.message);
      });

    } catch (error) {
      // --- LOGGING CHI TIẾT ---
      console.error('========================================');
      console.error(`[FATAL ERROR] Approve Song Failed | SongId: ${songId}`);
      console.error(`FAILED AT STEP: [${currentStep}]`);
      
      // Xử lý lỗi Axios (API)
      if (axios.isAxiosError(error)) {
        console.error('>>> AXIOS ERROR DETAILS:');
        console.error('Method:', error.config?.method?.toUpperCase());
        console.error('URL:', error.config?.url);
        console.error('Status:', error.response?.status);
        console.error('Response Data:', JSON.stringify(error.response?.data, null, 2));
      } 
      // Xử lý lỗi File System
      else if (error.code === 'ENOENT') {
         console.error('>>> FILE ERROR: File not found or not accessible.');
         console.error('Path:', error.path);
      }
      // Các lỗi khác
      else {
        console.error('>>> GENERAL ERROR:', error.message);
        console.error('Stack:', error.stack);
      }
      console.error('========================================');

      throw new Error(`Failed to approve song at step ${currentStep}: ${error.message}`);
    }
  }

  // ======================
  // REJECT
  // ======================
  if (status === 'rejected') {
    console.log(`[INFO] Rejecting song, cleaning up files...`);
    
    if (song.fileUrl && !song.fileUrl.startsWith('http')) {
      await fs.unlink(song.fileUrl).catch((err) => 
        console.warn(`[WARN] Failed to delete local audio: ${song.fileUrl}`, err.message)
      );
    }
    
    if (song.songImage && !song.songImage.startsWith('http')) {
      await fs.unlink(song.songImage).catch((err) => 
        console.warn(`[WARN] Failed to delete local image: ${song.songImage}`, err.message)
      );
    }
  }

  // ======================
  // UPDATE DB
  // ======================
  try {
    const result = await prisma.song.update({
      where: { id: songId },
      data: { status, fileUrl }
    });
    console.log(`[SUCCESS] Song status updated to: ${status}`);
    return result;
  } catch (dbError) {
    console.error(`[ERROR] Failed to update Prisma DB for SongId: ${songId}`, dbError);
    throw dbError;
  }
};

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
  
  // Xóa files từ S3 hoặc local
  if (song.fileUrl) {
    if (song.fileUrl.startsWith('http')) {
      await deleteFile(song.fileUrl).catch(() => {});
    } else {
      await fs.unlink(song.fileUrl).catch(() => {});
    }
  }
  if (song.songImage) {
    if (song.songImage.startsWith('http')) {
      await deleteFile(song.songImage).catch(() => {});
    } else {
      await fs.unlink(song.songImage).catch(() => {});
    }
  }
  
  return await prisma.song.delete({
    where: { id }
  });
}

const getLikeCount = async (songId) => {
  try {
    console.log("Counting likes for songId:", songId);
    const count = await prisma.like.count({
      where: { songId }
    });
    console.log("Like count:", count);
    return count;
  } catch (error) {
    console.error("Error in getLikeCount service:", error);
    throw error;
  }
};

const syncSongStatus = async (s3Key, streamUrl) => {
    try {
        // Tìm song có fileUrl chứa s3Key
        const existingSong = await prisma.song.findFirst({
            where: {
                fileUrl: {
                    contains: s3Key
                }
            }
        });

        if (!existingSong) {
            return null;
        }

        // Cập nhật fileUrl với streamUrl mới (CloudFront URL)
        const updatedSong = await prisma.song.update({
            where: { id: existingSong.id },
            data: { fileUrl: streamUrl }
        });

        return updatedSong;
    } catch (error) {
        console.error('Error syncing song status:', error);
        throw error;
    }
};

module.exports = { 
    getLikeCount, 
    getSongsByUser, 
    uploadSong, 
    getSongsByStatus, 
    getSongsByGenre, 
    getAllSongs, 
    getSongLyrics, 
    getSongById, 
    likeSong, 
    reportSong, 
    getTopSongs, 
    getRecommendedSongs, 
    getPendingSongs, 
    updateSongStatus, 
    updateSong, 
    deleteSong,
    syncSongStatus 
};
