import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/utils';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '../dialog';
import { Button } from '../button';

describe('Dialog Components', () => {
    describe('Dialog', () => {
        it('should not render content by default', () => {
            render(
                <Dialog>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Dialog Title</DialogTitle>
                            <DialogDescription>Dialog Description</DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            );

            expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
        });

        it('should open dialog when trigger is clicked', async () => {
            const user = userEvent.setup();

            render(
                <Dialog>
                    <DialogTrigger>Open Dialog</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Dialog Title</DialogTitle>
                            <DialogDescription>Dialog Description</DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            );

            const trigger = screen.getByText('Open Dialog');
            await user.click(trigger);

            expect(screen.getByText('Dialog Title')).toBeInTheDocument();
            expect(screen.getByText('Dialog Description')).toBeInTheDocument();
        });

        it('should close dialog when close button is clicked', async () => {
            const user = userEvent.setup();

            render(
                <Dialog>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Title</DialogTitle>
                            <DialogDescription>A simple dialog description.</DialogDescription>
                        </DialogHeader>
                        <DialogClose asChild>
                            <Button>Fechar</Button>
                        </DialogClose>
                    </DialogContent>
                </Dialog>
            );

            await user.click(screen.getByText('Open'));
            expect(screen.getByText('Title')).toBeInTheDocument();

            await user.click(screen.getByText('Fechar'));
            expect(screen.queryByText('Title')).not.toBeInTheDocument();
        });

        it('should support controlled state', async () => {
            const handleOpenChange = vi.fn();
            const user = userEvent.setup();

            const { rerender } = render(
                <Dialog open={false} onOpenChange={handleOpenChange}>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Title</DialogTitle>
                            <DialogDescription>A simple dialog description.</DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            );

            expect(screen.queryByText('Title')).not.toBeInTheDocument();

            await user.click(screen.getByText('Open'));
            expect(handleOpenChange).toHaveBeenCalledWith(true);

            rerender(
                <Dialog open={true} onOpenChange={handleOpenChange}>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Title</DialogTitle>
                            <DialogDescription>A simple dialog description.</DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            );

            expect(screen.getByText('Title')).toBeInTheDocument();
        });
    });

    describe('DialogHeader', () => {
        it('should render header with title and description', async () => {
            const user = userEvent.setup();

            render(
                <Dialog>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Header Title</DialogTitle>
                            <DialogDescription>Header Description</DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            );

            await user.click(screen.getByText('Open'));

            expect(screen.getByText('Header Title')).toBeInTheDocument();
            expect(screen.getByText('Header Description')).toBeInTheDocument();
        });
    });

    describe('DialogFooter', () => {
        it('should render footer with actions', async () => {
            const user = userEvent.setup();

            render(
                <Dialog>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Title</DialogTitle>
                            <DialogDescription>A simple dialog description.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Confirm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );

            await user.click(screen.getByText('Open'));

            expect(screen.getByText('Cancel')).toBeInTheDocument();
            expect(screen.getByText('Confirm')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA attributes', async () => {
            const user = userEvent.setup();

            render(
                <Dialog>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Accessible Dialog</DialogTitle>
                            <DialogDescription>This dialog is accessible</DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            );

            await user.click(screen.getByText('Open'));

            const dialog = screen.getByRole('dialog');
            expect(dialog).toBeInTheDocument();
            expect(dialog).toHaveAttribute('aria-labelledby');
            expect(dialog).toHaveAttribute('aria-describedby');
        });

        it('should trap focus inside dialog', async () => {
            const user = userEvent.setup();

            render(
                <Dialog>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Title</DialogTitle>
                            <DialogDescription>A simple dialog description.</DialogDescription>
                        </DialogHeader>
                        <Button>First Button</Button>
                        <Button>Second Button</Button>
                    </DialogContent>
                </Dialog>
            );

            await user.click(screen.getByText('Open'));

            const firstButton = screen.getByText('First Button');
            const secondButton = screen.getByText('Second Button');

            firstButton.focus();
            expect(firstButton).toHaveFocus();

            await user.tab();
            expect(secondButton).toHaveFocus();
        });
    });
});
