'use client';

import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, Firestore } from 'firebase/firestore';

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


export const deleteSector = async (firestore: Firestore, companyId: string, unitId: string, sectorId: string) => {
    if (!companyId || !unitId || !sectorId) {
        throw new Error('ID da empresa, ID da unidade e ID do setor são obrigatórios para excluir.');
    }
    const sectorRef = doc(firestore, 'companies', companyId, 'units', unitId, 'sectors', sectorId);
    deleteDocumentNonBlocking(sectorRef);
};
