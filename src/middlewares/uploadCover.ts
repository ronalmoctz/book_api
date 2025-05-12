import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary';
import { logger } from '../helpers/logger';

const storage = new CloudinaryStorage({
    cloudinary,
    params: { folder: 'books', allowed_formats: ['jpg', 'png'] }
});

const fileFilter: multer.FileFilterCallback = (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg'];
    if (!allowed.includes(file.mimetype)) {
        logger.warn(`Archivo rechazado por mimetype: ${file.mimetype}`);
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
    }
    cb(null, true);
};

export const uploadCover = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter
});
