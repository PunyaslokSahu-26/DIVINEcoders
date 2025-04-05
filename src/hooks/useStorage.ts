import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  StorageReference,
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

export function useStorage() {
  const uploadFile = async (
    path: string,
    file: File,
    onProgress?: (progress: number) => void
  ) => {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      throw error;
    }
  };

  const getFileURL = async (path: string) => {
    try {
      const storageRef = ref(storage, path);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      throw error;
    }
  };

  const deleteFile = async (path: string) => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      throw error;
    }
  };

  const listFiles = async (path: string) => {
    try {
      const storageRef = ref(storage, path);
      const result = await listAll(storageRef);
      return result.items.map((item) => item.fullPath);
    } catch (error) {
      throw error;
    }
  };

  return {
    uploadFile,
    getFileURL,
    deleteFile,
    listFiles,
  };
} 