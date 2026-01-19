import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/utils';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
} from '../dropdown-menu';
import { Button } from '../button';

describe('DropdownMenu Component', () => {
    it('should render trigger but not content by default', () => {
        render(
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>Open</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        expect(screen.getByText('Open')).toBeInTheDocument();
        expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });

    it('should open content when trigger is clicked', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>Open</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                    <DropdownMenuItem>Item 2</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        await user.click(screen.getByText('Open'));

        expect(await screen.findByText('Item 1')).toBeInTheDocument();
        expect(await screen.findByText('Item 2')).toBeInTheDocument();
    });

    it('should trigger onSelect when an item is clicked', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();

        render(
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>Open</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={onSelect}>Item 1</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        await user.click(screen.getByText('Open'));
        await user.click(await screen.findByText('Item 1'));

        expect(onSelect).toHaveBeenCalled();
    });

    it('should render labels, separators and shortcuts', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>Open</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Label 1</DropdownMenuLabel>
                    <DropdownMenuSeparator data-testid="separator" />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            Item 1
                            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        await user.click(screen.getByText('Open'));

        expect(await screen.findByText('Label 1')).toBeInTheDocument();
        expect(await screen.findByText('Item 1')).toBeInTheDocument();
        expect(await screen.findByText('⌘K')).toBeInTheDocument();
    });

    it('should disable items when disabled prop is true', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();

        render(
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>Open</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem disabled onSelect={onSelect}>Disabled Item</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        await user.click(screen.getByText('Open'));
        const item = await screen.findByText('Disabled Item');

        // Radix applies aria-disabled or data-disabled
        expect(item).toHaveAttribute('data-disabled');

        await user.click(item);
        expect(onSelect).not.toHaveBeenCalled();
    });
});
