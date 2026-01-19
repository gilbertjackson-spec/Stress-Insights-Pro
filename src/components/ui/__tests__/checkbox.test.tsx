import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/utils';
import { Checkbox } from '../checkbox';

describe('Checkbox Component', () => {
    it('should render checkbox', () => {
        render(<Checkbox />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
    });

    it('should be unchecked by default', () => {
        render(<Checkbox />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
    });

    it('should render checked when checked prop is true', () => {
        render(<Checkbox checked={true} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    it('should handle click event', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<Checkbox onCheckedChange={handleChange} />);
        const checkbox = screen.getByRole('checkbox');

        await user.click(checkbox);

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should toggle between checked and unchecked', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<Checkbox onCheckedChange={handleChange} />);
        const checkbox = screen.getByRole('checkbox');

        await user.click(checkbox);
        expect(handleChange).toHaveBeenCalledWith(true);

        await user.click(checkbox);
        expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('should render disabled checkbox', () => {
        render(<Checkbox disabled />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeDisabled();
    });

    it('should not trigger onChange when disabled', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<Checkbox disabled onCheckedChange={handleChange} />);
        const checkbox = screen.getByRole('checkbox');

        await user.click(checkbox);

        expect(handleChange).not.toHaveBeenCalled();
    });

    it('should apply custom className', () => {
        const { container } = render(<Checkbox className="custom-class" />);
        const checkbox = container.querySelector('button');
        expect(checkbox).toHaveClass('custom-class');
    });

    it('should support indeterminate state', () => {
        render(<Checkbox checked="indeterminate" />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
    });

    it('should be keyboard accessible', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<Checkbox onCheckedChange={handleChange} />);
        const checkbox = screen.getByRole('checkbox');

        checkbox.focus();
        expect(checkbox).toHaveFocus();

        await user.keyboard(' '); // Space key

        expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should have correct aria attributes', () => {
        render(<Checkbox aria-label="Accept terms" />);
        const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
        expect(checkbox).toBeInTheDocument();
    });

    it('should work with form labels', async () => {
        const user = userEvent.setup();

        render(
            <div>
                <label htmlFor="terms">
                    Accept terms
                    <Checkbox id="terms" />
                </label>
            </div>
        );

        const label = screen.getByText('Accept terms');
        const checkbox = screen.getByRole('checkbox');

        await user.click(label);

        // Checkbox should be focused or checked
        expect(checkbox).toHaveFocus();
    });
});
