import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent, waitFor } from '@/test/utils';
import { EditUnitForm } from '../edit-unit-form';
import { updateUnit } from '@/lib/unit-service';
import { useFirestore } from '@/firebase';
import type { Unit } from '@/lib/types';

// Mock unit service
vi.mock('@/lib/unit-service', () => ({
    updateUnit: vi.fn(),
}));

const mockUnit: Unit = {
    id: 'unit-1',
    name: 'Unidade Antiga',
    companyId: 'company-1',
};

describe('EditUnitForm Component', () => {
    const mockOnFinished = vi.fn();
    const companyId = 'company-1';

    beforeEach(() => {
        vi.clearAllMocks();
        (useFirestore as any).mockReturnValue({});
    });

    it('should render the form with initial name value', () => {
        render(<EditUnitForm companyId={companyId} unit={mockUnit} onFinished={mockOnFinished} />);
        
        const input = screen.getByLabelText(/nome da unidade/i) as HTMLInputElement;
        expect(input.value).toBe('Unidade Antiga');
    });

    it('should call updateUnit and onFinished on successful submission', async () => {
        const user = userEvent.setup();
        (updateUnit as any).mockResolvedValue(undefined);
        
        render(<EditUnitForm companyId={companyId} unit={mockUnit} onFinished={mockOnFinished} />);

        const input = screen.getByLabelText(/nome da unidade/i);
        await user.clear(input);
        await user.type(input, 'Unidade Atualizada');
        
        await user.click(screen.getByRole('button', { name: /salvar alterações/i }));
        
        await waitFor(() => {
            expect(updateUnit).toHaveBeenCalledWith(expect.any(Object), companyId, mockUnit.id, 'Unidade Atualizada');
        });
        
        expect(mockOnFinished).toHaveBeenCalled();
    });

    it('should show error toast if updateUnit fails', async () => {
        const user = userEvent.setup();
        (updateUnit as any).mockRejectedValue(new Error('Update failed'));

        render(<EditUnitForm companyId={companyId} unit={mockUnit} onFinished={mockOnFinished} />);
        
        const input = screen.getByLabelText(/nome da unidade/i);
        await user.clear(input);
        await user.type(input, 'Fail Update');
        
        await user.click(screen.getByRole('button', { name: /salvar alterações/i }));
        
        await waitFor(() => {
            expect(updateUnit).toHaveBeenCalled();
        });
        
        expect(mockOnFinished).not.toHaveBeenCalled();
    });
});
