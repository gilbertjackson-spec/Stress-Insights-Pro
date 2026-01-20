import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/utils';
import DomainAccordion from '../domain-accordion';
import type { DashboardData, DomainAnalysis } from '@/lib/types';

// Mock child components that are complex or already tested
vi.mock('../domain-details-card', () => ({
    default: ({ domain }: { domain: DomainAnalysis }) => (
        <div data-testid={`details-card-for-${domain.domain_id}`}>
            Details for {domain.domain_name}
        </div>
    ),
}));

const mockData: DashboardData = {
    deploymentName: 'Test Survey',
    total_respondents: 150,
    completion_rate: 75.5,
    surveyStatus: 'active',
    domain_analysis: [
        { domain_id: '1', domain_name: 'Demandas', domain_score: 2.5, percentile_25: 2.8, percentile_75: 4.0, questions_analysis: [], description: '', strong_point: null, weak_point: null, text_result_high: '', text_result_low: '', text_result_medium: '' },
        { domain_id: '2', domain_name: 'Controle', domain_score: 4.5, percentile_25: 2.8, percentile_75: 4.0, questions_analysis: [], description: '', strong_point: null, weak_point: null, text_result_high: '', text_result_low: '', text_result_medium: '' },
    ],
    overall_sentiment: { favorable_perc: 70, neutral_perc: 20, unfavorable_perc: 10 },
    demographic_options: { units: [], sectors: [], positions: [], age_ranges: [], genders: [], current_role_times: [] },
};

describe('DomainAccordion Component', () => {
    it('should render loading skeletons when isLoading is true', () => {
        const { container } = render(
            <DomainAccordion data={mockData} isLoading={true} />
        );

        const skeletons = container.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
        expect(screen.queryByText('Demandas')).not.toBeInTheDocument();
    });

    it('should render accordion items for each domain', () => {
        render(<DomainAccordion data={mockData} isLoading={false} />);

        expect(screen.getByText('Demandas')).toBeInTheDocument();
        expect(screen.getByText('Controle')).toBeInTheDocument();
    });

    it('should display the correct score for each domain', () => {
        render(<DomainAccordion data={mockData} isLoading={false} />);

        expect(screen.getByText('2.50')).toBeInTheDocument(); // Score for Demandas
        expect(screen.getByText('4.50')).toBeInTheDocument(); // Score for Controle
    });

    it('should expand accordion item on click to show details card', async () => {
        const user = userEvent.setup();
        render(<DomainAccordion data={mockData} isLoading={false} />);

        // Content should be hidden initially
        expect(screen.queryByTestId('details-card-for-1')).not.toBeInTheDocument();

        // Click the trigger for the first domain
        const trigger = screen.getByText('Demandas');
        await user.click(trigger);

        // Now the content should be visible
        const detailsCard = await screen.findByTestId('details-card-for-1');
        expect(detailsCard).toBeInTheDocument();
        expect(detailsCard).toHaveTextContent('Details for Demandas');
    });

    it('should only show one item content at a time', async () => {
        const user = userEvent.setup();
        render(<DomainAccordion data={mockData} isLoading={false} />);
        
        const trigger1 = screen.getByText('Demandas');
        const trigger2 = screen.getByText('Controle');

        // Open first item
        await user.click(trigger1);
        expect(await screen.findByTestId('details-card-for-1')).toBeInTheDocument();
        expect(screen.queryByTestId('details-card-for-2')).not.toBeInTheDocument();

        // Open second item, which should close the first
        await user.click(trigger2);
        expect(await screen.findByTestId('details-card-for-2')).toBeInTheDocument();
        expect(screen.queryByTestId('details-card-for-1')).not.toBeInTheDocument();
    });

    it('should apply correct color class based on score', () => {
        render(<DomainAccordion data={mockData} isLoading={false} />);

        const scoreDemandas = screen.getByText('2.50');
        const scoreControle = screen.getByText('4.50');

        // 2.5 is < p25 (2.8), should be destructive
        expect(scoreDemandas).toHaveClass('text-destructive');
        // 4.5 is > p75 (4.0), should be green
        expect(scoreControle).toHaveClass('text-green-500');
    });
});
