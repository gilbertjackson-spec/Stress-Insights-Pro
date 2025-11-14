'use client';

import { addDocumentNonBlocking } from "@/firebase";
import { collection, writeBatch, doc, Firestore } from "firebase/firestore";
import type { Demographics, SurveyTemplate, Question } from "./types";
import { LIKERT_SCALE } from "./constants";

interface AnswerSubmission {
    deploymentId: string;
    demographics: Partial<Demographics>;
    answers: Record<number, string>; // question_id -> raw_response
    template: SurveyTemplate;
}

export const addAnswerBatch = async (firestore: Firestore, submission: AnswerSubmission) => {
    const { deploymentId, demographics, answers, template } = submission;
    
    // 1. Create a new respondent document
    const respondentsCollection = collection(firestore, `survey_deployments/${deploymentId}/respondents`);
    const respondentRef = doc(respondentsCollection); // Auto-generate ID

    // 2. Create a write batch
    const batch = writeBatch(firestore);

    // 3. Add the respondent document to the batch
    batch.set(respondentRef, {
        deploymentId,
        demographics,
        status: 'completed',
        completedAt: new Date().toISOString(),
    });

    // 4. Create answer documents and add them to the batch
    const allQuestions = template.domains.flatMap(d => d.questions);

    for (const question of allQuestions) {
        const rawResponse = answers[question.question_id];
        if (rawResponse) {
            const rawResponseIndex = LIKERT_SCALE.indexOf(rawResponse);
            const baseScore = rawResponseIndex + 1;
            const calculatedScore = question.is_inverted_score ? 6 - baseScore : baseScore;

            let sentiment: 'Favorável' | 'Neutro' | 'Desfavorável';
            if (calculatedScore <= 2) sentiment = 'Desfavorável';
            else if (calculatedScore === 3) sentiment = 'Neutro';
            else sentiment = 'Favorável';

            const answerRef = doc(collection(respondentRef, 'answers')); // Nested collection
            
            batch.set(answerRef, {
                questionId: question.question_id,
                questionCode: question.question_code,
                domainName: template.domains.find(d => d.domain_id === question.domain_id)?.name,
                rawResponse,
                calculatedScore,
                sentiment,
            });
        }
    }

    // 5. Commit the batch
    await batch.commit();

    return respondentRef.id;
};
