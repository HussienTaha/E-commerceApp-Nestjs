import type { Request } from "express";
import { FILE_TYPES } from "src/common/fileType";

export const allowOnlyImages =(files: any) => (
  req: Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  if (!Object.values(files).includes(file.mimetype)) {
    return cb(new Error('Only image files allowed'), false);
  }
  cb(null, true);
};
