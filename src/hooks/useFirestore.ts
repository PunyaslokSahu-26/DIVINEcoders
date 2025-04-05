import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useFirestore() {
  const getDocument = async (collectionName: string, documentId: string) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      throw error;
    }
  };

  const getCollection = async (
    collectionName: string,
    constraints: QueryConstraint[] = []
  ) => {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw error;
    }
  };

  const addDocument = async (collectionName: string, data: DocumentData) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  };

  const updateDocument = async (
    collectionName: string,
    documentId: string,
    data: DocumentData
  ) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, data);
    } catch (error) {
      throw error;
    }
  };

  const deleteDocument = async (collectionName: string, documentId: string) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
    } catch (error) {
      throw error;
    }
  };

  const queryDocuments = async (
    collectionName: string,
    field: string,
    operator: any,
    value: any
  ) => {
    try {
      const q = query(
        collection(db, collectionName),
        where(field, operator, value)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw error;
    }
  };

  return {
    getDocument,
    getCollection,
    addDocument,
    updateDocument,
    deleteDocument,
    queryDocuments,
  };
} 