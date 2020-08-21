import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { STORAGE_PATH } from './constants';

export const storage = diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, STORAGE_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, uuid());
  },
});
