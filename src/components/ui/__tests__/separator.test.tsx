import { describe, it, expect } from 'vitest';
import { render } from '@/test/utils';
import { Separator } from '../separator';

describe('Separator Component', () => {
    it('should render horizontal separator by default', () => {
        const { container } = render(<Separator />);
        const separator = container.firstChild as HTMLElement;

        expect(separator).toBeInTheDocument();
        expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('should render vertical separator', () => {
        const { container } = render(<Separator orientation="vertical" />);
        const separator = container.firstChild as HTMLElement;

        expect(separator).toHaveAttribute('data-orientation', 'vertical');
    });

    it('should apply decorative role by default', () => {
        const { container } = render(<Separator />);
        const separator = container.firstChild as HTMLElement;

        expect(separator).toHaveAttribute('role', 'none');
    });

    it('should apply custom className', () => {
        const { container } = render(<Separator className="custom-class" />);
        const separator = container.firstChild as HTMLElement;

        expect(separator).toHaveClass('custom-class');
    });

    it('should have correct base classes for horizontal', () => {
        const { container } = render(<Separator orientation="horizontal" />);
        const separator = container.firstChild as HTMLElement;

        expect(separator).toHaveClass('shrink-0');
        expect(separator).toHaveClass('bg-border');
    });

    it('should have correct classes for vertical', () => {
        const { container } = render(<Separator orientation="vertical" />);
        const separator = container.firstChild as HTMLElement;

        expect(separator).toHaveClass('shrink-0');
        expect(separator).toHaveClass('bg-border');
    });
});
