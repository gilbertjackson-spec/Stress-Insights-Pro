import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent, waitFor } from '@/test/utils';
import SurveyDemographicsForm from '../survey-demographics-form';
import type { Unit, Sector, Position } from '@/lib/types';

const mockUnits: Unit[] = [
    { id: 'unit-1', name: 'Unidade Alpha', companyId: 'comp-1' },
    { id: 'unit-2', name: 'Unidade Beta', companyId: 'comp-1' },
];

const mockSectors: Sector[] = [
    { id: 'sector-1', name: 'Setor Gamma', unitId: 'unit-1' },
];

const mockPositions: Position[] = [
    { id: 'pos-1', name: 'Cargo Delta', unitId: 'unit-1', sectorId: 'sector-1' },
];

describe('SurveyDemographicsForm Component', () => {
    const mockOnSubmit = vi.fn();
    const mockOnUnitChange = vi.fn();
    const mockOnSectorChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render all form fields', () => {
        render(
            <SurveyDemographicsForm
                onSubmit={mockOnSubmit}
                isLoadingUnits={false}
                isLoadingSectors={false}
                isLoadingPositions={false}
                units={mockUnits}
                sectors={[]}
                positions={[]}
                onUnitChange={mockOnUnitChange}
                onSectorChange={mockOnSectorChange}
                selectedUnit=""
            />
        );

        expect(screen.getByText('Unidade')).toBeInTheDocument();
        expect(screen.getByText('Setor')).toBeInTheDocument();
        expect(screen.getByText('Cargo')).toBeInTheDocument();
        expect(screen.getByText('Faixa Etária')).toBeInTheDocument();
        expect(screen.getByText('Gênero')).toBeInTheDocument();
    });

    it('should show loading state', () => {
        render(
            <SurveyDemographicsForm
                onSubmit={mockOnSubmit}
                isLoadingUnits={true}
                isLoadingSectors={false}
                isLoadingPositions={false}
                units={[]}
                sectors={[]}
                positions={[]}
                onUnitChange={mockOnUnitChange}
                onSectorChange={mockOnSectorChange}
                selectedUnit=""
            />
        );

        expect(screen.getByText('Carregando estrutura...')).toBeInTheDocument();
    });

    it('should enable sector select after a unit is chosen', async () => {
        const user = userEvent.setup();
        render(
            <SurveyDemographicsForm
                onSubmit={mockOnSubmit}
                isLoadingUnits={false}
                isLoadingSectors={false}
                isLoadingPositions={false}
                units={mockUnits}
                sectors={[]}
                positions={[]}
                onUnitChange={mockOnUnitChange}
                onSectorChange={mockOnSectorChange}
                selectedUnit=""
            />
        );

        const sectorSelect = screen.getByRole('combobox', { name: /setor/i });
        expect(sectorSelect).toBeDisabled();

        await user.click(screen.getByRole('combobox', { name: /unidade/i }));
        await user.click(await screen.findByText('Unidade Alpha'));

        expect(mockOnUnitChange).toHaveBeenCalledWith('unit-1');
        // In a real scenario, the parent would re-render with the sector select enabled.
    });

    it('should call onSubmit with correct data', async () => {
        const user = userEvent.setup();
        render(
            <SurveyDemographicsForm
                onSubmit={mockOnSubmit}
                isLoadingUnits={false}
                isLoadingSectors={false}
                isLoadingPositions={false}
                units={mockUnits}
                sectors={mockSectors}
                positions={mockPositions}
                onUnitChange={mockOnUnitChange}
                onSectorChange={mockOnSectorChange}
                selectedUnit="unit-1"
            />
        );
        
        // Fill form
        await user.click(screen.getByRole('combobox', { name: /unidade/i }));
        await user.click(await screen.findByText('Unidade Alpha'));
        
        await user.click(screen.getByRole('combobox', { name: /setor/i }));
        await user.click(await screen.findByText('Setor Gamma'));
        
        await user.click(screen.getByRole('combobox', { name: /cargo/i }));
        await user.click(await screen.findByText('Cargo Delta'));

        await user.click(screen.getByRole('button', { name: /continuar para a pesquisa/i }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                unit: 'unit-1',
                sector: 'sector-1',
                position: 'pos-1',
                age_range: '',
                current_role_time: '',
                gender: '',
            });
        });
    });

    it('should show validation errors', async () => {
        const user = userEvent.setup();
        render(
            <SurveyDemographicsForm
                onSubmit={mockOnSubmit}
                isLoadingUnits={false}
                isLoadingSectors={false}
                isLoadingPositions={false}
                units={mockUnits}
                sectors={[]}
                positions={[]}
                onUnitChange={mockOnUnitChange}
                onSectorChange={mockOnSectorChange}
                selectedUnit=""
            />
        );

        await user.click(screen.getByRole('button', { name: /continuar para a pesquisa/i }));

        expect(await screen.findByText('Selecione a unidade.')).toBeInTheDocument();
        expect(await screen.findByText('Selecione o setor.')).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });
});
