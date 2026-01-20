import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent, waitFor } from '@/test/utils';
import { AddSectorForm } from '../add-sector-form';
import { addSector } from '@/lib/sector-service';
import { useFirestore } from '@/firebase';
import type { Unit } from '@/lib/types';

// Mock sector service
vi.mock('@/lib/sector-service', () => ({
    addSector: vi.fn(),
}));

const mockUnits: Unit[] = [
    { id: 'unit-1', name: 'Unidade Alpha', companyId: 'comp-1' },
    { id: 'unit-2', name: 'Unidade Beta', companyId: 'comp-1' },
];

describe('AddSectorForm Component', () => {
    const mockOnFinished = vi.fn();
    const companyId = 'company-1';

    beforeEach(() => {
        vi.clearAllMocks();
        (useFirestore as any).mockReturnValue({});
    });

    it('should render the form with name and unit inputs', () => {
        render(<AddSectorForm companyId={companyId} units={mockUnits} onFinished={mockOnFinished} />);

        expect(screen.getByLabelText(/nome do setor/i)).toBeInTheDocument();
        expect(screen.getByText(/unidade/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /adicionar setor/i })).toBeInTheDocument();
    });

    it('should show validation errors for empty fields', async () => {
        const user = userEvent.setup();
        render(<AddSectorForm companyId={companyId} units={mockUnits} onFinished={mockOnFinished} />);

        await user.click(screen.getByRole('button', { name: /adicionar setor/i }));

        expect(await screen.findByText(/o nome do setor deve ter pelo menos 2 caracteres/i)).toBeInTheDocument();
        expect(await screen.findByText(/por favor, selecione uma unidade/i)).toBeInTheDocument();
        expect(addSector).not.toHaveBeenCalled();
    });

    it('should call addSector and onFinished on successful submission', async () => {
        const user = userEvent.setup();
        (addSector as any).mockResolvedValue({ id: 'new-sector-id' });

        render(<AddSectorForm companyId={companyId} units={mockUnits} onFinished={mockOnFinished} />);

        // Select a unit
        await user.click(screen.getByRole('combobox', { name: /unidade/i }));
        await user.click(await screen.findByText('Unidade Alpha'));
        
        // Fill in name
        await user.type(screen.getByLabelText(/nome do setor/i), 'Novo Setor');
        
        // Submit
        await user.click(screen.getByRole('button', { name: /adicionar setor/i }));

        await waitFor(() => {
            expect(addSector).toHaveBeenCalledWith(expect.any(Object), companyId, 'unit-1', 'Novo Setor');
        });

        expect(mockOnFinished).toHaveBeenCalled();
    });
});
