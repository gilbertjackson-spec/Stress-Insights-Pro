'use client';

import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, Firestore } from 'firebase/firestore';

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

export const updateUnit = async (firestore: Firestore, companyId: string, unitId: string, name: string) => {
    if (!companyId || !unitId || !name) {
        throw new Error('ID da empresa, ID da unidade e nome são obrigatórios para atualizar.');
    }
    const unitRef = doc(firestore, 'companies', companyId, 'units', unitId);
    // This is a non-blocking call. Errors will be handled by the global error emitter.
    updateDocumentNonBlocking(unitRef, { name });
};

export const deleteUnit = async (firestore: Firestore, companyId: string, unitId: string) => {
    if (!companyId || !unitId) {
        throw new Error('ID da empresa e ID da unidade são obrigatórios para excluir.');
    }
    const unitRef = doc(firestore, 'companies', companyId, 'units', unitId);
    // This is a non-blocking call. Errors will be handled by the global error emitter.
    deleteDocumentNonBlocking(unitRef);
};
