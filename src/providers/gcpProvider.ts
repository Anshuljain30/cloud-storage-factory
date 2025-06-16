import { Storage } from '@google-cloud/storage';
import { BaseProvider } from './baseProvider';
import { GcpConfig } from '../common/shared-interfaces';

export class GcpProvider extends BaseProvider {
  private readonly storage: Storage;
  private readonly bucketName: string;

  constructor(config: GcpConfig) {
    super();
    this.storage = new Storage({
      keyFilename: config.keyFilename,
    });
    this.bucketName = config.bucket;
  }

  async uploadFile(localPath: string, remotePath: string): Promise<string> {
    try {
      this.validatePath(localPath);
      this.validatePath(remotePath);

      await this.storage.bucket(this.bucketName).upload(localPath, {
        destination: remotePath,
      });

      return `https://storage.googleapis.com/${this.bucketName}/${remotePath}`;
    } catch (error) {
      this.handleError('upload file', error);
    }
  }

  async uploadPreSignedUrl(remotePath: string): Promise<string> {
    try {
      this.validatePath(remotePath);

      const file = this.storage.bucket(this.bucketName).file(remotePath);
      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 3600 * 1000, // 1 hour
        contentType: 'application/octet-stream',
      });

      return url;
    } catch (error) {
      this.handleError('generate pre-signed URL', error);
    }
  }

  async downloadFile(remotePath: string, localPath: string): Promise<void> {
    try {
      this.validatePath(remotePath);
      this.validatePath(localPath);

      const options = { destination: localPath };
      await this.storage.bucket(this.bucketName).file(remotePath).download(options);
    } catch (error) {
      this.handleError('download file', error);
    }
  }

  async deleteFile(remotePath: string): Promise<void> {
    try {
      this.validatePath(remotePath);

      await this.storage.bucket(this.bucketName).file(remotePath).delete();
    } catch (error) {
      this.handleError('delete file', error);
    }
  }
}
