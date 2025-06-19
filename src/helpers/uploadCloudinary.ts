import { cloudinary } from '../config/cloudinary.js';

export const uploadToCloudinary = async (fileBuffer: Buffer, fileName: string) => {
    return new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: 'image',
                public_id: `books/${fileName}`,
                overwrite: true,
            },
            (error, result) => {
                if (error || !result) return reject(error);
                return resolve(result.secure_url);
            }
        ).end(fileBuffer);
    });
};