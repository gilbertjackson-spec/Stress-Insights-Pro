import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/utils';
import { Input } from '../input';

describe('Input Component', () => {
    it('should render input element', () => {
        render(<Input />);
        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
        render(<Input placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with value', () => {
        render(<Input value="Test value" onChange={() => { }} />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.value).toBe('Test value');
    });

    it('should handle onChange event', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<Input onChange={handleChange} />);
        const input = screen.getByRole('textbox');

        await user.type(input, 'Hello');

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange).toHaveBeenCalledTimes(5); // One for each character
    });

    it('should render disabled input', () => {
        render(<Input disabled />);
        const input = screen.getByRole('textbox');
        expect(input).toBeDisabled();
    });

    it('should render with different types', () => {
        const { rerender } = render(<Input type="email" />);
        let input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.type).toBe('email');

        rerender(<Input type="password" />);
        input = document.querySelector('input[type="password"]') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input.type).toBe('password');
    });

    it('should apply custom className', () => {
        render(<Input className="custom-class" />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('custom-class');
    });

    it('should render with required attribute', () => {
        render(<Input required />);
        const input = screen.getByRole('textbox');
        expect(input).toBeRequired();
    });

    it('should render with maxLength', () => {
        render(<Input maxLength={10} />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.maxLength).toBe(10);
    });

    it('should handle focus and blur', async () => {
        const handleFocus = vi.fn();
        const handleBlur = vi.fn();
        const user = userEvent.setup();

        render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
        const input = screen.getByRole('textbox');

        await user.click(input);
        expect(handleFocus).toHaveBeenCalledTimes(1);

        await user.tab();
        expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should render readonly input', () => {
        render(<Input readOnly value="Readonly" />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input).toHaveAttribute('readonly');
        expect(input.value).toBe('Readonly');
    });

    it('should handle special characters', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<Input onChange={handleChange} />);
        const input = screen.getByRole('textbox');

        await user.type(input, '!@#$%');

        expect(handleChange).toHaveBeenCalled();
    });
});
