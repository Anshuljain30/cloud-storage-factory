export interface CloudStorageProvider {
  uploadFile(filePath: string, destinationPath: string): Promise<string>;
  uploadPreSignedUrl(destinationPath: string): Promise<string>;
  downloadFile(fileKey: string, localPath: string): Promise<void>;
  deleteFile(fileKey: string): Promise<void>;
}
