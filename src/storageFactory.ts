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

// Function overloads for type safety
export function StorageFactory(provider: 'aws', config: AwsConfig): CloudStorageProvider;
export function StorageFactory(provider: 'azure', config: AzureConfig): CloudStorageProvider;
export function StorageFactory(provider: 'gcp', config: GcpConfig): CloudStorageProvider;
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
