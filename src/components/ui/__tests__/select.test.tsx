import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/utils';
import {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
} from '../select';

describe('Select Component', () => {
    it('should render select trigger with placeholder', () => {
        render(
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                </SelectContent>
            </Select>
        );

        expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should open select content when clicked', async () => {
        const user = userEvent.setup();
        render(
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
            </Select>
        );

        const trigger = screen.getByRole('combobox');
        await user.click(trigger);

        expect(await screen.findByText('Option 1')).toBeInTheDocument();
        expect(await screen.findByText('Option 2')).toBeInTheDocument();
    });

    it('should select an option when clicked', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <Select onValueChange={onValueChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
            </Select>
        );

        await user.click(screen.getByRole('combobox'));
        await user.click(await screen.findByText('Option 1'));

        expect(onValueChange).toHaveBeenCalledWith('option1');
        // After selection, the trigger should show the selected option
        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
        render(
            <Select disabled>
                <SelectTrigger>
                    <SelectValue placeholder="Disabled Select" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                </SelectContent>
            </Select>
        );

        const trigger = screen.getByRole('combobox');
        expect(trigger).toBeDisabled();
    });

    it('should render groups and labels', async () => {
        const user = userEvent.setup();
        render(
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Group 1</SelectLabel>
                        <SelectItem value="1">Item 1</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                        <SelectLabel>Group 2</SelectLabel>
                        <SelectItem value="2">Item 2</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        );

        await user.click(screen.getByRole('combobox'));

        expect(await screen.findByText('Group 1')).toBeInTheDocument();
        expect(await screen.findByText('Item 1')).toBeInTheDocument();
        expect(await screen.findByText('Group 2')).toBeInTheDocument();
        expect(await screen.findByText('Item 2')).toBeInTheDocument();
    });

    it('should support default value', () => {
        render(
            <Select defaultValue="option2">
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
            </Select>
        );

        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
});
