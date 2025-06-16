/**
 * AWS S3 configuration
 */
export interface AwsConfig {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
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
