import * as fs from 'fs';
import { join } from 'path';

export const isFileExists = (path: string) => fs.existsSync(path);
export const unlinkFile = (path: string) => fs.unlinkSync(path);
export const removeFileExists = (path: string) => {
  const exitsts = isFileExists(path);
  if (exitsts) {
    unlinkFile(path);
  }
};

export const removeWholeFolder = (path: string) =>
  fs.rmSync(path, { recursive: true, force: true });

export const removeAllFilesInFolder = (path: string) => {
  fs.readdir(path, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(join(path, file), (err) => {
        if (err) throw err;
      });
    }
  });
};
