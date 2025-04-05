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

export const useFirestore = () => {
  const getDocument = async (collectionName: string, documentId: string) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  };

  const getCollection = async (
    collectionName: string,
    constraints: QueryConstraint[] = []
  ) => {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting collection:', error);
      throw error;
    }
  };

  const addDocument = async (collectionName: string, data: DocumentData) => {
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  };

  const updateDocument = async (
    collectionName: string,
    documentId: string,
    data: Partial<DocumentData>
  ) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, data);
      return { id: documentId, ...data };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  };

  const deleteDocument = async (collectionName: string, documentId: string) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
      return documentId;
    } catch (error) {
      console.error('Error deleting document:', error);
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
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, where(field, operator, value));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error querying documents:', error);
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
}; 