import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import { AddSurveyForm } from '../add-survey-form';
import { useFirestore, useCollection, useUser } from '@/firebase';

describe('AddSurveyForm Component', () => {
    const mockOnFinished = vi.fn();
    const companyId = 'brand-new-company';

    beforeEach(() => {
        vi.clearAllMocks();
        (useFirestore as any).mockReturnValue({});
        (useUser as any).mockReturnValue({ isUserLoading: false });
        (useCollection as any).mockReturnValue({ data: [], isLoading: false });
    });

    it('should render all form fields', () => {
        render(<AddSurveyForm companyId={companyId} onFinished={mockOnFinished} />);

        expect(screen.getByLabelText(/nome da pesquisa/i)).toBeInTheDocument();
        expect(screen.getByText(/template da pesquisa/i)).toBeInTheDocument();
        expect(screen.getByText(/período da pesquisa/i)).toBeInTheDocument();
    });
});
