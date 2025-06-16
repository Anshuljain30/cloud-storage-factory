import { AwsConfig, GcpConfig, AzureConfig } from '../types/storage.types';
import { StorageFactoryError } from '../errors/storage.errors';

/**
 * Validates AWS configuration
 */
export function validateAwsConfig(config: AwsConfig): void {
  if (!config.region || !config.bucket || !config.accessKeyId || !config.secretAccessKey) {
    throw new StorageFactoryError('Invalid AWS configuration: missing required fields');
  }
}

/**
 * Validates GCP configuration
 */
export function validateGcpConfig(config: GcpConfig): void {
  if (!config.bucket || !config.keyFilename) {
    throw new StorageFactoryError('Invalid GCP configuration: missing required fields');
  }
}

/**
 * Validates Azure configuration
 */
export function validateAzureConfig(config: AzureConfig): void {
  if (!config.accountName || !config.accountKey || !config.containerName) {
    throw new StorageFactoryError('Invalid Azure configuration: missing required fields');
  }
}
