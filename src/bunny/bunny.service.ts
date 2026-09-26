import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class BunnyService {
  async uploadFile(
  file: Express.Multer.File,
  folder: string,
): Promise<string> {

  if (!file) {
    throw new BadRequestException(
      'File is required',
    );
  }

  const extension =
    file.originalname.split('.').pop();

  const fileName =
    `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${extension}`;

  const filePath =
    `${folder}/${fileName}`;

  const uploadUrl =
    `https://storage.bunnycdn.com/swcp/${filePath}`;

  const response = await fetch(uploadUrl, {
    method: 'PUT',

    headers: {
      AccessKey:
        process.env.BUNNY_STORAGE_PASSWORD!,

      'Content-Type':
        'application/octet-stream',
    },

    body: new Uint8Array(file.buffer),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new BadRequestException(
      `Bunny upload failed: ${error}`,
    );
  }

  return filePath;
}
}