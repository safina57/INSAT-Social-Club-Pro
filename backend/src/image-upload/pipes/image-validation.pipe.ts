import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { pipeline } from 'stream/promises';
import { Writable } from 'stream';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ];

  private readonly maxFileSizeInBytes = 10 * 1024 * 1024; // 10MB

  async transform(file: FileUpload | null): Promise<FileUpload | null> {
    if (!file) {
      return null;
    }

    const { mimetype, filename } = file;

    // Validate MIME type
    if (!this.allowedMimeTypes.includes(mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    // Validate file extension
    const fileExtension = filename.toLowerCase().split('.').pop();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`,
      );
    }

    try {
      const buffer = await this.streamToBuffer(file.createReadStream());
      const fileSize = buffer.length;

      // Validate file size
      if (fileSize > this.maxFileSizeInBytes) {
        throw new BadRequestException(
          `File size too large. Maximum allowed size: ${Math.round(this.maxFileSizeInBytes / (1024 * 1024))}MB`,
        );
      }

      return file;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error processing uploaded image file');
    }
  }

  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    const chunks: Buffer[] = [];

    const collectStream = new Writable({
      write(
        chunk: Buffer,
        _encoding: string,
        callback: (error?: Error | null) => void,
      ) {
        chunks.push(chunk);
        callback();
      },
    });

    try {
      await pipeline(stream, collectStream);
      return Buffer.concat(chunks);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Stream processing failed: ${errorMessage}`);
    }
  }
}
