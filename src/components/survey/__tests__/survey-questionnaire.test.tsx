import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent, waitFor } from '@/test/utils';
import SurveyQuestionnaire from '../survey-questionnaire';
import { useDoc, useCollection, useFirestore } from '@/firebase';
import { addAnswerBatch } from '@/lib/answer-service';
import type { SurveyTemplate, Domain, Question } from '@/lib/types';

// Mock services and hooks
vi.mock('@/lib/answer-service');
vi.mock('@/firebase', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/firebase')>();
    return {
        ...original,
        useDoc: vi.fn(),
        useCollection: vi.fn(),
        useFirestore: vi.fn(() => ({})),
        useMemoFirebase: vi.fn((fn) => fn()),
    };
});

const mockTemplate: Omit<SurveyTemplate, 'domains'> = { id: 't1', name: 'Test Questionnaire' };
const mockDomains: Domain[] = [
    { id: 'd1', name: 'Domain 1', templateId: 't1', questions: [], benchmarkPrivateSector: 3, percentile25: 2.5, percentile75: 4, textResultLow: '', textResultMedium: '', textResultHigh: '', descriptionText: '' },
    { id: 'd2', name: 'Domain 2', templateId: 't1', questions: [], benchmarkPrivateSector: 3, percentile25: 2.5, percentile75: 4, textResultLow: '', textResultMedium: '', textResultHigh: '', descriptionText: '' },
];
const mockQuestions: Record<string, Question[]> = {
    d1: [{ id: 'q1', domainId: 'd1', questionCode: 'Q1', questionText: 'Question 1.1?', isInvertedScore: false }],
    d2: [{ id: 'q2', domainId: 'd2', questionCode: 'Q2', questionText: 'Question 2.1?', isInvertedScore: false }],
};

describe('SurveyQuestionnaire Component', () => {
    const mockOnComplete = vi.fn();
    let getDocs: any, collection: any;

    beforeEach(async () => {
        // Dynamically import inside async context
        const firestore = await import('firebase/firestore');
        getDocs = firestore.getDocs;
        collection = firestore.collection;

        vi.clearAllMocks();
        (useDoc as any).mockReturnValue({ data: mockTemplate, isLoading: false });
        (useCollection as any).mockReturnValue({ data: mockDomains, isLoading: false });

        (getDocs as any).mockImplementation((query: any) => {
            const pathParts = query.path.split('/');
            const domainId = pathParts[3];
            return Promise.resolve({
                docs: (mockQuestions[domainId] || []).map(q => ({ id: q.id, data: () => q })),
            });
        });
        (collection as any).mockImplementation((db: any, path: string) => ({
            path,
        }));
    });

    it('should render the questionnaire title and progress', async () => {
        render(<SurveyQuestionnaire deploymentId="dep1" templateId="t1" demographics={{}} onComplete={mockOnComplete} />);

        await waitFor(() => {
            expect(screen.getByText('Test Questionnaire')).toBeInTheDocument();
            expect(screen.getByText('0 de 2 perguntas respondidas')).toBeInTheDocument();
        });
    });

    it('should allow answering a question and update progress', async () => {
        const user = userEvent.setup();
        render(<SurveyQuestionnaire deploymentId="dep1" templateId="t1" demographics={{}} onComplete={mockOnComplete} />);

        expect(await screen.findByText('Question 1.1?')).toBeInTheDocument();
        
        const answerRadio = await screen.findByLabelText('Sempre');
        await user.click(answerRadio);
        
        expect(await screen.findByText('1 de 2 perguntas respondidas')).toBeInTheDocument();
    });

    it('should prevent submitting if not all questions are answered', async () => {
        const user = userEvent.setup();
        render(<SurveyQuestionnaire deploymentId="dep1" templateId="t1" demographics={{}} onComplete={mockOnComplete} />);

        await screen.findByText('Domain 1');
        
        await user.click(screen.getByRole('button', { name: /próximo/i }));
        
        await waitFor(async () => {
            const submitButton = await screen.findByRole('button', { name: /finalizar e enviar respostas/i });
            expect(submitButton).toBeInTheDocument();
            await user.click(submitButton);
        });

        expect(addAnswerBatch).not.toHaveBeenCalled();
    });

    it('should submit answers when all questions are answered', async () => {
        const user = userEvent.setup();
        (addAnswerBatch as any).mockResolvedValue('respondent-id');
        render(<SurveyQuestionnaire deploymentId="dep1" templateId="t1" demographics={{}} onComplete={mockOnComplete} />);

        await user.click(await screen.findByLabelText('Às vezes'));
        await user.click(screen.getByRole('button', { name: /próximo/i }));

        await waitFor(async () => {
            expect(await screen.findByText('Question 2.1?')).toBeInTheDocument();
        });

        await user.click(await screen.findByLabelText('Sempre'));
        const submitButton = await screen.findByRole('button', { name: /finalizar e enviar respostas/i });
        await user.click(submitButton);
        
        await waitFor(() => {
            expect(addAnswerBatch).toHaveBeenCalledWith(expect.any(Object), {
                deploymentId: 'dep1',
                demographics: {},
                answers: {
                    q1: 'Às vezes',
                    q2: 'Sempre',
                },
                template: expect.any(Object),
            });
        });

        expect(mockOnComplete).toHaveBeenCalled();
    });
});
