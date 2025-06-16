import { AWSProvider, AzureProvider, GcpProvider } from './providers';
import {
  CloudStorageProvider,
  ProviderType,
  ProviderConfig,
  AwsConfig,
  GcpConfig,
  AzureConfig,
} from './common/shared-interfaces';
import { StorageFactoryError } from './common/errors';
import { validateAwsConfig, validateGcpConfig, validateAzureConfig } from './common/validators';

/**
 * Factory function to create cloud storage provider instances
 * @param provider - The type of cloud storage provider to create
 * @param config - Configuration object for the selected provider
 * @returns An instance of CloudStorageProvider
 * @throws {StorageFactoryError} If the provider is unsupported or configuration is invalid
 */
export function StorageFactory(
  provider: ProviderType,
  config: ProviderConfig,
): CloudStorageProvider {
  try {
    switch (provider) {
      case 'aws': {
        const awsConfig = config as AwsConfig;
        validateAwsConfig(awsConfig);
        return new AWSProvider(awsConfig);
      }
      case 'gcp': {
        const gcpConfig = config as GcpConfig;
        validateGcpConfig(gcpConfig);
        return new GcpProvider(gcpConfig);
      }
      case 'azure': {
        const azureConfig = config as AzureConfig;
        validateAzureConfig(azureConfig);
        return new AzureProvider(azureConfig);
      }
      default:
        throw new StorageFactoryError(`Unsupported provider: ${provider}`);
    }
  } catch (error: unknown) {
    if (error instanceof StorageFactoryError) {
      throw error;
    }
    throw new StorageFactoryError(
      `Failed to create storage provider: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
