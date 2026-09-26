import { diskStorage } from 'multer';
import { extname } from 'path';

export const uploadStorage = (folder: string) =>
  diskStorage({
    destination: `./uploads/${folder}`,

    filename: (req, file, callback) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');

      callback(null, `${randomName}${extname(file.originalname)}`);
    },
  });
