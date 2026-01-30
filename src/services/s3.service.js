const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3.config');
const crypto = require('crypto');
const path = require('path');

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const uploadFile = async (file, folder = 'songs') => {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
    
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    try {
        await s3Client.send(new PutObjectCommand(params));
        return `https://d58vokudzsdux.cloudfront.net/${fileName}`;
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw new Error('Failed to upload file to S3');
    }
};

const deleteFile = async (fileUrl) => {
    try {
        const url = new URL(fileUrl);
        const key = url.pathname.substring(1);
        
        const params = {
            Bucket: BUCKET_NAME,
            Key: key
        };

        await s3Client.send(new DeleteObjectCommand(params));
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        throw new Error('Failed to delete file from S3');
    }
};

module.exports = { uploadFile, deleteFile };
