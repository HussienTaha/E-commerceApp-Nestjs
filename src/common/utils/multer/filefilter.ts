import { FILE_TYPES } from "src/common/fileType";

export const allowOnlyImages = (
  req: Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  if (!Object.values(FILE_TYPES.IMAGES).includes(file.mimetype)) {
    return cb(new Error('Only image files allowed'), false);
  }
  cb(null, true);
};
