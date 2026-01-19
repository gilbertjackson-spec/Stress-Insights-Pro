import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import OverviewCards from '../overview-cards';
import type { DashboardData } from '@/lib/types';

const mockDashboardData: DashboardData = {
    total_respondents: 150,
    completion_rate: 75.5,
    surveyStatus: 'active',
    domain_analysis: [],
    demographics: {
        age: {},
        gender: {},
        sector: {},
        position: {},
    },
};

describe('OverviewCards Component', () => {
    it('should render loading skeletons when isLoading is true', () => {
        const { container } = render(
            <OverviewCards data={mockDashboardData} isLoading={true} />
        );

        const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render all cards when not loading', () => {
        render(<OverviewCards data={mockDashboardData} isLoading={false} />);

        expect(screen.getByText('Total de Respondentes')).toBeInTheDocument();
        expect(screen.getByText('Taxa de Adesão Geral')).toBeInTheDocument();
        expect(screen.getByText('Status da Pesquisa')).toBeInTheDocument();
    });

    it('should display correct total respondents', () => {
        render(<OverviewCards data={mockDashboardData} isLoading={false} />);

        expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('should display completion rate with one decimal place', () => {
        render(<OverviewCards data={mockDashboardData} isLoading={false} />);

        expect(screen.getByText('75.5%')).toBeInTheDocument();
    });

    it('should display survey status capitalized', () => {
        render(<OverviewCards data={mockDashboardData} isLoading={false} />);

        const statusElement = screen.getByText('active');
        expect(statusElement).toBeInTheDocument();
        expect(statusElement).toHaveClass('capitalize');
    });

    it('should render card descriptions', () => {
        render(<OverviewCards data={mockDashboardData} isLoading={false} />);

        expect(screen.getByText('Número de participantes com o filtro atual.')).toBeInTheDocument();
        expect(screen.getByText('Baseado no total de convidados.')).toBeInTheDocument();
        expect(screen.getByText('O estado atual da coleta de respostas.')).toBeInTheDocument();
    });

    it('should render with zero respondents', () => {
        const dataWithZero = { ...mockDashboardData, total_respondents: 0 };
        render(<OverviewCards data={dataWithZero} isLoading={false} />);

        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should render with 100% completion rate', () => {
        const dataWith100 = { ...mockDashboardData, completion_rate: 100 };
        render(<OverviewCards data={dataWith100} isLoading={false} />);

        expect(screen.getByText('100.0%')).toBeInTheDocument();
    });

    it('should render with different survey statuses', () => {
        const { rerender } = render(
            <OverviewCards data={{ ...mockDashboardData, surveyStatus: 'active' }} isLoading={false} />
        );
        expect(screen.getByText('active')).toBeInTheDocument();

        rerender(
            <OverviewCards data={{ ...mockDashboardData, surveyStatus: 'completed' }} isLoading={false} />
        );
        expect(screen.getByText('completed')).toBeInTheDocument();

        rerender(
            <OverviewCards data={{ ...mockDashboardData, surveyStatus: 'draft' }} isLoading={false} />
        );
        expect(screen.getByText('draft')).toBeInTheDocument();
    });

    it('should have responsive grid layout', () => {
        const { container } = render(
            <OverviewCards data={mockDashboardData} isLoading={false} />
        );

        const grid = container.querySelector('.grid');
        expect(grid).toHaveClass('md:grid-cols-2');
        expect(grid).toHaveClass('lg:grid-cols-3');
    });
});
