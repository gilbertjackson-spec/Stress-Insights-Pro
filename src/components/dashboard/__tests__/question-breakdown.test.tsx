import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import QuestionBreakdown from '../question-breakdown';
import type { QuestionAnalysis } from '@/lib/types';

// Mock the child component
vi.mock('../../charts/sentiment-bar-chart', () => ({
    default: (props: any) => (
        <div data-testid="sentiment-bar-mock">
            {props.favorable}% F / {props.neutral}% N / {props.unfavorable}% U
        </div>
    ),
}));

const mockAnalysis: QuestionAnalysis = {
    question_id: 'q1',
    question_code: 'Q-01',
    question_text: 'Is the work clear?',
    average_score: 3.75,
    sentiment_distribution: {
        favorable_perc: 60,
        neutral_perc: 30,
        unfavorable_perc: 10,
        favorable_count: 6,
        neutral_count: 3,
        unfavorable_count: 1,
    },
};

describe('QuestionBreakdown Component', () => {
    it('should render the question code and text', () => {
        render(<QuestionBreakdown questionAnalysis={mockAnalysis} />);
        expect(screen.getByText('Q-01')).toBeInTheDocument();
        expect(screen.getByText('Is the work clear?')).toBeInTheDocument();
    });

    it('should render the sentiment bar with correct props', () => {
        render(<QuestionBreakdown questionAnalysis={mockAnalysis} />);
        const sentimentBar = screen.getByTestId('sentiment-bar-mock');
        expect(sentimentBar).toBeInTheDocument();
        expect(sentimentBar).toHaveTextContent('60% F / 30% N / 10% U');
    });

    it('should display the average score formatted to two decimal places', () => {
        render(<QuestionBreakdown questionAnalysis={mockAnalysis} />);
        expect(screen.getByText('3.75')).toBeInTheDocument();
    });

    it('should apply correct color class based on score', () => {
        const { rerender } = render(<QuestionBreakdown questionAnalysis={mockAnalysis} />);
        // 3.75 is between 2.8 and 3.8 (default thresholds) -> yellow
        let scoreElement = screen.getByText('3.75');
        expect(scoreElement).toHaveClass('text-yellow-500');

        // Rerender with high score
        const highAnalysis = { ...mockAnalysis, average_score: 4.0 };
        rerender(<QuestionBreakdown questionAnalysis={highAnalysis} />);
        scoreElement = screen.getByText('4.00');
        expect(scoreElement).toHaveClass('text-green-500');
        
        // Rerender with low score
        const lowAnalysis = { ...mockAnalysis, average_score: 2.0 };
        rerender(<QuestionBreakdown questionAnalysis={lowAnalysis} />);
        scoreElement = screen.getByText('2.00');
        expect(scoreElement).toHaveClass('text-destructive');
    });
});
