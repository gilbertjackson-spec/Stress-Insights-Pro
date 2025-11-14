'use client';

import { addDocumentNonBlocking } from '@/firebase';
import { collection, Firestore } from 'firebase/firestore';

export const addPosition = async (firestore: Firestore, companyId: string, name: string) => {
  if (!companyId || !name) {
    throw new Error('ID da empresa e nome do cargo são obrigatórios.');
  }

  const positionsCollection = collection(firestore, 'companies', companyId, 'positions');
  
  const docRefPromise = addDocumentNonBlocking(positionsCollection, {
    name: name,
    createdAt: new Date().toISOString(),
  });

  const docRef = await docRefPromise;
  return docRef;
};
