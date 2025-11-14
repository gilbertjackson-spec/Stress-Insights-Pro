'use client';

import { addDocumentNonBlocking } from '@/firebase';
import { collection, doc, Firestore, updateDoc, deleteDoc } from 'firebase/firestore';

interface NewDeploymentData {
    companyId: string;
    templateId: string;
    startDate: string;
    endDate: string;
    totalInvited: number;
    totalEmployees: number;
}

export const addSurveyDeployment = async (firestore: Firestore, data: NewDeploymentData) => {
  const { companyId, templateId, startDate, endDate, totalInvited, totalEmployees } = data;

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
    totalEmployees,
    status: 'draft', // All new surveys start as drafts
    createdAt: new Date().toISOString(),
  };
  
  const docRefPromise = addDocumentNonBlocking(deploymentsCollection, docData);

  const docRef = await docRefPromise;
  return docRef;
};


export const archiveSurveyDeployment = async (firestore: Firestore, deploymentId: string) => {
    if (!deploymentId) {
        throw new Error("ID da pesquisa é obrigatório para arquivar.");
    }
    const deploymentRef = doc(firestore, 'survey_deployments', deploymentId);
    return await updateDoc(deploymentRef, { status: 'archived' });
};

export const deleteSurveyDeployment = async (firestore: Firestore, deploymentId: string) => {
    if (!deploymentId) {
        throw new Error("ID da pesquisa é obrigatório para excluir.");
    }
    // Note: This does not delete subcollections (respondents, answers).
    // A cloud function would be required for cascading deletes.
    // For now, we just delete the main document.
    const deploymentRef = doc(firestore, 'survey_deployments', deploymentId);
    return await deleteDoc(deploymentRef);
};
