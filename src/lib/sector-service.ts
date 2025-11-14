'use client';

import { addDocumentNonBlocking } from '@/firebase';
import { collection, Firestore } from 'firebase/firestore';

export const addSector = async (firestore: Firestore, companyId: string, unitId: string, name: string) => {
  if (!companyId || !unitId || !name) {
    throw new Error('ID da empresa, ID da unidade e nome do setor são obrigatórios.');
  }

  const sectorsCollection = collection(firestore, 'companies', companyId, 'units', unitId, 'sectors');
  
  const docRefPromise = addDocumentNonBlocking(sectorsCollection, {
    name: name,
    createdAt: new Date().toISOString(),
  });

  const docRef = await docRefPromise;
  return docRef;
};
