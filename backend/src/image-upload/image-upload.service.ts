import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { pipeline } from 'stream/promises';
import { Writable } from 'stream';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ImageUploadService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabaseClient: SupabaseClient,
  ) {}

  async uploadImage(file: FileUpload, bucketName: string): Promise<string> {
    console.log(file);
    const { createReadStream, filename, mimetype } = file;
    const uniqueFilename = `${uuidv4()}-${filename}`;

    try {
      const buffer = await this.streamToBuffer(createReadStream());

      const { error } = await this.supabaseClient.storage
        .from(bucketName)
        .upload(uniqueFilename, buffer, {
          contentType: mimetype,
          upsert: false,
        });

      if (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      const { data: publicUrlData } = this.supabaseClient.storage
        .from(bucketName)
        .getPublicUrl(uniqueFilename);

      return publicUrlData.publicUrl;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Image upload failed: ${errorMessage}`);
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
