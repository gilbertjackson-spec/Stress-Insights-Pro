import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import ExecutiveSummary from '../executive-summary';
import type { DashboardData, DomainAnalysis } from '@/lib/types';

// Mock the radar chart to avoid complex SVG rendering in JSDOM
vi.mock('../../charts/domains-radar-chart', () => ({
    default: () => <div data-testid="radar-chart-mock" />,
}));

const mockDomainAnalysis: DomainAnalysis[] = [
    { domain_id: '1', domain_name: 'Demandas', domain_score: 2.5, benchmark_private_sector: 3, percentile_25: 2.8, percentile_75: 4.0, questions_analysis: [], description: '', strong_point: null, weak_point: null, text_result_high: '', text_result_low: '', text_result_medium: '' },
    { domain_id: '2', domain_name: 'Controle', domain_score: 4.5, benchmark_private_sector: 3, percentile_25: 2.8, percentile_75: 4.0, questions_analysis: [], description: '', strong_point: null, weak_point: null, text_result_high: '', text_result_low: '', text_result_medium: '' },
    { domain_id: '3', domain_name: 'Suporte da Gestão', domain_score: 4.8, benchmark_private_sector: 3, percentile_25: 2.8, percentile_75: 4.0, questions_analysis: [], description: '', strong_point: null, weak_point: null, text_result_high: '', text_result_low: '', text_result_medium: '' },
    { domain_id: '4', domain_name: 'Relacionamentos', domain_score: 2.1, benchmark_private_sector: 3, percentile_25: 2.8, percentile_75: 4.0, questions_analysis: [], description: '', strong_point: null, weak_point: null, text_result_high: '', text_result_low: '', text_result_medium: '' },
    { domain_id: '5', domain_name: 'Papéis', domain_score: 3.5, benchmark_private_sector: 3, percentile_25: 2.8, percentile_75: 4.0, questions_analysis: [], description: '', strong_point: null, weak_point: null, text_result_high: '', text_result_low: '', text_result_medium: '' },
];

const mockDashboardData: DashboardData = {
    deploymentName: 'Test Survey',
    total_respondents: 150,
    completion_rate: 75.5,
    surveyStatus: 'active',
    domain_analysis: mockDomainAnalysis,
    overall_sentiment: { favorable_perc: 70, neutral_perc: 20, unfavorable_perc: 10 },
    demographic_options: { units: [], sectors: [], positions: [], age_ranges: [], genders: [], current_role_times: [] },
};

describe('ExecutiveSummary Component', () => {
    it('should render loading skeletons when isLoading is true', () => {
        const { container } = render(
            <ExecutiveSummary data={mockDashboardData} isLoading={true} />
        );

        const skeletons = container.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
        expect(screen.queryByTestId('radar-chart-mock')).not.toBeInTheDocument();
    });

    it('should render the radar chart mock and highlights when not loading', () => {
        render(<ExecutiveSummary data={mockDashboardData} isLoading={false} />);
        
        expect(screen.getByTestId('radar-chart-mock')).toBeInTheDocument();
        expect(screen.getByText('Principais Forças')).toBeInTheDocument();
        expect(screen.getByText('Principais Áreas de Risco')).toBeInTheDocument();
    });

    it('should display the top 2 domains as strengths', () => {
        render(<ExecutiveSummary data={mockDashboardData} isLoading={false} />);

        // Top 2 scores are 4.8 (Suporte da Gestão) and 4.5 (Controle)
        const strengthsSection = screen.getByText('Principais Forças').closest('div');
        expect(strengthsSection).toHaveTextContent('Suporte da Gestão');
        expect(strengthsSection).toHaveTextContent('4.80');
        expect(strengthsSection).toHaveTextContent('Controle');
        expect(strengthsSection).toHaveTextContent('4.50');
    });

    it('should display the bottom 2 domains as risks', () => {
        render(<ExecutiveSummary data={mockDashboardData} isLoading={false} />);

        // Bottom 2 scores are 2.1 (Relacionamentos) and 2.5 (Demandas)
        const risksSection = screen.getByText('Principais Áreas de Risco').closest('div');
        expect(risksSection).toHaveTextContent('Relacionamentos');
        expect(risksSection).toHaveTextContent('2.10');
        expect(risksSection).toHaveTextContent('Demandas');
        expect(risksSection).toHaveTextContent('2.50');
    });

    it('should handle fewer than 4 domains gracefully', () => {
        const lessData = {
            ...mockDashboardData,
            domain_analysis: [
                { domain_id: '1', domain_name: 'Demandas', domain_score: 2.5, benchmark_private_sector: 3, percentile_25: 2.8, percentile_75: 4.0, questions_analysis: [], description: '', strong_point: null, weak_point: null, text_result_high: '', text_result_low: '', text_result_medium: '' },
                { domain_id: '2', domain_name: 'Controle', domain_score: 4.5, benchmark_private_sector: 3, percentile_25: 2.8, percentile_75: 4.0, questions_analysis: [], description: '', strong_point: null, weak_point: null, text_result_high: '', text_result_low: '', text_result_medium: '' },
            ],
        };

        render(<ExecutiveSummary data={lessData} isLoading={false} />);

        const strengthsSection = screen.getByText('Principais Forças').closest('div');
        expect(strengthsSection).toHaveTextContent('Controle');
        expect(strengthsSection).toHaveTextContent('4.50');

        const risksSection = screen.getByText('Principais Áreas de Risco').closest('div');
        expect(risksSection).toHaveTextContent('Demandas');
        expect(risksSection).toHaveTextContent('2.50');
    });
});
