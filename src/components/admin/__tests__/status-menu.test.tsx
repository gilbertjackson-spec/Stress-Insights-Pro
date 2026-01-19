import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent, waitFor } from '@/test/utils';
import StatusMenu from '../status-menu';
import { updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

describe('StatusMenu Component', () => {
    const deploymentId = 'deploy-123';

    beforeEach(() => {
        vi.clearAllMocks();
        (useFirestore as any).mockReturnValue({});
    });

    it('should render current status badge', () => {
        render(<StatusMenu deploymentId={deploymentId} currentStatus="active" />);

        expect(screen.getByText('Aberta')).toBeInTheDocument();
    });

    it('should render different badge for draft', () => {
        render(<StatusMenu deploymentId={deploymentId} currentStatus="draft" />);

        expect(screen.getByText('Rascunho')).toBeInTheDocument();
    });

    it('should open menu when badge is clicked', async () => {
        const user = userEvent.setup();
        render(<StatusMenu deploymentId={deploymentId} currentStatus="active" />);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        expect(await screen.findByRole('menuitem', { name: /rascunho/i })).toBeInTheDocument();
        expect(await screen.findByRole('menuitem', { name: /pausada/i })).toBeInTheDocument();
        expect(await screen.findByRole('menuitem', { name: /encerrada/i })).toBeInTheDocument();
        // Archived should not be in the menu
        expect(screen.queryByText('Arquivada')).not.toBeInTheDocument();
    });

    it('should call updateDoc when a new status is selected', async () => {
        const user = userEvent.setup();
        render(<StatusMenu deploymentId={deploymentId} currentStatus="draft" />);

        await user.click(screen.getByRole('button'));
        const activeOption = await screen.findByRole('menuitem', { name: /aberta/i });
        await user.click(activeOption);

        expect(updateDoc).toHaveBeenCalledWith(
            expect.any(Object),
            { status: 'active' }
        );
    });

    it('should disable current status in the menu', async () => {
        const user = userEvent.setup();
        render(<StatusMenu deploymentId={deploymentId} currentStatus="active" />);

        await user.click(screen.getByRole('button'));
        const activeOption = await screen.findByRole('menuitem', { name: /aberta/i });

        // The menu item itself should be disabled
        expect(activeOption).toHaveAttribute('data-disabled');
    });

    it('should be disabled when status is archived', () => {
        render(<StatusMenu deploymentId={deploymentId} currentStatus="archived" />);

        const trigger = screen.getByRole('button');
        expect(trigger).toBeDisabled();
    });
});
