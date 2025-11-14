'use client';

import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, Firestore } from 'firebase/firestore';

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

export const deletePosition = async (firestore: Firestore, companyId: string, positionId: string) => {
    if (!companyId || !positionId) {
        throw new Error('ID da empresa e ID do cargo são obrigatórios para excluir.');
    }
    const positionRef = doc(firestore, 'companies', companyId, 'positions', positionId);
    deleteDocumentNonBlocking(positionRef);
};
