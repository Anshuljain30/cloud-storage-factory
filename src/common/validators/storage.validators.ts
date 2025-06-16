import { AwsConfig, GcpConfig, AzureConfig } from '../shared-interfaces';
import { StorageFactoryError } from '../errors';
import { AWS_CONFIG_ERROR, GCP_CONFIG_ERROR, AZURE_CONFIG_ERROR } from '../constants';

/**
 * Validates AWS configuration
 */
export function validateAwsConfig(config: AwsConfig): void {
  if (
    !config.region ||
    !config.bucket ||
    !config.credentials ||
    !config.credentials.accessKeyId ||
    !config.credentials.secretAccessKey
  ) {
    throw new StorageFactoryError(AWS_CONFIG_ERROR);
  }
}

/**
 * Validates GCP configuration
 */
export function validateGcpConfig(config: GcpConfig): void {
  if (!config.bucket || !config.keyFilename) {
    throw new StorageFactoryError(GCP_CONFIG_ERROR);
  }
}

/**
 * Validates Azure configuration
 */
export function validateAzureConfig(config: AzureConfig): void {
  if (!config.accountName || !config.accountKey || !config.containerName) {
    throw new StorageFactoryError(AZURE_CONFIG_ERROR);
  }
}
