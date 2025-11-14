'use client';
import { collection, doc, getDocs, writeBatch, Firestore } from 'firebase/firestore';
import { getMockSurveyTemplate } from './mock-data';

/**
 * Populates the Firestore database with the initial survey template if it doesn't already exist.
 * This is intended to be run once by a client-side action.
 * @param firestore The Firestore instance.
 */
export const seedDatabase = async (firestore: Firestore) => {
  console.log('Checking if seeding is necessary...');
  
  // 1. Check if the survey_templates collection is empty
  const templatesCollectionRef = collection(firestore, 'survey_templates');
  const existingTemplatesSnap = await getDocs(templatesCollectionRef);

  if (!existingTemplatesSnap.empty) {
    console.log('Database already contains survey templates. Seeding is not required.');
    return;
  }
  
  console.log('Seeding database with initial survey template...');
  const template = getMockSurveyTemplate();
  
  // 2. Create a write batch to perform all writes atomically
  const batch = writeBatch(firestore);

  // 3. Add the main SurveyTemplate document
  const templateDocRef = doc(templatesCollectionRef, template.id);
  batch.set(templateDocRef, {
    name: template.name,
  });

  // 4. Add all domains and their questions as subcollections
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
        domainId: domain.id, // denormalize for easier lookup if needed
      });
    }
  }

  // 5. Commit the batch
  try {
    await batch.commit();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw new Error('Failed to seed database. Check Firestore permissions and configuration.');
  }
};
