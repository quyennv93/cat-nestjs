import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const MAX_SIZE = 1000000;
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error, acceptFile: boolean) => void,
) => {
  if (file.size > MAX_SIZE) {
    return cb(new BadRequestException('file too big'), false);
  }
  cb(null, true);
};

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error, acceptFile: boolean) => void,
) => {
  if (!MIME_TYPE_MAP[file.mimetype]) {
    return cb(new BadRequestException('invalid file type'), false);
  }
  fileFilter(req, file, cb);
};

const generateFileName = (
  req: Request,
  file: Express.Multer.File,
  cb: (err: Error, filename: string) => void,
) => {
  try {
    const extName = extname(file.originalname);
    const randomname = new Date().getTime().toString(36);
    cb(null, `${randomname}${extName}`);
  } catch (err) {
    console.log('error in generate filename');
  }
};

export const imageFileConfigs: MulterOptions = {
  storage: diskStorage({ destination: './upload', filename: generateFileName }),
  fileFilter: imageFilter,
};
