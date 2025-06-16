import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} from '@azure/storage-blob';
import { CloudStorageProvider } from '../common/shared-interfaces';
import * as fs from 'fs';

interface AzureConfig {
  accountName: string;
  accountKey: string;
  containerName: string;
}

export class AzureProvider implements CloudStorageProvider {
  private containerClient;
  private accountName: string;
  private accountKey: string;
  private containerName: string;

  constructor(config: AzureConfig) {
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
    const blockBlobClient = this.containerClient.getBlockBlobClient(remotePath);
    const uploadStream = fs.createReadStream(localPath);
    await blockBlobClient.uploadStream(uploadStream);

    return blockBlobClient.url;
  }

  async uploadPreSignedUrl(remotePath: string): Promise<string> {
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
  }

  async downloadFile(remotePath: string, localPath: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(remotePath);
    const downloadResponse = await blockBlobClient.download();
    const writableStream = fs.createWriteStream(localPath);

    return new Promise((resolve, reject) => {
      downloadResponse.readableStreamBody
        ?.pipe(writableStream)
        .on('error', reject)
        .on('finish', resolve);
    });
  }

  async deleteFile(remotePath: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(remotePath);
    await blockBlobClient.deleteIfExists();
  }
}
