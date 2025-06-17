import { AwsConfig, AzureConfig, GcpConfig, R2Config } from './storage.interface';

/**
 * Supported cloud storage providers
 */
export type ProviderType = 'aws' | 'gcp' | 'azure' | 'r2';

export type ProviderConfig = AwsConfig | AzureConfig | GcpConfig | R2Config;
