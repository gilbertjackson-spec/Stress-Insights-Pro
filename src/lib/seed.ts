'use client';
import { collection, doc, getDocs, writeBatch, Firestore, deleteDoc } from 'firebase/firestore';
import { getMockSurveyTemplate } from './mock-data';

/**
 * Populates the Firestore database with the initial survey template.
 * This function will first DELETE any existing templates to ensure the configuration is fresh.
 * @param firestore The Firestore instance.
 */
export const seedDatabase = async (firestore: Firestore) => {
  console.log('Checking for existing templates to delete...');
  
  const templatesCollectionRef = collection(firestore, 'survey_templates');
  const existingTemplatesSnap = await getDocs(templatesCollectionRef);

  // Delete existing templates to ensure a fresh start with correct configuration
  if (!existingTemplatesSnap.empty) {
    console.log(`Found ${existingTemplatesSnap.size} existing templates. Deleting them now...`);
    const deletePromises = existingTemplatesSnap.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log('All existing templates deleted.');
  }
  
  console.log('Seeding database with initial survey template...');
  const template = getMockSurveyTemplate();
  
  const batch = writeBatch(firestore);

  const templateDocRef = doc(templatesCollectionRef, template.id);
  batch.set(templateDocRef, {
    name: template.name,
  });

  for (const domain of template.domains) {
    const domainDocRef = doc(templateDocRef, 'domains', domain.id);
    batch.set(domainDocRef, {
      name: domain.name,
      benchmarkPrivateSector: domain.benchmarkPrivateSector,
      percentile25: domain.percentile25,
      percentile75: domain.percentile75,
      textResultLow: domain.textResultLow,
      textResultMedium: domain.textResultMedium,
      textResultHigh: domain.textResultHigh,
      descriptionText: domain.descriptionText,
    });

    for (const question of domain.questions) {
      const questionDocRef = doc(domainDocRef, 'questions', question.id);
      batch.set(questionDocRef, {
        questionCode: question.questionCode,
        questionText: question.questionText,
        isInvertedScore: question.isInvertedScore,
        domainId: domain.id,
      });
    }
  }

  try {
    await batch.commit();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw new Error('Failed to seed database. Check Firestore permissions and configuration.');
  }
};
