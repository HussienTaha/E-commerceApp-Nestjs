
import multer from 'multer';
import { allowedTypes, allowedTypesEnum } from 'src/common/enum/type.clode';
import type { Request } from 'express';
import os from 'os';
import { AppError } from 'src/common/service/errorhanseling';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerCloud = ({
  fileTypes = allowedTypes,
  storeType = allowedTypesEnum.Cloud,
}: {
  fileTypes?: string[];
  storeType?: allowedTypesEnum;
}): MulterOptions => {
  const storage =
    storeType === allowedTypesEnum.Cloud
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination: os.tmpdir(),
          filename(req: Request, file, cb) {
            cb(null, Date.now() + file.originalname);
          },
        });

  return {
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter(req: Request, file: Express.Multer.File, cb: Function) {
      if (fileTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new AppError('Invalid file type', 400), false);
      }
    },
  };
};
