import { describe, it, expect } from 'vitest';
import { render, screen, userEvent } from '@/test/utils';
import SentimentBarChart from '../sentiment-bar-chart';

describe('SentimentBarChart Component', () => {
    it('should render three segments with correct widths', () => {
        const { container } = render(
            <SentimentBarChart unfavorable={10} neutral={20} favorable={70} />
        );

        const segments = container.firstChild?.childNodes;
        expect(segments).toHaveLength(3);

        const unfavorableSegment = segments?.[0] as HTMLElement;
        const neutralSegment = segments?.[1] as HTMLElement;
        const favorableSegment = segments?.[2] as HTMLElement;

        expect(unfavorableSegment.style.width).toBe('10%');
        expect(unfavorableSegment).toHaveClass('bg-red-400');

        expect(neutralSegment.style.width).toBe('20%');
        expect(neutralSegment).toHaveClass('bg-yellow-400');

        expect(favorableSegment.style.width).toBe('70%');
        expect(favorableSegment).toHaveClass('bg-green-400');
    });

    it('should handle zero total and render an empty state', () => {
        const { container } = render(
            <SentimentBarChart unfavorable={0} neutral={0} favorable={0} />
        );
        const bar = container.firstChild as HTMLElement;
        expect(bar).toHaveClass('bg-muted');
        expect(bar.childNodes.length).toBe(0);
    });

    it('should display tooltip on hover', async () => {
        const user = userEvent.setup();
        const { container } = render(
            <SentimentBarChart unfavorable={10} neutral={20} favorable={70} />
        );
        
        const favorableSegment = container.firstChild?.childNodes[2] as HTMLElement;
        await user.hover(favorableSegment);
        
        expect(await screen.findByRole('tooltip')).toBeInTheDocument();
        expect(await screen.findByText('Favorável: 70.0%')).toBeInTheDocument();
    });

    it('should handle cases where one or two sentiments are zero', () => {
        const { container } = render(
            <SentimentBarChart unfavorable={100} neutral={0} favorable={0} />
        );
        const segments = container.firstChild?.childNodes;
        expect(segments).toHaveLength(3); // Renders all 3, but 2 have 0 width
        
        const unfavorableSegment = segments?.[0] as HTMLElement;
        expect(unfavorableSegment.style.width).toBe('100%');

        const neutralSegment = segments?.[1] as HTMLElement;
        expect(neutralSegment.style.width).toBe('0%');
        
        const favorableSegment = segments?.[2] as HTMLElement;
        expect(favorableSegment.style.width).toBe('0%');
    });
});
