import path from 'path';
import multer, { type StorageEngine } from 'multer';
import type { Request } from 'express';
import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postUploadPath = path.join(__dirname, 'uploads/posts');

if (!fs.existsSync(postUploadPath)) {
    fs.mkdirSync(postUploadPath, { recursive: true });
}

const postStorage: StorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, postUploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

export const uploadPostPhotosMiddleware = multer({ storage: postStorage });
