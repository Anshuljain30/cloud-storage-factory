# 🌩️ Cloud Storage Factory

[![npm version](https://img.shields.io/npm/v/cloud-storage-factory.svg)](https://www.npmjs.com/package/cloud-storage-factory)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A robust TypeScript-based SDK that provides a unified interface for interacting with major cloud storage providers (AWS S3, Azure Blob Storage, and Google Cloud Storage). This SDK simplifies cloud storage operations while maintaining type safety and flexibility.

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#️-usage)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Examples](#-examples)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🚀 **Unified API**: Consistent interface across all supported cloud providers
- 📤 **File Operations**: Upload, download, and delete files with ease
- 🔗 **Pre-signed URLs**: Generate secure, time-limited upload URLs
- 🔒 **Type Safety**: Full TypeScript support with comprehensive type definitions
- 🎯 **Factory Pattern**: Easy provider switching and configuration
- 📦 **Zero Dependencies**: Lightweight and efficient
- 🔄 **Async/Await**: Modern Promise-based API
- 🛠️ **Extensible**: Easy to add support for new cloud providers

## 📦 Installation

```bash
# Using npm
npm install cloud-storage-factory

# Using yarn
yarn add cloud-storage-factory

# Using pnpm
pnpm add cloud-storage-factory
```

## 🛠️ Usage

### 1. Import the Factory

```typescript
import { StorageFactory } from 'cloud-storage-factory';
```

### 2. Initialize a Provider

#### AWS S3

```typescript
const storage = StorageFactory('aws', {
  region: 'us-east-1',
  bucket: 'your-bucket-name',
  accessKeyId: 'your-access-key',
  secretAccessKey: 'your-secret-key',
  // Optional configurations
  endpoint: 'https://s3.amazonaws.com', // Custom endpoint
  s3ForcePathStyle: true, // Use path-style URLs
});
```

#### Azure Blob Storage

```typescript
const storage = StorageFactory('azure', {
  accountName: 'your-account-name',
  accountKey: 'your-account-key',
  containerName: 'your-container-name',
  // Optional configurations
  endpoint: 'https://your-account.blob.core.windows.net',
  sasToken: 'your-sas-token', // Optional SAS token
});
```

#### Google Cloud Storage

```typescript
const storage = StorageFactory('gcp', {
  bucket: 'your-gcp-bucket-name',
  keyFilename: 'path/to/service-account.json',
  // Optional configurations
  projectId: 'your-project-id',
  apiEndpoint: 'https://storage.googleapis.com',
});
```

### 3. Use the Storage Methods

```typescript
// Upload a file
await storage.uploadFile('local/path.txt', 'remote/path.txt', {
  contentType: 'text/plain',
  metadata: { key: 'value' },
});

// Generate a pre-signed upload URL (valid for 1 hour)
const url = await storage.uploadPreSignedUrl('remote/upload.txt', {
  expiresIn: 3600,
  contentType: 'application/json',
});

// Download a file
await storage.downloadFile('remote/path.txt', 'local/downloaded.txt');

// Delete a file
await storage.deleteFile('remote/path.txt');

// List files in a directory
const files = await storage.listFiles('remote/directory/');
```

## 📑 Supported Cloud Providers

| Provider | Status | Required Config                              | Optional Config            |
| -------- | ------ | -------------------------------------------- | -------------------------- |
| AWS      | ✅     | region, bucket, accessKeyId, secretAccessKey | endpoint, s3ForcePathStyle |
| Azure    | ✅     | accountName, accountKey, containerName       | endpoint, sasToken         |
| GCP      | ✅     | bucket, keyFilename                          | projectId, apiEndpoint     |

## 🔧 Troubleshooting

### Common Issues

1. **Authentication Errors**

   - Verify your credentials are correct
   - Check if your credentials have expired
   - Ensure proper permissions are set

2. **Network Issues**

   - Check your internet connection
   - Verify firewall settings
   - Ensure proper endpoint configuration

3. **File Operations**
   - Verify file paths are correct
   - Check file permissions
   - Ensure sufficient storage space

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Anshuljain30/cloud-storage-factory.git

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

## 📄 License

MIT License © 2025

---

Made with ❤️ by Anshul Jain
