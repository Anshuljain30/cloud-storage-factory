import { STORAGE_FACTORY_ERROR } from '../constants';

/**
 * Custom error class for storage factory errors
 */
export class StorageFactoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = STORAGE_FACTORY_ERROR;
  }
}
