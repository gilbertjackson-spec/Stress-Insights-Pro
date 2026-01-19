import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent, within } from '@/test/utils';
import CompaniesTable from '../companies-table';
import type { Company } from '@/lib/types';

// Mock child form components to simplify testing CompaniesTable in isolation
vi.mock('../add-company-form', () => ({
    AddCompanyForm: ({ onFinished }: { onFinished: () => void }) => (
        <div data-testid="add-company-form">
            Add Form Mock
            <button onClick={onFinished}>Finish</button>
        </div>
    ),
}));

vi.mock('../edit-company-form', () => ({
    EditCompanyForm: ({ company, onFinished }: { company: any, onFinished: () => void }) => (
        <div data-testid="edit-company-form">
            Edit Form Mock: {company.name}
            <button onClick={onFinished}>Finish</button>
        </div>
    ),
}));

const mockCompanies: Company[] = [
    {
        id: '1',
        name: 'Company A',
    },
    {
        id: '2',
        name: 'Company B',
    },
];

describe('CompaniesTable Component', () => {
    it('should render loading state with skeletons', () => {
        render(<CompaniesTable companies={[]} isLoading={true} />);

        const skeletons = document.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render empty state when no companies', () => {
        render(<CompaniesTable companies={[]} isLoading={false} />);

        expect(screen.getByText('Nenhuma empresa encontrada.')).toBeInTheDocument();
    });

    it('should render list of companies', () => {
        render(<CompaniesTable companies={mockCompanies} isLoading={false} />);

        expect(screen.getByText('Company A')).toBeInTheDocument();
        expect(screen.getByText('Company B')).toBeInTheDocument();
    });

    it('should open add company dialog', async () => {
        const user = userEvent.setup();
        render(<CompaniesTable companies={mockCompanies} isLoading={false} />);

        const addButton = screen.getByRole('button', { name: /adicionar empresa/i });
        await user.click(addButton);

        expect(screen.getByText('Adicionar Nova Empresa')).toBeInTheDocument();
        expect(screen.getByTestId('add-company-form')).toBeInTheDocument();
    });

    it('should close add dialog when onFinished is called', async () => {
        const user = userEvent.setup();
        render(<CompaniesTable companies={mockCompanies} isLoading={false} />);

        await user.click(screen.getByRole('button', { name: /adicionar empresa/i }));
        const finishButton = screen.getByRole('button', { name: /finish/i });
        await user.click(finishButton);

        expect(screen.queryByText('Adicionar Nova Empresa')).not.toBeInTheDocument();
    });

    it('should open edit dialog from dropdown menu', async () => {
        const user = userEvent.setup();
        render(<CompaniesTable companies={mockCompanies} isLoading={false} />);

        // Find row for Company A
        const row = screen.getByText('Company A').closest('tr')!;
        const menuTrigger = within(row).getByRole('button', { name: /abrir menu/i });

        await user.click(menuTrigger);

        const editItem = screen.getByRole('menuitem', { name: /editar/i });
        await user.click(editItem);

        expect(screen.getByText('Editar Empresa')).toBeInTheDocument();
        expect(screen.getByText('Edit Form Mock: Company A')).toBeInTheDocument();
    });

    it('should have a details link for each company in the dropdown', async () => {
        const user = userEvent.setup();
        render(<CompaniesTable companies={mockCompanies} isLoading={false} />);

        const row = screen.getByText('Company A').closest('tr')!;
        const menuTrigger = within(row).getByRole('button', { name: /abrir menu/i });
        await user.click(menuTrigger);

        const link = screen.getByRole('menuitem', { name: /detalhes/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/admin/companies/1');
    });
});
