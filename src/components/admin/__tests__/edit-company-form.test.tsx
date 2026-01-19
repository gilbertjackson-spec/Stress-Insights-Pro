import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent, waitFor } from '@/test/utils';
import { EditCompanyForm } from '../edit-company-form';
import { updateCompany } from '@/lib/company-service';
import { useFirestore } from '@/firebase';

// Mock company service
vi.mock('@/lib/company-service', () => ({
    updateCompany: vi.fn(),
}));

describe('EditCompanyForm Component', () => {
    const mockOnFinished = vi.fn();
    const mockCompany = { id: 'comp-1', name: 'Old Name' };

    beforeEach(() => {
        vi.clearAllMocks();
        (useFirestore as any).mockReturnValue({});
    });

    it('should render the form with initial values', () => {
        render(<EditCompanyForm company={mockCompany} onFinished={mockOnFinished} />);

        const input = screen.getByLabelText(/nome da empresa/i) as HTMLInputElement;
        expect(input.value).toBe('Old Name');
    });

    it('should call updateCompany and onFinished on successful submission', async () => {
        const user = userEvent.setup();
        (updateCompany as any).mockResolvedValue(undefined);

        render(<EditCompanyForm company={mockCompany} onFinished={mockOnFinished} />);

        const input = screen.getByLabelText(/nome da empresa/i);
        await user.clear(input);
        await user.type(input, 'Updated Company Name');

        const submitButton = screen.getByRole('button', { name: /salvar alterações/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(updateCompany).toHaveBeenCalledWith(expect.any(Object), 'comp-1', 'Updated Company Name');
        });

        expect(mockOnFinished).toHaveBeenCalled();
    });

    it('should show error toast if updateCompany fails', async () => {
        const user = userEvent.setup();
        (updateCompany as any).mockRejectedValue(new Error('Firebase error'));

        render(<EditCompanyForm company={mockCompany} onFinished={mockOnFinished} />);

        const input = screen.getByLabelText(/nome da empresa/i);
        await user.clear(input);
        await user.type(input, 'Fail Update');
        await user.click(screen.getByRole('button', { name: /salvar alterações/i }));

        await waitFor(() => {
            expect(updateCompany).toHaveBeenCalled();
        });

        expect(mockOnFinished).not.toHaveBeenCalled();
    });
});
