import { describe, it, expect } from 'vitest';
import { render } from '@/test/utils';
import { Skeleton } from '../skeleton';

describe('Skeleton Component', () => {
    it('should render skeleton element', () => {
        const { container } = render(<Skeleton />);
        const skeleton = container.firstChild as HTMLElement;

        expect(skeleton).toBeInTheDocument();
    });

    it('should have animate-pulse class', () => {
        const { container } = render(<Skeleton />);
        const skeleton = container.firstChild as HTMLElement;

        expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should have rounded background', () => {
        const { container } = render(<Skeleton />);
        const skeleton = container.firstChild as HTMLElement;

        expect(skeleton).toHaveClass('rounded-md');
        expect(skeleton).toHaveClass('bg-muted');
    });

    it('should apply custom className', () => {
        const { container } = render(<Skeleton className="custom-class" />);
        const skeleton = container.firstChild as HTMLElement;

        expect(skeleton).toHaveClass('custom-class');
        expect(skeleton).toHaveClass('animate-pulse'); // Should keep base classes
    });

    it('should render with custom height', () => {
        const { container } = render(<Skeleton className="h-20" />);
        const skeleton = container.firstChild as HTMLElement;

        expect(skeleton).toHaveClass('h-20');
    });

    it('should render with custom width', () => {
        const { container } = render(<Skeleton className="w-full" />);
        const skeleton = container.firstChild as HTMLElement;

        expect(skeleton).toHaveClass('w-full');
    });

    it('should render multiple skeletons', () => {
        const { container } = render(
            <div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        );

        const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
        expect(skeletons).toHaveLength(3);
    });

    it('should render circular skeleton', () => {
        const { container } = render(<Skeleton className="h-12 w-12 rounded-full" />);
        const skeleton = container.firstChild as HTMLElement;

        expect(skeleton).toHaveClass('rounded-full');
    });
});
