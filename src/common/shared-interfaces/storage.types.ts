import { AwsConfig, AzureConfig, GcpConfig } from './storage.interface';

/**
 * Supported cloud storage providers
 */
export type ProviderType = 'aws' | 'gcp' | 'azure';

export type ProviderConfig = AwsConfig | AzureConfig | GcpConfig;
