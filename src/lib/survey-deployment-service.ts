'use client';

import { addDocumentNonBlocking } from '@/firebase';
import { collection, Firestore } from 'firebase/firestore';

interface NewDeploymentData {
    companyId: string;
    templateId: string;
    startDate: string;
    endDate: string;
    totalInvited: number;
}

export const addSurveyDeployment = async (firestore: Firestore, data: NewDeploymentData) => {
  const { companyId, templateId, startDate, endDate, totalInvited } = data;

  if (!companyId || !templateId || !startDate || !endDate ) {
    throw new Error('Dados insuficientes para criar a pesquisa.');
  }

  const deploymentsCollection = collection(firestore, 'survey_deployments');
  
  const docData = {
    companyId,
    templateId,
    startDate,
    endDate,
    totalInvited,
    status: 'draft', // All new surveys start as drafts
    createdAt: new Date().toISOString(),
  };
  
  const docRefPromise = addDocumentNonBlocking(deploymentsCollection, docData);

  const docRef = await docRefPromise;
  return docRef;
};
