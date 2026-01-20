import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import DomainScoreGauge from '../domain-score-gauge';

describe('DomainScoreGauge Component', () => {
    const defaultProps = {
        score: 3.5,
        p25: 2.8,
        p75: 3.8,
        benchmark: 3.6,
    };

    it('should render the score formatted to two decimal places', () => {
        render(<DomainScoreGauge {...defaultProps} score={4.12345} />);
        expect(screen.getByText('4.12')).toBeInTheDocument();
    });

    it('should display the main score with a green color for high scores', () => {
        render(<DomainScoreGauge {...defaultProps} score={4.0} />);
        const scoreElement = screen.getByText('4.00');
        expect(scoreElement).toHaveClass('text-green-500');
    });

    it('should display the main score with a yellow color for medium scores', () => {
        render(<DomainScoreGauge {...defaultProps} score={3.5} />);
        const scoreElement = screen.getByText('3.50');
        expect(scoreElement).toHaveClass('text-yellow-500');
    });

    it('should display the main score with a red color for low scores', () => {
        render(<DomainScoreGauge {...defaultProps} score={2.5} />);
        const scoreElement = screen.getByText('2.50');
        expect(scoreElement).toHaveClass('text-red-500');
    });

    it('should render the benchmark label', () => {
        render(<DomainScoreGauge {...defaultProps} />);
        expect(screen.getByText('Benchmark')).toBeInTheDocument();
    });

    it('should render the percentile labels', () => {
        render(<DomainScoreGauge {...defaultProps} />);
        expect(screen.getByText('2.80 (p25)')).toBeInTheDocument();
        expect(screen.getByText('3.80 (p75)')).toBeInTheDocument();
    });
});
