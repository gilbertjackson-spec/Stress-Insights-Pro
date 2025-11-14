'use client';

import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, Firestore } from 'firebase/firestore';

export const addCompany = async (firestore: Firestore, name: string) => {
  if (!name) {
    throw new Error('Company name is required.');
  }
  const companiesCollection = collection(firestore, 'companies');
  
  const docRefPromise = addDocumentNonBlocking(companiesCollection, {
    name: name,
    createdAt: new Date(),
  });

  const docRef = await docRefPromise;
  return docRef;
};

export const updateCompany = async (firestore: Firestore, companyId: string, name: string) => {
    if (!companyId || !name) {
        throw new Error('ID da empresa e nome são obrigatórios para atualizar.');
    }
    const companyRef = doc(firestore, 'companies', companyId);
    updateDocumentNonBlocking(companyRef, { name });
}