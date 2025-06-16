import { AWSProvider } from "./providers/awsProvider";
import { GcpProvider } from "./providers/gcpProvider";
import { AzureProvider } from "./providers/azureProvider";
import { CloudStorageProvider } from "./storage.interface";

type ProviderType = "aws" | "gcp" | "azure";

interface AwsConfig {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
}

interface GcpConfig {
  bucket: string;
  keyFilename: string;
}

interface AzureConfig {
  accountName: string;
  accountKey: string;
  containerName: string;
}

type ProviderConfig = AwsConfig | GcpConfig | AzureConfig;

export function StorageFactory(
  provider: ProviderType,
  config: ProviderConfig
): CloudStorageProvider {
  switch (provider) {
    case "aws":
      return new AWSProvider(config as AwsConfig);
    case "gcp":
      return new GcpProvider(config as GcpConfig);
    case "azure":
      return new AzureProvider(config as AzureConfig);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
