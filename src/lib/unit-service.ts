'use client';

import { addDocumentNonBlocking } from '@/firebase';
import { collection, Firestore } from 'firebase/firestore';

export const addUnit = async (firestore: Firestore, companyId: string, name: string) => {
  if (!companyId || !name) {
    throw new Error('ID da empresa e nome da unidade são obrigatórios.');
  }

  const unitsCollection = collection(firestore, 'companies', companyId, 'units');
  
  const docRefPromise = addDocumentNonBlocking(unitsCollection, {
    name: name,
    createdAt: new Date().toISOString(),
  });

  const docRef = await docRefPromise;
  return docRef;
};
