/**
 * AWS S3 configuration
 */
export interface AwsConfig {
  region: string;
  bucket: string;
  credentials?: { accessKeyId: string; secretAccessKey: string };
}

/**
 * Google Cloud Storage configuration
 */
export interface GcpConfig {
  bucket: string;
  keyFilename: string;
}

/**
 * Azure Blob Storage configuration
 */
export interface AzureConfig {
  accountName: string;
  accountKey: string;
  containerName: string;
}

export interface CloudStorageProvider {
  uploadFile(filePath: string, destinationPath: string): Promise<string>;
  uploadPreSignedUrl(destinationPath: string): Promise<string>;
  downloadFile(fileKey: string, localPath: string): Promise<void>;
  deleteFile(fileKey: string): Promise<void>;
}
