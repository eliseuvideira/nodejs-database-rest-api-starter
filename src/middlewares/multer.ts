import Multer from 'multer';
import { storage } from '../utils/storage';

const FILE_SIZE_LIMIT_IN_BYTES = 50 * 1024 * 1024; // 50 MB

export const multer = (contentTypes?: string[]) =>
  Multer({
    limits: {
      fileSize: FILE_SIZE_LIMIT_IN_BYTES,
    },
    storage,
    fileFilter: function (_req, file, cb) {
      if (!contentTypes) {
        cb(null, true);
        return;
      }
      if (contentTypes.includes(file.mimetype)) {
        cb(null, true);
        return;
      }
      cb(null, false);
    },
  });
