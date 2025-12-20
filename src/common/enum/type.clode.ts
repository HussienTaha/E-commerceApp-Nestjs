import { FILE_TYPES } from "../fileType";

export enum allowedTypesEnum {
Local="local",
Cloud="cloud"
}


export const allowedTypes = [
  ...Object?.values(FILE_TYPES.IMAGES),
  ...Object?.values(FILE_TYPES.VIDEOS),
  ...Object?.values(FILE_TYPES.AUDIOS),
  ...Object?.values(FILE_TYPES.DOCUMENTS),
];