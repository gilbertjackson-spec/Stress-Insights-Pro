'use client';

import { addDocumentNonBlocking } from '@/firebase';
import { collection, Firestore } from 'firebase/firestore';

export const addCompany = async (firestore: Firestore, name: string) => {
  if (!name) {
    throw new Error('Company name is required.');
  }
  const companiesCollection = collection(firestore, 'companies');
  
  // Using the non-blocking function. It will handle errors via the global emitter.
  // We can still await it if we need the returned document reference, but for a simple "add"
  // and toast notification, we can let it run in the background.
  const docRefPromise = addDocumentNonBlocking(companiesCollection, {
    name: name,
    createdAt: new Date(),
  });

  // You can optionally do something with the promise, e.g., get the new ID
  const docRef = await docRefPromise;
  return docRef;
};
