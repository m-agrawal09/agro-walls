import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '474483762314945',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'l69YpXxIgQB1Wctdi8RUU1Q10p0',
});

export const uploadBufferToCloudinary = (
  fileBuffer: Buffer,
  folder = 'reconnect_reports'
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Cloudinary upload returned undefined'));
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
