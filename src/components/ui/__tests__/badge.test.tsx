import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { Badge } from '../badge';

describe('Badge Component', () => {
    it('should render badge with text', () => {
        render(<Badge>New</Badge>);
        expect(screen.getByText('New')).toBeInTheDocument();
    });

    describe('Variants', () => {
        it('should render default variant', () => {
            const { container } = render(<Badge variant="default">Default</Badge>);
            const badge = container.firstChild as HTMLElement;
            expect(badge).toHaveClass('bg-primary');
        });

        it('should render secondary variant', () => {
            const { container } = render(<Badge variant="secondary">Secondary</Badge>);
            const badge = container.firstChild as HTMLElement;
            expect(badge).toHaveClass('bg-secondary');
        });

        it('should render destructive variant', () => {
            const { container } = render(<Badge variant="destructive">Destructive</Badge>);
            const badge = container.firstChild as HTMLElement;
            expect(badge).toHaveClass('bg-destructive');
        });

        it('should render outline variant', () => {
            const { container } = render(<Badge variant="outline">Outline</Badge>);
            const badge = container.firstChild as HTMLElement;
            expect(badge).toHaveClass('border');
        });
    });

    it('should apply custom className', () => {
        const { container } = render(<Badge className="custom-class">Badge</Badge>);
        const badge = container.firstChild as HTMLElement;
        expect(badge).toHaveClass('custom-class');
    });

    it('should render with children elements', () => {
        render(
            <Badge>
                <span>Icon</span>
                <span>Text</span>
            </Badge>
        );
        expect(screen.getByText('Icon')).toBeInTheDocument();
        expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('should have correct base classes', () => {
        const { container } = render(<Badge>Badge</Badge>);
        const badge = container.firstChild as HTMLElement;
        expect(badge).toHaveClass('inline-flex');
        expect(badge).toHaveClass('items-center');
        expect(badge).toHaveClass('rounded-full');
    });
});
