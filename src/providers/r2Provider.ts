import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createReadStream, createWriteStream } from 'fs';
import { BaseProvider } from './baseProvider';
import { R2Config } from '../common/shared-interfaces/storage.interface';

export class R2Provider extends BaseProvider {
  private client: S3Client;
  private bucket: string;

  constructor(config: R2Config) {
    super();
    this.bucket = config.bucket;
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async uploadFile(localPath: string, remotePath: string): Promise<string> {
    try {
      this.validatePath(localPath);
      this.validatePath(remotePath);

      const fileStream = createReadStream(localPath);
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: remotePath,
        Body: fileStream,
      });

      await this.client.send(command);
      return remotePath;
    } catch (error) {
      this.handleError('upload file', error);
    }
  }

  async uploadPreSignedUrl(remotePath: string): Promise<string> {
    try {
      this.validatePath(remotePath);

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: remotePath,
      });

      return await getSignedUrl(this.client, command, { expiresIn: 3600 });
    } catch (error) {
      this.handleError('generate upload pre-signed URL', error);
    }
  }

  async downloadFile(remotePath: string, localPath: string): Promise<void> {
    try {
      this.validatePath(remotePath);
      this.validatePath(localPath);

      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: remotePath,
      });

      const response = await this.client.send(command);
      const fileStream = createWriteStream(localPath);

      if (response.Body) {
        // @ts-ignore - Body is a ReadableStream
        response.Body.pipe(fileStream);

        return new Promise((resolve, reject) => {
          fileStream.on('finish', resolve);
          fileStream.on('error', reject);
        });
      }
    } catch (error) {
      this.handleError('download file', error);
    }
  }

  async deleteFile(remotePath: string): Promise<void> {
    try {
      this.validatePath(remotePath);

      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: remotePath,
      });

      await this.client.send(command);
    } catch (error) {
      this.handleError('delete file', error);
    }
  }
}
