import { createReadStream, createWriteStream } from 'fs';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BaseProvider } from './baseProvider';
import { AwsConfig } from '../common/shared-interfaces';

export class AWSProvider extends BaseProvider {
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(config: AwsConfig) {
    super();
    this.s3Client = new S3Client({
      region: config.region,
      credentials: config.credentials,
    });
    this.bucket = config.bucket;
  }

  async uploadFile(filePath: string, destinationPath: string): Promise<string> {
    try {
      this.validatePath(filePath);
      this.validatePath(destinationPath);

      const fileStream = createReadStream(filePath);
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: destinationPath,
        Body: fileStream,
      });

      await this.s3Client.send(command);
      return `https://${this.bucket}.s3.amazonaws.com/${destinationPath}`;
    } catch (error) {
      this.handleError('upload file', error);
    }
  }

  async uploadPreSignedUrl(destinationPath: string): Promise<string> {
    try {
      this.validatePath(destinationPath);

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: destinationPath,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      this.handleError('generate pre-signed URL', error);
    }
  }

  async downloadFile(fileKey: string, localPath: string): Promise<void> {
    try {
      this.validatePath(fileKey);
      this.validatePath(localPath);

      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });

      const response = await this.s3Client.send(command);
      const fileStream = createWriteStream(localPath);

      if (!response.Body) {
        throw new Error('No body in response');
      }

      // @ts-ignore - AWS SDK types are not perfect
      response.Body.pipe(fileStream);

      return new Promise((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
      });
    } catch (error) {
      this.handleError('download file', error);
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    try {
      this.validatePath(fileKey);

      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });

      await this.s3Client.send(command);
    } catch (error) {
      this.handleError('delete file', error);
    }
  }
}
