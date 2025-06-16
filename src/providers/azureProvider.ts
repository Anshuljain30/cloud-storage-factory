import { createReadStream, createWriteStream } from 'fs';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} from '@azure/storage-blob';
import { BaseProvider } from './baseProvider';
import { AzureConfig } from '../common/shared-interfaces';

export class AzureProvider extends BaseProvider {
  private readonly containerClient;
  private readonly accountName: string;
  private readonly accountKey: string;
  private readonly containerName: string;

  constructor(config: AzureConfig) {
    super();
    this.accountName = config.accountName;
    this.accountKey = config.accountKey;
    this.containerName = config.containerName;

    const credential = new StorageSharedKeyCredential(this.accountName, this.accountKey);
    const blobServiceClient = new BlobServiceClient(
      `https://${this.accountName}.blob.core.windows.net`,
      credential,
    );
    this.containerClient = blobServiceClient.getContainerClient(this.containerName);
  }

  async uploadFile(localPath: string, remotePath: string): Promise<string> {
    try {
      this.validatePath(localPath);
      this.validatePath(remotePath);

      const blockBlobClient = this.containerClient.getBlockBlobClient(remotePath);
      const uploadStream = createReadStream(localPath);
      await blockBlobClient.uploadStream(uploadStream);

      return blockBlobClient.url;
    } catch (error) {
      this.handleError('upload file', error);
    }
  }

  async uploadPreSignedUrl(remotePath: string): Promise<string> {
    try {
      this.validatePath(remotePath);

      const blobClient = this.containerClient.getBlockBlobClient(remotePath);
      const expiresOn = new Date(new Date().valueOf() + 3600 * 1000); // 1 hour

      const sasToken = generateBlobSASQueryParameters(
        {
          containerName: this.containerName,
          blobName: remotePath,
          permissions: BlobSASPermissions.parse('cwr'), // create, write, read
          expiresOn,
          protocol: SASProtocol.Https,
        },
        new StorageSharedKeyCredential(this.accountName, this.accountKey),
      ).toString();

      return `${blobClient.url}?${sasToken}`;
    } catch (error) {
      this.handleError('generate pre-signed URL', error);
    }
  }

  async downloadFile(remotePath: string, localPath: string): Promise<void> {
    try {
      this.validatePath(remotePath);
      this.validatePath(localPath);

      const blockBlobClient = this.containerClient.getBlockBlobClient(remotePath);
      const downloadResponse = await blockBlobClient.download();
      const writableStream = createWriteStream(localPath);

      if (!downloadResponse.readableStreamBody) {
        throw new Error('No readable stream in response');
      }

      return new Promise((resolve, reject) => {
        downloadResponse
          .readableStreamBody!.pipe(writableStream)
          .on('error', reject)
          .on('finish', resolve);
      });
    } catch (error) {
      this.handleError('download file', error);
    }
  }

  async deleteFile(remotePath: string): Promise<void> {
    try {
      this.validatePath(remotePath);

      const blockBlobClient = this.containerClient.getBlockBlobClient(remotePath);
      await blockBlobClient.deleteIfExists();
    } catch (error) {
      this.handleError('delete file', error);
    }
  }
}
