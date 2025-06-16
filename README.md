# 🌩️ Cloud Storage SDK

A TypeScript-based SDK for seamless integration with **AWS S3**, **Azure Blob Storage**, and **Google Cloud Storage (GCP)**. Easily upload, download, delete, or generate pre-signed URLs using a common interface powered by the **Factory Pattern**.

---

## ✨ Features

- ✅ Upload files to cloud
- 🔐 Generate pre-signed upload URLs
- 📥 Download files
- ❌ Delete files
- ☁️ Unified API for AWS, Azure, and GCP
- 🏗️ Extensible provider structure

---

## 📦 Installation

```bash
npm install cloud-storage-sdk
```

---

## 🛠️ Usage

### 1. Import and initialize a provider using `StorageFactory`:

```ts
import { StorageFactory } from "cloud-storage-sdk";

const storage = StorageFactory("aws", {
  region: "us-east-1",
  bucket: "your-bucket-name",
});
```

### 2. Use the storage methods:

```ts
// Upload a file
await storage.uploadFile("local/path/to/file.txt", "remote/path/file.txt");

// Get a pre-signed upload URL
const url = await storage.uploadPreSignedUrl("uploads/image.png");

// Download a file
await storage.downloadFile("remote/path/file.txt", "local/path/output.txt");

// Delete a file
await storage.deleteFile("remote/path/file.txt");
```

---

## ☁️ Supported Providers

| Provider             | Status         | SDK Used                |
| -------------------- | -------------- | ----------------------- |
| AWS S3               | ✅ Supported   | `@aws-sdk/client-s3`    |
| Azure Blob Storage   | 🔜 Coming Soon | `@azure/storage-blob`   |
| Google Cloud Storage | 🔜 Coming Soon | `@google-cloud/storage` |

---

## 🧱 Factory Pattern Structure

```ts
const storage = StorageFactory("aws" | "azure" | "gcp", configObject);
```

Each provider implements the same interface:

```ts
interface CloudStorageProvider {
  uploadFile(filePath: string, destinationPath: string): Promise<string>;
  uploadPreSignedUrl(destinationPath: string): Promise<string>;
  downloadFile(fileKey: string, localPath: string): Promise<void>;
  deleteFile(fileKey: string): Promise<void>;
}
```

---

## 🧪 Example Project

Check out the [`/examples`](./examples/) folder for sample usage with Express.js or other setups.

---

## 📁 Directory Structure

```
cloud-storage-sdk/
├── src/
│   ├── providers/          # AWS, Azure, GCP logic
│   ├── storageFactory.ts   # Factory to choose provider
│   ├── storage.interface.ts
│   └── index.ts            # Entry point
├── dist/                   # Compiled JavaScript
├── examples/               # Usage examples
├── README.md
├── .gitignore
├── .npmignore
└── package.json
```

---

## 🔒 Security

- No secrets are stored.
- All SDKs use official client libraries and secure HTTPS communication.

---

## 📜 License

[MIT](./LICENSE)

---

## 👨‍💻 Author

Made with ❤️ by [Anshul Jain](https://github.com/yourusername)

---
