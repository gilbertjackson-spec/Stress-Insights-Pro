import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent, waitFor } from '@/test/utils';
import { AddPositionForm } from '../add-position-form';
import { addPosition } from '@/lib/position-service';
import { useFirestore } from '@/firebase';
import { getDocs } from 'firebase/firestore';
import type { Unit, Sector } from '@/lib/types';

// Mock position service
vi.mock('@/lib/position-service', () => ({
    addPosition: vi.fn(),
}));

const mockUnits: Unit[] = [
    { id: 'unit-1', name: 'Unidade Alpha', companyId: 'comp-1' },
];

const mockSectors: Sector[] = [
    { id: 'sector-1', name: 'Setor Gamma', unitId: 'unit-1' },
];

describe('AddPositionForm Component', () => {
    const mockOnFinished = vi.fn();
    const companyId = 'company-1';

    beforeEach(() => {
        vi.clearAllMocks();
        (useFirestore as any).mockReturnValue({});
        // Mock the fetchSectors call within the component
        (getDocs as any).mockResolvedValue({
            docs: mockSectors.map(s => ({ id: s.id, data: () => s }))
        });
    });

    it('should render all form fields', () => {
        render(<AddPositionForm companyId={companyId} units={mockUnits} onFinished={mockOnFinished} />);

        expect(screen.getByLabelText(/nome do cargo/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /unidade/i })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /setor/i })).toBeInTheDocument();
    });
    
    it('should load sectors when a unit is selected', async () => {
        const user = userEvent.setup();
        render(<AddPositionForm companyId={companyId} units={mockUnits} onFinished={mockOnFinished} />);

        const sectorSelect = screen.getByRole('combobox', { name: /setor/i });
        expect(sectorSelect).toBeDisabled();

        // Select a unit
        await user.click(screen.getByRole('combobox', { name: /unidade/i }));
        await user.click(await screen.findByRole('option', { name: 'Unidade Alpha' }));

        await waitFor(() => {
             expect(sectorSelect).not.toBeDisabled();
        });

        // Open sector select and check for options
        await user.click(sectorSelect);
        expect(await screen.findByRole('option', { name: 'Setor Gamma' })).toBeInTheDocument();
    });

    it('should call addPosition and onFinished on successful submission', async () => {
        const user = userEvent.setup();
        (addPosition as any).mockResolvedValue({ id: 'new-pos-id' });

        render(<AddPositionForm companyId={companyId} units={mockUnits} onFinished={mockOnFinished} />);

        // Select unit
        await user.click(screen.getByRole('combobox', { name: /unidade/i }));
        await user.click(await screen.findByRole('option', { name: 'Unidade Alpha' }));

        // Wait for sectors to load and select one
        const sectorSelect = screen.getByRole('combobox', { name: /setor/i });
        await waitFor(() => expect(sectorSelect).not.toBeDisabled());
        await user.click(sectorSelect);
        await user.click(await screen.findByRole('option', { name: 'Setor Gamma' }));

        // Fill in name
        await user.type(screen.getByLabelText(/nome do cargo/i), 'Novo Cargo');

        // Submit
        await user.click(screen.getByRole('button', { name: /adicionar cargo/i }));

        await waitFor(() => {
            expect(addPosition).toHaveBeenCalledWith(expect.any(Object), companyId, 'unit-1', 'sector-1', 'Novo Cargo');
        });

        expect(mockOnFinished).toHaveBeenCalled();
    });
});
