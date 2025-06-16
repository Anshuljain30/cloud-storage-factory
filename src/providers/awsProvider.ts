import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createReadStream, createWriteStream } from "fs";
import { CloudStorageProvider } from "../storage.interface";

export class AWSProvider implements CloudStorageProvider {
  private s3Client: S3Client;
  private bucket: string;

  constructor(config: {
    region: string;
    bucket: string;
    credentials?: { accessKeyId: string; secretAccessKey: string };
  }) {
    this.s3Client = new S3Client({
      region: config.region,
      credentials: config.credentials,
    });
    this.bucket = config.bucket;
  }

  async uploadFile(filePath: string, destinationPath: string): Promise<string> {
    const fileStream = createReadStream(filePath);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: destinationPath,
      Body: fileStream,
    });

    await this.s3Client.send(command);
    return `https://${this.bucket}.s3.amazonaws.com/${destinationPath}`;
  }

  async uploadPreSignedUrl(destinationPath: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: destinationPath,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async downloadFile(fileKey: string, localPath: string): Promise<void> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
    });

    const response = await this.s3Client.send(command);
    const fileStream = createWriteStream(localPath);

    if (response.Body) {
      // @ts-ignore - AWS SDK types are not perfect
      response.Body.pipe(fileStream);

      return new Promise((resolve, reject) => {
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });
    }

    throw new Error("No body in response");
  }

  async deleteFile(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
    });

    await this.s3Client.send(command);
  }
}
