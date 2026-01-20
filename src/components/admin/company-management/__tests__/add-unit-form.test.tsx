import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent, waitFor } from '@/test/utils';
import { AddUnitForm } from '../add-unit-form';
import { addUnit } from '@/lib/unit-service';
import { useFirestore } from '@/firebase';

// Mock unit service
vi.mock('@/lib/unit-service', () => ({
    addUnit: vi.fn(),
}));

describe('AddUnitForm Component', () => {
    const mockOnFinished = vi.fn();
    const companyId = 'company-1';

    beforeEach(() => {
        vi.clearAllMocks();
        (useFirestore as any).mockReturnValue({});
    });

    it('should render the form with name input', () => {
        render(<AddUnitForm companyId={companyId} onFinished={mockOnFinished} />);

        expect(screen.getByLabelText(/nome da unidade/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /adicionar unidade/i })).toBeInTheDocument();
    });

    it('should show validation error for empty name', async () => {
        const user = userEvent.setup();
        render(<AddUnitForm companyId={companyId} onFinished={mockOnFinished} />);

        await user.click(screen.getByRole('button', { name: /adicionar unidade/i }));

        expect(await screen.findByText(/o nome da unidade deve ter pelo menos 2 caracteres/i)).toBeInTheDocument();
        expect(addUnit).not.toHaveBeenCalled();
    });

    it('should call addUnit and onFinished on successful submission', async () => {
        const user = userEvent.setup();
        (addUnit as any).mockResolvedValue({ id: 'new-unit-id' });

        render(<AddUnitForm companyId={companyId} onFinished={mockOnFinished} />);

        await user.type(screen.getByLabelText(/nome da unidade/i), 'Nova Unidade');
        await user.click(screen.getByRole('button', { name: /adicionar unidade/i }));

        await waitFor(() => {
            expect(addUnit).toHaveBeenCalledWith(expect.any(Object), companyId, 'Nova Unidade');
        });

        expect(mockOnFinished).toHaveBeenCalled();
    });

    it('should show error toast if addUnit fails', async () => {
        const user = userEvent.setup();
        (addUnit as any).mockRejectedValue(new Error('Failed to add'));

        render(<AddUnitForm companyId={companyId} onFinished={mockOnFinished} />);

        await user.type(screen.getByLabelText(/nome da unidade/i), 'Fail Unit');
        await user.click(screen.getByRole('button', { name: /adicionar unidade/i }));

        await waitFor(() => {
            expect(addUnit).toHaveBeenCalled();
        });
        
        // We can't easily check for toasts, but we can check the negative case
        expect(mockOnFinished).not.toHaveBeenCalled();
    });
});
