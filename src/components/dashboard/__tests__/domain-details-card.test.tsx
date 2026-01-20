import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import DomainDetailsCard from '../domain-details-card';
import type { DomainAnalysis } from '@/lib/types';

// Mock child components
vi.mock('../../charts/domain-score-gauge', () => ({
    default: ({ score }: { score: number }) => <div data-testid="gauge-mock">Score: {score}</div>,
}));

vi.mock('../question-breakdown', () => ({
    default: ({ questionAnalysis }: { questionAnalysis: any }) => (
        <div data-testid={`question-breakdown-${questionAnalysis.question_id}`}>
            {questionAnalysis.question_text}
        </div>
    ),
}));

const mockDomain: DomainAnalysis = {
    domain_id: '1',
    domain_name: 'Demandas',
    domain_score: 2.5,
    percentile_25: 2.8,
    percentile_75: 4.0,
    benchmark_private_sector: 3.2,
    description: 'This domain measures demands.',
    text_result_low: 'Low score text.',
    text_result_medium: 'Medium score text.',
    text_result_high: 'High score text.',
    strong_point: null,
    weak_point: null,
    questions_analysis: [
        { question_id: 'q1', question_code: 'Q1', question_text: 'Question 1', average_score: 2.0, sentiment_distribution: { favorable_perc: 10, neutral_perc: 20, unfavorable_perc: 70, favorable_count: 1, neutral_count: 2, unfavorable_count: 7 } },
        { question_id: 'q2', question_code: 'Q2', question_text: 'Question 2', average_score: 3.0, sentiment_distribution: { favorable_perc: 20, neutral_perc: 60, unfavorable_perc: 20, favorable_count: 2, neutral_count: 6, unfavorable_count: 2 } },
    ],
};

describe('DomainDetailsCard Component', () => {
    it('should render the DomainScoreGauge with the correct score', () => {
        render(<DomainDetailsCard domain={mockDomain} />);
        const gauge = screen.getByTestId('gauge-mock');
        expect(gauge).toBeInTheDocument();
        expect(gauge).toHaveTextContent('Score: 2.5');
    });

    it('should render the domain description', () => {
        render(<DomainDetailsCard domain={mockDomain} />);
        expect(screen.getByText('This domain measures demands.')).toBeInTheDocument();
    });

    it('should render the correct diagnostic text for a low score', () => {
        render(<DomainDetailsCard domain={mockDomain} />);
        expect(screen.getByText('Low score text.')).toBeInTheDocument();
        expect(screen.queryByText('Medium score text.')).not.toBeInTheDocument();
    });

    it('should render the correct diagnostic text for a medium score', () => {
        const mediumScoreDomain = { ...mockDomain, domain_score: 3.5 };
        render(<DomainDetailsCard domain={mediumScoreDomain} />);
        expect(screen.getByText('Medium score text.')).toBeInTheDocument();
    });

    it('should render the correct diagnostic text for a high score', () => {
        const highScoreDomain = { ...mockDomain, domain_score: 4.5 };
        render(<DomainDetailsCard domain={highScoreDomain} />);
        expect(screen.getByText('High score text.')).toBeInTheDocument();
    });

    it('should render a QuestionBreakdown component for each question', () => {
        render(<DomainDetailsCard domain={mockDomain} />);
        expect(screen.getByTestId('question-breakdown-q1')).toBeInTheDocument();
        expect(screen.getByTestId('question-breakdown-q2')).toBeInTheDocument();
        expect(screen.getByTestId('question-breakdown-q1')).toHaveTextContent('Question 1');
    });
});
