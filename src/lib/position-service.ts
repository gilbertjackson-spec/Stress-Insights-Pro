'use client';

import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, Firestore } from 'firebase/firestore';

export const addPosition = async (firestore: Firestore, companyId: string, unitId: string, sectorId: string, name: string) => {
  if (!companyId || !unitId || !sectorId || !name) {
    throw new Error('IDs da empresa, unidade, setor e nome do cargo são obrigatórios.');
  }

  const positionsCollection = collection(firestore, 'companies', companyId, 'units', unitId, 'sectors', sectorId, 'positions');
  
  const docRefPromise = addDocumentNonBlocking(positionsCollection, {
    name: name,
    sectorId: sectorId,
    createdAt: new Date().toISOString(),
  });

  const docRef = await docRefPromise;
  return docRef;
};

export const deletePosition = async (firestore: Firestore, companyId: string, unitId: string, sectorId: string, positionId: string) => {
    if (!companyId || !unitId || !sectorId || !positionId) {
        throw new Error('IDs da empresa, unidade, setor e cargo são obrigatórios para excluir.');
    }
    const positionRef = doc(firestore, 'companies', companyId, 'units', unitId, 'sectors', sectorId, 'positions', positionId);
    deleteDocumentNonBlocking(positionRef);
};

    