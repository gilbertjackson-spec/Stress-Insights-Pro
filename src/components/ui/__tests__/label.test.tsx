import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/utils';
import { Label } from '../label';

describe('Label Component', () => {
    it('should render label with text', () => {
        render(<Label>Username</Label>);
        expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('should associate with input using htmlFor', () => {
        render(
            <div>
                <Label htmlFor="email">Email</Label>
                <input id="email" type="email" />
            </div>
        );

        const label = screen.getByText('Email');
        const input = screen.getByRole('textbox');

        expect(label).toHaveAttribute('for', 'email');
        expect(input).toHaveAttribute('id', 'email');
    });

    it('should apply custom className', () => {
        render(<Label className="custom-class">Label</Label>);
        const label = screen.getByText('Label');
        expect(label).toHaveClass('custom-class');
    });

    it('should render with children elements', () => {
        render(
            <Label>
                <span>Required</span>
                <span className="text-red-500">*</span>
            </Label>
        );

        expect(screen.getByText('Required')).toBeInTheDocument();
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should trigger input focus when clicked', async () => {
        const user = userEvent.setup();

        render(
            <div>
                <Label htmlFor="username">Username</Label>
                <input id="username" type="text" />
            </div>
        );

        const label = screen.getByText('Username');
        const input = screen.getByRole('textbox');

        await user.click(label);

        expect(input).toHaveFocus();
    });

    it('should have correct base classes', () => {
        render(<Label>Label</Label>);
        const label = screen.getByText('Label');
        expect(label).toHaveClass('text-sm');
        expect(label).toHaveClass('font-medium');
    });
});
