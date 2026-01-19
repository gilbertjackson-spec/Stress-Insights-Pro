import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { Button } from '../button';

describe('Button Component', () => {
    it('should render button with text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('should render button with variant primary', () => {
        render(<Button variant="default">Primary Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-primary');
    });

    it('should render button with variant destructive', () => {
        render(<Button variant="destructive">Delete</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-destructive');
    });

    it('should render button with variant outline', () => {
        render(<Button variant="outline">Outline</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('border-input');
    });

    it('should render button with variant ghost', () => {
        render(<Button variant="ghost">Ghost</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('hover:bg-accent');
    });

    it('should render disabled button', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should render button with different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        let button = screen.getByRole('button');
        expect(button).toHaveClass('h-9');

        rerender(<Button size="lg">Large</Button>);
        button = screen.getByRole('button');
        expect(button).toHaveClass('h-11');
    });

    it('should render as child when asChild is true', () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        );
        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/test');
    });
});
