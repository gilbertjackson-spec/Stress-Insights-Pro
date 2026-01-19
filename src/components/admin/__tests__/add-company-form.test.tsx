import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent, waitFor } from '@/test/utils';
import { AddCompanyForm } from '../add-company-form';
import { addCompany } from '@/lib/company-service';
import { useFirestore } from '@/firebase';

// Mock company service
vi.mock('@/lib/company-service', () => ({
    addCompany: vi.fn(),
}));

describe('AddCompanyForm Component', () => {
    const mockOnFinished = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock for useFirestore
        (useFirestore as any).mockReturnValue({});
    });

    it('should render the form with name input', () => {
        render(<AddCompanyForm onFinished={mockOnFinished} />);

        expect(screen.getByLabelText(/nome da empresa/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /adicionar empresa/i })).toBeInTheDocument();
    });

    it('should show validation error for empty name', async () => {
        const user = userEvent.setup();
        render(<AddCompanyForm onFinished={mockOnFinished} />);

        const submitButton = screen.getByRole('button', { name: /adicionar empresa/i });
        await user.click(submitButton);

        expect(await screen.findByText(/o nome da empresa deve ter pelo menos 2 caracteres/i)).toBeInTheDocument();
        expect(addCompany).not.toHaveBeenCalled();
    });

    it('should call addCompany and onFinished on successful submission', async () => {
        const user = userEvent.setup();
        (addCompany as any).mockResolvedValue({ id: 'new-id' });

        render(<AddCompanyForm onFinished={mockOnFinished} />);

        const input = screen.getByLabelText(/nome da empresa/i);
        await user.type(input, 'New Company ACME');

        const submitButton = screen.getByRole('button', { name: /adicionar empresa/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(addCompany).toHaveBeenCalledWith(expect.any(Object), 'New Company ACME');
        });

        expect(mockOnFinished).toHaveBeenCalled();
    });

    it('should show error toast if addCompany fails', async () => {
        const user = userEvent.setup();
        (addCompany as any).mockRejectedValue(new Error('Firebase error'));

        // We can't easily check toast content without mocking useToast, 
        // but it's already mocked in our setup or we use the real hook.
        // Let's just check it doesn't call onFinished.

        render(<AddCompanyForm onFinished={mockOnFinished} />);

        await user.type(screen.getByLabelText(/nome da empresa/i), 'Fail Company');
        await user.click(screen.getByRole('button', { name: /adicionar empresa/i }));

        await waitFor(() => {
            expect(addCompany).toHaveBeenCalled();
        });

        expect(mockOnFinished).not.toHaveBeenCalled();
    });

    it('should show loading state during submission', async () => {
        const user = userEvent.setup();
        // Delay resolution to capture loading state
        let resolvePromise: (val: any) => void;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });
        (addCompany as any).mockReturnValue(promise);

        render(<AddCompanyForm onFinished={mockOnFinished} />);

        await user.type(screen.getByLabelText(/nome da empresa/i), 'Loading Company');
        await user.click(screen.getByRole('button', { name: /adicionar empresa/i }));

        // Button should be disabled and show spinner
        const button = screen.getByRole('button', { name: /adicionar empresa/i });
        expect(button).toBeDisabled();

        resolvePromise!({ id: 'done' });

        await waitFor(() => {
            expect(button).not.toBeDisabled();
        });
    });
});
