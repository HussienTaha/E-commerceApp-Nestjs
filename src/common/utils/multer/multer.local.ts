import { Request } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import multer from 'multer';
import { object } from 'zod';
import { allowOnlyImages } from './filefilter';

export const multerLocal = (fileType = {}) => {
  return {
    storage: multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb: Function) => {
        const uploadPath = join(process.cwd(), 'uploads');

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      },
    }),

    fileFilter: allowOnlyImages(fileType),
    limits: { fileSize: 1024 * 1024 * 5 },
  };

};
