import { CloudStorageProvider } from '../common/shared-interfaces';

export abstract class BaseProvider implements CloudStorageProvider {
  protected constructor() {}

  abstract uploadFile(localPath: string, remotePath: string): Promise<string>;
  abstract uploadPreSignedUrl(remotePath: string): Promise<string>;
  abstract downloadFile(remotePath: string, localPath: string): Promise<void>;
  abstract deleteFile(remotePath: string): Promise<void>;

  protected handleError(operation: string, error: unknown): never {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to ${operation}: ${errorMessage}`);
  }

  protected validatePath(path: string): void {
    if (!path || typeof path !== 'string') {
      throw new Error('Invalid path provided');
    }
  }
} 