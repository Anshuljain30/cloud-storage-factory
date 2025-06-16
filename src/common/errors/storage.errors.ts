/**
 * Custom error class for storage factory errors
 */
export class StorageFactoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageFactoryError';
  }
}
