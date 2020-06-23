import IStorageProvider from '../models/IStorageProvider';
import uploadsConfig from '@config/upload';
import fs from 'fs';
import path from 'path';

export default class DiskStorageProvider implements IStorageProvider {

  public async saveFile(file: string): Promise<string>{

    await fs.promises.rename(
      path.resolve(uploadsConfig.tmpFolder, file),
      path.resolve(uploadsConfig.uploadFolder, file),
    );

    return file;

  }

  public async deleteFile(file: string): Promise<void>{
    const filePath = path.resolve(uploadsConfig.uploadFolder, file);

    try{
      await fs.promises.stat(filePath);
    }catch{
      return;
    }

    await fs.promises.unlink(filePath);
  }

}
