import { Storage } from "@google-cloud/storage";
import * as path from "path";
import * as fs from "fs";
import { CloudStorageProvider } from "../storage.interface";

interface GcpConfig {
  bucket: string;
  keyFilename: string; // Path to the GCP service account JSON
}

export class GcpProvider implements CloudStorageProvider {
  private storage: Storage;
  private bucketName: string;

  constructor(config: GcpConfig) {
    this.storage = new Storage({
      keyFilename: config.keyFilename,
    });
    this.bucketName = config.bucket;
  }

  async uploadFile(localPath: string, remotePath: string): Promise<string> {
    await this.storage.bucket(this.bucketName).upload(localPath, {
      destination: remotePath,
    });

    return `https://storage.googleapis.com/${this.bucketName}/${remotePath}`;
  }

  async uploadPreSignedUrl(remotePath: string): Promise<string> {
    const file = this.storage.bucket(this.bucketName).file(remotePath);
    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 3600 * 1000, // 1 hour
      contentType: "application/octet-stream",
    });

    return url;
  }

  async downloadFile(remotePath: string, localPath: string): Promise<void> {
    const options = { destination: localPath };
    await this.storage
      .bucket(this.bucketName)
      .file(remotePath)
      .download(options);
  }

  async deleteFile(remotePath: string): Promise<void> {
    await this.storage.bucket(this.bucketName).file(remotePath).delete();
  }
}
