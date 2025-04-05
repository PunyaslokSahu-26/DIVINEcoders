import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  StorageReference,
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

export const useStorage = () => {
  const uploadFile = async (path: string, file: File) => {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const getFileURL = async (path: string) => {
    try {
      const storageRef = ref(storage, path);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  };

  const deleteFile = async (path: string) => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return path;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  const listFiles = async (path: string) => {
    try {
      const storageRef = ref(storage, path);
      const result = await listAll(storageRef);
      return result.items.map(item => item.fullPath);
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  };

  return {
    uploadFile,
    getFileURL,
    deleteFile,
    listFiles,
  };
}; 